import { dbRun } from "./config.js";

export const initializeSchema = async (): Promise<void> => {
  try {
    // Users table (both applicants and admins)
    await dbRun(`
      CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        uuid TEXT UNIQUE NOT NULL,
        name TEXT NOT NULL,
        email TEXT UNIQUE NOT NULL,
        password_hash TEXT NOT NULL,
        type TEXT NOT NULL CHECK (type IN ('applicant', 'admin')),
        university_id TEXT UNIQUE,
        department TEXT,
        designation TEXT,
        is_active BOOLEAN DEFAULT 1,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Applications table
    await dbRun(`
      CREATE TABLE IF NOT EXISTS applications (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        uuid TEXT UNIQUE NOT NULL,
        user_id INTEGER,
        tracking_id TEXT UNIQUE NOT NULL,
        status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected')),
        program TEXT NOT NULL,
        department TEXT NOT NULL,
        campus TEXT DEFAULT 'main',
        session TEXT NOT NULL,
        first_name TEXT NOT NULL,
        last_name TEXT NOT NULL,
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

    // Programs table
    await dbRun(`
      CREATE TABLE IF NOT EXISTS programs (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        code TEXT UNIQUE NOT NULL,
        name TEXT NOT NULL,
        type TEXT NOT NULL,
        duration_years INTEGER NOT NULL,
        total_credits INTEGER NOT NULL,
        base_cost REAL NOT NULL,
        is_active BOOLEAN DEFAULT 1,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Departments table
    await dbRun(`
      CREATE TABLE IF NOT EXISTS departments (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        code TEXT UNIQUE NOT NULL,
        name TEXT NOT NULL,
        faculty TEXT NOT NULL,
        is_active BOOLEAN DEFAULT 1,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Waivers table
    await dbRun(`
      CREATE TABLE IF NOT EXISTS waivers (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        application_id INTEGER NOT NULL,
        type TEXT NOT NULL,
        percentage REAL NOT NULL,
        amount REAL NOT NULL,
        reason TEXT,
        approved_by TEXT,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (application_id) REFERENCES applications (id)
      )
    `);

    // Employee referrers table
    await dbRun(`
      CREATE TABLE IF NOT EXISTS employee_referrers (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        employee_id TEXT UNIQUE NOT NULL,
        name TEXT NOT NULL,
        department TEXT NOT NULL,
        designation TEXT NOT NULL,
        commission_rate REAL DEFAULT 0.05,
        is_active BOOLEAN DEFAULT 1,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Sessions table
    await dbRun(`
      CREATE TABLE IF NOT EXISTS sessions (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        user_id INTEGER NOT NULL,
        token TEXT UNIQUE NOT NULL,
        expires_at DATETIME NOT NULL,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES users (id)
      )
    `);

    // ID generation tracking
    await dbRun(`
      CREATE TABLE IF NOT EXISTS id_generation (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        application_id INTEGER NOT NULL,
        university_id TEXT NOT NULL,
        ugc_id TEXT,
        batch TEXT NOT NULL,
        generated_date DATETIME DEFAULT CURRENT_TIMESTAMP,
        generated_by TEXT NOT NULL,
        is_sent BOOLEAN DEFAULT 0,
        FOREIGN KEY (application_id) REFERENCES applications (id)
      )
    `);

    // Admission settings table
    await dbRun(`
      CREATE TABLE IF NOT EXISTS admission_settings (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        application_deadline DATETIME NOT NULL,
        admission_fee REAL NOT NULL DEFAULT 1000,
        late_fee REAL NOT NULL DEFAULT 500,
        late_fee_deadline DATETIME,
        max_applications_per_user INTEGER DEFAULT 3,
        allow_application_editing BOOLEAN DEFAULT 1,
        require_phone_verification BOOLEAN DEFAULT 1,
        require_email_verification BOOLEAN DEFAULT 1,
        require_document_upload BOOLEAN DEFAULT 1,
        application_start_date DATETIME NOT NULL,
        session_name TEXT NOT NULL DEFAULT 'Spring 2024',
        admission_notice TEXT,
        payment_instructions TEXT,
        contact_email TEXT DEFAULT 'admission@nu.edu.bd',
        contact_phone TEXT DEFAULT '+8801700000000',
        is_admission_open BOOLEAN DEFAULT 1,
        waiver_enabled BOOLEAN DEFAULT 1,
        max_waiver_percentage REAL DEFAULT 50,
        auto_approve_applications BOOLEAN DEFAULT 0,
        send_sms_notifications BOOLEAN DEFAULT 1,
        send_email_notifications BOOLEAN DEFAULT 1,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Payment methods table
    await dbRun(`
      CREATE TABLE IF NOT EXISTS payment_methods (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        type TEXT NOT NULL CHECK (type IN ('bank', 'mobile', 'online')),
        account_number TEXT NOT NULL,
        account_name TEXT NOT NULL,
        routing_number TEXT,
        instructions TEXT,
        is_active BOOLEAN DEFAULT 1,
        order_priority INTEGER DEFAULT 0,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Document requirements table
    await dbRun(`
      CREATE TABLE IF NOT EXISTS document_requirements (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        description TEXT NOT NULL,
        is_required BOOLEAN DEFAULT 1,
        file_types TEXT DEFAULT 'pdf,jpg,jpeg,png',
        max_file_size_mb INTEGER DEFAULT 5,
        order_priority INTEGER DEFAULT 0,
        is_active BOOLEAN DEFAULT 1,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Insert default admission settings if none exist
    await dbRun(`
      INSERT OR IGNORE INTO admission_settings (
        id,
        application_deadline,
        admission_fee,
        late_fee,
        late_fee_deadline,
        application_start_date,
        session_name,
        admission_notice,
        payment_instructions,
        contact_email,
        contact_phone
      ) VALUES (
        1,
        '2024-12-31 23:59:59',
        1000,
        500,
        '2025-01-15 23:59:59',
        '2024-01-01 00:00:00',
        'Spring 2024',
        'Welcome to Northern University Bangladesh Online Admission Portal. Please complete all required fields and submit your application before the deadline.',
        'Please make payment to the designated bank account and upload the payment slip. For any payment related queries, contact our finance department.',
        'admission@nu.edu.bd',
        '+8801700000000'
      )
    `);

    // Insert default payment methods if none exist
    await dbRun(`
      INSERT OR IGNORE INTO payment_methods (name, type, account_number, account_name, instructions, order_priority)
      VALUES
        ('Dutch Bangla Bank', 'bank', '1234567890', 'Northern University Bangladesh', 'Please mention your tracking ID in the deposit slip.', 1),
        ('bKash', 'mobile', '01700000000', 'Northern University', 'Send money to this number and mention your tracking ID.', 2),
        ('Nagad', 'mobile', '01800000000', 'Northern University', 'Send money to this number and mention your tracking ID.', 3)
    `);

    // Insert default document requirements if none exist
    await dbRun(`
      INSERT OR IGNORE INTO document_requirements (name, description, is_required, order_priority)
      VALUES
        ('SSC Certificate', 'Upload your SSC/equivalent certificate', 1, 1),
        ('HSC Certificate', 'Upload your HSC/equivalent certificate', 1, 2),
        ('Passport Size Photo', 'Upload a recent passport size photograph', 1, 3),
        ('National ID/Birth Certificate', 'Upload National ID card or Birth Certificate', 1, 4),
        ('Guardian National ID', 'Upload guardian National ID card', 0, 5)
    `);

    // Add campus column if it doesn't exist (migration)
    try {
      await dbRun(`ALTER TABLE applications ADD COLUMN campus TEXT DEFAULT 'main'`);
      console.log("✅ Added campus column to applications table");
    } catch (error) {
      // Column might already exist, ignore the error
      console.log("�� Campus column already exists or migration not needed");
    }

    // Make user_id nullable for public submissions (migration)
    try {
      // Create a temporary table with the correct schema
      await dbRun(`
        CREATE TABLE applications_new (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          uuid TEXT UNIQUE NOT NULL,
          user_id INTEGER,
          tracking_id TEXT UNIQUE NOT NULL,
          status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected')),
          program TEXT NOT NULL,
          department TEXT NOT NULL,
          campus TEXT DEFAULT 'main',
          session TEXT NOT NULL,
          first_name TEXT NOT NULL,
          last_name TEXT NOT NULL,
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

      // Copy data from old table to new table
      await dbRun(`
        INSERT INTO applications_new SELECT * FROM applications
      `);

      // Drop old table and rename new table
      await dbRun(`DROP TABLE applications`);
      await dbRun(`ALTER TABLE applications_new RENAME TO applications`);

      console.log("✅ Made user_id nullable in applications table");
    } catch (error) {
      console.log("🔄 user_id migration not needed or already completed:", error.message);
    }

    console.log("✅ Database schema initialized successfully");
  } catch (error) {
    console.error("❌ Error initializing database schema:", error);
    throw error;
  }
};
