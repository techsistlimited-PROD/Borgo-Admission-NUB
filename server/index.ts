import "dotenv/config";
import express from "express";
import cors from "cors";
import path from "path";
import { connectDB, closeDB } from "./database/config.js";
import { initializeSchema } from "./database/schema.js";
import { seedDatabase } from "./database/seeder.js";
import { runMigration } from "./database/migration.js";
import { handleDemo } from "./routes/demo.js";

// Import API routes
import authRoutes from "./routes/auth.js";
import applicationRoutes from "./routes/applications.js";
import programRoutes from "./routes/programs.js";
import referrerRoutes from "./routes/referrers.js";
import messagingRoutes from "./routes/messaging.js";
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
  deleteDocumentRequirement,
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
  app.use("/api/messaging", messagingRoutes);
  // Mock emails (development-only)
  import("./routes/mockEmails.js").then((m) => {
    app.use("/api/mock-emails", m.default);
  }).catch((e) => {
    console.warn("Failed to load mock emails routes:", e);
  });

  // Public admissions endpoints (applicant-facing)
  import("./routes/publicAdmissions.js").then((m) => {
    app.use("/public/admissions", m.default);
  }).catch((e) => {
    console.warn("Failed to load public admissions routes:", e);
  });

  // Staff admissions endpoints (admin/officer)
  import("./routes/admissions.js").then((m) => {
    app.use("/api/admissions", m.default);
  }).catch((e) => {
    console.warn("Failed to load staff admissions routes:", e);
  });

  // Students endpoints
  import("./routes/students.js").then((m) => {
    app.use("/api/students", m.default);
  }).catch((e) => {
    console.warn("Failed to load students routes:", e);
  });

  // Visitors endpoints
  import("./routes/visitors.js").then((m) => {
    app.use("/api/visitors", m.default);
  }).catch((e) => {
    console.warn("Failed to load visitors routes:", e);
  });

  // Notifications & Notices
  import("./routes/notifications.js").then((m) => {
    app.use("/api/notifications", m.default);
  }).catch((e) => {
    console.warn("Failed to load notifications routes:", e);
  });

  // Reports & Exports
  import("./routes/reports.js").then((m) => {
    app.use("/api/reports", m.default);
  }).catch((e) => {
    console.warn("Failed to load reports routes:", e);
  });

  // PDF generation (admit cards, reports) - development/mock implementation
  import("./routes/pdf.js").then((m) => {
    app.use("/api/pdf", m.default);
  }).catch((e) => {
    console.warn("Failed to load PDF generation route:", e);
  });

  // Mock SMS queue management (development-only)
  import("./routes/sms.js").then((m) => {
    app.use("/api/sms", m.default);
  }).catch((e) => {
    console.warn("Failed to load SMS routes:", e);
  });

  // Admission settings routes
  app.get("/api/admission-settings", getAdmissionSettings);
  app.put("/api/admission-settings", updateAdmissionSettings);

  // Payment webhooks (provider integrations)
  import("./routes/webhooks/payments.js").then((m) => {
    app.use("/webhooks/payments", m.default);
  }).catch((e) => {
    console.warn("Failed to load payment webhooks route:", e);
  });

  // Bulk import routes
  import("./routes/imports.js").then((m) => {
    app.use("/api/admissions", m.default);
  }).catch((e) => {
    console.warn("Failed to load imports routes:", e);
  });
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

    const databaseType = process.env.DATABASE_TYPE || "sqlite";

    if (databaseType === "supabase") {
      console.log("🌐 Using Supabase database");

      // Dynamically import Supabase only when needed
      const { supabase } = await import("./database/supabase.js");

      // Test Supabase connection
      const { data, error } = await supabase
        .from("applications")
        .select("count", { count: "exact", head: true });

      if (error) {
        console.error("❌ Supabase connection failed:", error);
        throw error;
      }

      console.log("✅ Supabase database connected successfully");
    } else {
      console.log("💾 Using SQLite database (local development)");
      await connectDB();
      await initializeSchema();
      await runMigration();
      await seedDatabase();
    }

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
