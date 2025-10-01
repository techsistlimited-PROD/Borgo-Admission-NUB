import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";

export default function OfflineAdmission() {
  const navigate = useNavigate();
  const auth = (() => {
    try {
      return useAuth();
    } catch {
      return null;
    }
  })();

  useEffect(() => {
    // If not signed in as admission officer, redirect to admission login and include next param
    const next = encodeURIComponent("/personal-information?offline=true");
    // Require offline_officer role; allow admission_officer as fallback for compatibility
    if (!auth || !auth.isAuthenticated || (auth.role !== "offline_officer" && auth.role !== "admission_officer")) {
      navigate(`/admin/offline-login?next=${next}`);
      return;
    }

    // Start the offline admission workflow by opening the program selection with offline flag
    navigate(`/program-selection?offline=true`);
  }, [auth, navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <div className="text-xl text-deep-plum font-semibold">
          Redirecting to Offline Admission...
        </div>
      </div>
    </div>
  );
}
