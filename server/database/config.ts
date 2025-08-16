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
        console.log("✅ Connected to SQLite database");
        isConnected = true;
        resolve();
      }
    });
  });
};

export const getDB = async (): Promise<Database.Database> => {
  if (!db || !isConnected) {
    console.log("⚠️ Database connection lost, reconnecting...");
    await connectDB();
  }
  return db;
};

// Promisified database methods with better error handling
export const dbRun = async (sql: string, params: any[] = []): Promise<any> => {
  return new Promise(async (resolve, reject) => {
    try {
      const database = await getDB();
      database.run(sql, params, function (err) {
        if (err) reject(err);
        else resolve({ lastID: this.lastID, changes: this.changes });
      });
    } catch (error) {
      reject(error);
    }
  });
};

export const dbGet = async (sql: string, params: any[] = []): Promise<any> => {
  return new Promise(async (resolve, reject) => {
    try {
      const database = await getDB();
      database.get(sql, params, (err, row) => {
        if (err) reject(err);
        else resolve(row);
      });
    } catch (error) {
      reject(error);
    }
  });
};

export const dbAll = async (sql: string, params: any[] = []): Promise<any[]> => {
  return new Promise(async (resolve, reject) => {
    try {
      const database = await getDB();
      database.all(sql, params, (err, rows) => {
        if (err) reject(err);
        else resolve(rows || []);
      });
    } catch (error) {
      reject(error);
    }
  });
};

export const closeDB = (): Promise<void> => {
  return new Promise((resolve, reject) => {
    if (db && isConnected) {
      try {
        db.close((err) => {
          if (err && err.code !== 'SQLITE_MISUSE') {
            reject(err);
          } else {
            db = null as any; // Clear the reference
            isConnected = false;
            resolve();
          }
        });
      } catch (error) {
        // If the database is already closed, just clear the reference
        db = null as any;
        isConnected = false;
        resolve();
      }
    } else {
      isConnected = false;
      resolve();
    }
  });
};
