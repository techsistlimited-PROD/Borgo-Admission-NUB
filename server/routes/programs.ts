import express from "express";
import { dbGet, dbAll, dbRun } from "../database/config.js";
import {
  authenticateToken,
  requireAdmin,
  AuthRequest,
} from "../middleware/auth.js";

const router = express.Router();

// Get all programs
router.get("/", async (req, res) => {
  try {
    const programs = await dbAll(
      "SELECT * FROM programs WHERE is_active = 1 ORDER BY name",
    );

    res.json({
      success: true,
      data: programs,
    });
  } catch (error) {
    console.error("Get programs error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// Get all departments
router.get("/departments", async (req, res) => {
  try {
    const departments = await dbAll(
      "SELECT * FROM departments WHERE is_active = 1 ORDER BY name",
    );

    res.json({
      success: true,
      data: departments,
    });
  } catch (error) {
    console.error("Get departments error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// Get departments by faculty
router.get("/departments/faculty/:faculty", async (req, res) => {
  try {
    const { faculty } = req.params;
    const departments = await dbAll(
      "SELECT * FROM departments WHERE faculty = ? AND is_active = 1 ORDER BY name",
      [faculty],
    );

    res.json({
      success: true,
      data: departments,
    });
  } catch (error) {
    console.error("Get departments by faculty error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// Get program details with cost calculation
router.get("/:code", async (req, res) => {
  try {
    const { code } = req.params;
    const program = await dbGet(
      "SELECT * FROM programs WHERE code = ? AND is_active = 1",
      [code],
    );

    if (!program) {
      return res.status(404).json({ error: "Program not found" });
    }

    res.json({
      success: true,
      data: program,
    });
  } catch (error) {
    console.error("Get program error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// Calculate cost with waivers
router.post("/calculate-cost", async (req, res) => {
  try {
    const { program_code, department_code, waivers = [] } = req.body;

    if (!program_code || !department_code) {
      return res
        .status(400)
        .json({ error: "Program and department codes are required" });
    }

    // Get program base cost
    const program = await dbGet(
      "SELECT base_cost FROM programs WHERE code = ?",
      [program_code],
    );
    if (!program) {
      return res.status(404).json({ error: "Program not found" });
    }

    const baseCost = program.base_cost;
    let totalWaiverPercentage = 0;
    let totalWaiverAmount = 0;

    // Calculate total waivers
    for (const waiver of waivers) {
      if (waiver.type === "percentage") {
        totalWaiverPercentage += waiver.value;
      } else if (waiver.type === "amount") {
        totalWaiverAmount += waiver.value;
      }
    }

    // Cap percentage waiver at 100%
    totalWaiverPercentage = Math.min(totalWaiverPercentage, 100);

    // Calculate final cost
    const percentageDiscount = (baseCost * totalWaiverPercentage) / 100;
    const finalCost = Math.max(
      0,
      baseCost - percentageDiscount - totalWaiverAmount,
    );

    res.json({
      success: true,
      data: {
        base_cost: baseCost,
        percentage_waiver: totalWaiverPercentage,
        amount_waiver: totalWaiverAmount,
        total_discount: percentageDiscount + totalWaiverAmount,
        final_cost: finalCost,
        savings: baseCost - finalCost,
      },
    });
  } catch (error) {
    console.error("Calculate cost error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// Admin routes for managing programs and departments
router.use(authenticateToken, requireAdmin);

// Create new program
router.post("/", async (req: AuthRequest, res) => {
  try {
    const { code, name, type, duration_years, total_credits, base_cost } =
      req.body;

    if (
      !code ||
      !name ||
      !type ||
      !duration_years ||
      !total_credits ||
      !base_cost
    ) {
      return res.status(400).json({ error: "All fields are required" });
    }

    await dbRun(
      `
      INSERT INTO programs (code, name, type, duration_years, total_credits, base_cost)
      VALUES (?, ?, ?, ?, ?, ?)
    `,
      [code, name, type, duration_years, total_credits, base_cost],
    );

    res.json({
      success: true,
      message: "Program created successfully",
    });
  } catch (error) {
    console.error("Create program error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// Update program
router.put("/:id", async (req: AuthRequest, res) => {
  try {
    const { id } = req.params;
    const { name, type, duration_years, total_credits, base_cost, is_active } =
      req.body;

    await dbRun(
      `
      UPDATE programs 
      SET name = ?, type = ?, duration_years = ?, total_credits = ?, base_cost = ?, is_active = ?
      WHERE id = ?
    `,
      [name, type, duration_years, total_credits, base_cost, is_active, id],
    );

    res.json({
      success: true,
      message: "Program updated successfully",
    });
  } catch (error) {
    console.error("Update program error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// Create new department
router.post("/departments", async (req: AuthRequest, res) => {
  try {
    const { code, name, faculty } = req.body;

    if (!code || !name || !faculty) {
      return res.status(400).json({ error: "All fields are required" });
    }

    await dbRun(
      `
      INSERT INTO departments (code, name, faculty)
      VALUES (?, ?, ?)
    `,
      [code, name, faculty],
    );

    res.json({
      success: true,
      message: "Department created successfully",
    });
  } catch (error) {
    console.error("Create department error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// Update department
router.put("/departments/:id", async (req: AuthRequest, res) => {
  try {
    const { id } = req.params;
    const { name, faculty, is_active } = req.body;

    await dbRun(
      `
      UPDATE departments 
      SET name = ?, faculty = ?, is_active = ?
      WHERE id = ?
    `,
      [name, faculty, is_active, id],
    );

    res.json({
      success: true,
      message: "Department updated successfully",
    });
  } catch (error) {
    console.error("Update department error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

export default router;
