import "../../global.css";

import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Header from "../../components/Header";
import { ApplicationProvider } from "../../contexts/ApplicationContext";
import Index from "../../pages/Index";
import ProgramSelection from "../../pages/ProgramSelection";
import PersonalInformation from "../../pages/PersonalInformation";
import AcademicHistory from "../../pages/AcademicHistory";
import ApplicationReview from "../../pages/ApplicationReview";
import ApplicationSuccess from "../../pages/ApplicationSuccess";
import NotFound from "../../pages/NotFound";

// Import applicant portal components
import ApplicantLogin from "../../pages/ApplicantLogin";
import Dashboard from "../../pages/Dashboard";
import Notifications from "../../pages/Notifications";
import PaymentPortal from "../../pages/PaymentPortal";
import { AuthProvider, useAuth } from "../../contexts/AuthContext";
import Sidebar from "../../components/Sidebar";

// Applicant Portal Layout for production
const ApplicantPortalLayout = () => {
  const { user, userType } = useAuth();

  if (!user || userType !== "applicant") {
    return <ApplicantLogin />;
  }

  return (
    <div className="min-h-screen bg-lavender-bg flex">
      <Sidebar userType="applicant" />
      <div className="flex-1 flex flex-col">
        <Header showLogin={false} />
        <main className="flex-1 p-6">
          <Routes>
            <Route path="/portal" element={<Navigate to="/portal/dashboard" replace />} />
            <Route path="/applicant-portal" element={<Navigate to="/portal/dashboard" replace />} />
            <Route path="/portal/dashboard" element={<Dashboard />} />
            <Route path="/portal/notifications" element={<Notifications />} />
            <Route path="/portal/payment" element={<PaymentPortal />} />
            <Route path="/portal/*" element={<Dashboard />} />
          </Routes>
        </main>
      </div>
    </div>
  );
};

// Applicant Portal Route Handler
const ApplicantPortalHandler = () => {
  // In development with multi-app setup, redirect to port 3003
  if (window.location.hostname === 'localhost' && window.location.port === '8080') {
    // Development environment - redirect to the applicant portal app
    window.location.href = 'http://localhost:3003';
    return (
      <div className="min-h-screen bg-lavender-bg flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-deep-plum mb-4">Redirecting to Applicant Portal...</h2>
          <p className="text-gray-600">If you are not redirected automatically, <a href="http://localhost:3003" className="text-accent-purple underline">click here</a>.</p>
        </div>
      </div>
    );
  }

  // Production environment - serve full applicant portal
  return (
    <AuthProvider>
      <ApplicantPortalLayout />
    </AuthProvider>
  );
};

const queryClient = new QueryClient();

const ApplicantApp = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <AuthProvider>
          <ApplicationProvider>
            <Routes>
              {/* Public admission routes */}
              <Route path="/" element={
                <div className="min-h-screen bg-lavender-bg">
                  <Header showLogin={true} />
                  <main className="p-6">
                    <Index />
                  </main>
                </div>
              } />
              <Route path="/program-selection" element={
                <div className="min-h-screen bg-lavender-bg">
                  <Header showLogin={true} />
                  <main className="p-6">
                    <ProgramSelection />
                  </main>
                </div>
              } />
              <Route path="/personal-information" element={
                <div className="min-h-screen bg-lavender-bg">
                  <Header showLogin={true} />
                  <main className="p-6">
                    <PersonalInformation />
                  </main>
                </div>
              } />
              <Route path="/academic-history" element={
                <div className="min-h-screen bg-lavender-bg">
                  <Header showLogin={true} />
                  <main className="p-6">
                    <AcademicHistory />
                  </main>
                </div>
              } />
              <Route path="/application-review" element={
                <div className="min-h-screen bg-lavender-bg">
                  <Header showLogin={true} />
                  <main className="p-6">
                    <ApplicationReview />
                  </main>
                </div>
              } />
              <Route path="/application-success" element={
                <div className="min-h-screen bg-lavender-bg">
                  <Header showLogin={true} />
                  <main className="p-6">
                    <ApplicationSuccess />
                  </main>
                </div>
              } />

              {/* Applicant portal routes */}
              <Route path="/applicant-portal" element={<ApplicantPortalHandler />} />
              <Route path="/portal" element={<ApplicantPortalHandler />} />
              <Route path="/portal/*" element={<ApplicantPortalHandler />} />

              <Route path="*" element={
                <div className="min-h-screen bg-lavender-bg">
                  <Header showLogin={true} />
                  <main className="p-6">
                    <NotFound />
                  </main>
                </div>
              } />
            </Routes>
          </ApplicationProvider>
        </AuthProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default ApplicantApp;
