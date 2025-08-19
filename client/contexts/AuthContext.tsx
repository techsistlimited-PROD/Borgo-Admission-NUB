import {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import apiClient, { LoginRequest, LoginResponse } from "../lib/api";

export interface User {
  id: number;
  uuid: string;
  name: string;
  email: string;
  type: "applicant" | "admin";
  university_id?: string;
  department?: string;
  designation?: string;
}

interface AuthContextType {
  user: User | null;
  userType: "public" | "applicant" | "admin";
  login: (credentials: LoginCredentials) => Promise<boolean>;
  logout: () => void;
  isLoading: boolean;
  isAuthenticated: boolean;
}

interface LoginCredentials {
  identifier: string; // Email for admin, University ID for applicant
  password: string;
  type: "applicant" | "admin";
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Check for existing session on mount
  useEffect(() => {
    const checkSession = async () => {
      try {
        const token = localStorage.getItem("nu_token");
        if (token) {
          const response = await apiClient.getCurrentUser();
          if (response.success && response.data?.user) {
            setUser(response.data.user);
          } else {
            // Clear invalid token
            localStorage.removeItem("nu_token");
            apiClient.clearToken();
          }
        }
      } catch (error) {
        console.error("Session check failed:", error);
        localStorage.removeItem("nu_token");
        apiClient.clearToken();
      } finally {
        setIsLoading(false);
      }
    };

    checkSession();
  }, []);

  const login = async (credentials: LoginCredentials): Promise<boolean> => {
    setIsLoading(true);

    try {
      // Demo authentication for testing
      if (
        credentials.identifier === "APP123456" &&
        credentials.password === "temp123456" &&
        credentials.type === "applicant"
      ) {
        setUser({
          id: 1,
          uuid: "demo-uuid-123",
          name: "Demo Applicant",
          email: "demo@applicant.com",
          type: "applicant",
          university_id: "APP123456",
        });
        localStorage.setItem("nu_token", "demo_token_123");
        return true;
      }

      const loginRequest: LoginRequest = {
        identifier: credentials.identifier,
        password: credentials.password,
        type: credentials.type,
      };

      const response = await apiClient.login(loginRequest);

      if (response.success && response.data) {
        setUser(response.data.user);
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

  const logout = async () => {
    try {
      await apiClient.logout();
    } catch (error) {
      console.error("Logout error:", error);
    } finally {
      setUser(null);
      localStorage.removeItem("nu_token");
      apiClient.clearToken();
    }
  };

  const userType = user?.type || "public";
  const isAuthenticated = !!user;

  return (
    <AuthContext.Provider
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
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}

// Mock credentials for demo purposes (for testing during development)
export const getDemoCredentials = () => ({
  applicant: {
    university_id: "NU24BCS001",
    password: "temp123456",
  },
  admin: {
    email: "admin@nu.edu.bd",
    password: "admin123",
  },
});
