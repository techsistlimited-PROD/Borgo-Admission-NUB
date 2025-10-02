import express from "express";
import { dbAll, dbRun, dbGet } from "../database/config.js";
import { authenticateToken, requireAdmin, AuthRequest } from "../middleware/auth.js";

const router = express.Router();

// List SMS queue (admin only)
router.get("/", authenticateToken, requireAdmin, async (req: AuthRequest, res) => {
  try {
    const rows = await dbAll(`SELECT * FROM sms_queue ORDER BY created_at DESC`);
    res.json({ success: true, data: rows });
  } catch (err) {
    console.error("Failed to list sms_queue:", err);
    res.status(500).json({ success: false, error: "Internal server error" });
  }
});

// Process one or all queued SMS (admin only). POST /process { all: boolean }
router.post("/process", authenticateToken, requireAdmin, async (req: AuthRequest, res) => {
  try {
    const { all = false } = req.body || {};

    if (all) {
      const queued = await dbAll(`SELECT * FROM sms_queue WHERE status = 'queued'`);
      const results: any[] = [];
      for (const s of queued) {
        // Mark as sent (mock)
        await dbRun(`UPDATE sms_queue SET status = 'sent', processed_at = datetime('now') WHERE sms_id = ?`, [s.sms_id]);
        results.push({ sms_id: s.sms_id, status: 'sent' });
      }
      return res.json({ success: true, data: results });
    }

    // Process one
    const next = await dbGet(`SELECT * FROM sms_queue WHERE status = 'queued' ORDER BY created_at ASC LIMIT 1`);
    if (!next) return res.json({ success: true, message: 'No queued SMS' });

    await dbRun(`UPDATE sms_queue SET status = 'sent', processed_at = datetime('now') WHERE sms_id = ?`, [next.sms_id]);
    res.json({ success: true, data: { sms_id: next.sms_id, status: 'sent' } });
  } catch (err) {
    console.error("Failed to process sms queue:", err);
    res.status(500).json({ success: false, error: "Internal server error" });
  }
});

export default router;
