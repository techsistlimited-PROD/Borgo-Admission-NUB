import { Link } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../components/ui/card";
import { Badge } from "../components/ui/badge";
import { ArrowLeft, Calendar, Clock } from "lucide-react";

export default function RoutineView() {
  const schedule = [
    {
      day: "Sunday",
      classes: [
        { time: "08:00-09:30", course: "CSE401", title: "Software Engineering", room: "Room 301", type: "theory" },
        { time: "10:00-11:30", course: "CSE403", title: "Database Systems", room: "Room 205", type: "theory" },
        { time: "14:00-17:00", course: "CSE401", title: "Software Engineering Lab", room: "Lab 1", type: "lab" },
      ]
    },
    {
      day: "Monday",
      classes: [
        { time: "08:00-09:30", course: "MAT401", title: "Numerical Analysis", room: "Room 102", type: "theory" },
        { time: "10:00-11:30", course: "CSE405", title: "Computer Networks", room: "Room 301", type: "theory" },
        { time: "14:00-17:00", course: "CSE403", title: "Database Systems Lab", room: "Lab 2", type: "lab" },
      ]
    },
    {
      day: "Tuesday",
      classes: [
        { time: "08:00-09:30", course: "CSE401", title: "Software Engineering", room: "Room 301", type: "theory" },
        { time: "10:00-11:30", course: "ENG401", title: "Technical Writing", room: "Room 105", type: "theory" },
      ]
    },
    {
      day: "Wednesday",
      classes: [
        { time: "08:00-09:30", course: "CSE403", title: "Database Systems", room: "Room 205", type: "theory" },
        { time: "10:00-11:30", course: "MAT401", title: "Numerical Analysis", room: "Room 102", type: "theory" },
        { time: "14:00-17:00", course: "CSE405", title: "Computer Networks Lab", room: "Lab 3", type: "lab" },
      ]
    },
    {
      day: "Thursday",
      classes: [
        { time: "08:00-09:30", course: "CSE405", title: "Computer Networks", room: "Room 301", type: "theory" },
        { time: "10:00-11:30", course: "ENG401", title: "Technical Writing", room: "Room 105", type: "theory" },
      ]
    }
  ];

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
              <Calendar className="h-6 w-6 text-purple-600 mr-2" />
              <h1 className="text-2xl font-bold text-gray-900">Class Routine</h1>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Fall 2024 - Class Schedule</CardTitle>
            <CardDescription>Your weekly class routine</CardDescription>
          </CardHeader>
        </Card>

        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
          {schedule.map((day, index) => (
            <Card key={index}>
              <CardHeader>
                <CardTitle className="text-lg">{day.day}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {day.classes.length === 0 ? (
                    <p className="text-gray-500 text-sm text-center py-4">No classes</p>
                  ) : (
                    day.classes.map((cls, classIndex) => (
                      <div key={classIndex} className="border rounded-lg p-3 bg-white/50">
                        <div className="flex items-start justify-between mb-2">
                          <div className="flex items-center">
                            <Clock className="h-4 w-4 text-gray-500 mr-1" />
                            <span className="text-sm font-medium">{cls.time}</span>
                          </div>
                          <Badge variant={cls.type === "lab" ? "secondary" : "default"} className="text-xs">
                            {cls.type}
                          </Badge>
                        </div>
                        <h4 className="font-semibold text-sm">{cls.course}</h4>
                        <p className="text-xs text-gray-600 mb-1">{cls.title}</p>
                        <p className="text-xs text-gray-500">{cls.room}</p>
                      </div>
                    ))
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
