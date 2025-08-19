import "./global.css";

import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
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

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <AuthProvider>
            <ApplicationProvider>
              <div className="min-h-screen bg-lavender-bg">
                <Header showLogin={true} />
                <main className="p-6">
                  <Routes>
                    {/* Main Application Flow */}
                    <Route path="/" element={<Index />} />
                    <Route
                      path="/program-selection"
                      element={<ProgramSelection />}
                    />
                    <Route
                      path="/personal-information"
                      element={<PersonalInformation />}
                    />
                    <Route
                      path="/academic-history"
                      element={<AcademicHistory />}
                    />
                    <Route
                      path="/application-review"
                      element={<ApplicationReview />}
                    />
                    <Route
                      path="/application-success"
                      element={<ApplicationSuccess />}
                    />

                    {/* Applicant Portal */}
                    <Route
                      path="/applicant-portal"
                      element={<ApplicantLogin />}
                    />
                    <Route path="/portal" element={<ApplicantLogin />} />
                    <Route path="/payment-portal" element={<PaymentPortal />} />
                    <Route
                      path="/dashboard"
                      element={<Navigate to="/payment-portal" replace />}
                    />

                    {/* Admin Portal */}
                    <Route path="/admin" element={<AdminLogin />} />
                    <Route path="/admin/login" element={<AdminLogin />} />
                    <Route
                      path="/admin/admissions"
                      element={<AdminAdmissionList />}
                    />
                    <Route
                      path="/admin/applicant/:id"
                      element={<ApplicantDetail />}
                    />
                    <Route
                      path="/admin/settings"
                      element={<AdmissionConfiguration />}
                    />

                    {/* Fallback */}
                    <Route path="*" element={<NotFound />} />
                  </Routes>
                </main>
              </div>
            </ApplicationProvider>
          </AuthProvider>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
