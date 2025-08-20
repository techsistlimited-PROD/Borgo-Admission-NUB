import { useState } from "react";
import {
  Download,
  BarChart3,
  Users,
  TrendingUp,
  Calendar,
  Filter,
  FileText,
  Shield,
  IdCard,
  Target,
  MapPin,
  CreditCard,
  BookOpen,
  Archive,
  School,
  GraduationCap,
  Building,
  DollarSign,
  UserCheck,
  CheckCircle,
  Eye,
  DownloadCloud,
  Package,
} from "lucide-react";
import { Button } from "../components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../components/ui/card";
import { Input } from "../components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../components/ui/table";
import { getIDGenerationStats, sampleStudentIDs } from "../lib/idGeneration";

export default function Reports() {
  const [language, setLanguage] = useState<"en" | "bn">("en");
  const [dateRange, setDateRange] = useState("last_30_days");
  const [selectedProgram, setSelectedProgram] = useState("all");
  const [selectedDepartment, setSelectedDepartment] = useState("all");
  const [selectedSemester, setSelectedSemester] = useState("spring_2024");
  const [selectedYear, setSelectedYear] = useState("2024");
  const [activeReportCategory, setActiveReportCategory] = useState("overview");

  const texts = {
    en: {
      title: "Reports & Analytics",
      subtitle: "Comprehensive Admission Reports and Insights",
      dateRange: "Date Range",
      program: "Program",
      department: "Department",
      semester: "Semester",
      year: "Year",
      generateReport: "Generate Report",
      exportPDF: "Export PDF",
      downloadReport: "Download Report",
      viewReport: "View Report",
      last7Days: "Last 7 Days",
      last30Days: "Last 30 Days",
      last3Months: "Last 3 Months",
      lastYear: "Last Year",
      custom: "Custom Range",
      allPrograms: "All Programs",
      allDepartments: "All Departments",
      spring2024: "Spring 2024",
      fall2024: "Fall 2024",
      summer2024: "Summer 2024",

      // Report Categories
      reportCategories: "Report Categories",
      overview: "Overview",
      studentReports: "Student Reports",
      admissionFlowcharts: "Admission Flowcharts",
      financialReports: "Financial Reports",
      waiverReports: "Waiver Reports",
      idCardReports: "ID Card Reports",
      targetReports: "Target Reports",

      // Overview Reports
      totalApplications: "Total Applications",
      admittedStudents: "Admitted Students",
      rejectedApplications: "Rejected Applications",
      pendingApplications: "Pending Applications",
      departmentWiseAdmissions: "Department-wise Admissions",
      monthlyTrends: "Monthly Application Trends",
      admissionRate: "Admission Rate",
      averageProcessingTime: "Average Processing Time",
      topPerformingDepartments: "Top Performing Departments",
      revenueGenerated: "Revenue Generated",

      // New Report Types
      programWiseAdmissions:
        "Program-wise Number of Admitted Students per Semester",
      employeeWiseCollection: "Employee-wise Admission Fee Collection",
      dailyCollectionReport: "Daily Collection Report of Admission Officers",
      semesterWiseAdmissions: "Semester-wise Number of Admitted Students",
      programWiseFlowchart: "Program-wise Admission Flowchart",
      yearWiseAdmissionReport: "Year-wise Admission Report",
      departmentWiseTargets:
        "Department-wise Admission Target Input and View Report",
      feederDistricts: "List of Feeder Districts",
      studentList: "Student List",
      detailedStudentList: "Detailed Student List",
      studentIdCards: "Student ID Cards",
      bulkIdCardDownload: "All Students ID Cards Download (Bulk)",
      studentRequiredCredits: "Student Required Credits",
      studentWaiverReport: "Student Waiver Report (Department-wise)",
      previousSemesterFlowchart:
        "Department-wise Admission Flowchart for Previous Semester",
      creditTransferStudentList: "Credit Transfer Student List",

      // Table Headers
      serial: "Serial",
      programName: "Program Name",
      male: "Male",
      female: "Female",
      total: "Total",
      employeeName: "Employee Name",
      employeeId: "Employee ID",
      collectionAmount: "Collection Amount",
      date: "Date",
      officerId: "Officer ID",
      dailyCollection: "Daily Collection",
      targetSet: "Target Set",
      achieved: "Achieved",
      percentage: "Percentage",
      districtName: "District",
      studentsFromDistrict: "Students from District",
      studentId: "Student ID",
      creditsRequired: "Credits Required",
      creditsCompleted: "Credits Completed",
      waiverAmount: "Waiver Amount",
      waiverPercentage: "Waiver Percentage",

      // Departments
      departmentColumn: "Department",
      applications: "Applications",
      admitted: "Admitted",
      rate: "Rate",
      cse: "Computer Science & Engineering",
      eee: "Electrical & Electronic Engineering",
      mech: "Mechanical Engineering",
      civil: "Civil Engineering",
      textile: "Textile Engineering",
      bba: "Business Administration",
      law: "Law",
      architecture: "Architecture",
      pharmacy: "Pharmacy",
      english: "English",

      days: "days",
      studentIdStats: "Student ID Statistics",
      universityIds: "University IDs Generated",
      ugcIds: "UGC IDs Generated",
      activeStudents: "Active Students",
      idGenerationRate: "ID Generation Rate",
      recentlyGenerated: "Recently Generated IDs",
      universityId: "University ID",
      ugcId: "UGC ID",
      studentName: "Student Name",
      generatedDate: "Generated Date",
      status: "Status",
      active: "Active",
      viewDetails: "View Details",
    },
    bn: {
      title: "রিপোর্ট ও বিশ্লেষণ",
      subtitle: "সার্বিক ভর্তি রিপোর্ট এবং অন্তর্দৃষ্টি",
      dateRange: "তারিখের পরিসীমা",
      program: "প্রোগ্রাম",
      department: "বিভাগ",
      semester: "সেমিস্টার",
      year: "বছর",
      generateReport: "রিপোর্ট তৈরি করুন",
      exportPDF: "পিডিএফ এক্সপোর্ট",
      downloadReport: "রিপোর্ট ডাউনলোড",
      viewReport: "রিপোর্ট দেখুন",
      last7Days: "গত ৭ দিন",
      last30Days: "গত ৩০ দিন",
      last3Months: "গত ৩ মাস",
      lastYear: "গত বছর",
      custom: "কাস্টম রেঞ্জ",
      allPrograms: "সব প্রোগ্রাম",
      allDepartments: "সব বিভাগ",
      spring2024: "বসন্ত ২০২৪",
      fall2024: "শরৎ ২০২৪",
      summer2024: "গ্রীষ্ম ২০২৪",

      // Report Categories
      reportCategories: "রিপোর্ট বিভাগসমূহ",
      overview: "সারসংক্ষেপ",
      studentReports: "শিক্ষার্থী রিপোর্ট",
      admissionFlowcharts: "ভর্তি ফ্লোচার্ট",
      financialReports: "আর্থিক রিপোর্ট",
      waiverReports: "মওকুফ রিপোর্ট",
      idCardReports: "আইডি কার্ড রিপোর্ট",
      targetReports: "লক্ষ্য রিপোর্ট",

      totalApplications: "মোট আবেদন",
      admittedStudents: "ভর্তিকৃত শিক্ষার্থী",
      rejectedApplications: "প্রত্যাখ্যাত আবেদন",
      pendingApplications: "অপেক্ষমাণ আবেদন",
      departmentWiseAdmissions: "বিভাগ অনুযায়ী ভর্তি",
      monthlyTrends: "মাসিক আবেদনের প্রবণতা",
      admissionRate: "ভর্তির হার",
      averageProcessingTime: "গড় প্রক্রিয়াকরণ সময়",
      topPerformingDepartments: "সেরা পারফরম্যান্স বিভাগ",
      revenueGenerated: "আয় সৃষ্টি",

      // New Report Types
      programWiseAdmissions:
        "প্রোগ্রাম অনুযায়ী সেমিস্টার প্রতি ভর্তিকৃত শিক্ষার্থীর সংখ্যা",
      employeeWiseCollection: "কর্মচারী অনুযায়ী ভর্তি ফি সংগ্রহ",
      dailyCollectionReport: "ভর্তি কর্মকর্তাদের দৈনিক সংগ্রহ রিপোর্ট",
      semesterWiseAdmissions: "সেমিস্টার অনুযায়ী ভর্তিকৃত শিক্ষার্থীর সংখ্যা",
      programWiseFlowchart: "প্রোগ্রাম অনুযায়ী ভর্তি ফ্লোচার্ট",
      yearWiseAdmissionReport: "বছর অনুযায়ী ভর্তি রিপোর্ট",
      departmentWiseTargets: "বিভাগ অনুযায়ী ভর্তি লক্ষ্য ইনপুট ও ভিউ রিপোর্ট",
      feederDistricts: "ফিডার জেলার তালিকা",
      studentList: "শি���্ষার্থীর তালিকা",
      detailedStudentList: "বিস্তারিত শিক্ষার্থীর তালিকা",
      studentIdCards: "শিক্ষার্থী আইডি কার্ড",
      bulkIdCardDownload: "সকল শিক্ষার্থীর আইডি কার্ড ডাউনলোড (বাল্ক)",
      studentRequiredCredits: "শিক্ষার্থীর প্রয়োজনীয় ক্রেডিট",
      studentWaiverReport: "শিক্ষার্থী মওকুফ রিপোর্ট (বিভাগ অনুযায়ী)",
      previousSemesterFlowchart:
        "পূর্ববর্তী সেমিস্টারের জন্য বিভাগ অনুযায়ী ভর্তি ফ্লোচার্ট",
      creditTransferStudentList: "ক্রেডিট ট্রান্সফার শিক্ষার্থীর তালিকা",

      departmentColumn: "বিভাগ",
      applications: "আবেদন",
      admitted: "ভর্তি",
      rate: "হার",
      cse: "কম্পিউটার সায়েন্স ও ইঞ্জিনিয়ারিং",
      eee: "ইলেকট্রিক্যাল ও ই���েকট্রনিক ইঞ্জিনিয়ারিং",
      mech: "মেকানিক্যাল ইঞ্জিনিয়ারিং",
      civil: "সিভিল ইঞ্জিনিয়ারিং",
      textile: "টেক্সটাইল ইঞ্জিনিয়ারিং",
      bba: "ব্যবসায় প্রশাসন",
      law: "আইন",
      architecture: "স্থাপত্য",
      pharmacy: "ফার্মেসি",
      english: "ইংরেজি",
      days: "দিন",
      studentIdStats: "শিক্ষার্থী আইডি পরিসংখ্যান",
      universityIds: "বিশ্ববিদ্যালয় আইডি তৈরি",
      ugcIds: "ইউজিসি আইডি তৈরি",
      activeStudents: "সক্রিয় শিক্ষার্থী",
      idGenerationRate: "আইডি তৈরির হার",
      recentlyGenerated: "সম্প্রতি তৈরি আইডি",
      universityId: "বিশ্ববিদ্যালয় আইডি",
      ugcId: "ইউজিসি আইডি",
      studentName: "শিক্ষার্থীর নাম",
      generatedDate: "তৈরির তারিখ",
      status: "অবস্থা",
      active: "সক্রিয়",
      viewDetails: "বিস্তারিত দেখুন",
    },
  };

  const t = texts[language];

  const kpiData = [
    {
      label: t.totalApplications,
      value: 1234,
      change: "+12%",
      color: "bg-blue-100 text-blue-800",
      icon: Users,
    },
    {
      label: t.admittedStudents,
      value: 856,
      change: "+8%",
      color: "bg-green-100 text-green-800",
      icon: TrendingUp,
    },
    {
      label: t.rejectedApplications,
      value: 234,
      change: "-3%",
      color: "bg-red-100 text-red-800",
      icon: Users,
    },
    {
      label: t.pendingApplications,
      value: 144,
      change: "+15%",
      color: "bg-yellow-100 text-yellow-800",
      icon: Users,
    },
  ];

  const departmentData = [
    { department: t.cse, applications: 245, admitted: 189, rate: "77%" },
    { department: t.eee, applications: 198, admitted: 156, rate: "79%" },
    { department: t.mech, applications: 167, admitted: 123, rate: "74%" },
    { department: t.civil, applications: 189, admitted: 134, rate: "71%" },
    { department: t.textile, applications: 134, admitted: 98, rate: "73%" },
    { department: t.bba, applications: 301, admitted: 156, rate: "52%" },
  ];

  const monthlyTrends = [
    { month: "Jan", applications: 145, admitted: 89 },
    { month: "Feb", applications: 198, admitted: 134 },
    { month: "Mar", applications: 234, admitted: 167 },
    { month: "Apr", applications: 189, admitted: 145 },
    { month: "May", applications: 167, admitted: 123 },
    { month: "Jun", applications: 201, admitted: 156 },
  ];

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
            <div className="flex items-center gap-4">
              <Button className="bg-deep-plum hover:bg-accent-purple">
                <Download className="w-4 h-4 mr-2" />
                {t.exportPDF}
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

        {/* Report Categories Navigation */}
        <Card className="bg-white shadow-lg mb-8">
          <CardContent className="p-6">
            <h3 className="text-lg font-semibold text-deep-plum mb-4">
              {t.reportCategories}
            </h3>
            <div className="flex flex-wrap gap-2 mb-6">
              {[
                { id: "overview", label: t.overview, icon: BarChart3 },
                { id: "student", label: t.studentReports, icon: Users },
                {
                  id: "flowcharts",
                  label: t.admissionFlowcharts,
                  icon: TrendingUp,
                },
                {
                  id: "financial",
                  label: t.financialReports,
                  icon: DollarSign,
                },
                { id: "waiver", label: t.waiverReports, icon: BookOpen },
                { id: "idcards", label: t.idCardReports, icon: IdCard },
                { id: "targets", label: t.targetReports, icon: Target },
              ].map((category) => (
                <Button
                  key={category.id}
                  variant={
                    activeReportCategory === category.id ? "default" : "outline"
                  }
                  size="sm"
                  onClick={() => setActiveReportCategory(category.id)}
                  className={`${
                    activeReportCategory === category.id
                      ? "bg-deep-plum text-white"
                      : "text-deep-plum border-deep-plum hover:bg-deep-plum hover:text-white"
                  }`}
                >
                  <category.icon className="w-4 h-4 mr-2" />
                  {category.label}
                </Button>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Filters */}
        <Card className="bg-white shadow-lg mb-8">
          <CardContent className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">{t.dateRange}</label>
                <Select value={dateRange} onValueChange={setDateRange}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="last_7_days">{t.last7Days}</SelectItem>
                    <SelectItem value="last_30_days">{t.last30Days}</SelectItem>
                    <SelectItem value="last_3_months">
                      {t.last3Months}
                    </SelectItem>
                    <SelectItem value="last_year">{t.lastYear}</SelectItem>
                    <SelectItem value="custom">{t.custom}</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">{t.program}</label>
                <Select
                  value={selectedProgram}
                  onValueChange={setSelectedProgram}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">{t.allPrograms}</SelectItem>
                    <SelectItem value="undergraduate">Undergraduate</SelectItem>
                    <SelectItem value="graduate">Graduate</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">{t.department}</label>
                <Select
                  value={selectedDepartment}
                  onValueChange={setSelectedDepartment}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">{t.allDepartments}</SelectItem>
                    <SelectItem value="cse">{t.cse}</SelectItem>
                    <SelectItem value="eee">{t.eee}</SelectItem>
                    <SelectItem value="mech">{t.mech}</SelectItem>
                    <SelectItem value="civil">{t.civil}</SelectItem>
                    <SelectItem value="bba">{t.bba}</SelectItem>
                    <SelectItem value="law">{t.law}</SelectItem>
                    <SelectItem value="architecture">
                      {t.architecture}
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">{t.semester}</label>
                <Select
                  value={selectedSemester}
                  onValueChange={setSelectedSemester}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="spring_2024">{t.spring2024}</SelectItem>
                    <SelectItem value="fall_2024">{t.fall2024}</SelectItem>
                    <SelectItem value="summer_2024">{t.summer2024}</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="flex items-end">
                <Button className="bg-deep-plum hover:bg-accent-purple w-full">
                  <Filter className="w-4 h-4 mr-2" />
                  {t.generateReport}
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* KPI Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {kpiData.map((kpi, index) => (
            <Card key={index} className="bg-white shadow-lg">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">
                      {kpi.label}
                    </p>
                    <p className="text-3xl font-bold text-deep-plum">
                      {kpi.value}
                    </p>
                    <p className="text-sm text-green-600 font-medium">
                      {kpi.change}
                    </p>
                  </div>
                  <div className={`p-3 rounded-full ${kpi.color}`}>
                    <kpi.icon className="w-6 h-6" />
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Dynamic Report Content Based on Selected Category */}
        {activeReportCategory === "overview" && (
          <>
            {/* Student ID Generation Statistics */}
            <Card className="bg-gradient-to-r from-blue-50 to-blue-100 border-blue-200 mb-8">
              <CardHeader>
                <CardTitle className="text-xl font-poppins text-blue-800 flex items-center gap-2">
                  <Shield className="w-5 h-5" />
                  {t.studentIdStats}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
                  <div className="bg-white p-4 rounded-lg">
                    <div className="flex items-center gap-3">
                      <IdCard className="w-8 h-8 text-blue-600" />
                      <div>
                        <p className="text-sm text-gray-600">
                          {t.universityIds}
                        </p>
                        <p className="text-2xl font-bold text-blue-800">
                          {getIDGenerationStats().totalGenerated}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="bg-white p-4 rounded-lg">
                    <div className="flex items-center gap-3">
                      <Shield className="w-8 h-8 text-purple-600" />
                      <div>
                        <p className="text-sm text-gray-600">{t.ugcIds}</p>
                        <p className="text-2xl font-bold text-purple-800">
                          {getIDGenerationStats().totalGenerated}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="bg-white p-4 rounded-lg">
                    <div className="flex items-center gap-3">
                      <Users className="w-8 h-8 text-green-600" />
                      <div>
                        <p className="text-sm text-gray-600">
                          {t.activeStudents}
                        </p>
                        <p className="text-2xl font-bold text-green-800">
                          {getIDGenerationStats().activeStudents}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="bg-white p-4 rounded-lg">
                    <div className="flex items-center gap-3">
                      <TrendingUp className="w-8 h-8 text-orange-600" />
                      <div>
                        <p className="text-sm text-gray-600">
                          {t.idGenerationRate}
                        </p>
                        <p className="text-2xl font-bold text-orange-800">
                          98.5%
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Recently Generated IDs Table */}
                <div className="bg-white rounded-lg">
                  <div className="p-4 border-b border-gray-200">
                    <h3 className="font-semibold text-gray-800">
                      {t.recentlyGenerated}
                    </h3>
                  </div>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>{t.universityId}</TableHead>
                        <TableHead>UGC ID (Admin)</TableHead>
                        <TableHead>{t.studentName}</TableHead>
                        <TableHead>{t.generatedDate}</TableHead>
                        <TableHead>{t.status}</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {sampleStudentIDs.slice(0, 5).map((student, index) => (
                        <TableRow key={index}>
                          <TableCell className="font-mono font-medium text-blue-700">
                            {student.universityId}
                          </TableCell>
                          <TableCell className="font-mono text-purple-700 text-sm">
                            {student.ugcId}
                          </TableCell>
                          <TableCell>{student.studentName}</TableCell>
                          <TableCell>
                            {new Date(
                              student.generatedDate,
                            ).toLocaleDateString()}
                          </TableCell>
                          <TableCell>
                            <span
                              className={`px-2 py-1 text-xs rounded-full ${
                                student.isActive
                                  ? "bg-green-100 text-green-800"
                                  : "bg-red-100 text-red-800"
                              }`}
                            >
                              {student.isActive ? t.active : "Inactive"}
                            </span>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
            </Card>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
              {/* Department-wise Admissions */}
              <Card className="bg-white shadow-lg">
                <CardHeader>
                  <CardTitle className="text-xl font-poppins text-deep-plum flex items-center gap-2">
                    <BarChart3 className="w-5 h-5" />
                    {t.departmentWiseAdmissions}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>{t.departmentColumn}</TableHead>
                        <TableHead>{t.applications}</TableHead>
                        <TableHead>{t.admitted}</TableHead>
                        <TableHead>{t.rate}</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {departmentData.map((dept, index) => (
                        <TableRow key={index}>
                          <TableCell className="font-medium">
                            {dept.department}
                          </TableCell>
                          <TableCell>{dept.applications}</TableCell>
                          <TableCell>{dept.admitted}</TableCell>
                          <TableCell>
                            <span className="font-semibold text-green-600">
                              {dept.rate}
                            </span>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>

              {/* Monthly Trends */}
              <Card className="bg-white shadow-lg">
                <CardHeader>
                  <CardTitle className="text-xl font-poppins text-deep-plum flex items-center gap-2">
                    <TrendingUp className="w-5 h-5" />
                    {t.monthlyTrends}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {monthlyTrends.map((month, index) => (
                      <div
                        key={index}
                        className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                      >
                        <span className="font-medium">{month.month}</span>
                        <div className="flex gap-4 text-sm">
                          <span className="text-blue-600">
                            Applied: {month.applications}
                          </span>
                          <span className="text-green-600">
                            Admitted: {month.admitted}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Additional Metrics */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card className="bg-white shadow-lg">
                <CardHeader>
                  <CardTitle className="text-lg font-poppins text-deep-plum">
                    {t.admissionRate}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-center">
                    <div className="text-4xl font-bold text-accent-purple">
                      69%
                    </div>
                    <p className="text-sm text-gray-600 mt-1">
                      Overall admission rate
                    </p>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-white shadow-lg">
                <CardHeader>
                  <CardTitle className="text-lg font-poppins text-deep-plum">
                    {t.averageProcessingTime}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-center">
                    <div className="text-4xl font-bold text-accent-purple">
                      7
                    </div>
                    <p className="text-sm text-gray-600 mt-1">{t.days}</p>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-white shadow-lg">
                <CardHeader>
                  <CardTitle className="text-lg font-poppins text-deep-plum">
                    {t.revenueGenerated}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-center">
                    <div className="text-4xl font-bold text-accent-purple">
                      ৳89L
                    </div>
                    <p className="text-sm text-gray-600 mt-1">This semester</p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </>
        )}

        {/* Student Reports Category */}
        {activeReportCategory === "student" && (
          <div className="space-y-6">
            <Card className="bg-white shadow-lg">
              <CardHeader>
                <CardTitle className="text-xl font-poppins text-deep-plum flex items-center gap-2">
                  <Users className="w-5 h-5" />
                  Student Reports
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {[
                    {
                      title: t.programWiseAdmissions,
                      description:
                        "Serial – Program Name – Male – Female – Total",
                      icon: GraduationCap,
                      action: "view",
                    },
                    {
                      title: t.semesterWiseAdmissions,
                      description: "Total students admitted by semester",
                      icon: Calendar,
                      action: "view",
                    },
                    {
                      title: t.studentList,
                      description: "Complete list of all students",
                      icon: Users,
                      action: "view",
                    },
                    {
                      title: t.detailedStudentList,
                      description: "Comprehensive student information",
                      icon: FileText,
                      action: "view",
                    },
                    {
                      title: t.creditTransferStudentList,
                      description: "List of credit transfer students",
                      icon: Archive,
                      action: "view",
                    },
                    {
                      title: t.feederDistricts,
                      description: "Districts with most students",
                      icon: MapPin,
                      action: "view",
                    },
                  ].map((report, index) => (
                    <Card
                      key={index}
                      className="border border-gray-200 hover:border-deep-plum transition-colors"
                    >
                      <CardContent className="p-4">
                        <div className="flex items-start gap-3">
                          <div className="p-2 bg-deep-plum/10 rounded-lg">
                            <report.icon className="w-5 h-5 text-deep-plum" />
                          </div>
                          <div className="flex-1">
                            <h4 className="font-semibold text-sm text-deep-plum mb-1">
                              {report.title}
                            </h4>
                            <p className="text-xs text-gray-600 mb-3">
                              {report.description}
                            </p>
                            <div className="flex gap-2">
                              <Button
                                size="sm"
                                variant="outline"
                                className="text-xs"
                              >
                                <Eye className="w-3 h-3 mr-1" />
                                {t.viewReport}
                              </Button>
                              <Button
                                size="sm"
                                variant="outline"
                                className="text-xs"
                              >
                                <Download className="w-3 h-3 mr-1" />
                                {t.downloadReport}
                              </Button>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Financial Reports Category */}
        {activeReportCategory === "financial" && (
          <div className="space-y-6">
            <Card className="bg-white shadow-lg">
              <CardHeader>
                <CardTitle className="text-xl font-poppins text-deep-plum flex items-center gap-2">
                  <DollarSign className="w-5 h-5" />
                  Financial Reports
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {[
                    {
                      title: t.employeeWiseCollection,
                      description: "Collection performance by employee",
                      icon: UserCheck,
                      action: "view",
                    },
                    {
                      title: t.dailyCollectionReport,
                      description:
                        "View daily collection by admission officers (ID-wise)",
                      icon: Calendar,
                      action: "view",
                    },
                  ].map((report, index) => (
                    <Card
                      key={index}
                      className="border border-gray-200 hover:border-deep-plum transition-colors"
                    >
                      <CardContent className="p-4">
                        <div className="flex items-start gap-3">
                          <div className="p-2 bg-green-100 rounded-lg">
                            <report.icon className="w-5 h-5 text-green-600" />
                          </div>
                          <div className="flex-1">
                            <h4 className="font-semibold text-sm text-deep-plum mb-1">
                              {report.title}
                            </h4>
                            <p className="text-xs text-gray-600 mb-3">
                              {report.description}
                            </p>
                            <div className="flex gap-2">
                              <Button
                                size="sm"
                                variant="outline"
                                className="text-xs"
                              >
                                <Eye className="w-3 h-3 mr-1" />
                                {t.viewReport}
                              </Button>
                              <Button
                                size="sm"
                                variant="outline"
                                className="text-xs"
                              >
                                <Download className="w-3 h-3 mr-1" />
                                {t.downloadReport}
                              </Button>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* ID Card Reports Category */}
        {activeReportCategory === "idcards" && (
          <div className="space-y-6">
            <Card className="bg-white shadow-lg">
              <CardHeader>
                <CardTitle className="text-xl font-poppins text-deep-plum flex items-center gap-2">
                  <IdCard className="w-5 h-5" />
                  ID Card Management
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {[
                    {
                      title: t.studentIdCards,
                      description: "Individual student ID card generation",
                      icon: IdCard,
                      action: "view",
                    },
                    {
                      title: t.bulkIdCardDownload,
                      description:
                        "Download all student ID cards for selected semester/program in one click",
                      icon: Package,
                      action: "download",
                    },
                  ].map((report, index) => (
                    <Card
                      key={index}
                      className="border border-gray-200 hover:border-deep-plum transition-colors"
                    >
                      <CardContent className="p-4">
                        <div className="flex items-start gap-3">
                          <div className="p-2 bg-purple-100 rounded-lg">
                            <report.icon className="w-5 h-5 text-purple-600" />
                          </div>
                          <div className="flex-1">
                            <h4 className="font-semibold text-sm text-deep-plum mb-1">
                              {report.title}
                            </h4>
                            <p className="text-xs text-gray-600 mb-3">
                              {report.description}
                            </p>
                            <div className="flex gap-2">
                              <Button
                                size="sm"
                                variant="outline"
                                className="text-xs"
                              >
                                <Eye className="w-3 h-3 mr-1" />
                                {t.viewReport}
                              </Button>
                              <Button
                                size="sm"
                                className="text-xs bg-deep-plum hover:bg-accent-purple"
                              >
                                <DownloadCloud className="w-3 h-3 mr-1" />
                                {report.action === "download"
                                  ? "Bulk Download"
                                  : "Download"}
                              </Button>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Waiver Reports Category */}
        {activeReportCategory === "waiver" && (
          <div className="space-y-6">
            <Card className="bg-white shadow-lg">
              <CardHeader>
                <CardTitle className="text-xl font-poppins text-deep-plum flex items-center gap-2">
                  <BookOpen className="w-5 h-5" />
                  Waiver Reports
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {[
                    {
                      title: t.studentWaiverReport,
                      description: "Waiver details by department",
                      icon: BookOpen,
                      action: "view",
                    },
                    {
                      title: t.studentRequiredCredits,
                      description: "Credit requirements and completion status",
                      icon: GraduationCap,
                      action: "view",
                    },
                  ].map((report, index) => (
                    <Card
                      key={index}
                      className="border border-gray-200 hover:border-deep-plum transition-colors"
                    >
                      <CardContent className="p-4">
                        <div className="flex items-start gap-3">
                          <div className="p-2 bg-orange-100 rounded-lg">
                            <report.icon className="w-5 h-5 text-orange-600" />
                          </div>
                          <div className="flex-1">
                            <h4 className="font-semibold text-sm text-deep-plum mb-1">
                              {report.title}
                            </h4>
                            <p className="text-xs text-gray-600 mb-3">
                              {report.description}
                            </p>
                            <div className="flex gap-2">
                              <Button
                                size="sm"
                                variant="outline"
                                className="text-xs"
                              >
                                <Eye className="w-3 h-3 mr-1" />
                                {t.viewReport}
                              </Button>
                              <Button
                                size="sm"
                                variant="outline"
                                className="text-xs"
                              >
                                <Download className="w-3 h-3 mr-1" />
                                {t.downloadReport}
                              </Button>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Flowcharts Category */}
        {activeReportCategory === "flowcharts" && (
          <div className="space-y-6">
            <Card className="bg-white shadow-lg">
              <CardHeader>
                <CardTitle className="text-xl font-poppins text-deep-plum flex items-center gap-2">
                  <TrendingUp className="w-5 h-5" />
                  Admission Flowcharts
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {[
                    {
                      title: t.programWiseFlowchart,
                      description:
                        "Visual flowchart of admission process by program",
                      icon: TrendingUp,
                      action: "view",
                    },
                    {
                      title: t.previousSemesterFlowchart,
                      description:
                        "Department-wise admission flowchart for previous semester",
                      icon: Building,
                      action: "view",
                    },
                    {
                      title: t.yearWiseAdmissionReport,
                      description: "Annual admission trends and statistics",
                      icon: Calendar,
                      action: "view",
                    },
                  ].map((report, index) => (
                    <Card
                      key={index}
                      className="border border-gray-200 hover:border-deep-plum transition-colors"
                    >
                      <CardContent className="p-4">
                        <div className="flex items-start gap-3">
                          <div className="p-2 bg-blue-100 rounded-lg">
                            <report.icon className="w-5 h-5 text-blue-600" />
                          </div>
                          <div className="flex-1">
                            <h4 className="font-semibold text-sm text-deep-plum mb-1">
                              {report.title}
                            </h4>
                            <p className="text-xs text-gray-600 mb-3">
                              {report.description}
                            </p>
                            <div className="flex gap-2">
                              <Button
                                size="sm"
                                variant="outline"
                                className="text-xs"
                              >
                                <Eye className="w-3 h-3 mr-1" />
                                {t.viewReport}
                              </Button>
                              <Button
                                size="sm"
                                variant="outline"
                                className="text-xs"
                              >
                                <Download className="w-3 h-3 mr-1" />
                                {t.downloadReport}
                              </Button>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Target Reports Category */}
        {activeReportCategory === "targets" && (
          <div className="space-y-6">
            <Card className="bg-white shadow-lg">
              <CardHeader>
                <CardTitle className="text-xl font-poppins text-deep-plum flex items-center gap-2">
                  <Target className="w-5 h-5" />
                  Target & Performance Reports
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 gap-4">
                  <Card className="border border-gray-200 hover:border-deep-plum transition-colors">
                    <CardContent className="p-4">
                      <div className="flex items-start gap-3">
                        <div className="p-2 bg-green-100 rounded-lg">
                          <Target className="w-5 h-5 text-green-600" />
                        </div>
                        <div className="flex-1">
                          <h4 className="font-semibold text-sm text-deep-plum mb-1">
                            {t.departmentWiseTargets}
                          </h4>
                          <p className="text-xs text-gray-600 mb-3">
                            Input and view admission targets by department with
                            performance tracking
                          </p>
                          <div className="flex gap-2">
                            <Button
                              size="sm"
                              variant="outline"
                              className="text-xs"
                            >
                              <Eye className="w-3 h-3 mr-1" />
                              {t.viewReport}
                            </Button>
                            <Button
                              size="sm"
                              className="text-xs bg-deep-plum hover:bg-accent-purple"
                            >
                              <Target className="w-3 h-3 mr-1" />
                              Set Targets
                            </Button>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
}
