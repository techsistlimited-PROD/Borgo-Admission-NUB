import serverless from "serverless-http";
import { createServer, initializeDatabase } from "../../server/index.js";

let app: any = null;
let initialized = false;

const getApp = async () => {
  if (!app) {
    // Initialize database once
    if (!initialized) {
      await initializeDatabase();
      initialized = true;
    }
    app = createServer();
  }
  return app;
};

export const handler = async (event: any, context: any) => {
  try {
    const app = await getApp();
    const serverlessHandler = serverless(app);
    return await serverlessHandler(event, context);
  } catch (error) {
    console.error("Function error:", error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: "Internal server error" }),
    };
  }
};
