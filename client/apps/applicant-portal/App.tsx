import "../../global.css";

import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Header from "../../components/Header";
import Sidebar from "../../components/Sidebar";
import { AuthProvider, useAuth } from "../../contexts/AuthContext";
import Dashboard from "../../pages/Dashboard";
import Notifications from "../../pages/Notifications";
import ApplicantLogin from "../../pages/ApplicantLogin";
import NotFound from "../../pages/NotFound";

const queryClient = new QueryClient();

const ProtectedLayout = () => {
  const { user, userType } = useAuth();

  if (!user || userType !== 'applicant') {
    return <ApplicantLogin />;
  }

  return (
    <div className="min-h-screen bg-lavender-bg flex">
      <Sidebar userType="applicant" />
      <div className="flex-1 flex flex-col">
        <Header showLogin={false} />
        <main className="flex-1 p-6">
          <Routes>
            <Route path="/" element={<Navigate to="/dashboard" replace />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/notifications" element={<Notifications />} />
            <Route path="/login" element={<ApplicantLogin />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </main>
      </div>
    </div>
  );
};

const ApplicantPortalApp = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <AuthProvider>
          <ProtectedLayout />
        </AuthProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default ApplicantPortalApp;
