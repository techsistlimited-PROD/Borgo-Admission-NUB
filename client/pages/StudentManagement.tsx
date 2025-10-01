import React, { useState } from "react";
import {
  Search,
  Edit,
  Building,
  User,
  Mail,
  Phone,
  Calendar,
  AlertTriangle,
  CheckCircle,
  X,
  Save,
  History,
  FileText,
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
import { useToast } from "../hooks/use-toast";

interface Student {
  id: string;
  name: string;
  studentId: string;
  email: string;
  phone: string;
  currentDepartment: string;
  currentProgram: string;
  admissionDate: string;
  cgpa: number;
  status: "active" | "inactive" | "graduated" | "dropped";
  corrections: CorrectionRequest[];
}

interface CorrectionRequest {
  id: string;
  type: "name" | "department" | "email" | "phone";
  currentValue: string;
  requestedValue: string;
  reason: string;
  status: "pending" | "approved" | "rejected";
  requestDate: string;
  requestedBy: string;
}

const mockStudents: Student[] = [
  {
    id: "1",
    name: "Mohammed Rahman",
    studentId: "NUB-CSE-2023-001",
    email: "mohammed.rahman@example.com",
    phone: "+8801712345678",
    currentDepartment: "Computer Science",
    currentProgram: "BSc in CSE",
    admissionDate: "2023-09-01",
    cgpa: 3.45,
    status: "active",
    corrections: [
      {
        id: "c1",
        type: "name",
        currentValue: "Mohammed Rahman",
        requestedValue: "Mohammad Rahman",
        reason: "Correct spelling according to official documents",
        status: "pending",
        requestDate: "2024-02-15",
        requestedBy: "Student",
      },
    ],
  },
  {
    id: "2",
    name: "Fatima Khatun",
    studentId: "NUB-BBA-2023-002",
    email: "fatima.khatun@example.com",
    phone: "+8801887654321",
    currentDepartment: "Business Administration",
    currentProgram: "BBA",
    admissionDate: "2023-09-01",
    cgpa: 3.78,
    status: "active",
    corrections: [],
  },
  {
    id: "3",
    name: "Abdul Karim",
    studentId: "NUB-EEE-2023-003",
    email: "abdul.karim@example.com",
    phone: "+8801598765432",
    currentDepartment: "Electrical Engineering",
    currentProgram: "BSc in EEE",
    admissionDate: "2023-09-01",
    cgpa: 3.12,
    status: "active",
    corrections: [
      {
        id: "c2",
        type: "department",
        currentValue: "Electrical Engineering",
        requestedValue: "Computer Science",
        reason: "Student wants to transfer to CSE department due to interest",
        status: "pending",
        requestDate: "2024-02-10",
        requestedBy: "Academic Office",
      },
    ],
  },
  {
    id: "4",
    name: "Rashida Begum",
    studentId: "NUB-CE-2023-004",
    email: "rashida.begum@example.com",
    phone: "+8801623456789",
    currentDepartment: "Civil Engineering",
    currentProgram: "BSc in Civil",
    admissionDate: "2023-09-01",
    cgpa: 2.98,
    status: "active",
    corrections: [],
  },
  {
    id: "5",
    name: "Sakina Akter",
    studentId: "NUB-CSE-2023-005",
    email: "sakina.akter@example.com",
    phone: "+8801734567890",
    currentDepartment: "Computer Science",
    currentProgram: "BSc in CSE",
    admissionDate: "2023-09-01",
    cgpa: 3.92,
    status: "active",
    corrections: [
      {
        id: "c3",
        type: "email",
        currentValue: "sakina.akter@example.com",
        requestedValue: "sakina.akter.cse@example.com",
        reason: "Updated email address",
        status: "approved",
        requestDate: "2024-01-20",
        requestedBy: "Student",
      },
    ],
  },
];

const departments = [
  "Computer Science",
  "Business Administration",
  "Electrical Engineering",
  "Civil Engineering",
  "Mechanical Engineering",
  "Architecture",
];

const programs = {
  "Computer Science": ["BSc in CSE", "BSc in Software Engineering"],
  "Business Administration": ["BBA", "MBA"],
  "Electrical Engineering": ["BSc in EEE"],
  "Civil Engineering": ["BSc in Civil"],
  "Mechanical Engineering": ["BSc in Mechanical"],
  Architecture: ["Bachelor of Architecture"],
};

export default function StudentManagement() {
  const { toast } = useToast();
  const [students, setStudents] = useState<Student[]>(mockStudents);
  const [searchTerm, setSearchTerm] = useState("");
  const [departmentFilter, setDepartmentFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [editingStudent, setEditingStudent] = useState<Student | null>(null);
  const [newCorrectionRequest, setNewCorrectionRequest] = useState<
    Partial<CorrectionRequest>
  >({});

  const filteredStudents = students.filter((student) => {
    const matchesSearch =
      student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      student.studentId.toLowerCase().includes(searchTerm.toLowerCase()) ||
      student.email.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesDepartment =
      departmentFilter === "all" ||
      student.currentDepartment === departmentFilter;

    const matchesStatus =
      statusFilter === "all" || student.status === statusFilter;

    return matchesSearch && matchesDepartment && matchesStatus;
  });

  const stats = {
    totalStudents: students.length,
    activeStudents: students.filter((s) => s.status === "active").length,
    pendingCorrections: students.reduce(
      (sum, s) =>
        sum + s.corrections.filter((c) => c.status === "pending").length,
      0,
    ),
    departmentTransfers: students.filter((s) =>
      s.corrections.some(
        (c) => c.type === "department" && c.status === "pending",
      ),
    ).length,
  };

  const handleCorrectionApproval = (
    studentId: string,
    correctionId: string,
    approved: boolean,
  ) => {
    setStudents((prev) =>
      prev.map((student) =>
        student.id === studentId
          ? {
              ...student,
              corrections: student.corrections.map((correction) =>
                correction.id === correctionId
                  ? {
                      ...correction,
                      status: approved ? "approved" : "rejected",
                    }
                  : correction,
              ),
              // Apply the correction if approved
              ...(approved &&
              student.corrections.find((c) => c.id === correctionId)?.type ===
                "name"
                ? {
                    name:
                      student.corrections.find((c) => c.id === correctionId)
                        ?.requestedValue || student.name,
                  }
                : {}),
              ...(approved &&
              student.corrections.find((c) => c.id === correctionId)?.type ===
                "department"
                ? {
                    currentDepartment:
                      student.corrections.find((c) => c.id === correctionId)
                        ?.requestedValue || student.currentDepartment,
                  }
                : {}),
              ...(approved &&
              student.corrections.find((c) => c.id === correctionId)?.type ===
                "email"
                ? {
                    email:
                      student.corrections.find((c) => c.id === correctionId)
                        ?.requestedValue || student.email,
                  }
                : {}),
              ...(approved &&
              student.corrections.find((c) => c.id === correctionId)?.type ===
                "phone"
                ? {
                    phone:
                      student.corrections.find((c) => c.id === correctionId)
                        ?.requestedValue || student.phone,
                  }
                : {}),
            }
          : student,
      ),
    );

    toast({
      title: approved ? "Correction Approved" : "Correction Rejected",
      description: `The correction request has been ${approved ? "approved" : "rejected"}.`,
    });
  };

  const submitCorrectionRequest = (studentId: string) => {
    if (
      !newCorrectionRequest.type ||
      !newCorrectionRequest.requestedValue ||
      !newCorrectionRequest.reason
    ) {
      toast({
        title: "Invalid Request",
        description: "Please fill in all required fields.",
        variant: "destructive",
      });
      return;
    }

    const student = students.find((s) => s.id === studentId);
    if (!student) return;

    const currentValue =
      newCorrectionRequest.type === "name"
        ? student.name
        : newCorrectionRequest.type === "department"
          ? student.currentDepartment
          : newCorrectionRequest.type === "email"
            ? student.email
            : student.phone;

    const newCorrection: CorrectionRequest = {
      id: `c${Date.now()}`,
      type: newCorrectionRequest.type as
        | "name"
        | "department"
        | "email"
        | "phone",
      currentValue,
      requestedValue: newCorrectionRequest.requestedValue,
      reason: newCorrectionRequest.reason,
      status: "pending",
      requestDate: new Date().toISOString().split("T")[0],
      requestedBy: "Admin",
    };

    setStudents((prev) =>
      prev.map((s) =>
        s.id === studentId
          ? { ...s, corrections: [...s.corrections, newCorrection] }
          : s,
      ),
    );

    setNewCorrectionRequest({});
    toast({
      title: "Correction Request Submitted",
      description: "The correction request has been submitted for review.",
    });
  };

  const getStatusBadge = (status: string) => {
    const config = {
      active: { color: "bg-green-100 text-green-800", label: "Active" },
      inactive: { color: "bg-gray-100 text-gray-800", label: "Inactive" },
      graduated: { color: "bg-blue-100 text-blue-800", label: "Graduated" },
      dropped: { color: "bg-red-100 text-red-800", label: "Dropped" },
    };

    const { color, label } =
      config[status as keyof typeof config] || config.active;
    return <Badge className={color}>{label}</Badge>;
  };

  const getCorrectionStatusBadge = (status: string) => {
    const config = {
      pending: { color: "bg-yellow-100 text-yellow-800", label: "Pending" },
      approved: { color: "bg-green-100 text-green-800", label: "Approved" },
      rejected: { color: "bg-red-100 text-red-800", label: "Rejected" },
    };

    const { color, label } =
      config[status as keyof typeof config] || config.pending;
    return <Badge className={color}>{label}</Badge>;
  };

  const getCorrectionTypeBadge = (type: string) => {
    const config = {
      name: { color: "bg-blue-100 text-blue-800", label: "Name", icon: User },
      department: {
        color: "bg-purple-100 text-purple-800",
        label: "Department",
        icon: Building,
      },
      email: {
        color: "bg-orange-100 text-orange-800",
        label: "Email",
        icon: Mail,
      },
      phone: {
        color: "bg-teal-100 text-teal-800",
        label: "Phone",
        icon: Phone,
      },
    };

    const item = config[type as keyof typeof config] || config.name;
    return (
      <Badge className={item.color}>
        <item.icon className="w-3 h-3 mr-1" />
        {item.label}
      </Badge>
    );
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-deep-plum font-poppins">
          Student Management
        </h1>
        <p className="text-gray-600 mt-1">
          Manage student information, department changes, and name corrections
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">
                  Total Students
                </p>
                <p className="text-3xl font-bold text-deep-plum">
                  {stats.totalStudents}
                </p>
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
                <p className="text-sm font-medium text-gray-600">
                  Active Students
                </p>
                <p className="text-3xl font-bold text-deep-plum">
                  {stats.activeStudents}
                </p>
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
                <p className="text-sm font-medium text-gray-600">
                  Pending Corrections
                </p>
                <p className="text-3xl font-bold text-deep-plum">
                  {stats.pendingCorrections}
                </p>
              </div>
              <div className="p-3 rounded-full bg-yellow-100">
                <AlertTriangle className="w-6 h-6 text-yellow-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">
                  Transfer Requests
                </p>
                <p className="text-3xl font-bold text-deep-plum">
                  {stats.departmentTransfers}
                </p>
              </div>
              <div className="p-3 rounded-full bg-purple-100">
                <Building className="w-6 h-6 text-purple-600" />
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

            <Select
              value={departmentFilter}
              onValueChange={setDepartmentFilter}
            >
              <SelectTrigger className="md:w-48">
                <SelectValue placeholder="Filter by Department" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Departments</SelectItem>
                {departments.map((dept) => (
                  <SelectItem key={dept} value={dept}>
                    {dept}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="md:w-40">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="inactive">Inactive</SelectItem>
                <SelectItem value="graduated">Graduated</SelectItem>
                <SelectItem value="dropped">Dropped</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Students Table */}
      <Card>
        <CardHeader>
          <CardTitle className="text-xl font-poppins text-deep-plum">
            Students ({filteredStudents.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Student Info</TableHead>
                <TableHead>Contact</TableHead>
                <TableHead>Department & Program</TableHead>
                <TableHead>CGPA</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Pending Corrections</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredStudents.map((student) => (
                <TableRow key={student.id}>
                  <TableCell>
                    <div>
                      <div className="font-medium">{student.name}</div>
                      <div className="text-sm text-gray-500">
                        {student.studentId}
                      </div>
                      <div className="text-sm text-gray-500">
                        Admitted:{" "}
                        {new Date(student.admissionDate).toLocaleDateString()}
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div>
                      <div className="text-sm">{student.email}</div>
                      <div className="text-sm text-gray-500">
                        {student.phone}
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div>
                      <div className="font-medium">
                        {student.currentDepartment}
                      </div>
                      <div className="text-sm text-gray-500">
                        {student.currentProgram}
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline" className="font-bold">
                      {student.cgpa.toFixed(2)}
                    </Badge>
                  </TableCell>
                  <TableCell>{getStatusBadge(student.status)}</TableCell>
                  <TableCell>
                    <div className="space-y-1">
                      {student.corrections
                        .filter((c) => c.status === "pending")
                        .map((correction) => (
                          <div
                            key={correction.id}
                            className="flex items-center gap-2"
                          >
                            {getCorrectionTypeBadge(correction.type)}
                          </div>
                        ))}
                      {student.corrections.filter((c) => c.status === "pending")
                        .length === 0 && (
                        <span className="text-sm text-gray-500">None</span>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex gap-2">
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button variant="outline" size="sm">
                            <Edit className="w-3 h-3 mr-1" />
                            Manage
                          </Button>
                        </DialogTrigger>
                        <DialogContent className="max-w-4xl">
                          <DialogHeader>
                            <DialogTitle>
                              Manage Student: {student.name}
                            </DialogTitle>
                          </DialogHeader>
                          <div className="grid gap-6 py-4">
                            {/* Student Info */}
                            <div className="grid grid-cols-2 gap-4">
                              <div>
                                <Label>Student ID</Label>
                                <div className="text-lg font-mono">
                                  {student.studentId}
                                </div>
                              </div>
                              <div>
                                <Label>Current CGPA</Label>
                                <div className="text-lg font-bold text-blue-600">
                                  {student.cgpa.toFixed(2)}
                                </div>
                              </div>
                            </div>

                            {/* New Correction Request */}
                            <div className="border rounded-lg p-4 bg-gray-50">
                              <h3 className="font-semibold mb-3">
                                Submit New Correction Request
                              </h3>
                              <div className="grid gap-4">
                                <div className="grid grid-cols-2 gap-4">
                                  <div>
                                    <Label>Correction Type</Label>
                                    <Select
                                      value={newCorrectionRequest.type || ""}
                                      onValueChange={(value) =>
                                        setNewCorrectionRequest((prev) => ({
                                          ...prev,
                                          type: value,
                                        }))
                                      }
                                    >
                                      <SelectTrigger>
                                        <SelectValue placeholder="Select type" />
                                      </SelectTrigger>
                                      <SelectContent>
                                        <SelectItem value="name">
                                          Name Correction
                                        </SelectItem>
                                        <SelectItem value="department">
                                          Department Transfer
                                        </SelectItem>
                                        <SelectItem value="email">
                                          Email Update
                                        </SelectItem>
                                        <SelectItem value="phone">
                                          Phone Update
                                        </SelectItem>
                                      </SelectContent>
                                    </Select>
                                  </div>
                                  <div>
                                    <Label>New Value</Label>
                                    {newCorrectionRequest.type ===
                                    "department" ? (
                                      <Select
                                        value={
                                          newCorrectionRequest.requestedValue ||
                                          ""
                                        }
                                        onValueChange={(value) =>
                                          setNewCorrectionRequest((prev) => ({
                                            ...prev,
                                            requestedValue: value,
                                          }))
                                        }
                                      >
                                        <SelectTrigger>
                                          <SelectValue placeholder="Select department" />
                                        </SelectTrigger>
                                        <SelectContent>
                                          {departments.map((dept) => (
                                            <SelectItem key={dept} value={dept}>
                                              {dept}
                                            </SelectItem>
                                          ))}
                                        </SelectContent>
                                      </Select>
                                    ) : (
                                      <Input
                                        placeholder="Enter new value"
                                        value={
                                          newCorrectionRequest.requestedValue ||
                                          ""
                                        }
                                        onChange={(e) =>
                                          setNewCorrectionRequest((prev) => ({
                                            ...prev,
                                            requestedValue: e.target.value,
                                          }))
                                        }
                                      />
                                    )}
                                  </div>
                                </div>
                                <div>
                                  <Label>Reason for Correction</Label>
                                  <Textarea
                                    placeholder="Provide a detailed reason for this correction..."
                                    value={newCorrectionRequest.reason || ""}
                                    onChange={(e) =>
                                      setNewCorrectionRequest((prev) => ({
                                        ...prev,
                                        reason: e.target.value,
                                      }))
                                    }
                                  />
                                </div>
                                <Button
                                  onClick={() =>
                                    submitCorrectionRequest(student.id)
                                  }
                                >
                                  <Save className="w-4 h-4 mr-2" />
                                  Submit Request
                                </Button>
                              </div>
                            </div>

                            {/* Existing Corrections */}
                            <div>
                              <h3 className="font-semibold mb-3">
                                Correction History
                              </h3>
                              <div className="space-y-3">
                                {student.corrections.map((correction) => (
                                  <div
                                    key={correction.id}
                                    className="border rounded-lg p-4"
                                  >
                                    <div className="flex justify-between items-start mb-2">
                                      <div className="flex items-center gap-2">
                                        {getCorrectionTypeBadge(
                                          correction.type,
                                        )}
                                        {getCorrectionStatusBadge(
                                          correction.status,
                                        )}
                                      </div>
                                      <div className="text-sm text-gray-500">
                                        {new Date(
                                          correction.requestDate,
                                        ).toLocaleDateString()}
                                      </div>
                                    </div>
                                    <div className="grid grid-cols-2 gap-4 text-sm">
                                      <div>
                                        <span className="font-medium">
                                          Current:
                                        </span>{" "}
                                        {correction.currentValue}
                                      </div>
                                      <div>
                                        <span className="font-medium">
                                          Requested:
                                        </span>{" "}
                                        {correction.requestedValue}
                                      </div>
                                    </div>
                                    <div className="text-sm text-gray-600 mt-2">
                                      <span className="font-medium">
                                        Reason:
                                      </span>{" "}
                                      {correction.reason}
                                    </div>

                                    {correction.status === "pending" && (
                                      <div className="flex gap-2 mt-3">
                                        <Button
                                          size="sm"
                                          className="bg-green-600 hover:bg-green-700"
                                          onClick={() =>
                                            handleCorrectionApproval(
                                              student.id,
                                              correction.id,
                                              true,
                                            )
                                          }
                                        >
                                          <CheckCircle className="w-3 h-3 mr-1" />
                                          Approve
                                        </Button>
                                        <Button
                                          size="sm"
                                          variant="outline"
                                          className="text-red-600 border-red-200 hover:bg-red-50"
                                          onClick={() =>
                                            handleCorrectionApproval(
                                              student.id,
                                              correction.id,
                                              false,
                                            )
                                          }
                                        >
                                          <X className="w-3 h-3 mr-1" />
                                          Reject
                                        </Button>
                                      </div>
                                    )}
                                  </div>
                                ))}

                                {student.corrections.length === 0 && (
                                  <div className="text-center py-8 text-gray-500">
                                    <FileText className="w-12 h-12 mx-auto mb-2 text-gray-400" />
                                    No correction history found
                                  </div>
                                )}
                              </div>
                            </div>
                          </div>
                        </DialogContent>
                      </Dialog>

                      <Dialog>
                        <DialogTrigger asChild>
                          <Button
                            variant="outline"
                            size="sm"
                            className="text-blue-600 border-blue-200 hover:bg-blue-50"
                          >
                            <History className="w-3 h-3 mr-1" />
                            History
                          </Button>
                        </DialogTrigger>
                        <DialogContent>
                          <DialogHeader>
                            <DialogTitle>
                              Change History: {student.name}
                            </DialogTitle>
                          </DialogHeader>
                          <div className="py-4">
                            <div className="space-y-4">
                              <div className="border-l-4 border-blue-500 pl-4">
                                <div className="font-medium">
                                  Student Admitted
                                </div>
                                <div className="text-sm text-gray-600">
                                  {new Date(
                                    student.admissionDate,
                                  ).toLocaleDateString()}
                                </div>
                                <div className="text-sm text-gray-500">
                                  Department: {student.currentDepartment}
                                </div>
                              </div>

                              {student.corrections
                                .filter((c) => c.status === "approved")
                                .map((correction) => (
                                  <div
                                    key={correction.id}
                                    className="border-l-4 border-green-500 pl-4"
                                  >
                                    <div className="font-medium">
                                      {correction.type.charAt(0).toUpperCase() +
                                        correction.type.slice(1)}{" "}
                                      Updated
                                    </div>
                                    <div className="text-sm text-gray-600">
                                      {new Date(
                                        correction.requestDate,
                                      ).toLocaleDateString()}
                                    </div>
                                    <div className="text-sm text-gray-500">
                                      Changed from "{correction.currentValue}"
                                      to "{correction.requestedValue}"
                                    </div>
                                  </div>
                                ))}
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
