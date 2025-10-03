export interface RegistrationPackage {
  id: string;
  program: string;
  term: string;
  mode: string;
  credits: number;
  admissionFee: number;
  perCredit: number;
  fixedFees: number;
  totalEstimated: number;
}

export const registrationPackages: RegistrationPackage[] = [
  { id: 'pkg-001', program: "LLB (Hon's) Program Fall 2025 (Tri-Semester)", term: 'Fall 2025', mode: 'Trimester', credits: 137, admissionFee: 13000, perCredit: 3800, fixedFees: 30000, totalEstimated: 610000 },
  { id: 'pkg-002', program: 'MAE Fall 2025', term: 'Fall 2025', mode: 'Masters / Evening', credits: 36, admissionFee: 11200, perCredit: 4000, fixedFees: 15000, totalEstimated: 170000 },
  { id: 'pkg-003', program: 'Textile Engineering Fall 2025', term: 'Fall 2025', mode: 'Bachelor / Day', credits: 164, admissionFee: 13000, perCredit: 2600, fixedFees: 35000, totalEstimated: 500000 },
  { id: 'pkg-004', program: 'ELL Fall 2025', term: 'Fall 2025', mode: 'Bachelor / Day', credits: 132, admissionFee: 13000, perCredit: 1500, fixedFees: 20000, totalEstimated: 220000 },
  { id: 'pkg-005', program: "Bangla (Hon's) Fall 2025", term: 'Fall 2025', mode: 'Bachelor / Day', credits: 120, admissionFee: 13000, perCredit: 1000, fixedFees: 15000, totalEstimated: 160000 },
  { id: 'pkg-006', program: 'CSE Fall 2025', term: 'Fall 2025', mode: 'Bachelor / Day', credits: 152, admissionFee: 13000, perCredit: 3500, fixedFees: 35000, totalEstimated: 565000 },
  { id: 'pkg-007', program: 'EEE Fall 2025', term: 'Fall 2025', mode: 'Bachelor / Day', credits: 160, admissionFee: 13000, perCredit: 2800, fixedFees: 40000, totalEstimated: 530000 },
  { id: 'pkg-008', program: 'BBA Fall 2025', term: 'Fall 2025', mode: 'Bachelor / Day', credits: 129, admissionFee: 13000, perCredit: 3400, fixedFees: 25000, totalEstimated: 510000 },
  { id: 'pkg-009', program: 'MPH Fall 2025', term: 'Fall 2025', mode: 'Masters / Day', credits: 36, admissionFee: 11200, perCredit: 4000, fixedFees: 10000, totalEstimated: 160000 },
  { id: 'pkg-010', program: 'LLM Fall 2025', term: 'Fall 2025', mode: 'Masters', credits: 36, admissionFee: 11200, perCredit: 4200, fixedFees: 10000, totalEstimated: 162000 },
  { id: 'pkg-011', program: 'ME Fall 2025', term: 'Fall 2025', mode: 'Bachelor / Day', credits: 160, admissionFee: 13000, perCredit: 3000, fixedFees: 40000, totalEstimated: 525000 },
  { id: 'pkg-012', program: 'CE Fall 2025', term: 'Fall 2025', mode: 'Bachelor / Day', credits: 160, admissionFee: 13000, perCredit: 3000, fixedFees: 40000, totalEstimated: 525000 },
  { id: 'pkg-013', program: 'BPharm Fall 2025', term: 'Fall 2025', mode: 'Bachelor / Day', credits: 160, admissionFee: 13000, perCredit: 3600, fixedFees: 35000, totalEstimated: 615000 },
  { id: 'pkg-014', program: "LLB (Hons) Fall 2025 (Bi-Semester)", term: 'Fall 2025', mode: 'Bi-Semester', credits: 137, admissionFee: 13000, perCredit: 3800, fixedFees: 28000, totalEstimated: 600000 },
  { id: 'pkg-015', program: 'BTX Summer 2025 (Textile)', term: 'Summer 2025', mode: 'Bachelor / Summer', credits: 164, admissionFee: 13000, perCredit: 2600, fixedFees: 35000, totalEstimated: 500000 },
  { id: 'pkg-016', program: 'LLM Summer 2025', term: 'Summer 2025', mode: 'Masters', credits: 36, admissionFee: 11200, perCredit: 4200, fixedFees: 10000, totalEstimated: 162000 },
  { id: 'pkg-017', program: 'ELL Summer 2025', term: 'Summer 2025', mode: 'Bachelor / Day', credits: 132, admissionFee: 13000, perCredit: 1500, fixedFees: 20000, totalEstimated: 220000 },
  { id: 'pkg-018', program: 'EEE Summer 2025', term: 'Summer 2025', mode: 'Bachelor / Day', credits: 160, admissionFee: 13000, perCredit: 2800, fixedFees: 40000, totalEstimated: 530000 },
  { id: 'pkg-019', program: 'CSE Summer 2025', term: 'Summer 2025', mode: 'Bachelor / Day', credits: 152, admissionFee: 13000, perCredit: 3500, fixedFees: 35000, totalEstimated: 565000 },
  { id: 'pkg-020', program: 'LLB Summer 2025 (Trimester)', term: 'Summer 2025', mode: 'Trimester', credits: 137, admissionFee: 13000, perCredit: 3800, fixedFees: 30000, totalEstimated: 610000 },

  { id: 'pkg-021', program: "Bangla (Hon's) Summer 2025", term: 'Summer 2025', mode: 'Bachelor / Day', credits: 120, admissionFee: 13000, perCredit: 1000, fixedFees: 15000, totalEstimated: 160000 },
  { id: 'pkg-022', program: 'MPH Summer 2025', term: 'Summer 2025', mode: 'Masters', credits: 36, admissionFee: 11200, perCredit: 4000, fixedFees: 10000, totalEstimated: 165000 },
  { id: 'pkg-023', program: 'MAE Summer 2025', term: 'Summer 2025', mode: 'Masters / Eve', credits: 36, admissionFee: 11200, perCredit: 4000, fixedFees: 15000, totalEstimated: 170000 },
  { id: 'pkg-024', program: 'BBA Summer 2025', term: 'Summer 2025', mode: 'Bachelor / Day', credits: 129, admissionFee: 13000, perCredit: 3400, fixedFees: 25000, totalEstimated: 510000 },
  { id: 'pkg-025', program: 'ME Spring 2025', term: 'Spring 2025', mode: 'Bachelor / Day', credits: 160, admissionFee: 13000, perCredit: 3000, fixedFees: 40000, totalEstimated: 525000 },
  { id: 'pkg-026', program: 'CE Spring 2025', term: 'Spring 2025', mode: 'Bachelor / Day', credits: 160, admissionFee: 13000, perCredit: 3000, fixedFees: 40000, totalEstimated: 525000 },
  { id: 'pkg-027', program: 'BPharm Spring 2025', term: 'Spring 2025', mode: 'Bachelor / Day', credits: 160, admissionFee: 13000, perCredit: 3600, fixedFees: 35000, totalEstimated: 615000 },
  { id: 'pkg-028', program: 'LLM Spring 2025', term: 'Spring 2025', mode: 'Masters', credits: 36, admissionFee: 11200, perCredit: 4200, fixedFees: 10000, totalEstimated: 162000 },
  { id: 'pkg-029', program: 'EEE Spring 2025 (Part-2)', term: 'Spring 2025', mode: 'Bachelor / Day', credits: 160, admissionFee: 13000, perCredit: 2800, fixedFees: 40000, totalEstimated: 530000 },
  { id: 'pkg-030', program: "Bangla (Hon's) Spring 2025", term: 'Spring 2025', mode: 'Bachelor / Day', credits: 120, admissionFee: 13000, perCredit: 1000, fixedFees: 15000, totalEstimated: 160000 },
  { id: 'pkg-031', program: 'LLB (Hons) Spring 2025 (Bi-Semester)', term: 'Spring 2025', mode: 'Bi-Semester', credits: 137, admissionFee: 13000, perCredit: 3800, fixedFees: 28000, totalEstimated: 600000 },
  { id: 'pkg-032', program: 'LLB (Hons) Spring 2025 (Trimester)', term: 'Spring 2025', mode: 'Trimester', credits: 137, admissionFee: 13000, perCredit: 3800, fixedFees: 30000, totalEstimated: 610000 },
  { id: 'pkg-033', program: 'MAE Spring 2025', term: 'Spring 2025', mode: 'Masters / Eve', credits: 36, admissionFee: 11200, perCredit: 4000, fixedFees: 15000, totalEstimated: 170000 },
  { id: 'pkg-034', program: 'CSE Spring 2025', term: 'Spring 2025', mode: 'Bachelor / Day', credits: 152, admissionFee: 13000, perCredit: 3500, fixedFees: 35000, totalEstimated: 565000 },
  { id: 'pkg-035', program: 'EEE Spring 2025', term: 'Spring 2025', mode: 'Bachelor / Day', credits: 160, admissionFee: 13000, perCredit: 2800, fixedFees: 40000, totalEstimated: 530000 },
  { id: 'pkg-036', program: 'Textile Engineering Spring 2025', term: 'Spring 2025', mode: 'Bachelor / Day', credits: 164, admissionFee: 13000, perCredit: 2600, fixedFees: 35000, totalEstimated: 500000 },
  { id: 'pkg-037', program: 'BBA Spring 2025', term: 'Spring 2025', mode: 'Bachelor / Day', credits: 129, admissionFee: 13000, perCredit: 3400, fixedFees: 25000, totalEstimated: 510000 },
  { id: 'pkg-038', program: 'ELL Spring 2025', term: 'Spring 2025', mode: 'Bachelor / Day', credits: 132, admissionFee: 13000, perCredit: 1500, fixedFees: 20000, totalEstimated: 220000 },
  { id: 'pkg-039', program: 'MPH Spring 2025', term: 'Spring 2025', mode: 'Masters', credits: 36, admissionFee: 11200, perCredit: 4000, fixedFees: 10000, totalEstimated: 165000 },
  { id: 'pkg-040', program: 'CE Fall 2024', term: 'Fall 2024', mode: 'Bachelor / Day', credits: 160, admissionFee: 13000, perCredit: 3000, fixedFees: 40000, totalEstimated: 525000 },

  { id: 'pkg-041', program: 'ME Fall 2024', term: 'Fall 2024', mode: 'Bachelor / Day', credits: 160, admissionFee: 13000, perCredit: 3000, fixedFees: 40000, totalEstimated: 525000 },
  { id: 'pkg-042', program: 'LLM Fall 2024', term: 'Fall 2024', mode: 'Masters', credits: 36, admissionFee: 11200, perCredit: 4200, fixedFees: 10000, totalEstimated: 162000 },
  { id: 'pkg-043', program: 'EEE Fall 2024', term: 'Fall 2024', mode: 'Bachelor / Day', credits: 160, admissionFee: 13000, perCredit: 2800, fixedFees: 40000, totalEstimated: 530000 },
  { id: 'pkg-044', program: "Bangla (Hon's) Fall 2024", term: 'Fall 2024', mode: 'Bachelor / Day', credits: 120, admissionFee: 13000, perCredit: 1000, fixedFees: 15000, totalEstimated: 160000 },
  { id: 'pkg-045', program: 'BBA Fall 2024', term: 'Fall 2024', mode: 'Bachelor / Day', credits: 129, admissionFee: 13000, perCredit: 3400, fixedFees: 25000, totalEstimated: 510000 },
  { id: 'pkg-046', program: 'CSE Fall 2024', term: 'Fall 2024', mode: 'Bachelor / Day', credits: 152, admissionFee: 13000, perCredit: 3500, fixedFees: 35000, totalEstimated: 565000 },
  { id: 'pkg-047', program: 'LLB (Hons) Fall 2024', term: 'Fall 2024', mode: 'Bachelor / Day', credits: 137, admissionFee: 13000, perCredit: 3800, fixedFees: 30000, totalEstimated: 610000 },
  { id: 'pkg-048', program: 'BTX Program Fall 2024', term: 'Fall 2024', mode: 'Bachelor / Day', credits: 164, admissionFee: 13000, perCredit: 2600, fixedFees: 35000, totalEstimated: 500000 },
  { id: 'pkg-049', program: 'MPH Fall 2024', term: 'Fall 2024', mode: 'Masters', credits: 36, admissionFee: 11200, perCredit: 4000, fixedFees: 10000, totalEstimated: 165000 },
  { id: 'pkg-050', program: 'ELL Fall 2024', term: 'Fall 2024', mode: 'Bachelor / Day', credits: 132, admissionFee: 13000, perCredit: 1500, fixedFees: 20000, totalEstimated: 220000 },
  { id: 'pkg-051', program: 'MAE Fall 2024', term: 'Fall 2024', mode: 'Masters / Eve', credits: 36, admissionFee: 11200, perCredit: 4000, fixedFees: 15000, totalEstimated: 170000 },
  { id: 'pkg-052', program: 'BPharm Fall 2024', term: 'Fall 2024', mode: 'Bachelor / Day', credits: 160, admissionFee: 13000, perCredit: 3600, fixedFees: 35000, totalEstimated: 615000 },
  { id: 'pkg-053', program: 'LLB (Hons) Fall 2024 (duplicate)', term: 'Fall 2024', mode: 'Bachelor / Day', credits: 137, admissionFee: 13000, perCredit: 3800, fixedFees: 30000, totalEstimated: 610000 },
  { id: 'pkg-054', program: 'MPH Summer 2024', term: 'Summer 2024', mode: 'Masters', credits: 36, admissionFee: 11200, perCredit: 4000, fixedFees: 10000, totalEstimated: 165000 },
  { id: 'pkg-055', program: 'ECE Summer 2024', term: 'Summer 2024', mode: 'Bachelor / Day', credits: 160, admissionFee: 13000, perCredit: 3000, fixedFees: 35000, totalEstimated: 525000 },
  { id: 'pkg-056', program: 'EEE Summer 2024', term: 'Summer 2024', mode: 'Bachelor / Day', credits: 160, admissionFee: 13000, perCredit: 2800, fixedFees: 40000, totalEstimated: 530000 },
  { id: 'pkg-057', program: 'CSE Summer 2024', term: 'Summer 2024', mode: 'Bachelor / Day', credits: 152, admissionFee: 13000, perCredit: 3500, fixedFees: 35000, totalEstimated: 565000 },
  { id: 'pkg-058', program: "Bangla (Hon's) Summer 2024", term: 'Summer 2024', mode: 'Bachelor / Day', credits: 120, admissionFee: 13000, perCredit: 1000, fixedFees: 15000, totalEstimated: 160000 },
  { id: 'pkg-059', program: 'BTX Program Summer 2024', term: 'Summer 2024', mode: 'Bachelor / Day', credits: 164, admissionFee: 13000, perCredit: 2600, fixedFees: 35000, totalEstimated: 500000 },
  { id: 'pkg-060', program: 'LLB (Hons) Summer 2024', term: 'Summer 2024', mode: 'Bachelor / Day', credits: 137, admissionFee: 13000, perCredit: 3800, fixedFees: 30000, totalEstimated: 610000 },
  { id: 'pkg-061', program: 'BBA Summer 2024', term: 'Summer 2024', mode: 'Bachelor / Day', credits: 129, admissionFee: 13000, perCredit: 3400, fixedFees: 25000, totalEstimated: 510000 },
  { id: 'pkg-062', program: 'ELL Summer 2024', term: 'Summer 2024', mode: 'Bachelor / Day', credits: 132, admissionFee: 13000, perCredit: 1500, fixedFees: 20000, totalEstimated: 220000 },
  { id: 'pkg-063', program: 'LLM Summer 2024', term: 'Summer 2024', mode: 'Masters', credits: 36, admissionFee: 11200, perCredit: 4200, fixedFees: 10000, totalEstimated: 162000 },
  { id: 'pkg-064', program: 'MAE Summer 2024', term: 'Summer 2024', mode: 'Masters / Eve', credits: 36, admissionFee: 11200, perCredit: 4000, fixedFees: 15000, totalEstimated: 170000 },
];
