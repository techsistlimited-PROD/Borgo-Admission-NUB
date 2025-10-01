import React, { useState, useEffect } from "react";
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
  ChevronDown,
  ChevronRight,
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
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "../components/ui/collapsible";
import { useToast } from "../hooks/use-toast";
import {
  Syllabus,
  Course,
  Semester,
  getAllSyllabuses,
  getAllCourses,
  updateSyllabus,
  addCourseToSyllabus,
  removeCourseFromSyllabus,
} from "../lib/syllabusData";
import { programs } from "../lib/programData";

export default function SyllabusManagement() {
  const { toast } = useToast();
  const [syllabuses, setSyllabuses] = useState<Syllabus[]>([]);
  const [allCourses, setAllCourses] = useState<Course[]>([]);
  const [expandedPrograms, setExpandedPrograms] = useState<string[]>([]);
  const [isEditCourseDialogOpen, setIsEditCourseDialogOpen] = useState(false);
  const [isAddCourseDialogOpen, setIsAddCourseDialogOpen] = useState(false);
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);
  const [selectedSyllabus, setSelectedSyllabus] = useState<Syllabus | null>(
    null,
  );
  const [selectedSemester, setSelectedSemester] = useState<Semester | null>(
    null,
  );
  const [searchTerm, setSearchTerm] = useState("");
  const [filterProgram, setFilterProgram] = useState("all");

  // Form state for course editing
  const [courseFormData, setCourseFormData] = useState<Partial<Course>>({
    type: "theory",
    credits: 3,
  });

  useEffect(() => {
    loadData();
  }, []);

  const loadData = () => {
    setSyllabuses(getAllSyllabuses());
    setAllCourses(getAllCourses());
    // Auto-expand the first program for better UX
    if (getAllSyllabuses().length > 0) {
      setExpandedPrograms([getAllSyllabuses()[0].programId]);
    }
  };

  const toggleProgramExpansion = (programId: string) => {
    setExpandedPrograms((prev) =>
      prev.includes(programId)
        ? prev.filter((id) => id !== programId)
        : [...prev, programId],
    );
  };

  const handleEditCourse = (
    course: Course,
    syllabus: Syllabus,
    semester: Semester,
  ) => {
    setSelectedCourse(course);
    setSelectedSyllabus(syllabus);
    setSelectedSemester(semester);
    setCourseFormData(course);
    setIsEditCourseDialogOpen(true);
  };

  const handleUpdateCourse = () => {
    if (
      !selectedCourse ||
      !selectedSyllabus ||
      !selectedSemester ||
      !courseFormData.name ||
      !courseFormData.code
    ) {
      toast({
        title: "Error",
        description: "Please fill in all required fields",
        variant: "destructive",
      });
      return;
    }

    // Update the course in the semester
    const updatedCourse: Course = {
      ...selectedCourse,
      ...courseFormData,
      credits: courseFormData.credits || 3,
      type: courseFormData.type as "theory" | "lab",
    };

    // Find and update the course in the syllabus
    const syllabusIndex = syllabuses.findIndex(
      (s) => s.id === selectedSyllabus.id,
    );
    const semesterIndex = syllabuses[syllabusIndex].semesters.findIndex(
      (sem) => sem.id === selectedSemester.id,
    );
    const courseIndex = syllabuses[syllabusIndex].semesters[
      semesterIndex
    ].courses.findIndex((c) => c.id === selectedCourse.id);

    if (syllabusIndex !== -1 && semesterIndex !== -1 && courseIndex !== -1) {
      const updatedSyllabuses = [...syllabuses];
      updatedSyllabuses[syllabusIndex].semesters[semesterIndex].courses[
        courseIndex
      ] = updatedCourse;

      // Recalculate semester total credits
      updatedSyllabuses[syllabusIndex].semesters[semesterIndex].totalCredits =
        updatedSyllabuses[syllabusIndex].semesters[
          semesterIndex
        ].courses.reduce((sum, c) => sum + c.credits, 0);

      setSyllabuses(updatedSyllabuses);

      // Update in the data store
      updateSyllabus(selectedSyllabus.id, updatedSyllabuses[syllabusIndex]);

      toast({
        title: "Success",
        description: "Course updated successfully",
      });

      setIsEditCourseDialogOpen(false);
      resetForm();
    }
  };

  const handleDeleteCourse = (
    course: Course,
    syllabus: Syllabus,
    semester: Semester,
  ) => {
    if (
      window.confirm(
        `Are you sure you want to delete "${course.name}" from this semester?`,
      )
    ) {
      if (removeCourseFromSyllabus(syllabus.id, semester.id, course.id)) {
        loadData();
        toast({
          title: "Success",
          description: "Course removed from syllabus successfully",
        });
      } else {
        toast({
          title: "Error",
          description: "Failed to remove course",
          variant: "destructive",
        });
      }
    }
  };

  const handleAddCourse = (syllabus: Syllabus, semester: Semester) => {
    setSelectedSyllabus(syllabus);
    setSelectedSemester(semester);
    setCourseFormData({ type: "theory", credits: 3 });
    setIsAddCourseDialogOpen(true);
  };

  const handleCreateCourse = () => {
    if (
      !selectedSyllabus ||
      !selectedSemester ||
      !courseFormData.name ||
      !courseFormData.code
    ) {
      toast({
        title: "Error",
        description: "Please fill in all required fields",
        variant: "destructive",
      });
      return;
    }

    const newCourse: Course = {
      id: `course-${Date.now()}`,
      name: courseFormData.name!,
      code: courseFormData.code!,
      credits: courseFormData.credits || 3,
      type: courseFormData.type as "theory" | "lab",
      description: courseFormData.description || "",
    };

    if (
      addCourseToSyllabus(selectedSyllabus.id, selectedSemester.id, newCourse)
    ) {
      loadData();
      toast({
        title: "Success",
        description: "Course added to syllabus successfully",
      });
      setIsAddCourseDialogOpen(false);
      resetForm();
    } else {
      toast({
        title: "Error",
        description: "Failed to add course",
        variant: "destructive",
      });
    }
  };

  const resetForm = () => {
    setSelectedCourse(null);
    setSelectedSyllabus(null);
    setSelectedSemester(null);
    setCourseFormData({ type: "theory", credits: 3 });
  };

  const filteredSyllabuses = syllabuses.filter((syllabus) => {
    const matchesSearch =
      syllabus.programName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      syllabus.packageCode.toLowerCase().includes(searchTerm.toLowerCase()) ||
      syllabus.semesters.some((semester) =>
        semester.courses.some(
          (course) =>
            course.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            course.code.toLowerCase().includes(searchTerm.toLowerCase()),
        ),
      );
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
              Syllabus & Course Management
            </h1>
            <p className="text-gray-600 mt-2">
              Manage courses within academic programs by department
            </p>
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
                    placeholder="Search syllabuses, courses..."
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
                    <SelectItem value="all">All Departments</SelectItem>
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

        {/* Syllabuses by Department */}
        <div className="space-y-4">
          {filteredSyllabuses.map((syllabus) => (
            <Card key={syllabus.id} className="overflow-hidden">
              <Collapsible
                open={expandedPrograms.includes(syllabus.programId)}
                onOpenChange={() => toggleProgramExpansion(syllabus.programId)}
              >
                <CollapsibleTrigger asChild>
                  <CardHeader className="cursor-pointer hover:bg-gray-50 transition-colors">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-4">
                        <div className="flex items-center">
                          {expandedPrograms.includes(syllabus.programId) ? (
                            <ChevronDown className="h-5 w-5 text-gray-500" />
                          ) : (
                            <ChevronRight className="h-5 w-5 text-gray-500" />
                          )}
                          <GraduationCap className="h-6 w-6 ml-2 text-purple-600" />
                        </div>
                        <div>
                          <CardTitle className="text-lg">
                            {syllabus.programName}
                          </CardTitle>
                          <CardDescription>
                            {syllabus.packageCode} • {syllabus.totalSemesters}{" "}
                            Semesters • {syllabus.totalCredits} Credits
                          </CardDescription>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Badge
                          variant={syllabus.isActive ? "default" : "secondary"}
                        >
                          {syllabus.isActive ? "Active" : "Inactive"}
                        </Badge>
                        <Badge variant="outline">
                          {syllabus.semesters.reduce(
                            (total, sem) => total + sem.courses.length,
                            0,
                          )}{" "}
                          Courses
                        </Badge>
                      </div>
                    </div>
                  </CardHeader>
                </CollapsibleTrigger>

                <CollapsibleContent>
                  <CardContent className="pt-0">
                    {syllabus.semesters.map((semester) => (
                      <div key={semester.id} className="mb-6">
                        <div className="flex items-center justify-between mb-4">
                          <div className="flex items-center space-x-2">
                            <h3 className="text-lg font-semibold text-gray-800">
                              {semester.name}
                            </h3>
                            <Badge variant="outline" className="text-xs">
                              {semester.totalCredits} Credits
                            </Badge>
                          </div>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleAddCourse(syllabus, semester)}
                          >
                            <Plus className="h-4 w-4 mr-1" />
                            Add Course
                          </Button>
                        </div>

                        <div className="border rounded-lg overflow-hidden">
                          <Table>
                            <TableHeader>
                              <TableRow className="bg-gray-50">
                                <TableHead>Course Code</TableHead>
                                <TableHead>Course Name</TableHead>
                                <TableHead className="text-center">
                                  Type
                                </TableHead>
                                <TableHead className="text-center">
                                  Credits
                                </TableHead>
                                <TableHead>Description</TableHead>
                                <TableHead className="text-center">
                                  Actions
                                </TableHead>
                              </TableRow>
                            </TableHeader>
                            <TableBody>
                              {semester.courses.map((course) => (
                                <TableRow key={course.id}>
                                  <TableCell className="font-mono text-sm">
                                    <Badge variant="outline">
                                      {course.code}
                                    </Badge>
                                  </TableCell>
                                  <TableCell className="font-medium">
                                    {course.name}
                                  </TableCell>
                                  <TableCell className="text-center">
                                    <Badge
                                      variant={
                                        course.type === "theory"
                                          ? "default"
                                          : "secondary"
                                      }
                                      className="text-xs"
                                    >
                                      {course.type}
                                    </Badge>
                                  </TableCell>
                                  <TableCell className="text-center font-semibold">
                                    {course.credits}
                                  </TableCell>
                                  <TableCell className="text-sm text-gray-600 max-w-xs truncate">
                                    {course.description || "No description"}
                                  </TableCell>
                                  <TableCell>
                                    <div className="flex gap-1 justify-center">
                                      <Button
                                        variant="outline"
                                        size="sm"
                                        onClick={() =>
                                          handleEditCourse(
                                            course,
                                            syllabus,
                                            semester,
                                          )
                                        }
                                      >
                                        <Edit className="h-3 w-3" />
                                      </Button>
                                      <Button
                                        variant="outline"
                                        size="sm"
                                        onClick={() =>
                                          handleDeleteCourse(
                                            course,
                                            syllabus,
                                            semester,
                                          )
                                        }
                                        className="text-red-600 hover:text-red-700"
                                      >
                                        <Trash2 className="h-3 w-3" />
                                      </Button>
                                    </div>
                                  </TableCell>
                                </TableRow>
                              ))}
                              {semester.courses.length === 0 && (
                                <TableRow>
                                  <TableCell
                                    colSpan={6}
                                    className="text-center py-8 text-gray-500"
                                  >
                                    No courses in this semester. Click "Add
                                    Course" to get started.
                                  </TableCell>
                                </TableRow>
                              )}
                            </TableBody>
                          </Table>
                        </div>
                      </div>
                    ))}
                  </CardContent>
                </CollapsibleContent>
              </Collapsible>
            </Card>
          ))}
        </div>

        {/* Edit Course Dialog */}
        <Dialog
          open={isEditCourseDialogOpen}
          onOpenChange={setIsEditCourseDialogOpen}
        >
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Edit Course</DialogTitle>
              <DialogDescription>
                Update course information for {selectedSyllabus?.programName}
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="editCourseName">Course Name</Label>
                  <Input
                    id="editCourseName"
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
                  <Label htmlFor="editCourseCode">Course Code</Label>
                  <Input
                    id="editCourseCode"
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
                  <Label htmlFor="editCourseType">Course Type</Label>
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
                  <Label htmlFor="editCourseCredits">Credits</Label>
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
                      <SelectItem value="1">1 Credit</SelectItem>
                      <SelectItem value="2">2 Credits</SelectItem>
                      <SelectItem value="3">3 Credits</SelectItem>
                      <SelectItem value="4">4 Credits</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="editCourseDescription">Description</Label>
                <Input
                  id="editCourseDescription"
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
                onClick={() => {
                  setIsEditCourseDialogOpen(false);
                  resetForm();
                }}
              >
                Cancel
              </Button>
              <Button onClick={handleUpdateCourse}>
                <Save className="h-4 w-4 mr-2" />
                Update Course
              </Button>
            </div>
          </DialogContent>
        </Dialog>

        {/* Add Course Dialog */}
        <Dialog
          open={isAddCourseDialogOpen}
          onOpenChange={setIsAddCourseDialogOpen}
        >
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add New Course</DialogTitle>
              <DialogDescription>
                Add a course to {selectedSemester?.name} of{" "}
                {selectedSyllabus?.programName}
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="newCourseName">Course Name</Label>
                  <Input
                    id="newCourseName"
                    value={courseFormData.name || ""}
                    onChange={(e) =>
                      setCourseFormData({
                        ...courseFormData,
                        name: e.target.value,
                      })
                    }
                    placeholder="e.g., Data Structures"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="newCourseCode">Course Code</Label>
                  <Input
                    id="newCourseCode"
                    value={courseFormData.code || ""}
                    onChange={(e) =>
                      setCourseFormData({
                        ...courseFormData,
                        code: e.target.value,
                      })
                    }
                    placeholder="e.g., CSE 201"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="newCourseType">Course Type</Label>
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
                  <Label htmlFor="newCourseCredits">Credits</Label>
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
                      <SelectItem value="1">1 Credit</SelectItem>
                      <SelectItem value="2">2 Credits</SelectItem>
                      <SelectItem value="3">3 Credits</SelectItem>
                      <SelectItem value="4">4 Credits</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="newCourseDescription">Description</Label>
                <Input
                  id="newCourseDescription"
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
                onClick={() => {
                  setIsAddCourseDialogOpen(false);
                  resetForm();
                }}
              >
                Cancel
              </Button>
              <Button onClick={handleCreateCourse}>
                <Plus className="h-4 w-4 mr-2" />
                Add Course
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}
