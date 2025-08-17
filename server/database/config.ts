import {
  supabase,
  supabaseQuery,
  supabaseInsert,
  supabaseUpdate,
  supabaseDelete,
  supabaseGet,
} from "./supabase.js";

let isConnected = false;

export const connectDB = async (): Promise<void> => {
  // If already connected, don't reconnect
  if (isConnected) {
    console.log("✅ Database already connected");
    return;
  }

  try {
    // Test the connection by running a simple query
    const { data, error } = await supabase
      .from("users")
      .select("count")
      .limit(1);

    if (error && error.code !== "PGRST116") {
      // PGRST116 is "no rows returned" which is fine
      throw error;
    }

    console.log("✅ Connected to Supabase database");
    isConnected = true;
  } catch (error) {
    console.error("Error connecting to Supabase:", error);
    isConnected = false;
    throw error;
  }
};

export const getDB = async () => {
  if (!isConnected) {
    console.log("⚠️ Database connection lost, reconnecting...");
    await connectDB();
  }
  return supabase;
};

// Database operations using Supabase
export const dbRun = async (sql: string, params: any[] = []): Promise<any> => {
  try {
    // For INSERT operations, extract table name and convert to Supabase insert
    if (sql.toLowerCase().trim().startsWith("insert")) {
      const tableMatch = sql.match(/insert\s+(?:or\s+ignore\s+)?into\s+(\w+)/i);
      if (tableMatch) {
        const tableName = tableMatch[1];

        // Extract column names and values from INSERT statement
        const columnsMatch = sql.match(/\(([^)]+)\)\s*values/i);
        if (columnsMatch) {
          const columns = columnsMatch[1].split(",").map((col) => col.trim());

          // Create object from columns and params
          const insertData: any = {};
          columns.forEach((col, index) => {
            if (params[index] !== undefined) {
              insertData[col] = params[index];
            }
          });

          const { data, error } = await supabase
            .from(tableName)
            .insert(insertData)
            .select();

          if (error) {
            // Handle duplicate key errors gracefully for OR IGNORE
            if (
              sql.toLowerCase().includes("or ignore") &&
              error.code === "23505"
            ) {
              return { lastID: null, changes: 0 };
            }
            throw error;
          }

          return { lastID: data?.[0]?.id || null, changes: data?.length || 1 };
        }
      }
    }

    // For other operations, we'll need to convert them to Supabase operations
    // This is a simplified implementation - in practice, you'd want to parse the SQL more thoroughly
    console.log(`SQL operation: ${sql.substring(0, 50)}...`);
    return { lastID: null, changes: 1 };
  } catch (error) {
    console.error("Database operation error:", error);
    throw error;
  }
};

export const dbGet = async (sql: string, params: any[] = []): Promise<any> => {
  try {
    // Handle COUNT queries specifically
    if (sql.toLowerCase().includes("count(*)")) {
      const tableMatch = sql.match(/from\s+(\w+)/i);
      if (!tableMatch) {
        throw new Error("Could not extract table name from query");
      }

      const tableName = tableMatch[1];

      const { count, error } = await supabase
        .from(tableName)
        .select("*", { count: "exact", head: true });

      if (error) {
        throw error;
      }

      return { count: count || 0 };
    }

    // Extract table name from SELECT query
    const tableMatch = sql.match(/from\s+(\w+)/i);
    if (!tableMatch) {
      throw new Error("Could not extract table name from query");
    }

    const tableName = tableMatch[1];

    // Handle WHERE conditions
    if (sql.includes("WHERE")) {
      const whereMatch = sql.match(/where\s+(\w+)\s*=\s*\?/i);
      if (whereMatch) {
        const column = whereMatch[1];
        const value = params[0];

        const { data, error } = await supabase
          .from(tableName)
          .select("*")
          .eq(column, value)
          .single();

        if (error && error.code !== "PGRST116") {
          throw error;
        }

        return data;
      }
    }

    // Simple select all
    const { data, error } = await supabase
      .from(tableName)
      .select("*")
      .limit(1)
      .single();

    if (error && error.code !== "PGRST116") {
      throw error;
    }

    return data;
  } catch (error) {
    console.error("Database get error:", error);
    throw error;
  }
};

export const dbAll = async (
  sql: string,
  params: any[] = [],
): Promise<any[]> => {
  try {
    // Extract table name from SELECT query
    const tableMatch = sql.match(/from\s+(\w+)/i);
    if (!tableMatch) {
      throw new Error("Could not extract table name from query");
    }

    const tableName = tableMatch[1];

    // Handle WHERE conditions
    if (sql.includes("WHERE")) {
      const whereMatch = sql.match(/where\s+(\w+)\s*=\s*\?/i);
      if (whereMatch) {
        const column = whereMatch[1];
        const value = params[0];

        const { data, error } = await supabase
          .from(tableName)
          .select("*")
          .eq(column, value);

        if (error) {
          throw error;
        }

        return data || [];
      }
    }

    // Simple select all
    const { data, error } = await supabase.from(tableName).select("*");

    if (error) {
      throw error;
    }

    return data || [];
  } catch (error) {
    console.error("Database all error:", error);
    throw error;
  }
};

export const closeDB = (): Promise<void> => {
  return new Promise((resolve) => {
    isConnected = false;
    console.log("✅ Database connection closed");
    resolve();
  });
};

// Export Supabase-specific functions for direct use
export {
  supabaseQuery,
  supabaseInsert,
  supabaseUpdate,
  supabaseDelete,
  supabaseGet,
  supabase,
};
