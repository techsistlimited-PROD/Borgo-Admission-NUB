import { useState, useEffect } from "react";
import {
  Plus,
  Edit,
  Trash2,
  BookOpen,
  Save,
  X,
  GraduationCap,
  Clock,
  CreditCard,
  Search,
  Filter,
} from "lucide-react";
import { Button } from "../components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../components/ui/card";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
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
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../components/ui/dialog";
import { Badge } from "../components/ui/badge";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "../components/ui/tabs";
import { useToast } from "../hooks/use-toast";
import {
  Syllabus,
  Course,
  Semester,
  getAllSyllabuses,
  getAllCourses,
  createSyllabus,
  updateSyllabus,
  deleteSyllabus,
  addCourseToSyllabus,
  removeCourseFromSyllabus,
  getSyllabusByProgramId,
} from "../lib/syllabusData";
import { programs } from "../lib/programData";

export default function SyllabusManagement() {
  const { toast } = useToast();
  const [syllabuses, setSyllabuses] = useState<Syllabus[]>([]);
  const [courses, setCourses] = useState<Course[]>([]);
  const [selectedSyllabus, setSelectedSyllabus] = useState<Syllabus | null>(
    null,
  );
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isCourseDialogOpen, setIsCourseDialogOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterProgram, setFilterProgram] = useState("all");

  // Form states
  const [formData, setFormData] = useState<Partial<Syllabus>>({});
  const [courseFormData, setCourseFormData] = useState<Partial<Course>>({
    type: "theory",
    credits: 3,
  });

  useEffect(() => {
    loadData();
  }, []);

  const loadData = () => {
    setSyllabuses(getAllSyllabuses());
    setCourses(getAllCourses());
  };

  const handleCreateSyllabus = () => {
    if (!formData.programId || !formData.programName || !formData.packageCode) {
      toast({
        title: "Error",
        description: "Please fill in all required fields",
        variant: "destructive",
      });
      return;
    }

    const newSyllabus = createSyllabus({
      programId: formData.programId!,
      programName: formData.programName!,
      packageCode: formData.packageCode!,
      totalSemesters: formData.totalSemesters || 8,
      totalCredits: formData.totalCredits || 144,
      semesters: [],
      feeStructure: formData.feeStructure || {
        admissionFee: 35000,
        perCreditFee: 2500,
        labFeePerCourse: 5000,
        otherFees: 15000,
      },
      isActive: true,
    });

    loadData();
    setFormData({});
    setIsCreateDialogOpen(false);

    toast({
      title: "Success",
      description: "Syllabus created successfully",
    });
  };

  const handleUpdateSyllabus = () => {
    if (!selectedSyllabus || !formData.programName || !formData.packageCode) {
      toast({
        title: "Error",
        description: "Please fill in all required fields",
        variant: "destructive",
      });
      return;
    }

    // Ensure fee structure is properly merged
    const updatedData = {
      ...formData,
      feeStructure: {
        ...selectedSyllabus.feeStructure,
        ...formData.feeStructure,
      },
    };

    updateSyllabus(selectedSyllabus.id, updatedData);
    loadData();
    setFormData({});
    setSelectedSyllabus(null);
    setIsEditDialogOpen(false);

    toast({
      title: "Success",
      description: "Syllabus updated successfully",
    });
  };

  const handleDeleteSyllabus = (id: string) => {
    if (window.confirm("Are you sure you want to delete this syllabus?")) {
      deleteSyllabus(id);
      loadData();

      toast({
        title: "Success",
        description: "Syllabus deleted successfully",
      });
    }
  };

  const handleCreateCourse = () => {
    if (
      !courseFormData.name ||
      !courseFormData.code ||
      !courseFormData.credits
    ) {
      toast({
        title: "Error",
        description: "Please fill in all required course fields",
        variant: "destructive",
      });
      return;
    }

    const newCourse: Course = {
      id: `course-${Date.now()}`,
      name: courseFormData.name!,
      code: courseFormData.code!,
      credits: courseFormData.credits!,
      type: courseFormData.type as "theory" | "lab",
      description: courseFormData.description || "",
    };

    // Add to global courses (in real app, this would be an API call)
    courses.push(newCourse);
    setCourses([...courses]);
    setCourseFormData({ type: "theory", credits: 3 });
    setIsCourseDialogOpen(false);

    toast({
      title: "Success",
      description: "Course created successfully",
    });
  };

  const filteredSyllabuses = syllabuses.filter((syllabus) => {
    const matchesSearch =
      syllabus.programName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      syllabus.packageCode.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter =
      filterProgram === "all" || syllabus.programId === filterProgram;
    return matchesSearch && matchesFilter;
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-indigo-100 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 flex items-center">
              <BookOpen className="h-8 w-8 mr-3 text-purple-600" />
              Syllabus Management
            </h1>
            <p className="text-gray-600 mt-2">
              Manage academic programs, courses, and fee structures
            </p>
          </div>

          <div className="flex gap-3">
            <Dialog
              open={isCourseDialogOpen}
              onOpenChange={setIsCourseDialogOpen}
            >
              <DialogTrigger asChild>
                <Button variant="outline">
                  <Plus className="h-4 w-4 mr-2" />
                  Add Course
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Create New Course</DialogTitle>
                  <DialogDescription>
                    Add a new course to the course database
                  </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="courseName">Course Name</Label>
                      <Input
                        id="courseName"
                        value={courseFormData.name || ""}
                        onChange={(e) =>
                          setCourseFormData({
                            ...courseFormData,
                            name: e.target.value,
                          })
                        }
                        placeholder="e.g., Introduction to Programming"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="courseCode">Course Code</Label>
                      <Input
                        id="courseCode"
                        value={courseFormData.code || ""}
                        onChange={(e) =>
                          setCourseFormData({
                            ...courseFormData,
                            code: e.target.value,
                          })
                        }
                        placeholder="e.g., CSE 101"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="courseType">Course Type</Label>
                      <Select
                        value={courseFormData.type}
                        onValueChange={(value) =>
                          setCourseFormData({
                            ...courseFormData,
                            type: value as "theory" | "lab",
                          })
                        }
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="theory">Theory</SelectItem>
                          <SelectItem value="lab">Lab</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="courseCredits">Credits</Label>
                      <Select
                        value={courseFormData.credits?.toString()}
                        onValueChange={(value) =>
                          setCourseFormData({
                            ...courseFormData,
                            credits: parseInt(value),
                          })
                        }
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="1">1 Credit (Lab)</SelectItem>
                          <SelectItem value="3">3 Credits (Theory)</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="courseDescription">Description</Label>
                    <Input
                      id="courseDescription"
                      value={courseFormData.description || ""}
                      onChange={(e) =>
                        setCourseFormData({
                          ...courseFormData,
                          description: e.target.value,
                        })
                      }
                      placeholder="Course description..."
                    />
                  </div>
                </div>
                <div className="flex justify-end gap-2">
                  <Button
                    variant="outline"
                    onClick={() => setIsCourseDialogOpen(false)}
                  >
                    Cancel
                  </Button>
                  <Button onClick={handleCreateCourse}>
                    <Save className="h-4 w-4 mr-2" />
                    Create Course
                  </Button>
                </div>
              </DialogContent>
            </Dialog>

            <Dialog
              open={isCreateDialogOpen}
              onOpenChange={setIsCreateDialogOpen}
            >
              <DialogTrigger asChild>
                <Button>
                  <Plus className="h-4 w-4 mr-2" />
                  Create Syllabus
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl">
                <DialogHeader>
                  <DialogTitle>Create New Syllabus</DialogTitle>
                  <DialogDescription>
                    Create a new academic syllabus for a program
                  </DialogDescription>
                </DialogHeader>
                <Tabs defaultValue="basic" className="w-full">
                  <TabsList className="grid w-full grid-cols-2">
                    <TabsTrigger value="basic">Basic Info</TabsTrigger>
                    <TabsTrigger value="fees">Fee Structure</TabsTrigger>
                  </TabsList>

                  <TabsContent value="basic" className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="program">Program</Label>
                        <Select
                          value={formData.programId}
                          onValueChange={(value) => {
                            const program = programs.find(
                              (p) => p.id === value,
                            );
                            setFormData({
                              ...formData,
                              programId: value,
                              programName: program?.name || "",
                            });
                          }}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select program" />
                          </SelectTrigger>
                          <SelectContent>
                            {programs.map((program) => (
                              <SelectItem key={program.id} value={program.id}>
                                {program.name}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="packageCode">Package Code</Label>
                        <Input
                          id="packageCode"
                          value={formData.packageCode || ""}
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              packageCode: e.target.value,
                            })
                          }
                          placeholder="e.g., CSE-B-2024"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="totalSemesters">Total Semesters</Label>
                        <Input
                          id="totalSemesters"
                          type="number"
                          value={formData.totalSemesters || ""}
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              totalSemesters: parseInt(e.target.value),
                            })
                          }
                          placeholder="8"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="totalCredits">Total Credits</Label>
                        <Input
                          id="totalCredits"
                          type="number"
                          value={formData.totalCredits || ""}
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              totalCredits: parseInt(e.target.value),
                            })
                          }
                          placeholder="144"
                        />
                      </div>
                    </div>
                  </TabsContent>

                  <TabsContent value="fees" className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="admissionFee">
                          Admission Fee (BDT)
                        </Label>
                        <Input
                          id="admissionFee"
                          type="number"
                          value={formData.feeStructure?.admissionFee || ""}
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              feeStructure: {
                                admissionFee: 35000,
                                perCreditFee: 2500,
                                labFeePerCourse: 5000,
                                otherFees: 15000,
                                ...formData.feeStructure,
                                admissionFee: parseInt(e.target.value),
                              },
                            })
                          }
                          placeholder="35000"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="perCreditFee">
                          Per Credit Fee (BDT)
                        </Label>
                        <Input
                          id="perCreditFee"
                          type="number"
                          value={formData.feeStructure?.perCreditFee || ""}
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              feeStructure: {
                                admissionFee: 35000,
                                perCreditFee: 2500,
                                labFeePerCourse: 5000,
                                otherFees: 15000,
                                ...formData.feeStructure,
                                perCreditFee: parseInt(e.target.value),
                              },
                            })
                          }
                          placeholder="2500"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="labFee">Lab Fee Per Course (BDT)</Label>
                        <Input
                          id="labFee"
                          type="number"
                          value={formData.feeStructure?.labFeePerCourse || ""}
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              feeStructure: {
                                admissionFee: 35000,
                                perCreditFee: 2500,
                                labFeePerCourse: 5000,
                                otherFees: 15000,
                                ...formData.feeStructure,
                                labFeePerCourse: parseInt(e.target.value),
                              },
                            })
                          }
                          placeholder="5000"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="otherFees">Other Fees (BDT)</Label>
                        <Input
                          id="otherFees"
                          type="number"
                          value={formData.feeStructure?.otherFees || ""}
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              feeStructure: {
                                admissionFee: 35000,
                                perCreditFee: 2500,
                                labFeePerCourse: 5000,
                                otherFees: 15000,
                                ...formData.feeStructure,
                                otherFees: parseInt(e.target.value),
                              },
                            })
                          }
                          placeholder="15000"
                        />
                      </div>
                    </div>
                  </TabsContent>
                </Tabs>

                <div className="flex justify-end gap-2">
                  <Button
                    variant="outline"
                    onClick={() => setIsCreateDialogOpen(false)}
                  >
                    Cancel
                  </Button>
                  <Button onClick={handleCreateSyllabus}>
                    <Save className="h-4 w-4 mr-2" />
                    Create Syllabus
                  </Button>
                </div>
              </DialogContent>
            </Dialog>

            {/* Edit Syllabus Dialog */}
            <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
              <DialogContent className="max-w-2xl">
                <DialogHeader>
                  <DialogTitle>Edit Syllabus</DialogTitle>
                  <DialogDescription>
                    Update the academic syllabus information
                  </DialogDescription>
                </DialogHeader>
                <Tabs defaultValue="basic" className="w-full">
                  <TabsList className="grid w-full grid-cols-2">
                    <TabsTrigger value="basic">Basic Info</TabsTrigger>
                    <TabsTrigger value="fees">Fee Structure</TabsTrigger>
                  </TabsList>

                  <TabsContent value="basic" className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="editProgram">Program</Label>
                        <Select
                          value={formData.programId}
                          onValueChange={(value) => {
                            const program = programs.find(
                              (p) => p.id === value,
                            );
                            setFormData({
                              ...formData,
                              programId: value,
                              programName: program?.name || "",
                            });
                          }}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select program" />
                          </SelectTrigger>
                          <SelectContent>
                            {programs.map((program) => (
                              <SelectItem key={program.id} value={program.id}>
                                {program.name}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="editPackageCode">Package Code</Label>
                        <Input
                          id="editPackageCode"
                          value={formData.packageCode || ""}
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              packageCode: e.target.value,
                            })
                          }
                          placeholder="e.g., CSE-B-2024"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="editTotalSemesters">Total Semesters</Label>
                        <Input
                          id="editTotalSemesters"
                          type="number"
                          value={formData.totalSemesters || ""}
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              totalSemesters: parseInt(e.target.value),
                            })
                          }
                          placeholder="8"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="editTotalCredits">Total Credits</Label>
                        <Input
                          id="editTotalCredits"
                          type="number"
                          value={formData.totalCredits || ""}
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              totalCredits: parseInt(e.target.value),
                            })
                          }
                          placeholder="144"
                        />
                      </div>
                    </div>
                  </TabsContent>

                  <TabsContent value="fees" className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="editAdmissionFee">
                          Admission Fee (BDT)
                        </Label>
                        <Input
                          id="editAdmissionFee"
                          type="number"
                          value={formData.feeStructure?.admissionFee || ""}
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              feeStructure: {
                                ...selectedSyllabus?.feeStructure,
                                ...formData.feeStructure,
                                admissionFee: parseInt(e.target.value),
                              },
                            })
                          }
                          placeholder="35000"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="editPerCreditFee">
                          Per Credit Fee (BDT)
                        </Label>
                        <Input
                          id="editPerCreditFee"
                          type="number"
                          value={formData.feeStructure?.perCreditFee || ""}
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              feeStructure: {
                                ...selectedSyllabus?.feeStructure,
                                ...formData.feeStructure,
                                perCreditFee: parseInt(e.target.value),
                              },
                            })
                          }
                          placeholder="2500"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="editLabFee">Lab Fee Per Course (BDT)</Label>
                        <Input
                          id="editLabFee"
                          type="number"
                          value={formData.feeStructure?.labFeePerCourse || ""}
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              feeStructure: {
                                ...selectedSyllabus?.feeStructure,
                                ...formData.feeStructure,
                                labFeePerCourse: parseInt(e.target.value),
                              },
                            })
                          }
                          placeholder="5000"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="editOtherFees">Other Fees (BDT)</Label>
                        <Input
                          id="editOtherFees"
                          type="number"
                          value={formData.feeStructure?.otherFees || ""}
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              feeStructure: {
                                ...selectedSyllabus?.feeStructure,
                                ...formData.feeStructure,
                                otherFees: parseInt(e.target.value),
                              },
                            })
                          }
                          placeholder="15000"
                        />
                      </div>
                    </div>
                  </TabsContent>
                </Tabs>

                <div className="flex justify-end gap-2">
                  <Button
                    variant="outline"
                    onClick={() => {
                      setIsEditDialogOpen(false);
                      setFormData({});
                      setSelectedSyllabus(null);
                    }}
                  >
                    Cancel
                  </Button>
                  <Button onClick={handleUpdateSyllabus}>
                    <Save className="h-4 w-4 mr-2" />
                    Update Syllabus
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </div>

        {/* Filters */}
        <Card className="mb-6">
          <CardContent className="pt-6">
            <div className="flex gap-4">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Input
                    placeholder="Search syllabuses..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>
              <div className="w-48">
                <Select value={filterProgram} onValueChange={setFilterProgram}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Programs</SelectItem>
                    {programs.map((program) => (
                      <SelectItem key={program.id} value={program.id}>
                        {program.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Syllabuses Table */}
        <Card>
          <CardHeader>
            <CardTitle>Academic Syllabuses</CardTitle>
            <CardDescription>
              Manage syllabuses for different academic programs
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Program</TableHead>
                  <TableHead>Package Code</TableHead>
                  <TableHead>Semesters</TableHead>
                  <TableHead>Total Credits</TableHead>
                  <TableHead>Admission Fee</TableHead>
                  <TableHead>Per Credit</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredSyllabuses.map((syllabus) => (
                  <TableRow key={syllabus.id}>
                    <TableCell className="font-medium">
                      <div>
                        <p className="font-semibold">{syllabus.programName}</p>
                        <p className="text-sm text-gray-500">
                          {syllabus.programId.toUpperCase()}
                        </p>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline">{syllabus.packageCode}</Badge>
                    </TableCell>
                    <TableCell className="text-center">
                      {syllabus.totalSemesters}
                    </TableCell>
                    <TableCell className="text-center">
                      {syllabus.totalCredits}
                    </TableCell>
                    <TableCell>
                      ৳{syllabus.feeStructure.admissionFee.toLocaleString()}
                    </TableCell>
                    <TableCell>
                      ৳{syllabus.feeStructure.perCreditFee.toLocaleString()}
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant={syllabus.isActive ? "default" : "secondary"}
                      >
                        {syllabus.isActive ? "Active" : "Inactive"}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => {
                            setSelectedSyllabus(syllabus);
                            setFormData(syllabus);
                            setIsEditDialogOpen(true);
                          }}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleDeleteSyllabus(syllabus.id)}
                          className="text-red-600 hover:text-red-700"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        {/* Course Database */}
        <Card className="mt-6">
          <CardHeader>
            <CardTitle>Course Database</CardTitle>
            <CardDescription>
              Available courses for syllabus creation
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {courses.slice(0, 12).map((course) => (
                <div key={course.id} className="border rounded-lg p-4">
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <h4 className="font-semibold text-sm">{course.name}</h4>
                      <p className="text-xs text-gray-500">{course.code}</p>
                    </div>
                    <div className="flex gap-1">
                      <Badge
                        variant={
                          course.type === "theory" ? "default" : "secondary"
                        }
                        className="text-xs"
                      >
                        {course.type}
                      </Badge>
                      <Badge variant="outline" className="text-xs">
                        {course.credits} cr
                      </Badge>
                    </div>
                  </div>
                  {course.description && (
                    <p className="text-xs text-gray-600 line-clamp-2">
                      {course.description}
                    </p>
                  )}
                </div>
              ))}
            </div>
            {courses.length > 12 && (
              <p className="text-center text-gray-500 mt-4">
                Showing 12 of {courses.length} courses
              </p>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
