import {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";

interface User {
  id: string;
  name: string;
  email: string;
  type: "student" | "advisor" | "admin";
  department?: string;
  studentId?: string;
  employeeId?: string;
  program?: string;
  semester?: string;
  advisor?: string;
}

interface RegistrationAuthContextType {
  user: User | null;
  userType: "public" | "student" | "advisor" | "admin";
  login: (credentials: LoginCredentials) => Promise<boolean>;
  logout: () => void;
  isLoading: boolean;
  isAuthenticated: boolean;
}

interface LoginCredentials {
  identifier: string; // Email, Student ID, or Employee ID
  password: string;
  type: "student" | "advisor" | "admin";
}

const RegistrationAuthContext = createContext<
  RegistrationAuthContextType | undefined
>(undefined);

export function RegistrationAuthProvider({
  children,
}: {
  children: ReactNode;
}) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Check for existing session on mount
  useEffect(() => {
    const checkSession = async () => {
      try {
        const userType = localStorage.getItem("reg_user_type");
        const userData = localStorage.getItem("reg_user_data");

        if (userType && userData) {
          const parsedData = JSON.parse(userData);
          setUser({
            ...parsedData,
            type: userType as "student" | "advisor" | "admin",
          });
        }
      } catch (error) {
        console.error("Session check failed:", error);
        localStorage.removeItem("reg_user_type");
        localStorage.removeItem("reg_user_data");
      } finally {
        setIsLoading(false);
      }
    };

    checkSession();
  }, []);

  const login = async (credentials: LoginCredentials): Promise<boolean> => {
    setIsLoading(true);

    try {
      // Demo login logic for each role
      let loginSuccess = false;
      let userData: User | null = null;

      if (
        credentials.type === "student" &&
        credentials.identifier === "2021-1-60-001" &&
        credentials.password === "student123"
      ) {
        loginSuccess = true;
        userData = {
          id: "student_001",
          name: "John Doe",
          email: "john.doe@nu.edu.bd",
          type: "student",
          studentId: "2021-1-60-001",
          department: "Computer Science and Engineering",
          program: "Bachelor in Computer Science",
          semester: "Spring 2024",
          advisor: "Dr. Jane Smith",
        };
      } else if (
        credentials.type === "advisor" &&
        credentials.identifier === "ADV001" &&
        credentials.password === "advisor123"
      ) {
        loginSuccess = true;
        userData = {
          id: "advisor_001",
          name: "Dr. Jane Smith",
          email: "jane.smith@nu.edu.bd",
          type: "advisor",
          employeeId: "ADV001",
          department: "Computer Science and Engineering",
        };
      } else if (
        credentials.type === "admin" &&
        credentials.identifier === "admin" &&
        credentials.password === "admin123"
      ) {
        loginSuccess = true;
        userData = {
          id: "admin_001",
          name: "System Administrator",
          email: "admin@nu.edu.bd",
          type: "admin",
          employeeId: "ADMIN001",
          department: "Academic Administration",
        };
      }

      if (loginSuccess && userData) {
        setUser(userData);
        localStorage.setItem("reg_user_type", credentials.type);
        localStorage.setItem("reg_user_data", JSON.stringify(userData));
        setIsLoading(false);
        return true;
      } else {
        setIsLoading(false);
        return false;
      }
    } catch (error) {
      console.error("Login failed:", error);
      setIsLoading(false);
      return false;
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("reg_user_type");
    localStorage.removeItem("reg_user_data");
  };

  const userType = user?.type || "public";
  const isAuthenticated = !!user;

  return (
    <RegistrationAuthContext.Provider
      value={{
        user,
        userType,
        login,
        logout,
        isLoading,
        isAuthenticated,
      }}
    >
      {children}
    </RegistrationAuthContext.Provider>
  );
}

export function useRegistrationAuth() {
  const context = useContext(RegistrationAuthContext);
  if (context === undefined) {
    throw new Error(
      "useRegistrationAuth must be used within a RegistrationAuthProvider",
    );
  }
  return context;
}
