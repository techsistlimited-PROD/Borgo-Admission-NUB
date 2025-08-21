import { useState } from "react";
import {
  Mail,
  MessageSquare,
  Download,
  Send,
  CheckCircle,
  Copy,
  Eye,
  Filter,
  Users,
} from "lucide-react";
import { Button } from "../components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../components/ui/card";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { Textarea } from "../components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../components/ui/select";
import { Badge } from "../components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../components/ui/dialog";

export default function EmailTemplates() {
  const [language, setLanguage] = useState<"en" | "bn">("en");
  const [selectedTemplate, setSelectedTemplate] =
    useState("admission_approved");
  const [recipientEmail, setRecipientEmail] = useState("");
  const [recipientPhone, setRecipientPhone] = useState("");
  const [isSending, setIsSending] = useState(false);
  const [sendStatus, setSendStatus] = useState<"idle" | "success" | "error">(
    "idle",
  );
  const [selectedSemester, setSelectedSemester] = useState("all-semesters");
  const [selectedDepartment, setSelectedDepartment] = useState("all-departments");
  const [selectedStudent, setSelectedStudent] = useState("");

  const texts = {
    en: {
      title: "System Email & SMS Templates",
      subtitle: "Communication Templates Management",
      emailTemplates: "Email Templates",
      smsTemplates: "SMS Templates",
      templateType: "Template Type",
      recipient: "Recipient",
      subject: "Subject",
      message: "Message",
      sendEmail: "Send Email",
      sendSMS: "Send SMS",
      preview: "Preview",
      copy: "Copy",
      variables: "Available Variables",
      sendTest: "Send Test",
      sending: "Sending...",
      sent: "Sent Successfully!",
      error: "Failed to send",
      admissionApproved: "Admission Approved",
      paymentReceived: "Payment Received",
      documentsRequired: "Documents Required",
      applicationRejected: "Application Rejected",
      idCreated: "Student ID Created",
      enrollmentComplete: "Enrollment Complete",
      studentName: "Student Name",
      trackingId: "Tracking ID",
      studentId: "Student ID",
      password: "Password",
      amount: "Amount",
      program: "Program",
      university: "University Name",
      contactEmail: "Contact Email",
      contactPhone: "Contact Phone",
      portalLink: "Portal Link",
      invoiceLink: "Invoice Link",
    },
    bn: {
      title: "সিস���টেম ইমেইল ও এসএমএস টেমপ্লেট",
      subtitle: "যোগাযোগ টেমপ্লেট ব্যবস্থাপনা",
      emailTemplates: "ইমেইল টেমপ্লেট",
      smsTemplates: "এসএমএস টেমপ্লেট",
      templateType: "টেমপ্লেট ধরন",
      recipient: "প্রাপক",
      subject: "বিষয়",
      message: "বার্তা",
      sendEmail: "ইমেইল পাঠান",
      sendSMS: "এসএমএস পাঠান",
      preview: "প্রিভিউ",
      copy: "কপি",
      variables: "উপলব্ধ ভেরিয়েবল",
      sendTest: "টেস্ট পাঠান",
      sending: "পাঠানো হচ্ছে...",
      sent: "সফলভাবে পাঠানো হয়েছে!",
      error: "পাঠাতে ব্যর্থ",
      admissionApproved: "ভর্তি অনুমোদিত",
      paymentReceived: "পেমেন্ট প্রাপ্ত",
      documentsRequired: "কাগজপত্র প্রয়োজন",
      applicationRejected: "আবেদন প্রত্যাখ্যাত",
      idCreated: "ছাত্র আইডি তৈরি",
      enrollmentComplete: "ভর্তি সম্পন্ন",
      studentName: "ছাত্রের নাম",
      trackingId: "ট্র্যাকিং আইডি",
      studentId: "ছাত্র আইডি",
      password: "পাসওয়ার্ড",
      amount: "পরিমাণ",
      program: "প্রোগ্রাম",
      university: "বিশ্ববিদ্যালয়ের নাম",
      contactEmail: "যোগাযোগ ইমেইল",
      contactPhone: "যোগাযোগ ফোন",
      portalLink: "পোর্টাল লিংক",
      invoiceLink: "ইনভয়েস লিংক",
    },
  };

  const t = texts[language];

  // Dummy students data
  const dummyStudents = [
    {
      id: "student-1",
      name: "Md. Rahman Ahmed",
      email: "rahman.ahmed@student.nu.edu.bd",
      phone: "+8801712345678",
      student_id: "NU24CSE001",
      tracking_id: "APP2024001",
      program: "Computer Science & Engineering",
      department: "Computer Science & Engineering",
      semester: "Spring 2024",
      password: "TempPass123",
    },
    {
      id: "student-2",
      name: "Fatima Khatun",
      email: "fatima.khatun@student.nu.edu.bd",
      phone: "+8801823456789",
      student_id: "NU24EEE002",
      tracking_id: "APP2024002",
      program: "Electrical & Electronic Engineering",
      department: "Electrical & Electronic Engineering",
      semester: "Spring 2024",
      password: "SecurePass456",
    },
    {
      id: "student-3",
      name: "Karim Hassan",
      email: "karim.hassan@student.nu.edu.bd",
      phone: "+8801934567890",
      student_id: "NU24BBA003",
      tracking_id: "APP2024003",
      program: "Bachelor of Business Administration",
      department: "Business Administration",
      semester: "Fall 2024",
      password: "MyPass789",
    },
  ];

  const semesters = ["Spring 2024", "Fall 2024", "Summer 2024"];
  const departments = [
    "Computer Science & Engineering",
    "Electrical & Electronic Engineering",
    "Business Administration",
    "Civil Engineering",
    "Pharmacy",
  ];

  // Filter students based on selected criteria
  const filteredStudents = dummyStudents.filter((student) => {
    const semesterMatch =
      !selectedSemester || selectedSemester === "all-semesters" || student.semester === selectedSemester;
    const departmentMatch =
      !selectedDepartment || selectedDepartment === "all-departments" || student.department === selectedDepartment;
    return semesterMatch && departmentMatch;
  });

  const currentStudent = dummyStudents.find((s) => s.id === selectedStudent);

  // Function to replace template variables with student data
  const renderTemplate = (
    template: string,
    student: (typeof dummyStudents)[0] | null,
  ) => {
    if (!student || !template) return template;

    return template
      .replace(/{{STUDENT_NAME}}/g, student.name)
      .replace(/{{TRACKING_ID}}/g, student.tracking_id)
      .replace(/{{STUDENT_ID}}/g, student.student_id)
      .replace(/{{PASSWORD}}/g, student.password)
      .replace(/{{AMOUNT}}/g, "50,000")
      .replace(/{{PROGRAM}}/g, student.program)
      .replace(/{{UNIVERSITY}}/g, "Northern University Bangladesh")
      .replace(/{{CONTACT_EMAIL}}/g, "admission@nu.edu.bd")
      .replace(/{{CONTACT_PHONE}}/g, "+880-2-8870220")
      .replace(/{{PORTAL_LINK}}/g, "https://portal.nu.edu.bd")
      .replace(/{{INVOICE_LINK}}/g, "https://portal.nu.edu.bd/invoice");
  };

  // Handle student selection
  const handleStudentSelect = (studentId: string) => {
    setSelectedStudent(studentId);
    const student = dummyStudents.find((s) => s.id === studentId);
    if (student) {
      setRecipientEmail(student.email);
      setRecipientPhone(student.phone);
    }
  };

  const emailTemplates = {
    admission_approved: {
      subject:
        "Congratulations! Your admission has been approved - {{STUDENT_NAME}}",
      content: `Dear {{STUDENT_NAME}},

Congratulations! We are pleased to inform you that your application ({{TRACKING_ID}}) for {{PROGRAM}} at {{UNIVERSITY}} has been approved.

Your Student ID: {{STUDENT_ID}}
Temporary Password: {{PASSWORD}}

You can now access the student portal using the link below:
{{PORTAL_LINK}}

Please find your invoice attached to this email. You can also download it from:
{{INVOICE_LINK}}

Welcome to {{UNIVERSITY}}! We look forward to seeing you in the upcoming semester.

Best regards,
Admission Office
{{UNIVERSITY}}
Email: {{CONTACT_EMAIL}}
Phone: {{CONTACT_PHONE}}`,
    },
    payment_received: {
      subject: "Payment Received - {{TRACKING_ID}}",
      content: `Dear {{STUDENT_NAME}},

Thank you for your payment. We have successfully received your payment of BDT {{AMOUNT}} for application {{TRACKING_ID}}.

Your payment is now being verified by our finance team. You will receive a confirmation email once the verification is complete.

You can download your payment receipt from:
{{INVOICE_LINK}}

If you have any questions, please contact us at:
Email: {{CONTACT_EMAIL}}
Phone: {{CONTACT_PHONE}}

Best regards,
Finance Office
{{UNIVERSITY}}`,
    },
    id_created: {
      subject: "Student ID Created - Welcome to {{UNIVERSITY}}",
      content: `Dear {{STUDENT_NAME}},

Your student ID has been successfully created!

Student ID: {{STUDENT_ID}}
Password: {{PASSWORD}}
Program: {{PROGRAM}}

You can access the student portal at:
{{PORTAL_LINK}}

Please keep your credentials safe and change your password after first login.

Welcome to {{UNIVERSITY}}!

Best regards,
IT Department
{{UNIVERSITY}}`,
    },
  };

  const smsTemplates = {
    admission_approved:
      "Congratulations {{STUDENT_NAME}}! Your admission to {{UNIVERSITY}} has been approved. Student ID: {{STUDENT_ID}}. Check email for details. {{PORTAL_LINK}}",
    payment_received:
      "Payment of BDT {{AMOUNT}} received for {{TRACKING_ID}}. Verification in progress. Thank you! - {{UNIVERSITY}}",
    id_created:
      "Student ID created! ID: {{STUDENT_ID}}, Password: {{PASSWORD}}. Login: {{PORTAL_LINK}} - {{UNIVERSITY}}",
  };

  const templateOptions = [
    { value: "admission_approved", label: t.admissionApproved },
    { value: "payment_received", label: t.paymentReceived },
    { value: "documents_required", label: t.documentsRequired },
    { value: "application_rejected", label: t.applicationRejected },
    { value: "id_created", label: t.idCreated },
    { value: "enrollment_complete", label: t.enrollmentComplete },
  ];

  const availableVariables = [
    { key: "{{STUDENT_NAME}}", description: t.studentName },
    { key: "{{TRACKING_ID}}", description: t.trackingId },
    { key: "{{STUDENT_ID}}", description: t.studentId },
    { key: "{{PASSWORD}}", description: t.password },
    { key: "{{AMOUNT}}", description: t.amount },
    { key: "{{PROGRAM}}", description: t.program },
    { key: "{{UNIVERSITY}}", description: t.university },
    { key: "{{CONTACT_EMAIL}}", description: t.contactEmail },
    { key: "{{CONTACT_PHONE}}", description: t.contactPhone },
    { key: "{{PORTAL_LINK}}", description: t.portalLink },
    { key: "{{INVOICE_LINK}}", description: t.invoiceLink },
  ];

  const handleSendEmail = async () => {
    if (!recipientEmail) return;

    setIsSending(true);
    setSendStatus("idle");

    // Simulate sending
    await new Promise((resolve) => setTimeout(resolve, 2000));

    // Simulate success (90% chance)
    if (Math.random() > 0.1) {
      setSendStatus("success");
    } else {
      setSendStatus("error");
    }

    setIsSending(false);

    // Reset status after 3 seconds
    setTimeout(() => setSendStatus("idle"), 3000);
  };

  const handleSendSMS = async () => {
    if (!recipientPhone) return;

    setIsSending(true);
    setSendStatus("idle");

    // Simulate sending
    await new Promise((resolve) => setTimeout(resolve, 2000));

    // Simulate success (90% chance)
    if (Math.random() > 0.1) {
      setSendStatus("success");
    } else {
      setSendStatus("error");
    }

    setIsSending(false);

    // Reset status after 3 seconds
    setTimeout(() => setSendStatus("idle"), 3000);
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
  };

  const getTemplate = (type: "email" | "sms") => {
    if (type === "email") {
      return emailTemplates[selectedTemplate as keyof typeof emailTemplates];
    } else {
      return {
        content: smsTemplates[selectedTemplate as keyof typeof smsTemplates],
      };
    }
  };

  return (
    <div>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold text-deep-plum font-poppins">
                {t.title}
              </h1>
              <p className="text-gray-600 mt-1">{t.subtitle}</p>
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
          {/* Left Column - Template Selection & Filters */}
          <div className="space-y-6">
            <Card className="bg-white shadow-lg">
              <CardHeader>
                <CardTitle className="text-lg font-poppins text-deep-plum">
                  {t.templateType}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <Select
                  value={selectedTemplate}
                  onValueChange={setSelectedTemplate}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {templateOptions.map((option) => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </CardContent>
            </Card>

            {/* Filters Card */}
            <Card className="bg-white shadow-lg">
              <CardHeader>
                <CardTitle className="text-lg font-poppins text-deep-plum flex items-center gap-2">
                  <Filter className="w-5 h-5" />
                  Filters
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label>Semester</Label>
                  <Select
                    value={selectedSemester}
                    onValueChange={setSelectedSemester}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="All Semesters" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all-semesters">All Semesters</SelectItem>
                      {semesters.map((semester) => (
                        <SelectItem key={semester} value={semester}>
                          {semester}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>Department</Label>
                  <Select
                    value={selectedDepartment}
                    onValueChange={setSelectedDepartment}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="All Departments" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all-departments">All Departments</SelectItem>
                      {departments.map((dept) => (
                        <SelectItem key={dept} value={dept}>
                          {dept}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
            </Card>

            {/* Student Selection Card */}
            <Card className="bg-white shadow-lg">
              <CardHeader>
                <CardTitle className="text-lg font-poppins text-deep-plum flex items-center gap-2">
                  <Users className="w-5 h-5" />
                  Test with Student Data
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label>Select Student</Label>
                  <Select
                    value={selectedStudent}
                    onValueChange={handleStudentSelect}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Choose a student" />
                    </SelectTrigger>
                    <SelectContent>
                      {filteredStudents.map((student) => (
                        <SelectItem key={student.id} value={student.id}>
                          <div className="flex flex-col">
                            <span className="font-medium">{student.name}</span>
                            <span className="text-xs text-gray-500">
                              {student.department} - {student.semester}
                            </span>
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {currentStudent && (
                  <div className="p-3 bg-lavender-bg rounded-lg">
                    <div className="text-sm space-y-1">
                      <div>
                        <strong>Name:</strong> {currentStudent.name}
                      </div>
                      <div>
                        <strong>ID:</strong> {currentStudent.student_id}
                      </div>
                      <div>
                        <strong>Program:</strong> {currentStudent.program}
                      </div>
                      <div>
                        <strong>Email:</strong> {currentStudent.email}
                      </div>
                      <div>
                        <strong>Phone:</strong> {currentStudent.phone}
                      </div>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Variables Reference */}
            <Card className="bg-white shadow-lg">
              <CardHeader>
                <CardTitle className="text-lg font-poppins text-deep-plum">
                  {t.variables}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2 max-h-64 overflow-y-auto">
                  {availableVariables.map((variable) => (
                    <div
                      key={variable.key}
                      className="flex items-center justify-between p-2 bg-gray-50 rounded text-xs"
                    >
                      <div>
                        <code className="text-accent-purple font-mono">
                          {variable.key}
                        </code>
                        <p className="text-gray-600 mt-1">
                          {variable.description}
                        </p>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => copyToClipboard(variable.key)}
                        className="h-6 w-6 p-0"
                      >
                        <Copy className="w-3 h-3" />
                      </Button>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Middle Column - Email Template */}
          <div className="space-y-6">
            <Card className="bg-white shadow-lg">
              <CardHeader>
                <CardTitle className="text-lg font-poppins text-deep-plum flex items-center gap-2">
                  <Mail className="w-5 h-5" />
                  {t.emailTemplates}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="email-recipient">{t.recipient}</Label>
                  <Input
                    id="email-recipient"
                    type="email"
                    placeholder="student@example.com"
                    value={recipientEmail}
                    onChange={(e) => setRecipientEmail(e.target.value)}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email-subject">{t.subject}</Label>
                  <Input
                    id="email-subject"
                    value={
                      currentStudent
                        ? renderTemplate(
                            getTemplate("email").subject || "",
                            currentStudent,
                          )
                        : getTemplate("email").subject || ""
                    }
                    readOnly
                    className={`${currentStudent ? "bg-blue-50 border-blue-200" : "bg-gray-50"}`}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email-content">{t.message}</Label>
                  <Textarea
                    id="email-content"
                    rows={12}
                    value={
                      currentStudent
                        ? renderTemplate(
                            getTemplate("email").content || "",
                            currentStudent,
                          )
                        : getTemplate("email").content || ""
                    }
                    readOnly
                    className={`font-mono text-sm ${currentStudent ? "bg-blue-50 border-blue-200" : "bg-gray-50"}`}
                  />
                  {currentStudent && (
                    <div className="text-xs text-blue-600">
                      📝 Preview with {currentStudent.name}'s data - variables
                      replaced
                    </div>
                  )}
                </div>

                <div className="flex gap-2">
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button variant="outline" className="flex-1">
                        <Eye className="w-4 h-4 mr-2" />
                        {t.preview}
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-2xl">
                      <DialogHeader>
                        <DialogTitle>Email Preview</DialogTitle>
                      </DialogHeader>
                      <div className="space-y-4">
                        <div className="p-4 border rounded bg-gray-50">
                          <div className="text-sm text-gray-600">
                            To: {recipientEmail}
                          </div>
                          <div className="text-sm text-gray-600 mb-2">
                            Subject:{" "}
                            {renderTemplate(
                              getTemplate("email").subject || "",
                              currentStudent,
                            )}
                          </div>
                          <div className="whitespace-pre-wrap text-sm border-t pt-2">
                            {renderTemplate(
                              getTemplate("email").content || "",
                              currentStudent,
                            )}
                          </div>
                        </div>
                        {currentStudent && (
                          <div className="p-3 bg-blue-50 rounded text-sm">
                            <div className="font-medium text-blue-800 mb-2">
                              Preview with {currentStudent.name}'s data:
                            </div>
                            <div className="text-blue-700">
                              All {{ VARIABLE }} placeholders have been replaced
                              with actual student information.
                            </div>
                          </div>
                        )}
                      </div>
                    </DialogContent>
                  </Dialog>

                  <Button
                    onClick={handleSendEmail}
                    disabled={!recipientEmail || isSending}
                    className="flex-1 bg-deep-plum hover:bg-accent-purple"
                  >
                    {isSending ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                        {t.sending}
                      </>
                    ) : (
                      <>
                        <Send className="w-4 h-4 mr-2" />
                        {t.sendTest}
                      </>
                    )}
                  </Button>
                </div>

                {sendStatus === "success" && (
                  <div className="flex items-center gap-2 text-green-600 bg-green-50 p-2 rounded">
                    <CheckCircle className="w-4 h-4" />
                    {t.sent}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Right Column - SMS Template */}
          <div className="space-y-6">
            <Card className="bg-white shadow-lg">
              <CardHeader>
                <CardTitle className="text-lg font-poppins text-deep-plum flex items-center gap-2">
                  <MessageSquare className="w-5 h-5" />
                  {t.smsTemplates}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="sms-recipient">{t.recipient}</Label>
                  <Input
                    id="sms-recipient"
                    type="tel"
                    placeholder="+880 1XXXXXXXXX"
                    value={recipientPhone}
                    onChange={(e) => setRecipientPhone(e.target.value)}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="sms-content">{t.message}</Label>
                  <Textarea
                    id="sms-content"
                    rows={6}
                    value={
                      currentStudent
                        ? renderTemplate(
                            getTemplate("sms").content || "",
                            currentStudent,
                          )
                        : getTemplate("sms").content || ""
                    }
                    readOnly
                    className={`font-mono text-sm ${currentStudent ? "bg-blue-50 border-blue-200" : "bg-gray-50"}`}
                  />
                  {currentStudent && (
                    <div className="text-xs text-blue-600">
                      📝 Preview with {currentStudent.name}'s data - variables
                      replaced
                    </div>
                  )}
                  <div className="flex justify-between text-xs text-gray-500">
                    <span>
                      Character count:{" "}
                      {
                        (currentStudent
                          ? renderTemplate(
                              getTemplate("sms")?.content || "",
                              currentStudent,
                            )
                          : getTemplate("sms")?.content || ""
                        ).length
                      }
                    </span>
                    <span>
                      SMS parts:{" "}
                      {Math.ceil(
                        (currentStudent
                          ? renderTemplate(
                              getTemplate("sms")?.content || "",
                              currentStudent,
                            )
                          : getTemplate("sms")?.content || ""
                        ).length / 160,
                      )}
                    </span>
                  </div>
                </div>

                <div className="flex gap-2">
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button variant="outline" className="flex-1">
                        <Eye className="w-4 h-4 mr-2" />
                        {t.preview}
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>SMS Preview</DialogTitle>
                      </DialogHeader>
                      <div className="space-y-4">
                        <div className="p-4 border rounded bg-gray-50">
                          <div className="text-sm text-gray-600 mb-2">
                            To: {recipientPhone}
                          </div>
                          <div className="text-sm border-t pt-2">
                            {renderTemplate(
                              getTemplate("sms")?.content || "",
                              currentStudent,
                            )}
                          </div>
                        </div>
                        {currentStudent && (
                          <div className="p-3 bg-blue-50 rounded text-sm">
                            <div className="font-medium text-blue-800 mb-2">
                              Preview with {currentStudent.name}'s data:
                            </div>
                            <div className="text-blue-700">
                              All {{ VARIABLE }} placeholders have been replaced
                              with actual student information.
                            </div>
                          </div>
                        )}
                      </div>
                    </DialogContent>
                  </Dialog>

                  <Button
                    onClick={handleSendSMS}
                    disabled={!recipientPhone || isSending}
                    className="flex-1 bg-deep-plum hover:bg-accent-purple"
                  >
                    {isSending ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                        {t.sending}
                      </>
                    ) : (
                      <>
                        <Send className="w-4 h-4 mr-2" />
                        {t.sendTest}
                      </>
                    )}
                  </Button>
                </div>

                {sendStatus === "success" && (
                  <div className="flex items-center gap-2 text-green-600 bg-green-50 p-2 rounded">
                    <CheckCircle className="w-4 h-4" />
                    {t.sent}
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Success Confirmation */}
            <Card className="bg-gradient-to-r from-green-50 to-green-100 border-green-200">
              <CardHeader>
                <CardTitle className="text-green-800 font-poppins flex items-center gap-2">
                  <CheckCircle className="w-5 h-5" />
                  Communication Sent
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2 text-green-700">
                  <p className="text-sm">✓ Email sent successfully</p>
                  <p className="text-sm">✓ SMS delivered</p>
                  <p className="text-sm">✓ Invoice attached</p>
                  <p className="text-sm">✓ Student credentials provided</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
