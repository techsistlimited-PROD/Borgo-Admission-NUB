import "./global.css";

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
import Header from "./components/Header";
import Sidebar from "./components/Sidebar";
import { ApplicationProvider } from "./contexts/ApplicationContext";
import { AuthProvider, useAuth } from "./contexts/AuthContext";

// Application Pages
import Index from "./pages/Index";
import ProgramSelection from "./pages/ProgramSelection";
import PersonalInformation from "./pages/PersonalInformation";
import AcademicHistory from "./pages/AcademicHistory";
import ApplicationReview from "./pages/ApplicationReview";
import ApplicationSuccess from "./pages/ApplicationSuccess";
import NotFound from "./pages/NotFound";

// Portal Pages
import ApplicantLogin from "./pages/ApplicantLogin";
import PaymentPortal from "./pages/PaymentPortal";
import Dashboard from "./pages/Dashboard";
import Notifications from "./pages/Notifications";
import ReviewPayment from "./pages/ReviewPayment";

// Admin Pages
import AdminLogin from "./pages/AdminLogin";
import AdminAdmissionList from "./pages/AdminAdmissionList";
import ApplicantDetail from "./pages/ApplicantDetail";
import AdmissionConfiguration from "./pages/AdmissionConfiguration";
import FinancePanel from "./pages/FinancePanel";
import Reports from "./pages/Reports";
import EmailTemplates from "./pages/EmailTemplates";

const queryClient = new QueryClient();

function AppContent() {
  const { userType, isAuthenticated, isLoading } = useAuth();
  const location = useLocation();

  // Show loading spinner while auth is initializing
  if (isLoading) {
    return (
      <div className="min-h-screen bg-lavender-bg flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-deep-plum"></div>
      </div>
    );
  }

  // Determine if sidebar should be shown based on route and user type
  const shouldShowSidebar = () => {
    const path = location.pathname;

    // Don't show sidebar on login pages
    if (path === "/admin" || path === "/admin/login") return false;
    if (path === "/applicant-portal" || path === "/portal") return false;

    // For admin routes, show sidebar only if user is admin
    if (path.startsWith("/admin") && userType !== "admin") return false;

    // For applicant dashboard/portal routes, show sidebar only if authenticated as applicant
    if (
      (path === "/dashboard" ||
        path === "/payment-portal" ||
        path === "/notifications") &&
      !isAuthenticated
    )
      return false;

    // Show sidebar for public application flow and authenticated users
    return true;
  };

  return (
    <div className="min-h-screen bg-lavender-bg">
      <Header showLogin={true} />
      <div className="flex">
        {shouldShowSidebar() && <Sidebar userType={userType} />}
        <main className={`flex-1 ${shouldShowSidebar() ? "p-6" : ""}`}>
          <Routes>
            {/* Main Application Flow */}
            <Route path="/" element={<Index />} />
            <Route path="/program-selection" element={<ProgramSelection />} />
            <Route
              path="/personal-information"
              element={<PersonalInformation />}
            />
            <Route path="/academic-history" element={<AcademicHistory />} />
            <Route path="/application-review" element={<ApplicationReview />} />
            <Route
              path="/application-success"
              element={<ApplicationSuccess />}
            />

            {/* Applicant Portal */}
            <Route path="/applicant-portal" element={<ApplicantLogin />} />
            <Route path="/portal" element={<ApplicantLogin />} />
            <Route
              path="/dashboard"
              element={
                isAuthenticated && userType === "applicant" ? (
                  <Dashboard />
                ) : (
                  <Navigate to="/applicant-portal" replace />
                )
              }
            />
            <Route
              path="/payment-portal"
              element={
                isAuthenticated && userType === "applicant" ? (
                  <PaymentPortal />
                ) : (
                  <Navigate to="/applicant-portal" replace />
                )
              }
            />
            <Route path="/payment" element={<PaymentPortal />} />
            <Route
              path="/notifications"
              element={
                isAuthenticated && userType === "applicant" ? (
                  <Notifications />
                ) : (
                  <Navigate to="/applicant-portal" replace />
                )
              }
            />

            {/* Admin Portal */}
            <Route path="/admin" element={<AdminLogin />} />
            <Route path="/admin/login" element={<AdminLogin />} />
            <Route
              path="/admin/admissions"
              element={
                isAuthenticated && userType === "admin" ? (
                  <AdminAdmissionList />
                ) : (
                  <Navigate to="/admin" replace />
                )
              }
            />
            <Route
              path="/admin/applicant/:id"
              element={
                isAuthenticated && userType === "admin" ? (
                  <ApplicantDetail />
                ) : (
                  <Navigate to="/admin" replace />
                )
              }
            />
            <Route
              path="/admin/settings"
              element={
                isAuthenticated && userType === "admin" ? (
                  <AdmissionConfiguration />
                ) : (
                  <Navigate to="/admin" replace />
                )
              }
            />
            <Route
              path="/admin/configuration"
              element={
                isAuthenticated && userType === "admin" ? (
                  <AdmissionConfiguration />
                ) : (
                  <Navigate to="/admin" replace />
                )
              }
            />
            <Route
              path="/admin/finance"
              element={
                isAuthenticated && userType === "admin" ? (
                  <FinancePanel />
                ) : (
                  <Navigate to="/admin" replace />
                )
              }
            />
            <Route
              path="/admin/reports"
              element={
                isAuthenticated && userType === "admin" ? (
                  <Reports />
                ) : (
                  <Navigate to="/admin" replace />
                )
              }
            />
            <Route
              path="/admin/templates"
              element={
                isAuthenticated && userType === "admin" ? (
                  <EmailTemplates />
                ) : (
                  <Navigate to="/admin" replace />
                )
              }
            />

            {/* Fallback */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </main>
      </div>
    </div>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <AuthProvider>
          <ApplicationProvider>
            <BrowserRouter>
              <AppContent />
            </BrowserRouter>
          </ApplicationProvider>
        </AuthProvider>
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
