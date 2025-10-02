import express from "express";
import { dbAll } from "../database/config.js";
import { authenticateToken, requireAdmin, AuthRequest } from "../middleware/auth.js";

const router = express.Router();

// GET /api/mock-emails - list mock emails (admin only)
router.get("/", authenticateToken, requireAdmin, async (req: AuthRequest, res) => {
  try {
    const rows = await dbAll(`SELECT * FROM mock_emails ORDER BY created_at DESC`);
    res.json({ success: true, data: rows });
  } catch (error) {
    console.error("Failed to fetch mock emails:", error);
    res.status(500).json({ success: false, error: "Internal server error" });
  }
});

export default router;
