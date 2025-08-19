import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  User,
  FileText,
  GraduationCap,
  MapPin,
  Phone,
  Mail,
  Calendar,
  CheckCircle,
  Send,
  Edit,
} from "lucide-react";
import { Button } from "../components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../components/ui/card";
import { Badge } from "../components/ui/badge";
import { Separator } from "../components/ui/separator";
import { Alert, AlertDescription } from "../components/ui/alert";
import { useApplication } from "../contexts/ApplicationContext";
import { useToast } from "../hooks/use-toast";

export default function ApplicationReview() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { applicationData, submitApplication } = useApplication();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [language, setLanguage] = useState<"en" | "bn">("en");

  const texts = {
    en: {
      title: "Application Review",
      subtitle: "Step 4 of 4 - Review Your Application",
      backToAcademic: "Back to Academic History",
      submitApplication: "Submit Application",
      admissionPreferences: "Admission Preferences",
      programInfo: "Program Information", 
      personalInfo: "Personal Information",
      familyInfo: "Family Information",
      academicInfo: "Academic History",
      costSummary: "Cost Summary",
      campus: "Campus",
      semester: "Semester",
      semesterType: "Semester Type",
      program: "Program",
      department: "Department",
      name: "Name",
      dateOfBirth: "Date of Birth", 
      gender: "Gender",
      phone: "Phone",
      email: "Email",
      address: "Address",
      guardianName: "Guardian Name",
      guardianPhone: "Guardian Phone",
      guardianRelation: "Guardian Relation",
      sscInfo: "SSC Information",
      hscInfo: "HSC Information",
      institution: "Institution",
      year: "Year",
      gpa: "GPA",
      originalAmount: "Original Amount",
      waiverAmount: "Waiver Amount", 
      finalAmount: "Final Amount",
      submitting: "Submitting Application...",
      submitError: "Failed to submit application. Please try again.",
      reviewNote: "Please review all information carefully before submitting. Once submitted, you cannot make changes.",
      dataIncomplete: "Please complete all previous steps before submitting.",
      edit: "Edit",
    },
    bn: {
      title: "আবেদন পর্যালোচনা",
      subtitle: "৪টি ধাপের ৪র্থ ধাপ - আপনার আবেদন পর্যালোচনা করুন",
      backToAcademic: "একাডেমিক ইতিহাসে ফিরুন",
      submitApplication: "আবেদন জমা দিন",
      admissionPreferences: "ভর্তির পছন্দ",
      programInfo: "প্রোগ্রামের তথ্য",
      personalInfo: "ব্যক্তিগত তথ্য", 
      familyInfo: "পারিবারিক তথ্য",
      academicInfo: "একাডেমিক ইতিহাস",
      costSummary: "খ��চের সারসংক্ষেপ",
      campus: "ক্যাম্পাস",
      semester: "সেমিস্টার",
      semesterType: "সেমিস্টার ধরন",
      program: "প্রোগ্রাম",
      department: "বিভাগ",
      name: "নাম",
      dateOfBirth: "জন্ম তারিখ",
      gender: "লিঙ্গ",
      phone: "ফোন",
      email: "ইমেইল",
      address: "ঠিকানা",
      guardianName: "অভিভাবকের নাম",
      guardianPhone: "অভিভাবকের ফোন",
      guardianRelation: "অভিভাবকের সম্পর্ক",
      sscInfo: "এসএসসি তথ্য",
      hscInfo: "এইচএসসি তথ্য",
      institution: "প্রতিষ্ঠান",
      year: "বছর",
      gpa: "জিপিএ",
      originalAmount: "মূল পরিমাণ",
      waiverAmount: "মওকুফের পরিমাণ",
      finalAmount: "চূড়ান্ত পরিমাণ",
      submitting: "আবেদন জমা দেওয়া হচ্ছে...",
      submitError: "আবেদন জমা দিতে ব্যর্থ। অনুগ্রহ কর��� আবার চেষ্টা করুন।",
      reviewNote: "জমা দেওয়ার আগে সমস্ত তথ্য সাবধানে পর্যালোচনা করুন। একবার জমা দিলে, আপনি পরিবর্তন করতে পারবেন না।",
      dataIncomplete: "জমা দে��য়ার আগে সমস্ত পূর্ববর্তী ধাপ সম্পূর্ণ করুন।",
    },
  };

  const t = texts[language];

  const handleSubmit = async () => {
    // Validate required data
    if (!applicationData.program || !applicationData.department || !applicationData.firstName || !applicationData.lastName) {
      toast({
        title: "Incomplete Application",
        description: t.dataIncomplete,
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);

    try {
      const result = await submitApplication();
      
      if (result.success && result.trackingId) {
        // Navigate to success page with tracking ID
        navigate(`/application-success?trackingId=${result.trackingId}`);
      } else {
        toast({
          title: "Submission Failed",
          description: result.error || t.submitError,
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("Application submission error:", error);
      toast({
        title: "Submission Failed",
        description: t.submitError,
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div>
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-deep-plum font-poppins">
              {t.title}
            </h1>
            <p className="text-gray-600 mt-2">{t.subtitle}</p>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setLanguage(language === "en" ? "bn" : "en")}
              className={`px-3 py-1 text-sm rounded ${
                language === "en"
                  ? "bg-deep-plum text-white"
                  : "bg-gray-200 text-gray-700"
              }`}
            >
              EN
            </button>
            <button
              onClick={() => setLanguage(language === "en" ? "bn" : "en")}
              className={`px-3 py-1 text-sm rounded ${
                language === "bn"
                  ? "bg-deep-plum text-white"
                  : "bg-gray-200 text-gray-700"
              }`}
            >
              BN
            </button>
          </div>
        </div>

        {/* Review Alert */}
        <Alert className="mb-8 border-amber-200 bg-amber-50">
          <CheckCircle className="h-4 w-4 text-amber-600" />
          <AlertDescription className="text-amber-800">
            {t.reviewNote}
          </AlertDescription>
        </Alert>

        <div className="space-y-8">
          {/* Admission Preferences */}
          <Card className="bg-white shadow-lg">
            <CardHeader>
              <CardTitle className="text-xl font-poppins text-deep-plum flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <GraduationCap className="w-5 h-5" />
                  {t.admissionPreferences}
                </div>
                <Link to="/program-selection">
                  <Button variant="outline" size="sm" className="text-accent-purple border-accent-purple hover:bg-accent-purple hover:text-white">
                    <Edit className="w-4 h-4 mr-1" />
                    {t.edit}
                  </Button>
                </Link>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <span className="font-medium text-gray-600">{t.campus}:</span>
                  <p className="capitalize">{applicationData.campus || "-"}</p>
                </div>
                <div>
                  <span className="font-medium text-gray-600">{t.semester}:</span>
                  <p className="capitalize">{applicationData.semester || "-"}</p>
                </div>
                <div>
                  <span className="font-medium text-gray-600">{t.semesterType}:</span>
                  <p className="capitalize">{applicationData.semesterType || "-"}</p>
                </div>
              </div>
              <Separator />
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <span className="font-medium text-gray-600">{t.program}:</span>
                  <p>{applicationData.program || "-"}</p>
                </div>
                <div>
                  <span className="font-medium text-gray-600">{t.department}:</span>
                  <p>{applicationData.department || "-"}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Personal Information */}
          <Card className="bg-white shadow-lg">
            <CardHeader>
              <CardTitle className="text-xl font-poppins text-deep-plum flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <User className="w-5 h-5" />
                  {t.personalInfo}
                </div>
                <Link to="/personal-information">
                  <Button variant="outline" size="sm" className="text-accent-purple border-accent-purple hover:bg-accent-purple hover:text-white">
                    <Edit className="w-4 h-4 mr-1" />
                    {t.edit}
                  </Button>
                </Link>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <span className="font-medium text-gray-600">{t.name}:</span>
                  <p>{`${applicationData.firstName || ""} ${applicationData.lastName || ""}`.trim() || "-"}</p>
                </div>
                <div>
                  <span className="font-medium text-gray-600">{t.dateOfBirth}:</span>
                  <p>{applicationData.dateOfBirth || "-"}</p>
                </div>
                <div>
                  <span className="font-medium text-gray-600">{t.gender}:</span>
                  <p className="capitalize">{applicationData.gender || "-"}</p>
                </div>
                <div>
                  <span className="font-medium text-gray-600">{t.phone}:</span>
                  <p>{applicationData.phone || "-"}</p>
                </div>
                <div>
                  <span className="font-medium text-gray-600">{t.email}:</span>
                  <p>{applicationData.email || "-"}</p>
                </div>
                <div>
                  <span className="font-medium text-gray-600">{t.address}:</span>
                  <p>{applicationData.presentAddress || "-"}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Family Information */}
          <Card className="bg-white shadow-lg">
            <CardHeader>
              <CardTitle className="text-xl font-poppins text-deep-plum flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <User className="w-5 h-5" />
                  {t.familyInfo}
                </div>
                <Link to="/personal-information">
                  <Button variant="outline" size="sm" className="text-accent-purple border-accent-purple hover:bg-accent-purple hover:text-white">
                    <Edit className="w-4 h-4 mr-1" />
                    {t.edit}
                  </Button>
                </Link>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <span className="font-medium text-gray-600">{t.guardianName}:</span>
                  <p>{applicationData.guardianName || "-"}</p>
                </div>
                <div>
                  <span className="font-medium text-gray-600">{t.guardianPhone}:</span>
                  <p>{applicationData.guardianPhone || "-"}</p>
                </div>
                <div>
                  <span className="font-medium text-gray-600">{t.guardianRelation}:</span>
                  <p>{applicationData.guardianRelation || "-"}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Academic Information */}
          <Card className="bg-white shadow-lg">
            <CardHeader>
              <CardTitle className="text-xl font-poppins text-deep-plum flex items-center gap-2">
                <FileText className="w-5 h-5" />
                {t.academicInfo}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h4 className="font-semibold text-gray-700 mb-2">{t.sscInfo}</h4>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <span className="font-medium text-gray-600">{t.institution}:</span>
                    <p>{applicationData.sscInstitution || "-"}</p>
                  </div>
                  <div>
                    <span className="font-medium text-gray-600">{t.year}:</span>
                    <p>{applicationData.sscYear || "-"}</p>
                  </div>
                  <div>
                    <span className="font-medium text-gray-600">{t.gpa}:</span>
                    <p>{applicationData.sscGPA || "-"}</p>
                  </div>
                </div>
              </div>
              <Separator />
              <div>
                <h4 className="font-semibold text-gray-700 mb-2">{t.hscInfo}</h4>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <span className="font-medium text-gray-600">{t.institution}:</span>
                    <p>{applicationData.hscInstitution || "-"}</p>
                  </div>
                  <div>
                    <span className="font-medium text-gray-600">{t.year}:</span>
                    <p>{applicationData.hscYear || "-"}</p>
                  </div>
                  <div>
                    <span className="font-medium text-gray-600">{t.gpa}:</span>
                    <p>{applicationData.hscGPA || "-"}</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Cost Summary */}
          <Card className="bg-white shadow-lg">
            <CardHeader>
              <CardTitle className="text-xl font-poppins text-deep-plum">
                {t.costSummary}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="text-center p-4 bg-blue-50 rounded-lg">
                  <p className="text-sm text-gray-600">{t.originalAmount}</p>
                  <p className="text-xl font-bold text-blue-600">
                    ৳{(applicationData.totalCost || 0).toLocaleString()}
                  </p>
                </div>
                <div className="text-center p-4 bg-green-50 rounded-lg">
                  <p className="text-sm text-gray-600">{t.waiverAmount}</p>
                  <p className="text-xl font-bold text-green-600">
                    -৳{(applicationData.waiverAmount || 0).toLocaleString()}
                  </p>
                </div>
                <div className="text-center p-4 bg-purple-50 rounded-lg">
                  <p className="text-sm text-gray-600">{t.finalAmount}</p>
                  <p className="text-2xl font-bold text-purple-600">
                    ৳{(applicationData.finalAmount || 0).toLocaleString()}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Navigation */}
        <div className="flex flex-col sm:flex-row justify-between gap-4 mt-8">
          <Link to="/academic-history">
            <Button variant="outline" className="w-full sm:w-auto">
              <ArrowLeft className="w-4 h-4 mr-2" />
              {t.backToAcademic}
            </Button>
          </Link>
          <Button
            onClick={handleSubmit}
            disabled={isSubmitting}
            className="w-full sm:w-auto bg-deep-plum hover:bg-accent-purple"
          >
            {isSubmitting ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                {t.submitting}
              </>
            ) : (
              <>
                <Send className="w-4 h-4 mr-2" />
                {t.submitApplication}
              </>
            )}
          </Button>
        </div>
      </div>
    </div>
  );
}
