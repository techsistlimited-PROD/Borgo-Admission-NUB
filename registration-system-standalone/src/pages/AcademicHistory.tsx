import { Link } from "react-router-dom";
import { Button } from "../components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../components/ui/card";
import { Badge } from "../components/ui/badge";
import { ArrowLeft, FileText, Download } from "lucide-react";

export default function AcademicHistory() {
  const semesters = [
    {
      name: "Fall 2024",
      gpa: "3.80",
      credits: 15,
      status: "current",
      courses: [
        { code: "CSE401", name: "Software Engineering", credits: 3, grade: "A-" },
        { code: "CSE403", name: "Database Systems", credits: 3, grade: "A" },
        { code: "CSE405", name: "Computer Networks", credits: 3, grade: "B+" },
        { code: "MAT401", name: "Numerical Analysis", credits: 3, grade: "A-" },
        { code: "ENG401", name: "Technical Writing", credits: 3, grade: "A" },
      ]
    },
    {
      name: "Summer 2024",
      gpa: "3.75",
      credits: 9,
      status: "completed",
      courses: [
        { code: "CSE301", name: "Data Structures", credits: 3, grade: "A" },
        { code: "CSE303", name: "Algorithms", credits: 3, grade: "B+" },
        { code: "MAT301", name: "Statistics", credits: 3, grade: "A-" },
      ]
    },
    {
      name: "Spring 2024",
      gpa: "3.70",
      credits: 15,
      status: "completed",
      courses: [
        { code: "CSE201", name: "Object Oriented Programming", credits: 3, grade: "A" },
        { code: "CSE203", name: "Computer Organization", credits: 3, grade: "B+" },
        { code: "MAT201", name: "Linear Algebra", credits: 3, grade: "A-" },
        { code: "PHY201", name: "Physics II", credits: 3, grade: "B+" },
        { code: "ENG201", name: "English II", credits: 3, grade: "A" },
      ]
    }
  ];

  const overallStats = {
    cgpa: "3.75",
    totalCredits: 96,
    completedCredits: 81,
    currentCredits: 15
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-indigo-100">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between py-4">
            <div className="flex items-center">
              <Link
                to="/student/dashboard"
                className="flex items-center text-purple-600 hover:text-purple-700 mr-4"
              >
                <ArrowLeft className="h-5 w-5 mr-1" />
                Back to Dashboard
              </Link>
              <div className="flex items-center">
                <FileText className="h-6 w-6 text-purple-600 mr-2" />
                <h1 className="text-2xl font-bold text-gray-900">Academic History</h1>
              </div>
            </div>
            <Button variant="outline" className="flex items-center">
              <Download className="h-4 w-4 mr-2" />
              Download Transcript
            </Button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Overall Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="text-center">
                <p className="text-sm font-medium text-gray-600">Cumulative GPA</p>
                <p className="text-3xl font-bold text-purple-600">{overallStats.cgpa}</p>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className="text-center">
                <p className="text-sm font-medium text-gray-600">Completed Credits</p>
                <p className="text-3xl font-bold text-green-600">{overallStats.completedCredits}</p>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className="text-center">
                <p className="text-sm font-medium text-gray-600">Current Credits</p>
                <p className="text-3xl font-bold text-blue-600">{overallStats.currentCredits}</p>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className="text-center">
                <p className="text-sm font-medium text-gray-600">Total Credits</p>
                <p className="text-3xl font-bold text-gray-600">{overallStats.totalCredits}</p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Semester History */}
        <div className="space-y-6">
          {semesters.map((semester, index) => (
            <Card key={index}>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="flex items-center">
                      {semester.name}
                      <Badge 
                        variant={semester.status === "current" ? "default" : "secondary"}
                        className="ml-2"
                      >
                        {semester.status === "current" ? "Current" : "Completed"}
                      </Badge>
                    </CardTitle>
                    <CardDescription>
                      GPA: {semester.gpa} | Credits: {semester.credits}
                    </CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b">
                        <th className="text-left py-2">Course Code</th>
                        <th className="text-left py-2">Course Name</th>
                        <th className="text-center py-2">Credits</th>
                        <th className="text-center py-2">Grade</th>
                      </tr>
                    </thead>
                    <tbody>
                      {semester.courses.map((course, courseIndex) => (
                        <tr key={courseIndex} className="border-b border-gray-100">
                          <td className="py-2 font-medium">{course.code}</td>
                          <td className="py-2">{course.name}</td>
                          <td className="py-2 text-center">{course.credits}</td>
                          <td className="py-2 text-center">
                            <Badge variant="outline">{course.grade}</Badge>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
