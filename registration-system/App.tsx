import "./global.css";

import { useEffect } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  BrowserRouter,
  Routes,
  Route,
  Navigate,
  useLocation,
} from "react-router-dom";
import ErrorBoundary from "./components/ErrorBoundary";
import { RegistrationAuthProvider } from "./contexts/RegistrationAuthContext";

// Registration System Pages
import RegistrationIndex from "./pages/Index";
import StudentLogin from "./pages/StudentLogin";
import AdvisorLogin from "./pages/AdvisorLogin";
import AdminLogin from "./pages/AdminLogin";
import StudentDashboard from "./pages/StudentDashboard";
import AdvisorDashboard from "./pages/AdvisorDashboard";
import AdminDashboard from "./pages/AdminDashboard";
import CourseRegistration from "./pages/CourseRegistration";
import AcademicHistory from "./pages/AcademicHistory";
import StudentSearch from "./pages/StudentSearch";
import RoutineView from "./pages/RoutineView";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

function AppContent() {
  const location = useLocation();

  // Set up form cache prevention on app load
  useEffect(() => {
    // Disable browser form caching
    const forms = document.querySelectorAll('form');
    forms.forEach(form => {
      form.setAttribute('autocomplete', 'off');
    });
  }, []);

  return (
    <div className="min-h-screen bg-lavender-bg">
      <main className="min-h-screen">
        <Routes>
          {/* Main Landing Page */}
          <Route path="/" element={<RegistrationIndex />} />
          <Route path="/registration" element={<Navigate to="/" replace />} />

          {/* Authentication Routes */}
          <Route path="/student-login" element={<StudentLogin />} />
          <Route path="/advisor-login" element={<AdvisorLogin />} />
          <Route path="/admin-login" element={<AdminLogin />} />

          {/* Student Routes */}
          <Route path="/student/dashboard" element={<StudentDashboard />} />
          <Route path="/student/registration" element={<CourseRegistration />} />
          <Route path="/student/history" element={<AcademicHistory />} />
          <Route path="/student/search" element={<StudentSearch />} />
          <Route path="/student/routine" element={<RoutineView />} />

          {/* Advisor Routes */}
          <Route path="/advisor/dashboard" element={<AdvisorDashboard />} />
          <Route path="/advisor/students" element={<Navigate to="/advisor/dashboard" replace />} />
          <Route path="/advisor/approvals" element={<Navigate to="/advisor/dashboard" replace />} />

          {/* Admin Routes */}
          <Route path="/admin/dashboard" element={<AdminDashboard />} />
          <Route path="/admin/students" element={<Navigate to="/admin/dashboard" replace />} />
          <Route path="/admin/courses" element={<Navigate to="/admin/dashboard" replace />} />
          <Route path="/admin/schedules" element={<Navigate to="/admin/dashboard" replace />} />
          <Route path="/admin/reports" element={<Navigate to="/admin/dashboard" replace />} />

          {/* Fallback */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>
    </div>
  );
}

function App() {
  return (
    <ErrorBoundary>
      <QueryClientProvider client={queryClient}>
        <TooltipProvider>
          <RegistrationAuthProvider>
            <BrowserRouter>
              <ErrorBoundary>
                <Toaster />
                <Sonner />
                <AppContent />
              </ErrorBoundary>
            </BrowserRouter>
          </RegistrationAuthProvider>
        </TooltipProvider>
      </QueryClientProvider>
    </ErrorBoundary>
  );
}

export default App;
