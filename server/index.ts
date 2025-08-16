import "dotenv/config";
import express from "express";
import cors from "cors";
import path from "path";
import { connectDB, closeDB } from "./database/config.js";
import { initializeSchema } from "./database/schema.js";
import { seedDatabase } from "./database/seeder.js";
import { handleDemo } from "./routes/demo.js";

// Import API routes
import authRoutes from "./routes/auth.js";
import applicationRoutes from "./routes/applications.js";
import programRoutes from "./routes/programs.js";
import referrerRoutes from "./routes/referrers.js";
import {
  getAdmissionSettings,
  updateAdmissionSettings,
  getPaymentMethods,
  createPaymentMethod,
  updatePaymentMethod,
  deletePaymentMethod,
  getDocumentRequirements,
  createDocumentRequirement,
  updateDocumentRequirement,
  deleteDocumentRequirement
} from "./routes/admission-settings.js";

export function createServer() {
  const app = express();

  // Middleware
  app.use(cors());
  app.use(express.json({ limit: "10mb" }));
  app.use(express.urlencoded({ extended: true, limit: "10mb" }));

  // Health check endpoint
  app.get("/api/ping", (_req, res) => {
    const ping = process.env.PING_MESSAGE ?? "pong";
    res.json({ message: ping, timestamp: new Date().toISOString() });
  });

  app.get("/api/demo", handleDemo);

  // API Routes
  app.use("/api/auth", authRoutes);
  app.use("/api/applications", applicationRoutes);
  app.use("/api/programs", programRoutes);
  app.use("/api/referrers", referrerRoutes);

  // Admission settings routes
  app.get("/api/admission-settings", getAdmissionSettings);
  app.put("/api/admission-settings", updateAdmissionSettings);
  app.get("/api/payment-methods", getPaymentMethods);
  app.post("/api/payment-methods", createPaymentMethod);
  app.put("/api/payment-methods/:id", updatePaymentMethod);
  app.delete("/api/payment-methods/:id", deletePaymentMethod);
  app.get("/api/document-requirements", getDocumentRequirements);
  app.post("/api/document-requirements", createDocumentRequirement);
  app.put("/api/document-requirements/:id", updateDocumentRequirement);
  app.delete("/api/document-requirements/:id", deleteDocumentRequirement);

  // In development, Vite handles static file serving
  // Only serve static files in production
  if (process.env.NODE_ENV === "production") {
    app.use(express.static(path.join(__dirname, "../spa")));

    // SPA routing - serve index.html for all routes
    app.get("*", (_req, res) => {
      res.sendFile(path.join(__dirname, "../spa/index.html"));
    });
  }

  // Global error handler
  app.use(
    (
      err: any,
      req: express.Request,
      res: express.Response,
      next: express.NextFunction,
    ) => {
      console.error("Global error handler:", err);
      res.status(500).json({
        error: "Internal server error",
        message:
          process.env.NODE_ENV === "development"
            ? err.message
            : "Something went wrong",
      });
    },
  );

  return app;
}

// Initialize database
export async function initializeDatabase() {
  try {
    console.log("🔄 Initializing database...");
    await connectDB();
    await initializeSchema();
    await seedDatabase();
    console.log("✅ Database initialization completed");
  } catch (error) {
    console.error("❌ Database initialization failed:", error);
    throw error;
  }
}

// Graceful shutdown
export async function shutdownServer() {
  try {
    await closeDB();
    console.log("✅ Server shutdown completed");
  } catch (error) {
    console.error("❌ Error during server shutdown:", error);
  }
}
