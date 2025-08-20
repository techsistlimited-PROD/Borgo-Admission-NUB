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
  level: 'undergraduate' | 'postgraduate' | 'masters' | 'phd';
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
  type: 'result' | 'special' | 'additional';
  percentage: number;
  criteria: string;
  criteriabn: string;
  description: string;
  descriptionbn: string;
}

// Department Data
export const departments: Department[] = [
  {
    id: 'cse',
    name: 'Computer Science & Engineering',
    namebn: 'কম্পিউটার সায়েন্স ও ইঞ্জিনিয়ারিং',
    description: 'Leading technology and software development program',
    descriptionbn: 'অগ্রণী প্রযুক্তি এবং সফটওয়্যার উন্নয়ন প্রোগ্রাম',
    faculty: 'Faculty of Engineering',
    facultybn: 'ইঞ্জিনিয়ারিং অনুষদ'
  },
  {
    id: 'eee',
    name: 'Electrical and Electronic Engineering',
    namebn: 'ইলেকট্রিক্যাল এবং ইলেকট্রনিক ইঞ্জিনিয়ারিং',
    description: 'Power systems and electronics specialization',
    descriptionbn: 'পাওয়���র সিস্টেম এবং ইলেকট্রনিক্স বিশেষজ্ঞতা',
    faculty: 'Faculty of Engineering',
    facultybn: 'ইঞ্জিনিয়ারিং অনুষদ'
  },
  {
    id: 'te',
    name: 'Textile Engineering',
    namebn: 'টেক্সটাইল ইঞ্জিনিয়ারিং',
    description: 'Textile technology and manufacturing',
    descriptionbn: 'টেক্সটাইল প্রযুক্তি এবং উৎপাদন',
    faculty: 'Faculty of Engineering',
    facultybn: 'ইঞ্জিনিয়ারিং অনুষদ'
  },
  {
    id: 'me',
    name: 'Mechanical Engineering',
    namebn: 'মেকানিক্যাল ইঞ্জিনিয়ারিং',
    description: 'Mechanical systems and manufacturing',
    descriptionbn: 'যান্ত্রিক সিস্টেম এবং ��ৎপাদন',
    faculty: 'Faculty of Engineering',
    facultybn: 'ইঞ্জিনিয়ারিং অনুষদ'
  },
  {
    id: 'ce',
    name: 'Civil Engineering',
    namebn: 'সিভিল ইঞ্জিনিয়ারিং',
    description: 'Infrastructure and construction engineering',
    descriptionbn: 'অবকাঠামো এবং নির্মাণ প্রকৌশল',
    faculty: 'Faculty of Engineering',
    facultybn: 'ইঞ্জিনিয়ারিং অনুষদ'
  },
  {
    id: 'bba',
    name: 'Business Administration',
    namebn: 'বিজনেস অ্যাডমিনিস্ট্রেশন',
    description: 'Comprehensive business management program',
    descriptionbn: 'ব্যাপক ব্যবসা ব্যবস্থাপনা প্রোগ্রাম',
    faculty: 'Faculty of Business',
    facultybn: 'ব্যবসা অন���ষদ'
  },
  {
    id: 'bangla',
    name: 'Bangla',
    namebn: 'বাংলা',
    description: 'Bengali language and literature studies',
    descriptionbn: 'বাংলা ভাষা এবং সাহিত্য অধ্যয়ন',
    faculty: 'Faculty of Arts',
    facultybn: 'কলা অনুষদ'
  },
  {
    id: 'english',
    name: 'English Language & Literature',
    namebn: 'ইংরেজি ভাষা ও সাহিত্য',
    description: 'English language proficiency and literary studies',
    descriptionbn: 'ইংরেজি ভাষা দক্ষতা এবং সাহিত্য অধ্যয়ন',
    faculty: 'Faculty of Arts',
    facultybn: 'কলা অনুষদ'
  },
  {
    id: 'ge',
    name: 'General Education',
    namebn: 'সাধারণ শিক্ষা',
    description: 'Foundational education program',
    descriptionbn: 'ভিত্তিগত শিক্ষা প্রোগ্রাম',
    faculty: 'Faculty of Arts',
    facultybn: 'কলা অনুষদ'
  },
  {
    id: 'gpp',
    name: 'Governance and Public Policy',
    namebn: 'শাসন ও জননীতি',
    description: 'Public administration and policy studies',
    descriptionbn: 'জন প্রশাসন এবং ন���তি অধ্যয়ন',
    faculty: 'Faculty of Social Sciences',
    facultybn: 'সামাজিক বিজ্ঞান অনুষদ'
  },
  {
    id: 'law',
    name: 'Law',
    namebn: 'আইন',
    description: 'Legal studies and jurisprudence',
    descriptionbn: 'আইনি অধ্যয়ন এবং আইনশাস্ত্র',
    faculty: 'Faculty of Law',
    facultybn: 'আইন অনুষদ'
  },
  {
    id: 'pharmacy',
    name: 'Bachelor of Pharmacy',
    namebn: 'ব্যাচেলর অফ ফার্মেসি',
    description: 'Pharmaceutical sciences and drug development',
    descriptionbn: 'ফার্মাসিউটিক্যাল বিজ্ঞান এবং ওষুধ উন্নয়ন',
    faculty: 'Faculty of Pharmacy',
    facultybn: 'ফার্মেসি অনুষদ'
  },
  {
    id: 'ph',
    name: 'Public Health',
    namebn: 'জনস্বাস্থ্য',
    description: 'Community health and healthcare management',
    descriptionbn: 'কমিউনিটি স্বাস্থ্য এবং স্বাস্থ্যসেবা ব্যবস্থাপনা',
    faculty: 'Faculty of Health Sciences',
    facultybn: 'স্বাস্থ্য বিজ্ঞান অনুষদ'
  }
];

// Program Data with Cost Structures
export const programs: Program[] = [
  {
    id: 'bachelor',
    name: 'Bachelor',
    namebn: 'স্নাতক',
    duration: '4 Years',
    durationbn: '৪ বছর',
    departments: ['cse', 'eee', 'te', 'me', 'ce', 'bba', 'bangla', 'english', 'ge', 'gpp', 'law', 'pharmacy', 'ph'],
    costStructure: {
      admissionFee: 15000,
      courseFee: 45000,
      labFee: 8000,
      others: 5000,
      total: 73000
    },
    eligibilityRequirements: {
      level: 'undergraduate',
      minSSCGPA: 2.5,
      minHSCGPA: 2.5,
      oLevelSubjects: 5,
      aLevelSubjects: 2,
      alternativeQualifications: ['US High School Diploma', 'International Baccalaureate'],
      additionalRequirements: ['Minimum C grade in each O Level and A Level subject'],
      specificRequirements: 'Minimum GPA 2.5 in both SSC and HSC or equivalent examinations or O level in five subjects and A level in two subjects with minimum C grade in each or US High School Diploma.'
    }
  },
  {
    id: 'masters',
    name: 'Masters',
    namebn: 'স্নাতকোত্তর',
    duration: '2 Years',
    durationbn: '২ বছর',
    departments: ['cse', 'eee', 'te', 'me', 'ce', 'bba', 'bangla', 'english', 'gpp'],
    costStructure: {
      admissionFee: 20000,
      courseFee: 55000,
      labFee: 10000,
      others: 7000,
      total: 92000
    }
  },
  {
    id: 'mba',
    name: 'MBA',
    namebn: 'এমবিএ',
    duration: '2 Years',
    durationbn: '২ বছর',
    departments: ['bba'],
    costStructure: {
      admissionFee: 25000,
      courseFee: 65000,
      labFee: 5000,
      others: 10000,
      total: 105000
    }
  },
  {
    id: 'diploma',
    name: 'Diploma',
    namebn: 'ডিপ্লোমা',
    duration: '1 Year',
    durationbn: '১ ��ছর',
    departments: ['cse', 'eee', 'te', 'me', 'ce', 'bba', 'ph'],
    costStructure: {
      admissionFee: 10000,
      courseFee: 25000,
      labFee: 5000,
      others: 3000,
      total: 43000
    }
  }
];

// Waiver Policies
export const waiverPolicies: WaiverPolicy[] = [
  // Result-based Waivers
  {
    id: 'result_100',
    name: 'GPA 5.00 (Without 4th Subject)',
    namebn: 'জিপিএ ৫.০০ (৪র্থ বিষয় ছাড়া)',
    type: 'result',
    percentage: 100,
    criteria: 'GPA 5.00 in both SSC and HSC without 4th subject',
    criteriabn: 'এসএসসি ও এইচএসসি উভয়ে ৪র্থ বিষয় ছাড়া জিপিএ ৫.০০',
    description: 'Full tuition waiver for excellent academic performance',
    descriptionbn: 'চমৎকার একাডেমিক পারফরম্যান্সের জন্য সম্পূর্ণ টিউশন ফি মওকুফ'
  },
  {
    id: 'result_80',
    name: 'GPA 5.00 (With 4th Subject)',
    namebn: 'জিপিএ ৫.০০ (৪র্থ বিষয় সহ)',
    type: 'result',
    percentage: 80,
    criteria: 'GPA 5.00 in both SSC and HSC with 4th subject',
    criteriabn: 'এসএসসি ও এইচএসসি উভ���়ে ৪র্থ বিষয় সহ জিপিএ ৫.০০',
    description: '80% tuition waiver for excellent academic performance',
    descriptionbn: 'চমৎকার একাডেমিক পারফরম্যান্সের জন্য ৮০% টিউশন ফি মওকুফ'
  },
  {
    id: 'result_40',
    name: 'GPA 4.80-4.99',
    namebn: 'জিপিএ ৪.৮০-৪.৯৯',
    type: 'result',
    percentage: 40,
    criteria: 'GPA 4.80-4.99 in both SSC and HSC',
    criteriabn: 'এসএসসি ও এইচএসসি উভয়ে জিপিএ ৪.৮০-৪.৯৯',
    description: '40% tuition waiver for very good academic performance',
    descriptionbn: 'খুব ভাল এক���ডেমিক পারফরম্যান্সের জন্য ৪০% টিউশন ফি মওকুফ'
  },
  {
    id: 'result_30',
    name: 'GPA 4.50-4.79',
    namebn: 'জিপিএ ৪.৫০-৪.৭৯',
    type: 'result',
    percentage: 30,
    criteria: 'GPA 4.50-4.79 in both SSC and HSC',
    criteriabn: 'এসএসসি ও এইচএসসি উভয়ে জিপিএ ৪.৫০-৪.৭৯',
    description: '30% tuition waiver for good academic performance',
    descriptionbn: 'ভাল একাডেমিক ���ারফরম্যান্সের জন্য ৩০% টিউশন ফি মওকুফ'
  },
  {
    id: 'result_20',
    name: 'GPA 4.00-4.49',
    namebn: 'জিপিএ ৪.০০-৪.৪৯',
    type: 'result',
    percentage: 20,
    criteria: 'GPA 4.00-4.49 in both SSC and HSC',
    criteriabn: 'এসএসসি ও এইচএসসি উভয়ে জিপিএ ৪.০০-৪.৪৯',
    description: '20% tuition waiver for satisfactory academic performance',
    descriptionbn: 'সন্তোষজনক একাডেমিক পারফরম্যান্সের জন্য ২০% টিউশন ফি মওকুফ'
  },
  {
    id: 'result_10',
    name: 'GPA 3.50-3.99',
    namebn: '���িপিএ ৩.৫০-৩.৯৯',
    type: 'result',
    percentage: 10,
    criteria: 'GPA 3.50-3.99 in both SSC and HSC',
    criteriabn: 'এসএসসি ও এইচএসসি উভয়ে জিপিএ ৩.৫০-৩.৯৯',
    description: '10% tuition waiver for average academic performance',
    descriptionbn: 'গড় একাডে���িক পারফরম্যান্সের জন্য ১০% টিউশন ফি মওকুফ'
  },
  
  // Special Waivers
  {
    id: 'female',
    name: 'Female Student Waiver',
    namebn: 'নারী শিক্ষার্থী মওকুফ',
    type: 'special',
    percentage: 5,
    criteria: 'Female students',
    criteriabn: 'নারী শিক্ষার্থী',
    description: 'Additional 5% waiver for female students',
    descriptionbn: 'নারী শিক্ষার্থীদের জন্য অতিরিক্ত ৫% মওকুফ'
  },
  {
    id: 'tribal',
    name: 'Tribal Population Waiver',
    namebn: 'আদিবাসী জনগোষ্ঠী মওকুফ',
    type: 'special',
    percentage: 5,
    criteria: 'Students from tribal population',
    criteriabn: 'আদিবাসী জনগোষ্ঠীর শিক্ষার্থী',
    description: 'Additional 5% waiver for tribal population students',
    descriptionbn: 'আদিবাসী জনগোষ্ঠীর শিক্ষার্থীদের জন্য অতিরিক্ত ৫% মওকুফ'
  },
  {
    id: 'sibling',
    name: 'Sibling Waiver',
    namebn: 'ভাইবোন মওকুফ',
    type: 'additional',
    percentage: 20,
    criteria: 'Students with siblings already studying',
    criteriabn: 'যাদের ভাইবোন ইতিমধ্যে অধ্যয়নরত',
    description: '20% waiver for students with siblings in university',
    descriptionbn: 'বিশ্ববিদ্যালয়ে ভাইবোন থাকা শিক্ষার্থীদের জন্য ২০% মওকুফ'
  },
  {
    id: 'freedom_fighter',
    name: 'Freedom Fighter Ward Waiver',
    namebn: 'মুক্তিযোদ্ধা সন্তান মওকুফ',
    type: 'additional',
    percentage: 50,
    criteria: 'Wards of freedom fighters',
    criteriabn: 'মুক্তিযোদ্ধার সন্তান',
    description: 'Special waiver for wards of freedom fighters',
    descriptionbn: 'মুক্তিযোদ্ধার সন্তানদের জন্য বিশেষ মওকুফ'
  }
];

// Helper Functions
export const getProgramById = (id: string): Program | undefined => {
  return programs.find(program => program.id === id);
};

export const getDepartmentById = (id: string): Department | undefined => {
  return departments.find(department => department.id === id);
};

export const getDepartmentsByProgram = (programId: string): Department[] => {
  const program = getProgramById(programId);
  if (!program) return [];
  
  return departments.filter(dept => program.departments.includes(dept.id));
};

export const getWaiverById = (id: string): WaiverPolicy | undefined => {
  return waiverPolicies.find(waiver => waiver.id === id);
};

export const getResultBasedWaivers = (): WaiverPolicy[] => {
  return waiverPolicies.filter(waiver => waiver.type === 'result');
};

export const getSpecialWaivers = (): WaiverPolicy[] => {
  return waiverPolicies.filter(waiver => waiver.type === 'special');
};

export const getAdditionalWaivers = (): WaiverPolicy[] => {
  return waiverPolicies.filter(waiver => waiver.type === 'additional');
};

export const calculateWaiverAmount = (
  originalAmount: number, 
  selectedWaivers: string[]
): { waiverPercentage: number; waiverAmount: number; finalAmount: number } => {
  let totalWaiverPercentage = 0;
  
  selectedWaivers.forEach(waiverId => {
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
    finalAmount
  };
};

export const getResultBasedWaiverByGPA = (sscGPA: number, hscGPA: number, hasFourthSubject: boolean = false): WaiverPolicy | null => {
  const avgGPA = (sscGPA + hscGPA) / 2;
  
  if (avgGPA === 5.00) {
    return hasFourthSubject ? getWaiverById('result_80')! : getWaiverById('result_100')!;
  } else if (avgGPA >= 4.80) {
    return getWaiverById('result_40')!;
  } else if (avgGPA >= 4.50) {
    return getWaiverById('result_30')!;
  } else if (avgGPA >= 4.00) {
    return getWaiverById('result_20')!;
  } else if (avgGPA >= 3.50) {
    return getWaiverById('result_10')!;
  }
  
  return null;
};
