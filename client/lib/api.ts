// API Client for Northern University Backend

const API_BASE_URL =
  import.meta.env.VITE_API_URL || "/api";

// Types
export interface LoginRequest {
  identifier: string;
  password: string;
  type: "applicant" | "admin";
}

export interface LoginResponse {
  success: boolean;
  token: string;
  user: {
    id: number;
    uuid: string;
    name: string;
    email: string;
    type: "applicant" | "admin";
    university_id?: string;
    department?: string;
    designation?: string;
  };
}

export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

class ApiClient {
  private token: string | null = null;

  constructor() {
    // Get token from localStorage on initialization
    this.token = localStorage.getItem("nu_token");
  }

  setToken(token: string) {
    this.token = token;
    localStorage.setItem("nu_token", token);
  }

  clearToken() {
    this.token = null;
    localStorage.removeItem("nu_token");
  }

  private async request<T = any>(
    endpoint: string,
    options: RequestInit = {},
  ): Promise<ApiResponse<T>> {
    const url = `${API_BASE_URL}${endpoint}`;

    const headers: HeadersInit = {
      "Content-Type": "application/json",
      ...options.headers,
    };

    if (this.token) {
      headers.Authorization = `Bearer ${this.token}`;
    }

    try {
      console.log(`🌐 API Request: ${endpoint}`, { method: options.method || 'GET' });

      const response = await fetch(url, {
        ...options,
        headers,
      });

      const data = await response.json();
      console.log(`📦 API Response: ${endpoint}`, {
        ok: response.ok,
        status: response.status,
        success: data.success
      });

      if (!response.ok) {
        throw new Error(data.error || `HTTP error! status: ${response.status}`);
      }

      return {
        success: data.success !== false,
        data: data,
        error: data.error,
        message: data.message
      };
    } catch (error) {
      console.error(`❌ API request failed: ${endpoint}`, error);
      return {
        success: false,
        error:
          error instanceof Error ? error.message : "Unknown error occurred",
      };
    }
  }

  // Authentication
  async login(credentials: LoginRequest): Promise<ApiResponse<LoginResponse>> {
    const response = await this.request<LoginResponse>("/auth/login", {
      method: "POST",
      body: JSON.stringify(credentials),
    });

    if (response.success && response.data?.token) {
      this.setToken(response.data.token);
    }

    return response;
  }

  async logout(): Promise<ApiResponse> {
    const response = await this.request("/auth/logout", {
      method: "POST",
    });

    if (response.success) {
      this.clearToken();
    }

    return response;
  }

  async getCurrentUser(): Promise<ApiResponse> {
    return this.request("/auth/me");
  }

  // Applications
  async getApplications(params?: {
    status?: string;
    search?: string;
    page?: number;
    limit?: number;
  }): Promise<ApiResponse> {
    const searchParams = new URLSearchParams();
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined) {
          searchParams.append(key, value.toString());
        }
      });
    }

    const query = searchParams.toString();
    return this.request(`/applications${query ? `?${query}` : ""}`);
  }

  async getApplication(id: string): Promise<ApiResponse> {
    return this.request(`/applications/${id}`);
  }

  async createApplication(data: any): Promise<ApiResponse> {
    return this.request("/applications", {
      method: "POST",
      body: JSON.stringify(data),
    });
  }

  async updateApplicationStatus(
    id: string,
    status: string,
  ): Promise<ApiResponse> {
    return this.request(`/applications/${id}/status`, {
      method: "PATCH",
      body: JSON.stringify({ status }),
    });
  }

  async generateApplicationIds(id: string): Promise<ApiResponse> {
    return this.request(`/applications/${id}/generate-ids`, {
      method: "POST",
    });
  }

  async getApplicationStats(): Promise<ApiResponse> {
    return this.request("/applications/stats/dashboard");
  }

  // Programs and Departments
  async getPrograms(): Promise<ApiResponse> {
    return this.request("/programs");
  }

  async getDepartments(): Promise<ApiResponse> {
    return this.request("/programs/departments");
  }

  async calculateCost(data: {
    program_code: string;
    department_code: string;
    waivers?: Array<{ type: string; value: number }>;
  }): Promise<ApiResponse> {
    return this.request("/programs/calculate-cost", {
      method: "POST",
      body: JSON.stringify(data),
    });
  }

  // Referrers
  async getReferrers(): Promise<ApiResponse> {
    return this.request("/referrers");
  }

  async validateReferrer(employee_id: string): Promise<ApiResponse> {
    return this.request("/referrers/validate", {
      method: "POST",
      body: JSON.stringify({ employee_id }),
    });
  }

  async getReferrerStats(employee_id: string): Promise<ApiResponse> {
    return this.request(`/referrers/${employee_id}/stats`);
  }
}

// Create singleton instance
const apiClient = new ApiClient();

export default apiClient;

// Helper function for checking API connection
export const checkApiConnection = async (): Promise<boolean> => {
  try {
    const response = await fetch(`${API_BASE_URL}/ping`);
    return response.ok;
  } catch {
    return false;
  }
};
