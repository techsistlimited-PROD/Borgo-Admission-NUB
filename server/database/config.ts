import { Pool } from "pg";

const isDevelopment = process.env.NODE_ENV !== "production";

// PostgreSQL connection pool for Supabase
let pool: Pool;
let isConnected = false;

export const connectDB = async (): Promise<void> => {
  // If already connected, don't reconnect
  if (isConnected && pool) {
    console.log("✅ Database already connected");
    return;
  }

  const connectionString = process.env.SUPABASE_URL
    ? `postgresql://postgres.kcaqrqyggshkroghxexc:${process.env.SUPABASE_SERVICE_ROLE_KEY}@aws-0-ap-southeast-1.pooler.supabase.com:6543/postgres`
    : process.env.DATABASE_URL || 'postgresql://localhost:5432/postgres';

  try {
    pool = new Pool({
      connectionString,
      ssl: isDevelopment ? false : { rejectUnauthorized: false }
    });

    // Test connection
    const client = await pool.connect();
    await client.query('SELECT NOW()');
    client.release();
    
    isConnected = true;
    console.log("✅ Connected to PostgreSQL database (Supabase)");
  } catch (error) {
    console.error("❌ Error connecting to database:", error);
    isConnected = false;
    throw error;
  }
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
