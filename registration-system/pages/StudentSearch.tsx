import { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "../components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../components/ui/card";
import { Input } from "../components/ui/input";
import { ArrowLeft, Search, User } from "lucide-react";

export default function StudentSearch() {
  const [searchTerm, setSearchTerm] = useState("");

  const students = [
    { id: "2021-1-60-001", name: "John Doe", program: "CSE", semester: "8th" },
    { id: "2021-1-60-002", name: "Jane Smith", program: "CSE", semester: "8th" },
    { id: "2021-1-60-003", name: "Mike Johnson", program: "CSE", semester: "8th" },
    { id: "2020-1-60-015", name: "Sarah Wilson", program: "CSE", semester: "8th" },
    { id: "2022-1-60-045", name: "David Brown", program: "CSE", semester: "6th" },
  ];

  const filteredStudents = students.filter(student =>
    student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    student.id.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-indigo-100">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center py-4">
            <Link
              to="/student/dashboard"
              className="flex items-center text-purple-600 hover:text-purple-700 mr-4"
            >
              <ArrowLeft className="h-5 w-5 mr-1" />
              Back to Dashboard
            </Link>
            <div className="flex items-center">
              <User className="h-6 w-6 text-purple-600 mr-2" />
              <h1 className="text-2xl font-bold text-gray-900">Student Search</h1>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Card>
          <CardHeader>
            <CardTitle>Find Students</CardTitle>
            <CardDescription>Search for students by name or student ID</CardDescription>
            <div className="relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search by name or student ID..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {filteredStudents.length === 0 ? (
                <p className="text-gray-500 text-center py-8">
                  {searchTerm ? "No students found matching your search." : "Enter a search term to find students."}
                </p>
              ) : (
                filteredStudents.map((student) => (
                  <div key={student.id} className="border rounded-lg p-4 hover:bg-gray-50">
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="font-semibold">{student.name}</h3>
                        <p className="text-sm text-gray-600">
                          Student ID: {student.id} | Program: {student.program} | Semester: {student.semester}
                        </p>
                      </div>
                      <Button variant="outline" size="sm">
                        View Profile
                      </Button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
