import "../../global.css";

import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Header from "../../components/Header";
import Index from "../../pages/Index";
import ProgramSelection from "../../pages/ProgramSelection";
import PersonalInformation from "../../pages/PersonalInformation";
import AcademicHistory from "../../pages/AcademicHistory";
import ReviewPayment from "../../pages/ReviewPayment";
import NotFound from "../../pages/NotFound";

const queryClient = new QueryClient();

const ApplicantApp = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <div className="min-h-screen bg-lavender-bg">
          <Header showLogin={true} />
          <main className="p-6">
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/program-selection" element={<ProgramSelection />} />
              <Route path="/personal-information" element={<PersonalInformation />} />
              <Route path="/academic-history" element={<AcademicHistory />} />
              <Route path="/review-payment" element={<ReviewPayment />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </main>
        </div>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default ApplicantApp;
