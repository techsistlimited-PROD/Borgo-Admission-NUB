import express from "express";
import bcrypt from "bcryptjs";
import { v4 as uuidv4 } from "uuid";
import { dbGet, dbRun } from "../database/config.js";
import {
  generateToken,
  authenticateToken,
  AuthRequest,
} from "../middleware/auth.js";

const router = express.Router();

// Login endpoint
router.post("/login", async (req, res) => {
  try {
    const { identifier, password, type } = req.body;
    console.log(`🔐 Login attempt for ${type}: ${identifier}`);

    if (!identifier || !password || !type) {
      console.log("❌ Missing required fields");
      return res.status(400).json({ error: "All fields are required" });
    }

    // Find user by email or university_id based on type
    let user;
    if (type === "admin") {
      console.log("🔍 Looking for admin user...");
      user = await dbGet(
        "SELECT * FROM users WHERE email = ? AND type = ? AND is_active = 1",
        [identifier, type],
      );
      console.log(`👤 Admin user found: ${user ? 'YES' : 'NO'}`);
    } else if (type === "applicant") {
      console.log("🔍 Looking for applicant user...");
      user = await dbGet(
        "SELECT * FROM users WHERE university_id = ? AND type = ? AND is_active = 1",
        [identifier.toUpperCase(), type],
      );
      console.log(`👤 Applicant user found: ${user ? 'YES' : 'NO'}`);
    } else {
      console.log("❌ Invalid user type");
      return res.status(400).json({ error: "Invalid user type" });
    }

    if (!user) {
      console.log("❌ User not found or inactive");
      return res.status(401).json({ error: "Invalid credentials" });
    }

    // Check password
    console.log("🔒 Verifying password...");
    const isValidPassword = await bcrypt.compare(password, user.password_hash);
    console.log(`🔓 Password valid: ${isValidPassword ? 'YES' : 'NO'}`);

    if (!isValidPassword) {
      console.log("❌ Invalid password");
      return res.status(401).json({ error: "Invalid credentials" });
    }

    // Generate token
    console.log("🎫 Generating token...");
    const token = generateToken(user.id);

    // Store session
    console.log("💾 Storing session...");
    await dbRun(
      'INSERT INTO sessions (user_id, token, expires_at) VALUES (?, ?, datetime("now", "+7 days"))',
      [user.id, token],
    );

    console.log("✅ Login successful");

    // Return user data without password
    const { password_hash, ...userWithoutPassword } = user;

    res.json({
      success: true,
      data: {
        token,
        user: {
          id: user.id,
          uuid: user.uuid,
          name: user.name,
          email: user.email,
          type: user.type,
          university_id: user.university_id,
          department: user.department,
          designation: user.designation,
        },
      },
    });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// Logout endpoint
router.post("/logout", authenticateToken, async (req: AuthRequest, res) => {
  try {
    const token = req.headers.authorization?.split(" ")[1];

    if (token) {
      await dbRun("DELETE FROM sessions WHERE token = ?", [token]);
    }

    res.json({ success: true, message: "Logged out successfully" });
  } catch (error) {
    console.error("Logout error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// Get current user endpoint
router.get("/me", authenticateToken, async (req: AuthRequest, res) => {
  try {
    res.json({
      success: true,
      user: req.user,
    });
  } catch (error) {
    console.error("Get user error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// Register new applicant (after approval)
router.post("/register-applicant", async (req, res) => {
  try {
    const { name, email, university_id, department, temp_password } = req.body;

    if (!name || !email || !university_id || !department || !temp_password) {
      return res.status(400).json({ error: "All fields are required" });
    }

    // Check if user already exists
    const existingUser = await dbGet(
      "SELECT id FROM users WHERE email = ? OR university_id = ?",
      [email, university_id],
    );

    if (existingUser) {
      return res.status(400).json({ error: "User already exists" });
    }

    // Hash password
    const password_hash = await bcrypt.hash(temp_password, 10);

    // Create user
    await dbRun(
      `
      INSERT INTO users (uuid, name, email, password_hash, type, university_id, department)
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `,
      [
        uuidv4(),
        name,
        email,
        password_hash,
        "applicant",
        university_id,
        department,
      ],
    );

    res.json({ success: true, message: "Applicant registered successfully" });
  } catch (error) {
    console.error("Register applicant error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// Change password endpoint
router.post(
  "/change-password",
  authenticateToken,
  async (req: AuthRequest, res) => {
    try {
      const { current_password, new_password } = req.body;

      if (!current_password || !new_password) {
        return res
          .status(400)
          .json({ error: "Current and new passwords are required" });
      }

      // Get user with password
      const user = await dbGet("SELECT * FROM users WHERE id = ?", [
        req.user!.id,
      ]);

      // Verify current password
      const isValidPassword = await bcrypt.compare(
        current_password,
        user.password_hash,
      );
      if (!isValidPassword) {
        return res.status(400).json({ error: "Current password is incorrect" });
      }

      // Hash new password
      const new_password_hash = await bcrypt.hash(new_password, 10);

      // Update password
      await dbRun(
        "UPDATE users SET password_hash = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?",
        [new_password_hash, req.user!.id],
      );

      res.json({ success: true, message: "Password changed successfully" });
    } catch (error) {
      console.error("Change password error:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  },
);

export default router;
