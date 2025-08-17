import serverless from "serverless-http";
import { createServer, initializeDatabase } from "../../server/index.js";

let app: any = null;
let initialized = false;

const getApp = async () => {
  if (!app) {
    app = createServer();
  }

  // Always try to initialize database for serverless functions
  // This ensures database is ready for each invocation
  if (!initialized) {
    try {
      console.log("🔄 Initializing database for serverless function...");
      await initializeDatabase();
      initialized = true;
      console.log("✅ Database initialized successfully");
    } catch (error) {
      console.error("❌ Database initialization error:", error);
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
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        error: "Internal server error",
        message: error.message
      }),
    };
  }
};
