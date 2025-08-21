import { useState } from "react";
import {
  Plus,
  Edit,
  Eye,
  Trash2,
  Calendar,
  FileText,
  Users,
  Download,
  Upload,
  Search,
  Filter,
  Send,
  Copy,
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

interface AdmissionCircular {
  id: string;
  title: string;
  description: string;
  academicYear: string;
  semester: "Spring" | "Summer" | "Fall";
  departments: string[];
  programs: string[];
  applicationDeadline: string;
  admissionTestDate: string;
  resultPublishDate: string;
  status: "draft" | "published" | "closed" | "archived";
  createdBy: string;
  createdDate: string;
  lastModified: string;
  applicationsCount: number;
  documentsRequired: string[];
  eligibilityCriteria: string[];
  fees: {
    application: number;
    admission: number;
  };
  content: string;
}

const mockCirculars: AdmissionCircular[] = [
  {
    id: "1",
    title: "Spring 2024 Admission - Undergraduate Programs",
    description: "Admission circular for undergraduate programs for Spring 2024 semester",
    academicYear: "2024",
    semester: "Spring",
    departments: ["Computer Science", "Business Administration", "Electrical Engineering"],
    programs: ["BSc in CSE", "BBA", "BSc in EEE"],
    applicationDeadline: "2024-03-15",
    admissionTestDate: "2024-03-25",
    resultPublishDate: "2024-04-05",
    status: "published",
    createdBy: "Admin",
    createdDate: "2024-01-15",
    lastModified: "2024-02-10",
    applicationsCount: 567,
    documentsRequired: [
      "SSC Certificate & Transcript",
      "HSC Certificate & Transcript", 
      "Birth Certificate",
      "Passport Size Photos (3 copies)",
      "National ID Card (Photocopy)"
    ],
    eligibilityCriteria: [
      "Minimum GPA 3.5 in SSC and HSC",
      "Must have Mathematics and English in HSC",
      "Age limit: 25 years"
    ],
    fees: {
      application: 1000,
      admission: 50000,
    },
    content: "Detailed admission circular content for Spring 2024...",
  },
  {
    id: "2",
    title: "Summer 2024 Admission - Graduate Programs",
    description: "Admission circular for graduate programs for Summer 2024 semester",
    academicYear: "2024",
    semester: "Summer",
    departments: ["Computer Science", "Business Administration"],
    programs: ["MSc in CSE", "MBA"],
    applicationDeadline: "2024-05-20",
    admissionTestDate: "2024-06-01",
    resultPublishDate: "2024-06-15",
    status: "draft",
    createdBy: "Admin",
    createdDate: "2024-02-20",
    lastModified: "2024-02-21",
    applicationsCount: 0,
    documentsRequired: [
      "Bachelor's Degree Certificate & Transcript",
      "Bachelor's Degree equivalent certificate",
      "Experience Certificate (if applicable)",
      "Research Proposal (for MSc)",
      "Passport Size Photos (3 copies)"
    ],
    eligibilityCriteria: [
      "Bachelor's degree with minimum CGPA 3.0",
      "2 years work experience (for MBA)",
      "IELTS/TOEFL score (for international students)"
    ],
    fees: {
      application: 1500,
      admission: 75000,
    },
    content: "Detailed admission circular content for Summer 2024 graduate programs...",
  },
  {
    id: "3",
    title: "Fall 2023 Admission - All Programs",
    description: "Completed admission circular for Fall 2023 semester",
    academicYear: "2023",
    semester: "Fall",
    departments: ["Computer Science", "Business Administration", "Electrical Engineering", "Civil Engineering"],
    programs: ["BSc in CSE", "BBA", "BSc in EEE", "BSc in Civil"],
    applicationDeadline: "2023-08-15",
    admissionTestDate: "2023-08-25",
    resultPublishDate: "2023-09-05",
    status: "closed",
    createdBy: "Admin",
    createdDate: "2023-05-15",
    lastModified: "2023-09-05",
    applicationsCount: 892,
    documentsRequired: [
      "SSC Certificate & Transcript",
      "HSC Certificate & Transcript",
      "Birth Certificate",
      "Passport Size Photos (3 copies)",
      "National ID Card (Photocopy)"
    ],
    eligibilityCriteria: [
      "Minimum GPA 3.0 in SSC and HSC",
      "Must have relevant subjects in HSC",
      "Age limit: 25 years"
    ],
    fees: {
      application: 800,
      admission: 45000,
    },
    content: "Detailed admission circular content for Fall 2023...",
  },
];

const departments = ["Computer Science", "Business Administration", "Electrical Engineering", "Civil Engineering", "Mechanical Engineering", "Architecture"];
const programs = {
  "Computer Science": ["BSc in CSE", "MSc in CSE", "BSc in Software Engineering"],
  "Business Administration": ["BBA", "MBA"],
  "Electrical Engineering": ["BSc in EEE"],
  "Civil Engineering": ["BSc in Civil"],
  "Mechanical Engineering": ["BSc in Mechanical"],
  "Architecture": ["Bachelor of Architecture"],
};

export default function AdmissionCircular() {
  const { toast } = useToast();
  const [circulars, setCirculars] = useState<AdmissionCircular[]>(mockCirculars);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [semesterFilter, setSemesterFilter] = useState("all");
  const [editingCircular, setEditingCircular] = useState<AdmissionCircular | null>(null);
  const [newCircular, setNewCircular] = useState<Partial<AdmissionCircular>>({
    title: "",
    description: "",
    academicYear: "2024",
    semester: "Spring",
    departments: [],
    programs: [],
    status: "draft",
    documentsRequired: [],
    eligibilityCriteria: [],
    fees: { application: 0, admission: 0 },
    content: "",
  });

  const filteredCirculars = circulars.filter((circular) => {
    const matchesSearch = 
      circular.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      circular.description.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = 
      statusFilter === "all" || 
      circular.status === statusFilter;
    
    const matchesSemester = 
      semesterFilter === "all" || 
      circular.semester === semesterFilter;

    return matchesSearch && matchesStatus && matchesSemester;
  });

  const stats = {
    totalCirculars: circulars.length,
    publishedCirculars: circulars.filter(c => c.status === "published").length,
    draftCirculars: circulars.filter(c => c.status === "draft").length,
    totalApplications: circulars.reduce((sum, c) => sum + c.applicationsCount, 0),
  };

  const createCircular = () => {
    if (!newCircular.title || !newCircular.description) {
      toast({
        title: "Validation Error",
        description: "Please fill in all required fields.",
        variant: "destructive",
      });
      return;
    }

    const circular: AdmissionCircular = {
      id: `c${Date.now()}`,
      title: newCircular.title!,
      description: newCircular.description!,
      academicYear: newCircular.academicYear!,
      semester: newCircular.semester as "Spring" | "Summer" | "Fall",
      departments: newCircular.departments!,
      programs: newCircular.programs!,
      applicationDeadline: newCircular.applicationDeadline || "",
      admissionTestDate: newCircular.admissionTestDate || "",
      resultPublishDate: newCircular.resultPublishDate || "",
      status: "draft",
      createdBy: "Admin",
      createdDate: new Date().toISOString().split('T')[0],
      lastModified: new Date().toISOString().split('T')[0],
      applicationsCount: 0,
      documentsRequired: newCircular.documentsRequired!,
      eligibilityCriteria: newCircular.eligibilityCriteria!,
      fees: newCircular.fees!,
      content: newCircular.content!,
    };

    setCirculars(prev => [circular, ...prev]);
    setNewCircular({
      title: "",
      description: "",
      academicYear: "2024",
      semester: "Spring",
      departments: [],
      programs: [],
      status: "draft",
      documentsRequired: [],
      eligibilityCriteria: [],
      fees: { application: 0, admission: 0 },
      content: "",
    });

    toast({
      title: "Circular Created",
      description: "Admission circular has been created successfully.",
    });
  };

  const updateCircularStatus = (circularId: string, newStatus: "draft" | "published" | "closed" | "archived") => {
    setCirculars(prev => 
      prev.map(circular => 
        circular.id === circularId 
          ? { ...circular, status: newStatus, lastModified: new Date().toISOString().split('T')[0] }
          : circular
      )
    );

    toast({
      title: "Status Updated",
      description: `Circular status has been changed to ${newStatus}.`,
    });
  };

  const deleteCircular = (circularId: string) => {
    setCirculars(prev => prev.filter(circular => circular.id !== circularId));
    toast({
      title: "Circular Deleted",
      description: "Admission circular has been deleted successfully.",
    });
  };

  const duplicateCircular = (circular: AdmissionCircular) => {
    const duplicatedCircular: AdmissionCircular = {
      ...circular,
      id: `c${Date.now()}`,
      title: `${circular.title} (Copy)`,
      status: "draft",
      createdDate: new Date().toISOString().split('T')[0],
      lastModified: new Date().toISOString().split('T')[0],
      applicationsCount: 0,
    };

    setCirculars(prev => [duplicatedCircular, ...prev]);
    toast({
      title: "Circular Duplicated",
      description: "Admission circular has been duplicated successfully.",
    });
  };

  const getStatusBadge = (status: string) => {
    const config = {
      draft: { color: "bg-gray-100 text-gray-800", label: "Draft" },
      published: { color: "bg-green-100 text-green-800", label: "Published" },
      closed: { color: "bg-red-100 text-red-800", label: "Closed" },
      archived: { color: "bg-blue-100 text-blue-800", label: "Archived" },
    };
    
    const { color, label } = config[status as keyof typeof config] || config.draft;
    return <Badge className={color}>{label}</Badge>;
  };

  const addArrayItem = (array: string[], setArray: (arr: string[]) => void, item: string) => {
    if (item.trim() && !array.includes(item.trim())) {
      setArray([...array, item.trim()]);
    }
  };

  const removeArrayItem = (array: string[], setArray: (arr: string[]) => void, index: number) => {
    setArray(array.filter((_, i) => i !== index));
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="mb-8">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-deep-plum font-poppins">
              Admission Circular Management
            </h1>
            <p className="text-gray-600 mt-1">
              Create and manage admission circulars for different semesters and programs
            </p>
          </div>
          
          <Dialog>
            <DialogTrigger asChild>
              <Button className="bg-deep-plum hover:bg-accent-purple">
                <Plus className="w-4 h-4 mr-2" />
                Create Circular
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>Create New Admission Circular</DialogTitle>
              </DialogHeader>
              <div className="grid gap-6 py-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label>Title *</Label>
                    <Input 
                      placeholder="Circular title"
                      value={newCircular.title}
                      onChange={(e) => setNewCircular(prev => ({ ...prev, title: e.target.value }))}
                    />
                  </div>
                  <div>
                    <Label>Academic Year</Label>
                    <Select 
                      value={newCircular.academicYear} 
                      onValueChange={(value) => setNewCircular(prev => ({ ...prev, academicYear: value }))}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="2024">2024</SelectItem>
                        <SelectItem value="2025">2025</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div>
                  <Label>Description *</Label>
                  <Textarea 
                    placeholder="Brief description of the admission circular"
                    value={newCircular.description}
                    onChange={(e) => setNewCircular(prev => ({ ...prev, description: e.target.value }))}
                  />
                </div>

                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <Label>Semester</Label>
                    <Select 
                      value={newCircular.semester} 
                      onValueChange={(value) => setNewCircular(prev => ({ ...prev, semester: value }))}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Spring">Spring</SelectItem>
                        <SelectItem value="Summer">Summer</SelectItem>
                        <SelectItem value="Fall">Fall</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label>Application Deadline</Label>
                    <Input 
                      type="date"
                      value={newCircular.applicationDeadline}
                      onChange={(e) => setNewCircular(prev => ({ ...prev, applicationDeadline: e.target.value }))}
                    />
                  </div>
                  <div>
                    <Label>Admission Test Date</Label>
                    <Input 
                      type="date"
                      value={newCircular.admissionTestDate}
                      onChange={(e) => setNewCircular(prev => ({ ...prev, admissionTestDate: e.target.value }))}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label>Application Fee (৳)</Label>
                    <Input 
                      type="number"
                      value={newCircular.fees?.application}
                      onChange={(e) => setNewCircular(prev => ({ 
                        ...prev, 
                        fees: { ...prev.fees, application: Number(e.target.value) } 
                      }))}
                    />
                  </div>
                  <div>
                    <Label>Admission Fee (৳)</Label>
                    <Input 
                      type="number"
                      value={newCircular.fees?.admission}
                      onChange={(e) => setNewCircular(prev => ({ 
                        ...prev, 
                        fees: { ...prev.fees, admission: Number(e.target.value) } 
                      }))}
                    />
                  </div>
                </div>

                <div>
                  <Label>Content</Label>
                  <Textarea 
                    placeholder="Detailed content of the admission circular"
                    value={newCircular.content}
                    onChange={(e) => setNewCircular(prev => ({ ...prev, content: e.target.value }))}
                    rows={4}
                  />
                </div>

                <Button onClick={createCircular}>
                  Create Circular
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Circulars</p>
                <p className="text-3xl font-bold text-deep-plum">{stats.totalCirculars}</p>
              </div>
              <div className="p-3 rounded-full bg-blue-100">
                <FileText className="w-6 h-6 text-blue-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Published</p>
                <p className="text-3xl font-bold text-deep-plum">{stats.publishedCirculars}</p>
              </div>
              <div className="p-3 rounded-full bg-green-100">
                <Send className="w-6 h-6 text-green-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Draft</p>
                <p className="text-3xl font-bold text-deep-plum">{stats.draftCirculars}</p>
              </div>
              <div className="p-3 rounded-full bg-gray-100">
                <Edit className="w-6 h-6 text-gray-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Applications</p>
                <p className="text-3xl font-bold text-deep-plum">{stats.totalApplications}</p>
              </div>
              <div className="p-3 rounded-full bg-purple-100">
                <Users className="w-6 h-6 text-purple-600" />
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
                placeholder="Search circulars by title or description..."
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
                <SelectItem value="draft">Draft</SelectItem>
                <SelectItem value="published">Published</SelectItem>
                <SelectItem value="closed">Closed</SelectItem>
                <SelectItem value="archived">Archived</SelectItem>
              </SelectContent>
            </Select>

            <Select value={semesterFilter} onValueChange={setSemesterFilter}>
              <SelectTrigger className="md:w-40">
                <SelectValue placeholder="Semester" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Semesters</SelectItem>
                <SelectItem value="Spring">Spring</SelectItem>
                <SelectItem value="Summer">Summer</SelectItem>
                <SelectItem value="Fall">Fall</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Circulars Table */}
      <Card>
        <CardHeader>
          <CardTitle className="text-xl font-poppins text-deep-plum">
            Admission Circulars ({filteredCirculars.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Circular Info</TableHead>
                <TableHead>Academic Period</TableHead>
                <TableHead>Deadlines</TableHead>
                <TableHead>Fees</TableHead>
                <TableHead>Applications</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredCirculars.map((circular) => (
                <TableRow key={circular.id}>
                  <TableCell>
                    <div>
                      <div className="font-medium">{circular.title}</div>
                      <div className="text-sm text-gray-500">{circular.description}</div>
                      <div className="text-sm text-gray-400">
                        Created: {new Date(circular.createdDate).toLocaleDateString()}
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div>
                      <div className="font-medium">{circular.semester} {circular.academicYear}</div>
                      <div className="text-sm text-gray-500">
                        Departments: {circular.departments.slice(0, 2).join(", ")}
                        {circular.departments.length > 2 && ` +${circular.departments.length - 2} more`}
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="text-sm">
                      <div>Apply: {circular.applicationDeadline ? new Date(circular.applicationDeadline).toLocaleDateString() : "TBD"}</div>
                      <div>Test: {circular.admissionTestDate ? new Date(circular.admissionTestDate).toLocaleDateString() : "TBD"}</div>
                      <div>Result: {circular.resultPublishDate ? new Date(circular.resultPublishDate).toLocaleDateString() : "TBD"}</div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="text-sm">
                      <div>Application: ৳{circular.fees.application.toLocaleString()}</div>
                      <div>Admission: ৳{circular.fees.admission.toLocaleString()}</div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline" className="font-bold">
                      {circular.applicationsCount}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    {getStatusBadge(circular.status)}
                  </TableCell>
                  <TableCell>
                    <div className="flex gap-1 flex-wrap">
                      {/* View */}
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button variant="outline" size="sm">
                            <Eye className="w-3 h-3" />
                          </Button>
                        </DialogTrigger>
                        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
                          <DialogHeader>
                            <DialogTitle>View Circular: {circular.title}</DialogTitle>
                          </DialogHeader>
                          <div className="py-4 space-y-6">
                            <div className="grid grid-cols-2 gap-4">
                              <div>
                                <Label>Academic Period</Label>
                                <div className="text-lg">{circular.semester} {circular.academicYear}</div>
                              </div>
                              <div>
                                <Label>Status</Label>
                                <div>{getStatusBadge(circular.status)}</div>
                              </div>
                            </div>
                            
                            <div>
                              <Label>Description</Label>
                              <div className="text-gray-700 mt-1">{circular.description}</div>
                            </div>

                            <div>
                              <Label>Departments & Programs</Label>
                              <div className="mt-2 space-y-1">
                                {circular.departments.map(dept => (
                                  <Badge key={dept} variant="outline">{dept}</Badge>
                                ))}
                              </div>
                            </div>

                            <div>
                              <Label>Documents Required</Label>
                              <ul className="mt-2 space-y-1">
                                {circular.documentsRequired.map((doc, index) => (
                                  <li key={index} className="text-sm text-gray-700">• {doc}</li>
                                ))}
                              </ul>
                            </div>

                            <div>
                              <Label>Eligibility Criteria</Label>
                              <ul className="mt-2 space-y-1">
                                {circular.eligibilityCriteria.map((criteria, index) => (
                                  <li key={index} className="text-sm text-gray-700">• {criteria}</li>
                                ))}
                              </ul>
                            </div>

                            <div>
                              <Label>Content</Label>
                              <div className="mt-2 text-gray-700 whitespace-pre-wrap">{circular.content}</div>
                            </div>
                          </div>
                        </DialogContent>
                      </Dialog>

                      {/* Status Change */}
                      {circular.status === "draft" && (
                        <Button 
                          variant="outline" 
                          size="sm" 
                          className="text-green-600 border-green-200 hover:bg-green-50"
                          onClick={() => updateCircularStatus(circular.id, "published")}
                        >
                          <Send className="w-3 h-3" />
                        </Button>
                      )}

                      {circular.status === "published" && (
                        <Button 
                          variant="outline" 
                          size="sm" 
                          className="text-red-600 border-red-200 hover:bg-red-50"
                          onClick={() => updateCircularStatus(circular.id, "closed")}
                        >
                          Close
                        </Button>
                      )}

                      {/* Duplicate */}
                      <Button 
                        variant="outline" 
                        size="sm" 
                        className="text-blue-600 border-blue-200 hover:bg-blue-50"
                        onClick={() => duplicateCircular(circular)}
                      >
                        <Copy className="w-3 h-3" />
                      </Button>

                      {/* Delete */}
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button 
                            variant="outline" 
                            size="sm" 
                            className="text-red-600 border-red-200 hover:bg-red-50"
                          >
                            <Trash2 className="w-3 h-3" />
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>Delete Circular</AlertDialogTitle>
                            <AlertDialogDescription>
                              Are you sure you want to delete "{circular.title}"? This action cannot be undone.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                            <AlertDialogAction 
                              onClick={() => deleteCircular(circular.id)}
                              className="bg-red-600 hover:bg-red-700"
                            >
                              Delete
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
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
