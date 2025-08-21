/**
 * Comprehensive eligibility rules system for Northern University Bangladesh
 * Based on official admission requirements
 */

export type AcademicBackgroundType =
  | "bangla_medium" // SSC + HSC (GPA)
  | "english_medium" // O Level + A Level (CGPA)
  | "diploma" // SSC + Diploma (GPA + CGPA)
  | "postgraduate" // Bachelor's degree (CGPA)
  | "foreign"; // Foreign qualifications

export type AdmissionRoute = "regular" | "direct" | "admission_test";

export interface AcademicRecord {
  backgroundType: AcademicBackgroundType;

  // For Bangla Medium (SSC + HSC)
  sscGPA?: number;
  hscGPA?: number;
  sscYear?: number;
  hscYear?: number;

  // For English Medium (O + A Level)
  oLevelSubjects?: OLevelSubject[];
  aLevelSubjects?: ALevelSubject[];

  // For Diploma students
  diplomaCGPA?: number;
  diplomaProgram?: string;

  // For Postgraduate
  bachelorCGPA?: number;
  bachelorDegree?: string;
  bachelorInstitution?: string;
  workExperience?: number; // in years

  // Additional
  hasThirdDivision?: boolean;
  hasScienceBackground?: boolean;
}

export interface OLevelSubject {
  subject: string;
  grade: "A" | "B" | "C" | "D" | "E";
  gpa: number; // A=5, B=4, C=3.5, D=3, E=2
}

export interface ALevelSubject {
  subject: string;
  grade: "A" | "B" | "C" | "D" | "E";
  gpa: number;
}

export interface ProgramEligibilityRule {
  programId: string;
  programName: string;
  level: "undergraduate" | "postgraduate";

  // Admission requirements
  requiresAdmissionTest: boolean;
  requiresViva: boolean;
  admissionTestFee?: number; // in BDT

  // Eligibility rules by background type
  eligibilityRules: {
    bangla_medium?: BanglaMediumRule;
    english_medium?: EnglishMediumRule;
    diploma?: DiplomaRule;
    postgraduate?: PostgraduateRule;
  };

  // Subject requirements
  subjectRequirements?: string[];
  specialRequirements?: string[];

  // Year restrictions
  allowedPassingYears?: number[]; // e.g., [2021, 2022, 2023]
}

export interface BanglaMediumRule {
  minimumSSCGPA: number;
  minimumHSCGPA: number;
  minimumTotalGPA: number; // SSC + HSC
  allowedGroups?: string[]; // Science, Commerce, Arts
}

export interface EnglishMediumRule {
  minimumOLevelSubjects: number; // at least 5
  minimumALevelSubjects: number; // at least 2
  requiredGrades: {
    countOfBGrades: number; // 4 B's required
    countOfCGrades: number; // 3 C's required
  };
  specificSubjectRequirements?: {
    [subject: string]: "A" | "B" | "C" | "D" | "E";
  };
}

export interface DiplomaRule {
  minimumSSCGPA: number;
  minimumDiplomaCGPA: number;
  minimumTotalGPA: number; // SSC + Diploma
  allowedDiplomaPrograms?: string[];
  requiresScienceBackground: boolean;
}

export interface PostgraduateRule {
  minimumBachelorCGPA: number;
  noThirdDivision: boolean;
  requiredBachelorDegree?: string[];
  minimumWorkExperience?: number; // for EMBA
  specificRequirements?: string[];
}

export interface EligibilityCheckResult {
  isEligible: boolean;
  route: AdmissionRoute;
  requiresAdmissionTest: boolean;
  requiresViva: boolean;
  admissionTestFee?: number;
  missingRequirements: string[];
  warnings: string[];
  suggestedPrograms: ProgramEligibilityRule[];
  calculatedScores?: {
    totalGPA?: number;
    oALevelScore?: number;
  };
}

// Program eligibility rules
const PROGRAM_ELIGIBILITY_RULES: ProgramEligibilityRule[] = [
  {
    programId: "bsc_cse",
    programName: "B.Sc. in Computer Science & Engineering",
    level: "undergraduate",
    requiresAdmissionTest: true,
    requiresViva: true,
    admissionTestFee: 500,
    eligibilityRules: {
      bangla_medium: {
        minimumSSCGPA: 3.0,
        minimumHSCGPA: 3.0,
        minimumTotalGPA: 7.0,
        allowedGroups: ["Science"],
      },
      english_medium: {
        minimumOLevelSubjects: 5,
        minimumALevelSubjects: 2,
        requiredGrades: {
          countOfBGrades: 4,
          countOfCGrades: 3,
        },
      },
      diploma: {
        minimumSSCGPA: 3.0,
        minimumDiplomaCGPA: 3.0,
        minimumTotalGPA: 6.5,
        allowedDiplomaPrograms: ["Computer Science", "Engineering"],
        requiresScienceBackground: true,
      },
    },
    subjectRequirements: ["Science background required"],
    allowedPassingYears: [2021, 2022, 2023],
  },
  {
    programId: "bsc_eee",
    programName: "B.Sc. in Electrical & Electronic Engineering",
    level: "undergraduate",
    requiresAdmissionTest: true,
    requiresViva: true,
    admissionTestFee: 500,
    eligibilityRules: {
      bangla_medium: {
        minimumSSCGPA: 3.0,
        minimumHSCGPA: 3.0,
        minimumTotalGPA: 7.0,
        allowedGroups: ["Science"],
      },
      english_medium: {
        minimumOLevelSubjects: 5,
        minimumALevelSubjects: 2,
        requiredGrades: {
          countOfBGrades: 4,
          countOfCGrades: 3,
        },
      },
      diploma: {
        minimumSSCGPA: 3.0,
        minimumDiplomaCGPA: 3.0,
        minimumTotalGPA: 6.5,
        allowedDiplomaPrograms: ["Electrical Engineering", "Electronics"],
        requiresScienceBackground: true,
      },
    },
    subjectRequirements: ["Science background required"],
    allowedPassingYears: [2021, 2022, 2023],
  },
  {
    programId: "bsc_ce",
    programName: "B.Sc. in Civil Engineering",
    level: "undergraduate",
    requiresAdmissionTest: true,
    requiresViva: true,
    admissionTestFee: 500,
    eligibilityRules: {
      bangla_medium: {
        minimumSSCGPA: 3.0,
        minimumHSCGPA: 3.0,
        minimumTotalGPA: 7.0,
        allowedGroups: ["Science"],
      },
      english_medium: {
        minimumOLevelSubjects: 5,
        minimumALevelSubjects: 2,
        requiredGrades: {
          countOfBGrades: 4,
          countOfCGrades: 3,
        },
      },
      diploma: {
        minimumSSCGPA: 3.0,
        minimumDiplomaCGPA: 3.0,
        minimumTotalGPA: 6.5,
        allowedDiplomaPrograms: ["Civil Engineering"],
        requiresScienceBackground: true,
      },
    },
    subjectRequirements: ["Science background required"],
    allowedPassingYears: [2021, 2022, 2023],
  },
  {
    programId: "b_arch",
    programName: "Bachelor of Architecture",
    level: "undergraduate",
    requiresAdmissionTest: true,
    requiresViva: true,
    admissionTestFee: 500,
    eligibilityRules: {
      bangla_medium: {
        minimumSSCGPA: 3.0,
        minimumHSCGPA: 3.0,
        minimumTotalGPA: 7.0,
        allowedGroups: ["Science"],
      },
      english_medium: {
        minimumOLevelSubjects: 5,
        minimumALevelSubjects: 2,
        requiredGrades: {
          countOfBGrades: 4,
          countOfCGrades: 3,
        },
      },
      diploma: {
        minimumSSCGPA: 3.0,
        minimumDiplomaCGPA: 3.0,
        minimumTotalGPA: 6.5,
        allowedDiplomaPrograms: ["Architecture"],
        requiresScienceBackground: true,
      },
    },
    subjectRequirements: [
      "Science background required",
      "Free hand drawing skills",
    ],
    specialRequirements: ["Portfolio submission required"],
    allowedPassingYears: [2021, 2022, 2023],
  },
  {
    programId: "bba",
    programName: "Bachelor of Business Administration (BBA)",
    level: "undergraduate",
    requiresAdmissionTest: true,
    requiresViva: true,
    admissionTestFee: 500,
    eligibilityRules: {
      bangla_medium: {
        minimumSSCGPA: 3.0,
        minimumHSCGPA: 3.0,
        minimumTotalGPA: 7.0,
        allowedGroups: ["Science", "Commerce", "Arts"],
      },
      english_medium: {
        minimumOLevelSubjects: 5,
        minimumALevelSubjects: 2,
        requiredGrades: {
          countOfBGrades: 4,
          countOfCGrades: 3,
        },
      },
    },
    allowedPassingYears: [2021, 2022, 2023],
  },
  {
    programId: "ba_english",
    programName: "B.A. (Hons.) in English",
    level: "undergraduate",
    requiresAdmissionTest: true,
    requiresViva: true,
    admissionTestFee: 500,
    eligibilityRules: {
      bangla_medium: {
        minimumSSCGPA: 3.0,
        minimumHSCGPA: 3.0,
        minimumTotalGPA: 7.0,
        allowedGroups: ["Science", "Commerce", "Arts"],
      },
      english_medium: {
        minimumOLevelSubjects: 5,
        minimumALevelSubjects: 2,
        requiredGrades: {
          countOfBGrades: 4,
          countOfCGrades: 3,
        },
      },
    },
    allowedPassingYears: [2021, 2022, 2023],
  },
  {
    programId: "llb",
    programName: "LLB (Hons.)",
    level: "undergraduate",
    requiresAdmissionTest: true,
    requiresViva: true,
    admissionTestFee: 500,
    eligibilityRules: {
      bangla_medium: {
        minimumSSCGPA: 3.0,
        minimumHSCGPA: 3.0,
        minimumTotalGPA: 7.0,
        allowedGroups: ["Science", "Commerce", "Arts"],
      },
      english_medium: {
        minimumOLevelSubjects: 5,
        minimumALevelSubjects: 2,
        requiredGrades: {
          countOfBGrades: 4,
          countOfCGrades: 3,
        },
      },
    },
    allowedPassingYears: [2021, 2022, 2023],
  },
  {
    programId: "b_pharm",
    programName: "Bachelor of Pharmacy",
    level: "undergraduate",
    requiresAdmissionTest: true,
    requiresViva: true,
    admissionTestFee: 500,
    eligibilityRules: {
      bangla_medium: {
        minimumSSCGPA: 3.5,
        minimumHSCGPA: 3.5,
        minimumTotalGPA: 7.0,
        allowedGroups: ["Science"],
      },
      english_medium: {
        minimumOLevelSubjects: 5,
        minimumALevelSubjects: 2,
        requiredGrades: {
          countOfBGrades: 4,
          countOfCGrades: 3,
        },
        specificSubjectRequirements: {
          Chemistry: "B",
          Biology: "B",
          Physics: "C",
          Mathematics: "C",
        },
      },
    },
    subjectRequirements: [
      "Science background required",
      "Chemistry and Biology required",
    ],
    allowedPassingYears: [2022, 2023], // Special restriction for B.Pharm
  },

  // Postgraduate Programs
  {
    programId: "mba",
    programName: "Master of Business Administration (MBA)",
    level: "postgraduate",
    requiresAdmissionTest: false,
    requiresViva: true,
    eligibilityRules: {
      postgraduate: {
        minimumBachelorCGPA: 2.5,
        noThirdDivision: true,
      },
    },
  },
  {
    programId: "emba",
    programName: "Executive MBA (EMBA)",
    level: "postgraduate",
    requiresAdmissionTest: false,
    requiresViva: true,
    eligibilityRules: {
      postgraduate: {
        minimumBachelorCGPA: 2.5,
        noThirdDivision: true,
        minimumWorkExperience: 3,
      },
    },
  },
  {
    programId: "msc_ce",
    programName: "M.Sc. in Civil Engineering",
    level: "postgraduate",
    requiresAdmissionTest: false,
    requiresViva: false,
    eligibilityRules: {
      postgraduate: {
        minimumBachelorCGPA: 2.5,
        noThirdDivision: true,
        requiredBachelorDegree: ["Civil Engineering"],
      },
    },
  },
  {
    programId: "msc_cse",
    programName: "M.Sc. in Computer Science & Engineering",
    level: "postgraduate",
    requiresAdmissionTest: true,
    requiresViva: true,
    admissionTestFee: 500,
    eligibilityRules: {
      postgraduate: {
        minimumBachelorCGPA: 2.5,
        noThirdDivision: true,
        requiredBachelorDegree: [
          "Computer Science",
          "Computer Engineering",
          "IT",
        ],
      },
    },
  },
  {
    programId: "msc_eee",
    programName: "M.Sc. in Electrical & Electronic Engineering",
    level: "postgraduate",
    requiresAdmissionTest: true,
    requiresViva: true,
    admissionTestFee: 500,
    eligibilityRules: {
      postgraduate: {
        minimumBachelorCGPA: 2.5,
        noThirdDivision: true,
        requiredBachelorDegree: [
          "Electrical Engineering",
          "Electronic Engineering",
        ],
      },
    },
  },
  {
    programId: "ma_linguistics",
    programName: "M.A. in Applied Linguistics and ELT",
    level: "postgraduate",
    requiresAdmissionTest: true,
    requiresViva: true,
    admissionTestFee: 500,
    eligibilityRules: {
      postgraduate: {
        minimumBachelorCGPA: 2.5,
        noThirdDivision: true,
        requiredBachelorDegree: [
          "English",
          "Linguistics",
          "Applied Linguistics",
        ],
      },
    },
  },
  {
    programId: "llm",
    programName: "LLM (General)",
    level: "postgraduate",
    requiresAdmissionTest: true,
    requiresViva: true,
    admissionTestFee: 500,
    eligibilityRules: {
      postgraduate: {
        minimumBachelorCGPA: 2.5,
        noThirdDivision: true,
        requiredBachelorDegree: ["Law", "LLB"],
      },
    },
  },
  {
    programId: "mhr",
    programName: "Master of Human Rights (MHR)",
    level: "postgraduate",
    requiresAdmissionTest: true,
    requiresViva: true,
    admissionTestFee: 500,
    eligibilityRules: {
      postgraduate: {
        minimumBachelorCGPA: 2.5,
        noThirdDivision: true,
      },
    },
  },
  {
    programId: "m_pharm",
    programName: "Master of Pharmacy (M. Pharm) in Pharmaceutical Technology",
    level: "postgraduate",
    requiresAdmissionTest: true,
    requiresViva: true,
    admissionTestFee: 500,
    eligibilityRules: {
      postgraduate: {
        minimumBachelorCGPA: 2.5,
        noThirdDivision: true,
        requiredBachelorDegree: ["Pharmacy", "Pharmaceutical Sciences"],
      },
    },
  },
];

// Internal function that checks eligibility without suggestions (to avoid recursion)
function checkProgramEligibilityInternal(
  rule: ProgramEligibilityRule,
  academicRecord: AcademicRecord,
): { isEligible: boolean; missingRequirements: string[]; warnings: string[] } {
  const eligibilityRule = rule.eligibilityRules[academicRecord.backgroundType];

  if (!eligibilityRule) {
    return {
      isEligible: false,
      missingRequirements: [
        `${academicRecord.backgroundType} background not supported for this program`,
      ],
      warnings: [],
    };
  }

  let isEligible = true;
  const missingRequirements: string[] = [];
  const warnings: string[] = [];

  // Check based on academic background type
  switch (academicRecord.backgroundType) {
    case "bangla_medium":
      isEligible = checkBanglaMediumEligibility(
        eligibilityRule as BanglaMediumRule,
        academicRecord,
        missingRequirements,
        warnings,
      );
      break;

    case "english_medium":
      isEligible = checkEnglishMediumEligibility(
        eligibilityRule as EnglishMediumRule,
        academicRecord,
        missingRequirements,
        warnings,
      );
      break;

    case "diploma":
      isEligible = checkDiplomaEligibility(
        eligibilityRule as DiplomaRule,
        academicRecord,
        missingRequirements,
        warnings,
      );
      break;

    case "postgraduate":
      isEligible = checkPostgraduateEligibility(
        eligibilityRule as PostgraduateRule,
        academicRecord,
        missingRequirements,
        warnings,
      );
      break;
  }

  // Check year restrictions (only for Bangla Medium and Diploma backgrounds)
  if (
    rule.allowedPassingYears &&
    (academicRecord.backgroundType === "bangla_medium" ||
      academicRecord.backgroundType === "diploma")
  ) {
    if (!academicRecord.hscYear) {
      // Don't fail eligibility if year is not provided, just add warning
      warnings.push("HSC passing year is recommended for verification");
    } else if (!rule.allowedPassingYears.includes(academicRecord.hscYear)) {
      isEligible = false;
      missingRequirements.push(
        `HSC passing year must be one of: ${rule.allowedPassingYears.join(", ")} (you entered: ${academicRecord.hscYear})`,
      );
    }
  }

  return { isEligible, missingRequirements, warnings };
}

// Main eligibility checking function (public API)
export function checkProgramEligibility(
  programId: string,
  academicRecord: AcademicRecord,
): EligibilityCheckResult {
  const rule = PROGRAM_ELIGIBILITY_RULES.find((r) => r.programId === programId);

  if (!rule) {
    return {
      isEligible: false,
      route: "regular",
      requiresAdmissionTest: false,
      requiresViva: false,
      missingRequirements: ["Program not found"],
      warnings: [],
      suggestedPrograms: [],
    };
  }

  const { isEligible, missingRequirements, warnings } =
    checkProgramEligibilityInternal(rule, academicRecord);

  return {
    isEligible,
    route: rule.requiresAdmissionTest ? "admission_test" : "direct",
    requiresAdmissionTest: rule.requiresAdmissionTest,
    requiresViva: rule.requiresViva,
    admissionTestFee: rule.admissionTestFee,
    missingRequirements,
    warnings,
    suggestedPrograms: getSuggestedPrograms(academicRecord, rule),
  };
}

function checkBanglaMediumEligibility(
  rule: BanglaMediumRule,
  record: AcademicRecord,
  missingRequirements: string[],
  warnings: string[],
): boolean {
  let isEligible = true;

  if (!record.sscGPA || record.sscGPA < rule.minimumSSCGPA) {
    isEligible = false;
    missingRequirements.push(
      `Minimum SSC GPA ${rule.minimumSSCGPA} required (you have: ${record.sscGPA || "not provided"})`,
    );
  }

  if (!record.hscGPA || record.hscGPA < rule.minimumHSCGPA) {
    isEligible = false;
    missingRequirements.push(
      `Minimum HSC GPA ${rule.minimumHSCGPA} required (you have: ${record.hscGPA || "not provided"})`,
    );
  }

  if (record.sscGPA && record.hscGPA) {
    const totalGPA = record.sscGPA + record.hscGPA;
    if (totalGPA < rule.minimumTotalGPA) {
      isEligible = false;
      missingRequirements.push(
        `Total GPA (SSC + HSC) must be at least ${rule.minimumTotalGPA} (you have: ${totalGPA.toFixed(2)})`,
      );
    }
  }

  return isEligible;
}

function checkEnglishMediumEligibility(
  rule: EnglishMediumRule,
  record: AcademicRecord,
  missingRequirements: string[],
  warnings: string[],
): boolean {
  let isEligible = true;

  if (
    !record.oLevelSubjects ||
    record.oLevelSubjects.length < rule.minimumOLevelSubjects
  ) {
    isEligible = false;
    missingRequirements.push(
      `Minimum ${rule.minimumOLevelSubjects} O-Level subjects required`,
    );
  }

  if (
    !record.aLevelSubjects ||
    record.aLevelSubjects.length < rule.minimumALevelSubjects
  ) {
    isEligible = false;
    missingRequirements.push(
      `Minimum ${rule.minimumALevelSubjects} A-Level subjects required`,
    );
  }

  if (record.oLevelSubjects && record.aLevelSubjects) {
    const allSubjects = [...record.oLevelSubjects, ...record.aLevelSubjects];
    const best7 = allSubjects.sort((a, b) => b.gpa - a.gpa).slice(0, 7);

    const bGrades = best7.filter((s) => s.gpa >= 4).length;
    const cGrades = best7.filter((s) => s.gpa >= 3.5 && s.gpa < 4).length;

    if (bGrades < rule.requiredGrades.countOfBGrades) {
      isEligible = false;
      missingRequirements.push(
        `Need ${rule.requiredGrades.countOfBGrades} B grades (4.0 GPA) in best 7 subjects`,
      );
    }

    if (cGrades < rule.requiredGrades.countOfCGrades) {
      isEligible = false;
      missingRequirements.push(
        `Need ${rule.requiredGrades.countOfCGrades} C grades (3.5 GPA) in best 7 subjects`,
      );
    }

    // Check specific subject requirements
    if (rule.specificSubjectRequirements) {
      for (const [subject, requiredGrade] of Object.entries(
        rule.specificSubjectRequirements,
      )) {
        const subjectRecord = allSubjects.find((s) =>
          s.subject.toLowerCase().includes(subject.toLowerCase()),
        );
        if (!subjectRecord) {
          isEligible = false;
          missingRequirements.push(`${subject} is required`);
        } else {
          const requiredGPA = getGPAFromGrade(requiredGrade);
          if (subjectRecord.gpa < requiredGPA) {
            isEligible = false;
            missingRequirements.push(
              `Minimum ${requiredGrade} grade required in ${subject}`,
            );
          }
        }
      }
    }
  }

  return isEligible;
}

function checkDiplomaEligibility(
  rule: DiplomaRule,
  record: AcademicRecord,
  missingRequirements: string[],
  warnings: string[],
): boolean {
  let isEligible = true;

  if (!record.sscGPA || record.sscGPA < rule.minimumSSCGPA) {
    isEligible = false;
    missingRequirements.push(`Minimum SSC GPA ${rule.minimumSSCGPA} required`);
  }

  if (!record.diplomaCGPA || record.diplomaCGPA < rule.minimumDiplomaCGPA) {
    isEligible = false;
    missingRequirements.push(
      `Minimum Diploma CGPA ${rule.minimumDiplomaCGPA} required`,
    );
  }

  if (record.sscGPA && record.diplomaCGPA) {
    const totalGPA = record.sscGPA + record.diplomaCGPA;
    if (totalGPA < rule.minimumTotalGPA) {
      isEligible = false;
      missingRequirements.push(
        `Total GPA (SSC + Diploma) must be at least ${rule.minimumTotalGPA}`,
      );
    }
  }

  if (rule.requiresScienceBackground && !record.hasScienceBackground) {
    isEligible = false;
    missingRequirements.push("Science background in SSC is required");
  }

  if (rule.allowedDiplomaPrograms && record.diplomaProgram) {
    const isAllowed = rule.allowedDiplomaPrograms.some((program) =>
      record.diplomaProgram?.toLowerCase().includes(program.toLowerCase()),
    );
    if (!isAllowed) {
      isEligible = false;
      missingRequirements.push(
        `Diploma must be in: ${rule.allowedDiplomaPrograms.join(", ")}`,
      );
    }
  }

  return isEligible;
}

function checkPostgraduateEligibility(
  rule: PostgraduateRule,
  record: AcademicRecord,
  missingRequirements: string[],
  warnings: string[],
): boolean {
  let isEligible = true;

  if (!record.bachelorCGPA || record.bachelorCGPA < rule.minimumBachelorCGPA) {
    isEligible = false;
    missingRequirements.push(
      `Minimum Bachelor's CGPA ${rule.minimumBachelorCGPA} required`,
    );
  }

  if (rule.noThirdDivision && record.hasThirdDivision) {
    isEligible = false;
    missingRequirements.push(
      "No third division/class allowed in any examination",
    );
  }

  if (rule.requiredBachelorDegree && record.bachelorDegree) {
    const isAllowed = rule.requiredBachelorDegree.some((degree) =>
      record.bachelorDegree?.toLowerCase().includes(degree.toLowerCase()),
    );
    if (!isAllowed) {
      isEligible = false;
      missingRequirements.push(
        `Bachelor's degree must be in: ${rule.requiredBachelorDegree.join(", ")}`,
      );
    }
  }

  if (
    rule.minimumWorkExperience &&
    (!record.workExperience ||
      record.workExperience < rule.minimumWorkExperience)
  ) {
    isEligible = false;
    missingRequirements.push(
      `Minimum ${rule.minimumWorkExperience} years work experience required`,
    );
  }

  return isEligible;
}

function getGPAFromGrade(grade: string): number {
  const gradeMap: { [key: string]: number } = {
    A: 5,
    B: 4,
    C: 3.5,
    D: 3,
    E: 2,
  };
  return gradeMap[grade] || 0;
}

function getSuggestedPrograms(
  record: AcademicRecord,
  currentRule: ProgramEligibilityRule,
): ProgramEligibilityRule[] {
  const suggestions: ProgramEligibilityRule[] = [];

  // Find programs that the student might be eligible for
  for (const rule of PROGRAM_ELIGIBILITY_RULES) {
    if (rule.programId === currentRule.programId) continue; // Skip current program

    // Use internal function to avoid recursion
    const { isEligible } = checkProgramEligibilityInternal(rule, record);
    if (isEligible) {
      suggestions.push(rule);
    }
  }

  return suggestions.slice(0, 3); // Return top 3 suggestions
}

export { PROGRAM_ELIGIBILITY_RULES };
