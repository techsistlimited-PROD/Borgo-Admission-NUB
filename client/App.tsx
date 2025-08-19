import "./global.css";

import React from "react";
import { Toaster } from "@/components/ui/toaster";
import { createRoot } from "react-dom/client";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Header from "./components/Header";
import Sidebar from "./components/Sidebar";
import { AuthProvider, useAuth } from "./contexts/AuthContext";
import { ApplicationProvider } from "./contexts/ApplicationContext";
import Index from "./pages/Index";
import ProgramSelection from "./pages/ProgramSelection";
import PersonalInformation from "./pages/PersonalInformation";
import AcademicHistory from "./pages/AcademicHistory";
import ReviewPayment from "./pages/ReviewPayment";
import ApplicationReview from "./pages/ApplicationReview";
import ApplicationSuccess from "./pages/ApplicationSuccess";
import Dashboard from "./pages/Dashboard";
import AdminAdmissionList from "./pages/AdminAdmissionList";
import ApplicantDetail from "./pages/ApplicantDetail";
import FinancePanel from "./pages/FinancePanel";
import Reports from "./pages/Reports";
import Notifications from "./pages/Notifications";
import EmailTemplates from "./pages/EmailTemplates";
import ApplicantLogin from "./pages/ApplicantLogin";
import AdminLogin from "./pages/AdminLogin";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const Layout = () => {
  const { userType, user } = useAuth();
  const isLoginPage =
    window.location.pathname.includes("-login") ||
    window.location.pathname === "/applicant-portal" ||
    window.location.pathname === "/admin";

  // Handle login pages and portal entry points
  if (isLoginPage) {
    return (
      <div className="min-h-screen bg-lavender-bg">
        <Routes>
          <Route path="/applicant-login" element={<ApplicantLogin />} />
          <Route path="/admin-login" element={<AdminLogin />} />
          <Route path="/applicant-portal" element={<ApplicantLogin />} />
          <Route path="/admin" element={<AdminLogin />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-lavender-bg flex">
      <Sidebar userType={userType} />
      <div className="flex-1 flex flex-col">
        <Header showLogin={!user} />
        <main className="flex-1 p-6">
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/program-selection" element={<ProgramSelection />} />
            <Route
              path="/personal-information"
              element={<PersonalInformation />}
            />
            <Route path="/academic-history" element={<AcademicHistory />} />
            <Route path="/review-payment" element={<ReviewPayment />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/notifications" element={<Notifications />} />
            <Route path="/admin/admissions" element={<AdminAdmissionList />} />
            <Route path="/admin/applicant/:id" element={<ApplicantDetail />} />
            <Route path="/admin/finance" element={<FinancePanel />} />
            <Route path="/admin/reports" element={<Reports />} />
            <Route path="/admin/templates" element={<EmailTemplates />} />
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </main>
      </div>
    </div>
  );
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <AuthProvider>
          <ApplicationProvider>
            <Layout />
          </ApplicationProvider>
        </AuthProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
