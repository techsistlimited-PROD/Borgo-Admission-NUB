// Frontend-Only API Client (Uses Mock Data - No Backend Required)

import { mockApi } from './mockApi';
import type { LoginCredentials, ApiResponse, User } from './mockApi';

export type { LoginCredentials, ApiResponse, User };

export interface LoginRequest {
  identifier: string;
  password: string;
  type: "applicant" | "admin";
}

export interface LoginResponse {
  success: boolean;
  token: string;
  user: User;
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

  // Authentication
  async login(credentials: LoginRequest): Promise<ApiResponse<LoginResponse>> {
    const response = await mockApi.login(credentials);
    
    if (response.success && response.data?.token) {
      this.setToken(response.data.token);
      return {
        success: true,
        data: {
          success: true,
          token: response.data.token,
          user: response.data.user
        }
      };
    }

    return {
      success: false,
      error: response.error || "Login failed"
    };
  }

  async logout(): Promise<ApiResponse> {
    const response = await mockApi.logout();
    if (response.success) {
      this.clearToken();
    }
    return response;
  }

  async getCurrentUser(): Promise<ApiResponse<{ user: User }>> {
    if (!this.token) {
      return { success: false, error: "No token available" };
    }

    return await mockApi.getCurrentUser(this.token);
  }

  // Applications
  async getApplications(params?: {
    status?: string;
    search?: string;
    page?: number;
    limit?: number;
  }): Promise<ApiResponse> {
    return await mockApi.getApplications(params);
  }

  async getApplication(id: string): Promise<ApiResponse> {
    return await mockApi.getApplication(id);
  }

  async createApplication(data: any): Promise<ApiResponse> {
    return await mockApi.createApplication(data);
  }

  async updateApplicationStatus(id: string, status: string): Promise<ApiResponse> {
    return await mockApi.updateApplicationStatus(id, status);
  }

  async generateApplicationIds(id: string): Promise<ApiResponse> {
    return await mockApi.generateApplicationIds(id);
  }

  async getApplicationStats(): Promise<ApiResponse> {
    return await mockApi.getApplicationStats();
  }

  // Programs and Departments
  async getPrograms(): Promise<ApiResponse> {
    return await mockApi.getPrograms();
  }

  async getDepartments(): Promise<ApiResponse> {
    return await mockApi.getDepartments();
  }

  async calculateCost(data: {
    program_code: string;
    department_code: string;
    waivers?: Array<{ type: string; value: number }>;
  }): Promise<ApiResponse> {
    return await mockApi.calculateCost(data);
  }

  // Referrers
  async getReferrers(): Promise<ApiResponse> {
    return await mockApi.getReferrers();
  }

  async validateReferrer(employee_id: string): Promise<ApiResponse> {
    return await mockApi.validateReferrer(employee_id);
  }

  async getReferrerStats(employee_id: string): Promise<ApiResponse> {
    return await mockApi.getReferrerStats(employee_id);
  }
}

// Create singleton instance
const apiClient = new ApiClient();

export default apiClient;

// Helper function for demo purposes
export const checkApiConnection = async (): Promise<boolean> => {
  // Always return true since we're using mock data
  return true;
};

// Demo credentials for easy testing
export const getDemoCredentials = () => ({
  applicant: {
    identifier: "APP123456",
    password: "temp123456",
    type: "applicant" as const
  },
  admin: {
    identifier: "admin@nu.edu.bd", 
    password: "admin123",
    type: "admin" as const
  }
});
