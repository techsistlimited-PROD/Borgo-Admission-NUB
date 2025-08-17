import { createClient } from "@supabase/supabase-js";

const supabaseUrl =
  process.env.SUPABASE_URL || "https://lpjwyilcjogxdxvvqzsh.supabase.co";
const supabaseServiceRoleKey =
  process.env.SUPABASE_SERVICE_ROLE_KEY ||
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imxwand5aWxjam9neGR4dnZxenNoIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1NTQzODM5MywiZXhwIjoyMDcxMDE0MzkzfQ.gMkzl9y0pdbp_vQheWcm-SMkvEPl1u60s_AhzVoAmkk";

// Create Supabase client with service role key for backend operations
export const supabase = createClient(supabaseUrl, supabaseServiceRoleKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false,
  },
});

// Database helper functions for Supabase
export const supabaseQuery = async (table: string, query?: any) => {
  const { data, error } = await supabase.from(table).select("*");

  if (error) {
    throw new Error(`Supabase query error: ${error.message}`);
  }

  return data;
};

export const supabaseInsert = async (table: string, data: any) => {
  const { data: result, error } = await supabase
    .from(table)
    .insert(data)
    .select();

  if (error) {
    throw new Error(`Supabase insert error: ${error.message}`);
  }

  return result;
};

export const supabaseUpdate = async (table: string, id: string, data: any) => {
  const { data: result, error } = await supabase
    .from(table)
    .update(data)
    .eq("id", id)
    .select();

  if (error) {
    throw new Error(`Supabase update error: ${error.message}`);
  }

  return result;
};

export const supabaseDelete = async (table: string, id: string) => {
  const { error } = await supabase.from(table).delete().eq("id", id);

  if (error) {
    throw new Error(`Supabase delete error: ${error.message}`);
  }

  return true;
};

export const supabaseGet = async (table: string, id: string) => {
  const { data, error } = await supabase
    .from(table)
    .select("*")
    .eq("id", id)
    .single();

  if (error && error.code !== "PGRST116") {
    // PGRST116 is "no rows returned"
    throw new Error(`Supabase get error: ${error.message}`);
  }

  return data;
};

// Custom SQL execution for complex queries
export const supabaseRaw = async (query: string, params?: any[]) => {
  const { data, error } = await supabase.rpc("execute_sql", {
    sql_query: query,
    params: params || [],
  });

  if (error) {
    throw new Error(`Supabase raw query error: ${error.message}`);
  }

  return data;
};

console.log("✅ Supabase client initialized");
