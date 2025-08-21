import React, { useState } from "react";
import {
  Search,
  Lock,
  Unlock,
  UserX,
  Key,
  AlertTriangle,
  Shield,
  User,
  Mail,
  Calendar,
  CheckCircle,
  X,
  Eye,
  EyeOff,
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
import { Textarea } from "../components/ui/textarea";
import { Switch } from "../components/ui/switch";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "../components/ui/alert-dialog";
import { useToast } from "../hooks/use-toast";

interface Account {
  id: string;
  name: string;
  studentId: string;
  email: string;
  phone: string;
  department: string;
  accountType: "student" | "admin" | "faculty";
  accountStatus: "active" | "locked" | "deactivated" | "cancelled";
  admissionStatus: "admitted" | "cancelled" | "pending";
  createdDate: string;
  lastLogin: string;
  loginAttempts: number;
  passwordResetRequired: boolean;
  actions: AccountAction[];
}

interface AccountAction {
  id: string;
  type: "lock" | "unlock" | "deactivate" | "reactivate" | "cancel_admission" | "password_reset";
  performedBy: string;
  performedAt: string;
  reason: string;
  details?: string;
}

const mockAccounts: Account[] = [
  {
    id: "1",
    name: "Ahmed Rahman",
    studentId: "NUB-CSE-2024-001",
    email: "ahmed.rahman@example.com",
    phone: "+8801712345678",
    department: "Computer Science",
    accountType: "student",
    accountStatus: "active",
    admissionStatus: "admitted",
    createdDate: "2024-01-15",
    lastLogin: "2024-02-20",
    loginAttempts: 0,
    passwordResetRequired: false,
    actions: [],
  },
  {
    id: "2",
    name: "Fatima Sultana",
    studentId: "NUB-BBA-2024-002",
    email: "fatima.sultana@example.com",
    phone: "+8801887654321",
    department: "Business Administration",
    accountType: "student",
    accountStatus: "locked",
    admissionStatus: "admitted",
    createdDate: "2024-01-20",
    lastLogin: "2024-02-18",
    loginAttempts: 5,
    passwordResetRequired: true,
    actions: [
      {
        id: "a1",
        type: "lock",
        performedBy: "System",
        performedAt: "2024-02-19",
        reason: "Multiple failed login attempts",
        details: "Account automatically locked after 5 failed login attempts",
      },
    ],
  },
  {
    id: "3",
    name: "Mohammad Hassan",
    studentId: "NUB-EEE-2024-003",
    email: "mohammad.hassan@example.com",
    phone: "+8801598765432",
    department: "Electrical Engineering",
    accountType: "student",
    accountStatus: "deactivated",
    admissionStatus: "cancelled",
    createdDate: "2024-01-25",
    lastLogin: "2024-02-10",
    loginAttempts: 2,
    passwordResetRequired: false,
    actions: [
      {
        id: "a2",
        type: "cancel_admission",
        performedBy: "Admin",
        performedAt: "2024-02-15",
        reason: "Student requested admission cancellation",
        details: "Student wanted to apply for different program",
      },
      {
        id: "a3",
        type: "deactivate",
        performedBy: "Admin",
        performedAt: "2024-02-15",
        reason: "Following admission cancellation",
      },
    ],
  },
  {
    id: "4",
    name: "Rashida Begum",
    studentId: "NUB-CE-2024-004",
    email: "rashida.begum@example.com",
    phone: "+8801623456789",
    department: "Civil Engineering",
    accountType: "student",
    accountStatus: "active",
    admissionStatus: "admitted",
    createdDate: "2024-02-01",
    lastLogin: "2024-02-21",
    loginAttempts: 1,
    passwordResetRequired: false,
    actions: [
      {
        id: "a4",
        type: "password_reset",
        performedBy: "Admin",
        performedAt: "2024-02-05",
        reason: "Student forgot password",
      },
    ],
  },
  {
    id: "5",
    name: "Karim Uddin",
    studentId: "NUB-CSE-2024-005",
    email: "karim.uddin@example.com",
    phone: "+8801734567890",
    department: "Computer Science",
    accountType: "student",
    accountStatus: "active",
    admissionStatus: "pending",
    createdDate: "2024-02-10",
    lastLogin: "2024-02-20",
    loginAttempts: 0,
    passwordResetRequired: false,
    actions: [],
  },
];

export default function AccountManagement() {
  const { toast } = useToast();
  const [accounts, setAccounts] = useState<Account[]>(mockAccounts);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [departmentFilter, setDepartmentFilter] = useState("all");
  const [actionReason, setActionReason] = useState("");
  const [actionDetails, setActionDetails] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const filteredAccounts = accounts.filter((account) => {
    const matchesSearch = 
      account.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      account.studentId.toLowerCase().includes(searchTerm.toLowerCase()) ||
      account.email.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = 
      statusFilter === "all" || 
      account.accountStatus === statusFilter;
    
    const matchesDepartment = 
      departmentFilter === "all" || 
      account.department === departmentFilter;

    return matchesSearch && matchesStatus && matchesDepartment;
  });

  const stats = {
    totalAccounts: accounts.length,
    activeAccounts: accounts.filter(a => a.accountStatus === "active").length,
    lockedAccounts: accounts.filter(a => a.accountStatus === "locked").length,
    cancelledAdmissions: accounts.filter(a => a.admissionStatus === "cancelled").length,
  };

  const performAccountAction = (
    accountId: string, 
    actionType: "lock" | "unlock" | "deactivate" | "reactivate" | "cancel_admission" | "password_reset",
    reason: string,
    details?: string
  ) => {
    const newAction: AccountAction = {
      id: `a${Date.now()}`,
      type: actionType,
      performedBy: "Admin",
      performedAt: new Date().toISOString().split('T')[0],
      reason,
      details,
    };

    setAccounts(prev => 
      prev.map(account => 
        account.id === accountId 
          ? {
              ...account,
              accountStatus: 
                actionType === "lock" ? "locked" :
                actionType === "unlock" ? "active" :
                actionType === "deactivate" ? "deactivated" :
                actionType === "reactivate" ? "active" :
                account.accountStatus,
              admissionStatus: 
                actionType === "cancel_admission" ? "cancelled" : account.admissionStatus,
              passwordResetRequired: actionType === "password_reset" ? true : account.passwordResetRequired,
              loginAttempts: actionType === "unlock" ? 0 : account.loginAttempts,
              actions: [...account.actions, newAction],
            }
          : account
      )
    );

    toast({
      title: "Action Completed",
      description: `Account ${actionType.replace('_', ' ')} action has been performed successfully.`,
    });

    setActionReason("");
    setActionDetails("");
  };

  const generatePassword = () => {
    const chars = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*";
    let password = "";
    for (let i = 0; i < 12; i++) {
      password += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    setNewPassword(password);
  };

  const getAccountStatusBadge = (status: string) => {
    const config = {
      active: { color: "bg-green-100 text-green-800", label: "Active" },
      locked: { color: "bg-red-100 text-red-800", label: "Locked" },
      deactivated: { color: "bg-gray-100 text-gray-800", label: "Deactivated" },
      cancelled: { color: "bg-orange-100 text-orange-800", label: "Cancelled" },
    };
    
    const { color, label } = config[status as keyof typeof config] || config.active;
    return <Badge className={color}>{label}</Badge>;
  };

  const getAdmissionStatusBadge = (status: string) => {
    const config = {
      admitted: { color: "bg-blue-100 text-blue-800", label: "Admitted" },
      cancelled: { color: "bg-red-100 text-red-800", label: "Cancelled" },
      pending: { color: "bg-yellow-100 text-yellow-800", label: "Pending" },
    };
    
    const { color, label } = config[status as keyof typeof config] || config.pending;
    return <Badge className={color}>{label}</Badge>;
  };

  const getActionTypeBadge = (type: string) => {
    const config = {
      lock: { color: "bg-red-100 text-red-800", label: "Locked", icon: Lock },
      unlock: { color: "bg-green-100 text-green-800", label: "Unlocked", icon: Unlock },
      deactivate: { color: "bg-gray-100 text-gray-800", label: "Deactivated", icon: UserX },
      reactivate: { color: "bg-blue-100 text-blue-800", label: "Reactivated", icon: User },
      cancel_admission: { color: "bg-orange-100 text-orange-800", label: "Admission Cancelled", icon: X },
      password_reset: { color: "bg-purple-100 text-purple-800", label: "Password Reset", icon: Key },
    };
    
    const item = config[type as keyof typeof config] || config.lock;
    return (
      <Badge className={item.color}>
        <item.icon className="w-3 h-3 mr-1" />
        {item.label}
      </Badge>
    );
  };

  const departments = ["All Departments", "Computer Science", "Business Administration", "Electrical Engineering", "Civil Engineering"];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-deep-plum font-poppins">
          Account Management
        </h1>
        <p className="text-gray-600 mt-1">
          Manage student accounts, admissions, and security settings
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Accounts</p>
                <p className="text-3xl font-bold text-deep-plum">{stats.totalAccounts}</p>
              </div>
              <div className="p-3 rounded-full bg-blue-100">
                <User className="w-6 h-6 text-blue-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Active Accounts</p>
                <p className="text-3xl font-bold text-deep-plum">{stats.activeAccounts}</p>
              </div>
              <div className="p-3 rounded-full bg-green-100">
                <CheckCircle className="w-6 h-6 text-green-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Locked Accounts</p>
                <p className="text-3xl font-bold text-deep-plum">{stats.lockedAccounts}</p>
              </div>
              <div className="p-3 rounded-full bg-red-100">
                <Lock className="w-6 h-6 text-red-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Cancelled Admissions</p>
                <p className="text-3xl font-bold text-deep-plum">{stats.cancelledAdmissions}</p>
              </div>
              <div className="p-3 rounded-full bg-orange-100">
                <AlertTriangle className="w-6 h-6 text-orange-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card className="mb-8">
        <CardContent className="p-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search by name, student ID, or email..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="md:w-40">
                <SelectValue placeholder="Account Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="locked">Locked</SelectItem>
                <SelectItem value="deactivated">Deactivated</SelectItem>
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
        </CardContent>
      </Card>

      {/* Accounts Table */}
      <Card>
        <CardHeader>
          <CardTitle className="text-xl font-poppins text-deep-plum">
            Student Accounts ({filteredAccounts.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Student Info</TableHead>
                <TableHead>Contact</TableHead>
                <TableHead>Account Status</TableHead>
                <TableHead>Admission Status</TableHead>
                <TableHead>Last Login</TableHead>
                <TableHead>Security</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredAccounts.map((account) => (
                <TableRow key={account.id}>
                  <TableCell>
                    <div>
                      <div className="font-medium">{account.name}</div>
                      <div className="text-sm text-gray-500">{account.studentId}</div>
                      <div className="text-sm text-gray-500">{account.department}</div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div>
                      <div className="text-sm">{account.email}</div>
                      <div className="text-sm text-gray-500">{account.phone}</div>
                    </div>
                  </TableCell>
                  <TableCell>
                    {getAccountStatusBadge(account.accountStatus)}
                  </TableCell>
                  <TableCell>
                    {getAdmissionStatusBadge(account.admissionStatus)}
                  </TableCell>
                  <TableCell>
                    <div>
                      <div className="text-sm">{new Date(account.lastLogin).toLocaleDateString()}</div>
                      <div className="text-sm text-gray-500">
                        Created: {new Date(account.createdDate).toLocaleDateString()}
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="space-y-1">
                      <div className="flex items-center gap-1">
                        <Shield className="w-3 h-3 text-gray-400" />
                        <span className="text-xs">Attempts: {account.loginAttempts}</span>
                      </div>
                      {account.passwordResetRequired && (
                        <Badge variant="outline" className="text-xs">Reset Required</Badge>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex gap-1 flex-wrap">
                      {/* Lock/Unlock */}
                      {account.accountStatus === "active" ? (
                        <Dialog>
                          <DialogTrigger asChild>
                            <Button variant="outline" size="sm" className="text-red-600 border-red-200 hover:bg-red-50">
                              <Lock className="w-3 h-3" />
                            </Button>
                          </DialogTrigger>
                          <DialogContent>
                            <DialogHeader>
                              <DialogTitle>Lock Account</DialogTitle>
                            </DialogHeader>
                            <div className="grid gap-4 py-4">
                              <div>
                                <Label>Reason for locking</Label>
                                <Textarea 
                                  placeholder="Provide reason for account lock..."
                                  value={actionReason}
                                  onChange={(e) => setActionReason(e.target.value)}
                                />
                              </div>
                              <div>
                                <Label>Additional Details (Optional)</Label>
                                <Input 
                                  placeholder="Additional information..."
                                  value={actionDetails}
                                  onChange={(e) => setActionDetails(e.target.value)}
                                />
                              </div>
                              <Button 
                                onClick={() => performAccountAction(account.id, "lock", actionReason, actionDetails)}
                                disabled={!actionReason}
                                className="bg-red-600 hover:bg-red-700"
                              >
                                Lock Account
                              </Button>
                            </div>
                          </DialogContent>
                        </Dialog>
                      ) : account.accountStatus === "locked" ? (
                        <Dialog>
                          <DialogTrigger asChild>
                            <Button variant="outline" size="sm" className="text-green-600 border-green-200 hover:bg-green-50">
                              <Unlock className="w-3 h-3" />
                            </Button>
                          </DialogTrigger>
                          <DialogContent>
                            <DialogHeader>
                              <DialogTitle>Unlock Account</DialogTitle>
                            </DialogHeader>
                            <div className="grid gap-4 py-4">
                              <div>
                                <Label>Reason for unlocking</Label>
                                <Textarea 
                                  placeholder="Provide reason for account unlock..."
                                  value={actionReason}
                                  onChange={(e) => setActionReason(e.target.value)}
                                />
                              </div>
                              <Button 
                                onClick={() => performAccountAction(account.id, "unlock", actionReason)}
                                disabled={!actionReason}
                                className="bg-green-600 hover:bg-green-700"
                              >
                                Unlock Account
                              </Button>
                            </div>
                          </DialogContent>
                        </Dialog>
                      ) : null}

                      {/* Password Reset */}
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button variant="outline" size="sm" className="text-blue-600 border-blue-200 hover:bg-blue-50">
                            <Key className="w-3 h-3" />
                          </Button>
                        </DialogTrigger>
                        <DialogContent>
                          <DialogHeader>
                            <DialogTitle>Reset Password</DialogTitle>
                          </DialogHeader>
                          <div className="grid gap-4 py-4">
                            <div>
                              <Label>New Password</Label>
                              <div className="flex gap-2">
                                <div className="relative flex-1">
                                  <Input 
                                    type={showPassword ? "text" : "password"}
                                    placeholder="Enter new password or generate one"
                                    value={newPassword}
                                    onChange={(e) => setNewPassword(e.target.value)}
                                  />
                                  <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-3 top-3 text-gray-400 hover:text-gray-600"
                                  >
                                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                                  </button>
                                </div>
                                <Button type="button" variant="outline" onClick={generatePassword}>
                                  Generate
                                </Button>
                              </div>
                            </div>
                            <div>
                              <Label>Reason for reset</Label>
                              <Textarea 
                                placeholder="Provide reason for password reset..."
                                value={actionReason}
                                onChange={(e) => setActionReason(e.target.value)}
                              />
                            </div>
                            <Button 
                              onClick={() => {
                                performAccountAction(account.id, "password_reset", actionReason);
                                setNewPassword("");
                              }}
                              disabled={!actionReason || !newPassword}
                              className="bg-blue-600 hover:bg-blue-700"
                            >
                              Reset Password
                            </Button>
                          </div>
                        </DialogContent>
                      </Dialog>

                      {/* Cancel Admission */}
                      {account.admissionStatus === "admitted" && (
                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <Button variant="outline" size="sm" className="text-orange-600 border-orange-200 hover:bg-orange-50">
                              <X className="w-3 h-3" />
                            </Button>
                          </AlertDialogTrigger>
                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>Cancel Admission</AlertDialogTitle>
                              <AlertDialogDescription>
                                Are you sure you want to cancel the admission for {account.name}? This action cannot be undone and will also deactivate the student's account.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <div className="grid gap-4 py-4">
                              <div>
                                <Label>Reason for cancellation</Label>
                                <Textarea 
                                  placeholder="Provide detailed reason for admission cancellation..."
                                  value={actionReason}
                                  onChange={(e) => setActionReason(e.target.value)}
                                />
                              </div>
                            </div>
                            <AlertDialogFooter>
                              <AlertDialogCancel onClick={() => setActionReason("")}>Cancel</AlertDialogCancel>
                              <AlertDialogAction 
                                onClick={() => {
                                  performAccountAction(account.id, "cancel_admission", actionReason);
                                  performAccountAction(account.id, "deactivate", "Following admission cancellation");
                                }}
                                disabled={!actionReason}
                                className="bg-orange-600 hover:bg-orange-700"
                              >
                                Cancel Admission
                              </AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      )}

                      {/* View History */}
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button variant="outline" size="sm" className="text-gray-600 border-gray-200 hover:bg-gray-50">
                            <Calendar className="w-3 h-3" />
                          </Button>
                        </DialogTrigger>
                        <DialogContent className="max-w-2xl">
                          <DialogHeader>
                            <DialogTitle>Account History: {account.name}</DialogTitle>
                          </DialogHeader>
                          <div className="py-4 max-h-96 overflow-y-auto">
                            <div className="space-y-4">
                              <div className="border-l-4 border-blue-500 pl-4">
                                <div className="font-medium">Account Created</div>
                                <div className="text-sm text-gray-600">
                                  {new Date(account.createdDate).toLocaleDateString()}
                                </div>
                                <div className="text-sm text-gray-500">
                                  Initial account setup completed
                                </div>
                              </div>
                              
                              {account.actions.map(action => (
                                <div key={action.id} className="border-l-4 border-gray-300 pl-4">
                                  <div className="flex items-center gap-2 mb-1">
                                    {getActionTypeBadge(action.type)}
                                    <span className="text-sm text-gray-500">
                                      by {action.performedBy}
                                    </span>
                                  </div>
                                  <div className="text-sm text-gray-600">
                                    {new Date(action.performedAt).toLocaleDateString()}
                                  </div>
                                  <div className="text-sm text-gray-700 mt-1">
                                    <strong>Reason:</strong> {action.reason}
                                  </div>
                                  {action.details && (
                                    <div className="text-sm text-gray-600 mt-1">
                                      <strong>Details:</strong> {action.details}
                                    </div>
                                  )}
                                </div>
                              ))}
                              
                              {account.actions.length === 0 && (
                                <div className="text-center py-8 text-gray-500">
                                  No account actions recorded
                                </div>
                              )}
                            </div>
                          </div>
                        </DialogContent>
                      </Dialog>
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
