// For now, let's temporarily revert to SQLite for development
// until we get the proper Supabase database credentials
import Database from "sqlite3";
import { promisify } from "util";
import path from "path";

const isDevelopment = process.env.NODE_ENV !== "production";

// Database connection
let db: Database.Database;
let isConnected = false;

export const connectDB = async (): Promise<void> => {
  // If already connected, don't reconnect
  if (isConnected && db) {
    console.log("✅ Database already connected");
    return;
  }

  const dbPath =
    process.env.DATABASE_PATH ||
    (isDevelopment
      ? path.join(process.cwd(), "database.sqlite")
      : path.join(process.cwd(), "data", "database.sqlite"));

  return new Promise((resolve, reject) => {
    db = new Database.Database(dbPath, (err) => {
      if (err) {
        console.error("Error opening database:", err);
        isConnected = false;
        reject(err);
      } else {
        console.log("✅ Connected to SQLite database (temporarily for development)");
        isConnected = true;
        resolve();
      }
    });
  });
};

export const getDB = async (): Promise<Pool> => {
  if (!pool || !isConnected) {
    console.log("⚠️ Database connection lost, reconnecting...");
    await connectDB();
  }
  return pool;
};

// Database query methods for PostgreSQL
export const dbRun = async (sql: string, params: any[] = []): Promise<any> => {
  try {
    const database = await getDB();
    const result = await database.query(sql, params);
    return { 
      lastID: result.rows[0]?.id || null, 
      changes: result.rowCount || 0,
      rows: result.rows
    };
  } catch (error) {
    console.error("Error executing query:", error);
    throw error;
  }
};

export const dbGet = async (sql: string, params: any[] = []): Promise<any> => {
  try {
    const database = await getDB();
    const result = await database.query(sql, params);
    return result.rows[0] || null;
  } catch (error) {
    console.error("Error executing query:", error);
    throw error;
  }
};

export const dbAll = async (sql: string, params: any[] = []): Promise<any[]> => {
  try {
    const database = await getDB();
    const result = await database.query(sql, params);
    return result.rows || [];
  } catch (error) {
    console.error("Error executing query:", error);
    throw error;
  }
};

export const closeDB = (): Promise<void> => {
  return new Promise((resolve) => {
    if (pool && isConnected) {
      try {
        pool.end().then(() => {
          pool = null as any;
          isConnected = false;
          console.log("✅ Database connection closed");
          resolve();
        }).catch(() => {
          pool = null as any;
          isConnected = false;
          resolve();
        });
      } catch (error) {
        pool = null as any;
        isConnected = false;
        resolve();
      }
    } else {
      isConnected = false;
      resolve();
    }
  });
};
