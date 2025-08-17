import { connectDB, supabaseInsert, supabaseGet, closeDB, supabase } from "./config.js";
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
    const { count, error } = await supabase
      .from('users')
      .select('*', { count: 'exact', head: true });

    if (error) {
      console.error("Error checking existing data:", error);
    }

    if (count && count > 0) {
      console.log("📊 Database already contains data. Skipping seed.");
      return;
    }

    console.log("👤 Creating admin users...");

    // Create admin users
    const adminPassword = await bcrypt.hash("admin123", 10);
    
    const admin1Uuid = uuidv4();
    const admin2Uuid = uuidv4();

    const { data: admin1 } = await supabase
      .from('users')
      .insert({
        uuid: admin1Uuid,
        name: "Dr. Mohammad Rahman",
        email: "admin@nu.edu.bd",
        password_hash: adminPassword,
        type: "admin",
        department: "Administration",
        designation: "Admission Officer",
      })
      .select()
      .single();

    const { data: admin2 } = await supabase
      .from('users')
      .insert({
        uuid: admin2Uuid,
        name: "Prof. Fatima Ahmed",
        email: "fatima@nu.edu.bd",
        password_hash: adminPassword,
        type: "admin",
        department: "Computer Science",
        designation: "Department Head",
      })
      .select()
      .single();

    console.log("📚 Creating programs...");

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
      await supabase
        .from('programs')
        .insert(program);
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
      await supabase
        .from('departments')
        .insert(dept);
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
      await supabase
        .from('employee_referrers')
        .insert(referrer);
    }

    console.log("📝 Creating sample applications...");

    // Create sample applications (without user_id initially)
    const sampleApplications = [
      {
        uuid: uuidv4(),
        tracking_id: "NU24001001",
        program: "BSC_CS",
        department: "CSE",
        session: "Spring 2024",
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
        user_id: null,
      },
      {
        uuid: uuidv4(),
        tracking_id: "NU24001002",
        program: "MBA",
        department: "BBA",
        session: "Spring 2024",
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
        user_id: null,
      },
    ];

    const createdApplications = [];
    for (const app of sampleApplications) {
      const { data } = await supabase
        .from('applications')
        .insert(app)
        .select()
        .single();
      createdApplications.push(data);
    }

    console.log("🎓 Creating sample applicant user...");

    // Create a sample applicant user (for approved application)
    const applicantPassword = await bcrypt.hash("temp123456", 10);

    const { data: applicantUser } = await supabase
      .from('users')
      .insert({
        uuid: uuidv4(),
        name: "Fatima Ahmed",
        email: "fatima@email.com",
        password_hash: applicantPassword,
        type: "applicant",
        university_id: "NU24MBA002",
        department: "Business Administration",
      })
      .select()
      .single();

    // Update the approved application with the applicant user_id
    if (applicantUser && createdApplications[1]) {
      await supabase
        .from('applications')
        .update({ user_id: applicantUser.id })
        .eq('id', createdApplications[1].id);
    }

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
