import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  Bell,
  Download,
  Eye,
  FileText,
  CreditCard,
  Clock,
  CheckCircle,
  XCircle,
  AlertCircle,
  IdCard,
} from "lucide-react";
import { Button } from "../components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../components/ui/card";
import { Badge } from "../components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../components/ui/table";

import { useAuth } from "@/contexts/AuthContext";
import apiClient from "@/lib/api";
import { useToast } from "@/hooks/use-toast";

export default function Dashboard() {
  const [language, setLanguage] = useState<"en" | "bn">("en");
  const { toast } = useToast();
  const { user, userType } = useAuth();
  const [fetchedApplications, setFetchedApplications] = useState<any[] | null>(
    null,
  );

  useEffect(() => {
    const load = async () => {
      if (userType === "applicant" && user?.university_id) {
        try {
          const res = await apiClient.getApplications({
            search: user.university_id,
          });
          if (res.success && res.data) {
            setFetchedApplications(res.data.applications || []);
          }
        } catch (e) {
          // ignore
        }
      }
    };
    load();
  }, [user, userType]);

  const texts = {
    en: {
      title: "Applicant Dashboard",
      welcome: "Welcome back",
      applicationSummary: "Application Summary",
      recentApplications: "Recent Applications",
      applicationProgress: "Application Progress",
      applied: "Applied",
      underReview: "Under Review",
      approved: "Approved",
      rejected: "Rejected",
      trackingId: "Tracking ID",
      program: "Program",
      status: "Status",
      payslipUploaded: "Payslip Uploaded",
      actions: "Actions",
      viewDetails: "View Details",
      downloadInvoice: "Download Invoice",
      yes: "Yes",
      no: "No",
      applicationTimeline: "Application Timeline",
      submitted: "Application Submitted",
      paymentReceived: "Payment Received",
      documentVerified: "Documents Verified",
      applicationApproved: "Application Approved",
      idCreated: "Student ID Created",
      enrollmentCompleted: "Enrollment Completed",
      notifications: "Recent Notifications",
      viewAllNotifications: "View All Notifications",
      newApplication: "Start New Application",
      studentId: "Your Student ID",
      universityId: "University ID",
      keepIdSafe: "Keep this ID safe for all university activities",
    },
    bn: {
      title: "আবেদনকারীর ড্যাশবোর্ড",
      welcome: "স্বাগতম",
      applicationSummary: "আবে��নের সারসংক্ষেপ",
      recentApplications: "সাম্প্রতিক আবেদনসমূহ",
      applicationProgress: "আবেদনের অগ্রগতি",
      applied: "আবেদনকৃত",
      underReview: "পর্য��লোচনাধীন",
      approved: "অনুমোদিত",
      rejected: "প্রত্যাখ্যাত",
      trackingId: "ট্র্যাকিং আইডি",
      program: "প্রোগ্রাম",
      status: "অবস্থা",
      payslipUploaded: "পে-স্লিপ আপলোড",
      actions: "কর্ম",
      viewDetails: "বিস্তারিত দেখুন",
      downloadInvoice: "ইনভয়েস ডাউনলোড",
      yes: "হ্যাঁ",
      no: "না",
      applicationTimeline: "আবেদনের সময়রেখা",
      submitted: "আ��েদন জমা দেওয়া হয়েছে",
      paymentReceived: "পেমেন্ট প্রা��্ত",
      documentVerified: "কাগজপত্র যাচাইকৃত",
      applicationApproved: "আবেদন অনুমোদিত",
      idCreated: "ছাত্র ���ইডি তৈ��ি",
      enrollmentCompleted: "ভর্তি সম্পন্ন",
      notifications: "সাম্প্রতিক বিজ���ঞপ্তি",
      viewAllNotifications: "���ব বিজ্ঞপ্তি দেখুন",
      newApplication: "নতুন আবেদন শুরু করুন",
      studentId: "আপনার ছাত্র আইডি",
      universityId: "বিশ্ববিদ্যালয় আইডি",
      keepIdSafe: "সব বিশ্ববিদ্যালয় কার্যক্রমের জন্��� এই আইডি নিরাপদ রাখুন",
    },
  };

  const t = texts[language];

  // Compute counts from fetchedApplications (fallback to sample `applications` if none)
  let apps = fetchedApplications ?? defaultApplications;

  // If logged in as applicant, further filter to only their own applications
  try {
    if (userType === "applicant" && user?.university_id) {
      const uid = user.university_id.toString();
      apps = apps.filter((a: any) => {
        return (
          (a.trackingId && a.trackingId.toString() === uid) ||
          (a.university_id && a.university_id.toString() === uid) ||
          (a.applicant_university_id && a.applicant_university_id.toString() === uid) ||
          (a.universityId && a.universityId.toString() === uid)
        );
      });
    }
  } catch (e) {
    // ignore
  }

  const counts = { applied: 0, under_review: 0, approved: 0, rejected: 0 };
  apps.forEach((a: any) => {
    const s = (a.status || "").toString().toLowerCase();
    if (s.includes("approved")) counts.approved++;
    else if (s.includes("under_review") || s.includes("under review") || s.includes("review")) counts.under_review++;
    else if (s.includes("rejected") || s.includes("reject")) counts.rejected++;
    else counts.applied++;
  });

  const summaryData = [
    { label: t.applied, count: counts.applied, color: "bg-blue-100 text-blue-800", icon: FileText },
    { label: t.underReview, count: counts.under_review, color: "bg-yellow-100 text-yellow-800", icon: Clock },
    { label: t.approved, count: counts.approved, color: "bg-green-100 text-green-800", icon: CheckCircle },
    { label: t.rejected, count: counts.rejected, color: "bg-red-100 text-red-800", icon: XCircle },
  ];

  const defaultApplications = [
    {
      id: 1,
      trackingId: "NU2024001234",
      program: "BSc Computer Science",
      status: "approved",
      payslip: true,
      submittedDate: "2024-01-15",
      statusText: t.approved,
    },
    {
      id: 2,
      trackingId: "NU2024001235",
      program: "BSc Electrical Engineering",
      status: "under_review",
      payslip: true,
      submittedDate: "2024-01-20",
      statusText: t.underReview,
    },
    {
      id: 3,
      trackingId: "NU2024001236",
      program: "MSc Data Science",
      status: "rejected",
      payslip: false,
      submittedDate: "2024-01-10",
      statusText: t.rejected,
    },
  ];

  const progressSteps = [
    { label: t.submitted, completed: true, date: "2024-01-15" },
    { label: t.paymentReceived, completed: true, date: "2024-01-16" },
    { label: t.documentVerified, completed: true, date: "2024-01-18" },
    { label: t.applicationApproved, completed: true, date: "2024-01-20" },
    { label: t.idCreated, completed: false, date: null },
    { label: t.enrollmentCompleted, completed: false, date: null },
  ];

  const notifications = [
    {
      id: 1,
      message: "Your application NU2024001234 has been approved",
      time: "2 hours ago",
      type: "success",
    },
    {
      id: 2,
      message: "Payment received for application NU2024001234",
      time: "1 day ago",
      type: "info",
    },
    {
      id: 3,
      message: "Documents verification completed",
      time: "2 days ago",
      type: "success",
    },
  ];

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      approved: { color: "bg-green-100 text-green-800", icon: CheckCircle },
      under_review: { color: "bg-yellow-100 text-yellow-800", icon: Clock },
      rejected: { color: "bg-red-100 text-red-800", icon: XCircle },
    };

    const config = statusConfig[status as keyof typeof statusConfig];
    return (
      <Badge className={config.color}>
        <config.icon className="w-3 h-3 mr-1" />
        {status === "approved"
          ? t.approved
          : status === "under_review"
            ? t.underReview
            : t.rejected}
      </Badge>
    );
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
              <p className="text-gray-600">{t.welcome}, John Doe</p>
            </div>

            {/* Language Toggle */}
            <div className="flex items-center gap-4">
              <Button variant="outline" asChild>
                <Link to="/notifications">
                  <Bell className="w-4 h-4 mr-2" />
                  {t.notifications}
                </Link>
              </Button>
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
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {summaryData.map((item, index) => (
            <Card key={index} className="bg-white shadow-lg">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">
                      {item.label}
                    </p>
                    <p className="text-3xl font-bold text-deep-plum">
                      {item.count}
                    </p>
                  </div>
                  <div className={`p-3 rounded-full ${item.color}`}>
                    <item.icon className="w-6 h-6" />
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column */}
          <div className="lg:col-span-2 space-y-8">
            {/* Recent Applications */}
            <Card className="bg-white shadow-lg">
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle className="text-xl font-poppins text-deep-plum">
                  {t.recentApplications}
                </CardTitle>
                {!(fetchedApplications && fetchedApplications.length > 0) ? (
                  <Button asChild>
                    <Link
                      to="/program-selection?new=true"
                      className="bg-deep-plum hover:bg-accent-purple"
                    >
                      {t.newApplication}
                    </Link>
                  </Button>
                ) : (
                  <Button asChild>
                    <Link
                      to="/application-review"
                      className="bg-deep-plum hover:bg-accent-purple"
                    >
                      View Application
                    </Link>
                  </Button>
                )}
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>{t.trackingId}</TableHead>
                      <TableHead>{t.program}</TableHead>
                      <TableHead>{t.status}</TableHead>
                      <TableHead>{t.payslipUploaded}</TableHead>
                      <TableHead>{t.actions}</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {apps.map((app) => (
                      <TableRow key={app.id}>
                        <TableCell className="font-medium">
                          {app.trackingId}
                        </TableCell>
                        <TableCell>{app.program}</TableCell>
                        <TableCell>{getStatusBadge(app.status)}</TableCell>
                        <TableCell>
                          <Badge variant={app.payslip ? "default" : "outline"}>
                            {app.payslip ? t.yes : t.no}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <div className="flex gap-2">
                            <Button variant="outline" size="sm">
                              <Eye className="w-3 h-3 mr-1" />
                              {t.viewDetails}
                            </Button>
                            <Button variant="outline" size="sm">
                              <Download className="w-3 h-3 mr-1" />
                              Invoice
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>

            {/* Application Progress */}
            <Card className="bg-white shadow-lg">
              <CardHeader>
                <CardTitle className="text-xl font-poppins text-deep-plum">
                  {t.applicationProgress} - NU2024001234
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {progressSteps.map((step, index) => (
                    <div key={index} className="flex items-center gap-4">
                      <div
                        className={`w-8 h-8 rounded-full flex items-center justify-center ${
                          step.completed ? "bg-green-500" : "bg-gray-300"
                        }`}
                      >
                        {step.completed ? (
                          <CheckCircle className="w-5 h-5 text-white" />
                        ) : (
                          <span className="text-sm font-bold text-gray-600">
                            {index + 1}
                          </span>
                        )}
                      </div>
                      <div className="flex-1">
                        <h4
                          className={`font-medium ${step.completed ? "text-green-700" : "text-gray-500"}`}
                        >
                          {step.label}
                        </h4>
                        {step.date && (
                          <p className="text-sm text-gray-500">{step.date}</p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Right Column */}
          <div className="space-y-8">
            {/* Student ID Card */}
            <Card className="bg-gradient-to-r from-deep-plum to-accent-purple text-white shadow-lg">
              <CardHeader>
                <CardTitle className="text-lg font-poppins flex items-center gap-2">
                  <IdCard className="w-5 h-5" />
                  {t.studentId}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="text-2xl font-bold font-mono tracking-wider">
                    NU24BCS001
                  </div>
                  <div className="text-sm opacity-90">
                    <div>
                      <strong>Name:</strong> John Doe
                    </div>
                    <div>
                      <strong>Program:</strong> BSc Computer Science
                    </div>
                    <div>
                      <strong>Batch:</strong> 2024-28
                    </div>
                  </div>
                  <div className="text-xs opacity-75 bg-white/20 p-2 rounded">
                    💡 {t.keepIdSafe}
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Notifications */}
            <Card className="bg-white shadow-lg">
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle className="text-lg font-poppins text-deep-plum">
                  {t.notifications}
                </CardTitle>
                <Button variant="outline" size="sm" asChild>
                  <Link to="/notifications">{t.viewAllNotifications}</Link>
                </Button>
              </CardHeader>
              <CardContent className="space-y-4">
                {notifications.map((notification) => (
                  <div key={notification.id} className="p-3 border rounded-lg">
                    <div className="flex items-start gap-3">
                      <div
                        className={`p-1 rounded-full ${
                          notification.type === "success"
                            ? "bg-green-100"
                            : "bg-blue-100"
                        }`}
                      >
                        {notification.type === "success" ? (
                          <CheckCircle className="w-4 h-4 text-green-600" />
                        ) : (
                          <AlertCircle className="w-4 h-4 text-blue-600" />
                        )}
                      </div>
                      <div className="flex-1">
                        <p className="text-sm font-medium text-gray-900">
                          {notification.message}
                        </p>
                        <p className="text-xs text-gray-500 mt-1">
                          {notification.time}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Quick Actions */}
            <Card className="bg-white shadow-lg">
              <CardHeader>
                <CardTitle className="text-lg font-poppins text-deep-plum">
                  Quick Actions
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button variant="outline" className="w-full justify-start">
                  <FileText className="w-4 h-4 mr-2" />
                  Update Documents
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  <CreditCard className="w-4 h-4 mr-2" />
                  Payment History
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  <Download className="w-4 h-4 mr-2" />
                  Download Forms
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
