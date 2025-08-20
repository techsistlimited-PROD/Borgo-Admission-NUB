import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  BookOpen,
  Calendar,
  User,
  GraduationCap,
  Clock,
  AlertCircle,
  CheckCircle,
  Bell,
  FileText,
  BarChart3,
  LogOut,
} from "lucide-react";
import { Button } from "../../components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../../components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../../components/ui/table";
import { Badge } from "../../components/ui/badge";
import { useToast } from "../../hooks/use-toast";

export default function StudentDashboard() {
  const [language, setLanguage] = useState<"en" | "bn">("en");
  const [userData, setUserData] = useState<any>(null);
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    // Check if user is logged in
    const userType = localStorage.getItem("reg_user_type");
    const storedUserData = localStorage.getItem("reg_user_data");
    
    if (userType !== "student" || !storedUserData) {
      navigate("/registration/student-login");
      return;
    }

    setUserData(JSON.parse(storedUserData));
  }, [navigate]);

  const texts = {
    en: {
      dashboard: "Student Dashboard",
      welcome: "Welcome back",
      currentSemester: "Current Semester",
      advisor: "Academic Advisor",
      holdsAlerts: "Holds & Alerts",
      quickActions: "Quick Actions",
      courseRegistration: "Course Registration",
      academicHistory: "Academic History",
      viewRoutine: "View Routine",
      searchStudents: "Search Students",
      pendingApprovals: "Pending Approvals",
      notifications: "Notifications",
      academicOverview: "Academic Overview",
      completedCredits: "Completed Credits",
      currentCGPA: "Current CGPA",
      remainingCredits: "Remaining Credits",
      expectedGraduation: "Expected Graduation",
      recentActivity: "Recent Activity",
      registrationStatus: "Registration Status",
      advisorApproval: "Advisor Approval",
      approved: "Approved",
      pending: "Pending",
      rejected: "Rejected",
      noHolds: "No active holds",
      financialHold: "Financial Hold",
      disciplinaryHold: "Disciplinary Hold",
      logout: "Logout",
      courseCode: "Course Code",
      courseName: "Course Name",
      credits: "Credits",
      status: "Status",
      advisorFeedback: "Advisor Feedback",
    },
    bn: {
      dashboard: "শিক্ষার্থী ড্যাশবোর্ড",
      welcome: "স্বাগতম",
      currentSemester: "বর্তমান সেমিস্টার",
      advisor: "একাডেমিক পরামর্শদাতা",
      holdsAlerts: "হোল্ড ও সতর্কতা",
      quickActions: "দ্রুত কর্ম",
      courseRegistration: "কোর্স রেজিস্ট্রেশন",
      academicHistory: "একাডেমিক ইতিহাস",
      viewRoutine: "রুটিন দেখুন",
      searchStudents: "শিক্ষার্থী খুঁজুন",
      pendingApprovals: "অনুমোদনের অপেক্ষায়",
      notifications: "বিজ্ঞ��্তি",
      academicOverview: "একাডেমিক সারসংক্ষেপ",
      completedCredits: "সম্পন্ন ক্রেডিট",
      currentCGPA: "বর্তমান সিজিপিএ",
      remainingCredits: "বাকি ক্রেডিট",
      expectedGraduation: "প্রত্যাশিত স্নাতক",
      recentActivity: "সাম্প্রতিক কার্যকলাপ",
      registrationStatus: "রেজিস্ট্রেশন অবস্থা",
      advisorApproval: "পরামর্শদাতা অনুমোদন",
      approved: "অনুমোদিত",
      pending: "অপেক্ষমাণ",
      rejected: "প্রত্যাখ্যাত",
      noHolds: "কোন সক্রিয় হোল্ড নেই",
      financialHold: "আর্থিক হোল্ড",
      disciplinaryHold: "শাস্তিমূলক হোল্ড",
      logout: "লগআউট",
      courseCode: "কোর্স কোড",
      courseName: "কোর্সের নাম",
      credits: "ক্রেডিট",
      status: "অবস্থা",
      advisorFeedback: "পরামর্শদাতার মন্তব্য",
    },
  };

  const t = texts[language];

  const handleLogout = () => {
    localStorage.removeItem("reg_user_type");
    localStorage.removeItem("reg_user_data");
    navigate("/registration");
  };

  // Sample data
  const academicStats = {
    completedCredits: 82,
    totalCredits: 144,
    currentCGPA: 3.67,
    expectedGraduation: "Spring 2025"
  };

  const pendingCourses = [
    { code: "CSE 341", name: "Microprocessors", credits: 3, status: "pending", feedback: "Waiting for prerequisite verification" },
    { code: "CSE 327", name: "Software Engineering", credits: 3, status: "approved", feedback: "Approved by advisor" },
    { code: "CSE 347", name: "Database Systems", credits: 3, status: "pending", feedback: "Under review" },
  ];

  const notifications = [
    { id: 1, message: "Course registration deadline: March 15, 2024", type: "warning", time: "2 hours ago" },
    { id: 2, message: "Dr. Jane Smith approved your CSE 327 registration", type: "success", time: "1 day ago" },
    { id: 3, message: "Midterm exam schedule published", type: "info", time: "2 days ago" },
  ];

  if (!userData) {
    return <div>Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-lavender-bg">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-2xl font-bold text-deep-plum font-poppins">
                {t.dashboard}
              </h1>
              <p className="text-gray-600 mt-1">
                {t.welcome}, {userData.name}
              </p>
            </div>

            <div className="flex items-center gap-4">
              {/* Language Toggle */}
              <div className="flex items-center bg-gray-100 rounded-lg p-1">
                <button
                  onClick={() => setLanguage("en")}
                  className={`px-3 py-1 text-sm font-medium rounded-md transition-colors ${
                    language === "en"
                      ? "bg-white text-deep-plum shadow-sm"
                      : "text-gray-600"
                  }`}
                >
                  EN
                </button>
                <button
                  onClick={() => setLanguage("bn")}
                  className={`px-3 py-1 text-sm font-medium rounded-md transition-colors ${
                    language === "bn"
                      ? "bg-white text-deep-plum shadow-sm"
                      : "text-gray-600"
                  }`}
                >
                  BN
                </button>
              </div>

              <Button
                onClick={handleLogout}
                variant="outline"
                size="sm"
                className="border-red-500 text-red-600 hover:bg-red-500 hover:text-white"
              >
                <LogOut className="w-4 h-4 mr-2" />
                {t.logout}
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Top Info Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card className="bg-white shadow-lg">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">{t.currentSemester}</p>
                  <p className="text-xl font-bold text-deep-plum">{userData.semester}</p>
                  <p className="text-sm text-gray-500">{userData.program}</p>
                </div>
                <Calendar className="w-8 h-8 text-blue-500" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white shadow-lg">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">{t.advisor}</p>
                  <p className="text-xl font-bold text-deep-plum">{userData.advisor}</p>
                  <p className="text-sm text-gray-500">CSE Department</p>
                </div>
                <User className="w-8 h-8 text-purple-500" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white shadow-lg">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">{t.holdsAlerts}</p>
                  <p className="text-xl font-bold text-green-600">{t.noHolds}</p>
                  <p className="text-sm text-gray-500">All clear</p>
                </div>
                <CheckCircle className="w-8 h-8 text-green-500" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Academic Overview */}
        <Card className="bg-white shadow-lg mb-8">
          <CardHeader>
            <CardTitle className="text-xl font-poppins text-deep-plum flex items-center gap-2">
              <BarChart3 className="w-5 h-5" />
              {t.academicOverview}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <div className="text-center">
                <div className="text-3xl font-bold text-blue-600">{academicStats.completedCredits}</div>
                <p className="text-sm text-gray-600">{t.completedCredits}</p>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-green-600">{academicStats.currentCGPA}</div>
                <p className="text-sm text-gray-600">{t.currentCGPA}</p>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-orange-600">{academicStats.totalCredits - academicStats.completedCredits}</div>
                <p className="text-sm text-gray-600">{t.remainingCredits}</p>
              </div>
              <div className="text-center">
                <div className="text-lg font-bold text-purple-600">{academicStats.expectedGraduation}</div>
                <p className="text-sm text-gray-600">{t.expectedGraduation}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* Quick Actions */}
          <Card className="bg-white shadow-lg">
            <CardHeader>
              <CardTitle className="text-xl font-poppins text-deep-plum">
                {t.quickActions}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <Button className="w-full bg-blue-600 hover:bg-blue-700 text-white">
                <BookOpen className="w-4 h-4 mr-2" />
                {t.courseRegistration}
              </Button>
              <Button className="w-full" variant="outline">
                <FileText className="w-4 h-4 mr-2" />
                {t.academicHistory}
              </Button>
              <Button className="w-full" variant="outline">
                <Calendar className="w-4 h-4 mr-2" />
                {t.viewRoutine}
              </Button>
              <Button className="w-full" variant="outline">
                <User className="w-4 h-4 mr-2" />
                {t.searchStudents}
              </Button>
            </CardContent>
          </Card>

          {/* Notifications */}
          <Card className="bg-white shadow-lg">
            <CardHeader>
              <CardTitle className="text-xl font-poppins text-deep-plum flex items-center gap-2">
                <Bell className="w-5 h-5" />
                {t.notifications}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {notifications.map((notification) => (
                  <div key={notification.id} className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
                    <div className={`p-1 rounded-full ${
                      notification.type === "success" ? "bg-green-100" :
                      notification.type === "warning" ? "bg-orange-100" : "bg-blue-100"
                    }`}>
                      {notification.type === "success" ? (
                        <CheckCircle className="w-4 h-4 text-green-600" />
                      ) : notification.type === "warning" ? (
                        <AlertCircle className="w-4 h-4 text-orange-600" />
                      ) : (
                        <Bell className="w-4 h-4 text-blue-600" />
                      )}
                    </div>
                    <div className="flex-1">
                      <p className="text-sm text-gray-800">{notification.message}</p>
                      <p className="text-xs text-gray-500 mt-1">{notification.time}</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Pending Approvals */}
        <Card className="bg-white shadow-lg">
          <CardHeader>
            <CardTitle className="text-xl font-poppins text-deep-plum flex items-center gap-2">
              <Clock className="w-5 h-5" />
              {t.pendingApprovals}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>{t.courseCode}</TableHead>
                  <TableHead>{t.courseName}</TableHead>
                  <TableHead>{t.credits}</TableHead>
                  <TableHead>{t.status}</TableHead>
                  <TableHead>{t.advisorFeedback}</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {pendingCourses.map((course, index) => (
                  <TableRow key={index}>
                    <TableCell className="font-medium">{course.code}</TableCell>
                    <TableCell>{course.name}</TableCell>
                    <TableCell>{course.credits}</TableCell>
                    <TableCell>
                      <Badge
                        variant={
                          course.status === "approved"
                            ? "default"
                            : course.status === "pending"
                            ? "secondary"
                            : "destructive"
                        }
                        className={
                          course.status === "approved"
                            ? "bg-green-100 text-green-800"
                            : course.status === "pending"
                            ? "bg-yellow-100 text-yellow-800"
                            : "bg-red-100 text-red-800"
                        }
                      >
                        {course.status === "approved"
                          ? t.approved
                          : course.status === "pending"
                          ? t.pending
                          : t.rejected}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-sm text-gray-600">
                      {course.feedback}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
