-- Northern University Application System - Supabase Migration
-- Run this script in your Supabase SQL Editor

-- Enable required extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Users table (both applicants and admins)
CREATE TABLE IF NOT EXISTS users (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  uuid UUID UNIQUE NOT NULL DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  email TEXT UNIQUE NOT NULL,
  password_hash TEXT NOT NULL,
  type TEXT NOT NULL CHECK (type IN ('applicant', 'admin')),
  university_id TEXT UNIQUE,
  department TEXT,
  designation TEXT,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Applications table
CREATE TABLE IF NOT EXISTS applications (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  uuid UUID UNIQUE NOT NULL DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(id),
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
  phone_verified BOOLEAN DEFAULT false,
  email_verified BOOLEAN DEFAULT false,
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
  payslip_uploaded BOOLEAN DEFAULT false,
  documents_complete BOOLEAN DEFAULT false,
  referrer_id TEXT,
  referrer_name TEXT,
  application_date TIMESTAMPTZ DEFAULT NOW(),
  approval_date TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Programs table
CREATE TABLE IF NOT EXISTS programs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  code TEXT UNIQUE NOT NULL,
  name TEXT NOT NULL,
  type TEXT NOT NULL,
  duration_years INTEGER NOT NULL,
  total_credits INTEGER NOT NULL,
  base_cost REAL NOT NULL,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Departments table
CREATE TABLE IF NOT EXISTS departments (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  code TEXT UNIQUE NOT NULL,
  name TEXT NOT NULL,
  faculty TEXT NOT NULL,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Waivers table
CREATE TABLE IF NOT EXISTS waivers (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  application_id UUID NOT NULL REFERENCES applications(id),
  type TEXT NOT NULL,
  percentage REAL NOT NULL,
  amount REAL NOT NULL,
  reason TEXT,
  approved_by TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Employee referrers table
CREATE TABLE IF NOT EXISTS employee_referrers (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  employee_id TEXT UNIQUE NOT NULL,
  name TEXT NOT NULL,
  department TEXT NOT NULL,
  designation TEXT NOT NULL,
  commission_rate REAL DEFAULT 0.05,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Sessions table
CREATE TABLE IF NOT EXISTS sessions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES users(id),
  token TEXT UNIQUE NOT NULL,
  expires_at TIMESTAMPTZ NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ID generation tracking
CREATE TABLE IF NOT EXISTS id_generation (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  application_id UUID NOT NULL REFERENCES applications(id),
  university_id TEXT NOT NULL,
  ugc_id TEXT,
  batch TEXT NOT NULL,
  generated_date TIMESTAMPTZ DEFAULT NOW(),
  generated_by TEXT NOT NULL,
  is_sent BOOLEAN DEFAULT false
);

-- Admission settings table
CREATE TABLE IF NOT EXISTS admission_settings (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  application_deadline TIMESTAMPTZ NOT NULL,
  admission_fee REAL NOT NULL DEFAULT 1000,
  late_fee REAL NOT NULL DEFAULT 500,
  late_fee_deadline TIMESTAMPTZ,
  max_applications_per_user INTEGER DEFAULT 3,
  allow_application_editing BOOLEAN DEFAULT true,
  require_phone_verification BOOLEAN DEFAULT true,
  require_email_verification BOOLEAN DEFAULT true,
  require_document_upload BOOLEAN DEFAULT true,
  application_start_date TIMESTAMPTZ NOT NULL,
  session_name TEXT NOT NULL DEFAULT 'Spring 2024',
  admission_notice TEXT,
  payment_instructions TEXT,
  contact_email TEXT DEFAULT 'admission@nu.edu.bd',
  contact_phone TEXT DEFAULT '+8801700000000',
  is_admission_open BOOLEAN DEFAULT true,
  waiver_enabled BOOLEAN DEFAULT true,
  max_waiver_percentage REAL DEFAULT 50,
  auto_approve_applications BOOLEAN DEFAULT false,
  send_sms_notifications BOOLEAN DEFAULT true,
  send_email_notifications BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Payment methods table
CREATE TABLE IF NOT EXISTS payment_methods (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  type TEXT NOT NULL CHECK (type IN ('bank', 'mobile', 'online')),
  account_number TEXT NOT NULL,
  account_name TEXT NOT NULL,
  routing_number TEXT,
  instructions TEXT,
  is_active BOOLEAN DEFAULT true,
  order_priority INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Document requirements table
CREATE TABLE IF NOT EXISTS document_requirements (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  description TEXT NOT NULL,
  is_required BOOLEAN DEFAULT true,
  file_types TEXT DEFAULT 'pdf,jpg,jpeg,png',
  max_file_size_mb INTEGER DEFAULT 5,
  order_priority INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_applications_tracking_id ON applications(tracking_id);
CREATE INDEX IF NOT EXISTS idx_applications_user_id ON applications(user_id);
CREATE INDEX IF NOT EXISTS idx_applications_status ON applications(status);
CREATE INDEX IF NOT EXISTS idx_applications_created_at ON applications(created_at);
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_users_type ON users(type);

-- Insert default admission settings
INSERT INTO admission_settings (
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
  '2024-12-31 23:59:59+00',
  1000,
  500,
  '2025-01-15 23:59:59+00',
  '2024-01-01 00:00:00+00',
  'Spring 2024',
  'Welcome to Northern University Bangladesh Online Admission Portal. Please complete all required fields and submit your application before the deadline.',
  'Please make payment to the designated bank account and upload the payment slip. For any payment related queries, contact our finance department.',
  'admission@nu.edu.bd',
  '+8801700000000'
) ON CONFLICT DO NOTHING;

-- Insert default payment methods
INSERT INTO payment_methods (name, type, account_number, account_name, instructions, order_priority) VALUES
  ('Dutch Bangla Bank', 'bank', '1234567890', 'Northern University Bangladesh', 'Please mention your tracking ID in the deposit slip.', 1),
  ('bKash', 'mobile', '01700000000', 'Northern University', 'Send money to this number and mention your tracking ID.', 2),
  ('Nagad', 'mobile', '01800000000', 'Northern University', 'Send money to this number and mention your tracking ID.', 3)
ON CONFLICT DO NOTHING;

-- Insert default document requirements
INSERT INTO document_requirements (name, description, is_required, order_priority) VALUES
  ('SSC Certificate', 'Upload your SSC/equivalent certificate', true, 1),
  ('HSC Certificate', 'Upload your HSC/equivalent certificate', true, 2),
  ('Passport Size Photo', 'Upload a recent passport size photograph', true, 3),
  ('National ID/Birth Certificate', 'Upload National ID card or Birth Certificate', true, 4),
  ('Guardian National ID', 'Upload guardian National ID card', false, 5)
ON CONFLICT DO NOTHING;

-- Insert sample programs
INSERT INTO programs (code, name, type, duration_years, total_credits, base_cost) VALUES
  ('cse', 'Computer Science and Engineering', 'Bachelor', 4, 160, 92000),
  ('eee', 'Electrical and Electronic Engineering', 'Bachelor', 4, 160, 92000),
  ('masters', 'Master of Science', 'Masters', 2, 48, 150000)
ON CONFLICT DO NOTHING;

-- Insert sample departments  
INSERT INTO departments (code, name, faculty) VALUES
  ('cse', 'Computer Science and Engineering', 'Engineering'),
  ('eee', 'Electrical and Electronic Engineering', 'Engineering'),
  ('math', 'Mathematics', 'Science'),
  ('phy', 'Physics', 'Science')
ON CONFLICT DO NOTHING;

-- Add updated_at trigger function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Add triggers for updated_at
CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_applications_updated_at BEFORE UPDATE ON applications FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_admission_settings_updated_at BEFORE UPDATE ON admission_settings FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_payment_methods_updated_at BEFORE UPDATE ON payment_methods FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_document_requirements_updated_at BEFORE UPDATE ON document_requirements FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
