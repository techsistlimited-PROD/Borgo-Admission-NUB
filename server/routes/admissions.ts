import express from "express";
import { dbAll, dbGet, dbRun } from "../database/config.js";
import { authenticateToken, requirePermission, AuthRequest } from "../middleware/auth.js";

const router = express.Router();

// Helper to check if a user has a specific permission (or 'all')
async function userHasPermission(userId: number | undefined, permissionKey: string) {
  if (!userId) return false;
  const row = await dbGet(
    `SELECT COUNT(*) as cnt FROM user_roles ur
     JOIN role_permissions rp ON rp.role_id = ur.role_id
     JOIN permissions p ON p.permission_id = rp.permission_id
     WHERE ur.user_id = ? AND (p.permission_key = ? OR p.permission_key = 'all')`,
    [userId, permissionKey],
  );
  return row && row.cnt > 0;
}

// List applications with filters (permission: applications:view)
router.get("/applications", authenticateToken, requirePermission("applications:view"), async (req: AuthRequest, res) => {
  try {
    const {
      status,
      search,
      page = 1,
      limit = 20,
      program_code,
      campus_id,
      semester_id,
      admission_type,
      admission_test_required,
      dateFrom,
      dateTo,
    } = req.query as any;

    const whereClauses: string[] = [];
    const params: any[] = [];

    if (status && status !== "all") {
      whereClauses.push("status = ?");
      params.push(status);
    }

    if (program_code) {
      whereClauses.push("program_code = ?");
      params.push(program_code);
    }

    if (campus_id) {
      whereClauses.push("campus_id = ?");
      params.push(Number(campus_id));
    }

    if (semester_id) {
      whereClauses.push("semester_id = ?");
      params.push(Number(semester_id));
    }

    if (admission_type) {
      whereClauses.push("admission_type = ?");
      params.push(admission_type);
    }

    if (admission_test_required) {
      whereClauses.push("admission_test_required = ?");
      params.push(admission_test_required === "true" ? 1 : 0);
    }

    if (dateFrom) {
      whereClauses.push("date(created_at) >= date(?)");
      params.push(dateFrom);
    }
    if (dateTo) {
      whereClauses.push("date(created_at) <= date(?)");
      params.push(dateTo);
    }

    let whereSql = whereClauses.length ? `WHERE ${whereClauses.join(" AND ")}` : "";

    // Build final query safely
    if (search) {
      const s = `%${search}%`;
      whereSql = whereSql ? `${whereSql} AND (ref_no LIKE ? OR full_name LIKE ? OR mobile_number LIKE ? OR email LIKE ? OR nid_no LIKE ?)` : `WHERE (ref_no LIKE ? OR full_name LIKE ? OR mobile_number LIKE ? OR email LIKE ? OR nid_no LIKE ?)`;
      params.push(s, s, s, s, s);
    }

    const offset = (Number(page) - 1) * Number(limit);

    const listSql = `SELECT * FROM applications_v2 ${whereSql} ORDER BY created_at DESC LIMIT ? OFFSET ?`;
    const rows = await dbAll(listSql, [...params, Number(limit), Number(offset)]);

    const countSql = `SELECT COUNT(*) as total FROM applications_v2 ${whereSql}`;
    const countRow = await dbGet(countSql, params);
    const total = countRow ? countRow.total || 0 : 0;

    res.json({ success: true, data: { applications: rows, page: Number(page), limit: Number(limit), total } });
  } catch (error) {
    console.error("List admissions error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// Get single application (permission: applications:view) - id can be application_id or ref_no
router.get("/applications/:id", authenticateToken, requirePermission("applications:view"), async (req: AuthRequest, res) => {
  try {
    const { id } = req.params;

    let app;
    if (/^\d+$/.test(id)) {
      app = await dbGet(`SELECT * FROM applications_v2 WHERE application_id = ?`, [id]);
    } else {
      app = await dbGet(`SELECT * FROM applications_v2 WHERE ref_no = ?`, [id]);
    }

    if (!app) return res.status(404).json({ error: 'Application not found' });

    // Load related records: documents, academic_history, waivers, tests, audit
    const docs = await dbAll(`SELECT * FROM documents WHERE application_id = ? ORDER BY uploaded_at DESC`, [app.application_id]);
    const history = await dbAll(`SELECT * FROM academic_history WHERE application_id = ? ORDER BY passing_year DESC`, [app.application_id]);
    const waivers = await dbAll(`SELECT * FROM waiver_assignments WHERE application_id = ? ORDER BY assigned_at DESC`, [app.application_id]);
    const tests = await dbAll(`SELECT * FROM admission_tests WHERE application_id = ?`, [app.application_id]);
    const audits = await dbAll(`SELECT * FROM audit_trail WHERE entity = 'applications_v2' AND entity_id = ? ORDER BY changed_at DESC`, [String(app.application_id)]);

    res.json({ success: true, data: { application: app, documents: docs, academic_history: history, waivers, admission_tests: tests, audit_trail: audits } });
  } catch (error) {
    console.error("Get admission error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// Patch application fields (permission: applications:edit)
router.patch("/applications/:id", authenticateToken, requirePermission("applications:edit"), async (req: AuthRequest, res) => {
  try {
    const { id } = req.params;
    const updates = req.body || {};

    const app = await dbGet(`SELECT * FROM applications_v2 WHERE application_id = ?`, [id]);
    if (!app) return res.status(404).json({ error: 'Application not found' });

    // Field-level guards: if identifiers_locked, prevent editing nid_no/passport unless admin or has override permission
    const piiFields = ['nid_no', 'passport_no', 'birth_certificate_no'];
    const tryingPiiChange = piiFields.some((f) => f in updates && updates[f] && updates[f] !== app[f]);

    if (app.identifiers_locked && tryingPiiChange) {
      const hasOverride = req.user?.type === 'admin' || (await userHasPermission(req.user?.id, 'applications:edit.pii_override'));
      if (!hasOverride) {
        return res.status(403).json({ error: 'PII_LOCKED', message: 'Identifiers are locked. Admin override or permission required.' });
      }
    }

    // Build update
    const allowed = ['first_name','middle_name','last_name','full_name','date_of_birth','gender','mobile_number','email','permanent_address','present_address','photo_url','father_name','father_phone','mother_name','mother_phone','guardian_name','guardian_phone','guardian_address','quota','religion','disability_status','blood_group','required_credits','grading_system','remarks','admission_type','previous_university','credits_earned','status','payment_status','admission_test_required','admission_test_status','notes','nid_no','passport_no','birth_certificate_no'];
    const fields = Object.keys(updates).filter(k => allowed.includes(k));
    if (fields.length === 0) return res.status(400).json({ error: 'NO_VALID_FIELDS' });

    const set = fields.map(f => `${f} = ?`).join(', ');
    const params = fields.map(f => updates[f]);

    // updated_by_user_id placement
    params.push(req.user?.id || null);
    params.push(id);

    await dbRun(`UPDATE applications_v2 SET ${set}, updated_at = CURRENT_TIMESTAMP, updated_by_user_id = ? WHERE application_id = ?`, params);

    // Audit trail for changed fields
    for (const f of fields) {
      const oldVal = app[f];
      const newVal = updates[f];
      if (String(oldVal) !== String(newVal)) {
        await dbRun(`INSERT INTO audit_trail (entity, entity_id, field_name, old_value, new_value, changed_by_user_id, reason) VALUES (?, ?, ?, ?, ?, ?, ?)`,
          ['applications_v2', String(id), f, oldVal == null ? null : String(oldVal), newVal == null ? null : String(newVal), req.user?.id || null, updates._reason || null]);
      }
    }

    res.json({ success: true, message: 'Application updated' });
  } catch (error) {
    console.error("Patch application error:", error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Approve application (permission: applications:approve)
router.post("/applications/:id/approve", authenticateToken, requirePermission("applications:approve"), async (req: AuthRequest, res) => {
  try {
    const { id } = req.params;
    const { override_missing_docs = false, reason = null } = req.body || {};

    const app = await dbGet(`SELECT * FROM applications_v2 WHERE application_id = ?`, [id]);
    if (!app) return res.status(404).json({ error: 'Application not found' });

    // Check mandatory docs (SSC,HSC,Photo)
    const mandatory = ['SSC','HSC','Photo'];
    const docs = await dbAll(`SELECT doc_type, status FROM documents WHERE application_id = ? AND doc_type IN ('SSC','HSC','Photo')`, [id]);
    const validatedTypes = docs.filter(d => d.status === 'Validated').map(d => d.doc_type);
    const missing = mandatory.filter(m => !validatedTypes.includes(m));

    if (missing.length > 0 && !override_missing_docs && req.user?.type !== 'admin') {
      return res.status(400).json({ error: 'MISSING_DOCUMENTS', missing });
    }

    // If flagged status, deny unless admin override
    if (app.status === 'FLAGGED' && req.user?.type !== 'admin') {
      return res.status(400).json({ error: 'FLAGGED_APPLICATION', message: 'Application flagged for fraud; requires admin clearance' });
    }

    // Generate university_id if not exists via id_generation table
    const year = new Date().getFullYear().toString().slice(-2);
    const programCode = app.program_code || 'GEN';
    const baseLike = `NU${year}${programCode}%`;
    const last = await dbGet(`SELECT university_id FROM id_generation WHERE university_id LIKE ? ORDER BY id DESC LIMIT 1`, [baseLike]);
    let sequential = 1;
    if (last && last.university_id) {
      const seqStr = last.university_id.slice(-3);
      const parsed = parseInt(seqStr, 10);
      if (!isNaN(parsed)) sequential = parsed + 1;
    }
    const university_id = `NU${year}${programCode}${sequential.toString().padStart(3,'0')}`;

    // Generate a UGC unique id (simple deterministic unique value)
    let ugc_id;
    const ugcBase = `UGC${new Date().getFullYear()}`;
    const lastUgc = await dbGet(`SELECT ugc_id FROM id_generation WHERE ugc_id LIKE ? ORDER BY id DESC LIMIT 1`, [`${ugcBase}%`]);
    if (lastUgc && lastUgc.ugc_id) {
      const seq = parseInt(lastUgc.ugc_id.replace(/\D/g, ''), 10) || Date.now();
      ugc_id = `${ugcBase}${(seq + 1).toString().slice(-6)}`;
    } else {
      ugc_id = `${ugcBase}${String(Date.now()).slice(-6)}`;
    }

    const batch = `${app.semester_id || 'NA'} ${new Date().getFullYear()}`;

    // Create student record
    const studentInsert = await dbRun(`INSERT INTO students (application_id, university_id, ugc_id, program_code, campus_id, semester_id, full_name, email, mobile_number, batch, created_by)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`, [id, university_id, ugc_id, app.program_code, app.campus_id || null, app.semester_id || null, app.full_name || `${app.first_name} ${app.last_name}`, app.email || null, app.mobile_number || null, batch, req.user?.name || 'system']);

    // Retrieve the inserted student_id (SQLite last_insert_rowid is available via dbGet)
    const studentRow = await dbGet(`SELECT student_id FROM students WHERE university_id = ?`, [university_id]);
    const student_id = studentRow ? studentRow.student_id : null;

    await dbRun(`INSERT INTO id_generation (application_id, university_id, ugc_id, batch, generated_by) VALUES (?, ?, ?, ?, ?)`, [id, university_id, ugc_id, batch, req.user?.name || 'system']);

    // Create initial admission bill using admission_settings.admission_fee
    const settings = await dbGet(`SELECT * FROM admission_settings WHERE id = 1`);
    const admissionFee = settings ? (settings.admission_fee || 0) : 0;

    if (student_id) {
      await dbRun(`INSERT INTO student_bills (student_id, application_id, description, amount, due_date, status, created_by_user_id) VALUES (?, ?, ?, ?, ?, ?, ?)`,
        [student_id, id, 'Admission Fee', admissionFee, null, (app.payment_status === 'Paid' ? 'Paid' : 'Unpaid'), req.user?.id || null]);
    }

    // Update application status and converted_student_id
    await dbRun(`UPDATE applications_v2 SET status = ?, payment_status = ?, converted_student_id = ?, updated_at = CURRENT_TIMESTAMP, updated_by_user_id = ? WHERE application_id = ?`, ['ADMITTED', app.payment_status === 'Paid' ? 'Paid' : app.payment_status, university_id, req.user?.id || null, id]);

    // Audit trail for approval
    await dbRun(`INSERT INTO audit_trail (entity, entity_id, field_name, old_value, new_value, changed_by_user_id, reason) VALUES (?, ?, ?, ?, ?, ?, ?)`,
      ['applications_v2', String(id), 'status', app.status, 'ADMITTED', req.user?.id || null, reason || 'Approved via UI']);

    // Store a mock welcome email (development-only). Actual email service integration should be configured separately.
    const welcomeSubject = `Welcome to Northern University Bangladesh - ${university_id}`;
    const welcomeBody = `Dear ${app.full_name || app.first_name},\n\nCongratulations! Your admission has been confirmed. Your University ID is ${university_id} and UGC ID is ${ugc_id}.\n\nRegards,\nAdmissions Office`;
    await dbRun(`INSERT INTO mock_emails (to_address, subject, body, application_id, created_at) VALUES (?, ?, ?, ?, datetime('now'))`, [app.email || null, welcomeSubject, welcomeBody, id]);

    res.json({ success: true, status: 'ADMITTED', university_id, ugc_id, student_id });
  } catch (error) {
    console.error("Approve application error:", error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// KPI endpoints
// Admin-only: refresh KPI cache for a semester (minimal implementation)
router.post('/kpi/refresh', authenticateToken, requirePermission('settings:manage'), async (req: AuthRequest, res) => {
  try {
    const { semester_id, campus_id, program_code } = req.body || {};

    if (!semester_id) {
      return res.status(400).json({ error: 'semester_id is required' });
    }

    // Compute total_applicants
    const totalRow = await dbGet(`SELECT COUNT(*) as cnt FROM applications_v2 WHERE semester_id = ?`, [semester_id]);
    const totalApplicants = totalRow ? totalRow.cnt || 0 : 0;

    // Compute pending_reviews similar to sample SQL: status='PROVISIONAL' and mandatory docs not validated
    const pendingRow = await dbGet(`
      SELECT COUNT(DISTINCT a.application_id) as cnt
      FROM applications_v2 a
      LEFT JOIN (
        SELECT application_id, bool_and(status = 'Validated') as all_mandatory_validated
        FROM documents
        WHERE doc_type IN ('SSC','HSC','Photo')
        GROUP BY application_id
      ) d ON d.application_id = a.application_id
      WHERE a.semester_id = ? AND a.status = 'PROVISIONAL' AND coalesce(d.all_mandatory_validated, 0) = 0
    `, [semester_id]);

    const pendingReviews = pendingRow ? pendingRow.cnt || 0 : 0;

    // Insert into admission_dashboard_cache for both metrics
    await dbRun(`INSERT INTO admission_dashboard_cache (semester_id, campus_id, program_id, metric_key, metric_value, date_from, date_to, generated_at, generated_by_user_id) VALUES (?, ?, ?, ?, ?, NULL, NULL, datetime('now'), ?)`,
      [semester_id, campus_id || null, program_code || null, 'total_applicants', totalApplicants, req.user?.id || null]);

    await dbRun(`INSERT INTO admission_dashboard_cache (semester_id, campus_id, program_id, metric_key, metric_value, date_from, date_to, generated_at, generated_by_user_id) VALUES (?, ?, ?, ?, ?, NULL, NULL, datetime('now'), ?)`,
      [semester_id, campus_id || null, program_code || null, 'pending_reviews', pendingReviews, req.user?.id || null]);

    res.json({ success: true, data: { totalApplicants, pendingReviews } });
  } catch (error) {
    console.error('KPI refresh error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Fetch latest cache for semester
router.get('/kpi/cache', authenticateToken, requirePermission('settings:manage'), async (req: AuthRequest, res) => {
  try {
    const { semester_id } = req.query as any;
    if (!semester_id) return res.status(400).json({ error: 'semester_id required' });

    const rows = await dbAll(`SELECT * FROM admission_dashboard_cache WHERE semester_id = ? ORDER BY generated_at DESC LIMIT 100`, [semester_id]);
    res.json({ success: true, data: rows });
  } catch (error) {
    console.error('KPI fetch error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});


// Export applications (sync for <=100k rows, otherwise enqueue)
router.get('/applications/export', authenticateToken, requirePermission('reports:export'), async (req: AuthRequest, res) => {
  try {
    const { format = 'csv' } = req.query as any;
    // Reuse same filtering as list
    const filters = req.query as any;
    const whereClauses: string[] = [];
    const params: any[] = [];

    if (filters.status && filters.status !== 'all') { whereClauses.push('status = ?'); params.push(filters.status); }
    if (filters.program_code) { whereClauses.push('program_code = ?'); params.push(filters.program_code); }
    if (filters.campus_id) { whereClauses.push('campus_id = ?'); params.push(Number(filters.campus_id)); }
    if (filters.semester_id) { whereClauses.push('semester_id = ?'); params.push(Number(filters.semester_id)); }
    if (filters.admission_type) { whereClauses.push('admission_type = ?'); params.push(filters.admission_type); }
    if (filters.dateFrom) { whereClauses.push("date(created_at) >= date(?)"); params.push(filters.dateFrom); }
    if (filters.dateTo) { whereClauses.push("date(created_at) <= date(?)"); params.push(filters.dateTo); }

    let whereSql = whereClauses.length ? `WHERE ${whereClauses.join(' AND ')}` : '';

    // Support simple search
    if (filters.search) {
      const s = `%${filters.search}%`;
      whereSql = whereSql ? `${whereSql} AND (ref_no LIKE ? OR full_name LIKE ? OR mobile_number LIKE ? OR email LIKE ? OR nid_no LIKE ?)` : `WHERE (ref_no LIKE ? OR full_name LIKE ? OR mobile_number LIKE ? OR email LIKE ? OR nid_no LIKE ?)`;
      params.push(s, s, s, s, s);
    }

    // Count rows
    const countRow = await dbGet(`SELECT COUNT(*) as total FROM applications_v2 ${whereSql}`, params);
    const total = countRow ? countRow.total || 0 : 0;

    if (total > 100000) {
      // Enqueue export (simplified: log to audit_dashboard_export)
      await dbRun(`INSERT INTO audit_dashboard_export (user_id, params_json, export_format, row_count) VALUES (?, ?, ?, ?)`, [req.user?.id || null, JSON.stringify(req.query || {}), String(format), total]);
      return res.json({ success: true, async: true, message: 'Export queued. You will be notified when ready.' });
    }

    // Fetch rows and stream CSV
    const rows = await dbAll(`SELECT application_id, ref_no, full_name, program_code, campus_id, semester_id, admission_type, admission_test_status, status, payment_status, created_at FROM applications_v2 ${whereSql} ORDER BY created_at DESC`, params);

    if (format === 'csv') {
      res.setHeader('Content-Type', 'text/csv');
      res.setHeader('Content-Disposition', `attachment; filename="admissions_export_${Date.now()}.csv"`);

      const keys = ['application_id','ref_no','full_name','program_code','campus_id','semester_id','admission_type','admission_test_status','status','payment_status','created_at'];
      res.write(keys.join(',') + '\n');
      for (const r of rows) {
        const line = keys.map((k) => '"' + (r[k] == null ? '' : String(r[k]).replace(/"/g, '""')) + '"').join(',');
        res.write(line + '\n');
      }
      res.end();
      return;
    }

    // Other formats: return JSON for now
    res.json({ success: true, data: rows });
  } catch (error) {
    console.error('Export error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Lock identifiers (permission: applications:lock_identifiers)
router.post("/applications/:id/identifiers/lock", authenticateToken, requirePermission("applications:lock_identifiers"), async (req: AuthRequest, res) => {
  try {
    const { id } = req.params;
    const { reason = null } = req.body || {};

    const app = await dbGet(`SELECT * FROM applications_v2 WHERE application_id = ?`, [id]);
    if (!app) return res.status(404).json({ error: 'Application not found' });

    if (app.identifiers_locked) return res.status(400).json({ error: 'ALREADY_LOCKED' });

    await dbRun(`UPDATE applications_v2 SET identifiers_locked = 1, updated_at = CURRENT_TIMESTAMP, updated_by_user_id = ? WHERE application_id = ?`, [req.user?.id || null, id]);

    await dbRun(`INSERT INTO audit_trail (entity, entity_id, field_name, old_value, new_value, changed_by_user_id, reason) VALUES (?, ?, ?, ?, ?, ?, ?)`,
      ['applications_v2', String(id), 'identifiers_locked', String(app.identifiers_locked || 0), '1', req.user?.id || null, reason || 'Lock identifiers']);

    res.json({ success: true, message: 'Identifiers locked' });
  } catch (error) {
    console.error('Lock identifiers error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Unlock identifiers (permission: applications:lock_identifiers)
router.post("/applications/:id/identifiers/unlock", authenticateToken, requirePermission("applications:lock_identifiers"), async (req: AuthRequest, res) => {
  try {
    const { id } = req.params;
    const { reason = null } = req.body || {};

    const app = await dbGet(`SELECT * FROM applications_v2 WHERE application_id = ?`, [id]);
    if (!app) return res.status(404).json({ error: 'Application not found' });

    if (!app.identifiers_locked) return res.status(400).json({ error: 'NOT_LOCKED' });

    await dbRun(`UPDATE applications_v2 SET identifiers_locked = 0, updated_at = CURRENT_TIMESTAMP, updated_by_user_id = ? WHERE application_id = ?`, [req.user?.id || null, id]);

    await dbRun(`INSERT INTO audit_trail (entity, entity_id, field_name, old_value, new_value, changed_by_user_id, reason) VALUES (?, ?, ?, ?, ?, ?, ?)`,
      ['applications_v2', String(id), 'identifiers_locked', String(app.identifiers_locked || 1), '0', req.user?.id || null, reason || 'Unlock identifiers']);

    res.json({ success: true, message: 'Identifiers unlocked' });
  } catch (error) {
    console.error('Unlock identifiers error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

export default router;
