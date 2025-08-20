import { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "../components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../components/ui/card";
import { Badge } from "../components/ui/badge";
import { 
  BookOpen, 
  Calendar, 
  User, 
  FileText, 
  Clock, 
  CheckCircle, 
  AlertCircle,
  GraduationCap,
  LogOut
} from "lucide-react";
import { useRegistrationAuth } from "../contexts/RegistrationAuthContext";

export default function StudentDashboard() {
  const { user, logout } = useRegistrationAuth();

  // Mock data for demonstration
  const student = {
    name: "John Doe",
    studentId: "2021-1-60-001",
    program: "Computer Science & Engineering",
    semester: "Fall 2024",
    cgpa: "3.75",
    totalCredits: 120,
    completedCredits: 96,
    currentCredits: 15
  };

  const registrationStatus = {
    isOpen: true,
    deadline: "December 15, 2024",
    coursesRegistered: 5,
    totalCredits: 15,
    status: "pending_approval"
  };

  const recentAnnouncements = [
    {
      title: "Registration Deadline Extended",
      date: "Dec 10, 2024",
      type: "important"
    },
    {
      title: "Final Exam Schedule Released",
      date: "Dec 8, 2024",
      type: "info"
    },
    {
      title: "Library Extended Hours",
      date: "Dec 5, 2024",
      type: "general"
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-indigo-100">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center">
              <GraduationCap className="h-8 w-8 text-purple-600 mr-3" />
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Student Portal</h1>
                <p className="text-sm text-gray-600">Welcome back, {student.name}</p>
              </div>
            </div>
            <Button variant="outline" onClick={logout} className="flex items-center">
              <LogOut className="h-4 w-4 mr-2" />
              Logout
            </Button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <User className="h-8 w-8 text-blue-600" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Student ID</p>
                  <p className="text-2xl font-bold text-gray-900">{student.studentId}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <BookOpen className="h-8 w-8 text-green-600" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">CGPA</p>
                  <p className="text-2xl font-bold text-gray-900">{student.cgpa}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <CheckCircle className="h-8 w-8 text-purple-600" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Credits Completed</p>
                  <p className="text-2xl font-bold text-gray-900">{student.completedCredits}/{student.totalCredits}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <Calendar className="h-8 w-8 text-orange-600" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Current Semester</p>
                  <p className="text-lg font-bold text-gray-900">{student.semester}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Actions */}
          <div className="lg:col-span-2 space-y-6">
            {/* Registration Status */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <BookOpen className="h-5 w-5 mr-2" />
                  Course Registration Status
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="font-medium">Registration Period</span>
                    <Badge variant={registrationStatus.isOpen ? "default" : "destructive"}>
                      {registrationStatus.isOpen ? "Open" : "Closed"}
                    </Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Deadline</span>
                    <span className="text-sm text-gray-600">{registrationStatus.deadline}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Courses Registered</span>
                    <span className="font-medium">{registrationStatus.coursesRegistered} courses ({registrationStatus.totalCredits} credits)</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Approval Status</span>
                    <Badge variant="secondary">
                      {registrationStatus.status === "pending_approval" ? "Pending Approval" : "Approved"}
                    </Badge>
                  </div>
                  <div className="pt-4">
                    <Link to="/student/registration">
                      <Button className="w-full">
                        Manage Course Registration
                      </Button>
                    </Link>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Quick Actions */}
            <Card>
              <CardHeader>
                <CardTitle>Quick Actions</CardTitle>
                <CardDescription>Access your most used features</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-4">
                  <Link to="/student/history">
                    <Button variant="outline" className="w-full h-16 flex flex-col">
                      <FileText className="h-5 w-5 mb-2" />
                      Academic History
                    </Button>
                  </Link>
                  <Link to="/student/routine">
                    <Button variant="outline" className="w-full h-16 flex flex-col">
                      <Calendar className="h-5 w-5 mb-2" />
                      Class Routine
                    </Button>
                  </Link>
                  <Link to="/student/search">
                    <Button variant="outline" className="w-full h-16 flex flex-col">
                      <User className="h-5 w-5 mb-2" />
                      Student Search
                    </Button>
                  </Link>
                  <Button variant="outline" className="w-full h-16 flex flex-col" disabled>
                    <Clock className="h-5 w-5 mb-2" />
                    Transcript Request
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Student Info */}
            <Card>
              <CardHeader>
                <CardTitle>Student Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div>
                  <p className="text-sm text-gray-600">Name</p>
                  <p className="font-medium">{student.name}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Student ID</p>
                  <p className="font-medium">{student.studentId}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Program</p>
                  <p className="font-medium">{student.program}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Current Semester</p>
                  <p className="font-medium">{student.semester}</p>
                </div>
              </CardContent>
            </Card>

            {/* Recent Announcements */}
            <Card>
              <CardHeader>
                <CardTitle>Recent Announcements</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {recentAnnouncements.map((announcement, index) => (
                  <div key={index} className="border-l-4 border-purple-200 pl-4 py-2">
                    <div className="flex items-start justify-between">
                      <div>
                        <p className="font-medium text-sm">{announcement.title}</p>
                        <p className="text-xs text-gray-600">{announcement.date}</p>
                      </div>
                      {announcement.type === "important" && (
                        <AlertCircle className="h-4 w-4 text-red-500 mt-0.5" />
                      )}
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
