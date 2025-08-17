import express from "express";
import { v4 as uuidv4 } from "uuid";
import { supabase, supabaseGet, supabaseAll, supabaseRun } from "../database/supabase.js";
import {
  authenticateToken,
  requireAdmin,
  requireApplicant,
  AuthRequest,
} from "../middleware/auth.js";

const router = express.Router();

// Get all applications (Admin only)
router.get(
  "/",
  authenticateToken,
  requireAdmin,
  async (req: AuthRequest, res) => {
    try {
      const { status, search, page = 1, limit = 10 } = req.query;

      let sql = `
      SELECT a.*, u.email as user_email 
      FROM applications a 
      LEFT JOIN users u ON a.user_id = u.id 
      WHERE 1=1
    `;
      const params: any[] = [];

      // Add filters
      if (status && status !== "all") {
        sql += " AND a.status = ?";
        params.push(status);
      }

      if (search) {
        sql += ` AND (a.first_name LIKE ? OR a.last_name LIKE ? OR a.tracking_id LIKE ? OR u.email LIKE ?)`;
        const searchParam = `%${search}%`;
        params.push(searchParam, searchParam, searchParam, searchParam);
      }

      // Add pagination
      sql += " ORDER BY a.created_at DESC LIMIT ? OFFSET ?";
      const offset = (Number(page) - 1) * Number(limit);
      params.push(Number(limit), offset);

      const applications = await dbAll(sql, params);

      // Get total count
      let countSql =
        "SELECT COUNT(*) as total FROM applications a LEFT JOIN users u ON a.user_id = u.id WHERE 1=1";
      const countParams: any[] = [];

      if (status && status !== "all") {
        countSql += " AND a.status = ?";
        countParams.push(status);
      }

      if (search) {
        countSql += ` AND (a.first_name LIKE ? OR a.last_name LIKE ? OR a.tracking_id LIKE ? OR u.email LIKE ?)`;
        const searchParam = `%${search}%`;
        countParams.push(searchParam, searchParam, searchParam, searchParam);
      }

      const countResult = await dbGet(countSql, countParams);
      const total = countResult.total;

      res.json({
        success: true,
        data: applications,
        pagination: {
          page: Number(page),
          limit: Number(limit),
          total,
          totalPages: Math.ceil(total / Number(limit)),
        },
      });
    } catch (error) {
      console.error("Get applications error:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  },
);

// Get single application by ID
router.get("/:id", authenticateToken, async (req: AuthRequest, res) => {
  try {
    const { id } = req.params;

    let sql = `
      SELECT a.*, u.email as user_email, u.name as user_name
      FROM applications a 
      LEFT JOIN users u ON a.user_id = u.id 
      WHERE a.id = ?
    `;
    const params = [id];

    // If user is applicant, only allow access to their own application
    if (req.user!.type === "applicant") {
      sql += " AND a.user_id = ?";
      params.push(req.user!.id);
    }

    const application = await dbGet(sql, params);

    if (!application) {
      return res.status(404).json({ error: "Application not found" });
    }

    // Get waivers for this application
    const waivers = await dbAll(
      "SELECT * FROM waivers WHERE application_id = ?",
      [application.id],
    );

    // Get ID generation info if exists
    const idGeneration = await dbGet(
      "SELECT * FROM id_generation WHERE application_id = ?",
      [application.id],
    );

    res.json({
      success: true,
      data: {
        ...application,
        waivers,
        id_generation: idGeneration,
      },
    });
  } catch (error) {
    console.error("Get application error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// Create new application
router.post("/", async (req, res) => {
  try {
    const applicationData = req.body;

    // Generate tracking ID
    const year = new Date().getFullYear().toString().slice(-2);
    const randomNum = Math.floor(Math.random() * 900000) + 100000;
    const tracking_id = `NU${year}${randomNum.toString().padStart(6, "0")}`;

    // Create application
    const applicationUuid = uuidv4();

    // For public applications, use NULL user_id (guest applications)
    // In a real implementation, you might want to create a guest user or require authentication
    const user_id = null;

    const applicationRecord = {
      uuid: applicationUuid,
      user_id: user_id,
      tracking_id: tracking_id,
      status: "pending",
      program: applicationData.program,
      department: applicationData.department,
      session: applicationData.session || "Spring 2024",
      campus: applicationData.campus || "main",
      first_name: applicationData.firstName,
      last_name: applicationData.lastName,
      email: applicationData.email,
      phone: applicationData.phone,
      date_of_birth: applicationData.dateOfBirth,
      gender: applicationData.gender,
      address: applicationData.address,
      city: applicationData.city,
      postal_code: applicationData.postalCode,
      country: applicationData.country || "Bangladesh",
      guardian_name: applicationData.guardianName,
      guardian_phone: applicationData.guardianPhone,
      guardian_relation: applicationData.guardianRelation,
      ssc_institution: applicationData.sscInstitution,
      ssc_year: applicationData.sscYear,
      ssc_gpa: applicationData.sscGPA,
      hsc_institution: applicationData.hscInstitution,
      hsc_year: applicationData.hscYear,
      hsc_gpa: applicationData.hscGPA,
      total_cost: applicationData.totalCost || 0,
      final_amount: applicationData.finalAmount || 0,
      referrer_id: applicationData.referrerId,
      referrer_name: applicationData.referrerName,
    };

    await supabaseRun("applications", "insert", applicationRecord);

    res.json({
      success: true,
      message: "Application submitted successfully",
      tracking_id,
    });
  } catch (error) {
    console.error("Create application error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// Update application status (Admin only)
router.patch(
  "/:id/status",
  authenticateToken,
  requireAdmin,
  async (req: AuthRequest, res) => {
    try {
      const { id } = req.params;
      const { status } = req.body;

      if (!["pending", "approved", "rejected"].includes(status)) {
        return res.status(400).json({ error: "Invalid status" });
      }

      const updateData: any[] = [status];
      let sql =
        "UPDATE applications SET status = ?, updated_at = CURRENT_TIMESTAMP";

      if (status === "approved") {
        sql += ", approval_date = CURRENT_TIMESTAMP";
      }

      sql += " WHERE id = ?";
      updateData.push(id);

      await dbRun(sql, updateData);

      res.json({
        success: true,
        message: `Application ${status} successfully`,
      });
    } catch (error) {
      console.error("Update application status error:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  },
);

// Generate University and UGC IDs (Admin only)
router.post(
  "/:id/generate-ids",
  authenticateToken,
  requireAdmin,
  async (req: AuthRequest, res) => {
    try {
      const { id } = req.params;

      // Get application details
      const application = await dbGet(
        "SELECT * FROM applications WHERE id = ?",
        [id],
      );
      if (!application) {
        return res.status(404).json({ error: "Application not found" });
      }

      if (application.status !== "approved") {
        return res
          .status(400)
          .json({ error: "Can only generate IDs for approved applications" });
      }

      // Check if IDs already generated
      const existingIds = await dbGet(
        "SELECT * FROM id_generation WHERE application_id = ?",
        [id],
      );
      if (existingIds) {
        return res
          .status(400)
          .json({ error: "IDs already generated for this application" });
      }

      // Generate University ID
      const year = new Date().getFullYear().toString().slice(-2);
      const programCode = application.program;
      const deptCode = application.department;

      // Get next sequential number for this program/department
      const lastId = await dbGet(
        `
      SELECT university_id FROM id_generation 
      WHERE university_id LIKE ? 
      ORDER BY id DESC LIMIT 1
    `,
        [`NU${year}${programCode}${deptCode}%`],
      );

      let sequential = 1;
      if (lastId) {
        const lastSeq = parseInt(lastId.university_id.slice(-3));
        sequential = lastSeq + 1;
      }

      const university_id = `NU${year}${programCode}${deptCode}${sequential.toString().padStart(3, "0")}`;

      // Generate UGC ID with check digit
      const ugcBase = `UGC-NU-${year}-${deptCode}-${sequential.toString().padStart(3, "0")}`;
      const checkDigit = generateCheckDigit(ugcBase);
      const ugc_id = `${ugcBase}-${checkDigit}`;

      // Generate batch info
      const batch = `${application.session} ${new Date().getFullYear()}`;

      // Store ID generation record
      await dbRun(
        `
      INSERT INTO id_generation (application_id, university_id, ugc_id, batch, generated_by)
      VALUES (?, ?, ?, ?, ?)
    `,
        [id, university_id, ugc_id, batch, req.user!.name],
      );

      res.json({
        success: true,
        data: {
          university_id,
          ugc_id,
          batch,
          generated_date: new Date().toISOString(),
        },
      });
    } catch (error) {
      console.error("Generate IDs error:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  },
);

// Helper function to generate check digit
function generateCheckDigit(baseString: string): number {
  const digits = baseString.replace(/\D/g, "");
  let sum = 0;

  for (let i = 0; i < digits.length; i++) {
    sum += parseInt(digits[i]) * (i + 1);
  }

  return sum % 10;
}

// Get dashboard stats (Admin only)
router.get(
  "/stats/dashboard",
  authenticateToken,
  requireAdmin,
  async (req: AuthRequest, res) => {
    try {
      const totalApplications = await dbGet(
        "SELECT COUNT(*) as count FROM applications",
      );
      const pendingApplications = await dbGet(
        'SELECT COUNT(*) as count FROM applications WHERE status = "pending"',
      );
      const todayApplications = await dbGet(
        'SELECT COUNT(*) as count FROM applications WHERE DATE(created_at) = DATE("now")',
      );
      const pendingPayments = await dbGet(
        'SELECT COUNT(*) as count FROM applications WHERE payment_status = "pending"',
      );

      res.json({
        success: true,
        data: {
          totalApplications: totalApplications.count,
          needReview: pendingApplications.count,
          todayApplicants: todayApplications.count,
          pendingPayments: pendingPayments.count,
        },
      });
    } catch (error) {
      console.error("Get dashboard stats error:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  },
);

export default router;
