import express from "express";
import { dbAll, dbGet, dbRun } from "../database/config.js";
import { authenticateToken, requireAdmin, AuthRequest } from "../middleware/auth.js";

const router = express.Router();

function buildWhere(filters: any, allowed: string[]) {
  const clauses: string[] = [];
  const params: any[] = [];

  allowed.forEach((k) => {
    if (filters[k]) {
      clauses.push(`${k} = ?`);
      params.push(filters[k]);
    }
  });

  if (filters.search) {
    const s = `%${filters.search}%`;
    clauses.push("(to_address LIKE ? OR subject LIKE ? OR body LIKE ?)");
    params.push(s, s, s);
  }

  if (filters.dateFrom) {
    clauses.push("date(created_at) >= date(?)");
    params.push(filters.dateFrom);
  }
  if (filters.dateTo) {
    clauses.push("date(created_at) <= date(?)");
    params.push(filters.dateTo);
  }

  const where = clauses.length ? `WHERE ${clauses.join(" AND ")}` : "";
  return { where, params };
}

// GET /api/exports/mock-emails?format=csv&search=...
router.get("/mock-emails", authenticateToken, requireAdmin, async (req: AuthRequest, res) => {
  try {
    const filters = req.query as any;
    const { where, params } = buildWhere(filters, ["to_address", "application_id"]);

    const countRow = await dbGet(`SELECT COUNT(*) as total FROM mock_emails ${where}`, params);
    const total = countRow ? countRow.total || 0 : 0;

    const format = (filters.format || "csv").toLowerCase();

    if (total > 5000) {
      // Queue export for async processing
      await dbRun(`INSERT INTO audit_dashboard_export (user_id, params_json, export_format, row_count) VALUES (?, ?, ?, ?)`, [req.user?.id || null, JSON.stringify(req.query || {}), format, total]);
      return res.json({ success: true, async: true, message: "Export queued. You will be notified when ready." });
    }

    const rows = await dbAll(`SELECT id, to_address, subject, body, application_id, created_at, sent_at FROM mock_emails ${where} ORDER BY created_at DESC`, params);

    if (format === "csv") {
      res.setHeader('Content-Type', 'text/csv');
      res.setHeader('Content-Disposition', `attachment; filename="mock_emails_${Date.now()}.csv"`);

      const keys = ["id","to_address","subject","application_id","created_at","sent_at","body"];
      res.write(keys.join(',') + '\n');
      for (const r of rows) {
        const line = keys.map((k) => '"' + (r[k] == null ? '' : String(r[k]).replace(/"/g, '""')) + '"').join(',');
        res.write(line + '\n');
      }
      res.end();
      return;
    }

    res.json({ success: true, data: rows });
  } catch (err) {
    console.error("Mock emails export failed:", err);
    res.status(500).json({ success: false, error: "Export failed" });
  }
});

// GET /api/exports/sms-queue?format=csv&search=...
router.get("/sms-queue", authenticateToken, requireAdmin, async (req: AuthRequest, res) => {
  try {
    const filters = req.query as any;
    // allow filtering by to_number or status
    const clauses: string[] = [];
    const params: any[] = [];

    if (filters.to_number) { clauses.push('to_number = ?'); params.push(filters.to_number); }
    if (filters.status) { clauses.push('status = ?'); params.push(filters.status); }
    if (filters.search) { const s = `%${filters.search}%`; clauses.push('(to_number LIKE ? OR message LIKE ?)'); params.push(s, s); }
    if (filters.dateFrom) { clauses.push("date(created_at) >= date(?)"); params.push(filters.dateFrom); }
    if (filters.dateTo) { clauses.push("date(created_at) <= date(?)"); params.push(filters.dateTo); }

    const where = clauses.length ? `WHERE ${clauses.join(' AND ')}` : '';

    const countRow = await dbGet(`SELECT COUNT(*) as total FROM sms_queue ${where}`, params);
    const total = countRow ? countRow.total || 0 : 0;
    const format = (filters.format || 'csv').toLowerCase();

    if (total > 5000) {
      await dbRun(`INSERT INTO audit_dashboard_export (user_id, params_json, export_format, row_count) VALUES (?, ?, ?, ?)`, [req.user?.id || null, JSON.stringify(req.query || {}), format, total]);
      return res.json({ success: true, async: true, message: 'Export queued. You will be notified when ready.' });
    }

    const rows = await dbAll(`SELECT sms_id, to_number, message, provider, status, created_at, processed_at FROM sms_queue ${where} ORDER BY created_at DESC`, params);

    if (format === 'csv') {
      res.setHeader('Content-Type', 'text/csv');
      res.setHeader('Content-Disposition', `attachment; filename="sms_queue_${Date.now()}.csv"`);

      const keys = ['sms_id','to_number','message','provider','status','created_at','processed_at'];
      res.write(keys.join(',') + '\n');
      for (const r of rows) {
        const line = keys.map((k) => '"' + (r[k] == null ? '' : String(r[k]).replace(/"/g, '""')) + '"').join(',');
        res.write(line + '\n');
      }
      res.end();
      return;
    }

    res.json({ success: true, data: rows });
  } catch (err) {
    console.error('SMS queue export failed:', err);
    res.status(500).json({ success: false, error: 'Export failed' });
  }
});

export default router;
