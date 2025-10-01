import express from "express";
import { dbRun, dbGet, dbAll } from "../database/config.js";
import { authenticateToken, requirePermission, AuthRequest } from "../middleware/auth.js";

const router = express.Router();

// POST /api/admissions/applications/bulk/import
// Body: { rows: [ {ref_no?, first_name, last_name, dob, gender, mobile_number, email, nid_no, admission_type, program_code, campus_id, semester_id, previous_university, credits_earned } ], file_name?: string }
router.post('/applications/bulk/import', authenticateToken, requirePermission('applications:edit'), async (req: AuthRequest, res) => {
  try {
    const payload = req.body || {};
    const rows = Array.isArray(payload.rows) ? payload.rows : [];
    const idempotencyKey = req.headers['idempotency-key'] || payload.idempotency_key || null;

    // Check idempotency
    if (idempotencyKey) {
      const existing = await dbGet('SELECT import_job_id FROM import_jobs WHERE idempotency_key = ?', [String(idempotencyKey)]);
      if (existing) {
        return res.json({ success: true, import_job_id: existing.import_job_id, message: 'Import already processed for this idempotency key' });
      }
    }

    // Create import job
    const fileName = payload.file_name || null;
    const jobResult = await dbRun('INSERT INTO import_jobs (file_name, idempotency_key, status, total_rows, created_by_user_id) VALUES (?, ?, ?, ?, ?)', [fileName, idempotencyKey, 'Processing', rows.length, req.user?.id || null]);
    const importJobId = jobResult.lastID;

    let success = 0;
    let failed = 0;

    for (let i = 0; i < rows.length; i++) {
      const r = rows[i];
      const rowNumber = i + 1;

      try {
        // Basic validation
        if (!r.first_name || !r.last_name || !r.dob || !r.program_code || !r.semester_id) {
          throw new Error('MISSING_REQUIRED_FIELDS');
        }

        // Duplicate control: check nid/passport/birth_certificate + dob
        const nid = r.nid_no || null;
        const passport = r.passport_no || null;
        const birthCert = r.birth_certificate_no || null;

        if (nid || passport || birthCert) {
          const duplicates = await dbGet(`SELECT * FROM applications_v2 WHERE (nid_no = ? AND nid_no IS NOT NULL) OR (passport_no = ? AND passport_no IS NOT NULL) OR (birth_certificate_no = ? AND birth_certificate_no IS NOT NULL)`, [nid, passport, birthCert]);
          if (duplicates && duplicates.date_of_birth === r.dob) {
            throw new Error('DUPLICATE_IDENTIFIER');
          }
        }

        // Generate ref_no if missing
        const ref_no = r.ref_no || (`APP-${new Date().getFullYear().toString().slice(-2)}-${Math.floor(Math.random()*900000)+100000}`);

        await dbRun(`INSERT INTO applications_v2 (ref_no, first_name, middle_name, last_name, full_name, date_of_birth, gender, mobile_number, email, nid_no, passport_no, birth_certificate_no, permanent_address, present_address, admission_type, previous_university, credits_earned, program_code, campus_id, semester_id, status, payment_status, admission_test_required, admission_test_status, identifiers_locked, notes, created_by_user_id) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'PROVISIONAL', 'Unpaid', 0, 'Not Required', 0, ?, ? )`, [
          ref_no,
          r.first_name,
          r.middle_name || null,
          r.last_name,
          `${r.first_name} ${r.middle_name || ''} ${r.last_name}`.trim(),
          r.dob,
          r.gender || null,
          r.mobile_number || null,
          r.email || null,
          nid,
          passport,
          birthCert,
          JSON.stringify(r.permanent_address || {}),
          JSON.stringify(r.present_address || {}),
          r.admission_type || 'Regular',
          r.previous_university || null,
          r.credits_earned || null,
          r.program_code,
          r.campus_id || null,
          r.semester_id,
          r.notes || null,
          req.user?.id || null,
        ]);

        success++;
      } catch (err) {
        failed++;
        await dbRun('INSERT INTO import_job_errors (import_job_id, row_number, column_name, error_code, error_message, raw_row_json) VALUES (?, ?, ?, ?, ?, ?)', [importJobId, rowNumber, null, (err as any).message || 'ERROR', String(err), JSON.stringify(r)]);
      }
    }

    // Update job status
    await dbRun('UPDATE import_jobs SET status = ?, success_rows = ?, failed_rows = ? WHERE import_job_id = ?', ['Completed', success, failed, importJobId]);

    res.json({ success: true, import_job_id: importJobId, total: rows.length, success_rows: success, failed_rows: failed });
  } catch (error) {
    console.error('Bulk import error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// List import jobs (admin/officer)
router.get('/imports', authenticateToken, requirePermission('applications:edit'), async (req: AuthRequest, res) => {
  try {
    const { page = 1, limit = 20 } = req.query as any;
    const offset = (Number(page) - 1) * Number(limit);
    const rows = await dbAll('SELECT * FROM import_jobs ORDER BY created_at DESC LIMIT ? OFFSET ?', [Number(limit), Number(offset)]);
    const countRow = await dbGet('SELECT COUNT(*) as total FROM import_jobs');
    const total = countRow ? countRow.total || 0 : 0;
    res.json({ success: true, data: { jobs: rows, page: Number(page), limit: Number(limit), total } });
  } catch (error) {
    console.error('List import jobs error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get import job errors
router.get('/imports/:id/errors', authenticateToken, requirePermission('applications:edit'), async (req: AuthRequest, res) => {
  try {
    const { id } = req.params;
    const rows = await dbAll('SELECT * FROM import_job_errors WHERE import_job_id = ? ORDER BY error_id ASC', [id]);
    res.json({ success: true, data: rows });
  } catch (error) {
    console.error('Get import job errors:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

export default router;
