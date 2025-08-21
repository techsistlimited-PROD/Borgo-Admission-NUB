import { useState } from "react";
import {
  BookOpen,
  Users,
  UserCheck,
  Send,
  Filter,
  Search,
  Calendar,
  Clock,
  GraduationCap,
  Building,
  CheckCircle,
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
import { Textarea } from "../components/ui/textarea";
import { useToast } from "../hooks/use-toast";

interface Course {
  id: string;
  code: string;
  title: string;
  credits: number;
  type: "Core" | "Elective" | "Lab";
  semester: number;
  prerequisites: string[];
  instructor: string;
  schedule: string;
  capacity: number;
  enrolled: number;
}

interface Student {
  id: string;
  name: string;
  studentId: string;
  email: string;
  phone: string;
  cgpa: number;
  status: "admitted" | "registered" | "pending";
  registrationDate: string;
  isSelected: boolean;
}

const departmentCourses: Record<string, Course[]> = {
  "Computer Science": [
    {
      id: "cse101",
      code: "CSE 101",
      title: "Introduction to Programming",
      credits: 3,
      type: "Core",
      semester: 1,
      prerequisites: [],
      instructor: "Dr. Ahmed Rahman",
      schedule: "Sun, Tue, Thu 10:00-11:30",
      capacity: 40,
      enrolled: 35,
    },
    {
      id: "cse102",
      code: "CSE 102",
      title: "Programming Lab",
      credits: 1,
      type: "Lab",
      semester: 1,
      prerequisites: [],
      instructor: "Md. Karim Uddin",
      schedule: "Mon 2:00-5:00",
      capacity: 20,
      enrolled: 18,
    },
    {
      id: "math101",
      code: "MATH 101",
      title: "Calculus I",
      credits: 3,
      type: "Core",
      semester: 1,
      prerequisites: [],
      instructor: "Prof. Fatima Khatun",
      schedule: "Mon, Wed, Fri 9:00-10:30",
      capacity: 50,
      enrolled: 42,
    },
    {
      id: "phy101",
      code: "PHY 101",
      title: "Physics I",
      credits: 3,
      type: "Core",
      semester: 1,
      prerequisites: [],
      instructor: "Dr. Shahidul Islam",
      schedule: "Sun, Tue, Thu 2:00-3:30",
      capacity: 45,
      enrolled: 38,
    },
    {
      id: "eng101",
      code: "ENG 101",
      title: "English Composition",
      credits: 3,
      type: "Core",
      semester: 1,
      prerequisites: [],
      instructor: "Ms. Sarah Johnson",
      schedule: "Mon, Wed, Fri 11:00-12:30",
      capacity: 35,
      enrolled: 30,
    },
  ],
  "Business Administration": [
    {
      id: "bus101",
      code: "BUS 101",
      title: "Principles of Management",
      credits: 3,
      type: "Core",
      semester: 1,
      prerequisites: [],
      instructor: "Prof. Mohammad Ali",
      schedule: "Sun, Tue, Thu 9:00-10:30",
      capacity: 60,
      enrolled: 55,
    },
    {
      id: "acc101",
      code: "ACC 101",
      title: "Financial Accounting",
      credits: 3,
      type: "Core",
      semester: 1,
      prerequisites: [],
      instructor: "Dr. Rashida Begum",
      schedule: "Mon, Wed, Fri 10:00-11:30",
      capacity: 50,
      enrolled: 45,
    },
    {
      id: "eco101",
      code: "ECO 101",
      title: "Microeconomics",
      credits: 3,
      type: "Core",
      semester: 1,
      prerequisites: [],
      instructor: "Dr. Abdul Hamid",
      schedule: "Sun, Tue, Thu 2:00-3:30",
      capacity: 55,
      enrolled: 48,
    },
    {
      id: "stat101",
      code: "STAT 101",
      title: "Business Statistics",
      credits: 3,
      type: "Core",
      semester: 1,
      prerequisites: [],
      instructor: "Prof. Nasreen Akter",
      schedule: "Mon, Wed, Fri 2:00-3:30",
      capacity: 40,
      enrolled: 35,
    },
    {
      id: "eng101",
      code: "ENG 101",
      title: "Business English",
      credits: 3,
      type: "Core",
      semester: 1,
      prerequisites: [],
      instructor: "Ms. Diana Smith",
      schedule: "Sun, Tue, Thu 11:00-12:30",
      capacity: 45,
      enrolled: 40,
    },
  ],
  "Electrical Engineering": [
    {
      id: "eee101",
      code: "EEE 101",
      title: "Circuit Analysis I",
      credits: 3,
      type: "Core",
      semester: 1,
      prerequisites: [],
      instructor: "Dr. Rahman Khan",
      schedule: "Mon, Wed, Fri 9:00-10:30",
      capacity: 35,
      enrolled: 30,
    },
    {
      id: "eee102",
      code: "EEE 102",
      title: "Electrical Lab I",
      credits: 1,
      type: "Lab",
      semester: 1,
      prerequisites: [],
      instructor: "Eng. Kamal Hossain",
      schedule: "Thu 2:00-5:00",
      capacity: 18,
      enrolled: 16,
    },
    {
      id: "math101",
      code: "MATH 101",
      title: "Engineering Mathematics I",
      credits: 3,
      type: "Core",
      semester: 1,
      prerequisites: [],
      instructor: "Prof. Selina Rahman",
      schedule: "Sun, Tue, Thu 10:00-11:30",
      capacity: 40,
      enrolled: 32,
    },
    {
      id: "phy101",
      code: "PHY 101",
      title: "Engineering Physics",
      credits: 3,
      type: "Core",
      semester: 1,
      prerequisites: [],
      instructor: "Dr. Mizanur Rahman",
      schedule: "Mon, Wed, Fri 2:00-3:30",
      capacity: 35,
      enrolled: 28,
    },
    {
      id: "che101",
      code: "CHE 101",
      title: "Engineering Chemistry",
      credits: 3,
      type: "Core",
      semester: 1,
      prerequisites: [],
      instructor: "Dr. Sultana Begum",
      schedule: "Sun, Tue, Thu 2:00-3:30",
      capacity: 35,
      enrolled: 25,
    },
  ],
  "Civil Engineering": [
    {
      id: "ce101",
      code: "CE 101",
      title: "Engineering Drawing",
      credits: 2,
      type: "Core",
      semester: 1,
      prerequisites: [],
      instructor: "Eng. Mahmud Hasan",
      schedule: "Mon, Wed 10:00-12:00",
      capacity: 30,
      enrolled: 25,
    },
    {
      id: "ce102",
      code: "CE 102",
      title: "Surveying I",
      credits: 3,
      type: "Core",
      semester: 1,
      prerequisites: [],
      instructor: "Prof. Jahangir Alam",
      schedule: "Sun, Tue, Thu 9:00-10:30",
      capacity: 35,
      enrolled: 28,
    },
    {
      id: "math101",
      code: "MATH 101",
      title: "Engineering Mathematics I",
      credits: 3,
      type: "Core",
      semester: 1,
      prerequisites: [],
      instructor: "Dr. Marium Khatun",
      schedule: "Mon, Wed, Fri 9:00-10:30",
      capacity: 40,
      enrolled: 30,
    },
    {
      id: "phy101",
      code: "PHY 101",
      title: "Engineering Physics",
      credits: 3,
      type: "Core",
      semester: 1,
      prerequisites: [],
      instructor: "Dr. Habibur Rahman",
      schedule: "Sun, Tue, Thu 2:00-3:30",
      capacity: 35,
      enrolled: 26,
    },
    {
      id: "che101",
      code: "CHE 101",
      title: "Engineering Chemistry",
      credits: 3,
      type: "Core",
      semester: 1,
      prerequisites: [],
      instructor: "Prof. Nasir Ahmed",
      schedule: "Mon, Wed, Fri 2:00-3:30",
      capacity: 35,
      enrolled: 22,
    },
  ],
};

const departmentStudents: Record<string, Student[]> = {
  "Computer Science": [
    {
      id: "cs001",
      name: "Fahim Ahmed",
      studentId: "NUB-CSE-2024-001",
      email: "fahim.ahmed@example.com",
      phone: "+8801712345678",
      cgpa: 0.0,
      status: "admitted",
      registrationDate: "2024-01-15",
      isSelected: false,
    },
    {
      id: "cs002",
      name: "Tasnim Rahman",
      studentId: "NUB-CSE-2024-002",
      email: "tasnim.rahman@example.com",
      phone: "+8801887654321",
      cgpa: 0.0,
      status: "admitted",
      registrationDate: "2024-01-20",
      isSelected: false,
    },
    {
      id: "cs003",
      name: "Rafiq Islam",
      studentId: "NUB-CSE-2024-003",
      email: "rafiq.islam@example.com",
      phone: "+8801598765432",
      cgpa: 0.0,
      status: "registered",
      registrationDate: "2024-02-01",
      isSelected: false,
    },
    {
      id: "cs004",
      name: "Sadia Sultana",
      studentId: "NUB-CSE-2024-004",
      email: "sadia.sultana@example.com",
      phone: "+8801623456789",
      cgpa: 0.0,
      status: "pending",
      registrationDate: "2024-02-10",
      isSelected: false,
    },
    {
      id: "cs005",
      name: "Hassan Ali",
      studentId: "NUB-CSE-2024-005",
      email: "hassan.ali@example.com",
      phone: "+8801734567890",
      cgpa: 0.0,
      status: "admitted",
      registrationDate: "2024-02-15",
      isSelected: false,
    },
  ],
  "Business Administration": [
    {
      id: "ba001",
      name: "Nusrat Jahan",
      studentId: "NUB-BBA-2024-001",
      email: "nusrat.jahan@example.com",
      phone: "+8801845612378",
      cgpa: 0.0,
      status: "admitted",
      registrationDate: "2024-01-18",
      isSelected: false,
    },
    {
      id: "ba002",
      name: "Sabbir Hossain",
      studentId: "NUB-BBA-2024-002",
      email: "sabbir.hossain@example.com",
      phone: "+8801956723489",
      cgpa: 0.0,
      status: "registered",
      registrationDate: "2024-01-25",
      isSelected: false,
    },
    {
      id: "ba003",
      name: "Ruma Begum",
      studentId: "NUB-BBA-2024-003",
      email: "ruma.begum@example.com",
      phone: "+8801067834512",
      cgpa: 0.0,
      status: "admitted",
      registrationDate: "2024-02-03",
      isSelected: false,
    },
    {
      id: "ba004",
      name: "Karim Uddin",
      studentId: "NUB-BBA-2024-004",
      email: "karim.uddin@example.com",
      phone: "+8801178945623",
      cgpa: 0.0,
      status: "pending",
      registrationDate: "2024-02-12",
      isSelected: false,
    },
  ],
  "Electrical Engineering": [
    {
      id: "ee001",
      name: "Abdullah Khan",
      studentId: "NUB-EEE-2024-001",
      email: "abdullah.khan@example.com",
      phone: "+8801289056734",
      cgpa: 0.0,
      status: "admitted",
      registrationDate: "2024-01-22",
      isSelected: false,
    },
    {
      id: "ee002",
      name: "Fariha Tabassum",
      studentId: "NUB-EEE-2024-002",
      email: "fariha.tabassum@example.com",
      phone: "+8801390167845",
      cgpa: 0.0,
      status: "registered",
      registrationDate: "2024-01-28",
      isSelected: false,
    },
    {
      id: "ee003",
      name: "Mahfuz Rahman",
      studentId: "NUB-EEE-2024-003",
      email: "mahfuz.rahman@example.com",
      phone: "+8801401278956",
      cgpa: 0.0,
      status: "admitted",
      registrationDate: "2024-02-05",
      isSelected: false,
    },
  ],
  "Civil Engineering": [
    {
      id: "ce001",
      name: "Nasir Ahmed",
      studentId: "NUB-CE-2024-001",
      email: "nasir.ahmed@example.com",
      phone: "+8801512389067",
      cgpa: 0.0,
      status: "admitted",
      registrationDate: "2024-01-25",
      isSelected: false,
    },
    {
      id: "ce002",
      name: "Shahana Parvin",
      studentId: "NUB-CE-2024-002",
      email: "shahana.parvin@example.com",
      phone: "+8801623490178",
      cgpa: 0.0,
      status: "registered",
      registrationDate: "2024-02-01",
      isSelected: false,
    },
    {
      id: "ce003",
      name: "Robiul Islam",
      studentId: "NUB-CE-2024-003",
      email: "robiul.islam@example.com",
      phone: "+8801734501289",
      cgpa: 0.0,
      status: "pending",
      registrationDate: "2024-02-08",
      isSelected: false,
    },
  ],
};

const departments = [
  "Computer Science",
  "Business Administration",
  "Electrical Engineering",
  "Civil Engineering",
];

export default function OfferCourses() {
  const { toast } = useToast();
  const [selectedDepartment, setSelectedDepartment] = useState<string>("");
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [students, setStudents] = useState<Student[]>([]);
  const [courses, setCourses] = useState<Course[]>([]);
  const [selectedStudentRange, setSelectedStudentRange] = useState({ start: "", end: "" });
  const [offerMessage, setOfferMessage] = useState("");

  // Load department data when department changes
  const handleDepartmentChange = (department: string) => {
    setSelectedDepartment(department);
    setCourses(departmentCourses[department] || []);
    setStudents(departmentStudents[department] || []);
    setSearchTerm("");
    setStatusFilter("all");
  };

  // Filter students based on search term and status
  const filteredStudents = students.filter((student) => {
    const matchesSearch = 
      student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      student.studentId.toLowerCase().includes(searchTerm.toLowerCase()) ||
      student.email.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = 
      statusFilter === "all" || 
      student.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  // Calculate stats
  const stats = {
    totalCourses: courses.length,
    totalStudents: students.length,
    registeredStudents: students.filter(s => s.status === "registered").length,
    pendingStudents: students.filter(s => s.status === "pending").length,
  };

  // Handle student selection
  const toggleStudentSelection = (studentId: string) => {
    setStudents(prev => 
      prev.map(student => 
        student.id === studentId 
          ? { ...student, isSelected: !student.isSelected }
          : student
      )
    );
  };

  const selectAllStudents = () => {
    const allSelected = filteredStudents.every(s => s.isSelected);
    setStudents(prev => 
      prev.map(student => ({
        ...student,
        isSelected: filteredStudents.includes(student) ? !allSelected : student.isSelected
      }))
    );
  };

  const selectStudentRange = () => {
    if (!selectedStudentRange.start || !selectedStudentRange.end) {
      toast({
        title: "Invalid Range",
        description: "Please enter both start and end student IDs.",
        variant: "destructive",
      });
      return;
    }

    const startIndex = students.findIndex(s => s.studentId.includes(selectedStudentRange.start));
    const endIndex = students.findIndex(s => s.studentId.includes(selectedStudentRange.end));

    if (startIndex === -1 || endIndex === -1) {
      toast({
        title: "Invalid Range",
        description: "Student IDs not found in the current department.",
        variant: "destructive",
      });
      return;
    }

    const start = Math.min(startIndex, endIndex);
    const end = Math.max(startIndex, endIndex);

    setStudents(prev => 
      prev.map((student, index) => ({
        ...student,
        isSelected: index >= start && index <= end
      }))
    );

    toast({
      title: "Range Selected",
      description: `Selected students from ${selectedStudentRange.start} to ${selectedStudentRange.end}`,
    });
  };

  // Offer courses to selected students
  const offerCoursesToSelected = () => {
    const selectedCount = students.filter(s => s.isSelected).length;
    if (selectedCount === 0) {
      toast({
        title: "No Students Selected",
        description: "Please select at least one student to offer courses.",
        variant: "destructive",
      });
      return;
    }

    toast({
      title: "Courses Offered Successfully",
      description: `Courses have been offered to ${selectedCount} students in ${selectedDepartment}.`,
    });

    // Reset selections
    setStudents(prev => prev.map(s => ({ ...s, isSelected: false })));
    setOfferMessage("");
  };

  const getStatusBadge = (status: string) => {
    const config = {
      admitted: { color: "bg-blue-100 text-blue-800", label: "Admitted" },
      registered: { color: "bg-green-100 text-green-800", label: "Registered" },
      pending: { color: "bg-yellow-100 text-yellow-800", label: "Pending" },
    };
    
    const { color, label } = config[status as keyof typeof config] || config.pending;
    return <Badge className={color}>{label}</Badge>;
  };

  const getCourseTypeBadge = (type: string) => {
    const config = {
      Core: "bg-blue-100 text-blue-800",
      Elective: "bg-purple-100 text-purple-800",
      Lab: "bg-orange-100 text-orange-800",
    };
    
    return <Badge className={config[type as keyof typeof config] || "bg-gray-100 text-gray-800"}>{type}</Badge>;
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-deep-plum font-poppins">
          Offer Courses
        </h1>
        <p className="text-gray-600 mt-1">
          Manage first semester course offerings and student enrollment
        </p>
      </div>

      {/* Department Selection */}
      <Card className="mb-8">
        <CardContent className="p-6">
          <div className="flex flex-col md:flex-row gap-4 items-center">
            <div className="flex-1">
              <Label className="text-base font-semibold mb-2 block">Select Department</Label>
              <Select value={selectedDepartment} onValueChange={handleDepartmentChange}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Choose a department to view courses and students" />
                </SelectTrigger>
                <SelectContent>
                  {departments.map(dept => (
                    <SelectItem key={dept} value={dept}>
                      <div className="flex items-center gap-2">
                        <Building className="w-4 h-4" />
                        {dept}
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            {selectedDepartment && (
              <div className="flex gap-2">
                <Badge variant="outline" className="flex items-center gap-1">
                  <BookOpen className="w-3 h-3" />
                  {stats.totalCourses} Courses
                </Badge>
                <Badge variant="outline" className="flex items-center gap-1">
                  <Users className="w-3 h-3" />
                  {stats.totalStudents} Students
                </Badge>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {selectedDepartment && (
        <>
          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Total Courses</p>
                    <p className="text-3xl font-bold text-deep-plum">{stats.totalCourses}</p>
                  </div>
                  <div className="p-3 rounded-full bg-blue-100">
                    <BookOpen className="w-6 h-6 text-blue-600" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Total Students</p>
                    <p className="text-3xl font-bold text-deep-plum">{stats.totalStudents}</p>
                  </div>
                  <div className="p-3 rounded-full bg-green-100">
                    <Users className="w-6 h-6 text-green-600" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Registered</p>
                    <p className="text-3xl font-bold text-deep-plum">{stats.registeredStudents}</p>
                  </div>
                  <div className="p-3 rounded-full bg-purple-100">
                    <UserCheck className="w-6 h-6 text-purple-600" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Pending</p>
                    <p className="text-3xl font-bold text-deep-plum">{stats.pendingStudents}</p>
                  </div>
                  <div className="p-3 rounded-full bg-yellow-100">
                    <Clock className="w-6 h-6 text-yellow-600" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* First Semester Courses */}
          <Card className="mb-8">
            <CardHeader>
              <CardTitle className="text-xl font-poppins text-deep-plum flex items-center gap-2">
                <GraduationCap className="w-5 h-5" />
                First Semester Courses - {selectedDepartment}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4">
                {courses.map((course) => (
                  <div key={course.id} className="border rounded-lg p-4 hover:bg-gray-50 transition-colors">
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <h3 className="font-semibold text-lg">{course.code} - {course.title}</h3>
                          {getCourseTypeBadge(course.type)}
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-gray-600">
                          <div className="flex items-center gap-1">
                            <BookOpen className="w-4 h-4" />
                            {course.credits} Credits
                          </div>
                          <div className="flex items-center gap-1">
                            <Calendar className="w-4 h-4" />
                            {course.schedule}
                          </div>
                          <div className="flex items-center gap-1">
                            <Users className="w-4 h-4" />
                            {course.enrolled}/{course.capacity} Students
                          </div>
                        </div>
                        <p className="text-sm text-gray-600 mt-2">
                          <strong>Instructor:</strong> {course.instructor}
                        </p>
                      </div>
                      <div className="text-right">
                        <div className="text-sm text-gray-500 mb-1">Capacity</div>
                        <div className="text-2xl font-bold text-deep-plum">
                          {Math.round((course.enrolled / course.capacity) * 100)}%
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Student Management */}
          <Card>
            <CardHeader>
              <div className="flex justify-between items-center">
                <CardTitle className="text-xl font-poppins text-deep-plum flex items-center gap-2">
                  <Users className="w-5 h-5" />
                  Admitted Students - {selectedDepartment} ({filteredStudents.length})
                </CardTitle>
                
                <div className="flex gap-2">
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button variant="outline" className="border-blue-500 text-blue-600 hover:bg-blue-50">
                        <Filter className="w-4 h-4 mr-2" />
                        Select Range
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Select Student ID Range</DialogTitle>
                      </DialogHeader>
                      <div className="grid gap-4 py-4">
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <Label>Start Student ID</Label>
                            <Input 
                              placeholder="e.g., 001"
                              value={selectedStudentRange.start}
                              onChange={(e) => setSelectedStudentRange(prev => ({ ...prev, start: e.target.value }))}
                            />
                          </div>
                          <div>
                            <Label>End Student ID</Label>
                            <Input 
                              placeholder="e.g., 010"
                              value={selectedStudentRange.end}
                              onChange={(e) => setSelectedStudentRange(prev => ({ ...prev, end: e.target.value }))}
                            />
                          </div>
                        </div>
                        <Button onClick={selectStudentRange}>Select Range</Button>
                      </div>
                    </DialogContent>
                  </Dialog>

                  <Dialog>
                    <DialogTrigger asChild>
                      <Button className="bg-deep-plum hover:bg-accent-purple">
                        <Send className="w-4 h-4 mr-2" />
                        Offer Courses
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Offer Courses to Selected Students</DialogTitle>
                      </DialogHeader>
                      <div className="grid gap-4 py-4">
                        <div>
                          <Label>Selected Students: {students.filter(s => s.isSelected).length}</Label>
                          <div className="text-sm text-gray-500 mt-1">
                            {students.filter(s => s.isSelected).map(s => s.name).join(", ")}
                          </div>
                        </div>
                        <div>
                          <Label>Courses to Offer</Label>
                          <div className="text-sm text-gray-600 mt-1">
                            All {courses.length} first semester courses will be offered to selected students.
                          </div>
                        </div>
                        <div>
                          <Label>Additional Message (Optional)</Label>
                          <Textarea 
                            placeholder="Add any additional instructions or information..."
                            value={offerMessage}
                            onChange={(e) => setOfferMessage(e.target.value)}
                          />
                        </div>
                        <Button onClick={offerCoursesToSelected} disabled={students.filter(s => s.isSelected).length === 0}>
                          <CheckCircle className="w-4 h-4 mr-2" />
                          Confirm Offer
                        </Button>
                      </div>
                    </DialogContent>
                  </Dialog>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              {/* Filters */}
              <div className="flex flex-col md:flex-row gap-4 mb-6">
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
                    <SelectItem value="admitted">Admitted</SelectItem>
                    <SelectItem value="registered">Registered</SelectItem>
                    <SelectItem value="pending">Pending</SelectItem>
                  </SelectContent>
                </Select>

                <Button 
                  variant="outline" 
                  onClick={selectAllStudents}
                  className="border-green-500 text-green-600 hover:bg-green-50"
                >
                  {filteredStudents.every(s => s.isSelected) ? "Deselect All" : "Select All"}
                </Button>
              </div>

              {/* Students Table */}
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-12">
                      <Checkbox
                        checked={filteredStudents.length > 0 && filteredStudents.every(s => s.isSelected)}
                        onCheckedChange={selectAllStudents}
                      />
                    </TableHead>
                    <TableHead>Student Info</TableHead>
                    <TableHead>Contact</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Registration Date</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredStudents.map((student) => (
                    <TableRow key={student.id} className={student.isSelected ? "bg-blue-50" : ""}>
                      <TableCell>
                        <Checkbox
                          checked={student.isSelected}
                          onCheckedChange={() => toggleStudentSelection(student.id)}
                        />
                      </TableCell>
                      <TableCell>
                        <div>
                          <div className="font-medium">{student.name}</div>
                          <div className="text-sm text-gray-500">{student.studentId}</div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div>
                          <div className="text-sm">{student.email}</div>
                          <div className="text-sm text-gray-500">{student.phone}</div>
                        </div>
                      </TableCell>
                      <TableCell>
                        {getStatusBadge(student.status)}
                      </TableCell>
                      <TableCell>
                        {new Date(student.registrationDate).toLocaleDateString()}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </>
      )}

      {!selectedDepartment && (
        <Card>
          <CardContent className="p-12 text-center">
            <Building className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-600 mb-2">Select a Department</h3>
            <p className="text-gray-500">Choose a department from the dropdown above to view courses and manage student enrollment.</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
