import { mockApi } from "./mockApi";
import type {
  LoginCredentials,
  ApiResponse,
  User,
  Application,
} from "./mockApi";

export type { LoginCredentials, ApiResponse, User, Application };

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
    // Get token from localStorage on initialization (guard for SSR / test env)
    try {
      if (typeof localStorage !== "undefined" && localStorage.getItem) {
        this.token = localStorage.getItem("nu_token");
      } else {
        this.token = null;
      }
    } catch (e) {
      this.token = null;
    }
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
          user: response.data.user,
        },
      };
    }

    return {
      success: false,
      error: response.error || "Login failed",
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
    program_code?: string;
    campus?: string;
    semester?: string;
    admission_type?: string;
    admission_test_status?: string;
    dateFrom?: string;
    dateTo?: string;
  }): Promise<ApiResponse> {
    return await mockApi.getApplications(params);
  }

  async getApplication(id: string): Promise<ApiResponse> {
    return await mockApi.getApplication(id);
  }

  async createApplication(data: any): Promise<ApiResponse> {
    return await mockApi.createApplication(data);
  }

  async updateApplicationStatus(
    id: string,
    status: string,
  ): Promise<ApiResponse> {
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

  // Visitors Log
  async getVisitors(params?: {
    page?: number;
    limit?: number;
    campus?: string;
    dateFrom?: string;
    dateTo?: string;
    search?: string;
  }): Promise<ApiResponse> {
    return await mockApi.getVisitors(params);
  }

  async createVisitor(record: any): Promise<ApiResponse> {
    return await mockApi.createVisitor(record);
  }

  async updateVisitor(id: string, updates: any): Promise<ApiResponse> {
    return await mockApi.updateVisitor(id, updates);
  }

  async deleteVisitor(id: string): Promise<ApiResponse> {
    return await mockApi.deleteVisitor(id);
  }

  async exportVisitors(params?: any): Promise<ApiResponse<any[]>> {
    return await mockApi.exportVisitors(params);
  }

  // Configuration methods
  async getAdmissionSettings(): Promise<ApiResponse> {
    return await mockApi.getAdmissionSettings();
  }

  async updateAdmissionSettings(settings: any): Promise<ApiResponse> {
    return await mockApi.updateAdmissionSettings(settings);
  }

  async getPaymentMethods(): Promise<ApiResponse> {
    return await mockApi.getPaymentMethods();
  }

  async createPaymentMethod(method: any): Promise<ApiResponse> {
    return await mockApi.createPaymentMethod(method);
  }

  async updatePaymentMethod(id: string, method: any): Promise<ApiResponse> {
    return await mockApi.updatePaymentMethod(id, method);
  }

  async deletePaymentMethod(id: string): Promise<ApiResponse> {
    return await mockApi.deletePaymentMethod(id);
  }

  async getDocumentRequirements(): Promise<ApiResponse> {
    return await mockApi.getDocumentRequirements();
  }

  async createDocumentRequirement(requirement: any): Promise<ApiResponse> {
    return await mockApi.createDocumentRequirement(requirement);
  }

  async updateDocumentRequirement(
    id: string,
    requirement: any,
  ): Promise<ApiResponse> {
    return await mockApi.updateDocumentRequirement(id, requirement);
  }

  async deleteDocumentRequirement(id: string): Promise<ApiResponse> {
    return await mockApi.deleteDocumentRequirement(id);
  }

  // Messaging (server-backed via Supabase)
  private async request(path: string, options: RequestInit = {}) {
    const headers: Record<string, string> = {
      "Content-Type": "application/json",
    };
    if (this.token) headers["Authorization"] = `Bearer ${this.token}`;

    const res = await fetch(`/api/messaging${path}`, { headers, ...options });
    const json = await res.json().catch(() => ({}));
    return json;
  }

  async getTemplates(): Promise<ApiResponse> {
    return await this.request("/templates");
  }

  async createTemplate(template: any): Promise<ApiResponse> {
    return await this.request(`/templates`, {
      method: "POST",
      body: JSON.stringify(template),
    });
  }

  async updateTemplate(id: string, template: any): Promise<ApiResponse> {
    return await this.request(`/templates/${id}`, {
      method: "PUT",
      body: JSON.stringify(template),
    });
  }

  async deleteTemplate(id: string): Promise<ApiResponse> {
    return await this.request(`/templates/${id}`, { method: "DELETE" });
  }

  async getCampaigns(): Promise<ApiResponse> {
    return await this.request(`/campaigns`);
  }

  async createCampaign(campaign: any): Promise<ApiResponse> {
    return await this.request(`/campaigns`, {
      method: "POST",
      body: JSON.stringify(campaign),
    });
  }

  async getMessagingLogs(
    params: {
      campaignId?: string;
      status?: string;
      limit?: number;
      offset?: number;
    } = {},
  ): Promise<ApiResponse> {
    const qs = new URLSearchParams();
    if (params.campaignId) qs.set("campaignId", params.campaignId);
    if (params.status) qs.set("status", params.status);
    if (params.limit) qs.set("limit", String(params.limit));
    if (params.offset) qs.set("offset", String(params.offset));
    return await this.request(`/logs?${qs.toString()}`);
  }

  async testSend(payload: {
    templateId: string;
    channel: string;
    to: string;
    vars?: any;
  }): Promise<ApiResponse> {
    return await this.request(`/test-send`, {
      method: "POST",
      body: JSON.stringify(payload),
    });
  }

  // Students & Finance (mock)
  async createStudentRecord(
    applicationId: string,
    ids: { university_id: string; ugc_id?: string; batch?: string },
  ): Promise<ApiResponse> {
    return await mockApi.createStudentRecord(applicationId, ids);
  }

  async generateMoneyReceipt(
    applicationId: string,
    amount: number,
  ): Promise<ApiResponse> {
    return await mockApi.generateMoneyReceipt(applicationId, amount);
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
    type: "applicant" as const,
  },
  admin: {
    identifier: "admin@nu.edu.bd",
    password: "admin123",
    type: "admin" as const,
  },
});
