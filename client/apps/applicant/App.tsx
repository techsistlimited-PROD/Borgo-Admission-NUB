import "../../global.css";

import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Header from "../../components/Header";
import { ApplicationProvider } from "../../contexts/ApplicationContext";
import { AuthProvider } from "../../contexts/AuthContext";
import Index from "../../pages/Index";
import ProgramSelection from "../../pages/ProgramSelection";
import PersonalInformation from "../../pages/PersonalInformation";
import AcademicHistory from "../../pages/AcademicHistory";
import ApplicationReview from "../../pages/ApplicationReview";
import ApplicationSuccess from "../../pages/ApplicationSuccess";
import NotFound from "../../pages/NotFound";

// Import applicant portal components
import ApplicantLogin from "../../pages/ApplicantLogin";

const queryClient = new QueryClient();

const ApplicantApp = () => (
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
                  <Route path="/" element={<Index />} />
                  <Route path="/program-selection" element={<ProgramSelection />} />
                  <Route path="/personal-information" element={<PersonalInformation />} />
                  <Route path="/academic-history" element={<AcademicHistory />} />
                  <Route path="/application-review" element={<ApplicationReview />} />
                  <Route path="/application-success" element={<ApplicationSuccess />} />
                  <Route path="/applicant-portal" element={<ApplicantLogin />} />
                  <Route path="/portal" element={<ApplicantLogin />} />
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

export default ApplicantApp;
