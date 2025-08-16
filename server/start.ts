import { createServer, initializeDatabase, shutdownServer } from "./index.js";

const PORT = process.env.PORT || 3001;

async function startServer() {
  try {
    // Initialize database first
    await initializeDatabase();

    // Create and start Express server
    const app = createServer();

    const server = app.listen(PORT, () => {
      console.log(`🚀 Server running on port ${PORT}`);
      console.log(
        `📝 API Documentation available at http://localhost:${PORT}/api/ping`,
      );
      console.log(`🌍 Environment: ${process.env.NODE_ENV || "development"}`);
    });

    // Graceful shutdown handlers
    const gracefulShutdown = async (signal: string) => {
      console.log(`\n📛 Received ${signal}, starting graceful shutdown...`);

      server.close(async () => {
        console.log("🔒 HTTP server closed");
        await shutdownServer();
        process.exit(0);
      });

      // Force close after 10 seconds
      setTimeout(() => {
        console.error(
          "❌ Could not close connections in time, forcefully shutting down",
        );
        process.exit(1);
      }, 10000);
    };

    // Listen for termination signals
    process.on("SIGTERM", () => gracefulShutdown("SIGTERM"));
    process.on("SIGINT", () => gracefulShutdown("SIGINT"));
  } catch (error) {
    console.error("❌ Failed to start server:", error);
    process.exit(1);
  }
}

// Start the server
startServer();
