import React, { useState, useEffect } from "react";
import {
  Search,
  Filter,
  Award,
  Lock,
  Unlock,
  Edit,
  Save,
  X,
  Users,
  TrendingUp,
  DollarSign,
  Eye,
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
  SelectGroup,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  SelectLabel,
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
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../components/ui/dialog";
import { Label } from "../components/ui/label";
import { useToast } from "../hooks/use-toast";
import {
  getResultBasedWaivers,
  getSpecialWaivers,
  getAdditionalWaivers,
  getWaiverById,
} from "../lib/programData";

interface WaiverStudent {
  id: string;
  name: string;
  studentId: string;
  department: string;
  program: string;
  email: string;
  phone: string;
  waiverType: string;
  waiverAmount: number;
  totalFee: number;
  waiverPercentage: number;
  isLocked: boolean;
  appliedDate: string;
  status: "active" | "expired" | "pending";
  criteria: {
    academicPerformance: number;
    financialNeed: number;
    extracurricular: number;
    familyIncome: number;
  };
}

interface WaiverCriteria {
  academicPerformance: { min: number; percentage: number };
  financialNeed: { threshold: number; percentage: number };
  extracurricular: { points: number; percentage: number };
  familyIncome: { maxAmount: number; percentage: number };
}

const mockStudents: WaiverStudent[] = [
  {
    id: "1",
    name: "Fatima Rahman",
    studentId: "NUB-2024-001",
    department: "Computer Science",
    program: "BSc in CSE",
    email: "fatima.rahman@example.com",
    phone: "+8801712345678",
    waiverType: "Merit Scholarship",
    waiverAmount: 25000,
    totalFee: 60000,
    waiverPercentage: 42,
    isLocked: false,
    appliedDate: "2024-01-15",
    status: "active",
    criteria: {
      academicPerformance: 95,
      financialNeed: 70,
      extracurricular: 85,
      familyIncome: 45000,
    },
  },
  {
    id: "2",
    name: "Mohammad Hasan",
    studentId: "NUB-2024-002",
    department: "Business Administration",
    program: "BBA",
    email: "mohammad.hasan@example.com",
    phone: "+8801887654321",
    waiverType: "Financial Aid",
    waiverAmount: 30000,
    totalFee: 55000,
    waiverPercentage: 55,
    isLocked: true,
    appliedDate: "2024-01-20",
    status: "active",
    criteria: {
      academicPerformance: 78,
      financialNeed: 95,
      extracurricular: 60,
      familyIncome: 25000,
    },
  },
  {
    id: "3",
    name: "Ayesha Sultana",
    studentId: "NUB-2024-003",
    department: "Electrical Engineering",
    program: "BSc in EEE",
    email: "ayesha.sultana@example.com",
    phone: "+8801598765432",
    waiverType: "Sports Scholarship",
    waiverAmount: 20000,
    totalFee: 65000,
    waiverPercentage: 31,
    isLocked: false,
    appliedDate: "2024-02-01",
    status: "active",
    criteria: {
      academicPerformance: 82,
      financialNeed: 55,
      extracurricular: 98,
      familyIncome: 65000,
    },
  },
  {
    id: "4",
    name: "Rahim Ahmed",
    studentId: "NUB-2024-004",
    department: "Civil Engineering",
    program: "BSc in Civil",
    email: "rahim.ahmed@example.com",
    phone: "+8801623456789",
    waiverType: "Need-based Aid",
    waiverAmount: 35000,
    totalFee: 58000,
    waiverPercentage: 60,
    isLocked: false,
    appliedDate: "2024-02-10",
    status: "pending",
    criteria: {
      academicPerformance: 88,
      financialNeed: 90,
      extracurricular: 70,
      familyIncome: 30000,
    },
  },
  {
    id: "5",
    name: "Sakina Begum",
    studentId: "NUB-2024-005",
    department: "Computer Science",
    program: "BSc in CSE",
    email: "sakina.begum@example.com",
    phone: "+8801734567890",
    waiverType: "Academic Excellence",
    waiverAmount: 28000,
    totalFee: 60000,
    waiverPercentage: 47,
    isLocked: true,
    appliedDate: "2024-02-15",
    status: "active",
    criteria: {
      academicPerformance: 96,
      financialNeed: 40,
      extracurricular: 75,
      familyIncome: 80000,
    },
  },
];

const departments = [
  "All Departments",
  "Computer Science",
  "Business Administration",
  "Electrical Engineering",
  "Civil Engineering",
  "Mechanical Engineering",
  "Architecture",
];

export default function WaiverManagement() {
  const { toast } = useToast();
  const [students, setStudents] = useState<WaiverStudent[]>(mockStudents);
  const [searchTerm, setSearchTerm] = useState("");
  const [departmentFilter, setDepartmentFilter] = useState("All Departments");
  const [statusFilter, setStatusFilter] = useState("all");
  const [editingCriteria, setEditingCriteria] = useState<string | null>(null);
  const [criteriaValues, setCriteriaValues] = useState<WaiverCriteria>({
    academicPerformance: { min: 85, percentage: 40 },
    financialNeed: { threshold: 50000, percentage: 50 },
    extracurricular: { points: 80, percentage: 30 },
    familyIncome: { maxAmount: 40000, percentage: 60 },
  });

  const filteredStudents = students.filter((student) => {
    const matchesSearch =
      student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      student.studentId.toLowerCase().includes(searchTerm.toLowerCase()) ||
      student.email.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesDepartment =
      departmentFilter === "All Departments" ||
      student.department === departmentFilter;

    const matchesStatus =
      statusFilter === "all" || student.status === statusFilter;

    return matchesSearch && matchesDepartment && matchesStatus;
  });

  const stats = {
    totalWaivers: students.length,
    activeWaivers: students.filter((s) => s.status === "active").length,
    totalWaiverAmount: students.reduce((sum, s) => sum + s.waiverAmount, 0),
    averageWaiverPercentage: Math.round(
      students.reduce((sum, s) => sum + s.waiverPercentage, 0) /
        students.length,
    ),
  };

  const toggleWaiverLock = (studentId: string) => {
    setStudents((prev) =>
      prev.map((student) =>
        student.id === studentId
          ? { ...student, isLocked: !student.isLocked }
          : student,
      ),
    );

    const student = students.find((s) => s.id === studentId);
    toast({
      title: student?.isLocked ? "Waiver Unlocked" : "Waiver Locked",
      description: `${student?.name}'s waiver has been ${student?.isLocked ? "unlocked" : "locked"}.`,
    });
  };

  const updateWaiverForStudent = (studentId: string, updates: { amount?: number; waiverId?: string; status?: string }) => {
    setStudents((prev) =>
      prev.map((student) => {
        if (student.id !== studentId) return student;
        let updated = { ...student };
        if (updates.waiverId) {
          const policy = getWaiverById(updates.waiverId);
          if (policy) {
            const amount = Math.round((student.totalFee * policy.percentage) / 100);
            updated = {
              ...updated,
              waiverType: policy.name,
              waiverPercentage: policy.percentage,
              waiverAmount: amount,
            };
          }
        }
        if (typeof updates.amount === "number") {
          const amt = updates.amount;
          updated = {
            ...updated,
            waiverAmount: amt,
            waiverPercentage: Math.round((amt / student.totalFee) * 100),
          };
        }
        if (updates.status) {
          updated = { ...updated, status: updates.status as any };
        }
        return updated;
      }),
    );

    toast({ title: "Waiver Updated", description: "Waiver details have been saved." });
  };

  const updateWaiverAmount = (studentId: string, newAmount: number) => {
    setStudents((prev) =>
      prev.map((student) =>
        student.id === studentId
          ? {
              ...student,
              waiverAmount: newAmount,
              waiverPercentage: Math.round(
                (newAmount / student.totalFee) * 100,
              ),
            }
          : student,
      ),
    );

    toast({
      title: "Waiver Updated",
      description: "Waiver amount has been successfully updated.",
    });
  };

  const getStatusBadge = (status: string) => {
    const config = {
      active: { color: "bg-green-100 text-green-800", label: "Active" },
      expired: { color: "bg-red-100 text-red-800", label: "Expired" },
      pending: { color: "bg-yellow-100 text-yellow-800", label: "Pending" },
    };

    const { color, label } =
      config[status as keyof typeof config] || config.pending;
    return <Badge className={color}>{label}</Badge>;
  };

  const getWaiverTypeBadge = (type: string) => {
    const config = {
      "Merit Scholarship": "bg-blue-100 text-blue-800",
      "Financial Aid": "bg-purple-100 text-purple-800",
      "Sports Scholarship": "bg-orange-100 text-orange-800",
      "Need-based Aid": "bg-teal-100 text-teal-800",
      "Academic Excellence": "bg-indigo-100 text-indigo-800",
    };

    return (
      <Badge
        className={
          config[type as keyof typeof config] || "bg-gray-100 text-gray-800"
        }
      >
        {type}
      </Badge>
    );
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-deep-plum font-poppins">
          Waiver Management
        </h1>
        <p className="text-gray-600 mt-1">
          Manage student waivers, scholarships, and financial aid programs
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">
                  Total Waivers
                </p>
                <p className="text-3xl font-bold text-deep-plum">
                  {stats.totalWaivers}
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
                  Active Waivers
                </p>
                <p className="text-3xl font-bold text-deep-plum">
                  {stats.activeWaivers}
                </p>
              </div>
              <div className="p-3 rounded-full bg-green-100">
                <TrendingUp className="w-6 h-6 text-green-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">
                  Total Amount
                </p>
                <p className="text-3xl font-bold text-deep-plum">
                  ৳{stats.totalWaiverAmount.toLocaleString()}
                </p>
              </div>
              <div className="p-3 rounded-full bg-purple-100">
                <DollarSign className="w-6 h-6 text-purple-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">
                  Avg. Waiver %
                </p>
                <p className="text-3xl font-bold text-deep-plum">
                  {stats.averageWaiverPercentage}%
                </p>
              </div>
              <div className="p-3 rounded-full bg-orange-100">
                <Award className="w-6 h-6 text-orange-600" />
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
                <SelectValue placeholder="Select Department" />
              </SelectTrigger>
              <SelectContent>
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
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="expired">Expired</SelectItem>
              </SelectContent>
            </Select>

            <Dialog>
              <DialogTrigger asChild>
                <Button
                  variant="outline"
                  className="border-accent-purple text-accent-purple hover:bg-accent-purple hover:text-white"
                >
                  <Edit className="w-4 h-4 mr-2" />
                  Edit Criteria
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl">
                <DialogHeader>
                  <DialogTitle>Edit Waiver Criteria</DialogTitle>
                </DialogHeader>
                <div className="grid gap-6 py-4">
                  <div className="grid gap-4">
                    <Label className="text-base font-semibold">
                      Academic Performance
                    </Label>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label>Minimum Score</Label>
                        <Input
                          type="number"
                          value={criteriaValues.academicPerformance.min}
                          onChange={(e) =>
                            setCriteriaValues((prev) => ({
                              ...prev,
                              academicPerformance: {
                                ...prev.academicPerformance,
                                min: Number(e.target.value),
                              },
                            }))
                          }
                        />
                      </div>
                      <div>
                        <Label>Waiver Percentage</Label>
                        <Input
                          type="number"
                          value={criteriaValues.academicPerformance.percentage}
                          onChange={(e) =>
                            setCriteriaValues((prev) => ({
                              ...prev,
                              academicPerformance: {
                                ...prev.academicPerformance,
                                percentage: Number(e.target.value),
                              },
                            }))
                          }
                        />
                      </div>
                    </div>
                  </div>

                  <div className="grid gap-4">
                    <Label className="text-base font-semibold">
                      Financial Need
                    </Label>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label>Income Threshold (৳)</Label>
                        <Input
                          type="number"
                          value={criteriaValues.financialNeed.threshold}
                          onChange={(e) =>
                            setCriteriaValues((prev) => ({
                              ...prev,
                              financialNeed: {
                                ...prev.financialNeed,
                                threshold: Number(e.target.value),
                              },
                            }))
                          }
                        />
                      </div>
                      <div>
                        <Label>Waiver Percentage</Label>
                        <Input
                          type="number"
                          value={criteriaValues.financialNeed.percentage}
                          onChange={(e) =>
                            setCriteriaValues((prev) => ({
                              ...prev,
                              financialNeed: {
                                ...prev.financialNeed,
                                percentage: Number(e.target.value),
                              },
                            }))
                          }
                        />
                      </div>
                    </div>
                  </div>

                  <div className="grid gap-4">
                    <Label className="text-base font-semibold">
                      Extracurricular Activities
                    </Label>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label>Minimum Points</Label>
                        <Input
                          type="number"
                          value={criteriaValues.extracurricular.points}
                          onChange={(e) =>
                            setCriteriaValues((prev) => ({
                              ...prev,
                              extracurricular: {
                                ...prev.extracurricular,
                                points: Number(e.target.value),
                              },
                            }))
                          }
                        />
                      </div>
                      <div>
                        <Label>Waiver Percentage</Label>
                        <Input
                          type="number"
                          value={criteriaValues.extracurricular.percentage}
                          onChange={(e) =>
                            setCriteriaValues((prev) => ({
                              ...prev,
                              extracurricular: {
                                ...prev.extracurricular,
                                percentage: Number(e.target.value),
                              },
                            }))
                          }
                        />
                      </div>
                    </div>
                  </div>

                  <Button
                    onClick={() => {
                      toast({
                        title: "Criteria Updated",
                        description:
                          "Waiver criteria have been successfully updated.",
                      });
                    }}
                  >
                    Save Changes
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </CardContent>
      </Card>

      {/* Students Table */}
      <Card>
        <CardHeader>
          <CardTitle className="text-xl font-poppins text-deep-plum">
            Students with Waivers ({filteredStudents.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Student Info</TableHead>
                <TableHead>Department</TableHead>
                <TableHead>Waiver Amount</TableHead>
                <TableHead>Percentage</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Lock Status</TableHead>
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
                        {student.email}
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
                    <div>
                      <div className="font-bold text-green-600">
                        ৳{student.waiverAmount.toLocaleString()}
                      </div>
                      <div className="text-sm text-gray-500">
                        of ৳{student.totalFee.toLocaleString()}
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline" className="font-bold">
                      {student.waiverPercentage}%
                    </Badge>
                  </TableCell>
                  <TableCell>{getStatusBadge(student.status)}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      {student.isLocked ? (
                        <Lock className="w-4 h-4 text-red-500" />
                      ) : (
                        <Unlock className="w-4 h-4 text-green-500" />
                      )}
                      <Switch
                        checked={student.isLocked}
                        onCheckedChange={() => toggleWaiverLock(student.id)}
                      />
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex gap-2">
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button variant="outline" size="sm">
                            <Eye className="w-3 h-3 mr-1" />
                            View
                          </Button>
                        </DialogTrigger>
                        <DialogContent>
                          <DialogHeader>
                            <DialogTitle>Student Waiver Details</DialogTitle>
                          </DialogHeader>
                          <div className="grid gap-4 py-4">
                            <div>
                              <Label>Waiver Percentage</Label>
                              <div className="text-2xl font-bold text-deep-plum">
                                {student.waiverPercentage}%
                              </div>
                              <div className="text-sm text-gray-500">
                                ৳{student.waiverAmount.toLocaleString()} of ৳{student.totalFee.toLocaleString()}
                              </div>
                            </div>

                            <div>
                              <Label>Date Applied</Label>
                              <div className="text-lg">
                                {new Date(student.appliedDate).toLocaleDateString()}
                              </div>
                            </div>

                            <div>
                              <Label>Status</Label>
                              <div>{getStatusBadge(student.status)}</div>
                            </div>

                            <div>
                              <Label>Applied Policies</Label>
                              <div className="space-y-1">
                                {(() => {
                                  const allPolicies = getResultBasedWaivers()
                                    .concat(getSpecialWaivers())
                                    .concat(getAdditionalWaivers());
                                  const matched = allPolicies.filter((p) => p.name === student.waiverType);
                                  return matched.length ? (
                                    matched.map((p) => (
                                      <div key={p.id} className="text-sm">
                                        {p.name} — {p.percentage}%
                                      </div>
                                    ))
                                  ) : (
                                    <div className="text-sm text-gray-500">{student.waiverType || 'None'}</div>
                                  );
                                })()}
                              </div>
                            </div>
                          </div>
                        </DialogContent>
                      </Dialog>

                      {!student.isLocked && (
                        <Dialog>
                          <DialogTrigger asChild>
                            <Button
                              variant="outline"
                              size="sm"
                              className="text-blue-600 border-blue-200 hover:bg-blue-50"
                            >
                              <Edit className="w-3 h-3 mr-1" />
                              Edit
                            </Button>
                          </DialogTrigger>
                              <DialogContent>
                            <DialogHeader>
                              <DialogTitle>Edit Waiver Amount & Type</DialogTitle>
                            </DialogHeader>
                            <div className="grid gap-4 py-4">
                              <div>
                                <Label>Choose Waiver Policy</Label>
                                <Select
                                  defaultValue={
                                    // try to find policy by name
                                    (getResultBasedWaivers()
                                      .concat(getSpecialWaivers())
                                      .concat(getAdditionalWaivers())
                                      .find((p) => p.name === student.waiverType)?.id as string) || undefined
                                  }
                                  onValueChange={(val) => {
                                    if (val) updateWaiverForStudent(student.id, { waiverId: val });
                                  }}
                                >
                                  <SelectTrigger className="md:w-full">
                                    <SelectValue placeholder="Select Waiver Policy" />
                                  </SelectTrigger>
                                  <SelectContent>
                                    <SelectLabel>Result-based (Merit)</SelectLabel>
                                    {getResultBasedWaivers().map((w) => (
                                      <SelectItem key={w.id} value={w.id}>{w.name} ({w.percentage}%)</SelectItem>
                                    ))}
                                    <SelectLabel>Special Waivers</SelectLabel>
                                    {getSpecialWaivers().map((w) => (
                                      <SelectItem key={w.id} value={w.id}>{w.name} ({w.percentage}%)</SelectItem>
                                    ))}
                                    <SelectLabel>Additional Waivers</SelectLabel>
                                    {getAdditionalWaivers().map((w) => (
                                      <SelectItem key={w.id} value={w.id}>{w.name} ({w.percentage}%)</SelectItem>
                                    ))}
                                  </SelectContent>
                                </Select>
                              </div>

                              <div>
                                <Label>Current Waiver Amount</Label>
                                <Input
                                  type="number"
                                  defaultValue={student.waiverAmount}
                                  onChange={(e) => {
                                    const newAmount = Number(e.target.value);
                                    if (newAmount >= 0 && newAmount <= student.totalFee) {
                                      updateWaiverForStudent(student.id, { amount: newAmount });
                                    }
                                  }}
                                />
                              </div>

                              <div>
                                <Label>Status</Label>
                                <Select
                                  defaultValue={student.status}
                                  onValueChange={(val) => updateWaiverForStudent(student.id, { status: val })}
                                >
                                  <SelectTrigger className="md:w-full">
                                    <SelectValue placeholder="Status" />
                                  </SelectTrigger>
                                  <SelectContent>
                                    <SelectItem value="active">Active</SelectItem>
                                    <SelectItem value="pending">Pending</SelectItem>
                                    <SelectItem value="expired">Expired</SelectItem>
                                  </SelectContent>
                                </Select>
                              </div>

                              <div className="text-sm text-gray-500">
                                Total Fee: ৳{student.totalFee.toLocaleString()}
                              </div>
                            </div>
                          </DialogContent>
                        </Dialog>
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
