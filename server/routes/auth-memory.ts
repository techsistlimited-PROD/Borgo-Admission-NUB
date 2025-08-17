import express from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { memoryDbGet, memoryDbRun, initializeMemoryDB } from "../database/memory-db.js";

const router = express.Router();

// JWT secret for demo
const JWT_SECRET = process.env.JWT_SECRET || "demo-secret-key-change-in-production";

// Generate JWT token
const generateToken = (userId: number): string => {
  return jwt.sign({ userId }, JWT_SECRET, { expiresIn: "7d" });
};

// Login endpoint
router.post("/login", async (req, res) => {
  try {
    const { identifier, password, type } = req.body;
    console.log(`🔐 Memory DB Login attempt for ${type}: ${identifier}`);

    if (!identifier || !password || !type) {
      console.log("❌ Missing required fields");
      return res.status(400).json({ error: "All fields are required" });
    }

    // Initialize memory database
    await initializeMemoryDB();

    // Find user by email or university_id based on type
    let user;
    if (type === "admin") {
      console.log("🔍 Looking for admin user...");
      user = await memoryDbGet('users', { email: identifier, type: type });
      console.log(`👤 Admin user found: ${user ? 'YES' : 'NO'}`);
    } else if (type === "applicant") {
      console.log("🔍 Looking for applicant user...");
      user = await memoryDbGet('users', { university_id: identifier.toUpperCase(), type: type });
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
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + 7);
    
    await memoryDbRun('sessions', 'insert', {
      user_id: user.id,
      token: token,
      expires_at: expiresAt.toISOString()
    });

    console.log("✅ Login successful");

    // Return user data without password
    res.json({
      success: true,
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
    });
  } catch (error) {
    console.error("Memory login error:", error);
    res.status(500).json({ error: "Internal server error", details: error.message });
  }
});

// Logout endpoint
router.post("/logout", async (req, res) => {
  try {
    const token = req.headers.authorization?.split(" ")[1];

    if (token) {
      await memoryDbRun('sessions', 'delete', { token });
    }

    res.json({ success: true, message: "Logged out successfully" });
  } catch (error) {
    console.error("Logout error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// Get current user endpoint
router.get("/me", async (req, res) => {
  try {
    const token = req.headers.authorization?.split(" ")[1];
    
    if (!token) {
      return res.status(401).json({ error: "No token provided" });
    }

    const decoded = jwt.verify(token, JWT_SECRET) as any;
    const user = await memoryDbGet('users', { id: decoded.userId });
    
    if (!user) {
      return res.status(401).json({ error: "Invalid token" });
    }

    res.json({
      success: true,
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
    });
  } catch (error) {
    console.error("Get user error:", error);
    res.status(401).json({ error: "Invalid token" });
  }
});

export default router;
