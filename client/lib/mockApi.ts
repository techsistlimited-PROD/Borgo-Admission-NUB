// Mock API Service for Development (No Backend Required)

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

export interface Application {
  id: string;
  uuid: string;
  status: "pending" | "approved" | "rejected" | "payment_pending";
  applicant_name: string;
  university_id?: string;
  student_id?: string;
  email: string;
  phone: string;
  admission_type: "regular" | "credit_transfer";
  program_code: string;
  program_name: string;
  department_code: string;
  department_name: string;
  campus: string;
  semester: string;
  semester_type: string;
  created_at: string;
  personal_info?: any;
  academic_history?: any;
  documents?: any;
  payment_info?: any;
}

export interface LoginCredentials {
  identifier: string;
  password: string;
  type: "applicant" | "admin";
}

export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

class MockApiService {
  private users: User[] = [
    {
      id: 1,
      uuid: "admin-uuid-123",
      name: "Admin User",
      email: "admin@nu.edu.bd",
      type: "admin",
      department: "IT",
      designation: "System Administrator",
    },
    {
      id: 2,
      uuid: "applicant-uuid-123",
      name: "John Doe",
      email: "john@example.com",
      type: "applicant",
      university_id: "APP123456",
    },
  ];

  private applications: Application[] = [
    {
      id: "app-001",
      uuid: "app-uuid-001",
      status: "pending",
      applicant_name: "John Doe",
      university_id: "APP123456",
      email: "john@example.com",
      phone: "+8801234567890",
      admission_type: "regular",
      program_code: "CSE101",
      program_name: "Computer Science & Engineering",
      department_code: "CSE",
      department_name: "Computer Science & Engineering",
      campus: "Main Campus",
      semester: "Spring 2024",
      semester_type: "Regular",
      created_at: "2024-01-15T10:00:00Z",
    },
    {
      id: "app-002",
      uuid: "app-uuid-002",
      status: "approved",
      applicant_name: "Jane Smith",
      university_id: "APP123457",
      student_id: "NU24CSE001",
      email: "jane@example.com",
      phone: "+8801234567891",
      admission_type: "credit_transfer",
      program_code: "EEE101",
      program_name: "Electrical & Electronic Engineering",
      department_code: "EEE",
      department_name: "Electrical & Electronic Engineering",
      campus: "Main Campus",
      semester: "Spring 2024",
      semester_type: "Regular",
      created_at: "2024-01-14T09:00:00Z",
    },
  ];

  private programs = [
    {
      code: "CSE101",
      name: "Computer Science & Engineering",
      department_code: "CSE",
      department_name: "Computer Science & Engineering",
      duration: "4 years",
      credit_hours: 144,
      tuition_fee: 125000,
      campus: ["Main Campus", "Uttara Campus"],
    },
    {
      code: "EEE101",
      name: "Electrical & Electronic Engineering",
      department_code: "EEE",
      department_name: "Electrical & Electronic Engineering",
      duration: "4 years",
      credit_hours: 144,
      tuition_fee: 120000,
      campus: ["Main Campus"],
    },
    {
      code: "BBA101",
      name: "Bachelor of Business Administration",
      department_code: "BBA",
      department_name: "Business Administration",
      duration: "4 years",
      credit_hours: 120,
      tuition_fee: 95000,
      campus: ["Main Campus", "Uttara Campus"],
    },
  ];

  private departments = [
    { code: "CSE", name: "Computer Science & Engineering" },
    { code: "EEE", name: "Electrical & Electronic Engineering" },
    { code: "BBA", name: "Business Administration" },
    { code: "ENG", name: "English" },
    { code: "LAW", name: "Law" },
  ];

  private referrers = [
    {
      employee_id: "EMP001",
      name: "Dr. Smith",
      department: "CSE",
      designation: "Professor",
      email: "smith@nu.edu.bd",
      phone: "+8801234567890",
    },
  ];

  // Simulate API delay
  private delay(ms: number = 500): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }

  // Authentication
  async login(
    credentials: LoginCredentials,
  ): Promise<ApiResponse<{ user: User; token: string }>> {
    await this.delay();

    // Demo credentials
    const demoCredentials = [
      {
        identifier: "admin@nu.edu.bd",
        password: "admin123",
        type: "admin" as const,
      },
      {
        identifier: "APP123456",
        password: "temp123456",
        type: "applicant" as const,
      },
    ];

    const matchedDemo = demoCredentials.find(
      (cred) =>
        cred.identifier === credentials.identifier &&
        cred.password === credentials.password &&
        cred.type === credentials.type,
    );

    if (matchedDemo) {
      const user = this.users.find(
        (u) =>
          (u.email === credentials.identifier ||
            u.university_id === credentials.identifier) &&
          u.type === credentials.type,
      );

      if (user) {
        return {
          success: true,
          data: {
            user,
            token: `mock_token_${user.type}_${Date.now()}`,
          },
        };
      }
    }

    return {
      success: false,
      error: "Invalid credentials",
    };
  }

  async getCurrentUser(token: string): Promise<ApiResponse<{ user: User }>> {
    await this.delay(200);

    // Extract user type from token
    if (token.includes("admin")) {
      const user = this.users.find((u) => u.type === "admin");
      return user
        ? { success: true, data: { user } }
        : { success: false, error: "User not found" };
    } else if (token.includes("applicant")) {
      const user = this.users.find((u) => u.type === "applicant");
      return user
        ? { success: true, data: { user } }
        : { success: false, error: "User not found" };
    }

    return { success: false, error: "Invalid token" };
  }

  async logout(): Promise<ApiResponse> {
    await this.delay(200);
    return { success: true, message: "Logged out successfully" };
  }

  // Applications
  async getApplications(params?: {
    status?: string;
    search?: string;
    page?: number;
    limit?: number;
  }): Promise<ApiResponse<{ applications: Application[]; total: number }>> {
    await this.delay();

    let filteredApps = [...this.applications];

    if (params?.status && params.status !== "all") {
      filteredApps = filteredApps.filter((app) => app.status === params.status);
    }

    if (params?.search) {
      const search = params.search.toLowerCase();
      filteredApps = filteredApps.filter(
        (app) =>
          app.applicant_name.toLowerCase().includes(search) ||
          app.email.toLowerCase().includes(search) ||
          app.university_id?.toLowerCase().includes(search) ||
          app.student_id?.toLowerCase().includes(search),
      );
    }

    return {
      success: true,
      data: {
        applications: filteredApps,
        total: filteredApps.length,
      },
    };
  }

  async getApplication(
    id: string,
  ): Promise<ApiResponse<{ application: Application }>> {
    await this.delay();

    const application = this.applications.find(
      (app) => app.id === id || app.uuid === id,
    );

    if (application) {
      return { success: true, data: { application } };
    }

    return { success: false, error: "Application not found" };
  }

  async createApplication(data: any): Promise<
    ApiResponse<{
      application: Application;
      university_id: string;
      password: string;
    }>
  > {
    await this.delay();

    // Check program limits before creating application
    const programKey = `${data.program_code}_${data.department_code}`;

    // Get current settings (in real app, this would be from database)
    const settings = await this.getAdmissionSettings();
    const programLimits = settings.data?.program_limits || {};

    // Check if program limit enforcement is enabled for this program
    const programLimit = programLimits[programKey];
    if (programLimit && programLimit.enabled) {
      // Count current applications for this program-department combination
      const currentCount = this.applications.filter(app =>
        app.program_code === data.program_code &&
        app.department_code === data.department_code &&
        app.status !== 'rejected' // Don't count rejected applications
      ).length;

      // Check if limit is reached
      if (currentCount >= programLimit.max_applicants) {
        return {
          success: false,
          error: `Application limit reached for ${data.program_name} in ${data.department_name}. Maximum ${programLimit.max_applicants} applications allowed. Please try a different program or contact admissions office.`,
        };
      }
    }

    const newId = `app-${String(this.applications.length + 1).padStart(3, "0")}`;
    const universityId = `APP${String(Date.now()).slice(-6)}`;
    const password = `temp${Math.random().toString().slice(-6)}`;

    const newApplication: Application = {
      id: newId,
      uuid: `app-uuid-${newId}`,
      status: "pending",
      applicant_name: `${data.first_name} ${data.last_name}`,
      university_id: universityId,
      email: data.email,
      phone: data.phone,
      admission_type: data.admission_type || "regular",
      program_code: data.program_code,
      program_name: data.program_name,
      department_code: data.department_code,
      department_name: data.department_name,
      campus: data.campus,
      semester: data.semester,
      semester_type: data.semester_type,
      created_at: new Date().toISOString(),
      personal_info: data,
      academic_history: data.academic_history,
      documents: data.documents,
    };

    this.applications.push(newApplication);

    return {
      success: true,
      data: {
        application: newApplication,
        university_id: universityId,
        password: password,
      },
    };
  }

  async updateApplicationStatus(
    id: string,
    status: string,
  ): Promise<ApiResponse> {
    await this.delay();

    const appIndex = this.applications.findIndex(
      (app) => app.id === id || app.uuid === id,
    );

    if (appIndex === -1) {
      return { success: false, error: "Application not found" };
    }

    this.applications[appIndex].status = status as any;

    // Generate student ID if approved
    if (status === "approved" && !this.applications[appIndex].student_id) {
      const year = new Date().getFullYear().toString().slice(-2);
      const deptCode = this.applications[appIndex].department_code;
      const sequence = String(Math.floor(Math.random() * 999) + 1).padStart(
        3,
        "0",
      );
      this.applications[appIndex].student_id =
        `NU${year}${deptCode}${sequence}`;
    }

    return {
      success: true,
      message: "Application status updated successfully",
    };
  }

  async generateApplicationIds(
    id: string,
  ): Promise<ApiResponse<{ university_id: string; password: string }>> {
    await this.delay();

    const universityId = `APP${String(Date.now()).slice(-6)}`;
    const password = `temp${Math.random().toString().slice(-6)}`;

    return {
      success: true,
      data: {
        university_id: universityId,
        password: password,
      },
    };
  }

  async getApplicationStats(): Promise<ApiResponse> {
    await this.delay();

    const stats = {
      total: this.applications.length,
      pending: this.applications.filter((app) => app.status === "pending")
        .length,
      approved: this.applications.filter((app) => app.status === "approved")
        .length,
      rejected: this.applications.filter((app) => app.status === "rejected")
        .length,
      payment_pending: this.applications.filter(
        (app) => app.status === "payment_pending",
      ).length,
    };

    return { success: true, data: stats };
  }

  // Programs
  async getPrograms(): Promise<ApiResponse> {
    await this.delay();
    return { success: true, data: { programs: this.programs } };
  }

  async getDepartments(): Promise<ApiResponse> {
    await this.delay();
    return { success: true, data: { departments: this.departments } };
  }

  async calculateCost(data: {
    program_code: string;
    department_code: string;
    waivers?: Array<{ type: string; value: number }>;
  }): Promise<ApiResponse> {
    await this.delay();

    const program = this.programs.find((p) => p.code === data.program_code);
    if (!program) {
      return { success: false, error: "Program not found" };
    }

    let totalCost = program.tuition_fee;
    const additionalFees = {
      admission_fee: 5000,
      registration_fee: 2000,
      library_fee: 1000,
      lab_fee: 3000,
    };

    let waiverAmount = 0;
    if (data.waivers) {
      waiverAmount = data.waivers.reduce(
        (sum, waiver) => sum + waiver.value,
        0,
      );
    }

    const breakdown = {
      tuition_fee: program.tuition_fee,
      additional_fees: additionalFees,
      total_additional: Object.values(additionalFees).reduce(
        (sum, fee) => sum + fee,
        0,
      ),
      waiver_amount: waiverAmount,
      grand_total:
        totalCost +
        Object.values(additionalFees).reduce((sum, fee) => sum + fee, 0) -
        waiverAmount,
    };

    return { success: true, data: breakdown };
  }

  // Referrers
  async getReferrers(): Promise<ApiResponse> {
    await this.delay();
    return { success: true, data: { referrers: this.referrers } };
  }

  async validateReferrer(employee_id: string): Promise<ApiResponse> {
    await this.delay();

    const referrer = this.referrers.find((r) => r.employee_id === employee_id);

    if (referrer) {
      return { success: true, data: { referrer, valid: true } };
    }

    return {
      success: false,
      data: { valid: false },
      error: "Referrer not found",
    };
  }

  async getReferrerStats(employee_id: string): Promise<ApiResponse> {
    await this.delay();

    // Mock stats
    const stats = {
      total_referrals: Math.floor(Math.random() * 20) + 1,
      successful_admissions: Math.floor(Math.random() * 15) + 1,
      pending_applications: Math.floor(Math.random() * 5),
      commission_earned: Math.floor(Math.random() * 50000) + 10000,
    };

    return { success: true, data: stats };
  }

  // Configuration Methods
  async getAdmissionSettings(): Promise<ApiResponse> {
    await this.delay();

    const settings = {
      application_start_date: "2024-09-01",
      application_deadline: "2024-12-31",
      late_fee_deadline: "2024-12-15",
      session_name: "Spring 2024",
      admission_fee: 2000,
      late_fee: 500,
      max_waiver_percentage: 25,
      is_admission_open: true,
      allow_application_editing: true,
      waiver_enabled: true,
      auto_approve_applications: false,
      require_payment_for_review: false,
      enable_sms_notifications: true,
      enable_email_notifications: true,
      contact_email: "admissions@nu.edu.bd",
      contact_phone: "+8801234567890",
      help_desk_hours: "9:00 AM - 5:00 PM (Monday to Friday)",
      // Eligibility Configuration
      eligibility_check_enabled: true,
      strict_eligibility_enforcement: true,
      allow_eligibility_override: false,
      minimum_ssc_gpa: 2.5,
      minimum_hsc_gpa: 2.5,
      minimum_bachelor_gpa: 2.5,
      minimum_master_gpa: 3.0,
      allow_alternative_qualifications: true,
      show_suggested_programs: true,
      eligibility_warning_threshold: 0.2,
      // Waiver Configuration
      max_combined_waiver: 100,
      require_document_verification_for_waiver: true,
      auto_calculate_result_waiver: true,
      allow_manual_waiver_override: true,
      // Admission Test Configuration
      law_admission_test_date: "2024-12-15",
      architecture_admission_test_date: "2024-12-16",
      admission_test_fee: 1500,
      law_test_time: "10:00 AM - 12:00 PM",
      architecture_test_time: "2:00 PM - 4:00 PM",
      law_test_venue_main:
        "Northern University Bangladesh, Main Campus, Dhaka - Room 101",
      law_test_venue_khulna:
        "Northern University Bangladesh, Khulna Campus - Room 201",
      architecture_test_venue_main:
        "Northern University Bangladesh, Main Campus, Dhaka - Drawing Hall",
      architecture_test_venue_khulna:
        "Northern University Bangladesh, Khulna Campus - Art Studio",
    };

    return { success: true, data: settings };
  }

  async updateAdmissionSettings(settings: any): Promise<ApiResponse> {
    await this.delay();
    return { success: true, message: "Settings updated successfully" };
  }

  async getPaymentMethods(): Promise<ApiResponse> {
    await this.delay();

    const paymentMethods = [
      {
        id: 1,
        name: "bKash",
        type: "mobile_banking",
        enabled: true,
        account_number: "01700000000",
        instructions: "Send money to this number and upload receipt",
        processing_fee: 0,
        minimum_amount: 100,
        maximum_amount: 500000,
        is_active: true,
        order_priority: 1,
      },
      {
        id: 2,
        name: "Rocket",
        type: "mobile_banking",
        enabled: true,
        account_number: "017000000000",
        instructions: "Send money to this number and upload receipt",
        processing_fee: 0,
        minimum_amount: 100,
        maximum_amount: 500000,
        is_active: true,
        order_priority: 2,
      },
      {
        id: 3,
        name: "Bank Transfer",
        type: "bank",
        enabled: true,
        account_number: "1234567890",
        bank_name: "Example Bank Ltd",
        routing_number: "123456789",
        instructions: "Transfer to this bank account and upload receipt",
        processing_fee: 50,
        minimum_amount: 1000,
        maximum_amount: 1000000,
        is_active: true,
        order_priority: 3,
      },
    ];

    return { success: true, data: paymentMethods };
  }

  async createPaymentMethod(method: any): Promise<ApiResponse> {
    await this.delay();
    return { success: true, message: "Payment method created successfully" };
  }

  async updatePaymentMethod(id: string, method: any): Promise<ApiResponse> {
    await this.delay();
    return { success: true, message: "Payment method updated successfully" };
  }

  async deletePaymentMethod(id: string): Promise<ApiResponse> {
    await this.delay();
    return { success: true, message: "Payment method deleted successfully" };
  }

  async getDocumentRequirements(): Promise<ApiResponse> {
    await this.delay();

    const requirements = [
      {
        id: 1,
        name: "SSC Certificate",
        type: "academic",
        is_required: true,
        allowed_formats: ["PDF", "JPG", "PNG"],
        max_file_size: "5MB",
        description: "Original SSC certificate or equivalent",
        order_priority: 1,
      },
      {
        id: 2,
        name: "HSC Certificate",
        type: "academic",
        is_required: true,
        allowed_formats: ["PDF", "JPG", "PNG"],
        max_file_size: "5MB",
        description: "Original HSC certificate or equivalent",
        order_priority: 2,
      },
      {
        id: 3,
        name: "Passport Photo",
        type: "personal",
        is_required: true,
        allowed_formats: ["JPG", "PNG"],
        max_file_size: "2MB",
        description: "Recent passport-size photograph",
        order_priority: 3,
      },
      {
        id: 4,
        name: "National ID",
        type: "personal",
        is_required: true,
        allowed_formats: ["PDF", "JPG", "PNG"],
        max_file_size: "3MB",
        description: "National ID card or birth certificate",
        order_priority: 4,
      },
      {
        id: 5,
        name: "Transcript",
        type: "academic",
        is_required: false,
        allowed_formats: ["PDF"],
        max_file_size: "10MB",
        description: "Official academic transcript for credit transfer",
        order_priority: 5,
      },
    ];

    return { success: true, data: requirements };
  }

  async createDocumentRequirement(requirement: any): Promise<ApiResponse> {
    await this.delay();
    return {
      success: true,
      message: "Document requirement created successfully",
    };
  }

  async updateDocumentRequirement(
    id: string,
    requirement: any,
  ): Promise<ApiResponse> {
    await this.delay();
    return {
      success: true,
      message: "Document requirement updated successfully",
    };
  }

  async deleteDocumentRequirement(id: string): Promise<ApiResponse> {
    await this.delay();
    return {
      success: true,
      message: "Document requirement deleted successfully",
    };
  }
}

export const mockApi = new MockApiService();
