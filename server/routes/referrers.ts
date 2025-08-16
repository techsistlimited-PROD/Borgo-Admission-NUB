import express from "express";
import { dbGet, dbAll, dbRun } from "../database/config.js";
import {
  authenticateToken,
  requireAdmin,
  AuthRequest,
} from "../middleware/auth.js";

const router = express.Router();

// Get all active referrers
router.get("/", async (req, res) => {
  try {
    const referrers = await dbAll(
      "SELECT * FROM employee_referrers WHERE is_active = 1 ORDER BY name",
    );

    res.json({
      success: true,
      data: referrers,
    });
  } catch (error) {
    console.error("Get referrers error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// Get referrer by employee ID
router.get("/:employee_id", async (req, res) => {
  try {
    const { employee_id } = req.params;
    const referrer = await dbGet(
      "SELECT * FROM employee_referrers WHERE employee_id = ? AND is_active = 1",
      [employee_id],
    );

    if (!referrer) {
      return res.status(404).json({ error: "Referrer not found" });
    }

    res.json({
      success: true,
      data: referrer,
    });
  } catch (error) {
    console.error("Get referrer error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// Validate referrer ID
router.post("/validate", async (req, res) => {
  try {
    const { employee_id } = req.body;

    if (!employee_id) {
      return res.status(400).json({ error: "Employee ID is required" });
    }

    const referrer = await dbGet(
      "SELECT employee_id, name, department, designation FROM employee_referrers WHERE employee_id = ? AND is_active = 1",
      [employee_id.toUpperCase()],
    );

    if (!referrer) {
      return res.status(404).json({
        success: false,
        error: "Invalid referrer ID or referrer is not active",
      });
    }

    res.json({
      success: true,
      valid: true,
      data: referrer,
    });
  } catch (error) {
    console.error("Validate referrer error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// Get referrer statistics (Admin only)
router.get(
  "/:employee_id/stats",
  authenticateToken,
  requireAdmin,
  async (req: AuthRequest, res) => {
    try {
      const { employee_id } = req.params;

      // Get referrer info
      const referrer = await dbGet(
        "SELECT * FROM employee_referrers WHERE employee_id = ?",
        [employee_id],
      );

      if (!referrer) {
        return res.status(404).json({ error: "Referrer not found" });
      }

      // Get referral statistics
      const totalReferrals = await dbGet(
        "SELECT COUNT(*) as count FROM applications WHERE referrer_id = ?",
        [employee_id],
      );

      const approvedReferrals = await dbGet(
        'SELECT COUNT(*) as count FROM applications WHERE referrer_id = ? AND status = "approved"',
        [employee_id],
      );

      const pendingReferrals = await dbGet(
        'SELECT COUNT(*) as count FROM applications WHERE referrer_id = ? AND status = "pending"',
        [employee_id],
      );

      const thisMonthReferrals = await dbGet(
        `
      SELECT COUNT(*) as count FROM applications 
      WHERE referrer_id = ? AND strftime('%Y-%m', created_at) = strftime('%Y-%m', 'now')
    `,
        [employee_id],
      );

      // Calculate total commission (based on approved referrals)
      const commissionData = await dbGet(
        `
      SELECT SUM(final_amount) as total_amount FROM applications 
      WHERE referrer_id = ? AND status = "approved"
    `,
        [employee_id],
      );

      const totalCommission =
        (commissionData.total_amount || 0) * referrer.commission_rate;

      res.json({
        success: true,
        data: {
          referrer_info: referrer,
          stats: {
            total_referrals: totalReferrals.count,
            approved_referrals: approvedReferrals.count,
            pending_referrals: pendingReferrals.count,
            this_month_referrals: thisMonthReferrals.count,
            total_commission: totalCommission,
            commission_rate: referrer.commission_rate,
          },
        },
      });
    } catch (error) {
      console.error("Get referrer stats error:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  },
);

// Admin routes for managing referrers
router.use(authenticateToken, requireAdmin);

// Create new referrer
router.post("/", async (req: AuthRequest, res) => {
  try {
    const { employee_id, name, department, designation, commission_rate } =
      req.body;

    if (!employee_id || !name || !department || !designation) {
      return res.status(400).json({ error: "All fields are required" });
    }

    await dbRun(
      `
      INSERT INTO employee_referrers (employee_id, name, department, designation, commission_rate)
      VALUES (?, ?, ?, ?, ?)
    `,
      [
        employee_id.toUpperCase(),
        name,
        department,
        designation,
        commission_rate || 0.05,
      ],
    );

    res.json({
      success: true,
      message: "Referrer created successfully",
    });
  } catch (error) {
    console.error("Create referrer error:", error);
    if (error.message.includes("UNIQUE constraint failed")) {
      res.status(400).json({ error: "Employee ID already exists" });
    } else {
      res.status(500).json({ error: "Internal server error" });
    }
  }
});

// Update referrer
router.put("/:id", async (req: AuthRequest, res) => {
  try {
    const { id } = req.params;
    const { name, department, designation, commission_rate, is_active } =
      req.body;

    await dbRun(
      `
      UPDATE employee_referrers 
      SET name = ?, department = ?, designation = ?, commission_rate = ?, is_active = ?
      WHERE id = ?
    `,
      [name, department, designation, commission_rate, is_active, id],
    );

    res.json({
      success: true,
      message: "Referrer updated successfully",
    });
  } catch (error) {
    console.error("Update referrer error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// Delete referrer (soft delete)
router.delete("/:id", async (req: AuthRequest, res) => {
  try {
    const { id } = req.params;

    await dbRun("UPDATE employee_referrers SET is_active = 0 WHERE id = ?", [
      id,
    ]);

    res.json({
      success: true,
      message: "Referrer deactivated successfully",
    });
  } catch (error) {
    console.error("Delete referrer error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// Get all referrers with pagination (Admin)
router.get("/admin/list", async (req: AuthRequest, res) => {
  try {
    const { page = 1, limit = 10, search } = req.query;

    let sql = "SELECT * FROM employee_referrers WHERE 1=1";
    const params: any[] = [];

    if (search) {
      sql += " AND (name LIKE ? OR employee_id LIKE ? OR department LIKE ?)";
      const searchParam = `%${search}%`;
      params.push(searchParam, searchParam, searchParam);
    }

    sql += " ORDER BY created_at DESC LIMIT ? OFFSET ?";
    const offset = (Number(page) - 1) * Number(limit);
    params.push(Number(limit), offset);

    const referrers = await dbAll(sql, params);

    // Get total count
    let countSql = "SELECT COUNT(*) as total FROM employee_referrers WHERE 1=1";
    const countParams: any[] = [];

    if (search) {
      countSql +=
        " AND (name LIKE ? OR employee_id LIKE ? OR department LIKE ?)";
      const searchParam = `%${search}%`;
      countParams.push(searchParam, searchParam, searchParam);
    }

    const countResult = await dbGet(countSql, countParams);
    const total = countResult.total;

    res.json({
      success: true,
      data: referrers,
      pagination: {
        page: Number(page),
        limit: Number(limit),
        total,
        totalPages: Math.ceil(total / Number(limit)),
      },
    });
  } catch (error) {
    console.error("Get referrers list error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

export default router;
