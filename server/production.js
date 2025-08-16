import "dotenv/config";
import express from "express";
import cors from "cors";
import path from "path";
import { fileURLToPath } from "url";
import { connectDB, closeDB } from "./database/config.js";
import { initializeSchema } from "./database/schema.js";
import { seedDatabase } from "./database/seeder.js";

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

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true, limit: "10mb" }));

// Health check endpoint
app.get("/health", (_req, res) => {
  res.json({
    status: "healthy",
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV,
  });
});

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

// API health check
app.get("/api/ping", (_req, res) => {
  res.json({
    message: "Northern University API is running",
    timestamp: new Date().toISOString(),
  });
});

// Serve static files from the React app build
const buildPath = path.join(__dirname, "../dist/spa");
app.use(express.static(buildPath));

// Catch all handler: send back React's index.html file for any non-API routes
app.get("*", (req, res) => {
  // Don't serve index.html for API routes
  if (req.path.startsWith("/api/")) {
    return res.status(404).json({ error: "API endpoint not found" });
  }

  res.sendFile(path.join(buildPath, "index.html"));
});

// Global error handler
app.use((err, req, res, next) => {
  console.error("Global error handler:", err);
  res.status(500).json({
    error: "Internal server error",
    message:
      process.env.NODE_ENV === "development"
        ? err.message
        : "Something went wrong",
  });
});

// Initialize database and start server
async function startServer() {
  try {
    console.log("🔄 Initializing database...");
    await connectDB();
    await initializeSchema();

    // Seed database if empty
    try {
      await seedDatabase();
    } catch (error) {
      console.log("Database already seeded or seeding failed:", error.message);
    }

    console.log("✅ Database initialization completed");

    // Start server
    app.listen(PORT, "0.0.0.0", () => {
      console.log(`🚀 Server running on port ${PORT}`);
      console.log(`🌍 Environment: ${process.env.NODE_ENV}`);
      console.log(`📊 Health check: http://localhost:${PORT}/health`);
      console.log(`🔗 API: http://localhost:${PORT}/api/ping`);
    });
  } catch (error) {
    console.error("❌ Failed to start server:", error);
    process.exit(1);
  }
}

// Graceful shutdown
process.on("SIGTERM", async () => {
  console.log("SIGTERM received, shutting down gracefully");
  await closeDB();
  process.exit(0);
});

process.on("SIGINT", async () => {
  console.log("SIGINT received, shutting down gracefully");
  await closeDB();
  process.exit(0);
});

startServer();
