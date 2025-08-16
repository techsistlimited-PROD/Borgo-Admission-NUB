// Student ID Generation System for University ID and UGC ID

export interface StudentIDPair {
  universityId: string;
  ugcId: string;
  generatedDate: string;
  studentName: string;
  program: string;
  department: string;
  batch: string;
  isActive: boolean;
}

// ID Generation Patterns
const UNIVERSITY_ID_PREFIX = 'NU';
const UGC_ID_PREFIX = 'UGC-NU';

// Department codes mapping
export const departmentCodes: Record<string, string> = {
  'cse': 'CS',
  'eee': 'EE', 
  'te': 'TE',
  'me': 'ME',
  'ce': 'CE',
  'bba': 'BA',
  'bangla': 'BL',
  'english': 'EN',
  'ge': 'GE',
  'gpp': 'GP',
  'law': 'LW',
  'pharmacy': 'PH',
  'ph': 'PH'
};

// Program codes mapping
export const programCodes: Record<string, string> = {
  'bachelor': 'B',
  'masters': 'M',
  'mba': 'MBA',
  'diploma': 'D'
};

// Generate University ID
// Format: NU{Year}{Program}{Department}{Sequential}
// Example: NU24BCS001, NU24MEE015
export const generateUniversityId = (
  program: string,
  department: string,
  year: number = new Date().getFullYear(),
  sequentialNumber: number = 1
): string => {
  const yearSuffix = year.toString().slice(-2); // Last 2 digits of year
  const programCode = programCodes[program] || 'B';
  const deptCode = departmentCodes[department] || 'XX';
  const sequential = sequentialNumber.toString().padStart(3, '0');
  
  return `${UNIVERSITY_ID_PREFIX}${yearSuffix}${programCode}${deptCode}${sequential}`;
};

// Generate UGC ID 
// Format: UGC-NU-{Year}-{Department}-{Sequential}-{CheckDigit}
// Example: UGC-NU-2024-CS-001234-7
export const generateUGCId = (
  department: string,
  year: number = new Date().getFullYear(),
  sequentialNumber: number = 1
): string => {
  const deptCode = departmentCodes[department] || 'XX';
  const sequential = sequentialNumber.toString().padStart(6, '0');
  
  // Generate check digit using modulo 10 algorithm
  const baseString = `${year}${deptCode}${sequential}`;
  const checkDigit = calculateCheckDigit(baseString);
  
  return `${UGC_ID_PREFIX}-${year}-${deptCode}-${sequential}-${checkDigit}`;
};

// Calculate check digit for UGC ID validation
const calculateCheckDigit = (input: string): number => {
  let sum = 0;
  let alternate = false;
  
  // Process from right to left
  for (let i = input.length - 1; i >= 0; i--) {
    let digit = parseInt(input.charAt(i));
    
    if (alternate) {
      digit *= 2;
      if (digit > 9) {
        digit = (digit % 10) + 1;
      }
    }
    
    sum += digit;
    alternate = !alternate;
  }
  
  return (10 - (sum % 10)) % 10;
};

// Generate both IDs as a pair
export const generateStudentIDPair = (
  studentName: string,
  program: string,
  department: string,
  year: number = new Date().getFullYear(),
  sequentialNumber: number = 1
): StudentIDPair => {
  const universityId = generateUniversityId(program, department, year, sequentialNumber);
  const ugcId = generateUGCId(department, year, sequentialNumber);
  const batch = `${year}-${(year + getBatchDuration(program)).toString().slice(-2)}`;
  
  return {
    universityId,
    ugcId,
    generatedDate: new Date().toISOString(),
    studentName,
    program,
    department,
    batch,
    isActive: true
  };
};

// Get batch duration based on program
const getBatchDuration = (program: string): number => {
  const durations: Record<string, number> = {
    'bachelor': 4,
    'masters': 2,
    'mba': 2,
    'diploma': 1
  };
  return durations[program] || 4;
};

// Validate University ID format
export const validateUniversityId = (id: string): boolean => {
  // Pattern: NU{2digits}{1-3chars}{2chars}{3digits}
  const pattern = /^NU\d{2}[A-Z]{1,3}[A-Z]{2}\d{3}$/;
  return pattern.test(id);
};

// Validate UGC ID format
export const validateUGCId = (id: string): boolean => {
  // Pattern: UGC-NU-{4digits}-{2chars}-{6digits}-{1digit}
  const pattern = /^UGC-NU-\d{4}-[A-Z]{2}-\d{6}-\d$/;
  return pattern.test(id);
};

// Extract information from University ID
export const parseUniversityId = (id: string): {
  year: number;
  program: string;
  department: string;
  sequential: number;
} | null => {
  if (!validateUniversityId(id)) return null;
  
  try {
    const year = 2000 + parseInt(id.substring(2, 4));
    const programDeptPart = id.substring(4, id.length - 3);
    const sequential = parseInt(id.substring(id.length - 3));
    
    // This is a simplified parsing - in real system would need more sophisticated logic
    return {
      year,
      program: 'bachelor', // Would need reverse lookup
      department: 'cse', // Would need reverse lookup
      sequential
    };
  } catch {
    return null;
  }
};

// Generate next sequential number (mock function - in real system would query database)
export const getNextSequentialNumber = (program: string, department: string, year: number): number => {
  // Mock implementation - in real system this would query the database
  // to find the highest sequential number for the given program/department/year
  return Math.floor(Math.random() * 100) + 1;
};

// Sample generated IDs for testing/display
export const sampleStudentIDs: StudentIDPair[] = [
  {
    universityId: 'NU24BCS001',
    ugcId: 'UGC-NU-2024-CS-000001-7',
    generatedDate: '2024-01-15T10:30:00Z',
    studentName: 'Mohammad Rahman',
    program: 'bachelor',
    department: 'cse',
    batch: '2024-28',
    isActive: true
  },
  {
    universityId: 'NU24MBA002', 
    ugcId: 'UGC-NU-2024-BA-000002-5',
    generatedDate: '2024-01-16T14:45:00Z',
    studentName: 'Fatima Ahmed',
    program: 'mba',
    department: 'bba',
    batch: '2024-26',
    isActive: true
  },
  {
    universityId: 'NU24MEE003',
    ugcId: 'UGC-NU-2024-EE-000003-2',
    generatedDate: '2024-01-17T09:15:00Z',
    studentName: 'Abdul Karim',
    program: 'masters',
    department: 'eee',
    batch: '2024-26',
    isActive: true
  }
];

// Communication functions for sending IDs
export const sendUniversityIdViaSMS = (phone: string, universityId: string, studentName: string): Promise<boolean> => {
  // Mock SMS sending function
  console.log(`SMS sent to ${phone}: Welcome ${studentName}! Your University ID is: ${universityId}. Keep this safe for all university activities.`);
  return Promise.resolve(true);
};

export const sendUniversityIdViaEmail = (email: string, universityId: string, studentName: string): Promise<boolean> => {
  // Mock email sending function
  console.log(`Email sent to ${email}: 
    Subject: Your Northern University Bangladesh Student ID
    
    Dear ${studentName},
    
    Congratulations! Your admission has been confirmed.
    
    Your University Student ID: ${universityId}
    
    Please keep this ID safe as it will be used for:
    - All university communications
    - Exam registrations
    - Library access
    - Student portal login
    - Certificate processing
    
    Best regards,
    Admissions Office
    Northern University Bangladesh`);
  return Promise.resolve(true);
};

// Search student by University ID
export const findStudentByUniversityId = (universityId: string): StudentIDPair | null => {
  return sampleStudentIDs.find(student => student.universityId === universityId) || null;
};

// Search student by UGC ID
export const findStudentByUGCId = (ugcId: string): StudentIDPair | null => {
  return sampleStudentIDs.find(student => student.ugcId === ugcId) || null;
};

// Get all students for a specific batch/year
export const getStudentsByBatch = (year: number): StudentIDPair[] => {
  return sampleStudentIDs.filter(student => student.batch.startsWith(year.toString()));
};

// Get statistics
export const getIDGenerationStats = (): {
  totalGenerated: number;
  activeStudents: number;
  byProgram: Record<string, number>;
  byDepartment: Record<string, number>;
} => {
  const active = sampleStudentIDs.filter(s => s.isActive);
  
  const byProgram: Record<string, number> = {};
  const byDepartment: Record<string, number> = {};
  
  active.forEach(student => {
    byProgram[student.program] = (byProgram[student.program] || 0) + 1;
    byDepartment[student.department] = (byDepartment[student.department] || 0) + 1;
  });
  
  return {
    totalGenerated: sampleStudentIDs.length,
    activeStudents: active.length,
    byProgram,
    byDepartment
  };
};
