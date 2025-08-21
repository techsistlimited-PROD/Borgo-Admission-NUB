import { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "../components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../components/ui/card";
import { Badge } from "../components/ui/badge";
import { Input } from "../components/ui/input";
import { ArrowLeft, Search, Plus, Minus, BookOpen } from "lucide-react";

export default function CourseRegistration() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCourses, setSelectedCourses] = useState<string[]>([]);

  const availableCourses = [
    { id: "CSE401", name: "Software Engineering", credits: 3, seats: 25, enrolled: 15 },
    { id: "CSE403", name: "Database Systems", credits: 3, seats: 30, enrolled: 22 },
    { id: "CSE405", name: "Computer Networks", credits: 3, seats: 25, enrolled: 18 },
    { id: "CSE407", name: "Artificial Intelligence", credits: 3, seats: 20, enrolled: 12 },
    { id: "MAT401", name: "Numerical Analysis", credits: 3, seats: 35, enrolled: 25 },
  ];

  const handleAddCourse = (courseId: string) => {
    if (!selectedCourses.includes(courseId)) {
      setSelectedCourses([...selectedCourses, courseId]);
    }
  };

  const handleRemoveCourse = (courseId: string) => {
    setSelectedCourses(selectedCourses.filter(id => id !== courseId));
  };

  const totalCredits = selectedCourses.length * 3; // Assuming all courses are 3 credits

  const filteredCourses = availableCourses.filter(course =>
    course.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    course.id.toLowerCase().includes(searchTerm.toLowerCase())
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
              <BookOpen className="h-6 w-6 text-purple-600 mr-2" />
              <h1 className="text-2xl font-bold text-gray-900">Course Registration</h1>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Available Courses */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle>Available Courses</CardTitle>
                <CardDescription>Search and add courses to your registration</CardDescription>
                <div className="relative">
                  <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Input
                    placeholder="Search courses..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {filteredCourses.map((course) => (
                    <div key={course.id} className="border rounded-lg p-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <h3 className="font-semibold">{course.id} - {course.name}</h3>
                          <p className="text-sm text-gray-600">
                            Credits: {course.credits} | Seats: {course.enrolled}/{course.seats}
                          </p>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Badge variant={course.enrolled < course.seats ? "default" : "destructive"}>
                            {course.enrolled < course.seats ? "Available" : "Full"}
                          </Badge>
                          {selectedCourses.includes(course.id) ? (
                            <Button
                              size="sm"
                              variant="destructive"
                              onClick={() => handleRemoveCourse(course.id)}
                            >
                              <Minus className="h-4 w-4" />
                            </Button>
                          ) : (
                            <Button
                              size="sm"
                              onClick={() => handleAddCourse(course.id)}
                              disabled={course.enrolled >= course.seats}
                            >
                              <Plus className="h-4 w-4" />
                            </Button>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Selected Courses */}
          <div>
            <Card>
              <CardHeader>
                <CardTitle>Selected Courses</CardTitle>
                <CardDescription>Your current registration</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {selectedCourses.length === 0 ? (
                    <p className="text-gray-500 text-center py-4">No courses selected</p>
                  ) : (
                    selectedCourses.map((courseId) => {
                      const course = availableCourses.find(c => c.id === courseId);
                      return course ? (
                        <div key={courseId} className="border rounded-lg p-3">
                          <div className="flex items-center justify-between">
                            <div>
                              <p className="font-medium text-sm">{course.id}</p>
                              <p className="text-xs text-gray-600">{course.name}</p>
                              <p className="text-xs text-gray-500">{course.credits} credits</p>
                            </div>
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={() => handleRemoveCourse(courseId)}
                            >
                              <Minus className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      ) : null;
                    })
                  )}
                  
                  <div className="border-t pt-4">
                    <div className="flex justify-between items-center mb-4">
                      <span className="font-medium">Total Credits:</span>
                      <span className="font-bold text-lg">{totalCredits}</span>
                    </div>
                    
                    <Button 
                      className="w-full" 
                      disabled={selectedCourses.length === 0}
                    >
                      Submit Registration
                    </Button>
                    
                    <p className="text-xs text-gray-500 mt-2 text-center">
                      Your registration will be sent for advisor approval
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
