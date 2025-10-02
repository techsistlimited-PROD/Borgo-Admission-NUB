import React, { useEffect, useState } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";
import {
  ArrowLeft,
  User,
  Phone,
  Mail,
  MapPin,
  GraduationCap,
  FileText,
  CreditCard,
  Lock,
  Unlock,
  CheckCircle,
  XCircle,
  Clock,
  Download,
  MessageSquare,
  Shield,
  AlertCircle,
  Paperclip,
} from "lucide-react";
import { Button } from "../components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../components/ui/card";
import { Badge } from "../components/ui/badge";
import { Textarea } from "../components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../components/ui/dialog";
import { Label } from "../components/ui/label";
import { Input } from "../components/ui/input";
import { Alert, AlertDescription } from "../components/ui/alert";
import { Separator } from "../components/ui/separator";
import {
  Tabs,
  TabsList,
  TabsTrigger,
  TabsContent,
} from "../components/ui/tabs";
import { useToast } from "../hooks/use-toast";
import apiClient from "../lib/api";

export default function ApplicantDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [language, setLanguage] = useState<"en" | "bn">("en");
  const [isLocked, setIsLocked] = useState(false);
  const [loading, setLoading] = useState(true);
  const [application, setApplication] = useState<any | null>(null);
  const [studentIDs, setStudentIDs] = useState<any | null>(null);
  const [isGeneratingIDs, setIsGeneratingIDs] = useState(false);
  const [sendingSMS, setSendingSMS] = useState(false);
  const [sendingEmail, setSendingEmail] = useState(false);
  const [approvalNote, setApprovalNote] = useState("");
  const [rejectionReason, setRejectionReason] = useState("");
  const [mrNumber, setMrNumber] = useState<string | null>(null);
  const [mrUrl, setMrUrl] = useState<string | null>(null);

  const texts = {
    en: {
      title: "Applicant Details",
      backToList: "Back to Admission List",
      admissionStatus: "Admission Status",
      paymentStatus: "Payment Status",
      personalInfo: "Personal Information",
      contactInfo: "Contact Information",
      academicHistory: "Academic History",
      documentsUploaded: "Documents Uploaded",
      waiverInfo: "Fees & Waiver",
      invoicePreview: "Invoice Preview",
      actions: "Actions",
      approve: "Approve Application",
      hold: "Put on Hold",
      reject: "Reject Application",
      lock: "Lock Application",
      unlock: "Unlock Application",
      createId: "Create Student ID",
      sendEmail: "Send Email",
      sendSMS: "Send SMS",
      downloadInvoice: "Download Invoice",
      underReview: "Under Review",
      approved: "Approved",
      rejected: "Rejected",
      onHold: "On Hold",
      pending: "Pending",
      verified: "Verified",
      failed: "Failed",
      name: "Name",
      email: "Email",
      phone: "Phone",
      dateOfBirth: "Date of Birth",
      gender: "Gender",
      address: "Address",
      nationality: "Nationality",
      trackingId: "Tracking ID",
      applicationDate: "Application Date",
      program: "Program",
      department: "Department",
      semester: "Semester",
      sscResults: "SSC Results",
      hscResults: "HSC Results",
      sscCertificate: "SSC Certificate",
      hscCertificate: "HSC Certificate",
      nidCopy: "NID Copy",
      photograph: "Photograph",
      otherDocs: "Other Documents",
      uploaded: "Uploaded",
      notUploaded: "Not Uploaded",
      waiverType: "Waiver Type",
      waiverPercentage: "Waiver Percentage",
      originalAmount: "Original Amount",
      waiverAmount: "Waiver Amount",
      finalAmount: "Final Amount",
      admissionFee: "Admission Fee",
      courseFee: "Course Fee",
      labFee: "Lab Fee",
      others: "Others",
      total: "Total",
      approvalNote: "Approval Note",
      rejectionReason: "Rejection Reason",
      studentId: "Student ID",
      applicantId: "Applicant ID",
      password: "Password",
      confirmApproval: "Confirm Approval",
      confirmRejection: "Confirm Rejection",
      studentIDs: "Student IDs",
      universityId: "University ID",
      ugcId: "UGC ID",
      generateIDs: "Generate Student IDs",
      sendSMSId: "Send ID via SMS",
      sendEmailId: "Send ID via Email",
      idsGenerated: "Student IDs Generated Successfully",
      smsSent: "SMS sent successfully",
      emailSent: "Email sent successfully",
      batch: "Batch",
      generatedOn: "Generated On",
      idStatus: "ID Status",
      active: "Active",
      inactive: "Inactive",
      ugcNote:
        "UGC ID is used for certificate authorization and is visible only to admin staff.",
      changeLog: "Change Log",
    },
    bn: {
      title: "আবেদনকারীর বিবরণ",
      backToList: "ভর্তি তালিকায় ফিরুন",
      personalInfo: "ব্যক্তিগত তথ্য",
      contactInfo: "যোগাযোগের তথ্য",
      academicHistory: "শিক্ষাগত ইতিহাস",
      documentsUploaded: "আপলোডকৃত কাগজপত্র",
      waiverInfo: "মওকুফ তথ্য",
      actions: "কর্ম",
      approve: "আবেদন অনুমোদন",
      reject: "আবেদন প্রত্যাখ্যান",
      generateIDs: "ছাত্র আইডি তৈরি করুন",
      changeLog: "পরিবর্তন লগ",
    },
  };

  const t: any = texts[language];

  const loadApplication = async () => {
    if (!id) return;
    setLoading(true);
    try {
      const res = await apiClient.getApplication(id);
      if (res.success && res.data) {
        setApplication(res.data.application || res.data);
        if (res.data.application?.id_generation) {
          setStudentIDs(res.data.application.id_generation);
        } else if (res.data.id_generation) {
          setStudentIDs(res.data.id_generation);
        }
      } else {
        // fallback: try to set application from res.data
        if (res.success && res.data) setApplication(res.data);
      }
    } catch (error) {
      console.error("Failed to load application", error);
      toast({ title: "Error", description: "Failed to load application" });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadApplication();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  const getStatusBadge = (status: string, type: "admission" | "payment") => {
    const statusConfigs = {
      admission: {
        pending: {
          color: "bg-yellow-100 text-yellow-800",
          label: "Pending",
          icon: Clock,
        },
        approved: {
          color: "bg-green-100 text-green-800",
          label: "Approved",
          icon: CheckCircle,
        },
        rejected: {
          color: "bg-red-100 text-red-800",
          label: "Rejected",
          icon: XCircle,
        },
        on_hold: {
          color: "bg-gray-100 text-gray-800",
          label: "On Hold",
          icon: Clock,
        },
      },
      payment: {
        pending: {
          color: "bg-yellow-100 text-yellow-800",
          label: "Pending",
          icon: Clock,
        },
        verified: {
          color: "bg-green-100 text-green-800",
          label: "Verified",
          icon: CheckCircle,
        },
        failed: {
          color: "bg-red-100 text-red-800",
          label: "Failed",
          icon: XCircle,
        },
      },
    } as const;

    const cfg = (statusConfigs as any)[type][status] as any;
    if (!cfg)
      return <Badge className="bg-gray-100 text-gray-800">{status}</Badge>;
    const Icon = cfg.icon;
    return (
      <Badge className={cfg.color}>
        <Icon className="w-3 h-3 mr-1" /> {cfg.label}
      </Badge>
    );
  };

  const handleApprove = async () => {
    if (!application) return;
    try {
      // Update status on server
      const res = await apiClient.updateApplicationStatus(
        application.id,
        "approved",
      );
      if (res.success) {
        toast({ title: "Approved", description: "Application approved" });
        // Generate IDs
        setIsGeneratingIDs(true);
        const gid = await apiClient.generateApplicationIds(application.id);
        let generatedIds: any = null;
        if (gid.success && gid.data) {
          generatedIds = {
            university_id: gid.data.university_id,
            ugc_id: gid.data.ugc_id || undefined,
            batch:
              gid.data.batch ||
              `${application.semester} ${new Date().getFullYear()}`,
          };
          setStudentIDs({
            universityId: generatedIds.university_id,
            ugcId: generatedIds.ugc_id,
            batch: generatedIds.batch,
            generatedDate: gid.data.generated_date || new Date().toISOString(),
            universityEmail: gid.data.generated_email || undefined,
          });

          if (gid.data.generated_email) {
            toast({
              title: "Welcome email (mock) sent",
              description: gid.data.generated_email,
            });
          }
        }

        // Create student record (mock)
        if (generatedIds) {
          const studentRes = await apiClient.createStudentRecord(
            application.id,
            generatedIds,
          );
          if (studentRes.success && studentRes.data?.student) {
            toast({
              title: "Student created",
              description: `Student record created: ${studentRes.data.student.student_id}`,
            });
          }
        }

        // Generate money receipt (MR)
        const amount = application.final_amount || application.total_cost || 0;
        const mrRes = await apiClient.generateMoneyReceipt(
          application.id,
          amount,
        );
        if (mrRes.success && mrRes.data) {
          setMrNumber(mrRes.data.mr_number);
          if (mrRes.data.receipt_url) setMrUrl(mrRes.data.receipt_url);
          toast({
            title: "MR generated",
            description: `MR No: ${mrRes.data.mr_number}`,
          });
        }

        // refresh application
        await loadApplication();
      } else {
        toast({
          title: "Error",
          description: res.error || "Failed to approve",
          variant: "destructive",
        });
      }
    } catch (err) {
      console.error(err);
      toast({
        title: "Error",
        description: "Failed to approve",
        variant: "destructive",
      });
    } finally {
      setIsGeneratingIDs(false);
    }
  };

  const handleReject = async () => {
    if (!application) return;
    try {
      const res = await apiClient.updateApplicationStatus(
        application.id,
        "rejected",
      );
      if (res.success) {
        toast({ title: "Rejected", description: "Application rejected" });
        await loadApplication();
      } else {
        toast({
          title: "Error",
          description: res.error || "Failed to reject",
          variant: "destructive",
        });
      }
    } catch (err) {
      console.error(err);
      toast({
        title: "Error",
        description: "Failed to reject",
        variant: "destructive",
      });
    }
  };

  const handleGenerateIDs = async () => {
    if (!application) return;
    setIsGeneratingIDs(true);
    try {
      const gid = await apiClient.generateApplicationIds(application.id);
      if (gid.success && gid.data) {
        setStudentIDs({
          universityId: gid.data.university_id,
          ugcId: gid.data.ugc_id || gid.data.ugc_id,
          batch:
            gid.data.batch ||
            `${application.semester} ${new Date().getFullYear()}`,
          generatedDate: gid.data.generated_date || new Date().toISOString(),
          universityEmail: gid.data.generated_email || undefined,
        });
        if (gid.data.generated_email) {
          toast({
            title: "Welcome email (mock) sent",
            description: gid.data.generated_email,
          });
        } else {
          toast({ title: t.idsGenerated });
        }
      } else {
        toast({
          title: "Error",
          description: gid.error || "Failed to generate IDs",
          variant: "destructive",
        });
      }
    } catch (err) {
      console.error(err);
      toast({
        title: "Error",
        description: "Failed to generate IDs",
        variant: "destructive",
      });
    } finally {
      setIsGeneratingIDs(false);
    }
  };

  const handleSendSMS = async () => {
    if (!application || !studentIDs) return;
    setSendingSMS(true);
    try {
      // Mock sending SMS
      await new Promise((r) => setTimeout(r, 800));
      toast({ title: t.smsSent });
    } catch (err) {
      console.error(err);
      toast({
        title: "Error",
        description: "Failed to send SMS",
        variant: "destructive",
      });
    } finally {
      setSendingSMS(false);
    }
  };

  const handleSendEmail = async () => {
    if (!application || !studentIDs) return;
    setSendingEmail(true);
    try {
      // Mock sending Email
      await new Promise((r) => setTimeout(r, 800));
      toast({ title: t.emailSent });
    } catch (err) {
      console.error(err);
      toast({
        title: "Error",
        description: "Failed to send Email",
        variant: "destructive",
      });
    } finally {
      setSendingEmail(false);
    }
  };

  const [isDownloadingReceipt, setIsDownloadingReceipt] = useState(false);
  const handleDownloadReceipt = async () => {
    if (!application) return;
    setIsDownloadingReceipt(true);
    try {
      const res = await apiClient.generateMoneyReceiptPdf(application.id);
      if (res.success && res.data?.isFile && res.data.blob) {
        const url = URL.createObjectURL(res.data.blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = res.data.filename || `money_receipt_${application.id}.pdf`;
        document.body.appendChild(a);
        a.click();
        a.remove();
        URL.revokeObjectURL(url);
      } else {
        toast({
          title: "No receipt",
          description: res.error || "Failed to generate receipt",
        });
      }
    } catch (e) {
      console.error("Download MR failed", e);
      toast({
        title: "Error",
        description: "Failed to download receipt",
        variant: "destructive",
      });
    } finally {
      setIsDownloadingReceipt(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <Clock className="w-8 h-8 animate-spin mx-auto mb-4 text-deep-plum" />
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  const personal =
    application?.personal_info || application?.personalInfo || {};
  const academic = application?.academic_history || application?.academic || {};
  const documents = application?.documents || application?.documents || {};
  const waiver = application?.waiver || application?.waiver || null;

  return (
    <div>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-6">
          <Link
            to="/admin/admissions"
            className="inline-flex items-center text-accent-purple hover:text-deep-plum mb-4"
          >
            <ArrowLeft className="w-4 h-4 mr-2" /> {t.backToList}
          </Link>

          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold text-deep-plum font-poppins">
                {t.title} - {application?.tracking_id || application?.id}
              </h1>
              <p className="text-gray-600 mt-1">
                {personal.name || application?.applicant_name}
              </p>
            </div>

            <div className="flex items-center gap-4">
              <div className="flex items-center bg-white rounded-lg p-1 shadow-sm">
                <button
                  onClick={() => setLanguage("en")}
                  className={`px-3 py-1 text-sm font-medium rounded-md transition-colors ${language === "en" ? "bg-deep-plum text-white" : "text-gray-600 hover:text-deep-plum"}`}
                >
                  EN
                </button>
                <button
                  onClick={() => setLanguage("bn")}
                  className={`px-3 py-1 text-sm font-medium rounded-md transition-colors ${language === "bn" ? "bg-deep-plum text-white" : "text-gray-600 hover:text-deep-plum"}`}
                >
                  BN
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Top Status cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <Card
            className={`shadow-lg ${application?.status === "approved" ? "bg-green-50 border-green-200" : application?.status === "rejected" ? "bg-red-50 border-red-200" : "bg-yellow-50 border-yellow-200"}`}
          >
            <CardHeader>
              <CardTitle className="text-lg font-poppins text-deep-plum">
                {t.admissionStatus}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                {getStatusBadge(application?.status || "pending", "admission")}
                <div className="flex items-center gap-2">
                  {isLocked ? (
                    <Lock className="w-4 h-4 text-gray-400" />
                  ) : (
                    <Unlock className="w-4 h-4 text-gray-400" />
                  )}
                  <span className="text-sm text-gray-600">
                    {isLocked ? "Locked" : "Unlocked"}
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card
            className={`shadow-lg ${application?.payment_status === "verified" ? "bg-green-50 border-green-200" : application?.payment_status === "failed" ? "bg-red-50 border-red-200" : "bg-yellow-50 border-yellow-200"}`}
          >
            <CardHeader>
              <CardTitle className="text-lg font-poppins text-deep-plum">
                {t.paymentStatus}
              </CardTitle>
            </CardHeader>
            <CardContent>
              {getStatusBadge(
                application?.payment_status || "pending",
                "payment",
              )}
            </CardContent>
          </Card>
        </div>

        {/* IDs and Actions */}
        {(application?.status === "approved" || studentIDs) && (
          <Card className="bg-gradient-to-r from-blue-50 to-blue-100 border-blue-200 mb-8">
            <CardHeader>
              <CardTitle className="text-xl font-poppins text-blue-800 flex items-center gap-2">
                <Shield className="w-5 h-5" /> {t.studentIDs}
              </CardTitle>
            </CardHeader>
            <CardContent>
              {studentIDs ? (
                <div className="space-y-4">
                  <div className="bg-white p-4 rounded-lg">
                    <div className="flex justify-between items-center mb-2">
                      <Label className="font-semibold text-blue-800">
                        {t.universityId}
                      </Label>
                      <Badge className="bg-green-600 text-white">
                        {t.active}
                      </Badge>
                    </div>
                    <div className="text-2xl font-bold text-blue-900 font-mono tracking-wider">
                      {studentIDs.universityId}
                    </div>
                    {studentIDs.universityEmail && (
                      <div className="text-sm text-gray-700 mt-1">
                        Email:{" "}
                        <span className="font-mono text-blue-700">
                          {studentIDs.universityEmail}
                        </span>
                      </div>
                    )}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-3 text-sm text-gray-600">
                      <div>
                        <strong>{t.batch}:</strong> {studentIDs.batch}
                      </div>
                      <div>
                        <strong>{t.generatedOn}:</strong>{" "}
                        {new Date(
                          studentIDs.generatedDate,
                        ).toLocaleDateString()}
                      </div>
                    </div>
                  </div>

                  <Separator />

                  <div className="bg-purple-50 p-4 rounded-lg border border-purple-200">
                    <div className="flex justify-between items-center mb-2">
                      <Label className="font-semibold text-purple-800">
                        {t.ugcId} (Admin Only)
                      </Label>
                      <Badge className="bg-purple-600 text-white">
                        Confidential
                      </Badge>
                    </div>
                    <div className="text-xl font-bold text-purple-900 font-mono tracking-wider">
                      {studentIDs.ugcId}
                    </div>
                    <Alert className="mt-3 border-purple-200 bg-purple-50">
                      <AlertCircle className="w-4 h-4 text-purple-600" />
                      <AlertDescription className="text-purple-800 text-xs">
                        {t.ugcNote}
                      </AlertDescription>
                    </Alert>
                  </div>

                  <div className="flex flex-col sm:flex-row gap-3">
                    <Button
                      onClick={handleSendSMS}
                      disabled={sendingSMS}
                      className="bg-green-600 hover:bg-green-700"
                    >
                      <Phone className="w-4 h-4 mr-2" />
                      {sendingSMS ? "Sending..." : t.sendSMSId}
                    </Button>
                    <Button
                      onClick={handleSendEmail}
                      disabled={sendingEmail}
                      variant="outline"
                      className="border-blue-600 text-blue-600 hover:bg-blue-600 hover:text-white"
                    >
                      <Mail className="w-4 h-4 mr-2" />
                      {sendingEmail ? "Sending..." : t.sendEmailId}
                    </Button>
                    {mrNumber && (
                      <Button
                        variant="outline"
                        className="ml-auto"
                        onClick={handleDownloadReceipt}
                        disabled={isDownloadingReceipt}
                      >
                        {isDownloadingReceipt ? (
                          <>
                            <Clock className="w-4 h-4 mr-2 animate-spin" />
                            Downloading...
                          </>
                        ) : (
                          <>
                            <Download className="w-4 h-4 mr-2" />
                            Download MR
                          </>
                        )}
                      </Button>
                    )}
                  </div>
                </div>
              ) : (
                <div className="text-center py-6">
                  <div className="text-gray-600 mb-4">
                    Applicant IDs not generated yet. Generate IDs after
                    approval.
                  </div>
                  <Button
                    onClick={handleGenerateIDs}
                    disabled={isGeneratingIDs}
                    className="bg-blue-600 hover:bg-blue-700"
                  >
                    {isGeneratingIDs ? (
                      <>
                        <Clock className="w-4 h-4 mr-2 animate-spin" />
                        Generating...
                      </>
                    ) : (
                      <>
                        <Shield className="w-4 h-4 mr-2" />
                        {t.generateIDs}
                      </>
                    )}
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        )}

        {/* Tabs */}
        <Tabs defaultValue="personal" className="space-y-6">
          <TabsList className="grid w-full grid-cols-6">
            <TabsTrigger value="personal" className="flex items-center gap-2">
              <User className="w-4 h-4" />
              {t.personalInfo}
            </TabsTrigger>
            <TabsTrigger value="academic" className="flex items-center gap-2">
              <GraduationCap className="w-4 h-4" />
              {t.academicHistory}
            </TabsTrigger>
            <TabsTrigger value="documents" className="flex items-center gap-2">
              <FileText className="w-4 h-4" />
              {t.documentsUploaded}
            </TabsTrigger>
            <TabsTrigger value="fees" className="flex items-center gap-2">
              <CreditCard className="w-4 h-4" />
              {t.waiverInfo}
            </TabsTrigger>
            <TabsTrigger value="test" className="flex items-center gap-2">
              <Clock className="w-4 h-4" />
              Admission Test
            </TabsTrigger>
            <TabsTrigger value="log" className="flex items-center gap-2">
              <HistoryIcon />
            </TabsTrigger>
          </TabsList>

          <TabsContent value="personal">
            <Card className="bg-white shadow-lg">
              <CardHeader>
                <CardTitle className="text-xl font-poppins text-deep-plum flex items-center gap-2">
                  <User className="w-5 h-5" />
                  {t.personalInfo}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label className="text-sm font-medium text-gray-600">
                      {t.name}
                    </Label>
                    <p className="text-gray-900">
                      {personal.name || application?.applicant_name}
                    </p>
                  </div>
                  <div>
                    <Label className="text-sm font-medium text-gray-600">
                      {t.dateOfBirth}
                    </Label>
                    <p className="text-gray-900">
                      {personal.date_of_birth || personal.dateOfBirth || "-"}
                    </p>
                  </div>
                  <div>
                    <Label className="text-sm font-medium text-gray-600">
                      {t.gender}
                    </Label>
                    <p className="text-gray-900">{personal.gender || "-"}</p>
                  </div>
                  <div>
                    <Label className="text-sm font-medium text-gray-600">
                      {t.nationality}
                    </Label>
                    <p className="text-gray-900">
                      {personal.nationality || "-"}
                    </p>
                  </div>
                  <div className="md:col-span-2">
                    <Label className="text-sm font-medium text-gray-600">
                      {t.address}
                    </Label>
                    <p className="text-gray-900">
                      {(personal.address && JSON.stringify(personal.address)) ||
                        personal.address ||
                        "-"}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-white shadow-lg mt-6">
              <CardHeader>
                <CardTitle className="text-xl font-poppins text-deep-plum flex items-center gap-2">
                  <Phone className="w-5 h-5" />
                  {t.contactInfo}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="flex items-center gap-2">
                    <Mail className="w-4 h-4 text-gray-400" />
                    <div>
                      <Label className="text-sm font-medium text-gray-600">
                        {t.email}
                      </Label>
                      <p className="text-gray-900">
                        {personal.email || application?.email || "-"}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Phone className="w-4 h-4 text-gray-400" />
                    <div>
                      <Label className="text-sm font-medium text-gray-600">
                        {t.phone}
                      </Label>
                      <p className="text-gray-900">
                        {personal.phone || application?.phone || "-"}
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="academic">
            <Card className="bg-white shadow-lg">
              <CardHeader>
                <CardTitle className="text-xl font-poppins text-deep-plum flex items-center gap-2">
                  <GraduationCap className="w-5 h-5" />
                  {t.academicHistory}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {Array.isArray(academic) && academic.length > 0 ? (
                    academic.map((rec: any, idx: number) => (
                      <div key={idx} className="p-3 bg-gray-50 rounded-lg">
                        <div className="flex justify-between">
                          <div>
                            <div className="font-medium">
                              {rec.exam_name || rec.level}
                            </div>
                            <div className="text-sm text-gray-600">
                              {rec.institute} • {rec.passing_year}
                            </div>
                          </div>
                          <div className="text-sm text-gray-700">
                            GPA: {rec.grade_point}
                          </div>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="text-sm text-gray-600">
                      No academic records
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="documents">
            <Card className="bg-white shadow-lg">
              <CardHeader>
                <CardTitle className="text-xl font-poppins text-deep-plum flex items-center gap-2">
                  <FileText className="w-5 h-5" />
                  {t.documentsUploaded}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {Object.entries(documents).length ? (
                    Object.entries(documents).map(([k, v]: any) => (
                      <div
                        key={k}
                        className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                      >
                        <div className="flex items-center gap-3">
                          <Paperclip className="w-4 h-4 text-gray-500" />
                          <div>
                            <div className="font-medium">{k}</div>
                            <div className="text-xs text-gray-500">
                              {v?.file_name || (v === true ? "Uploaded" : "-")}
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <Badge
                            className={
                              v
                                ? "bg-green-100 text-green-800"
                                : "bg-red-100 text-red-800"
                            }
                          >
                            {v ? t.uploaded : t.notUploaded}
                          </Badge>
                          {v && typeof v === "object" && v.file_url && (
                            <a
                              href={v.file_url}
                              target="_blank"
                              rel="noreferrer"
                              className="text-sm text-deep-plum"
                            >
                              Preview
                            </a>
                          )}
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="text-sm text-gray-600">
                      No documents uploaded
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="fees">
            <Card className="bg-white shadow-lg">
              <CardHeader>
                <CardTitle className="text-xl font-poppins text-deep-plum flex items-center gap-2">
                  <CreditCard className="w-5 h-5" />
                  {t.waiverInfo}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <Label className="text-sm font-medium text-gray-600">
                        {t.originalAmount}
                      </Label>
                      <p className="text-gray-900">
                        BDT {(waiver?.originalAmount || 0).toLocaleString()}
                      </p>
                    </div>
                    <div>
                      <Label className="text-sm font-medium text-gray-600">
                        {t.waiverAmount}
                      </Label>
                      <p className="text-green-600 font-semibold">
                        -BDT {(waiver?.waiverAmount || 0).toLocaleString()}
                      </p>
                    </div>
                    <div>
                      <Label className="text-sm font-medium text-gray-600">
                        {t.finalAmount}
                      </Label>
                      <p className="text-xl font-bold text-accent-purple">
                        BDT {(waiver?.finalAmount || 0).toLocaleString()}
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="test">
            <Card className="bg-white shadow-lg">
              <CardHeader>
                <CardTitle className="text-xl font-poppins text-deep-plum flex items-center gap-2">
                  <Clock className="w-5 h-5" />
                  Admission Test
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="text-sm text-gray-600">
                        Fee Payment Status
                      </div>
                      <div className="font-medium">
                        {application?.payment_status || "pending"}
                      </div>
                    </div>
                    <div>
                      <Button variant="outline">Admit Card (PDF)</Button>
                    </div>
                  </div>

                  <div>
                    <Label className="text-sm font-medium text-gray-600">
                      Result
                    </Label>
                    <div className="mt-2">
                      {application?.admission_test_status || "Not Available"}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="log">
            <Card className="bg-white shadow-lg">
              <CardHeader>
                <CardTitle className="text-xl font-poppins text-deep-plum flex items-center gap-2">
                  {t.changeLog}
                </CardTitle>
              </CardHeader>
              <CardContent>
                {/* Mock change log for now — server audit will be integrated later */}
                <div className="space-y-3 text-sm">
                  <div className="p-3 bg-gray-50 rounded-lg">
                    <div className="flex justify-between">
                      <div>
                        <div className="font-medium">Admission Officer</div>
                        <div className="text-xs text-gray-500">
                          Status changed to pending review
                        </div>
                      </div>
                      <div className="text-xs text-gray-500">
                        2024-01-15 10:00
                      </div>
                    </div>
                  </div>
                  <div className="p-3 bg-gray-50 rounded-lg">
                    <div className="flex justify-between">
                      <div>
                        <div className="font-medium">System</div>
                        <div className="text-xs text-gray-500">
                          Application created
                        </div>
                      </div>
                      <div className="text-xs text-gray-500">
                        2024-01-15 09:58
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Right column actions */}
        <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="md:col-span-1">
            <Card className="bg-white shadow-lg">
              <CardHeader>
                <CardTitle className="text-lg font-poppins text-deep-plum">
                  {t.actions}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {application?.status !== "approved" && (
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button className="w-full bg-green-600 hover:bg-green-700">
                        <CheckCircle className="w-4 h-4 mr-2" />
                        {t.approve}
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>{t.confirmApproval}</DialogTitle>
                      </DialogHeader>
                      <div className="space-y-4">
                        <div className="space-y-2">
                          <Label>{t.approvalNote}</Label>
                          <Textarea
                            value={approvalNote}
                            onChange={(e) => setApprovalNote(e.target.value)}
                            placeholder="Add approval notes..."
                          />
                        </div>
                        <div className="space-y-2">
                          <Label>{t.applicantId}</Label>
                          <Input
                            value={application?.university_id || ""}
                            readOnly
                          />
                        </div>
                        <Button
                          onClick={handleApprove}
                          className="w-full bg-green-600 hover:bg-green-700"
                        >
                          {t.confirmApproval}
                        </Button>
                      </div>
                    </DialogContent>
                  </Dialog>
                )}

                {application?.status !== "rejected" && (
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button variant="destructive" className="w-full">
                        <XCircle className="w-4 h-4 mr-2" />
                        {t.reject}
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>{t.confirmRejection}</DialogTitle>
                      </DialogHeader>
                      <div className="space-y-4">
                        <div className="space-y-2">
                          <Label>{t.rejectionReason}</Label>
                          <Textarea
                            value={rejectionReason}
                            onChange={(e) => setRejectionReason(e.target.value)}
                            placeholder="Enter reason for rejection..."
                            required
                          />
                        </div>
                        <Button
                          onClick={handleReject}
                          variant="destructive"
                          className="w-full"
                        >
                          {t.confirmRejection}
                        </Button>
                      </div>
                    </DialogContent>
                  </Dialog>
                )}

                <div className="border-t pt-3">
                  <Button
                    onClick={() => setIsLocked(!isLocked)}
                    variant="outline"
                    className="w-full"
                  >
                    {isLocked ? (
                      <>
                        <Unlock className="w-4 h-4 mr-2" />
                        {t.unlock}
                      </>
                    ) : (
                      <>
                        <Lock className="w-4 h-4 mr-2" />
                        {t.lock}
                      </>
                    )}
                  </Button>
                </div>

                <div className="border-t pt-3 space-y-2">
                  <Button variant="outline" className="w-full">
                    <Mail className="w-4 h-4 mr-2" />
                    {t.sendEmail}
                  </Button>
                  <Button variant="outline" className="w-full">
                    <MessageSquare className="w-4 h-4 mr-2" />
                    {t.sendSMS}
                  </Button>
                  <Button
                    variant="outline"
                    className="w-full"
                    onClick={handleDownloadReceipt}
                    disabled={isDownloadingReceipt}
                  >
                    <Download className="w-4 h-4 mr-2" />
                    {isDownloadingReceipt
                      ? "Downloading..."
                      : t.downloadInvoice}
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}

// Small inline icon component for history (to avoid extra imports)
function HistoryIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      className="h-4 w-4"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M8 7V3m8 4V3M3 11a9 9 0 1118 0 9 9 0 01-18 0z"
      />
    </svg>
  );
}
