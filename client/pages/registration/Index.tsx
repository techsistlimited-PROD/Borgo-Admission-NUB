import { useState } from "react";
import { Link } from "react-router-dom";
import {
  Users,
  GraduationCap,
  BookOpen,
  Calendar,
  Award,
  Settings,
  BarChart3,
  Bell,
} from "lucide-react";
import { Button } from "../../components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../../components/ui/card";

export default function RegistrationIndex() {
  const [language, setLanguage] = useState<"en" | "bn">("en");

  const texts = {
    en: {
      title: "University Registration & Advising System",
      subtitle: "Comprehensive Student Registration Management",
      studentPortal: "Student Portal",
      studentDesc: "Course registration, academic history, and advisor communication",
      advisorPortal: "Advisor/Teacher Portal", 
      advisorDesc: "Student advising, registration approval, and teaching load management",
      adminPortal: "Admin/ACAD Portal",
      adminDesc: "Complete system administration and academic management",
      loginToAccess: "Login to Access",
      totalStudents: "Active Students",
      totalCourses: "Courses Offered",
      totalAdvisors: "Active Advisors",
      pendingApprovals: "Pending Approvals",
      features: "Key Features",
      courseRegistration: "Course Registration",
      advisorApproval: "Advisor Approval System",
      academicHistory: "Academic History Tracking",
      scheduleManagement: "Schedule Management",
      getStarted: "Get Started",
      selectRole: "Select your role to continue:",
    },
    bn: {
      title: "বিশ্ববিদ্যালয় রেজিস্ট্রেশন ও পরামর্শ সিস্টেম",
      subtitle: "সার্বিক শিক্ষার্থী রেজিস্ট্রেশন ব্যবস্থাপনা",
      studentPortal: "শিক্ষার্থী পোর্টাল",
      studentDesc: "কোর্স রেজিস্ট্রেশন, একাডেমিক ইতিহাস এবং পরামর্শদাতা যোগাযোগ",
      advisorPortal: "পরামর্শদাতা/শিক্ষক পোর্টাল",
      advisorDesc: "শিক্ষার্থী পরামর্শ, রেজিস্ট্রেশন অনুমোদন এবং শিক্ষণ দায়িত্ব ব্যবস্থাপনা",
      adminPortal: "অ্যাডমিন/ACAD পোর্টাল",
      adminDesc: "সম্পূর্ণ সিস্টেম প্রশাসন এবং একাডেমিক ব্যবস্থাপনা",
      loginToAccess: "প্রবেশের জন্য লগইন করুন",
      totalStudents: "সক্রিয় শিক্ষার্থী",
      totalCourses: "কোর্স অফার",
      totalAdvisors: "সক্রিয় পরামর্শদাতা",
      pendingApprovals: "অনুমোদনের অপেক্ষায়",
      features: "মূল বৈশিষ্ট্য",
      courseRegistration: "কোর্স রেজিস্ট্রেশন",
      advisorApproval: "পরামর্শদাতা অনুমোদন সিস্টেম",
      academicHistory: "একাডেমিক ইতিহাস ট্র্যাকিং",
      scheduleManagement: "সময়সূচী ব্যবস্থাপনা",
      getStarted: "শুরু করুন",
      selectRole: "চালিয়ে যেতে আপনার ভূমিকা নির্বাচন করুন:",
    },
  };

  const t = texts[language];

  const stats = [
    { label: t.totalStudents, value: "2,847", icon: Users, color: "bg-blue-100 text-blue-800" },
    { label: t.totalCourses, value: "156", icon: BookOpen, color: "bg-green-100 text-green-800" },
    { label: t.totalAdvisors, value: "89", icon: GraduationCap, color: "bg-purple-100 text-purple-800" },
    { label: t.pendingApprovals, value: "23", icon: Bell, color: "bg-orange-100 text-orange-800" },
  ];

  const portals = [
    {
      title: t.studentPortal,
      description: t.studentDesc,
      icon: Users,
      link: "/registration/student-login",
      color: "from-blue-500 to-blue-600",
      features: ["Course Registration", "Academic History", "Advisor Communication", "Grade Tracking"]
    },
    {
      title: t.advisorPortal,
      description: t.advisorDesc,
      icon: GraduationCap,
      link: "/registration/advisor-login",
      color: "from-purple-500 to-purple-600",
      features: ["Student Management", "Registration Approval", "Teaching Load", "Performance Reports"]
    },
    {
      title: t.adminPortal,
      description: t.adminDesc,
      icon: Settings,
      link: "/registration/admin-login",
      color: "from-deep-plum to-accent-purple",
      features: ["System Administration", "Course Management", "Schedule Control", "Reports"]
    },
  ];

  return (
    <div className="min-h-screen bg-lavender-bg">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex justify-between items-center">
            <div>
              <Link to="/" className="flex items-center space-x-3 mb-4">
                <div className="w-10 h-10 bg-deep-plum rounded-lg flex items-center justify-center">
                  <span className="text-white font-bold text-lg">NU</span>
                </div>
                <div className="font-poppins font-semibold text-deep-plum text-lg">
                  Northern University Bangladesh
                </div>
              </Link>
              <h1 className="text-3xl font-bold text-deep-plum font-poppins">
                {t.title}
              </h1>
              <p className="text-gray-600 mt-2">{t.subtitle}</p>
            </div>

            {/* Language Toggle */}
            <div className="flex items-center bg-white rounded-lg p-1 shadow-sm border">
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

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {stats.map((stat, index) => (
            <Card key={index} className="bg-white shadow-lg">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">
                      {stat.label}
                    </p>
                    <p className="text-3xl font-bold text-deep-plum">
                      {stat.value}
                    </p>
                  </div>
                  <div className={`p-3 rounded-full ${stat.color}`}>
                    <stat.icon className="w-6 h-6" />
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Portal Selection */}
        <div className="mb-12">
          <div className="text-center mb-8">
            <h2 className="text-2xl font-bold text-deep-plum font-poppins mb-2">
              {t.getStarted}
            </h2>
            <p className="text-gray-600">{t.selectRole}</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {portals.map((portal, index) => (
              <Card key={index} className="bg-white shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
                <CardHeader>
                  <div className={`w-16 h-16 rounded-lg bg-gradient-to-r ${portal.color} flex items-center justify-center mx-auto mb-4`}>
                    <portal.icon className="w-8 h-8 text-white" />
                  </div>
                  <CardTitle className="text-xl font-poppins text-deep-plum text-center">
                    {portal.title}
                  </CardTitle>
                </CardHeader>
                <CardContent className="text-center">
                  <p className="text-gray-600 mb-6">{portal.description}</p>
                  
                  <div className="space-y-2 mb-6">
                    {portal.features.map((feature, featureIndex) => (
                      <div key={featureIndex} className="flex items-center text-sm text-gray-500">
                        <div className="w-2 h-2 bg-deep-plum rounded-full mr-2"></div>
                        {feature}
                      </div>
                    ))}
                  </div>

                  <Link to={portal.link}>
                    <Button className={`w-full bg-gradient-to-r ${portal.color} hover:opacity-90 text-white`}>
                      {t.loginToAccess}
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Features Section */}
        <Card className="bg-white shadow-lg">
          <CardHeader>
            <CardTitle className="text-2xl font-poppins text-deep-plum text-center">
              {t.features}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {[
                { icon: BookOpen, title: t.courseRegistration, desc: "Easy course selection and registration" },
                { icon: Award, title: t.advisorApproval, desc: "Streamlined approval workflow" },
                { icon: BarChart3, title: t.academicHistory, desc: "Comprehensive grade tracking" },
                { icon: Calendar, title: t.scheduleManagement, desc: "Automated timetable generation" },
              ].map((feature, index) => (
                <div key={index} className="text-center">
                  <div className="w-12 h-12 bg-deep-plum/10 rounded-lg flex items-center justify-center mx-auto mb-3">
                    <feature.icon className="w-6 h-6 text-deep-plum" />
                  </div>
                  <h3 className="font-semibold text-deep-plum mb-2">{feature.title}</h3>
                  <p className="text-sm text-gray-600">{feature.desc}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
