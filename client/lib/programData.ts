// Program and Department Data with Dynamic Cost Structures

export interface CostStructure {
  admissionFee: number;
  courseFee: number;
  labFee: number;
  others: number;
  total: number;
}

export interface Department {
  id: string;
  name: string;
  namebn: string;
  description: string;
  descriptionbn: string;
  faculty: string;
  facultybn: string;
}

export interface EligibilityRequirement {
  level: "undergraduate" | "postgraduate" | "masters" | "phd";
  minSSCGPA?: number;
  minHSCGPA?: number;
  minBachelorGPA?: number;
  minMasterGPA?: number;
  requiredDegreeTypes?: string[];
  oLevelSubjects?: number;
  aLevelSubjects?: number;
  alternativeQualifications?: string[];
  additionalRequirements?: string[];
  specificRequirements?: string;
}

export interface Program {
  id: string;
  name: string;
  namebn: string;
  duration: string;
  durationbn: string;
  departments: string[]; // Department IDs
  costStructure: CostStructure;
  eligibilityRequirements: EligibilityRequirement;
}

export interface WaiverPolicy {
  id: string;
  name: string;
  namebn: string;
  type: "result" | "special" | "additional";
  percentage: number;
  criteria: string;
  criteriabn: string;
  description: string;
  descriptionbn: string;
}

// Department Data
export const departments: Department[] = [
  {
    id: "cse",
    name: "Computer Science & Engineering",
    namebn: "কম্পিউটার সায়েন্স ও ইঞ্জিনিয়ারিং",
    description: "Leading technology and software development program",
    descriptionbn: "অগ্রণী প্রযুক্তি এবং সফটওয়্যার উন্নয়ন প্রোগ্রাম",
    faculty: "Faculty of Engineering",
    facultybn: "ইঞ্জিনিয়ারিং অনুষদ",
  },
  {
    id: "eee",
    name: "Electrical and Electronic Engineering",
    namebn: "ইলেকট্রিক্যাল এবং ইলেকট্রনিক ইঞ্জিনিয়ারিং",
    description: "Power systems and electronics specialization",
    descriptionbn: "পাওয়���র সিস্টেম এবং ইলেকট্রনিক্স বিশেষজ্ঞতা",
    faculty: "Faculty of Engineering",
    facultybn: "ইঞ্জিনিয়ারিং অনুষদ",
  },
  {
    id: "te",
    name: "Textile Engineering",
    namebn: "টেক্সটাইল ইঞ্জিনিয়ারিং",
    description: "Textile technology and manufacturing",
    descriptionbn: "টেক্সটাইল প্রযুক্তি এবং উৎপাদন",
    faculty: "Faculty of Engineering",
    facultybn: "ইঞ্জিনিয়ারিং অনুষদ",
  },
  {
    id: "me",
    name: "Mechanical Engineering",
    namebn: "ম��কানিক্যাল ইঞ্জিনিয়ারিং",
    description: "Mechanical systems and manufacturing",
    descriptionbn: "যান্ত্রিক সিস্টেম এবং ��ৎপাদন",
    faculty: "Faculty of Engineering",
    facultybn: "ইঞ্জিনিয়ারিং অনুষদ",
  },
  {
    id: "ce",
    name: "Civil Engineering",
    namebn: "সিভিল ইঞ্জিনিয়ারিং",
    description: "Infrastructure and construction engineering",
    descriptionbn: "অবকাঠামো এবং নির্মাণ প্রকৌশল",
    faculty: "Faculty of Engineering",
    facultybn: "ইঞ্জিনিয়ারিং অনুষদ",
  },
  {
    id: "bba",
    name: "Business Administration",
    namebn: "বিজনেস অ্যাডমিনিস্ট্রেশন",
    description: "Comprehensive business management program",
    descriptionbn: "ব্যাপক ব্যবসা ব্যবস্থাপনা প্রোগ্রাম",
    faculty: "Faculty of Business",
    facultybn: "ব্যবসা অন���ষদ",
  },
  {
    id: "bangla",
    name: "Bangla",
    namebn: "বাংলা",
    description: "Bengali language and literature studies",
    descriptionbn: "বাংলা ভাষা এবং সাহিত্য অধ্যয়ন",
    faculty: "Faculty of Arts",
    facultybn: "কলা অনুষদ",
  },
  {
    id: "english",
    name: "English Language & Literature",
    namebn: "ইংরেজি ভাষা ও সাহিত্য",
    description: "English language proficiency and literary studies",
    descriptionbn: "ইংরেজি ভাষা দক্���তা এবং সাহিত্য অধ্যয়ন",
    faculty: "Faculty of Arts",
    facultybn: "কলা অনুষদ",
  },
  {
    id: "ge",
    name: "General Education",
    namebn: "সাধারণ শিক্ষা",
    description: "Foundational education program",
    descriptionbn: "ভিত্তিগত শিক্ষা প্রোগ্রাম",
    faculty: "Faculty of Arts",
    facultybn: "কলা অনুষদ",
  },
  {
    id: "gpp",
    name: "Governance and Public Policy",
    namebn: "শাসন ও জননীতি",
    description: "Public administration and policy studies",
    descriptionbn: "জন প্রশাসন এবং ন���তি অধ্যয়ন",
    faculty: "Faculty of Social Sciences",
    facultybn: "সামাজিক বিজ্ঞান অনুষ���",
  },
  {
    id: "law",
    name: "Law",
    namebn: "আইন",
    description: "Legal studies and jurisprudence",
    descriptionbn: "আইনি অধ্যয়ন এবং আইনশাস্ত্র",
    faculty: "Faculty of Law",
    facultybn: "আইন অনুষদ",
  },
  {
    id: "pharmacy",
    name: "Bachelor of Pharmacy",
    namebn: "ব্যাচেলর অফ ফার্মেসি",
    description: "Pharmaceutical sciences and drug development",
    descriptionbn: "ফার্মাসিউটিক্যাল বিজ্ঞান এবং ওষুধ উন্নয়ন",
    faculty: "Faculty of Pharmacy",
    facultybn: "ফার্মেসি অনুষদ",
  },
  {
    id: "ph",
    name: "Public Health",
    namebn: "জনস্বাস্থ্য",
    description: "Community health and healthcare management",
    descriptionbn: "কমিউনিটি ��্বাস্থ্য এবং স্বাস্থ্যসেবা ব্যবস্থাপনা",
    faculty: "Faculty of Health Sciences",
    facultybn: "স্বাস্থ্য বিজ্ঞান অনুষদ",
  },
];

// Program Data with Cost Structures
export const programs: Program[] = [
  {
    id: "bachelor",
    name: "Bachelor",
    namebn: "স্নাতক",
    duration: "4 Years",
    durationbn: "৪ বছর",
    departments: [
      "cse",
      "eee",
      "te",
      "me",
      "ce",
      "bba",
      "bangla",
      "english",
      "ge",
      "gpp",
      "law",
      "pharmacy",
      "ph",
    ],
    costStructure: {
      admissionFee: 15000,
      courseFee: 45000,
      labFee: 8000,
      others: 5000,
      total: 73000,
    },
    eligibilityRequirements: {
      level: "undergraduate",
      minSSCGPA: 2.5,
      minHSCGPA: 2.5,
      oLevelSubjects: 5,
      aLevelSubjects: 2,
      alternativeQualifications: [
        "US High School Diploma",
        "International Baccalaureate",
      ],
      additionalRequirements: [
        "Minimum C grade in each O Level and A Level subject",
      ],
      specificRequirements:
        "Minimum GPA 2.5 in both SSC and HSC or equivalent examinations or O level in five subjects and A level in two subjects with minimum C grade in each or US High School Diploma.",
    },
  },
  {
    id: "masters",
    name: "Masters",
    namebn: "স্নাতকোত্তর",
    duration: "2 Years",
    durationbn: "২ বছর",
    departments: [
      "cse",
      "eee",
      "te",
      "me",
      "ce",
      "bba",
      "bangla",
      "english",
      "gpp",
    ],
    costStructure: {
      admissionFee: 20000,
      courseFee: 55000,
      labFee: 10000,
      others: 7000,
      total: 92000,
    },
    eligibilityRequirements: {
      level: "postgraduate",
      minBachelorGPA: 2.5,
      requiredDegreeTypes: ["Bachelor"],
      additionalRequirements: [
        "Bachelor degree in relevant field",
        "Minimum 4 years undergraduate program",
      ],
      specificRequirements:
        "Minimum Bachelor degree relevant to the desired program of study. Please refer the specific admission requirements relating to the desired program in the faculty.",
    },
  },
  {
    id: "mba",
    name: "MBA",
    namebn: "এম���িএ",
    duration: "2 Years",
    durationbn: "২ বছর",
    departments: ["bba"],
    costStructure: {
      admissionFee: 25000,
      courseFee: 65000,
      labFee: 5000,
      others: 10000,
      total: 105000,
    },
    eligibilityRequirements: {
      level: "postgraduate",
      minBachelorGPA: 2.5,
      requiredDegreeTypes: ["Bachelor"],
      additionalRequirements: [
        "Bachelor degree in any discipline",
        "Minimum 2 years work experience preferred",
        "GMAT/MAT score may be required",
      ],
      specificRequirements:
        "Bachelor degree in any discipline with minimum 2.5 GPA. Work experience and management aptitude test may be required.",
    },
  },
  {
    id: "diploma",
    name: "Diploma",
    namebn: "ডিপ্লোমা",
    duration: "1 Year",
    durationbn: "১ ��ছর",
    departments: ["cse", "eee", "te", "me", "ce", "bba", "ph"],
    costStructure: {
      admissionFee: 10000,
      courseFee: 25000,
      labFee: 5000,
      others: 3000,
      total: 43000,
    },
    eligibilityRequirements: {
      level: "undergraduate",
      minSSCGPA: 2.0,
      minHSCGPA: 2.0,
      alternativeQualifications: [
        "HSC/A-Level/Equivalent",
        "Professional experience",
      ],
      additionalRequirements: [
        "Basic computer literacy for technical programs",
      ],
      specificRequirements:
        "Minimum GPA 2.0 in SSC and HSC or equivalent examinations. Professional experience may substitute educational requirements.",
    },
  },
];

// Waiver Policies
export const waiverPolicies: WaiverPolicy[] = [
  // Result-based Waivers
  {
    id: "result_100",
    name: "GPA 5.00 (Without 4th Subject)",
    namebn: "জিপিএ ৫.০০ (৪র্থ বিষয় ছাড়া)",
    type: "result",
    percentage: 100,
    criteria: "GPA 5.00 in both SSC and HSC without 4th subject",
    criteriabn: "এসএসসি ও এইচএসসি উভয়ে ৪র্থ বিষয় ছাড়া জিপিএ ৫.০০",
    description: "Full tuition waiver for excellent academic performance",
    descriptionbn:
      "চমৎকার একাডেমিক পারফরম্যান্সের জন্য সম���পূর্ণ টিউশন ফি মওকুফ",
  },
  {
    id: "result_80",
    name: "GPA 5.00 (With 4th Subject)",
    namebn: "জিপিএ ৫.০০ (৪র্থ ���িষয় সহ)",
    type: "result",
    percentage: 80,
    criteria: "GPA 5.00 in both SSC and HSC with 4th subject",
    criteriabn: "এসএসসি ও এইচএসসি উভ���়ে ৪র্থ বিষয় সহ জিপিএ ৫.০০",
    description: "80% tuition waiver for excellent academic performance",
    descriptionbn: "চমৎকার একাডেমিক পারফরম্যান্সের জন্য ৮০% টিউশন ফি মওকুফ",
  },
  {
    id: "result_40",
    name: "GPA 4.80-4.99",
    namebn: "জিপিএ ৪.৮০-৪.৯৯",
    type: "result",
    percentage: 40,
    criteria: "GPA 4.80-4.99 in both SSC and HSC",
    criteriabn: "এস��সসি ও এইচএসসি উভয়ে জিপিএ ৪.৮০-৪.৯৯",
    description: "40% tuition waiver for very good academic performance",
    descriptionbn: "খুব ভাল এক���ডেমিক পারফরম্যান্সের জন্য ৪০% টিউশন ফি মওকুফ",
  },
  {
    id: "result_30",
    name: "GPA 4.50-4.79",
    namebn: "জিপিএ ৪.৫০-৪.৭৯",
    type: "result",
    percentage: 30,
    criteria: "GPA 4.50-4.79 in both SSC and HSC",
    criteriabn: "এসএসসি ও এইচএসসি উভয়ে জিপিএ ৪.৫০-৪.৭৯",
    description: "30% tuition waiver for good academic performance",
    descriptionbn: "ভাল একাডেমিক ���ারফরম্যান্সের জন্য ৩০% টিউশন ফি মওকুফ",
  },
  {
    id: "result_20",
    name: "GPA 4.00-4.49",
    namebn: "জিপিএ ৪.০০-৪.৪৯",
    type: "result",
    percentage: 20,
    criteria: "GPA 4.00-4.49 in both SSC and HSC",
    criteriabn: "এসএসসি ও এইচএসসি উভয়ে জিপিএ ৪.০০-৪.৪৯",
    description: "20% tuition waiver for satisfactory academic performance",
    descriptionbn: "সন্��োষজনক একাডেমিক পারফরম্যান্সের জন্য ২০% টিউশন ফি মওকুফ",
  },
  {
    id: "result_10",
    name: "GPA 3.50-3.99",
    namebn: "���িপিএ ৩.৫০-৩.৯৯",
    type: "result",
    percentage: 10,
    criteria: "GPA 3.50-3.99 in both SSC and HSC",
    criteriabn: "এসএসসি ও এইচএসসি উভয়ে জিপিএ ৩.৫০-৩.৯৯",
    description: "10% tuition waiver for average academic performance",
    descriptionbn: "গড় একাডে���িক পারফরম্যান্সের জন্য ১০% টিউশন ফি মওকুফ",
  },

  // Special Waivers
  {
    id: "female",
    name: "Female Student Waiver",
    namebn: "নারী শিক্ষার্থী মওকুফ",
    type: "special",
    percentage: 5,
    criteria: "Female students",
    criteriabn: "নারী শিক্ষার্থী",
    description: "Additional 5% waiver for female students",
    descriptionbn: "নারী শিক্ষার্থীদের জন্য অতিরিক্ত ৫% মওকুফ",
  },
  {
    id: "tribal",
    name: "Tribal Population Waiver",
    namebn: "আদিবাসী জনগোষ্ঠী মওকুফ",
    type: "special",
    percentage: 5,
    criteria: "Students from tribal population",
    criteriabn: "আদিবাসী জনগোষ্ঠীর শিক্ষার্থী",
    description: "Additional 5% waiver for tribal population students",
    descriptionbn: "আদিবাসী জনগোষ্ঠীর শিক্ষার্থীদ��র জন্য অতিরিক্ত ৫% মওকুফ",
  },
  {
    id: "sibling",
    name: "Sibling Waiver",
    namebn: "ভাইবোন মওকুফ",
    type: "additional",
    percentage: 20,
    criteria: "Students with siblings already studying",
    criteriabn: "যাদের ভাইবোন ইতিমধ্যে অধ্যয়নরত",
    description: "20% waiver for students with siblings in university",
    descriptionbn: "বিশ্ববিদ্যালয়ে ভাইবোন থাকা শিক্ষার্থীদের জন্য ২০% মওকুফ",
  },
  {
    id: "freedom_fighter",
    name: "Freedom Fighter Ward Waiver",
    namebn: "মুক্তিযোদ্ধা সন্তান মওকুফ",
    type: "additional",
    percentage: 50,
    criteria: "Wards of freedom fighters",
    criteriabn: "মুক্তিযোদ্ধার সন্তান",
    description: "Special waiver for wards of freedom fighters",
    descriptionbn: "মুক্তিযোদ্ধার সন্তানদের জন্য ব��শেষ মওকুফ",
  },
];

// Helper Functions
export const getProgramById = (id: string): Program | undefined => {
  return programs.find((program) => program.id === id);
};

export const getDepartmentById = (id: string): Department | undefined => {
  return departments.find((department) => department.id === id);
};

export const getDepartmentsByProgram = (programId: string): Department[] => {
  const program = getProgramById(programId);
  if (!program) return [];

  return departments.filter((dept) => program.departments.includes(dept.id));
};

export const getWaiverById = (id: string): WaiverPolicy | undefined => {
  return waiverPolicies.find((waiver) => waiver.id === id);
};

export const getResultBasedWaivers = (): WaiverPolicy[] => {
  return waiverPolicies.filter((waiver) => waiver.type === "result");
};

export const getSpecialWaivers = (): WaiverPolicy[] => {
  return waiverPolicies.filter((waiver) => waiver.type === "special");
};

export const getAdditionalWaivers = (): WaiverPolicy[] => {
  return waiverPolicies.filter((waiver) => waiver.type === "additional");
};

export const calculateWaiverAmount = (
  originalAmount: number,
  selectedWaivers: string[],
): { waiverPercentage: number; waiverAmount: number; finalAmount: number } => {
  let totalWaiverPercentage = 0;

  selectedWaivers.forEach((waiverId) => {
    const waiver = getWaiverById(waiverId);
    if (waiver) {
      totalWaiverPercentage += waiver.percentage;
    }
  });

  // Cap at 100%
  totalWaiverPercentage = Math.min(totalWaiverPercentage, 100);

  const waiverAmount = (originalAmount * totalWaiverPercentage) / 100;
  const finalAmount = originalAmount - waiverAmount;

  return {
    waiverPercentage: totalWaiverPercentage,
    waiverAmount,
    finalAmount,
  };
};

export const getResultBasedWaiverByGPA = (
  sscGPA: number,
  hscGPA: number,
  hasFourthSubject: boolean = false,
): WaiverPolicy | null => {
  const avgGPA = (sscGPA + hscGPA) / 2;

  if (avgGPA === 5.0) {
    return hasFourthSubject
      ? getWaiverById("result_80")!
      : getWaiverById("result_100")!;
  } else if (avgGPA >= 4.8) {
    return getWaiverById("result_40")!;
  } else if (avgGPA >= 4.5) {
    return getWaiverById("result_30")!;
  } else if (avgGPA >= 4.0) {
    return getWaiverById("result_20")!;
  } else if (avgGPA >= 3.5) {
    return getWaiverById("result_10")!;
  }

  return null;
};

// Eligibility checking functions
export interface EligibilityCheckResult {
  isEligible: boolean;
  missingRequirements: string[];
  warningMessages: string[];
  suggestedPrograms: Program[];
  meetsCriteria: {
    sscGPA: boolean;
    hscGPA: boolean;
    overallGPA: boolean;
    alternativeQualification: boolean;
  };
}

export interface StudentAcademicInfo {
  sscGPA?: number;
  hscGPA?: number;
  bachelorGPA?: number;
  masterGPA?: number;
  oLevelSubjects?: number;
  aLevelSubjects?: number;
  hasAlternativeQualification?: string;
  previousDegreeType?: string;
  workExperience?: number;
}

export const checkEligibility = (
  programId: string,
  studentInfo: StudentAcademicInfo,
): EligibilityCheckResult => {
  const program = getProgramById(programId);

  if (!program) {
    return {
      isEligible: false,
      missingRequirements: ["Invalid program selected"],
      warningMessages: [],
      suggestedPrograms: [],
      meetsCriteria: {
        sscGPA: false,
        hscGPA: false,
        overallGPA: false,
        alternativeQualification: false,
      },
    };
  }

  const requirements = program.eligibilityRequirements;
  const missingRequirements: string[] = [];
  const warningMessages: string[] = [];

  let sscGPAMet = true;
  let hscGPAMet = true;
  let overallGPAMet = true;
  let alternativeQualificationMet = false;

  // Check for undergraduate programs
  if (requirements.level === "undergraduate") {
    // Check SSC GPA
    if (requirements.minSSCGPA && studentInfo.sscGPA) {
      if (studentInfo.sscGPA < requirements.minSSCGPA) {
        sscGPAMet = false;
        missingRequirements.push(
          `SSC GPA must be at least ${requirements.minSSCGPA} (current: ${studentInfo.sscGPA})`,
        );
      }
    } else if (requirements.minSSCGPA && !studentInfo.sscGPA) {
      sscGPAMet = false;
      missingRequirements.push(
        `SSC GPA information required (minimum: ${requirements.minSSCGPA})`,
      );
    }

    // Check HSC GPA
    if (requirements.minHSCGPA && studentInfo.hscGPA) {
      if (studentInfo.hscGPA < requirements.minHSCGPA) {
        hscGPAMet = false;
        missingRequirements.push(
          `HSC GPA must be at least ${requirements.minHSCGPA} (current: ${studentInfo.hscGPA})`,
        );
      }
    } else if (requirements.minHSCGPA && !studentInfo.hscGPA) {
      hscGPAMet = false;
      missingRequirements.push(
        `HSC GPA information required (minimum: ${requirements.minHSCGPA})`,
      );
    }

    // Check overall GPA requirement
    if (
      studentInfo.sscGPA &&
      studentInfo.hscGPA &&
      requirements.minSSCGPA &&
      requirements.minHSCGPA
    ) {
      const avgGPA = (studentInfo.sscGPA + studentInfo.hscGPA) / 2;
      const minAvgGPA = (requirements.minSSCGPA + requirements.minHSCGPA) / 2;

      if (avgGPA < minAvgGPA) {
        overallGPAMet = false;
        missingRequirements.push(
          `Average GPA must be at least ${minAvgGPA.toFixed(2)} (current: ${avgGPA.toFixed(2)})`,
        );
      }
    }

    // Check O-Level and A-Level requirements
    if (requirements.oLevelSubjects && studentInfo.oLevelSubjects) {
      if (studentInfo.oLevelSubjects < requirements.oLevelSubjects) {
        missingRequirements.push(
          `Minimum ${requirements.oLevelSubjects} O-Level subjects required (current: ${studentInfo.oLevelSubjects})`,
        );
      } else {
        alternativeQualificationMet = true;
      }
    }

    if (requirements.aLevelSubjects && studentInfo.aLevelSubjects) {
      if (studentInfo.aLevelSubjects < requirements.aLevelSubjects) {
        missingRequirements.push(
          `Minimum ${requirements.aLevelSubjects} A-Level subjects required (current: ${studentInfo.aLevelSubjects})`,
        );
      } else {
        alternativeQualificationMet = true;
      }
    }

    // Check alternative qualifications
    if (
      studentInfo.hasAlternativeQualification &&
      requirements.alternativeQualifications
    ) {
      if (
        requirements.alternativeQualifications.includes(
          studentInfo.hasAlternativeQualification,
        )
      ) {
        alternativeQualificationMet = true;
        warningMessages.push(
          `Accepted based on alternative qualification: ${studentInfo.hasAlternativeQualification}`,
        );
      }
    }
  }

  // Check for postgraduate programs
  if (requirements.level === "postgraduate") {
    if (requirements.minBachelorGPA && studentInfo.bachelorGPA) {
      if (studentInfo.bachelorGPA < requirements.minBachelorGPA) {
        overallGPAMet = false;
        missingRequirements.push(
          `Bachelor GPA must be at least ${requirements.minBachelorGPA} (current: ${studentInfo.bachelorGPA})`,
        );
      }
    } else if (requirements.minBachelorGPA && !studentInfo.bachelorGPA) {
      overallGPAMet = false;
      missingRequirements.push(
        `Bachelor GPA information required (minimum: ${requirements.minBachelorGPA})`,
      );
    }

    // Check degree type requirement
    if (requirements.requiredDegreeTypes && studentInfo.previousDegreeType) {
      if (
        !requirements.requiredDegreeTypes.includes(
          studentInfo.previousDegreeType,
        )
      ) {
        missingRequirements.push(
          `Required degree type: ${requirements.requiredDegreeTypes.join(" or ")} (current: ${studentInfo.previousDegreeType})`,
        );
      }
    }
  }

  // Determine overall eligibility
  const isEligible =
    (missingRequirements.length === 0 &&
      sscGPAMet &&
      hscGPAMet &&
      overallGPAMet) ||
    alternativeQualificationMet;

  // Find suggested programs if not eligible
  const suggestedPrograms: Program[] = [];
  if (!isEligible) {
    suggestedPrograms.push(...findSuitablePrograms(studentInfo));
  }

  return {
    isEligible,
    missingRequirements,
    warningMessages,
    suggestedPrograms,
    meetsCriteria: {
      sscGPA: sscGPAMet,
      hscGPA: hscGPAMet,
      overallGPA: overallGPAMet,
      alternativeQualification: alternativeQualificationMet,
    },
  };
};

export const findSuitablePrograms = (
  studentInfo: StudentAcademicInfo,
): Program[] => {
  const suitablePrograms: Program[] = [];

  programs.forEach((program) => {
    const requirements = program.eligibilityRequirements;
    let isEligible = true;

    if (requirements.level === "undergraduate") {
      // Check if student meets SSC/HSC requirements
      if (
        requirements.minSSCGPA &&
        studentInfo.sscGPA &&
        studentInfo.sscGPA < requirements.minSSCGPA
      ) {
        isEligible = false;
      }
      if (
        requirements.minHSCGPA &&
        studentInfo.hscGPA &&
        studentInfo.hscGPA < requirements.minHSCGPA
      ) {
        isEligible = false;
      }
    }

    if (requirements.level === "postgraduate") {
      // Check if student has bachelor's degree requirements
      if (
        requirements.minBachelorGPA &&
        studentInfo.bachelorGPA &&
        studentInfo.bachelorGPA < requirements.minBachelorGPA
      ) {
        isEligible = false;
      }
    }

    if (isEligible) {
      suitablePrograms.push(program);
    }
  });

  return suitablePrograms;
};

export const getEligibilityMessage = (
  result: EligibilityCheckResult,
  programName: string,
  language: "en" | "bn" = "en",
): string => {
  if (result.isEligible) {
    return language === "en"
      ? `✅ Congratulations! You are eligible for the ${programName} program.`
      : `✅ অভিনন্দন! আপনি ${programName} প্রোগ্রামের জন্য যোগ্য।`;
  }

  const missingReqs = result.missingRequirements.join(", ");
  let message =
    language === "en"
      ? `❌ Sorry, you do not meet the eligibility requirements for ${programName}.\n\nMissing requirements: ${missingReqs}`
      : `❌ দুঃখিত, আপনি ${programName} প্রোগ্রামের যোগ্যতার প্রয়োজনীয়তা পূরণ করেন না।\n\nঅনুপস্থিত প্রয়োজনীয়তা: ${missingReqs}`;

  if (result.suggestedPrograms.length > 0) {
    const suggestedNames = result.suggestedPrograms
      .map((p) => (language === "en" ? p.name : p.namebn))
      .join(", ");
    message +=
      language === "en"
        ? `\n\n💡 Suggested alternative programs: ${suggestedNames}`
        : `\n\n💡 বিকল্প প্রোগ্রামের পরামর্শ: ${suggestedNames}`;
  }

  return message;
};
