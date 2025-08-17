/**
 * Shared code between client and server
 * Useful to share types between client and server
 * and/or small pure JS functions that can be used on both client and server
 */

/**
 * Example response type for /api/demo
 */
export interface DemoResponse {
  message: string;
}

/**
 * Admission configuration types
 */
export interface AdmissionSettings {
  id?: number;
  application_deadline: string;
  admission_fee: number;
  late_fee: number;
  late_fee_deadline: string;
  max_applications_per_user: number;
  allow_application_editing: boolean;
  require_phone_verification: boolean;
  require_email_verification: boolean;
  require_document_upload: boolean;
  application_start_date: string;
  session_name: string;
  admission_notice: string;
  payment_instructions: string;
  contact_email: string;
  contact_phone: string;
  is_admission_open: boolean;
  waiver_enabled: boolean;
  max_waiver_percentage: number;
  auto_approve_applications: boolean;
  send_sms_notifications: boolean;
  send_email_notifications: boolean;

  // Campus configuration
  main_campus_enabled?: boolean;
  khulna_branch_enabled?: boolean;

  // Student ID generation system
  semester_codes?: {
    summer?: string;
    fall?: string;
    winter?: string;
  };
  department_codes?: {
    CSE?: string;
    EEE?: string;
    BBA?: string;
    ENG?: string;
    [key: string]: string | undefined;
  };
  id_generation_start_year?: number;
  current_semester?: 'summer' | 'fall' | 'winter';
  auto_id_generation?: boolean;

  created_at?: string;
  updated_at?: string;
}

export interface AdmissionSettingsUpdateRequest {
  settings: Partial<AdmissionSettings>;
}

export interface AdmissionSettingsResponse {
  success: boolean;
  data?: AdmissionSettings;
  error?: string;
}

export interface PaymentMethod {
  id?: number;
  name: string;
  type: 'bank' | 'mobile' | 'online';
  account_number: string;
  account_name: string;
  routing_number?: string;
  instructions: string;
  is_active: boolean;
  order_priority: number;
}

export interface PaymentMethodsResponse {
  success: boolean;
  data?: PaymentMethod[];
  error?: string;
}

export interface DocumentRequirement {
  id?: number;
  name: string;
  description: string;
  is_required: boolean;
  file_types: string;
  max_file_size_mb: number;
  order_priority: number;
  is_active: boolean;
}

export interface DocumentRequirementsResponse {
  success: boolean;
  data?: DocumentRequirement[];
  error?: string;
}
