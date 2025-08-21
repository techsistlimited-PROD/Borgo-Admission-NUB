import { useState } from "react";
import {
  Search,
  Filter,
  Calendar,
  User,
  Mail,
  Phone,
  Key,
  Building,
  FileText,
  Download,
  Eye,
  Clock,
  Activity,
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
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../components/ui/dialog";
import { Label } from "../components/ui/label";
import { useToast } from "../hooks/use-toast";

interface ChangeRecord {
  id: string;
  studentId: string;
  studentName: string;
  changeType: "name" | "email" | "phone" | "password" | "department" | "login" | "mobile";
  oldValue: string;
  newValue: string;
  changedBy: string;
  changeDate: string;
  changeTime: string;
  reason: string;
  approvalStatus: "pending" | "approved" | "rejected" | "auto-approved";
  ipAddress: string;
  userAgent: string;
  department: string;
  sessionId: string;
}

const mockChangeRecords: ChangeRecord[] = [
  {
    id: "1",
    studentId: "NUB-CSE-2024-001",
    studentName: "Ahmed Rahman",
    changeType: "name",
    oldValue: "Ahmed Rahman",
    newValue: "Ahmad Rahman",
    changedBy: "Admin",
    changeDate: "2024-02-20",
    changeTime: "10:30:00",
    reason: "Correction as per official documents",
    approvalStatus: "approved",
    ipAddress: "192.168.1.100",
    userAgent: "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
    department: "Computer Science",
    sessionId: "sess_abc123",
  },
  {
    id: "2",
    studentId: "NUB-BBA-2024-002",
    studentName: "Fatima Sultana",
    changeType: "email",
    oldValue: "fatima.old@example.com",
    newValue: "fatima.sultana@example.com",
    changedBy: "Student",
    changeDate: "2024-02-19",
    changeTime: "14:15:00",
    reason: "Updated to official email address",
    approvalStatus: "auto-approved",
    ipAddress: "192.168.1.102",
    userAgent: "Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X)",
    department: "Business Administration",
    sessionId: "sess_def456",
  },
  {
    id: "3",
    studentId: "NUB-EEE-2024-003",
    studentName: "Mohammad Hassan",
    changeType: "department",
    oldValue: "Electrical Engineering",
    newValue: "Computer Science",
    changedBy: "Academic Office",
    changeDate: "2024-02-18",
    changeTime: "11:45:00",
    reason: "Student transfer request approved",
    approvalStatus: "approved",
    ipAddress: "192.168.1.105",
    userAgent: "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36",
    department: "Computer Science",
    sessionId: "sess_ghi789",
  },
  {
    id: "4",
    studentId: "NUB-CE-2024-004",
    studentName: "Rashida Begum",
    changeType: "phone",
    oldValue: "+8801623456789",
    newValue: "+8801723456789",
    changedBy: "Student",
    changeDate: "2024-02-17",
    changeTime: "16:20:00",
    reason: "New phone number",
    approvalStatus: "pending",
    ipAddress: "192.168.1.110",
    userAgent: "Mozilla/5.0 (Android 14; Mobile; rv:109.0) Gecko/109.0",
    department: "Civil Engineering",
    sessionId: "sess_jkl012",
  },
  {
    id: "5",
    studentId: "NUB-CSE-2024-005",
    studentName: "Karim Uddin",
    changeType: "password",
    oldValue: "[HIDDEN]",
    newValue: "[HIDDEN]",
    changedBy: "Admin",
    changeDate: "2024-02-16",
    changeTime: "09:10:00",
    reason: "Password reset requested",
    approvalStatus: "auto-approved",
    ipAddress: "192.168.1.100",
    userAgent: "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
    department: "Computer Science",
    sessionId: "sess_mno345",
  },
  {
    id: "6",
    studentId: "NUB-BBA-2024-006",
    studentName: "Nusrat Jahan",
    changeType: "login",
    oldValue: "nusrat.j",
    newValue: "nusrat.jahan",
    changedBy: "Student",
    changeDate: "2024-02-15",
    changeTime: "13:30:00",
    reason: "Requested more recognizable username",
    approvalStatus: "approved",
    ipAddress: "192.168.1.115",
    userAgent: "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
    department: "Business Administration",
    sessionId: "sess_pqr678",
  },
  {
    id: "7",
    studentId: "NUB-EEE-2024-007",
    studentName: "Abdullah Khan",
    changeType: "mobile",
    oldValue: "+8801289056734",
    newValue: "+8801389056734",
    changedBy: "Admin",
    changeDate: "2024-02-14",
    changeTime: "15:45:00",
    reason: "Correction in mobile number",
    approvalStatus: "approved",
    ipAddress: "192.168.1.100",
    userAgent: "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
    department: "Electrical Engineering",
    sessionId: "sess_stu901",
  },
  {
    id: "8",
    studentId: "NUB-CSE-2024-008",
    studentName: "Sakina Begum",
    changeType: "email",
    oldValue: "sakina@gmail.com",
    newValue: "sakina.begum@example.com",
    changedBy: "Student",
    changeDate: "2024-02-13",
    changeTime: "12:00:00",
    reason: "Updated to university provided email",
    approvalStatus: "rejected",
    ipAddress: "192.168.1.120",
    userAgent: "Mozilla/5.0 (iPad; CPU OS 17_0 like Mac OS X) AppleWebKit/605.1.15",
    department: "Computer Science",
    sessionId: "sess_vwx234",
  },
];

export default function ChangeHistory() {
  const { toast } = useToast();
  const [changeRecords, setChangeRecords] = useState<ChangeRecord[]>(mockChangeRecords);
  const [searchTerm, setSearchTerm] = useState("");
  const [changeTypeFilter, setChangeTypeFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [departmentFilter, setDepartmentFilter] = useState("all");
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");

  const filteredRecords = changeRecords.filter((record) => {
    const matchesSearch = 
      record.studentName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      record.studentId.toLowerCase().includes(searchTerm.toLowerCase()) ||
      record.changedBy.toLowerCase().includes(searchTerm.toLowerCase()) ||
      record.oldValue.toLowerCase().includes(searchTerm.toLowerCase()) ||
      record.newValue.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesChangeType = 
      changeTypeFilter === "all" || 
      record.changeType === changeTypeFilter;
    
    const matchesStatus = 
      statusFilter === "all" || 
      record.approvalStatus === statusFilter;
    
    const matchesDepartment = 
      departmentFilter === "all" || 
      record.department === departmentFilter;

    const matchesDateRange = 
      (!dateFrom || record.changeDate >= dateFrom) &&
      (!dateTo || record.changeDate <= dateTo);

    return matchesSearch && matchesChangeType && matchesStatus && matchesDepartment && matchesDateRange;
  });

  const stats = {
    totalChanges: changeRecords.length,
    pendingApprovals: changeRecords.filter(r => r.approvalStatus === "pending").length,
    approvedChanges: changeRecords.filter(r => r.approvalStatus === "approved").length,
    rejectedChanges: changeRecords.filter(r => r.approvalStatus === "rejected").length,
  };

  const exportReport = () => {
    const csvContent = [
      ["Date", "Time", "Student ID", "Student Name", "Department", "Change Type", "Old Value", "New Value", "Changed By", "Reason", "Status", "IP Address"].join(","),
      ...filteredRecords.map(record => [
        record.changeDate,
        record.changeTime,
        record.studentId,
        record.studentName,
        record.department,
        record.changeType,
        record.changeType === "password" ? "[HIDDEN]" : record.oldValue,
        record.changeType === "password" ? "[HIDDEN]" : record.newValue,
        record.changedBy,
        `"${record.reason}"`,
        record.approvalStatus,
        record.ipAddress,
      ].join(","))
    ].join("\n");

    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.setAttribute("hidden", "");
    a.setAttribute("href", url);
    a.setAttribute("download", `change_history_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);

    toast({
      title: "Report Exported",
      description: "Change history report has been exported successfully.",
    });
  };

  const updateApprovalStatus = (recordId: string, newStatus: "approved" | "rejected") => {
    setChangeRecords(prev => 
      prev.map(record => 
        record.id === recordId 
          ? { ...record, approvalStatus: newStatus }
          : record
      )
    );

    toast({
      title: `Change ${newStatus}`,
      description: `Change record has been ${newStatus}.`,
    });
  };

  const getChangeTypeBadge = (type: string) => {
    const config = {
      name: { color: "bg-blue-100 text-blue-800", label: "Name", icon: User },
      email: { color: "bg-green-100 text-green-800", label: "Email", icon: Mail },
      phone: { color: "bg-purple-100 text-purple-800", label: "Phone", icon: Phone },
      mobile: { color: "bg-purple-100 text-purple-800", label: "Mobile", icon: Phone },
      password: { color: "bg-red-100 text-red-800", label: "Password", icon: Key },
      department: { color: "bg-orange-100 text-orange-800", label: "Department", icon: Building },
      login: { color: "bg-teal-100 text-teal-800", label: "Login", icon: User },
    };
    
    const item = config[type as keyof typeof config] || config.name;
    return (
      <Badge className={item.color}>
        <item.icon className="w-3 h-3 mr-1" />
        {item.label}
      </Badge>
    );
  };

  const getStatusBadge = (status: string) => {
    const config = {
      pending: { color: "bg-yellow-100 text-yellow-800", label: "Pending" },
      approved: { color: "bg-green-100 text-green-800", label: "Approved" },
      rejected: { color: "bg-red-100 text-red-800", label: "Rejected" },
      "auto-approved": { color: "bg-blue-100 text-blue-800", label: "Auto-Approved" },
    };
    
    const { color, label } = config[status as keyof typeof config] || config.pending;
    return <Badge className={color}>{label}</Badge>;
  };

  const departments = ["All Departments", "Computer Science", "Business Administration", "Electrical Engineering", "Civil Engineering"];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="mb-8">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-deep-plum font-poppins">
              Change History Report
            </h1>
            <p className="text-gray-600 mt-1">
              Track all changes made to student information including name, login, password, mobile, and email
            </p>
          </div>
          
          <Button onClick={exportReport} className="bg-deep-plum hover:bg-accent-purple">
            <Download className="w-4 h-4 mr-2" />
            Export Report
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Changes</p>
                <p className="text-3xl font-bold text-deep-plum">{stats.totalChanges}</p>
              </div>
              <div className="p-3 rounded-full bg-blue-100">
                <Activity className="w-6 h-6 text-blue-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Pending Approvals</p>
                <p className="text-3xl font-bold text-deep-plum">{stats.pendingApprovals}</p>
              </div>
              <div className="p-3 rounded-full bg-yellow-100">
                <Clock className="w-6 h-6 text-yellow-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Approved Changes</p>
                <p className="text-3xl font-bold text-deep-plum">{stats.approvedChanges}</p>
              </div>
              <div className="p-3 rounded-full bg-green-100">
                <User className="w-6 h-6 text-green-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Rejected Changes</p>
                <p className="text-3xl font-bold text-deep-plum">{stats.rejectedChanges}</p>
              </div>
              <div className="p-3 rounded-full bg-red-100">
                <FileText className="w-6 h-6 text-red-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card className="mb-8">
        <CardContent className="p-6">
          <div className="grid gap-4">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Search by student name, ID, changed by, or values..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
              
              <Select value={changeTypeFilter} onValueChange={setChangeTypeFilter}>
                <SelectTrigger className="md:w-40">
                  <SelectValue placeholder="Change Type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Types</SelectItem>
                  <SelectItem value="name">Name</SelectItem>
                  <SelectItem value="email">Email</SelectItem>
                  <SelectItem value="phone">Phone</SelectItem>
                  <SelectItem value="mobile">Mobile</SelectItem>
                  <SelectItem value="password">Password</SelectItem>
                  <SelectItem value="department">Department</SelectItem>
                  <SelectItem value="login">Login</SelectItem>
                </SelectContent>
              </Select>

              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="md:w-40">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="approved">Approved</SelectItem>
                  <SelectItem value="rejected">Rejected</SelectItem>
                  <SelectItem value="auto-approved">Auto-Approved</SelectItem>
                </SelectContent>
              </Select>

              <Select value={departmentFilter} onValueChange={setDepartmentFilter}>
                <SelectTrigger className="md:w-48">
                  <SelectValue placeholder="Department" />
                </SelectTrigger>
                <SelectContent>
                  {departments.map(dept => (
                    <SelectItem key={dept} value={dept === "All Departments" ? "all" : dept}>
                      {dept}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="flex gap-4">
              <div>
                <Label>Date From</Label>
                <Input 
                  type="date"
                  value={dateFrom}
                  onChange={(e) => setDateFrom(e.target.value)}
                />
              </div>
              <div>
                <Label>Date To</Label>
                <Input 
                  type="date"
                  value={dateTo}
                  onChange={(e) => setDateTo(e.target.value)}
                />
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Change Records Table */}
      <Card>
        <CardHeader>
          <CardTitle className="text-xl font-poppins text-deep-plum">
            Change Records ({filteredRecords.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Date & Time</TableHead>
                <TableHead>Student</TableHead>
                <TableHead>Change Type</TableHead>
                <TableHead>Changes</TableHead>
                <TableHead>Changed By</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredRecords.map((record) => (
                <TableRow key={record.id}>
                  <TableCell>
                    <div>
                      <div className="font-medium">{new Date(record.changeDate).toLocaleDateString()}</div>
                      <div className="text-sm text-gray-500">{record.changeTime}</div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div>
                      <div className="font-medium">{record.studentName}</div>
                      <div className="text-sm text-gray-500">{record.studentId}</div>
                      <div className="text-sm text-gray-500">{record.department}</div>
                    </div>
                  </TableCell>
                  <TableCell>
                    {getChangeTypeBadge(record.changeType)}
                  </TableCell>
                  <TableCell>
                    <div>
                      <div className="text-sm">
                        <span className="text-red-600">From:</span> {record.changeType === "password" ? "[HIDDEN]" : record.oldValue}
                      </div>
                      <div className="text-sm">
                        <span className="text-green-600">To:</span> {record.changeType === "password" ? "[HIDDEN]" : record.newValue}
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div>
                      <div className="font-medium">{record.changedBy}</div>
                      <div className="text-sm text-gray-500">IP: {record.ipAddress}</div>
                    </div>
                  </TableCell>
                  <TableCell>
                    {getStatusBadge(record.approvalStatus)}
                  </TableCell>
                  <TableCell>
                    <div className="flex gap-1">
                      {/* View Details */}
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button variant="outline" size="sm">
                            <Eye className="w-3 h-3" />
                          </Button>
                        </DialogTrigger>
                        <DialogContent className="max-w-2xl">
                          <DialogHeader>
                            <DialogTitle>Change Record Details</DialogTitle>
                          </DialogHeader>
                          <div className="py-4 space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                              <div>
                                <Label>Student</Label>
                                <div className="text-lg">{record.studentName}</div>
                                <div className="text-sm text-gray-500">{record.studentId}</div>
                              </div>
                              <div>
                                <Label>Department</Label>
                                <div className="text-lg">{record.department}</div>
                              </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                              <div>
                                <Label>Change Type</Label>
                                <div>{getChangeTypeBadge(record.changeType)}</div>
                              </div>
                              <div>
                                <Label>Status</Label>
                                <div>{getStatusBadge(record.approvalStatus)}</div>
                              </div>
                            </div>

                            <div>
                              <Label>Changes Made</Label>
                              <div className="bg-gray-50 p-3 rounded-lg mt-2">
                                <div className="text-sm">
                                  <span className="text-red-600 font-medium">Previous:</span> {record.changeType === "password" ? "[HIDDEN]" : record.oldValue}
                                </div>
                                <div className="text-sm mt-1">
                                  <span className="text-green-600 font-medium">Current:</span> {record.changeType === "password" ? "[HIDDEN]" : record.newValue}
                                </div>
                              </div>
                            </div>

                            <div>
                              <Label>Reason</Label>
                              <div className="text-gray-700 mt-1">{record.reason}</div>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                              <div>
                                <Label>Changed By</Label>
                                <div className="text-lg">{record.changedBy}</div>
                              </div>
                              <div>
                                <Label>Date & Time</Label>
                                <div className="text-lg">
                                  {new Date(record.changeDate).toLocaleDateString()} {record.changeTime}
                                </div>
                              </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4 text-sm text-gray-600">
                              <div>
                                <Label>IP Address</Label>
                                <div>{record.ipAddress}</div>
                              </div>
                              <div>
                                <Label>Session ID</Label>
                                <div>{record.sessionId}</div>
                              </div>
                            </div>

                            <div>
                              <Label>User Agent</Label>
                              <div className="text-sm text-gray-600 break-all">{record.userAgent}</div>
                            </div>
                          </div>
                        </DialogContent>
                      </Dialog>

                      {/* Approve/Reject for pending changes */}
                      {record.approvalStatus === "pending" && (
                        <>
                          <Button 
                            variant="outline" 
                            size="sm" 
                            className="text-green-600 border-green-200 hover:bg-green-50"
                            onClick={() => updateApprovalStatus(record.id, "approved")}
                          >
                            ✓
                          </Button>
                          <Button 
                            variant="outline" 
                            size="sm" 
                            className="text-red-600 border-red-200 hover:bg-red-50"
                            onClick={() => updateApprovalStatus(record.id, "rejected")}
                          >
                            ✗
                          </Button>
                        </>
                      )}
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
