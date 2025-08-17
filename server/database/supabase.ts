import { createClient } from "@supabase/supabase-js";

// Supabase configuration
const supabaseUrl = process.env.SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  throw new Error("Missing Supabase environment variables");
}

// Create Supabase client with service role key for server-side operations
export const supabase = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false,
  },
});

// Database helper functions that mirror the SQLite interface
export const supabaseGet = async (table: string, query: any = {}) => {
  try {
    let supabaseQuery = supabase.from(table).select("*");

    // Apply filters if provided
    if (query.where) {
      Object.entries(query.where).forEach(([key, value]) => {
        supabaseQuery = supabaseQuery.eq(key, value as string);
      });
    }

    if (query.single) {
      const { data, error } = await supabaseQuery.single();
      if (error) throw error;
      return data;
    } else {
      const { data, error } = await supabaseQuery;
      if (error) throw error;
      return data;
    }
  } catch (error) {
    console.error(`Supabase get error for table ${table}:`, error);
    throw error;
  }
};

export const supabaseAll = async (table: string, query: any = {}) => {
  try {
    let supabaseQuery = supabase.from(table).select("*");

    // Apply filters if provided
    if (query.where) {
      Object.entries(query.where).forEach(([key, value]) => {
        supabaseQuery = supabaseQuery.eq(key, value as string);
      });
    }

    // Apply ordering
    if (query.orderBy) {
      supabaseQuery = supabaseQuery.order(query.orderBy.column, {
        ascending: query.orderBy.direction === "asc",
      });
    }

    // Apply pagination
    if (query.limit) {
      supabaseQuery = supabaseQuery.limit(query.limit);
    }

    if (query.offset) {
      supabaseQuery = supabaseQuery.range(
        query.offset,
        query.offset + (query.limit || 10) - 1,
      );
    }

    const { data, error } = await supabaseQuery;
    if (error) throw error;
    return data || [];
  } catch (error) {
    console.error(`Supabase all error for table ${table}:`, error);
    throw error;
  }
};

export const supabaseRun = async (
  table: string,
  operation: "insert" | "update" | "delete",
  data: any,
  where?: any,
) => {
  try {
    let result;

    switch (operation) {
      case "insert":
        result = await supabase.from(table).insert(data).select();
        break;
      case "update":
        let updateQuery = supabase.from(table).update(data);
        if (where) {
          Object.entries(where).forEach(([key, value]) => {
            updateQuery = updateQuery.eq(key, value as string);
          });
        }
        result = await updateQuery.select();
        break;
      case "delete":
        let deleteQuery = supabase.from(table).delete();
        if (where) {
          Object.entries(where).forEach(([key, value]) => {
            deleteQuery = deleteQuery.eq(key, value as string);
          });
        }
        result = await deleteQuery;
        break;
      default:
        throw new Error(`Unsupported operation: ${operation}`);
    }

    if (result.error) throw result.error;
    return result.data;
  } catch (error) {
    console.error(`Supabase ${operation} error for table ${table}:`, error);
    throw error;
  }
};

// Custom SQL execution for complex queries
export const supabaseExecute = async (sql: string, params: any[] = []) => {
  try {
    // For complex queries, we'll use RPC functions
    // This is a simplified approach - in production you'd create stored procedures
    console.warn("Complex SQL queries require stored procedures in Supabase");
    throw new Error("Use specific Supabase methods instead of raw SQL");
  } catch (error) {
    console.error("Supabase execute error:", error);
    throw error;
  }
};
