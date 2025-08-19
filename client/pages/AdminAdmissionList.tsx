import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Search,
  Filter,
  Eye,
  CheckCircle,
  XCircle,
  Lock,
  Unlock,
  Download,
  Users,
  Clock,
  RefreshCw,
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
import { Badge } from "../components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../components/ui/table";
import { Switch } from "../components/ui/switch";
import { useToast } from "../hooks/use-toast";
import apiClient from "../lib/api";

interface Application {
  id: string;
  uuid: string;
  status: "pending" | "approved" | "rejected" | "payment_pending";
  applicant_name: string;
  university_id?: string;
  student_id?: string;
  email: string;
  phone: string;
  admission_type: "regular" | "credit_transfer";
  program_code: string;
  program_name: string;
  department_code: string;
  department_name: string;
  campus: string;
  semester: string;
  semester_type: string;
  created_at: string;
  personal_info?: any;
  academic_history?: any;
  documents?: any;
  payment_info?: any;
}

interface DashboardStats {
  totalApplications: number;
  needReview: number;
  todayApplicants: number;
  pendingPayments: number;
}

export default function AdminAdmissionList() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [language, setLanguage] = useState<"en" | "bn">("en");
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [lockedApplications, setLockedApplications] = useState<string[]>([]);
  const [applications, setApplications] = useState<Application[]>([]);
  const [stats, setStats] = useState<DashboardStats>({
    totalApplications: 0,
    needReview: 0,
    todayApplicants: 0,
    pendingPayments: 0,
  });
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const texts = {
    en: {
      title: "Admission Office - New Admission List",
      searchPlaceholder: "Search by name, email, or tracking ID...",
      filterByStatus: "Filter by Status",
      allStatus: "All Status",
      pending: "Pending",
      approved: "Approved",
      rejected: "Rejected",
      export: "Export List",
      slNo: "SL No",
      name: "Name",
      email: "Email",
      phone: "Phone",
      verified: "Verified",
      trackingId: "Tracking ID",
      payslipStatus: "Payslip Status",
      actions: "Actions",
      view: "View",
      approve: "Approve",
      reject: "Reject",
      lock: "Lock",
      unlock: "Unlock",
      yes: "Yes",
      no: "No",
      todayApplicants: "Today's New Applicants",
      pendingPayments: "Pending Payments",
      totalApplications: "Total Applications",
      needReview: "Need Review",
      emailVerified: "Email Verified",
      phoneVerified: "Phone Verified",
      documentsComplete: "Documents Complete",
      refresh: "Refresh",
      loading: "Loading...",
      error: "Error loading data",
      approving: "Approving...",
      rejecting: "Rejecting...",
      approveSuccess: "Application approved successfully",
      rejectSuccess: "Application rejected successfully",
      actionError: "Failed to update application status",
      program: "Program",
      department: "Department",
      amount: "Amount",
    },
    bn: {
      title: "ভর্তি অফিস - নতুন ভর্তির তালিকা",
      searchPlaceholder: "নাম, ইমেইল, বা ট্র্যাকিং আইডি দিয়ে খুঁজুন...",
      filterByStatus: "অ��স্থা অনুযায়ী ফিল্টার",
      allStatus: "সব অবস্থা",
      pending: "অপেক্ষমাণ",
      approved: "অনুমোদিত",
      rejected: "প্রত্যাখ্যাত",
      export: "তালিকা এক্সপোর্ট",
      slNo: "ক্রমিক নং",
      name: "নাম",
      email: "ইমেইল",
      phone: "ফোন",
      verified: "যাচাইকৃত",
      trackingId: "ট্র্যাকিং আইডি",
      payslipStatus: "পে-স্লিপ অবস্থা",
      actions: "কর্ম",
      view: "দেখুন",
      approve: "অনু��োদন",
      reject: "প্রত্যাখ্যান",
      lock: "লক",
      unlock: "আনলক",
      yes: "হ্যাঁ",
      no: "না",
      todayApplicants: "আজকের নতুন আবেদনকারী",
      pendingPayments: "অপেক্ষমাণ পেমেন্ট",
      totalApplications: "মোট আবেদন",
      needReview: "পর্যালোচনা প্রয়োজন",
      emailVerified: "ইমেইল যাচাইকৃত",
      phoneVerified: "ফোন য��চাইকৃত",
      documentsComplete: "কাগজপত্র সম্পূর্ণ",
      refresh: "রিফ্রেশ",
      loading: "লোডিং...",
      error: "ডেটা লোড করতে ত্রুটি",
      approving: "অনুমোদন করা হচ্ছে...",
      rejecting: "প্রত্যাখ্যান করা হচ্ছে...",
      approveSuccess: "আবেদন সফলভাবে অনুমোদিত হয়েছে",
      rejectSuccess: "আবেদন সফলভাবে প্রত্যাখ্যান করা হয়েছে",
      actionError: "আবেদনের স্ট্যাটাস ���পডেট করতে ব্যর্থ",
      program: "���্রোগ্রাম",
      department: "বিভাগ",
      amount: "পরিমাণ",
    },
  };

  const t = texts[language];

  // Fetch applications and stats
  const fetchData = async () => {
    try {
      setRefreshing(true);

      // Fetch applications
      const applicationsResponse = await apiClient.getApplications({
        status: statusFilter === "all" ? undefined : statusFilter,
        search: searchTerm || undefined,
        page: currentPage,
        limit: 10,
      });

      if (applicationsResponse.success && applicationsResponse.data) {
        setApplications(applicationsResponse.data.applications || []);
        if (applicationsResponse.pagination) {
          setTotalPages(applicationsResponse.pagination.totalPages);
        }
      }

      // Fetch dashboard stats
      const statsResponse = await apiClient.getApplicationStats();
      if (statsResponse.success && statsResponse.data) {
        setStats(statsResponse.data);
      }
    } catch (error) {
      console.error("Error fetching data:", error);
      toast({
        title: t.error,
        description: "Unable to load applications. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  // Initial data load
  useEffect(() => {
    fetchData();
  }, [statusFilter, currentPage]);

  // Search with debounce
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (currentPage === 1) {
        fetchData();
      } else {
        setCurrentPage(1); // This will trigger fetchData via the previous useEffect
      }
    }, 500);

    return () => clearTimeout(timeoutId);
  }, [searchTerm]);

  const toggleLock = (trackingId: string) => {
    setLockedApplications((prev) =>
      prev.includes(trackingId)
        ? prev.filter((id) => id !== trackingId)
        : [...prev, trackingId],
    );
  };

  const isLocked = (trackingId: string) =>
    lockedApplications.includes(trackingId);

  const handleStatusUpdate = async (
    applicationId: number,
    newStatus: "approved" | "rejected",
  ) => {
    try {
      const response = await apiClient.updateApplicationStatus(
        applicationId.toString(),
        newStatus,
      );

      if (response.success) {
        toast({
          title: newStatus === "approved" ? t.approveSuccess : t.rejectSuccess,
        });
        // Refresh the data
        fetchData();
      } else {
        toast({
          title: t.actionError,
          description: response.error,
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("Error updating status:", error);
      toast({
        title: t.actionError,
        variant: "destructive",
      });
    }
  };

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      pending: { color: "bg-yellow-100 text-yellow-800", label: t.pending },
      approved: { color: "bg-green-100 text-green-800", label: t.approved },
      rejected: { color: "bg-red-100 text-red-800", label: t.rejected },
    };

    const config = statusConfig[status as keyof typeof statusConfig];
    return <Badge className={config.color}>{config.label}</Badge>;
  };

  const getPaymentStatusBadge = (status: string) => {
    const statusConfig = {
      pending: { color: "bg-orange-100 text-orange-800", label: "Pending" },
      paid: { color: "bg-green-100 text-green-800", label: "Paid" },
      partial: { color: "bg-blue-100 text-blue-800", label: "Partial" },
    };

    const config = statusConfig[status as keyof typeof statusConfig];
    return <Badge className={config.color}>{config.label}</Badge>;
  };

  const summaryStats = [
    {
      label: t.totalApplications,
      value: stats.totalApplications,
      color: "bg-blue-100 text-blue-800",
      icon: Users,
    },
    {
      label: t.needReview,
      value: stats.needReview,
      color: "bg-yellow-100 text-yellow-800",
      icon: Clock,
    },
    {
      label: t.todayApplicants,
      value: stats.todayApplicants,
      color: "bg-green-100 text-green-800",
      icon: Users,
    },
    {
      label: t.pendingPayments,
      value: stats.pendingPayments,
      color: "bg-red-100 text-red-800",
      icon: Clock,
    },
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <RefreshCw className="w-8 h-8 animate-spin mx-auto mb-4 text-deep-plum" />
          <p className="text-gray-600">{t.loading}</p>
        </div>
      </div>
    );
  }

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
              <p className="text-gray-600 mt-1">
                Manage and review new admission applications
              </p>
            </div>

            {/* Actions */}
            <div className="flex items-center gap-4">
              <Button
                variant="outline"
                onClick={fetchData}
                disabled={refreshing}
                className="border-accent-purple text-accent-purple hover:bg-accent-purple hover:text-white"
              >
                <RefreshCw
                  className={`w-4 h-4 mr-2 ${refreshing ? "animate-spin" : ""}`}
                />
                {t.refresh}
              </Button>
              <Button className="bg-deep-plum hover:bg-accent-purple">
                <Download className="w-4 h-4 mr-2" />
                {t.export}
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

        {/* Summary Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {summaryStats.map((stat, index) => (
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

        {/* Filters */}
        <Card className="bg-white shadow-lg mb-8">
          <CardContent className="p-6">
            <div className="flex flex-col md:flex-row gap-4">
              {/* Search */}
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input
                  placeholder={t.searchPlaceholder}
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>

              {/* Status Filter */}
              <div className="md:w-48">
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger>
                    <SelectValue placeholder={t.filterByStatus} />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">{t.allStatus}</SelectItem>
                    <SelectItem value="pending">{t.pending}</SelectItem>
                    <SelectItem value="approved">{t.approved}</SelectItem>
                    <SelectItem value="rejected">{t.rejected}</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Applications Table */}
        <Card className="bg-white shadow-lg">
          <CardHeader>
            <CardTitle className="text-xl font-poppins text-deep-plum">
              Applications ({applications.length})
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>{t.slNo}</TableHead>
                  <TableHead>{t.name}</TableHead>
                  <TableHead>{t.email}</TableHead>
                  <TableHead>{t.phone}</TableHead>
                  <TableHead>{t.verified}</TableHead>
                  <TableHead>{t.trackingId}</TableHead>
                  <TableHead>{t.program}</TableHead>
                  <TableHead>Referrer</TableHead>
                  <TableHead>Payment</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>{t.actions}</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {applications.map((app, index) => (
                  <TableRow key={app.id}>
                    <TableCell className="font-medium">
                      {(currentPage - 1) * 10 + index + 1}
                    </TableCell>
                    <TableCell>
                      <div>
                        <div className="font-medium">
                          {app.applicant_name}
                        </div>
                        <div className="text-sm text-gray-500">
                          {new Date(app.created_at).toLocaleDateString()}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>{app.email}</TableCell>
                    <TableCell>{app.phone}</TableCell>
                    <TableCell>
                      <div className="flex flex-col gap-1">
                        <Badge
                          variant="default"
                          className="text-xs"
                        >
                          Email: {t.yes}
                        </Badge>
                        <Badge
                          variant="default"
                          className="text-xs"
                        >
                          Phone: {t.yes}
                        </Badge>
                      </div>
                    </TableCell>
                    <TableCell className="font-mono text-sm">
                      {app.university_id || app.id}
                    </TableCell>
                    <TableCell>
                      <div className="text-sm">
                        <div className="font-medium">{app.program}</div>
                        <div className="text-gray-500">{app.department}</div>
                      </div>
                    </TableCell>
                    <TableCell>
                      {app.referrer_id ? (
                        <div className="text-xs">
                          <div className="font-medium text-green-700">
                            {app.referrer_name}
                          </div>
                          <div className="text-gray-500">{app.referrer_id}</div>
                        </div>
                      ) : (
                        <Badge variant="outline" className="text-gray-500">
                          No Referrer
                        </Badge>
                      )}
                    </TableCell>
                    <TableCell>
                      <div className="space-y-1">
                        {getPaymentStatusBadge(app.payment_status)}
                        <div className="text-xs text-gray-500">
                          ৳{app.final_amount?.toLocaleString() || "N/A"}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>{getStatusBadge(app.status)}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => navigate(`/admin/applicant/${app.id}`)}
                        >
                          <Eye className="w-3 h-3 mr-1" />
                          {t.view}
                        </Button>

                        {!isLocked(app.tracking_id) &&
                          app.status === "pending" && (
                            <>
                              <Button
                                variant="outline"
                                size="sm"
                                className="text-green-600 border-green-200 hover:bg-green-50"
                                onClick={() =>
                                  handleStatusUpdate(app.id, "approved")
                                }
                              >
                                <CheckCircle className="w-3 h-3 mr-1" />
                                {t.approve}
                              </Button>
                              <Button
                                variant="outline"
                                size="sm"
                                className="text-red-600 border-red-200 hover:bg-red-50"
                                onClick={() =>
                                  handleStatusUpdate(app.id, "rejected")
                                }
                              >
                                <XCircle className="w-3 h-3 mr-1" />
                                {t.reject}
                              </Button>
                            </>
                          )}

                        <div className="flex items-center gap-1">
                          {isLocked(app.tracking_id) ? (
                            <Lock className="w-4 h-4 text-gray-400" />
                          ) : (
                            <Unlock className="w-4 h-4 text-gray-400" />
                          )}
                          <Switch
                            checked={isLocked(app.tracking_id)}
                            onCheckedChange={() => toggleLock(app.tracking_id)}
                          />
                        </div>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex justify-center items-center gap-2 mt-6">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() =>
                    setCurrentPage((prev) => Math.max(1, prev - 1))
                  }
                  disabled={currentPage === 1}
                >
                  Previous
                </Button>
                <span className="text-sm text-gray-600">
                  Page {currentPage} of {totalPages}
                </span>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() =>
                    setCurrentPage((prev) => Math.min(totalPages, prev + 1))
                  }
                  disabled={currentPage === totalPages}
                >
                  Next
                </Button>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Bottom Summary Boxes */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
          <Card className="bg-gradient-to-r from-green-50 to-green-100 border-green-200">
            <CardHeader>
              <CardTitle className="text-green-800 font-poppins">
                {t.todayApplicants}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-green-600">
                {stats.todayApplicants}
              </div>
              <p className="text-sm text-green-700">
                New applications received today
              </p>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-r from-yellow-50 to-yellow-100 border-yellow-200">
            <CardHeader>
              <CardTitle className="text-yellow-800 font-poppins">
                {t.pendingPayments}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-yellow-600">
                {stats.pendingPayments}
              </div>
              <p className="text-sm text-yellow-700">
                Applications awaiting payment verification
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
