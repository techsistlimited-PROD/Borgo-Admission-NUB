import { useState, useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  ArrowRight,
  Calculator,
  Award,
  Info,
  CheckCircle,
  AlertCircle,
  DollarSign,
  Upload,
} from "lucide-react";
import { Button } from "../components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../components/ui/select";
import { Label } from "../components/ui/label";
import { Input } from "../components/ui/input";
import { Checkbox } from "../components/ui/checkbox";
import { Badge } from "../components/ui/badge";
import { Alert, AlertDescription } from "../components/ui/alert";
import { Separator } from "../components/ui/separator";
import { useApplication } from "../contexts/ApplicationContext";
import { useToast } from "../hooks/use-toast";
import {
  programs,
  departments,
  waiverPolicies,
  getProgramById,
  getDepartmentsByProgram,
  calculateWaiverAmount,
  getResultBasedWaiverByGPA,
  getResultBasedWaivers,
  getSpecialWaivers,
  getAdditionalWaivers,
  checkEligibility,
  getEligibilityMessage,
  type Program,
  type Department,
  type WaiverPolicy,
  type EligibilityCheckResult,
  type StudentAcademicInfo,
} from "../lib/programData";

export default function ProgramSelection() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { applicationData, updateApplicationData, saveCurrentStep } =
    useApplication();

  // Get admission type from URL parameter
  const searchParams = new URLSearchParams(window.location.search);
  const admissionType =
    (searchParams.get("type") as "regular" | "credit-transfer") || "regular";

  const [language, setLanguage] = useState<"en" | "bn">("en");
  // Filter selections
  const [selectedCampus, setSelectedCampus] = useState<string>(
    applicationData.campus || "",
  );
  const [selectedSemester, setSelectedSemester] = useState<string>(
    applicationData.semester || "",
  );
  const [selectedSemesterType, setSelectedSemesterType] = useState<string>(
    applicationData.semesterType || "",
  );
  const [selectedProgram, setSelectedProgram] = useState<string>(
    applicationData.program || "",
  );
  const [selectedDepartment, setSelectedDepartment] = useState<string>(
    applicationData.department || "",
  );
  const [availableDepartments, setAvailableDepartments] = useState<
    Department[]
  >([]);

  // Academic Information for Waiver Calculation
  const [sscGPA, setSscGPA] = useState<string>(
    applicationData.sscGPA?.toString() || "",
  );
  const [hscGPA, setHscGPA] = useState<string>(
    applicationData.hscGPA?.toString() || "",
  );
  const [hasFourthSubject, setHasFourthSubject] = useState<boolean>(false);

  // Selected Waivers
  const [selectedWaivers, setSelectedWaivers] = useState<string[]>(
    applicationData.selectedWaivers || [],
  );
  const [autoSelectedResultWaiver, setAutoSelectedResultWaiver] =
    useState<string>("");

  // Cost Calculation
  const [costCalculation, setCostCalculation] = useState({
    originalAmount: applicationData.totalCost || 0,
    waiverPercentage: 0,
    waiverAmount: applicationData.waiverAmount || 0,
    finalAmount: applicationData.finalAmount || 0,
  });

  // Loading state
  const [isSaving, setIsSaving] = useState(false);

  // Credit Transfer specific state
  const [previousInstitution, setPreviousInstitution] = useState<string>(
    applicationData.previousInstitution || "",
  );
  const [previousProgram, setPreviousProgram] = useState<string>(
    applicationData.previousProgram || "",
  );
  const [totalCreditsInProgram, setTotalCreditsInProgram] = useState<string>(
    applicationData.totalCreditsInProgram?.toString() || "",
  );
  const [completedCredits, setCompletedCredits] = useState<string>(
    applicationData.completedCredits?.toString() || "",
  );
  const [previousCGPA, setPreviousCGPA] = useState<string>(
    applicationData.previousCGPA?.toString() || "",
  );
  const [reasonForTransfer, setReasonForTransfer] = useState<string>(
    applicationData.reasonForTransfer || "",
  );
  const [transcriptFile, setTranscriptFile] = useState<File | null>(null);
  const transcriptFileInputRef = useRef<HTMLInputElement>(null);

  // Filter options
  const campusOptions = [
    { id: "main", name: "Main Campus", namebn: "প্রধান ক্যাম্পাস" },
    { id: "khulna", name: "Khulna Campus", namebn: "খুলনা ক্যাম��পাস" },
  ];

  const semesterOptions = [
    { id: "fall", name: "Fall", namebn: "ফল" },
    { id: "summer", name: "Summer", namebn: "গ্রীষ্ম" },
    { id: "winter", name: "Winter", namebn: "শীত" },
  ];

  const semesterTypeOptions = [
    { id: "bi-semester", name: "Bi-Semester", namebn: "দ্বি-সেমিস্টার" },
    { id: "tri-semester", name: "Tri-Semester", namebn: "ত্রি-সেমি��্টার" },
  ];

  const texts = {
    en: {
      title: "Program & Department Selection",
      subtitle: "Step 1 of 4 - Choose Your Academic Path & Calculate Costs",
      backToHome: "Back to Home",
      continue: "Save & Continue",
      campusSelection: "Select Campus",
      semesterSelection: "Select Semester",
      semesterTypeSelection: "Select Semester Type",
      programSelection: "Select Program",
      departmentSelection: "Select Department",
      selectCampus: "Choose your campus",
      selectSemester: "Choose semester",
      selectSemesterType: "Choose semester type",
      selectProgram: "Choose your program",
      selectDepartment: "Choose your department",
      programInfo: "Program Information",
      costBreakdown: "Cost Breakdown",
      waiverCalculator: "Waiver Calculator",
      academicInfo: "Academic Information",
      sscGPA: "SSC GPA",
      hscGPA: "HSC GPA",
      fourthSubject: "Had 4th Subject in both SSC & HSC",
      calculateWaiver: "Calculate Eligible Waiver",
      availableWaivers: "Available Waivers",
      resultBasedWaivers: "Result-Based Waivers",
      specialWaivers: "Special Waivers",
      additionalWaivers: "Additional Waivers",
      estimatedCost: "Estimated Cost",
      originalAmount: "Original Amount",
      waiverAmount: "Waiver Amount",
      finalAmount: "Final Amount",
      admissionFee: "Admission Fee",
      courseFee: "Course Fee",
      labFee: "Lab Fee",
      others: "Others",
      total: "Total",
      duration: "Duration",
      faculty: "Faculty",
      description: "Description",
      waiverApplied: "Waiver Applied",
      noWaiverEligible: "No waiver eligible based on GPA",
      selectProgramFirst: "Please select a program first",
      selectDepartmentFirst: "Please select a department first",
      enterGPAValues: "Enter your SSC and HSC GPA to see eligible waivers",
      waiverPolicyNote: "Waiver policies are subject to university approval",
      costNote:
        "Final costs may vary based on additional fees and university policies",
      saving: "Saving...",
      saved: "Data saved successfully!",
      saveError: "Failed to save data. Please try again.",

      // Credit Transfer specific
      creditTransferInfo: "Credit Transfer Information",
      previousInstitution: "Previous Institution",
      previousProgram: "Previous Program",
      totalCredits: "Total Credits in Program",
      completedCredits: "Completed Credits",
      previousCGPA: "Previous CGPA",
      reasonForTransfer: "Reason for Transfer",
      uploadTranscript: "Upload Transcript",
      creditTransferTitle: "Credit Transfer Application",
      creditTransferSubtitle:
        "Step 1 of 4 - Program Selection & Previous Academic Information",
    },
    bn: {
      title: "প্রোগ্রাম ও বিভ���গ নির্বাচন",
      subtitle:
        "৪টি ধাপের ১ম ধাপ - আপনার একাডেমিক পথ বেছে নিন ও খরচ গণ��া করুন",
      backToHome: "হোমে ফিরুন",
      continue: "সেভ করে এগিয়ে যান",
      campusSelection: "ক্যাম্পাস নির্বাচন করুন",
      semesterSelection: "সেমিস্টার নির্বাচন করুন",
      semesterTypeSelection: "সেমিস্টার ধরন নির্বাচন করুন",
      programSelection: "প্রোগ্রাম নির্বাচন করুন",
      departmentSelection: "বিভাগ নির্বাচন করুন",
      selectCampus: "আপনার ক্যাম্পাস বেছে নিন",
      selectSemester: "সেমিস��টার বেছে নিন",
      selectSemesterType: "সেমিস্টার ধরন বেছ�� নিন",
      selectProgram: "আপনার প্রোগ্রাম বেছে নিন",
      selectDepartment: "আপনার বিভাগ বেছে নিন",
      programInfo: "প্রোগ���রামের তথ্য",
      costBreakdown: "খরচের বিভাজন",
      waiverCalculator: "মওকুফ ক্যালকুলেটর",
      academicInfo: "একাডেমিক তথ্য",
      sscGPA: "এসএসসি জিপিএ",
      hscGPA: "এইচএসসি জিপিএ",
      fourthSubject: "এসএস����ি ও এইচএসসি উভয়েই ৪র্থ বিষয় ছিল",
      calculateWaiver: "যোগ্য মওকুফ গণনা করুন",
      availableWaivers: "উপলব্ধ মওকুফ",
      resultBasedWaivers: "ফলাফল ভিত্তিক মওকুফ",
      specialWaivers: "বিশেষ মওকুফ",
      additionalWaivers: "অতিরিক্ত মওকুফ",
      estimatedCost: "আনুমানিক খরচ",
      originalAmount: "মূল পরিমাণ",
      waiverAmount: "মওকুফ পরিমাণ",
      finalAmount: "চূড়ান্ত পরিমাণ",
      admissionFee: "ভর্তি ফি",
      courseFee: "কোর্স ফি",
      labFee: "ল্যাব ফি",
      others: "অন্যান���য",
      total: "মোট",
      duration: "স���য়কাল",
      faculty: "অনুষদ",
      description: "বিবরণ",
      waiverApplied: "মওকুফ প্রয়োগ করা হয়েছে",
      noWaiverEligible: "���িপিএর ভিত্তিতে কোনো মওকুফ যোগ্য ���য়",
      selectProgramFirst: "প্রথমে একটি প্রো�����রাম নির্বাচন করুন",
      selectDepartmentFirst: "প্রথমে একটি বিভাগ নির্বাচন করুন",
      enterGPAValues: "যোগ্য মওকুফ দেখতে আপনার এসএসসি এবং এইচএসসি জিপিএ লিখুন",
      waiverPolicyNote: "মওক��ফ নীতি বিশ্ববিদ্যালয়ের অনুমোদন সাপেক্ষে",
      costNote:
        "অতিরিক্�� ফি এবং বিশ্ববিদ্যালয়ের নীতির ভিত্তিতে চূড়ান্ত খরচ পরিবর্তিত হতে প��রে",
      saving: "সেভ করা হচ্ছে...",
      saved: "ডেটা সফল��াবে সেভ হয়েছে!",
      saveError: "ডে���া সেভ করতে ব্যর্থ। আবার চেষ��টা করুন।",
    },
  };

  const t = texts[language];

  // Update available departments when program changes
  useEffect(() => {
    if (selectedProgram) {
      const depts = getDepartmentsByProgram(selectedProgram);
      setAvailableDepartments(depts);
      if (!depts.find((d) => d.id === selectedDepartment)) {
        setSelectedDepartment(""); // Reset department selection if current is not available
      }
    } else {
      setAvailableDepartments([]);
      setSelectedDepartment("");
    }
  }, [selectedProgram, selectedDepartment]);

  // Update cost calculation when program changes
  useEffect(() => {
    if (selectedProgram) {
      const program = getProgramById(selectedProgram);
      if (program) {
        const calculation = calculateWaiverAmount(
          program.costStructure.total,
          selectedWaivers,
        );
        setCostCalculation({
          originalAmount: program.costStructure.total,
          ...calculation,
        });
      }
    }
  }, [selectedProgram, selectedWaivers]);

  // Calculate result-based waiver when GPA changes
  useEffect(() => {
    if (sscGPA && hscGPA) {
      const sscValue = parseFloat(sscGPA);
      const hscValue = parseFloat(hscGPA);

      if (sscValue >= 0 && sscValue <= 5 && hscValue >= 0 && hscValue <= 5) {
        const resultWaiver = getResultBasedWaiverByGPA(
          sscValue,
          hscValue,
          hasFourthSubject,
        );

        if (resultWaiver) {
          setAutoSelectedResultWaiver(resultWaiver.id);
          // Update selected waivers to include the result-based waiver
          setSelectedWaivers((prev) => {
            const filtered = prev.filter(
              (id) => !getResultBasedWaivers().find((w) => w.id === id),
            );
            return [...filtered, resultWaiver.id];
          });
        } else {
          setAutoSelectedResultWaiver("");
          // Remove any result-based waivers
          setSelectedWaivers((prev) =>
            prev.filter(
              (id) => !getResultBasedWaivers().find((w) => w.id === id),
            ),
          );
        }
      }
    }
  }, [sscGPA, hscGPA, hasFourthSubject]);

  // Auto-save data when form values change
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (
        selectedCampus ||
        selectedSemester ||
        selectedSemesterType ||
        selectedProgram ||
        selectedDepartment ||
        sscGPA ||
        hscGPA
      ) {
        updateApplicationData({
          campus: selectedCampus,
          semester: selectedSemester,
          semesterType: selectedSemesterType,
          program: selectedProgram,
          department: selectedDepartment,
          sscGPA: sscGPA ? parseFloat(sscGPA) : undefined,
          hscGPA: hscGPA ? parseFloat(hscGPA) : undefined,
          selectedWaivers,
          totalCost: costCalculation.originalAmount,
          waiverAmount: costCalculation.waiverAmount,
          finalAmount: costCalculation.finalAmount,
          session: "Spring 2024", // Default session
        });
      }
    }, 1000); // Auto-save after 1 second of inactivity

    return () => clearTimeout(timeoutId);
  }, [
    selectedCampus,
    selectedSemester,
    selectedSemesterType,
    selectedProgram,
    selectedDepartment,
    sscGPA,
    hscGPA,
    selectedWaivers,
    costCalculation,
    updateApplicationData,
  ]);

  const handleWaiverToggle = (waiverId: string, checked: boolean) => {
    if (checked) {
      setSelectedWaivers((prev) => [...prev, waiverId]);
    } else {
      setSelectedWaivers((prev) => prev.filter((id) => id !== waiverId));
    }
  };

  const handleContinue = async () => {
    if (
      !selectedCampus ||
      !selectedSemester ||
      !selectedSemesterType ||
      !selectedProgram ||
      !selectedDepartment
    ) {
      toast({
        title: "Required Fields Missing",
        description:
          "Please select campus, semester, semester type, program, and department before continuing.",
        variant: "destructive",
      });
      return;
    }

    // Additional validation for credit transfer
    if (admissionType === "credit-transfer") {
      if (
        !previousInstitution ||
        !previousProgram ||
        !totalCreditsInProgram ||
        !completedCredits ||
        !previousCGPA
      ) {
        toast({
          title: "Credit Transfer Information Required",
          description:
            "Please fill in all credit transfer information before continuing.",
          variant: "destructive",
        });
        return;
      }
    }

    setIsSaving(true);

    try {
      // Save current step data
      const saveData = {
        admissionType,
        campus: selectedCampus,
        semester: selectedSemester,
        semesterType: selectedSemesterType,
        program: selectedProgram,
        department: selectedDepartment,
        sscGPA: sscGPA ? parseFloat(sscGPA) : undefined,
        hscGPA: hscGPA ? parseFloat(hscGPA) : undefined,
        selectedWaivers,
        totalCost: costCalculation.originalAmount,
        waiverAmount: costCalculation.waiverAmount,
        finalAmount: costCalculation.finalAmount,
        session: "Spring 2024",
      };

      // Add credit transfer data if applicable
      if (admissionType === "credit-transfer") {
        Object.assign(saveData, {
          previousInstitution,
          previousProgram,
          totalCreditsInProgram: totalCreditsInProgram
            ? parseInt(totalCreditsInProgram)
            : undefined,
          completedCredits: completedCredits
            ? parseInt(completedCredits)
            : undefined,
          previousCGPA: previousCGPA ? parseFloat(previousCGPA) : undefined,
          reasonForTransfer,
        });
      }

      updateApplicationData(saveData);

      const success = await saveCurrentStep("program-selection");

      if (success) {
        toast({
          title: t.saved,
          description: "Your program selection has been saved.",
        });
        navigate("/personal-information");
      } else {
        toast({
          title: t.saveError,
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("Save error:", error);
      toast({
        title: t.saveError,
        variant: "destructive",
      });
    } finally {
      setIsSaving(false);
    }
  };

  const selectedProgramData = selectedProgram
    ? getProgramById(selectedProgram)
    : null;
  const selectedDepartmentData = selectedDepartment
    ? departments.find((d) => d.id === selectedDepartment)
    : null;

  const canProceed =
    selectedCampus &&
    selectedSemester &&
    selectedSemesterType &&
    selectedProgram &&
    selectedDepartment;

  return (
    <div>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <Link
            to="/"
            className="inline-flex items-center text-accent-purple hover:text-deep-plum mb-4"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            {t.backToHome}
          </Link>

          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold text-deep-plum font-poppins">
                {admissionType === "credit-transfer"
                  ? t.creditTransferTitle
                  : t.title}
              </h1>
              <p className="text-accent-purple font-medium">
                {admissionType === "credit-transfer"
                  ? t.creditTransferSubtitle
                  : t.subtitle}
              </p>
            </div>

            {/* Language Toggle */}
            <div className="flex items-center bg-white rounded-lg p-1 shadow-sm">
              <button
                onClick={() => setLanguage("en")}
                className={`px-3 py-1 text-sm font-medium rounded-md transition-colors ${
                  language === "en"
                    ? "bg-deep-plum text-white"
                    : "text-gray-600 hover:text-deep-plum"
                }`}
              >
                EN
              </button>
              <button
                onClick={() => setLanguage("bn")}
                className={`px-3 py-1 text-sm font-medium rounded-md transition-colors ${
                  language === "bn"
                    ? "bg-deep-plum text-white"
                    : "text-gray-600 hover:text-deep-plum"
                }`}
              >
                BN
              </button>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Selection Forms */}
          <div className="lg:col-span-2 space-y-8">
            {/* Campus, Semester, and Semester Type Selection */}
            <Card className="bg-white shadow-lg">
              <CardHeader>
                <CardTitle className="text-xl font-poppins text-deep-plum">
                  Admission Preferences
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Campus Selection */}
                <div className="space-y-2">
                  <Label htmlFor="campus">
                    {t.selectCampus} <span className="text-red-500">*</span>
                  </Label>
                  <Select
                    value={selectedCampus}
                    onValueChange={setSelectedCampus}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder={t.selectCampus} />
                    </SelectTrigger>
                    <SelectContent>
                      {campusOptions.map((campus) => (
                        <SelectItem key={campus.id} value={campus.id}>
                          {language === "en" ? campus.name : campus.namebn}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Semester Selection */}
                  <div className="space-y-2">
                    <Label htmlFor="semester">
                      {t.selectSemester} <span className="text-red-500">*</span>
                    </Label>
                    <Select
                      value={selectedSemester}
                      onValueChange={setSelectedSemester}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder={t.selectSemester} />
                      </SelectTrigger>
                      <SelectContent>
                        {semesterOptions.map((semester) => (
                          <SelectItem key={semester.id} value={semester.id}>
                            {language === "en"
                              ? semester.name
                              : semester.namebn}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Semester Type Selection */}
                  <div className="space-y-2">
                    <Label htmlFor="semesterType">
                      {t.selectSemesterType}{" "}
                      <span className="text-red-500">*</span>
                    </Label>
                    <Select
                      value={selectedSemesterType}
                      onValueChange={setSelectedSemesterType}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder={t.selectSemesterType} />
                      </SelectTrigger>
                      <SelectContent>
                        {semesterTypeOptions.map((type) => (
                          <SelectItem key={type.id} value={type.id}>
                            {language === "en" ? type.name : type.namebn}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Program and Department Selection */}
            <Card className="bg-white shadow-lg">
              <CardHeader>
                <CardTitle className="text-xl font-poppins text-deep-plum">
                  {t.programSelection}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Program Selection */}
                <div className="space-y-2">
                  <Label htmlFor="program">
                    {t.selectProgram} <span className="text-red-500">*</span>
                  </Label>
                  <Select
                    value={selectedProgram}
                    onValueChange={setSelectedProgram}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder={t.selectProgram} />
                    </SelectTrigger>
                    <SelectContent>
                      {programs.map((program) => (
                        <SelectItem key={program.id} value={program.id}>
                          {language === "en" ? program.name : program.namebn} (
                          {language === "en"
                            ? program.duration
                            : program.durationbn}
                          )
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Department Selection */}
                <div className="space-y-2">
                  <Label htmlFor="department">
                    {t.selectDepartment} <span className="text-red-500">*</span>
                  </Label>
                  <Select
                    value={selectedDepartment}
                    onValueChange={setSelectedDepartment}
                    disabled={!selectedProgram}
                  >
                    <SelectTrigger>
                      <SelectValue
                        placeholder={
                          selectedProgram
                            ? t.selectDepartment
                            : t.selectProgramFirst
                        }
                      />
                    </SelectTrigger>
                    <SelectContent>
                      {availableDepartments.map((department) => (
                        <SelectItem key={department.id} value={department.id}>
                          {language === "en"
                            ? department.name
                            : department.namebn}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Program Information */}
                {selectedProgramData && selectedDepartmentData && (
                  <div className="mt-6 p-4 bg-gradient-to-r from-blue-50 to-blue-100 rounded-lg">
                    <h3 className="font-semibold text-deep-plum mb-3 flex items-center gap-2">
                      <Info className="w-4 h-4" />
                      {t.programInfo}
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                      <div>
                        <span className="font-medium">{t.duration}:</span>{" "}
                        {language === "en"
                          ? selectedProgramData.duration
                          : selectedProgramData.durationbn}
                      </div>
                      <div>
                        <span className="font-medium">{t.faculty}:</span>{" "}
                        {language === "en"
                          ? selectedDepartmentData.faculty
                          : selectedDepartmentData.facultybn}
                      </div>
                      <div className="md:col-span-2">
                        <span className="font-medium">{t.description}:</span>{" "}
                        {language === "en"
                          ? selectedDepartmentData.description
                          : selectedDepartmentData.descriptionbn}
                      </div>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Credit Transfer Information (only for credit transfer applications) */}
            {admissionType === "credit-transfer" && (
              <Card className="bg-white shadow-lg">
                <CardHeader>
                  <CardTitle className="text-xl font-poppins text-deep-plum flex items-center gap-2">
                    <ArrowRight className="w-5 h-5" />
                    {t.creditTransferInfo}
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="previousInstitution">
                        {t.previousInstitution}{" "}
                        <span className="text-red-500">*</span>
                      </Label>
                      <Input
                        id="previousInstitution"
                        value={previousInstitution}
                        onChange={(e) => setPreviousInstitution(e.target.value)}
                        placeholder="Enter previous institution name"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="previousProgram">
                        {t.previousProgram}{" "}
                        <span className="text-red-500">*</span>
                      </Label>
                      <Input
                        id="previousProgram"
                        value={previousProgram}
                        onChange={(e) => setPreviousProgram(e.target.value)}
                        placeholder="Enter previous program"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="totalCredits">
                        {t.totalCredits} <span className="text-red-500">*</span>
                      </Label>
                      <Input
                        id="totalCredits"
                        type="number"
                        min="1"
                        value={totalCreditsInProgram}
                        onChange={(e) =>
                          setTotalCreditsInProgram(e.target.value)
                        }
                        placeholder="120"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="completedCredits">
                        {t.completedCredits}{" "}
                        <span className="text-red-500">*</span>
                      </Label>
                      <Input
                        id="completedCredits"
                        type="number"
                        min="1"
                        value={completedCredits}
                        onChange={(e) => setCompletedCredits(e.target.value)}
                        placeholder="60"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="previousCGPA">
                        {t.previousCGPA} <span className="text-red-500">*</span>
                      </Label>
                      <Input
                        id="previousCGPA"
                        type="number"
                        min="0"
                        max="4"
                        step="0.01"
                        value={previousCGPA}
                        onChange={(e) => setPreviousCGPA(e.target.value)}
                        placeholder="3.50"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="reasonForTransfer">
                        {t.reasonForTransfer}
                      </Label>
                      <Input
                        id="reasonForTransfer"
                        value={reasonForTransfer}
                        onChange={(e) => setReasonForTransfer(e.target.value)}
                        placeholder="Optional reason for transfer"
                      />
                    </div>
                  </div>

                  {/* Transcript Upload */}
                  <div className="space-y-2">
                    <Label>
                      {t.uploadTranscript}{" "}
                      <span className="text-red-500">*</span>
                    </Label>
                    <div
                      className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-accent-purple transition-colors cursor-pointer"
                      onClick={() => transcriptFileInputRef.current?.click()}
                      onDragOver={(e) => {
                        e.preventDefault();
                        e.currentTarget.classList.add(
                          "border-accent-purple",
                          "bg-purple-50",
                        );
                      }}
                      onDragLeave={(e) => {
                        e.preventDefault();
                        e.currentTarget.classList.remove(
                          "border-accent-purple",
                          "bg-purple-50",
                        );
                      }}
                      onDrop={(e) => {
                        e.preventDefault();
                        e.currentTarget.classList.remove(
                          "border-accent-purple",
                          "bg-purple-50",
                        );
                        const files = e.dataTransfer.files;
                        if (files.length > 0) {
                          const file = files[0];
                          const acceptedTypes = [
                            ".pdf",
                            ".jpg",
                            ".jpeg",
                            ".png",
                          ];
                          const fileExtension =
                            "." + file.name.split(".").pop()?.toLowerCase();
                          if (acceptedTypes.includes(fileExtension)) {
                            setTranscriptFile(file);
                          }
                        }
                      }}
                    >
                      <Upload className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                      <p className="text-sm text-gray-600">
                        Click or drag transcript file here (.pdf, .jpg, .png)
                      </p>
                      <input
                        ref={transcriptFileInputRef}
                        type="file"
                        className="hidden"
                        accept=".pdf,.jpg,.jpeg,.png"
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (file) {
                            setTranscriptFile(file);
                          }
                        }}
                      />
                      {transcriptFile && (
                        <p className="text-sm text-green-600 mt-2">
                          Selected: {transcriptFile.name}
                        </p>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Waiver Calculator */}
            <Card className="bg-white shadow-lg">
              <CardHeader>
                <CardTitle className="text-xl font-poppins text-deep-plum flex items-center gap-2">
                  <Calculator className="w-5 h-5" />
                  {t.waiverCalculator}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Academic Information */}
                <div>
                  <h3 className="font-semibold text-deep-plum mb-4">
                    {t.academicInfo}
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="sscGPA">{t.sscGPA}</Label>
                      <Input
                        id="sscGPA"
                        type="number"
                        min="0"
                        max="5"
                        step="0.01"
                        value={sscGPA}
                        onChange={(e) => setSscGPA(e.target.value)}
                        placeholder="0.00"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="hscGPA">{t.hscGPA}</Label>
                      <Input
                        id="hscGPA"
                        type="number"
                        min="0"
                        max="5"
                        step="0.01"
                        value={hscGPA}
                        onChange={(e) => setHscGPA(e.target.value)}
                        placeholder="0.00"
                      />
                    </div>
                  </div>
                  <div className="mt-4 flex items-center space-x-2">
                    <Checkbox
                      id="fourthSubject"
                      checked={hasFourthSubject}
                      onCheckedChange={(checked) =>
                        setHasFourthSubject(checked as boolean)
                      }
                    />
                    <Label htmlFor="fourthSubject" className="text-sm">
                      {t.fourthSubject}
                    </Label>
                  </div>
                </div>

                {/* Result-based Waiver Display */}
                {sscGPA && hscGPA && (
                  <div>
                    {autoSelectedResultWaiver ? (
                      <Alert className="border-green-200 bg-green-50">
                        <CheckCircle className="w-4 h-4 text-green-600" />
                        <AlertDescription className="text-green-800">
                          <strong>{t.waiverApplied}:</strong>{" "}
                          {language === "en"
                            ? waiverPolicies.find(
                                (w) => w.id === autoSelectedResultWaiver,
                              )?.name
                            : waiverPolicies.find(
                                (w) => w.id === autoSelectedResultWaiver,
                              )?.namebn}{" "}
                          (
                          {
                            waiverPolicies.find(
                              (w) => w.id === autoSelectedResultWaiver,
                            )?.percentage
                          }
                          %)
                        </AlertDescription>
                      </Alert>
                    ) : (
                      <Alert className="border-orange-200 bg-orange-50">
                        <AlertCircle className="w-4 h-4 text-orange-600" />
                        <AlertDescription className="text-orange-800">
                          {t.noWaiverEligible}
                        </AlertDescription>
                      </Alert>
                    )}
                  </div>
                )}

                {/* Available Waivers */}
                <div>
                  <h3 className="font-semibold text-deep-plum mb-4">
                    {t.availableWaivers}
                  </h3>

                  {/* Special Waivers */}
                  <div className="mb-4">
                    <h4 className="font-medium text-gray-700 mb-2">
                      {t.specialWaivers}
                    </h4>
                    <div className="space-y-2">
                      {getSpecialWaivers().map((waiver) => (
                        <div
                          key={waiver.id}
                          className="flex items-center space-x-2 p-2 bg-purple-50 rounded"
                        >
                          <Checkbox
                            id={waiver.id}
                            checked={selectedWaivers.includes(waiver.id)}
                            onCheckedChange={(checked) =>
                              handleWaiverToggle(waiver.id, checked as boolean)
                            }
                          />
                          <Label htmlFor={waiver.id} className="text-sm flex-1">
                            {language === "en" ? waiver.name : waiver.namebn} (
                            {waiver.percentage}%)
                          </Label>
                          <Badge variant="outline" className="text-xs">
                            {waiver.percentage}%
                          </Badge>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Additional Waivers */}
                  <div className="mb-4">
                    <h4 className="font-medium text-gray-700 mb-2">
                      {t.additionalWaivers}
                    </h4>
                    <div className="space-y-2">
                      {getAdditionalWaivers().map((waiver) => (
                        <div
                          key={waiver.id}
                          className="flex items-center space-x-2 p-2 bg-yellow-50 rounded"
                        >
                          <Checkbox
                            id={waiver.id}
                            checked={selectedWaivers.includes(waiver.id)}
                            onCheckedChange={(checked) =>
                              handleWaiverToggle(waiver.id, checked as boolean)
                            }
                          />
                          <Label htmlFor={waiver.id} className="text-sm flex-1">
                            {language === "en" ? waiver.name : waiver.namebn} (
                            {waiver.percentage}%)
                          </Label>
                          <Badge variant="outline" className="text-xs">
                            {waiver.percentage}%
                          </Badge>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Waiver Policy Notes */}
                <Alert className="border-blue-200 bg-blue-50">
                  <Info className="w-4 h-4 text-blue-600" />
                  <AlertDescription className="text-blue-800 text-sm">
                    {t.waiverPolicyNote}
                  </AlertDescription>
                </Alert>
              </CardContent>
            </Card>
          </div>

          {/* Right Column - Cost Breakdown */}
          <div className="space-y-6">
            {/* Cost Breakdown */}
            <Card className="bg-white shadow-lg">
              <CardHeader className="bg-deep-plum text-white">
                <CardTitle className="font-poppins flex items-center gap-2">
                  <DollarSign className="w-5 h-5" />
                  {t.costBreakdown}
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                {selectedProgramData ? (
                  <div className="space-y-4">
                    {/* Original Cost Breakdown */}
                    <div className="space-y-3">
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600">{t.admissionFee}</span>
                        <span className="font-medium">
                          ৳
                          {selectedProgramData.costStructure.admissionFee.toLocaleString()}
                        </span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600">{t.courseFee}</span>
                        <span className="font-medium">
                          ৳
                          {selectedProgramData.costStructure.courseFee.toLocaleString()}
                        </span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600">{t.labFee}</span>
                        <span className="font-medium">
                          ৳
                          {selectedProgramData.costStructure.labFee.toLocaleString()}
                        </span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600">{t.others}</span>
                        <span className="font-medium">
                          ৳
                          {selectedProgramData.costStructure.others.toLocaleString()}
                        </span>
                      </div>

                      <Separator />

                      <div className="flex justify-between font-semibold">
                        <span className="text-deep-plum">
                          {t.originalAmount}
                        </span>
                        <span className="text-deep-plum">
                          ৳{costCalculation.originalAmount.toLocaleString()}
                        </span>
                      </div>

                      {/* Waiver Amount */}
                      {costCalculation.waiverAmount > 0 && (
                        <>
                          <div className="flex justify-between text-green-600 font-medium">
                            <span>
                              {t.waiverAmount} (
                              {costCalculation.waiverPercentage}%)
                            </span>
                            <span>
                              -৳{costCalculation.waiverAmount.toLocaleString()}
                            </span>
                          </div>

                          <Separator />
                        </>
                      )}

                      {/* Final Amount */}
                      <div className="flex justify-between text-xl font-bold">
                        <span className="text-deep-plum">{t.finalAmount}</span>
                        <span className="text-accent-purple">
                          ৳{costCalculation.finalAmount.toLocaleString()}
                        </span>
                      </div>
                    </div>

                    {/* Savings Display */}
                    {costCalculation.waiverAmount > 0 && (
                      <div className="mt-4 p-3 bg-green-50 rounded-lg border border-green-200">
                        <div className="flex items-center gap-2 text-green-800">
                          <Award className="w-4 h-4" />
                          <span className="font-medium">
                            You Save: ৳
                            {costCalculation.waiverAmount.toLocaleString()}
                          </span>
                        </div>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="text-center text-gray-500 py-8">
                    <Calculator className="w-12 h-12 mx-auto mb-3 text-gray-400" />
                    <p>{t.selectProgramFirst}</p>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Selected Waivers Summary */}
            {selectedWaivers.length > 0 && (
              <Card className="bg-gradient-to-r from-green-50 to-green-100 border-green-200">
                <CardHeader>
                  <CardTitle className="text-lg font-poppins text-green-800">
                    Applied Waivers ({selectedWaivers.length})
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    {selectedWaivers.map((waiverId) => {
                      const waiver = waiverPolicies.find(
                        (w) => w.id === waiverId,
                      );
                      return waiver ? (
                        <div
                          key={waiverId}
                          className="flex justify-between items-center p-2 bg-white rounded text-sm"
                        >
                          <span>
                            {language === "en" ? waiver.name : waiver.namebn}
                          </span>
                          <Badge className="bg-green-600 text-white">
                            {waiver.percentage}%
                          </Badge>
                        </div>
                      ) : null;
                    })}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Cost Note */}
            <Alert className="border-gray-200 bg-gray-50">
              <Info className="w-4 h-4 text-gray-600" />
              <AlertDescription className="text-gray-700 text-xs">
                {t.costNote}
              </AlertDescription>
            </Alert>
          </div>
        </div>

        {/* Continue Button */}
        <div className="mt-8 flex justify-end">
          <Button
            onClick={handleContinue}
            className={`${
              canProceed
                ? "bg-deep-plum hover:bg-accent-purple"
                : "bg-gray-300 cursor-not-allowed"
            } font-poppins px-8 py-3`}
            disabled={!canProceed || isSaving}
          >
            {isSaving ? t.saving : t.continue}
            <ArrowRight className="w-4 h-4 ml-2" />
          </Button>
        </div>
      </div>
    </div>
  );
}
