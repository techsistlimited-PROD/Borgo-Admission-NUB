import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import {
  Home,
  User,
  GraduationCap,
  FileText,
  CreditCard,
  LayoutDashboard,
  Bell,
  Shield,
  Users,
  PieChart,
  Mail,
  ChevronLeft,
  ChevronRight,
  LogIn,
  UserCheck,
  BookOpen,
} from "lucide-react";
import { Button } from "./ui/button";
import { Separator } from "./ui/separator";
import { Badge } from "./ui/badge";

interface SidebarProps {
  userType: "public" | "applicant" | "admin" | null;
}

export default function Sidebar({ userType }: SidebarProps) {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const location = useLocation();

  const publicPages = [
    { name: "Home", path: "/", icon: Home },
    {
      name: "Program Selection",
      path: "/program-selection",
      icon: GraduationCap,
    },
    { name: "Personal Info", path: "/personal-information", icon: User },
    { name: "Academic History", path: "/academic-history", icon: FileText },
    { name: "Review & Submit", path: "/application-review", icon: FileText },
  ];

  const applicantPages = [
    { name: "Dashboard", path: "/dashboard", icon: LayoutDashboard },
    { name: "Payment Portal", path: "/payment-portal", icon: CreditCard },
    { name: "Notifications", path: "/notifications", icon: Bell },
  ];

  const adminPages = [
    { name: "Admissions", path: "/admin/admissions", icon: Users },
    { name: "Finance", path: "/admin/finance", icon: CreditCard },
    { name: "Reports", path: "/admin/reports", icon: PieChart },
    { name: "Templates", path: "/admin/templates", icon: Mail },
    { name: "Syllabus", path: "/admin/syllabus", icon: BookOpen },
    {
      name: "Configuration",
      path: "/admin/configuration",
      icon: LayoutDashboard,
    },
  ];

  const loginPages = [
    { name: "Applicant Login", path: "/applicant-login", icon: UserCheck },
    { name: "Admin Login", path: "/admin-login", icon: LogIn },
  ];

  const getPages = () => {
    switch (userType) {
      case "applicant":
        return applicantPages;
      case "admin":
        return adminPages;
      default:
        return publicPages;
    }
  };

  const isActive = (path: string) => location.pathname === path;

  return (
    <div
      className={`${isCollapsed ? "w-16" : "w-64"} transition-all duration-300 bg-white border-r border-gray-200 min-h-screen flex flex-col`}
    >
      {/* Header */}
      <div className="p-4 border-b border-gray-200">
        <div className="flex items-center justify-between">
          {!isCollapsed && (
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-deep-plum rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">NU</span>
              </div>
              <span className="font-semibold text-deep-plum">Navigation</span>
            </div>
          )}
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="text-gray-500 hover:text-deep-plum"
          >
            {isCollapsed ? (
              <ChevronRight className="w-4 h-4" />
            ) : (
              <ChevronLeft className="w-4 h-4" />
            )}
          </Button>
        </div>
      </div>

      {/* User Type Badge */}
      {!isCollapsed && (
        <div className="p-4">
          <Badge
            className={`w-full justify-center ${
              userType === "admin"
                ? "bg-purple-100 text-purple-800"
                : userType === "applicant"
                  ? "bg-green-100 text-green-800"
                  : "bg-blue-100 text-blue-800"
            }`}
          >
            {userType === "admin"
              ? "Admin Panel"
              : userType === "applicant"
                ? "Applicant Portal"
                : "Public Access"}
          </Badge>
        </div>
      )}

      {/* Navigation */}
      <div className="flex-1 p-2">
        <div className="space-y-1">
          {getPages().map((page) => (
            <Link
              key={page.path}
              to={page.path}
              className={`flex items-center gap-3 px-3 py-2 rounded-lg transition-colors ${
                isActive(page.path)
                  ? "bg-deep-plum text-white"
                  : "text-gray-700 hover:bg-gray-100"
              }`}
            >
              <page.icon className="w-4 h-4 flex-shrink-0" />
              {!isCollapsed && (
                <span className="text-sm font-medium">{page.name}</span>
              )}
            </Link>
          ))}
        </div>
      </div>

      {/* Footer */}
      {!isCollapsed && (
        <div className="p-4 border-t border-gray-200">
          <div className="text-xs text-gray-500 text-center">
            Northern University Bangladesh
          </div>
        </div>
      )}
    </div>
  );
}
