import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  Save,
  LogOut,
  Camera,
  Phone,
  Mail,
  CheckCircle,
  Users,
  Search,
  AlertCircle,
} from "lucide-react";
import ImageUpload from "../components/ImageUpload";
import { Button } from "../components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../components/ui/card";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../components/ui/select";
import { Textarea } from "../components/ui/textarea";
import { Badge } from "../components/ui/badge";
import { Alert, AlertDescription } from "../components/ui/alert";
import { useApplication } from "../contexts/ApplicationContext";
import { useToast } from "../hooks/use-toast";
import {
  getReferrerByUniversityId,
  validateReferenceId,
  formatReferenceId,
  type Referrer,
} from "../lib/referrerData";

export default function PersonalInformation() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { applicationData, updateApplicationData, saveCurrentStep } =
    useApplication();

  const [language, setLanguage] = useState<"en" | "bn">("en");
  const [isSaving, setIsSaving] = useState(false);

  // Form state
  const [formData, setFormData] = useState({
    firstName: applicationData.firstName || "",
    lastName: applicationData.lastName || "",
    preferredName: applicationData.preferredName || "",
    dateOfBirth: applicationData.dateOfBirth || "",
    gender: applicationData.gender || "",
    religion: applicationData.religion || "",
    bloodGroup: applicationData.bloodGroup || "",
    presentAddress: applicationData.presentAddress || "",
    permanentAddress: applicationData.permanentAddress || "",
    postcode: applicationData.postcode || "",
    district: applicationData.district || "",
    division: applicationData.division || "",
    citizenship: applicationData.citizenship || "Bangladeshi",
    nationalId: applicationData.nationalId || "",
    phone: applicationData.phone || "",
    email: applicationData.email || "",
    fatherName: applicationData.fatherName || "",
    fatherOccupation: applicationData.fatherOccupation || "",
    fatherMobile: applicationData.fatherMobile || "",
    motherName: applicationData.motherName || "",
    motherOccupation: applicationData.motherOccupation || "",
    motherMobile: applicationData.motherMobile || "",
    guardianName: applicationData.guardianName || "",
    guardianPhone: applicationData.guardianPhone || "",
    guardianRelation: applicationData.guardianRelation || "",
  });

  const [uploadedPhotoUrl, setUploadedPhotoUrl] = useState<string>(
    applicationData.photoUrl || "",
  );
  const [mobileVerified, setMobileVerified] = useState(
    applicationData.phoneVerified || false,
  );
  const [emailVerified, setEmailVerified] = useState(
    applicationData.emailVerified || false,
  );
  const [developerMode, setDeveloperMode] = useState(false);

  // Referrer system state
  const [referenceId, setReferenceId] = useState(
    applicationData.referrerId || "",
  );
  const [referrerInfo, setReferrerInfo] = useState<Referrer | null>(null);
  const [referrerError, setReferrerError] = useState("");

  const texts = {
    en: {
      title: "Personal Information",
      subtitle: "Step 2 of 4",
      backToPrevious: "Back to Program Selection",
      saveAndContinue: "Save & Continue",
      saveAndExit: "Save & Exit",
      uploadPhoto: "Upload Photo",
      cropPhoto: "Crop Photo",
      personalDetails: "Personal Details",
      contactInfo: "Contact Information",
      familyInfo: "Family Information",
      guardianInfo: "Local Guardian Information",
      documents: "Required Documents Checklist",
      fullName: "Full Name",
      preferredName: "Preferred Name",
      dateOfBirth: "Date of Birth",
      gender: "Gender",
      religion: "Religion",
      bloodGroup: "Blood Group",
      presentAddress: "Present Address",
      postcode: "Postcode",
      permanentAddress: "Permanent Address",
      district: "District",
      division: "Division",
      citizenship: "Citizenship",
      mobileNumber: "Mobile Number",
      email: "Email",
      fatherName: "Father's Name",
      fatherOccupation: "Father's Occupation",
      fatherMobile: "Father's Mobile",
      motherName: "Mother's Name",
      motherOccupation: "Mother's Occupation",
      motherMobile: "Mother's Mobile",
      guardianName: "Local Guardian Name",
      guardianContact: "Local Guardian Contact",
      nationalId: "National ID / Passport / Birth Certificate Number",
      verify: "Verify",
      verified: "Verified",
      required: "Required",
      male: "Male",
      female: "Female",
      other: "Other",
      photoUpload: "Photo Upload",
      nidCertificate: "NID/Passport/Birth Certificate",
      sscCertificate: "SSC Certificate",
      hscCertificate: "HSC Certificate",
      feeBreakdown: "Fee Breakdown",
      admissionFee: "Admission Fee",
      courseFee: "Course Fee",
      labFee: "Lab Fee",
      others: "Others",
      total: "Total",
      referralInfo: "Referral Information",
      referenceId: "Reference ID (Optional)",
      referenceIdPlaceholder: "Enter university ID (e.g., NU-FAC-001)",
      referrerFound: "Referrer Found",
      referrerNotFound: "Referrer not found with this ID",
      invalidFormat: "Invalid ID format. Use format: NU-XXX-000",
      referrerName: "Referrer Name",
      referrerDept: "Department",
      referrerDesignation: "Designation",
      referrerContact: "Contact",
      lookupReferrer: "Lookup Referrer",
      referralNote:
        "If someone from Northern University referred you, enter their university ID to help us track referrals.",
      saving: "Saving...",
      saved: "Data saved successfully!",
      saveError: "Failed to save data. Please try again.",
      firstName: "First Name",
      lastName: "Last Name",
    },
    bn: {
      title: "ব্যক্তিগত তথ্য",
      subtitle: "৪টি ধাপের ২য় ধাপ",
      backToPrevious: "প্রোগ্রাম ��ির্বাচনে ফিরুন",
      saveAndContinue: "সেভ করে এগিয়ে যান",
      saveAndExit: "সেভ করে বেরিয়ে যান",
      uploadPhoto: "ছবি আপলোড করুন",
      cropPhoto: "ছবি ক্রপ করুন",
      personalDetails: "ব্যক্তিগত বিবরণ",
      contactInfo: "যোগাযোগের তথ্য",
      familyInfo: "পারিবারিক তথ্য",
      guardianInfo: "স্থানীয় অভিভাবকের তথ্য",
      documents: "প্রয়োজনীয় কাগজপত্রের তালিকা",
      fullName: "পূর্ণ নাম",
      preferredName: "পছন্দের নাম",
      dateOfBirth: "জন্ম তারিখ",
      gender: "লিঙ্গ",
      religion: "ধর্ম",
      bloodGroup: "রক্তের গ্রুপ",
      presentAddress: "বর্তমান ঠিকানা",
      postcode: "পোস্টকোড",
      permanentAddress: "স্থায়ী ঠিকানা",
      district: "জেলা",
      division: "বিভাগ",
      citizenship: "নাগরিকত্ব",
      mobileNumber: "মোবাইল নাম্বার",
      email: "ইমেইল",
      fatherName: "পিতার নাম",
      fatherOccupation: "পিতার পেশা",
      fatherMobile: "পিতার মোবাইল",
      motherName: "মাতার নাম",
      motherOccupation: "মাতার পেশা",
      motherMobile: "মাতার মোবাইল",
      guardianName: "অভিভাবকের নাম",
      guardianContact: "অভিভাবকের যোগাযোগ",
      nationalId: "জাতীয় পরিচয়পত্র / পাসপোর্ট / জন্ম সনদ নাম্বার",
      verify: "যাচাই করুন",
      verified: "যাচাইকৃত",
      required: "প্রয়োজনীয়",
      male: "পুরুষ",
      female: "মহ��লা",
      other: "অন্যান্য",
      photoUpload: "ছব�� আপলোড",
      nidCertificate: "এনআইডি/পাসপোর্ট/জন্ম সনদ",
      sscCertificate: "এসএসসি সনদপত্র",
      hscCertificate: "এইচএসসি সনদপত্র",
      feeBreakdown: "ফি বিভাজন",
      admissionFee: "ভর্তি ফি",
      courseFee: "কোর্স ফি",
      labFee: "ল্যাব ফি",
      others: "অন্যান্য",
      total: "মোট",
      referralInfo: "রেফারেল তথ্য",
      referenceId: "রেফারেন্স আইডি (ঐচ্ছিক)",
      referenceIdPlaceholder: "বিশ্ববিদ্যালয় আইডি লিখুন (যেমন: NU-FAC-001)",
      referrerFound: "রেফারার পাওয়া গেছে",
      referrerNotFound: "এই আইডি দিয়ে কোন রেফারার পাওয়া যায়নি",
      invalidFormat: "ভুল আইডি ফরম্যাট। সঠিক ফরম্যাট: NU-XXX-000",
      referrerName: "রেফারারের নাম",
      referrerDept: "বিভাগ",
      referrerDesignation: "পদবী",
      referrerContact: "যোগাযোগ",
      lookupReferrer: "রেফারার খুঁজুন",
      referralNote:
        "যদি নর্দার্ন ইউনিভার্সিটির কেউ আপনাকে রেফার করে থাকেন, তাহলে তাদের বিশ্ববিদ্যালয় আই���ি লিখুন।",
      saving: "সেভ করা হচ্ছে...",
      saved: "ডেটা সফলভাবে সেভ হয়েছে!",
      saveError: "ডেটা সেভ করতে ব্যর্থ। আবার চেষ্টা করুন।",
      firstName: "প্রথম নাম",
      lastName: "শেষ নাম",
    },
  };

  const t = texts[language];

  // Load referrer info if referenceId exists
  useEffect(() => {
    if (referenceId && validateReferenceId(referenceId)) {
      const referrer = getReferrerByUniversityId(referenceId);
      if (referrer) {
        setReferrerInfo(referrer);
        setReferrerError("");
      }
    }
  }, []);

  // Check for developer mode and auto-verify
  useEffect(() => {
    const checkDeveloperMode = async () => {
      try {
        const response = await fetch('/api/admission-settings');
        if (response.ok) {
          const data = await response.json();
          if (data.success && data.data?.developer_mode) {
            setDeveloperMode(true);
            setMobileVerified(true);
            setEmailVerified(true);
            toast({
              title: "🚀 Developer Mode Active",
              description: "All verifications automatically bypassed for testing.",
              duration: 3000,
            });
          }
        }
      } catch (error) {
        console.log("Could not check developer mode:", error);
      }
    };

    checkDeveloperMode();
  }, []);

  // Auto-save data when form values change
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      const hasData =
        Object.values(formData).some((value) => value.trim() !== "") ||
        uploadedPhotoUrl ||
        referenceId;

      if (hasData) {
        updateApplicationData({
          ...formData,
          photoUrl: uploadedPhotoUrl,
          phoneVerified: mobileVerified,
          emailVerified: emailVerified,
          referrerId: referenceId,
          referrerName: referrerInfo?.name,
        });
      }
    }, 1000); // Auto-save after 1 second of inactivity

    return () => clearTimeout(timeoutId);
  }, [
    formData,
    uploadedPhotoUrl,
    mobileVerified,
    emailVerified,
    referenceId,
    referrerInfo,
    updateApplicationData,
  ]);

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const documentChecklist = [
    { id: "photo", label: t.photoUpload, completed: !!uploadedPhotoUrl },
    { id: "nid", label: t.nidCertificate, completed: false },
    { id: "ssc", label: t.sscCertificate, completed: false },
    { id: "hsc", label: t.hscCertificate, completed: false },
    { id: "referral", label: "Referral Info", completed: !!referrerInfo },
  ];

  // Handle referrer lookup
  const handleReferrerLookup = () => {
    setReferrerError("");
    setReferrerInfo(null);

    if (!referenceId.trim()) return;

    const formattedId = formatReferenceId(referenceId);

    if (!validateReferenceId(formattedId)) {
      setReferrerError(t.invalidFormat);
      return;
    }

    const referrer = getReferrerByUniversityId(formattedId);
    if (referrer) {
      setReferrerInfo(referrer);
      setReferenceId(formattedId); // Update with formatted version
    } else {
      setReferrerError(t.referrerNotFound);
    }
  };

  const handleContinue = async () => {
    // Validate required fields
    if (
      !formData.firstName ||
      !formData.lastName ||
      !formData.dateOfBirth ||
      !formData.gender ||
      !formData.presentAddress ||
      !formData.phone ||
      !formData.email ||
      !formData.fatherName ||
      !formData.motherName
    ) {
      toast({
        title: "Required Fields Missing",
        description: "Please fill in all required fields before continuing.",
        variant: "destructive",
      });
      return;
    }

    setIsSaving(true);

    try {
      // Update application data
      updateApplicationData({
        ...formData,
        photoUrl: uploadedPhotoUrl,
        phoneVerified: mobileVerified,
        emailVerified: emailVerified,
        referrerId: referenceId,
        referrerName: referrerInfo?.name,
      });

      const success = await saveCurrentStep("personal-information");

      if (success) {
        toast({
          title: t.saved,
          description: "Your personal information has been saved.",
        });
        navigate("/academic-history");
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

  const handleSaveAndExit = async () => {
    setIsSaving(true);

    try {
      updateApplicationData({
        ...formData,
        photoUrl: uploadedPhotoUrl,
        phoneVerified: mobileVerified,
        emailVerified: emailVerified,
        referrerId: referenceId,
        referrerName: referrerInfo?.name,
      });

      await saveCurrentStep("personal-information");

      toast({
        title: t.saved,
        description: "Your progress has been saved. You can continue later.",
      });

      navigate("/");
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

  return (
    <div>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <Link
            to="/program-selection"
            className="inline-flex items-center text-accent-purple hover:text-deep-plum mb-4"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            {t.backToPrevious}
          </Link>

          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold text-deep-plum font-poppins">
                {t.title}
              </h1>
              <p className="text-accent-purple font-medium">{t.subtitle}</p>
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

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Form Area */}
          <div className="lg:col-span-3 space-y-8">
            {/* Photo Upload Section */}
            <Card className="bg-white shadow-lg">
              <CardHeader>
                <CardTitle className="text-xl font-poppins text-deep-plum flex items-center gap-2">
                  <Camera className="w-5 h-5" />
                  {t.uploadPhoto} <span className="text-red-500">*</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ImageUpload
                  onImageUploaded={setUploadedPhotoUrl}
                  currentImage={uploadedPhotoUrl}
                  label={t.uploadPhoto}
                  required={true}
                  maxSize={5}
                  acceptedTypes={["image/jpeg", "image/jpg", "image/png"]}
                />
                {uploadedPhotoUrl && (
                  <div className="mt-4 p-3 bg-green-50 border border-green-200 rounded-lg">
                    <div className="flex items-center text-green-800">
                      <CheckCircle className="w-4 h-4 mr-2" />
                      <span className="text-sm font-medium">
                        Photo uploaded successfully!
                      </span>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Personal Details */}
            <Card className="bg-white shadow-lg">
              <CardHeader>
                <CardTitle className="text-xl font-poppins text-deep-plum">
                  {t.personalDetails}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="firstName">
                      {t.firstName} <span className="text-red-500">*</span>
                    </Label>
                    <Input
                      id="firstName"
                      placeholder="Enter first name"
                      value={formData.firstName}
                      onChange={(e) =>
                        handleInputChange("firstName", e.target.value)
                      }
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="lastName">
                      {t.lastName} <span className="text-red-500">*</span>
                    </Label>
                    <Input
                      id="lastName"
                      placeholder="Enter last name"
                      value={formData.lastName}
                      onChange={(e) =>
                        handleInputChange("lastName", e.target.value)
                      }
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="preferredName">{t.preferredName}</Label>
                    <Input
                      id="preferredName"
                      placeholder="Enter preferred name"
                      value={formData.preferredName}
                      onChange={(e) =>
                        handleInputChange("preferredName", e.target.value)
                      }
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="dob">
                      {t.dateOfBirth} <span className="text-red-500">*</span>
                    </Label>
                    <Input
                      id="dob"
                      type="date"
                      value={formData.dateOfBirth}
                      onChange={(e) =>
                        handleInputChange("dateOfBirth", e.target.value)
                      }
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="gender">
                      {t.gender} <span className="text-red-500">*</span>
                    </Label>
                    <Select
                      value={formData.gender}
                      onValueChange={(value) =>
                        handleInputChange("gender", value)
                      }
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select gender" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="male">{t.male}</SelectItem>
                        <SelectItem value="female">{t.female}</SelectItem>
                        <SelectItem value="other">{t.other}</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="religion">{t.religion}</Label>
                    <Input
                      id="religion"
                      placeholder="Enter religion"
                      value={formData.religion}
                      onChange={(e) =>
                        handleInputChange("religion", e.target.value)
                      }
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="bloodGroup">{t.bloodGroup}</Label>
                    <Select
                      value={formData.bloodGroup}
                      onValueChange={(value) =>
                        handleInputChange("bloodGroup", value)
                      }
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select blood group" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="a+">A+</SelectItem>
                        <SelectItem value="a-">A-</SelectItem>
                        <SelectItem value="b+">B+</SelectItem>
                        <SelectItem value="b-">B-</SelectItem>
                        <SelectItem value="ab+">AB+</SelectItem>
                        <SelectItem value="ab-">AB-</SelectItem>
                        <SelectItem value="o+">O+</SelectItem>
                        <SelectItem value="o-">O-</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="presentAddress">
                      {t.presentAddress} <span className="text-red-500">*</span>
                    </Label>
                    <Textarea
                      id="presentAddress"
                      placeholder="Enter present address"
                      value={formData.presentAddress}
                      onChange={(e) =>
                        handleInputChange("presentAddress", e.target.value)
                      }
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="permanentAddress">
                      {t.permanentAddress}{" "}
                      <span className="text-red-500">*</span>
                    </Label>
                    <Textarea
                      id="permanentAddress"
                      placeholder="Enter permanent address"
                      value={formData.permanentAddress}
                      onChange={(e) =>
                        handleInputChange("permanentAddress", e.target.value)
                      }
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="postcode">{t.postcode}</Label>
                    <Input
                      id="postcode"
                      placeholder="Enter postcode"
                      value={formData.postcode}
                      onChange={(e) =>
                        handleInputChange("postcode", e.target.value)
                      }
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="district">
                      {t.district} <span className="text-red-500">*</span>
                    </Label>
                    <Input
                      id="district"
                      placeholder="Enter district"
                      value={formData.district}
                      onChange={(e) =>
                        handleInputChange("district", e.target.value)
                      }
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="division">
                      {t.division} <span className="text-red-500">*</span>
                    </Label>
                    <Input
                      id="division"
                      placeholder="Enter division"
                      value={formData.division}
                      onChange={(e) =>
                        handleInputChange("division", e.target.value)
                      }
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="citizenship">
                      {t.citizenship} <span className="text-red-500">*</span>
                    </Label>
                    <Input
                      id="citizenship"
                      placeholder="Bangladeshi"
                      value={formData.citizenship}
                      onChange={(e) =>
                        handleInputChange("citizenship", e.target.value)
                      }
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="nationalId">
                      {t.nationalId} <span className="text-red-500">*</span>
                    </Label>
                    <Input
                      id="nationalId"
                      placeholder="Enter ID number"
                      value={formData.nationalId}
                      onChange={(e) =>
                        handleInputChange("nationalId", e.target.value)
                      }
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Contact Information */}
            <Card className="bg-white shadow-lg">
              <CardHeader>
                <CardTitle className="text-xl font-poppins text-deep-plum">
                  {t.contactInfo}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="mobile">
                      {t.mobileNumber} <span className="text-red-500">*</span>
                    </Label>
                    <div className="flex gap-2">
                      <Input
                        id="mobile"
                        placeholder="+880 1XX XXX XXXX"
                        className="flex-1"
                        value={formData.phone}
                        onChange={(e) =>
                          handleInputChange("phone", e.target.value)
                        }
                      />
                      <Button
                        variant={mobileVerified ? "default" : "outline"}
                        className={
                          mobileVerified
                            ? "bg-green-600 hover:bg-green-700"
                            : "border-accent-purple text-accent-purple hover:bg-accent-purple hover:text-white"
                        }
                        onClick={() => setMobileVerified(!mobileVerified)}
                      >
                        {mobileVerified ? (
                          <>
                            <CheckCircle className="w-4 h-4 mr-2" />
                            {t.verified}
                          </>
                        ) : (
                          <>
                            <Phone className="w-4 h-4 mr-2" />
                            {t.verify}
                          </>
                        )}
                      </Button>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">
                      {t.email} <span className="text-red-500">*</span>
                    </Label>
                    <div className="flex gap-2">
                      <Input
                        id="email"
                        type="email"
                        placeholder="example@email.com"
                        className="flex-1"
                        value={formData.email}
                        onChange={(e) =>
                          handleInputChange("email", e.target.value)
                        }
                      />
                      <Button
                        variant={emailVerified ? "default" : "outline"}
                        className={
                          emailVerified
                            ? "bg-green-600 hover:bg-green-700"
                            : "border-accent-purple text-accent-purple hover:bg-accent-purple hover:text-white"
                        }
                        onClick={() => setEmailVerified(!emailVerified)}
                      >
                        {emailVerified ? (
                          <>
                            <CheckCircle className="w-4 h-4 mr-2" />
                            {t.verified}
                          </>
                        ) : (
                          <>
                            <Mail className="w-4 h-4 mr-2" />
                            {t.verify}
                          </>
                        )}
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Referral Information */}
            <Card className="bg-white shadow-lg">
              <CardHeader>
                <CardTitle className="text-xl font-poppins text-deep-plum flex items-center gap-2">
                  <Users className="w-5 h-5" />
                  {t.referralInfo}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="p-4 bg-blue-50 rounded-lg">
                  <p className="text-sm text-blue-800">{t.referralNote}</p>
                </div>

                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="referenceId">{t.referenceId}</Label>
                    <div className="flex gap-2">
                      <Input
                        id="referenceId"
                        value={referenceId}
                        onChange={(e) => setReferenceId(e.target.value)}
                        placeholder={t.referenceIdPlaceholder}
                        className="flex-1"
                        onKeyPress={(e) =>
                          e.key === "Enter" && handleReferrerLookup()
                        }
                      />
                      <Button
                        type="button"
                        variant="outline"
                        onClick={handleReferrerLookup}
                        className="border-accent-purple text-accent-purple hover:bg-accent-purple hover:text-white"
                      >
                        <Search className="w-4 h-4 mr-2" />
                        {t.lookupReferrer}
                      </Button>
                    </div>
                  </div>

                  {/* Referrer Information Display */}
                  {referrerInfo && (
                    <Alert className="border-green-200 bg-green-50">
                      <CheckCircle className="w-4 h-4 text-green-600" />
                      <AlertDescription>
                        <div className="text-green-800">
                          <strong>{t.referrerFound}</strong>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-3 text-sm">
                            <div>
                              <span className="font-medium">
                                {t.referrerName}:
                              </span>{" "}
                              {language === "en"
                                ? referrerInfo.name
                                : referrerInfo.namebn}
                            </div>
                            <div>
                              <span className="font-medium">
                                {t.referrerDesignation}:
                              </span>{" "}
                              {language === "en"
                                ? referrerInfo.designation
                                : referrerInfo.designationbn}
                            </div>
                            <div>
                              <span className="font-medium">
                                {t.referrerDept}:
                              </span>{" "}
                              {language === "en"
                                ? referrerInfo.department
                                : referrerInfo.departmentbn}
                            </div>
                            <div>
                              <span className="font-medium">
                                {t.referrerContact}:
                              </span>{" "}
                              {referrerInfo.email}
                            </div>
                          </div>
                        </div>
                      </AlertDescription>
                    </Alert>
                  )}

                  {/* Error Display */}
                  {referrerError && (
                    <Alert className="border-red-200 bg-red-50">
                      <AlertCircle className="w-4 h-4 text-red-600" />
                      <AlertDescription className="text-red-800">
                        {referrerError}
                      </AlertDescription>
                    </Alert>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Family Information */}
            <Card className="bg-white shadow-lg">
              <CardHeader>
                <CardTitle className="text-xl font-poppins text-deep-plum">
                  {t.familyInfo}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="fatherName">
                      {t.fatherName} <span className="text-red-500">*</span>
                    </Label>
                    <Input
                      id="fatherName"
                      placeholder="Enter father's name"
                      value={formData.fatherName}
                      onChange={(e) =>
                        handleInputChange("fatherName", e.target.value)
                      }
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="fatherOccupation">
                      {t.fatherOccupation}
                    </Label>
                    <Input
                      id="fatherOccupation"
                      placeholder="Enter father's occupation"
                      value={formData.fatherOccupation}
                      onChange={(e) =>
                        handleInputChange("fatherOccupation", e.target.value)
                      }
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="fatherMobile">{t.fatherMobile}</Label>
                    <Input
                      id="fatherMobile"
                      placeholder="Enter father's mobile"
                      value={formData.fatherMobile}
                      onChange={(e) =>
                        handleInputChange("fatherMobile", e.target.value)
                      }
                    />
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="motherName">
                      {t.motherName} <span className="text-red-500">*</span>
                    </Label>
                    <Input
                      id="motherName"
                      placeholder="Enter mother's name"
                      value={formData.motherName}
                      onChange={(e) =>
                        handleInputChange("motherName", e.target.value)
                      }
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="motherOccupation">
                      {t.motherOccupation}
                    </Label>
                    <Input
                      id="motherOccupation"
                      placeholder="Enter mother's occupation"
                      value={formData.motherOccupation}
                      onChange={(e) =>
                        handleInputChange("motherOccupation", e.target.value)
                      }
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="motherMobile">{t.motherMobile}</Label>
                    <Input
                      id="motherMobile"
                      placeholder="Enter mother's mobile"
                      value={formData.motherMobile}
                      onChange={(e) =>
                        handleInputChange("motherMobile", e.target.value)
                      }
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Guardian Information */}
            <Card className="bg-white shadow-lg">
              <CardHeader>
                <CardTitle className="text-xl font-poppins text-deep-plum">
                  {t.guardianInfo}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="guardianName">{t.guardianName}</Label>
                    <Input
                      id="guardianName"
                      placeholder="Enter guardian's name"
                      value={formData.guardianName}
                      onChange={(e) =>
                        handleInputChange("guardianName", e.target.value)
                      }
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="guardianContact">{t.guardianContact}</Label>
                    <Input
                      id="guardianContact"
                      placeholder="Enter guardian's contact"
                      value={formData.guardianPhone}
                      onChange={(e) =>
                        handleInputChange("guardianPhone", e.target.value)
                      }
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-end">
              <Button
                variant="outline"
                className="border-accent-purple text-accent-purple hover:bg-accent-purple hover:text-white"
                onClick={handleSaveAndExit}
                disabled={isSaving}
              >
                <LogOut className="w-4 h-4 mr-2" />
                {isSaving ? t.saving : t.saveAndExit}
              </Button>
              <Button
                className="bg-deep-plum hover:bg-accent-purple"
                onClick={handleContinue}
                disabled={isSaving}
              >
                <Save className="w-4 h-4 mr-2" />
                {isSaving ? t.saving : t.saveAndContinue}
              </Button>
            </div>
          </div>

          {/* Right Sidebar */}
          <div className="space-y-6">
            {/* Document Checklist */}
            <Card className="bg-white shadow-lg">
              <CardHeader>
                <CardTitle className="text-lg font-poppins text-deep-plum">
                  {t.documents}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {documentChecklist.map((doc) => (
                  <div
                    key={doc.id}
                    className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                  >
                    <span className="text-sm font-medium">{doc.label}</span>
                    {doc.completed ? (
                      <Badge className="bg-green-100 text-green-800">
                        <CheckCircle className="w-3 h-3 mr-1" />
                        Done
                      </Badge>
                    ) : (
                      <Badge
                        variant="outline"
                        className="text-red-600 border-red-200"
                      >
                        {t.required}
                      </Badge>
                    )}
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Referral Status */}
            {referrerInfo && (
              <Card className="bg-gradient-to-r from-green-50 to-green-100 border-green-200">
                <CardHeader>
                  <CardTitle className="text-lg font-poppins text-green-800">
                    ✅ Referral Confirmed
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-sm space-y-1">
                    <p>
                      <strong>Referred by:</strong>
                    </p>
                    <p className="text-green-700">
                      {language === "en"
                        ? referrerInfo.name
                        : referrerInfo.namebn}
                    </p>
                    <p className="text-green-600">
                      {referrerInfo.universityId}
                    </p>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Fee Breakdown */}
            <Card className="bg-white shadow-lg">
              <CardHeader className="bg-deep-plum text-white">
                <CardTitle className="font-poppins">{t.feeBreakdown}</CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-gray-600">{t.admissionFee}</span>
                    <span className="font-semibold">
                      ৳
                      {applicationData.totalCost &&
                      applicationData.totalCost > 0
                        ? Math.round(
                            applicationData.totalCost * 0.15,
                          ).toLocaleString()
                        : "15,000"}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">{t.courseFee}</span>
                    <span className="font-semibold">
                      ৳
                      {applicationData.totalCost &&
                      applicationData.totalCost > 0
                        ? Math.round(
                            applicationData.totalCost * 0.65,
                          ).toLocaleString()
                        : "45,000"}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">{t.labFee}</span>
                    <span className="font-semibold">
                      ৳
                      {applicationData.totalCost &&
                      applicationData.totalCost > 0
                        ? Math.round(
                            applicationData.totalCost * 0.12,
                          ).toLocaleString()
                        : "8,000"}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">{t.others}</span>
                    <span className="font-semibold">
                      ৳
                      {applicationData.totalCost &&
                      applicationData.totalCost > 0
                        ? Math.round(
                            applicationData.totalCost * 0.08,
                          ).toLocaleString()
                        : "5,000"}
                    </span>
                  </div>
                  <div className="border-t pt-3 flex justify-between text-lg font-bold">
                    <span className="text-deep-plum">{t.total}</span>
                    <span className="text-accent-purple">
                      ৳
                      {(
                        applicationData.finalAmount ||
                        applicationData.totalCost ||
                        73000
                      ).toLocaleString()}
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
