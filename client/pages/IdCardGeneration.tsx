import React, { useState } from "react";
import {
  Search,
  Filter,
  Users,
  Shield,
  Calendar,
  Building,
  Eye,
  Download,
  CheckCircle,
  Clock,
  User,
  Mail,
  Phone,
  MapPin,
  FileText,
  Printer,
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
import { Checkbox } from "../components/ui/checkbox";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../components/ui/dialog";
import { Label } from "../components/ui/label";
import { Separator } from "../components/ui/separator";
import { useToast } from "../hooks/use-toast";

interface Student {
  id: string;
  name: string;
  studentId: string;
  email: string;
  phone: string;
  department: string;
  program: string;
  batch: string;
  admissionDate: string;
  idCardStatus: "generated" | "pending";
  generatedDate?: string;
  isSelected: boolean;
  profilePhoto: string;
  address: string;
  bloodGroup: string;
  emergencyContact: string;
}

const mockStudents: Student[] = [
  {
    id: "1",
    name: "Mohammad Rahman",
    studentId: "NUB-CSE-2024-001",
    email: "mohammad.rahman@example.com",
    phone: "+8801712345678",
    department: "Computer Science",
    program: "BSc in CSE",
    batch: "Spring 2024",
    admissionDate: "2024-01-15",
    idCardStatus: "generated",
    generatedDate: "2024-02-15",
    isSelected: false,
    profilePhoto: "/placeholder.svg",
    address: "Dhaka, Bangladesh",
    bloodGroup: "B+",
    emergencyContact: "+8801987654321",
  },
  {
    id: "2",
    name: "Fatima Sultana",
    studentId: "NUB-BBA-2024-002",
    email: "fatima.sultana@example.com",
    phone: "+8801887654321",
    department: "Business Administration",
    program: "BBA",
    batch: "Spring 2024",
    admissionDate: "2024-01-20",
    idCardStatus: "pending",
    isSelected: false,
    profilePhoto: "/placeholder.svg",
    address: "Chittagong, Bangladesh",
    bloodGroup: "A+",
    emergencyContact: "+8801876543210",
  },
  {
    id: "3",
    name: "Ahmed Hassan",
    studentId: "NUB-EEE-2024-003",
    email: "ahmed.hassan@example.com",
    phone: "+8801598765432",
    department: "Electrical Engineering",
    program: "BSc in EEE",
    batch: "Spring 2024",
    admissionDate: "2024-01-25",
    idCardStatus: "pending",
    isSelected: false,
    profilePhoto: "/placeholder.svg",
    address: "Sylhet, Bangladesh",
    bloodGroup: "O+",
    emergencyContact: "+8801765432109",
  },
  {
    id: "4",
    name: "Rashida Begum",
    studentId: "NUB-CE-2024-004",
    email: "rashida.begum@example.com",
    phone: "+8801623456789",
    department: "Civil Engineering",
    program: "BSc in Civil",
    batch: "Spring 2024",
    admissionDate: "2024-02-01",
    idCardStatus: "generated",
    generatedDate: "2024-02-20",
    isSelected: false,
    profilePhoto: "/placeholder.svg",
    address: "Rajshahi, Bangladesh",
    bloodGroup: "AB+",
    emergencyContact: "+8801654321098",
  },
  {
    id: "5",
    name: "Karim Uddin",
    studentId: "NUB-CSE-2024-005",
    email: "karim.uddin@example.com",
    phone: "+8801734567890",
    department: "Computer Science",
    program: "BSc in CSE",
    batch: "Spring 2024",
    admissionDate: "2024-02-10",
    idCardStatus: "pending",
    isSelected: false,
    profilePhoto: "/placeholder.svg",
    address: "Barisal, Bangladesh",
    bloodGroup: "O-",
    emergencyContact: "+8801543210987",
  },
  {
    id: "6",
    name: "Sakina Akter",
    studentId: "NUB-BBA-2024-006",
    email: "sakina.akter@example.com",
    phone: "+8801845612345",
    department: "Business Administration",
    program: "BBA",
    batch: "Spring 2024",
    admissionDate: "2024-02-15",
    idCardStatus: "pending",
    isSelected: false,
    profilePhoto: "/placeholder.svg",
    address: "Khulna, Bangladesh",
    bloodGroup: "A-",
    emergencyContact: "+8801432109876",
  },
];

const departments = [
  "All Departments",
  "Computer Science",
  "Business Administration",
  "Electrical Engineering",
  "Civil Engineering",
  "Mechanical Engineering",
];

export default function IdCardGeneration() {
  const { toast } = useToast();
  const [students, setStudents] = useState<Student[]>(mockStudents);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [departmentFilter, setDepartmentFilter] = useState("All Departments");
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");
  const [previewStudent, setPreviewStudent] = useState<Student | null>(null);

  const filteredStudents = students.filter((student) => {
    const matchesSearch =
      student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      student.studentId.toLowerCase().includes(searchTerm.toLowerCase()) ||
      student.email.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus =
      statusFilter === "all" || student.idCardStatus === statusFilter;

    const matchesDepartment =
      departmentFilter === "All Departments" ||
      student.department === departmentFilter;

    const matchesDateRange =
      (!dateFrom || student.admissionDate >= dateFrom) &&
      (!dateTo || student.admissionDate <= dateTo);

    return (
      matchesSearch && matchesStatus && matchesDepartment && matchesDateRange
    );
  });

  const stats = {
    totalStudents: students.length,
    generatedCards: students.filter((s) => s.idCardStatus === "generated")
      .length,
    pendingCards: students.filter((s) => s.idCardStatus === "pending").length,
    selectedStudents: students.filter((s) => s.isSelected).length,
  };

  const toggleStudentSelection = (studentId: string) => {
    setStudents((prev) =>
      prev.map((student) =>
        student.id === studentId
          ? { ...student, isSelected: !student.isSelected }
          : student,
      ),
    );
  };

  const selectAllFiltered = () => {
    const allSelected = filteredStudents.every((s) => s.isSelected);
    setStudents((prev) =>
      prev.map((student) => ({
        ...student,
        isSelected: filteredStudents.includes(student)
          ? !allSelected
          : student.isSelected,
      })),
    );
  };

  const selectAllByDepartment = (department: string) => {
    const departmentStudents = students.filter(
      (s) => s.department === department && s.idCardStatus === "pending",
    );
    setStudents((prev) =>
      prev.map((student) => ({
        ...student,
        isSelected: departmentStudents.includes(student)
          ? true
          : student.isSelected,
      })),
    );

    toast({
      title: "Department Selected",
      description: `Selected all pending students from ${department} department.`,
    });
  };

  const generateIdCard = (studentId: string) => {
    setStudents((prev) =>
      prev.map((student) =>
        student.id === studentId
          ? {
              ...student,
              idCardStatus: "generated" as const,
              generatedDate: new Date().toISOString().split("T")[0],
              isSelected: false,
            }
          : student,
      ),
    );

    const student = students.find((s) => s.id === studentId);
    toast({
      title: "ID Card Generated",
      description: `ID card generated successfully for ${student?.name}.`,
    });
  };

  const generateBulkIdCards = () => {
    const selectedCount = students.filter(
      (s) => s.isSelected && s.idCardStatus === "pending",
    ).length;

    if (selectedCount === 0) {
      toast({
        title: "No Students Selected",
        description: "Please select at least one student with pending status.",
        variant: "destructive",
      });
      return;
    }

    setStudents((prev) =>
      prev.map((student) =>
        student.isSelected && student.idCardStatus === "pending"
          ? {
              ...student,
              idCardStatus: "generated" as const,
              generatedDate: new Date().toISOString().split("T")[0],
              isSelected: false,
            }
          : student,
      ),
    );

    toast({
      title: "Bulk ID Cards Generated",
      description: `Generated ID cards for ${selectedCount} students successfully.`,
    });
  };

  const getStatusBadge = (status: string) => {
    const config = {
      generated: { color: "bg-green-100 text-green-800", label: "Generated" },
      pending: { color: "bg-yellow-100 text-yellow-800", label: "Pending" },
    };

    const { color, label } =
      config[status as keyof typeof config] || config.pending;
    return <Badge className={color}>{label}</Badge>;
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-deep-plum font-poppins">
          ID Card Generation
        </h1>
        <p className="text-gray-600 mt-1">
          Generate and manage student ID cards with bulk operations
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
                <Users className="w-6 h-6 text-blue-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">
                  Generated Cards
                </p>
                <p className="text-3xl font-bold text-deep-plum">
                  {stats.generatedCards}
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
                  Pending Cards
                </p>
                <p className="text-3xl font-bold text-deep-plum">
                  {stats.pendingCards}
                </p>
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
                <p className="text-sm font-medium text-gray-600">
                  Selected Students
                </p>
                <p className="text-3xl font-bold text-deep-plum">
                  {stats.selectedStudents}
                </p>
              </div>
              <div className="p-3 rounded-full bg-purple-100">
                <Shield className="w-6 h-6 text-purple-600" />
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
                  placeholder="Search by name, student ID, or email..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>

              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="md:w-40">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="generated">Generated</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                </SelectContent>
              </Select>

              <Select
                value={departmentFilter}
                onValueChange={setDepartmentFilter}
              >
                <SelectTrigger className="md:w-48">
                  <SelectValue placeholder="Department" />
                </SelectTrigger>
                <SelectContent>
                  {departments.map((dept) => (
                    <SelectItem key={dept} value={dept}>
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

      {/* Quick Actions */}
      <Card className="mb-8">
        <CardHeader>
          <CardTitle className="text-xl font-poppins text-deep-plum">
            Quick Actions
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-4">
            <Button
              onClick={selectAllFiltered}
              variant="outline"
              className="border-blue-500 text-blue-600 hover:bg-blue-50"
            >
              <CheckCircle className="w-4 h-4 mr-2" />
              Select All Filtered
            </Button>

            {departments.slice(1).map((dept) => (
              <Button
                key={dept}
                onClick={() => selectAllByDepartment(dept)}
                variant="outline"
                className="border-purple-500 text-purple-600 hover:bg-purple-50"
              >
                <Building className="w-4 h-4 mr-2" />
                Select {dept}
              </Button>
            ))}

            <Button
              onClick={generateBulkIdCards}
              className="bg-deep-plum hover:bg-accent-purple"
              disabled={stats.selectedStudents === 0}
            >
              <Printer className="w-4 h-4 mr-2" />
              Generate Selected ({stats.selectedStudents})
            </Button>
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
                <TableHead className="w-12">
                  <Checkbox
                    checked={
                      filteredStudents.length > 0 &&
                      filteredStudents.every((s) => s.isSelected)
                    }
                    onCheckedChange={selectAllFiltered}
                  />
                </TableHead>
                <TableHead>Student Info</TableHead>
                <TableHead>Contact</TableHead>
                <TableHead>Department</TableHead>
                <TableHead>Admission Date</TableHead>
                <TableHead>ID Card Status</TableHead>
                <TableHead>Generated Date</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredStudents.map((student) => (
                <TableRow
                  key={student.id}
                  className={student.isSelected ? "bg-blue-50" : ""}
                >
                  <TableCell>
                    <Checkbox
                      checked={student.isSelected}
                      onCheckedChange={() => toggleStudentSelection(student.id)}
                    />
                  </TableCell>
                  <TableCell>
                    <div>
                      <div className="font-medium">{student.name}</div>
                      <div className="text-sm text-gray-500">
                        {student.studentId}
                      </div>
                      <div className="text-sm text-gray-500">
                        {student.batch}
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
                      <div className="font-medium">{student.department}</div>
                      <div className="text-sm text-gray-500">
                        {student.program}
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    {new Date(student.admissionDate).toLocaleDateString()}
                  </TableCell>
                  <TableCell>{getStatusBadge(student.idCardStatus)}</TableCell>
                  <TableCell>
                    {student.generatedDate
                      ? new Date(student.generatedDate).toLocaleDateString()
                      : "-"}
                  </TableCell>
                  <TableCell>
                    <div className="flex gap-2">
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => setPreviewStudent(student)}
                          >
                            <Eye className="w-3 h-3 mr-1" />
                            Preview
                          </Button>
                        </DialogTrigger>
                        <DialogContent className="max-w-2xl">
                          <DialogHeader>
                            <DialogTitle>ID Card Preview</DialogTitle>
                          </DialogHeader>
                          <div className="py-4">
                            {previewStudent && (
                              <IdCardPreview student={previewStudent} />
                            )}
                          </div>
                        </DialogContent>
                      </Dialog>

                      {student.idCardStatus === "pending" && (
                        <Button
                          size="sm"
                          className="bg-green-600 hover:bg-green-700"
                          onClick={() => generateIdCard(student.id)}
                        >
                          <Printer className="w-3 h-3 mr-1" />
                          Generate
                        </Button>
                      )}

                      {student.idCardStatus === "generated" && (
                        <Button
                          variant="outline"
                          size="sm"
                          className="text-blue-600 border-blue-200 hover:bg-blue-50"
                        >
                          <Download className="w-3 h-3 mr-1" />
                          Download
                        </Button>
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

// ID Card Preview Component
function IdCardPreview({ student }: { student: Student }) {
  return (
    <div className="max-w-md mx-auto">
      {/* Front Side */}
      <div className="bg-gradient-to-br from-deep-plum to-accent-purple rounded-lg p-6 text-white shadow-xl mb-4">
        <div className="text-center mb-4">
          <h3 className="text-lg font-bold">Northern University Bangladesh</h3>
          <p className="text-sm opacity-90">Student Identity Card</p>
        </div>

        <div className="flex gap-4">
          {/* Photo */}
          <div className="w-20 h-24 bg-white rounded border-2 border-white flex items-center justify-center">
            <User className="w-12 h-12 text-gray-400" />
          </div>

          {/* Details */}
          <div className="flex-1 space-y-1 text-sm">
            <div>
              <span className="opacity-75">Name:</span>
              <div className="font-semibold">{student.name}</div>
            </div>
            <div>
              <span className="opacity-75">ID:</span>
              <div className="font-mono font-semibold">{student.studentId}</div>
            </div>
            <div>
              <span className="opacity-75">Department:</span>
              <div className="font-semibold text-xs">{student.department}</div>
            </div>
            <div>
              <span className="opacity-75">Batch:</span>
              <div className="font-semibold">{student.batch}</div>
            </div>
          </div>
        </div>

        <div className="mt-4 pt-3 border-t border-white/30 text-center">
          <p className="text-xs opacity-75">Valid for Academic Session</p>
        </div>
      </div>

      {/* Back Side */}
      <div className="bg-white border-2 border-gray-200 rounded-lg p-6 shadow-xl">
        <div className="text-center mb-4">
          <h4 className="font-bold text-deep-plum">Contact Information</h4>
        </div>

        <div className="space-y-3 text-sm">
          <div className="flex items-center gap-2">
            <Mail className="w-4 h-4 text-gray-500" />
            <span>{student.email}</span>
          </div>
          <div className="flex items-center gap-2">
            <Phone className="w-4 h-4 text-gray-500" />
            <span>{student.phone}</span>
          </div>
          <div className="flex items-center gap-2">
            <MapPin className="w-4 h-4 text-gray-500" />
            <span>{student.address}</span>
          </div>
          <div className="flex items-center gap-2">
            <FileText className="w-4 h-4 text-gray-500" />
            <span>Blood Group: {student.bloodGroup}</span>
          </div>
          <div className="flex items-center gap-2">
            <Phone className="w-4 h-4 text-gray-500" />
            <span>Emergency: {student.emergencyContact}</span>
          </div>
        </div>

        <div className="mt-4 pt-3 border-t border-gray-200 text-center">
          <p className="text-xs text-gray-500">
            If found, please return to NUB
          </p>
          <p className="text-xs text-gray-500">+880-XXXX-XXXXXX</p>
        </div>
      </div>
    </div>
  );
}
