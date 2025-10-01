import express from "express";
import { dbAll, dbGet, dbRun } from "../database/config.js";
import { authenticateToken, requireAdmin, requirePermission, AuthRequest } from "../middleware/auth.js";

const router = express.Router();

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

    if (search) {
      const s = `%${search}%`;
      const searchClause = "(ref_no LIKE ? OR full_name LIKE ? OR mobile_number LIKE ? OR email LIKE ? OR nid_no LIKE ?)";
      whereSql = whereSql ? `${whereSql} AND ${searchClause}` : `WHERE ${searchClause}`;
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

    // Field-level guards: if identifiers_locked, prevent editing nid_no/passport unless admin
    const piiFields = ['nid_no', 'passport_no', 'birth_certificate_no'];
    const tryingPiiChange = piiFields.some((f) => f in updates && updates[f] && updates[f] !== app[f]);

    if (app.identifiers_locked && tryingPiiChange && req.user?.type !== 'admin') {
      return res.status(403).json({ error: 'PII_LOCKED', message: 'Identifiers are locked. Admin override required.' });
    }

    // Build update
    const allowed = ['first_name','middle_name','last_name','full_name','date_of_birth','gender','mobile_number','email','permanent_address','present_address','photo_url','admission_type','previous_university','credits_earned','status','payment_status','admission_test_required','admission_test_status','notes'];
    const fields = Object.keys(updates).filter(k => allowed.includes(k));
    if (fields.length === 0) return res.status(400).json({ error: 'NO_VALID_FIELDS' });

    const set = fields.map(f => `${f} = ?`).join(', ');
    const params = fields.map(f => updates[f]);
    params.push(id);

    await dbRun(`UPDATE applications_v2 SET ${set}, updated_at = CURRENT_TIMESTAMP, updated_by_user_id = ? WHERE application_id = ?`, [...params.slice(0,-1), req.user?.id || null, id]);

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

    const batch = `${app.semester_id || 'NA'} ${new Date().getFullYear()}`;

    await dbRun(`INSERT INTO id_generation (application_id, university_id, batch, generated_by) VALUES (?, ?, ?, ?)`, [id, university_id, batch, req.user?.name || 'system']);

    // Update application status
    await dbRun(`UPDATE applications_v2 SET status = ?, payment_status = ?, converted_student_id = ?, updated_at = CURRENT_TIMESTAMP, updated_by_user_id = ? WHERE application_id = ?`, ['ADMITTED', app.payment_status === 'Paid' ? 'Paid' : app.payment_status, null, req.user?.id || null, id]);

    // Create initial student_payables and trigger events would happen in other services; log audit
    await dbRun(`INSERT INTO audit_trail (entity, entity_id, field_name, old_value, new_value, changed_by_user_id, reason) VALUES (?, ?, ?, ?, ?, ?, ?)`,
      ['applications_v2', String(id), 'status', app.status, 'ADMITTED', req.user?.id || null, reason || 'Approved via UI']);

    res.json({ success: true, status: 'ADMITTED', university_id, student_id: null });
  } catch (error) {
    console.error("Approve application error:", error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

export default router;
