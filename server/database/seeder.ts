import { connectDB, dbRun, dbGet, closeDB } from "./config.js";
import { initializeSchema } from "./schema.js";
import bcrypt from "bcryptjs";
import { v4 as uuidv4 } from "uuid";

const seedDatabase = async () => {
  try {
    console.log("🌱 Starting database seeding...");

    // Connect to database
    await connectDB();

    // Initialize schema
    await initializeSchema();

    // Check if data already exists
    const existingUsers = await dbGet("SELECT COUNT(*) as count FROM users");
    if (existingUsers.count > 0) {
      console.log("📊 Database already contains data. Skipping seed.");
      return;
    }

    console.log("👤 Creating admin users...");

    // Create admin users
    const adminPassword = await bcrypt.hash("admin123", 10);

    await dbRun(
      `
      INSERT INTO users (uuid, name, email, password_hash, type, department, designation)
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `,
      [
        uuidv4(),
        "Dr. Mohammad Rahman",
        "admin@nu.edu.bd",
        adminPassword,
        "admin",
        "Administration",
        "Admission Officer",
      ],
    );

    await dbRun(
      `
      INSERT INTO users (uuid, name, email, password_hash, type, department, designation)
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `,
      [
        uuidv4(),
        "Prof. Fatima Ahmed",
        "fatima@nu.edu.bd",
        adminPassword,
        "admin",
        "Computer Science",
        "Department Head",
      ],
    );

    console.log("📚 Creating programs...");

    // Seed RBAC permissions and assign to Admin role
    console.log("🔐 Seeding RBAC permissions and role assignments...");

    const permissionsList = [
      'all',
      'applications:view',
      'applications:edit',
      'applications:approve',
      'applications:delete',
      'waivers:assign',
      'waivers:lock',
      'finance:payment.create',
      'finance:refund',
      'fraud:review.clear',
      'fraud:review.mark_fraud',
      'settings:manage',
      'reports:export',
      'documents:validate'
    ];

    for (const pk of permissionsList) {
      await dbRun(`INSERT OR IGNORE INTO permissions (permission_key) VALUES (?)`, [pk]);
    }

    // Ensure Admin role exists and get its id
    const adminRole = await dbGet(`SELECT role_id FROM roles WHERE role_key = 'Admin'`);
    const adminRoleId = adminRole ? adminRole.role_id : 6;

    // Map all permissions to Admin role
    for (const pk of permissionsList) {
      const permRow = await dbGet(`SELECT permission_id FROM permissions WHERE permission_key = ?`, [pk]);
      if (permRow) {
        await dbRun(`INSERT OR IGNORE INTO role_permissions (role_id, permission_id) VALUES (?, ?)`, [adminRoleId, permRow.permission_id]);
      }
    }

    // Assign Admin role to existing admin users (by email)
    const admin1 = await dbGet(`SELECT id FROM users WHERE email = ?`, ['admin@nu.edu.bd']);
    const admin2 = await dbGet(`SELECT id FROM users WHERE email = ?`, ['fatima@nu.edu.bd']);
    if (admin1) await dbRun(`INSERT OR IGNORE INTO user_roles (user_id, role_id) VALUES (?, ?)`, [admin1.id, adminRoleId]);
    if (admin2) await dbRun(`INSERT OR IGNORE INTO user_roles (user_id, role_id) VALUES (?, ?)`, [admin2.id, adminRoleId]);

    console.log("🔐 RBAC seeding completed.");

    // Create programs
    const programs = [
      {
        code: "BSC_CS",
        name: "BSc Computer Science",
        type: "undergraduate",
        duration_years: 4,
        total_credits: 120,
        base_cost: 180000,
      },
      {
        code: "BSC_EEE",
        name: "BSc Electrical & Electronic Engineering",
        type: "undergraduate",
        duration_years: 4,
        total_credits: 120,
        base_cost: 200000,
      },
      {
        code: "MBA",
        name: "Master of Business Administration",
        type: "postgraduate",
        duration_years: 2,
        total_credits: 60,
        base_cost: 150000,
      },
      {
        code: "MSC_CS",
        name: "MSc Computer Science",
        type: "postgraduate",
        duration_years: 2,
        total_credits: 60,
        base_cost: 120000,
      },
    ];

    for (const program of programs) {
      await dbRun(
        `
        INSERT INTO programs (code, name, type, duration_years, total_credits, base_cost)
        VALUES (?, ?, ?, ?, ?, ?)
      `,
        [
          program.code,
          program.name,
          program.type,
          program.duration_years,
          program.total_credits,
          program.base_cost,
        ],
      );
    }

    console.log("🏫 Creating departments...");

    // Create departments
    const departments = [
      {
        code: "CSE",
        name: "Computer Science & Engineering",
        faculty: "Faculty of Engineering",
      },
      {
        code: "EEE",
        name: "Electrical & Electronic Engineering",
        faculty: "Faculty of Engineering",
      },
      {
        code: "BBA",
        name: "Business Administration",
        faculty: "Faculty of Business",
      },
      {
        code: "ENG",
        name: "English",
        faculty: "Faculty of Arts",
      },
    ];

    for (const dept of departments) {
      await dbRun(
        `
        INSERT INTO departments (code, name, faculty)
        VALUES (?, ?, ?)
      `,
        [dept.code, dept.name, dept.faculty],
      );
    }

    console.log("👥 Creating employee referrers...");

    // Create employee referrers
    const referrers = [
      {
        employee_id: "NU-FAC-001",
        name: "Dr. Mohammad Rahman",
        department: "Computer Science",
        designation: "Professor",
        commission_rate: 0.05,
      },
      {
        employee_id: "NU-FAC-002",
        name: "Prof. Fatima Ahmed",
        department: "Business Administration",
        designation: "Associate Professor",
        commission_rate: 0.04,
      },
      {
        employee_id: "NU-ADM-001",
        name: "Abdul Karim",
        department: "Administration",
        designation: "Admin Officer",
        commission_rate: 0.03,
      },
    ];

    for (const referrer of referrers) {
      await dbRun(
        `
        INSERT INTO employee_referrers (employee_id, name, department, designation, commission_rate)
        VALUES (?, ?, ?, ?, ?)
      `,
        [
          referrer.employee_id,
          referrer.name,
          referrer.department,
          referrer.designation,
          referrer.commission_rate,
        ],
      );
    }

    console.log("📝 Creating sample applications...");

    // Create sample applications
    const sampleApplications = [
      {
        tracking_id: "NU24001001",
        program: "BSC_CS",
        department: "CSE",
        first_name: "Mohammad",
        last_name: "Rahman",
        phone: "+8801234567890",
        email: "rahman@email.com",
        date_of_birth: "2000-01-15",
        gender: "male",
        address: "Dhaka, Bangladesh",
        city: "Dhaka",
        postal_code: "1000",
        country: "Bangladesh",
        guardian_name: "Abdul Rahman",
        guardian_phone: "+8801234567891",
        guardian_relation: "Father",
        ssc_institution: "Dhaka College",
        ssc_year: 2017,
        ssc_gpa: 5.0,
        hsc_institution: "Notre Dame College",
        hsc_year: 2019,
        hsc_gpa: 5.0,
        total_cost: 180000,
        final_amount: 153000,
        status: "pending",
        payment_status: "pending",
        referrer_id: "NU-FAC-001",
        referrer_name: "Dr. Mohammad Rahman",
      },
      {
        tracking_id: "NU24001002",
        program: "MBA",
        department: "BBA",
        first_name: "Fatima",
        last_name: "Ahmed",
        phone: "+8801234567892",
        email: "fatima@email.com",
        date_of_birth: "1998-05-20",
        gender: "female",
        address: "Chittagong, Bangladesh",
        city: "Chittagong",
        postal_code: "4000",
        country: "Bangladesh",
        guardian_name: "Ahmed Ali",
        guardian_phone: "+8801234567893",
        guardian_relation: "Father",
        ssc_institution: "Chittagong College",
        ssc_year: 2015,
        ssc_gpa: 4.8,
        hsc_institution: "Chittagong College",
        hsc_year: 2017,
        hsc_gpa: 4.9,
        bachelor_institution: "University of Dhaka",
        bachelor_year: 2021,
        bachelor_cgpa: 3.75,
        total_cost: 150000,
        final_amount: 150000,
        status: "approved",
        payment_status: "paid",
        referrer_id: "NU-FAC-002",
        referrer_name: "Prof. Fatima Ahmed",
      },
    ];

    for (const app of sampleApplications) {
      await dbRun(
        `
        INSERT INTO applications (
          uuid, tracking_id, status, program, department, session,
          first_name, last_name, phone, date_of_birth, gender,
          address, city, postal_code, country, guardian_name,
          guardian_phone, guardian_relation, ssc_institution, ssc_year,
          ssc_gpa, hsc_institution, hsc_year, hsc_gpa, bachelor_institution,
          bachelor_year, bachelor_cgpa, total_cost, final_amount, 
          payment_status, referrer_id, referrer_name, user_id
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `,
        [
          uuidv4(),
          app.tracking_id,
          app.status,
          app.program,
          app.department,
          "Spring 2024",
          app.first_name,
          app.last_name,
          app.phone,
          app.date_of_birth,
          app.gender,
          app.address,
          app.city,
          app.postal_code,
          app.country,
          app.guardian_name,
          app.guardian_phone,
          app.guardian_relation,
          app.ssc_institution,
          app.ssc_year,
          app.ssc_gpa,
          app.hsc_institution,
          app.hsc_year,
          app.hsc_gpa,
          app.bachelor_institution || null,
          app.bachelor_year || null,
          app.bachelor_cgpa || null,
          app.total_cost,
          app.final_amount,
          app.payment_status,
          app.referrer_id,
          app.referrer_name,
          1, // Assuming first admin user as creator
        ],
      );
    }

    console.log("🎓 Creating sample applicant user...");

    // Create a sample applicant user (for approved application)
    const applicantPassword = await bcrypt.hash("temp123456", 10);

    await dbRun(
      `
      INSERT INTO users (uuid, name, email, password_hash, type, university_id, department)
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `,
      [
        uuidv4(),
        "Fatima Ahmed",
        "fatima@email.com",
        applicantPassword,
        "applicant",
        "NU24MBA002",
        "Business Administration",
      ],
    );

    console.log("✅ Database seeding completed successfully!");
    console.log("\n📋 Sample Credentials:");
    console.log("🔐 Admin Login:");
    console.log("   Email: admin@nu.edu.bd");
    console.log("   Password: admin123");
    console.log("");
    console.log("🎓 Applicant Login:");
    console.log("   University ID: NU24MBA002");
    console.log("   Password: temp123456");
    console.log("");
  } catch (error) {
    console.error("❌ Error seeding database:", error);
    throw error;
  } finally {
    await closeDB();
  }
};

// Run seeder if called directly
if (import.meta.url === `file://${process.argv[1]}`) {
  seedDatabase()
    .then(() => {
      console.log("🎉 Seeding process completed");
      process.exit(0);
    })
    .catch((error) => {
      console.error("💥 Seeding failed:", error);
      process.exit(1);
    });
}

export { seedDatabase };
