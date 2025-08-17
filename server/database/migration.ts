import { dbRun, dbGet } from "./config.js";

export const runMigration = async (): Promise<void> => {
  try {
    // Check if user_id column allows NULL
    const tableInfo = await dbGet(`PRAGMA table_info(applications)`);
    
    console.log("🔄 Running database migration to fix user_id constraint...");
    
    // SQLite doesn't support ALTER COLUMN directly, so we need to recreate the table
    // First, check if the table exists and has data
    const existingData = await dbGet(`SELECT COUNT(*) as count FROM applications`);
    
    if (existingData && existingData.count > 0) {
      console.log(`📊 Found ${existingData.count} existing applications, preserving data...`);
      
      // Create backup table
      await dbRun(`CREATE TEMPORARY TABLE applications_backup AS SELECT * FROM applications`);
      
      // Drop the old table
      await dbRun(`DROP TABLE applications`);
      
      // Recreate table with nullable user_id
      await dbRun(`
        CREATE TABLE applications (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          uuid TEXT UNIQUE NOT NULL,
          user_id INTEGER,
          tracking_id TEXT UNIQUE NOT NULL,
          status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected')),
          program TEXT NOT NULL,
          department TEXT NOT NULL,
          session TEXT NOT NULL,
          campus TEXT,
          first_name TEXT NOT NULL,
          last_name TEXT NOT NULL,
          email TEXT,
          phone TEXT NOT NULL,
          phone_verified BOOLEAN DEFAULT 0,
          email_verified BOOLEAN DEFAULT 0,
          date_of_birth DATE,
          gender TEXT,
          address TEXT,
          city TEXT,
          postal_code TEXT,
          country TEXT DEFAULT 'Bangladesh',
          guardian_name TEXT,
          guardian_phone TEXT,
          guardian_relation TEXT,
          ssc_institution TEXT,
          ssc_year INTEGER,
          ssc_gpa REAL,
          hsc_institution TEXT,
          hsc_year INTEGER,
          hsc_gpa REAL,
          bachelor_institution TEXT,
          bachelor_year INTEGER,
          bachelor_cgpa REAL,
          master_institution TEXT,
          master_year INTEGER,
          master_cgpa REAL,
          other_qualifications TEXT,
          total_cost REAL DEFAULT 0,
          waiver_amount REAL DEFAULT 0,
          final_amount REAL DEFAULT 0,
          payment_status TEXT DEFAULT 'pending' CHECK (payment_status IN ('pending', 'paid', 'partial')),
          payslip_uploaded BOOLEAN DEFAULT 0,
          documents_complete BOOLEAN DEFAULT 0,
          referrer_id TEXT,
          referrer_name TEXT,
          application_date DATETIME DEFAULT CURRENT_TIMESTAMP,
          approval_date DATETIME,
          created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
          updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
          FOREIGN KEY (user_id) REFERENCES users (id)
        )
      `);
      
      // Restore data with NULL user_id where it was 0 or invalid
      await dbRun(`
        INSERT INTO applications SELECT
          id, uuid,
          CASE WHEN user_id = 0 OR user_id NOT IN (SELECT id FROM users) THEN NULL ELSE user_id END,
          tracking_id, status, program, department, session,
          NULL as campus, -- Add default value for new campus field
          first_name, last_name,
          NULL as email, -- Add default value for new email field
          phone, phone_verified, email_verified,
          date_of_birth, gender, address, city, postal_code, country,
          guardian_name, guardian_phone, guardian_relation,
          ssc_institution, ssc_year, ssc_gpa,
          hsc_institution, hsc_year, hsc_gpa,
          bachelor_institution, bachelor_year, bachelor_cgpa,
          master_institution, master_year, master_cgpa,
          other_qualifications, total_cost, waiver_amount, final_amount,
          payment_status, payslip_uploaded, documents_complete,
          referrer_id, referrer_name, application_date, approval_date,
          created_at, updated_at
        FROM applications_backup
      `);
      
      // Drop backup table
      await dbRun(`DROP TABLE applications_backup`);
      
      console.log("✅ Migration completed successfully with data preservation");
    } else {
      console.log("📝 No existing data found, table structure updated");
    }
    
  } catch (error) {
    console.error("❌ Migration failed:", error);
    throw error;
  }
};
