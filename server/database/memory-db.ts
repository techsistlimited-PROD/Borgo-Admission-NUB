import bcrypt from "bcryptjs";
import { v4 as uuidv4 } from "uuid";

// In-memory database for serverless environments
export interface User {
  id: number;
  uuid: string;
  name: string;
  email: string;
  password_hash: string;
  type: 'admin' | 'applicant';
  university_id?: string;
  department?: string;
  designation?: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface Application {
  id: number;
  uuid: string;
  user_id: number;
  tracking_id: string;
  status: 'pending' | 'approved' | 'rejected';
  program: string;
  department: string;
  session: string;
  first_name: string;
  last_name: string;
  phone: string;
  email?: string;
  phone_verified: boolean;
  email_verified: boolean;
  date_of_birth?: string;
  gender?: string;
  address?: string;
  city?: string;
  postal_code?: string;
  country: string;
  guardian_name?: string;
  guardian_phone?: string;
  guardian_relation?: string;
  ssc_institution?: string;
  ssc_year?: number;
  ssc_gpa?: number;
  hsc_institution?: string;
  hsc_year?: number;
  hsc_gpa?: number;
  bachelor_institution?: string;
  bachelor_year?: number;
  bachelor_cgpa?: number;
  master_institution?: string;
  master_year?: number;
  master_cgpa?: number;
  other_qualifications?: string;
  total_cost: number;
  waiver_amount: number;
  final_amount: number;
  payment_status: 'pending' | 'paid' | 'partial';
  payslip_uploaded: boolean;
  documents_complete: boolean;
  referrer_id?: string;
  referrer_name?: string;
  application_date: string;
  approval_date?: string;
  created_at: string;
  updated_at: string;
}

export interface Session {
  id: number;
  user_id: number;
  token: string;
  expires_at: string;
  created_at: string;
}

// In-memory storage
let users: User[] = [];
let applications: Application[] = [];
let sessions: Session[] = [];
let programs: any[] = [];
let departments: any[] = [];
let admissionSettings: any[] = [];
let paymentMethods: any[] = [];
let documentRequirements: any[] = [];

let initialized = false;
let nextUserId = 1;
let nextApplicationId = 1;
let nextSessionId = 1;

export const initializeMemoryDB = async () => {
  if (initialized) {
    console.log("✅ Memory database already initialized");
    return;
  }

  console.log("🔄 Initializing memory database...");

  // Create admin users
  const adminPassword = await bcrypt.hash("admin123", 10);
  
  users.push({
    id: nextUserId++,
    uuid: uuidv4(),
    name: "Dr. Mohammad Rahman",
    email: "admin@nu.edu.bd",
    password_hash: adminPassword,
    type: "admin",
    department: "Administration",
    designation: "Admission Officer",
    is_active: true,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  });

  users.push({
    id: nextUserId++,
    uuid: uuidv4(),
    name: "Prof. Fatima Ahmed",
    email: "fatima@nu.edu.bd",
    password_hash: adminPassword,
    type: "admin",
    department: "Computer Science",
    designation: "Department Head",
    is_active: true,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  });

  // Create applicant user
  const applicantPassword = await bcrypt.hash("temp123456", 10);
  
  users.push({
    id: nextUserId++,
    uuid: uuidv4(),
    name: "Fatima Ahmed",
    email: "fatima@email.com",
    password_hash: applicantPassword,
    type: "applicant",
    university_id: "NU24MBA002",
    department: "Business Administration",
    is_active: true,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  });

  // Add programs
  programs = [
    {
      id: 1,
      code: "BSC_CS",
      name: "BSc Computer Science",
      type: "undergraduate",
      duration_years: 4,
      total_credits: 120,
      base_cost: 180000,
      is_active: true,
      created_at: new Date().toISOString()
    },
    {
      id: 2,
      code: "BSC_EEE",
      name: "BSc Electrical & Electronic Engineering",
      type: "undergraduate",
      duration_years: 4,
      total_credits: 120,
      base_cost: 200000,
      is_active: true,
      created_at: new Date().toISOString()
    },
    {
      id: 3,
      code: "MBA",
      name: "Master of Business Administration",
      type: "postgraduate",
      duration_years: 2,
      total_credits: 60,
      base_cost: 150000,
      is_active: true,
      created_at: new Date().toISOString()
    }
  ];

  // Add departments
  departments = [
    {
      id: 1,
      code: "CSE",
      name: "Computer Science & Engineering",
      faculty: "Faculty of Engineering",
      is_active: true,
      created_at: new Date().toISOString()
    },
    {
      id: 2,
      code: "EEE",
      name: "Electrical & Electronic Engineering", 
      faculty: "Faculty of Engineering",
      is_active: true,
      created_at: new Date().toISOString()
    },
    {
      id: 3,
      code: "BBA",
      name: "Business Administration",
      faculty: "Faculty of Business",
      is_active: true,
      created_at: new Date().toISOString()
    }
  ];

  // Add admission settings
  admissionSettings = [{
    id: 1,
    application_deadline: "2024-12-31T23:59:59Z",
    admission_fee: 1000,
    late_fee: 500,
    late_fee_deadline: "2025-01-15T23:59:59Z",
    max_applications_per_user: 3,
    allow_application_editing: true,
    require_phone_verification: true,
    require_email_verification: true,
    require_document_upload: true,
    application_start_date: "2024-01-01T00:00:00Z",
    session_name: "Spring 2024",
    admission_notice: "Welcome to Northern University Bangladesh Online Admission Portal.",
    payment_instructions: "Please make payment to the designated bank account and upload the payment slip.",
    contact_email: "admission@nu.edu.bd",
    contact_phone: "+8801700000000",
    is_admission_open: true,
    waiver_enabled: true,
    max_waiver_percentage: 50,
    auto_approve_applications: false,
    send_sms_notifications: true,
    send_email_notifications: true,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  }];

  // Add sample applications
  applications.push({
    id: nextApplicationId++,
    uuid: uuidv4(),
    user_id: 3, // Applicant user
    tracking_id: "NU24001001",
    status: "approved",
    program: "MBA",
    department: "BBA",
    session: "Spring 2024",
    first_name: "Fatima",
    last_name: "Ahmed",
    phone: "+8801234567892",
    email: "fatima@email.com",
    phone_verified: true,
    email_verified: true,
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
    waiver_amount: 0,
    final_amount: 150000,
    payment_status: "paid",
    payslip_uploaded: true,
    documents_complete: true,
    referrer_id: "NU-FAC-002",
    referrer_name: "Prof. Fatima Ahmed",
    application_date: new Date().toISOString(),
    approval_date: new Date().toISOString(),
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  });

  initialized = true;
  console.log("✅ Memory database initialized successfully");
  console.log("\n📋 Demo Credentials:");
  console.log("🔐 Admin Login:");
  console.log("   Email: admin@nu.edu.bd");
  console.log("   Password: admin123");
  console.log("");
  console.log("🎓 Applicant Login:");
  console.log("   University ID: NU24MBA002");
  console.log("   Password: temp123456");
};

// Database operation functions
export const memoryDbGet = async (table: string, where: any): Promise<any> => {
  await initializeMemoryDB();
  
  switch (table) {
    case 'users':
      return users.find(user => {
        if (where.email && where.type) {
          return user.email === where.email && user.type === where.type && user.is_active;
        }
        if (where.university_id && where.type) {
          return user.university_id === where.university_id && user.type === where.type && user.is_active;
        }
        if (where.id) {
          return user.id === where.id;
        }
        return false;
      });
    case 'sessions':
      return sessions.find(session => session.token === where.token);
    default:
      return null;
  }
};

export const memoryDbRun = async (table: string, operation: string, data: any): Promise<any> => {
  await initializeMemoryDB();
  
  switch (table) {
    case 'sessions':
      if (operation === 'insert') {
        const session = {
          id: nextSessionId++,
          user_id: data.user_id,
          token: data.token,
          expires_at: data.expires_at,
          created_at: new Date().toISOString()
        };
        sessions.push(session);
        return { lastID: session.id };
      }
      if (operation === 'delete') {
        const index = sessions.findIndex(s => s.token === data.token);
        if (index > -1) {
          sessions.splice(index, 1);
        }
        return { changes: index > -1 ? 1 : 0 };
      }
      break;
    case 'users':
      if (operation === 'update') {
        const user = users.find(u => u.id === data.id);
        if (user) {
          Object.assign(user, data.updates);
          user.updated_at = new Date().toISOString();
        }
        return { changes: user ? 1 : 0 };
      }
      break;
  }
  
  return { lastID: 0, changes: 0 };
};

export const memoryDbAll = async (table: string, where?: any): Promise<any[]> => {
  await initializeMemoryDB();
  
  switch (table) {
    case 'applications':
      if (where?.user_id) {
        return applications.filter(app => app.user_id === where.user_id);
      }
      return applications;
    case 'programs':
      return programs.filter(p => where?.is_active !== false || p.is_active);
    case 'departments':
      return departments.filter(d => where?.is_active !== false || d.is_active);
    case 'admission_settings':
      return admissionSettings;
    default:
      return [];
  }
};
