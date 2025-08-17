import serverless from "serverless-http";
import express from "express";
import cors from "cors";
import authMemoryRoutes from "../../server/routes/auth-memory.js";
import { initializeMemoryDB } from "../../server/database/memory-db.js";

let app: any = null;
let initialized = false;

const createMemoryApp = () => {
  const app = express();

  // Middleware
  app.use(cors());
  app.use(express.json({ limit: "10mb" }));
  app.use(express.urlencoded({ extended: true, limit: "10mb" }));

  // Health check endpoint
  app.get("/api/ping", (_req, res) => {
    const ping = process.env.PING_MESSAGE ?? "pong";
    res.json({
      message: ping,
      timestamp: new Date().toISOString(),
      database: "memory",
    });
  });

  // Memory-based auth routes for demo
  app.use("/api/auth", authMemoryRoutes);

  // Simple demo data endpoints
  app.get("/api/programs", async (req, res) => {
    try {
      const { memoryDbAll } = await import(
        "../../server/database/memory-db.js"
      );
      const programs = await memoryDbAll("programs");
      res.json({ success: true, data: programs });
    } catch (error) {
      res.status(500).json({ error: "Internal server error" });
    }
  });

  app.get("/api/departments", async (req, res) => {
    try {
      const { memoryDbAll } = await import(
        "../../server/database/memory-db.js"
      );
      const departments = await memoryDbAll("departments");
      res.json({ success: true, data: departments });
    } catch (error) {
      res.status(500).json({ error: "Internal server error" });
    }
  });

  app.get("/api/admission-settings", async (req, res) => {
    try {
      const { memoryDbAll } = await import(
        "../../server/database/memory-db.js"
      );
      const settings = await memoryDbAll("admission_settings");
      res.json({ success: true, data: settings[0] || {} });
    } catch (error) {
      res.status(500).json({ error: "Internal server error" });
    }
  });

  app.get("/api/applications", async (req, res) => {
    try {
      const { memoryDbAll } = await import(
        "../../server/database/memory-db.js"
      );
      const applications = await memoryDbAll("applications");
      res.json({ success: true, data: applications });
    } catch (error) {
      res.status(500).json({ error: "Internal server error" });
    }
  });

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
};

const getApp = async () => {
  if (!app) {
    app = createMemoryApp();
  }

  // Initialize memory database
  if (!initialized) {
    try {
      console.log("🔄 Initializing memory database for serverless function...");
      await initializeMemoryDB();
      initialized = true;
      console.log("✅ Memory database initialized successfully");
    } catch (error) {
      console.error("❌ Memory database initialization error:", error);
      // Don't throw here, let the function attempt to work anyway
    }
  }

  return app;
};

export const handler = async (event: any, context: any) => {
  try {
    // Set Lambda context to avoid hanging functions
    context.callbackWaitsForEmptyEventLoop = false;

    console.log(`🚀 Function invoked: ${event.httpMethod} ${event.path}`);

    const app = await getApp();
    const serverlessHandler = serverless(app);
    const result = await serverlessHandler(event, context);

    console.log(`✅ Function completed with status: ${result.statusCode}`);
    return result;
  } catch (error) {
    console.error("❌ Function error:", error);
    return {
      statusCode: 500,
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        error: "Internal server error",
        message: error.message,
      }),
    };
  }
};
