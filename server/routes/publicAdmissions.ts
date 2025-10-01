import express from "express";
import { dbRun, dbGet, dbAll } from "../database/config.js";
import { v4 as uuidv4 } from "uuid";

const router = express.Router();

// Helper: generate ref_no APP-YY-XXXXXX
function generateRefNo() {
  const year = new Date().getFullYear().toString().slice(-2);
  const rand = Math.floor(Math.random() * 900000) + 100000; // 6 digits
  return `APP-${year}-${rand.toString().padStart(6, "0")}`;
}

function maskIdentifier(id: string | null) {
  if (!id) return null;
  const s = id.toString();
  if (s.length <= 4) return "****";
  return "****" + s.slice(-4);
}

// Create new public application
router.post("/", async (req, res) => {
  try {
    const body = req.body || {};

    const { program_code, campus_id, semester_id, admission_type } = body;
    const profile = body.profile || {};
    const identifiers = body.identifiers || {};
    const addresses = body.addresses || {};

    // Basic validation
    if (!program_code || !semester_id || !profile.first_name || !profile.last_name || !profile.dob) {
      return res.status(422).json({ error: "VALIDATION_ERROR", message: "Missing required fields" });
    }

    // Duplicate control: check nid/passport/birth_certificate + dob
    const nid = identifiers.nid_no || null;
    const passport = identifiers.passport_no || null;
    const birthCert = identifiers.birth_certificate_no || null;
    const dob = profile.dob;

    if (nid || passport || birthCert) {
      const duplicates = await dbAll(
        `SELECT * FROM applications_v2 WHERE (nid_no = ? AND nid_no IS NOT NULL) OR (passport_no = ? AND passport_no IS NOT NULL) OR (birth_certificate_no = ? AND birth_certificate_no IS NOT NULL)`,
        [nid, passport, birthCert],
      );

      // If any match and date_of_birth matches, treat as duplicate
      const found = duplicates.find((d: any) => d.date_of_birth === dob);
      if (found) {
        return res.status(409).json({ error: "DUPLICATE_IDENTIFIER", message: "Application with same identifier and DOB already exists" });
      }
    }

    const ref_no = generateRefNo();

    // Insert into applications_v2
    const insertSql = `
      INSERT INTO applications_v2 (
        ref_no, first_name, middle_name, last_name, full_name,
        date_of_birth, gender, mobile_number, email,
        nid_no, passport_no, birth_certificate_no,
        permanent_address, present_address, photo_url,
        admission_type, previous_university, credits_earned,
        program_code, campus_id, semester_id, referral_employee_id,
        temporary_user_id, status, payment_status, admission_test_required,
        admission_test_status, identifiers_locked, created_at, created_by_user_id, notes
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, datetime('now'), NULL, ?)
    `;

    const fullName = `${profile.first_name} ${profile.middle_name || ""} ${profile.last_name}`.trim();

    await dbRun(insertSql, [
      ref_no,
      profile.first_name,
      profile.middle_name || null,
      profile.last_name,
      fullName,
      profile.dob,
      profile.gender || null,
      profile.mobile_number || null,
      profile.email || null,
      nid,
      passport,
      birthCert,
      JSON.stringify(addresses.permanent || {}),
      JSON.stringify(addresses.present || {}),
      profile.photo_url || null,
      admission_type || 'Regular',
      body.previous_university || null,
      body.credits_earned || null,
      program_code,
      campus_id || null,
      semester_id,
      body.referral_employee_id || null,
      body.temporary_user_id || null,
      'PROVISIONAL',
      'Unpaid',
      body.admission_test_required ? 1 : 0,
      body.admission_test_status || 'Not Required',
      0,
      body.notes || null,
    ]);

    // Retrieve the created application_id
    const created = await dbGet(`SELECT * FROM applications_v2 WHERE ref_no = ?`, [ref_no]);

    res.status(201).json({ success: true, application_id: created.application_id, ref_no });
  } catch (error) {
    console.error("Create public application error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// Get public application by ref_no (masked PII)
router.get("/:ref_no", async (req, res) => {
  try {
    const { ref_no } = req.params;
    const app = await dbGet(`SELECT * FROM applications_v2 WHERE ref_no = ?`, [ref_no]);
    if (!app) return res.status(404).json({ error: "Not found" });

    // Mask PII
    const response = {
      application_id: app.application_id,
      ref_no: app.ref_no,
      full_name: app.full_name,
      program_code: app.program_code,
      campus_id: app.campus_id,
      semester_id: app.semester_id,
      status: app.status,
      payment_status: app.payment_status,
      admission_test_required: !!app.admission_test_required,
      admission_test_status: app.admission_test_status,
      created_at: app.created_at,
      applicant: {
        first_name: app.first_name,
        middle_name: app.middle_name,
        last_name: app.last_name,
        date_of_birth: app.date_of_birth,
        gender: app.gender,
        mobile_number: app.mobile_number ? (app.mobile_number.slice(0, 3) + '*****' + app.mobile_number.slice(-3)) : null,
        email: app.email ? (app.email.split('@')[0].slice(0,1) + '***@' + app.email.split('@')[1]) : null,
        nid_no: maskIdentifier(app.nid_no),
        passport_no: maskIdentifier(app.passport_no),
        birth_certificate_no: maskIdentifier(app.birth_certificate_no),
      },
    };

    res.json({ success: true, data: response });
  } catch (error) {
    console.error("Get public application error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// Upload document metadata for a public application (expects file_url from client)
router.post("/:ref_no/documents", async (req, res) => {
  try {
    const { ref_no } = req.params;
    const { doc_type, file_url, file_name, mime_type, file_size_bytes, uploaded_by } = req.body;

    if (!doc_type || !file_url || !file_name || !mime_type || !file_size_bytes) {
      return res.status(422).json({ error: "VALIDATION_ERROR", message: "Missing document fields" });
    }

    // Enforce allowed types and size
    const allowed = ["application/pdf", "image/jpeg", "image/png"];
    const maxBytes = 10 * 1024 * 1024; // 10MB
    if (!allowed.includes(mime_type)) {
      return res.status(422).json({ error: "INVALID_FILE_TYPE", message: "Unsupported file type" });
    }
    if (file_size_bytes > maxBytes) {
      return res.status(422).json({ error: "FILE_TOO_LARGE", message: "File exceeds 10MB limit" });
    }

    const app = await dbGet(`SELECT * FROM applications_v2 WHERE ref_no = ?`, [ref_no]);
    if (!app) return res.status(404).json({ error: "Application not found" });

    const result = await dbRun(
      `INSERT INTO documents (application_id, doc_type, file_url, file_name, mime_type, file_size_bytes, uploaded_by_user_id, uploaded_at, status, virus_scanned) VALUES (?, ?, ?, ?, ?, ?, ?, datetime('now'), 'Uploaded', 0)`,
      [app.application_id, doc_type, file_url, file_name, mime_type, file_size_bytes, uploaded_by || null],
    );

    // Fetch created document
    const doc = await dbGet(`SELECT * FROM documents WHERE document_id = ?`, [result.lastID]);

    res.status(201).json({ success: true, document_id: doc.document_id, status: doc.status });
  } catch (error) {
    console.error("Create document error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

export default router;
