import express from "express";
import PDFDocument from "pdfkit";
import { dbGet } from "../database/config.js";
import { authenticateToken, AuthRequest } from "../middleware/auth.js";

const router = express.Router();

// Generate Admit Card PDF for an application (public or authenticated)
router.get("/admit-card/:id", async (req: express.Request, res: express.Response) => {
  try {
    const { id } = req.params;

    // Try numeric id first, otherwise treat as ref_no
    let app;
    if (/^\d+$/.test(id)) {
      app = await dbGet(`SELECT * FROM applications_v2 WHERE application_id = ?`, [id]);
    } else {
      app = await dbGet(`SELECT * FROM applications_v2 WHERE ref_no = ?`, [id]);
    }

    if (!app) return res.status(404).json({ error: "Application not found" });

    // Basic admit card fields
    const fullName = app.full_name || `${app.first_name || ""} ${app.last_name || ""}`.trim();
    const refNo = app.ref_no || "";
    const program = app.program_code || app.program || "N/A";
    const universityId = app.university_id || app.converted_student_id || "";
    const examDate = app.admission_test_date || app.exam_date || "TBD";
    const venue = app.admission_test_venue || "To be announced";

    // Create PDF document
    const doc = new PDFDocument({ size: "A4", margin: 50 });

    res.setHeader("Content-Type", "application/pdf");
    res.setHeader(
      "Content-Disposition",
      `attachment; filename="AdmitCard_${refNo || id}.pdf"`,
    );

    doc.pipe(res);

    // Header
    doc.fontSize(16).font("Helvetica-Bold").text("Northern University Bangladesh", {
      align: "center",
    });
    doc.moveDown(0.2);
    doc.fontSize(12).font("Helvetica").text("Admission Test Admit Card", { align: "center" });
    doc.moveDown(1);

    // Applicant info box
    const startX = doc.x;
    const startY = doc.y;
    const boxWidth = 500;

    doc.rect(startX - 10, startY - 10, boxWidth, 160).stroke();

    doc.fontSize(11).font("Helvetica-Bold").text("Applicant Name:", startX, startY + 6);
    doc.font("Helvetica").text(fullName || "-", startX + 120, startY + 6);

    doc.moveDown(0.5);
    doc.font("Helvetica-Bold").text("Reference No:", { continued: true });
    doc.font("Helvetica").text(` ${refNo || "-"}`);

    doc.moveDown(0.2);
    doc.font("Helvetica-Bold").text("Program:", { continued: true });
    doc.font("Helvetica").text(` ${program}`);

    doc.moveDown(0.2);
    doc.font("Helvetica-Bold").text("University ID:", { continued: true });
    doc.font("Helvetica").text(` ${universityId || "-"}`);

    doc.moveDown(0.2);
    doc.font("Helvetica-Bold").text("Exam Date:", { continued: true });
    doc.font("Helvetica").text(` ${examDate}`);

    doc.moveDown(0.2);
    doc.font("Helvetica-Bold").text("Venue:", { continued: true });
    doc.font("Helvetica").text(` ${venue}`);

    // Instructions
    doc.moveDown(1);
    doc.fontSize(10).font("Helvetica-Bold").text("Instructions:");
    doc.fontSize(9).font("Helvetica");
    const instructions = [
      "Bring this admit card and a valid photo ID on the test day.",
      "Arrive at least 30 minutes before the scheduled time.",
      "Mobile phones and electronic devices are not allowed in the examination hall.",
      "Follow the invigilator's instructions at all times.",
    ];

    instructions.forEach((ins) => {
      doc.list([ins], { bulletRadius: 2 });
    });

    // Footer / Generated at
    doc.moveDown(2);
    doc.fontSize(8).fillColor("gray").text(`Generated: ${new Date().toLocaleString()}`);

    doc.end();
  } catch (err) {
    console.error("Admit card PDF error:", err);
    res.status(500).json({ error: "Failed to generate PDF" });
  }
});

export default router;
