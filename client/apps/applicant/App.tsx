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

// Applicant Portal Route Handler
const ApplicantPortalHandler = () => {
  // In production, serve the applicant login directly
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

  // Production environment - serve applicant login directly
  return <ApplicantLogin />;
};

const queryClient = new QueryClient();

const ApplicantApp = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <ApplicationProvider>
          <div className="min-h-screen bg-lavender-bg">
            <Header showLogin={true} />
            <main className="p-6">
              <Routes>
                <Route path="/" element={<Index />} />
                <Route path="/program-selection" element={<ProgramSelection />} />
                <Route path="/personal-information" element={<PersonalInformation />} />
                <Route path="/academic-history" element={<AcademicHistory />} />
                <Route path="/application-review" element={<ApplicationReview />} />
                <Route path="/application-success" element={<ApplicationSuccess />} />
                <Route path="/applicant-portal" element={<ApplicantPortalHandler />} />
                <Route path="/portal" element={<ApplicantPortalHandler />} />
                <Route path="*" element={<NotFound />} />
              </Routes>
            </main>
          </div>
        </ApplicationProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default ApplicantApp;
