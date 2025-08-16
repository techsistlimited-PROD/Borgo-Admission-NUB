import serverless from "serverless-http";
import { createServer, initializeDatabase } from "../../server/index.js";

let serverInstance: any = null;
let dbInitialized = false;

const getServer = async () => {
  if (!serverInstance) {
    console.log("🚀 Creating server instance...");
    serverInstance = createServer();

    // Initialize database on first request
    if (!dbInitialized) {
      try {
        console.log("🔄 Initializing database for serverless...");
        await initializeDatabase();
        dbInitialized = true;
        console.log("✅ Database initialized successfully");
      } catch (error) {
        console.error("❌ Database initialization failed:", error);
        // Continue anyway - the app should handle missing data gracefully
      }
    }
  }
  return serverInstance;
};

export const handler = async (event: any, context: any) => {
  const server = await getServer();
  const serverlessHandler = serverless(server);
  return serverlessHandler(event, context);
};
