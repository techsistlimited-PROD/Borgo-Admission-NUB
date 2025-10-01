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
  private serverAvailable: boolean | null = null;

  constructor() {
    try {
      if (typeof localStorage !== "undefined" && localStorage.getItem) {
        this.token = localStorage.getItem("nu_token");
      }
    } catch (e) {
      this.token = null;
    }

    // Probe server availability asynchronously
    this.probeServer();
  }

  private async probeServer() {
    try {
      const res = await fetch("/api/ping", { cache: "no-store" });
      this.serverAvailable = res.ok;
    } catch (e) {
      this.serverAvailable = false;
    }
  }

  setToken(token: string) {
    this.token = token;
    try {
      localStorage.setItem("nu_token", token);
    } catch (e) {}
  }

  clearToken() {
    this.token = null;
    try {
      localStorage.removeItem("nu_token");
    } catch (e) {}
  }

  // Authentication — keep mock login for now
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

    return { success: false, error: response.error || "Login failed" };
  }

  async logout(): Promise<ApiResponse> {
    const response = await mockApi.logout();
    if (response.success) this.clearToken();
    return response;
  }

  async getCurrentUser(): Promise<ApiResponse<{ user: User }>> {
    if (!this.token) return { success: false, error: "No token available" };
    return await mockApi.getCurrentUser(this.token);
  }

  // Applications — keep list on mock to avoid auth mismatch; use server for public create
  async getApplications(params?: any): Promise<ApiResponse> {
    return await mockApi.getApplications(params);
  }

  async getApplication(id: string): Promise<ApiResponse> {
    return await mockApi.getApplication(id);
  }

  async createApplication(data: any): Promise<ApiResponse> {
    if (this.serverAvailable) {
      try {
        const res = await fetch("/public/admissions/", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(data),
        });
        const json = await res.json().catch(() => ({}));
        if (res.ok) return { success: true, data: json };
        return { success: false, error: json.error || "Server error" };
      } catch (e) {
        console.warn(
          "createApplication server failed, falling back to mock",
          e,
        );
        return await mockApi.createApplication(data);
      }
    }
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

  // Programs and departments — prefer server when available
  async getPrograms(): Promise<ApiResponse> {
    if (this.serverAvailable) {
      try {
        const res = await fetch("/api/programs");
        const json = await res.json().catch(() => ({}));
        if (res.ok)
          return { success: true, data: { programs: json.data || json } };
        return {
          success: false,
          error: json.error || "Failed to load programs",
        };
      } catch (e) {
        console.warn("getPrograms server failed, falling back to mock", e);
      }
    }
    return await mockApi.getPrograms();
  }

  async getDepartments(): Promise<ApiResponse> {
    if (this.serverAvailable) {
      try {
        const res = await fetch("/api/programs/departments");
        const json = await res.json().catch(() => ({}));
        if (res.ok)
          return { success: true, data: { departments: json.data || json } };
      } catch (e) {
        console.warn("getDepartments server failed, falling back to mock", e);
      }
    }
    return await mockApi.getDepartments();
  }

  async calculateCost(data: {
    program_code: string;
    department_code: string;
    waivers?: Array<{ type: string; value: number }>;
  }): Promise<ApiResponse> {
    if (this.serverAvailable) {
      try {
        const res = await fetch("/api/programs/calculate-cost", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(data),
        });
        const json = await res.json().catch(() => ({}));
        if (res.ok) return { success: true, data: json.data || json };
      } catch (e) {
        console.warn("calculateCost server failed, falling back to mock", e);
      }
    }
    return await mockApi.calculateCost(data);
  }

  // Referrers and visitors remain mock-backed
  async getReferrers(): Promise<ApiResponse> {
    return await mockApi.getReferrers();
  }
  async validateReferrer(employee_id: string): Promise<ApiResponse> {
    return await mockApi.validateReferrer(employee_id);
  }
  async getReferrerStats(employee_id: string): Promise<ApiResponse> {
    return await mockApi.getReferrerStats(employee_id);
  }
  async getVisitors(params?: any): Promise<ApiResponse> {
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

  // Configuration methods — prefer server
  async getAdmissionSettings(): Promise<ApiResponse> {
    if (this.serverAvailable) {
      try {
        const res = await fetch("/api/admission-settings");
        const json = await res.json().catch(() => ({}));
        if (res.ok) return { success: true, data: json.data };
      } catch (e) {
        console.warn(
          "getAdmissionSettings server failed, falling back to mock",
          e,
        );
      }
    }
    return await mockApi.getAdmissionSettings();
  }

  async updateAdmissionSettings(settings: any): Promise<ApiResponse> {
    if (this.serverAvailable) {
      try {
        const res = await fetch("/api/admission-settings", {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ settings }),
        });
        const json = await res.json().catch(() => ({}));
        if (res.ok) return { success: true, data: json.data };
      } catch (e) {
        console.warn(
          "updateAdmissionSettings server failed, falling back to mock",
          e,
        );
      }
    }
    return await mockApi.updateAdmissionSettings(settings);
  }

  async getPaymentMethods(): Promise<ApiResponse> {
    if (this.serverAvailable) {
      try {
        const res = await fetch("/api/payment-methods");
        const json = await res.json().catch(() => ({}));
        if (res.ok) return { success: true, data: json.data };
      } catch (e) {
        console.warn(
          "getPaymentMethods server failed, falling back to mock",
          e,
        );
      }
    }
    return await mockApi.getPaymentMethods();
  }

  async createPaymentMethod(method: any): Promise<ApiResponse> {
    if (this.serverAvailable) {
      try {
        const res = await fetch("/api/payment-methods", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(method),
        });
        const json = await res.json().catch(() => ({}));
        if (res.ok) return { success: true, data: json.data };
      } catch (e) {
        console.warn(
          "createPaymentMethod server failed, falling back to mock",
          e,
        );
      }
    }
    return await mockApi.createPaymentMethod(method);
  }

  async updatePaymentMethod(id: string, method: any): Promise<ApiResponse> {
    if (this.serverAvailable) {
      try {
        const res = await fetch(`/api/payment-methods/${id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(method),
        });
        const json = await res.json().catch(() => ({}));
        if (res.ok) return { success: true, data: json.data };
      } catch (e) {
        console.warn(
          "updatePaymentMethod server failed, falling back to mock",
          e,
        );
      }
    }
    return await mockApi.updatePaymentMethod(id, method);
  }

  async deletePaymentMethod(id: string): Promise<ApiResponse> {
    if (this.serverAvailable) {
      try {
        const res = await fetch(`/api/payment-methods/${id}`, {
          method: "DELETE",
        });
        const json = await res.json().catch(() => ({}));
        if (res.ok) return { success: true, data: json.data };
      } catch (e) {
        console.warn(
          "deletePaymentMethod server failed, falling back to mock",
          e,
        );
      }
    }
    return await mockApi.deletePaymentMethod(id);
  }

  async getDocumentRequirements(): Promise<ApiResponse> {
    if (this.serverAvailable) {
      try {
        const res = await fetch("/api/document-requirements");
        const json = await res.json().catch(() => ({}));
        if (res.ok) return { success: true, data: json.data };
      } catch (e) {
        console.warn(
          "getDocumentRequirements server failed, falling back to mock",
          e,
        );
      }
    }
    return await mockApi.getDocumentRequirements();
  }

  async createDocumentRequirement(requirement: any): Promise<ApiResponse> {
    if (this.serverAvailable) {
      try {
        const res = await fetch("/api/document-requirements", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(requirement),
        });
        const json = await res.json().catch(() => ({}));
        if (res.ok) return { success: true, data: json.data };
      } catch (e) {
        console.warn(
          "createDocumentRequirement server failed, falling back to mock",
          e,
        );
      }
    }
    return await mockApi.createDocumentRequirement(requirement);
  }

  async updateDocumentRequirement(
    id: string,
    requirement: any,
  ): Promise<ApiResponse> {
    if (this.serverAvailable) {
      try {
        const res = await fetch(`/api/document-requirements/${id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(requirement),
        });
        const json = await res.json().catch(() => ({}));
        if (res.ok) return { success: true, data: json.data };
      } catch (e) {
        console.warn(
          "updateDocumentRequirement server failed, falling back to mock",
          e,
        );
      }
    }
    return await mockApi.updateDocumentRequirement(id, requirement);
  }

  async deleteDocumentRequirement(id: string): Promise<ApiResponse> {
    if (this.serverAvailable) {
      try {
        const res = await fetch(`/api/document-requirements/${id}`, {
          method: "DELETE",
        });
        const json = await res.json().catch(() => ({}));
        if (res.ok) return { success: true, data: json.data };
      } catch (e) {
        console.warn(
          "deleteDocumentRequirement server failed, falling back to mock",
          e,
        );
      }
    }
    return await mockApi.deleteDocumentRequirement(id);
  }

  // Messaging templates
  async getTemplates(): Promise<ApiResponse<any[]>> {
    if (this.serverAvailable) {
      try {
        const res = await fetch("/api/messaging/templates", {
          headers: this.token ? { Authorization: `Bearer ${this.token}` } : {},
        });
        const json = await res.json().catch(() => ({}));
        if (res.ok) return { success: true, data: json.data || json };
      } catch (e) {
        console.warn("getTemplates server failed, falling back to local", e);
      }
    }
    try {
      const raw =
        (typeof localStorage !== "undefined" &&
          localStorage.getItem("nu_templates")) ||
        "[]";
      const list = JSON.parse(raw || "[]");
      return { success: true, data: list };
    } catch {
      return { success: true, data: [] };
    }
  }

  async createTemplate(template: any): Promise<ApiResponse> {
    if (this.serverAvailable) {
      try {
        const res = await fetch("/api/messaging/templates", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            ...(this.token ? { Authorization: `Bearer ${this.token}` } : {}),
          },
          body: JSON.stringify(template),
        });
        const json = await res.json().catch(() => ({}));
        if (res.ok) return { success: true, data: json.data || json };
      } catch (e) {
        console.warn("createTemplate server failed, falling back to local", e);
      }
    }
    try {
      const raw =
        (typeof localStorage !== "undefined" &&
          localStorage.getItem("nu_templates")) ||
        "[]";
      const list = JSON.parse(raw || "[]");
      const item = {
        id: String(Date.now()),
        created_at: new Date().toISOString(),
        ...template,
      };
      list.unshift(item);
      if (typeof localStorage !== "undefined")
        localStorage.setItem("nu_templates", JSON.stringify(list));
      return { success: true, data: item };
    } catch (e) {
      return { success: false, error: "Failed to save template locally" };
    }
  }

  async updateTemplate(id: string, updates: any): Promise<ApiResponse> {
    if (this.serverAvailable) {
      try {
        const res = await fetch(`/api/messaging/templates/${id}`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            ...(this.token ? { Authorization: `Bearer ${this.token}` } : {}),
          },
          body: JSON.stringify(updates),
        });
        const json = await res.json().catch(() => ({}));
        if (res.ok) return { success: true, data: json.data || json };
      } catch (e) {
        console.warn("updateTemplate server failed, falling back to local", e);
      }
    }
    try {
      const list = JSON.parse(localStorage.getItem("nu_templates") || "[]");
      const idx = list.findIndex((t: any) => String(t.id) === String(id));
      if (idx !== -1) {
        list[idx] = { ...list[idx], ...updates };
        localStorage.setItem("nu_templates", JSON.stringify(list));
        return { success: true, data: list[idx] };
      }
      return { success: false, error: "Template not found" };
    } catch (e) {
      return { success: false, error: "Failed to update template locally" };
    }
  }

  async deleteTemplate(id: string): Promise<ApiResponse> {
    if (this.serverAvailable) {
      try {
        const res = await fetch(`/api/messaging/templates/${id}`, {
          method: "DELETE",
          headers: this.token ? { Authorization: `Bearer ${this.token}` } : {},
        });
        const json = await res.json().catch(() => ({}));
        if (res.ok) return { success: true, data: json.data || json };
      } catch (e) {
        console.warn("deleteTemplate server failed, falling back to local", e);
      }
    }
    try {
      const list = JSON.parse(localStorage.getItem("nu_templates") || "[]");
      const idx = list.findIndex((t: any) => String(t.id) === String(id));
      if (idx !== -1) {
        list.splice(idx, 1);
        localStorage.setItem("nu_templates", JSON.stringify(list));
        return { success: true };
      }
      return { success: false, error: "Template not found" };
    } catch (e) {
      return { success: false, error: "Failed to delete template locally" };
    }
  }

  // Students & finance remain mocked
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

const apiClient = new ApiClient();

export default apiClient;

export const checkApiConnection = async (): Promise<boolean> => {
  try {
    const res = await fetch("/api/ping");
    return res.ok;
  } catch (e) {
    return false;
  }
};

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
