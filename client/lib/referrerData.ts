// Referrer Data System for Reference ID Lookup

export interface Referrer {
  id: string;
  universityId: string;
  name: string;
  namebn: string;
  department: string;
  departmentbn: string;
  designation: string;
  designationbn: string;
  faculty: string;
  facultybn: string;
  email: string;
  phone: string;
  isActive: boolean;
  joinDate: string;
}

// Sample referrer data - in real system this would come from database
export const referrers: Referrer[] = [
  {
    id: '1',
    universityId: 'NU-FAC-001',
    name: 'Dr. Mohammad Rahman',
    namebn: 'ড. মোহাম্মদ রহমান',
    department: 'Computer Science & Engineering',
    departmentbn: 'কম্পিউটার সায়েন্স ও ইঞ্জিনিয়ারিং',
    designation: 'Professor',
    designationbn: 'অধ্যাপক',
    faculty: 'Faculty of Engineering',
    facultybn: 'ইঞ্জিনিয়ারিং অনুষদ',
    email: 'rahman@nu.edu.bd',
    phone: '+880-2-12345678',
    isActive: true,
    joinDate: '2018-03-15'
  },
  {
    id: '2',
    universityId: 'NU-FAC-002',
    name: 'Prof. Fatima Ahmed',
    namebn: 'প্রফেসর ফাতিমা আহমেদ',
    department: 'Business Administration',
    departmentbn: 'বিজনেস অ্যাডমিনিস্ট্রেশন',
    designation: 'Associate Professor',
    designationbn: 'সহযোগী অধ্যাপক',
    faculty: 'Faculty of Business',
    facultybn: 'ব্যবসা অনুষদ',
    email: 'fatima@nu.edu.bd',
    phone: '+880-2-12345679',
    isActive: true,
    joinDate: '2019-08-20'
  },
  {
    id: '3',
    universityId: 'NU-ADM-001',
    name: 'Abdul Karim',
    namebn: 'আব্দুল করিম',
    department: 'Admissions Office',
    departmentbn: 'ভর্তি অফিস',
    designation: 'Admission Officer',
    designationbn: 'ভর্তি কর্মকর্তা',
    faculty: 'Administration',
    facultybn: 'প্রশাসন',
    email: 'karim@nu.edu.bd',
    phone: '+880-2-12345680',
    isActive: true,
    joinDate: '2020-01-10'
  },
  {
    id: '4',
    universityId: 'NU-FAC-003',
    name: 'Dr. Rashida Begum',
    namebn: 'ড. রশিদা বেগম',
    department: 'English Language & Literature',
    departmentbn: 'ইংরেজি ভাষা ও সাহিত্য',
    designation: 'Assistant Professor',
    designationbn: 'সহকারী অধ্যাপক',
    faculty: 'Faculty of Arts',
    facultybn: 'কলা অনুষদ',
    email: 'rashida@nu.edu.bd',
    phone: '+880-2-12345681',
    isActive: true,
    joinDate: '2021-06-01'
  },
  {
    id: '5',
    universityId: 'NU-STF-001',
    name: 'Mohammad Ali',
    namebn: 'মোহাম্মদ আলী',
    department: 'Student Affairs',
    departmentbn: 'ছাত্র বিষয়ক',
    designation: 'Student Counselor',
    designationbn: 'ছাত্র পরামর্শদাতা',
    faculty: 'Administration',
    facultybn: 'প্রশাসন',
    email: 'ali@nu.edu.bd',
    phone: '+880-2-12345682',
    isActive: true,
    joinDate: '2022-02-15'
  },
  {
    id: '6',
    universityId: 'NU-FAC-004',
    name: 'Dr. Sarah Khan',
    namebn: 'ড. সারাহ খান',
    department: 'Public Health',
    departmentbn: 'জনস্বাস্থ্য',
    designation: 'Professor',
    designationbn: 'অধ্যাপক',
    faculty: 'Faculty of Health Sciences',
    facultybn: 'স্বাস্থ্য বিজ্ঞান অনুষদ',
    email: 'sarah@nu.edu.bd',
    phone: '+880-2-12345683',
    isActive: true,
    joinDate: '2017-11-20'
  }
];

// Helper Functions
export const getReferrerByUniversityId = (universityId: string): Referrer | null => {
  const referrer = referrers.find(ref => 
    ref.universityId.toLowerCase() === universityId.toLowerCase() && ref.isActive
  );
  return referrer || null;
};

export const validateReferenceId = (referenceId: string): boolean => {
  // Basic validation - should match pattern NU-XXX-000
  const pattern = /^NU-[A-Z]{3}-\d{3}$/;
  return pattern.test(referenceId.toUpperCase());
};

export const formatReferenceId = (referenceId: string): string => {
  // Format to uppercase and standard format
  return referenceId.toUpperCase().trim();
};

export const searchReferrers = (query: string): Referrer[] => {
  const searchTerm = query.toLowerCase();
  return referrers.filter(ref => 
    ref.isActive && (
      ref.name.toLowerCase().includes(searchTerm) ||
      ref.namebn.includes(searchTerm) ||
      ref.universityId.toLowerCase().includes(searchTerm) ||
      ref.department.toLowerCase().includes(searchTerm) ||
      ref.departmentbn.includes(searchTerm)
    )
  );
};

// Commission calculation (for admin purposes)
export const calculateReferralCommission = (
  numberOfReferrals: number,
  baseCommissionRate: number = 2000 // Base commission per successful referral
): number => {
  // Progressive commission rates
  let totalCommission = 0;
  
  for (let i = 1; i <= numberOfReferrals; i++) {
    if (i <= 5) {
      totalCommission += baseCommissionRate; // 2000 BDT for first 5
    } else if (i <= 15) {
      totalCommission += baseCommissionRate * 1.5; // 3000 BDT for 6-15
    } else {
      totalCommission += baseCommissionRate * 2; // 4000 BDT for 16+
    }
  }
  
  return totalCommission;
};

export const getReferralStats = (referrerId: string): {
  totalReferrals: number;
  successfulReferrals: number;
  pendingReferrals: number;
  estimatedCommission: number;
} => {
  // Mock data - in real system this would come from database
  const mockStats = {
    totalReferrals: Math.floor(Math.random() * 50) + 10,
    successfulReferrals: Math.floor(Math.random() * 30) + 5,
    pendingReferrals: Math.floor(Math.random() * 10) + 2,
    estimatedCommission: 0
  };
  
  mockStats.estimatedCommission = calculateReferralCommission(mockStats.successfulReferrals);
  
  return mockStats;
};
