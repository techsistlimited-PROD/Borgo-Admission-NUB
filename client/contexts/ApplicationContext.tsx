import { createContext, useContext, useState, ReactNode } from "react";

export interface ApplicationData {
  // Program Selection Data
  admissionType?: "regular" | "credit-transfer";
  campus?: string;
  semester?: string;
  semesterType?: string;
  program?: string;
  department?: string;
  session?: string;
  offline?: boolean;
  sscGPA?: number;
  hscGPA?: number;
  selectedWaivers?: string[];
  academicBackgroundType?: string;
  totalCost?: number;
  waiverAmount?: number;
  finalAmount?: number;
  referrerId?: string;
  referrerName?: string;

  // Credit Transfer Data (for credit-transfer applicants)
  previousInstitution?: string;
  previousProgram?: string;
  totalCreditsInProgram?: number;
  completedCredits?: number;
  previousCGPA?: number;
  reasonForTransfer?: string;
  transcriptUrl?: string;

  // Personal Information Data
  firstName?: string;
  lastName?: string;
  preferredName?: string;
  dateOfBirth?: string;
  gender?: string;
  religion?: string;
  bloodGroup?: string;
  presentAddress?: string;
  permanentAddress?: string;
  postcode?: string;
  district?: string;
  division?: string;
  citizenship?: string;
  nationalId?: string;
  phone?: string;
  email?: string;
  phoneVerified?: boolean;
  emailVerified?: boolean;

  // Family Information
  fatherName?: string;
  fatherOccupation?: string;
  fatherMobile?: string;
  motherName?: string;
  motherOccupation?: string;
  motherMobile?: string;
  guardianName?: string;
  guardianPhone?: string;
  guardianRelation?: string;

  // Academic History
  sscInstitution?: string;
  sscYear?: number;
  hscInstitution?: string;
  hscYear?: number;
  bachelorInstitution?: string;
  bachelorYear?: number;
  bachelorCGPA?: number;
  masterInstitution?: string;
  masterYear?: number;
  masterCGPA?: number;
  otherQualifications?: string;

  // Document uploads
  photoUrl?: string;
  documents?: {
    [key: string]: string; // document type -> file URL
  };

  // Payment
  paymentMethod?: string;
  paymentMobile?: string;
  paymentStatus?: "pending" | "paid" | "partial";

  // Application metadata
  applicationId?: string;
  trackingId?: string;
  status?: "draft" | "submitted" | "pending" | "approved" | "rejected";
  submittedAt?: string;
}

interface ApplicationContextType {
  applicationData: ApplicationData;
  updateApplicationData: (data: Partial<ApplicationData>) => void;
  clearApplicationData: () => void;
  isComplete: (step: string) => boolean;
  saveCurrentStep: (step: string) => Promise<boolean>;
  submitApplication: () => Promise<{
    success: boolean;
    trackingId?: string;
    password?: string;
    error?: string;
  }>;
}

const ApplicationContext = createContext<ApplicationContextType | undefined>(
  undefined,
);

export function ApplicationProvider({ children }: { children: ReactNode }) {
  const [applicationData, setApplicationData] = useState<ApplicationData>(
    () => {
      // Try to load from localStorage on initialization
      const saved = localStorage.getItem("nu_application_draft");
      if (saved) {
        try {
          return JSON.parse(saved);
        } catch {
          return {};
        }
      }
      return {};
    },
  );

  const updateApplicationData = (data: Partial<ApplicationData>) => {
    setApplicationData((prev) => {
      const updated = { ...prev, ...data };
      // Save to localStorage as draft
      localStorage.setItem("nu_application_draft", JSON.stringify(updated));
      return updated;
    });
  };

  const clearApplicationData = () => {
    setApplicationData({});
    localStorage.removeItem("nu_application_draft");

    // Also clear any other related localStorage keys
    localStorage.removeItem("nu_user_session");
    localStorage.removeItem("nu_form_cache");

    // Force clear browser form cache by resetting all form fields
    setTimeout(() => {
      const allInputs = document.querySelectorAll("input, select, textarea");
      allInputs.forEach((input) => {
        if (input instanceof HTMLInputElement) {
          input.value = "";
          input.checked = false;
        } else if (input instanceof HTMLSelectElement) {
          input.selectedIndex = 0;
        } else if (input instanceof HTMLTextAreaElement) {
          input.value = "";
        }
      });
    }, 100);
  };

  const isComplete = (step: string): boolean => {
    switch (step) {
      case "program-selection":
        return !!(applicationData.program && applicationData.department);
      case "personal-information":
        return !!(
          applicationData.firstName &&
          applicationData.lastName &&
          applicationData.dateOfBirth &&
          applicationData.gender &&
          applicationData.presentAddress &&
          applicationData.phone &&
          applicationData.email &&
          applicationData.fatherName &&
          applicationData.motherName
        );
      case "academic-history":
        return !!(
          applicationData.sscInstitution &&
          applicationData.sscYear &&
          applicationData.sscGPA &&
          applicationData.hscInstitution &&
          applicationData.hscYear &&
          applicationData.hscGPA
        );
      case "review-payment":
        return !!applicationData.paymentMethod;
      default:
        return false;
    }
  };

  const saveCurrentStep = async (step: string): Promise<boolean> => {
    try {
      // Auto-save is already handled in updateApplicationData
      // This could be extended to save to backend if needed
      console.log(`Step ${step} saved locally`);
      return true;
    } catch (error) {
      console.error("Failed to save step:", error);
      return false;
    }
  };

  const submitApplication = async (): Promise<{
    success: boolean;
    trackingId?: string;
    password?: string;
    error?: string;
  }> => {
    try {
      // Import API client here to avoid circular dependencies
      const { default: apiClient } = await import("../lib/api");

      const response = await apiClient.createApplication(applicationData);

      if (response.success) {
        // Clear the draft after successful submission
        clearApplicationData();
        return {
          success: true,
          trackingId: response.data?.university_id || "APP123456",
          password: response.data?.password || "temp123456",
        };
      } else {
        return {
          success: false,
          error: response.error || "Failed to submit application",
        };
      }
    } catch (error) {
      console.error("Application submission failed:", error);
      return {
        success: false,
        error:
          error instanceof Error ? error.message : "Unknown error occurred",
      };
    }
  };

  return (
    <ApplicationContext.Provider
      value={{
        applicationData,
        updateApplicationData,
        clearApplicationData,
        isComplete,
        saveCurrentStep,
        submitApplication,
      }}
    >
      {children}
    </ApplicationContext.Provider>
  );
}

export function useApplication() {
  const context = useContext(ApplicationContext);
  if (context === undefined) {
    throw new Error(
      "useApplication must be used within an ApplicationProvider",
    );
  }
  return context;
}
