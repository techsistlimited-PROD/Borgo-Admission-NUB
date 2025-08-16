import jwt from "jsonwebtoken";
import { Request, Response, NextFunction } from "express";
import { dbGet } from "../database/config.js";

const JWT_SECRET =
  process.env.JWT_SECRET || "your-super-secret-jwt-key-change-in-production";

export interface AuthRequest extends Request {
  user?: {
    id: number;
    uuid: string;
    email: string;
    type: "applicant" | "admin";
    name: string;
    university_id?: string;
    department?: string;
    designation?: string;
  };
}

export const authenticateToken = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction,
) => {
  try {
    const authHeader = req.headers["authorization"];
    const token = authHeader && authHeader.split(" ")[1]; // Bearer TOKEN

    if (!token) {
      return res.status(401).json({ error: "Access token required" });
    }

    const decoded = jwt.verify(token, JWT_SECRET) as any;

    // Get user from database
    const user = await dbGet(
      "SELECT id, uuid, name, email, type, university_id, department, designation FROM users WHERE id = ? AND is_active = 1",
      [decoded.userId],
    );

    if (!user) {
      return res.status(401).json({ error: "User not found or inactive" });
    }

    req.user = user;
    next();
  } catch (error) {
    console.error("Auth middleware error:", error);
    return res.status(403).json({ error: "Invalid token" });
  }
};

export const requireAdmin = (
  req: AuthRequest,
  res: Response,
  next: NextFunction,
) => {
  if (!req.user) {
    return res.status(401).json({ error: "Authentication required" });
  }

  if (req.user.type !== "admin") {
    return res.status(403).json({ error: "Admin access required" });
  }

  next();
};

export const requireApplicant = (
  req: AuthRequest,
  res: Response,
  next: NextFunction,
) => {
  if (!req.user) {
    return res.status(401).json({ error: "Authentication required" });
  }

  if (req.user.type !== "applicant") {
    return res.status(403).json({ error: "Applicant access required" });
  }

  next();
};

export const generateToken = (userId: number): string => {
  return jwt.sign({ userId }, JWT_SECRET, { expiresIn: "7d" });
};
