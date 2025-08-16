import { RequestHandler } from "express";
import { dbGet, dbAll, dbRun } from "../database/config.js";
import { 
  AdmissionSettings, 
  AdmissionSettingsResponse,
  AdmissionSettingsUpdateRequest,
  PaymentMethod,
  PaymentMethodsResponse,
  DocumentRequirement,
  DocumentRequirementsResponse
} from "@shared/api";

// Get current admission settings
export const getAdmissionSettings: RequestHandler = async (req, res) => {
  try {
    const settings = await dbGet("SELECT * FROM admission_settings WHERE id = 1") as AdmissionSettings;
    
    if (!settings) {
      res.status(404).json({
        success: false,
        error: "Admission settings not found"
      } as AdmissionSettingsResponse);
      return;
    }

    res.json({
      success: true,
      data: settings
    } as AdmissionSettingsResponse);
  } catch (error) {
    console.error("Error fetching admission settings:", error);
    res.status(500).json({
      success: false,
      error: "Failed to fetch admission settings"
    } as AdmissionSettingsResponse);
  }
};

// Update admission settings
export const updateAdmissionSettings: RequestHandler = async (req, res) => {
  try {
    const { settings } = req.body as AdmissionSettingsUpdateRequest;
    
    if (!settings) {
      res.status(400).json({
        success: false,
        error: "Settings data is required"
      } as AdmissionSettingsResponse);
      return;
    }

    // Build UPDATE query dynamically based on provided fields
    const updateFields = Object.keys(settings).filter(key => key !== 'id' && key !== 'created_at');
    const setClause = updateFields.map(field => `${field} = ?`).join(', ');
    const values = updateFields.map(field => settings[field as keyof AdmissionSettings]);

    if (updateFields.length === 0) {
      res.status(400).json({
        success: false,
        error: "No valid fields to update"
      } as AdmissionSettingsResponse);
      return;
    }

    // Add updated_at timestamp
    const query = `
      UPDATE admission_settings 
      SET ${setClause}, updated_at = CURRENT_TIMESTAMP 
      WHERE id = 1
    `;

    await dbRun(query, values);

    // Fetch and return updated settings
    const updatedSettings = await dbGet("SELECT * FROM admission_settings WHERE id = 1") as AdmissionSettings;

    res.json({
      success: true,
      data: updatedSettings
    } as AdmissionSettingsResponse);
  } catch (error) {
    console.error("Error updating admission settings:", error);
    res.status(500).json({
      success: false,
      error: "Failed to update admission settings"
    } as AdmissionSettingsResponse);
  }
};

// Get payment methods
export const getPaymentMethods: RequestHandler = async (req, res) => {
  try {
    const paymentMethods = await dbAll(
      "SELECT * FROM payment_methods ORDER BY order_priority ASC, created_at ASC"
    ) as PaymentMethod[];

    res.json({
      success: true,
      data: paymentMethods
    } as PaymentMethodsResponse);
  } catch (error) {
    console.error("Error fetching payment methods:", error);
    res.status(500).json({
      success: false,
      error: "Failed to fetch payment methods"
    } as PaymentMethodsResponse);
  }
};

// Create payment method
export const createPaymentMethod: RequestHandler = async (req, res) => {
  try {
    const paymentMethod = req.body as Omit<PaymentMethod, 'id' | 'created_at' | 'updated_at'>;

    const result = await dbRun(`
      INSERT INTO payment_methods (
        name, type, account_number, account_name, routing_number, 
        instructions, is_active, order_priority
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `, [
      paymentMethod.name,
      paymentMethod.type,
      paymentMethod.account_number,
      paymentMethod.account_name,
      paymentMethod.routing_number || null,
      paymentMethod.instructions,
      paymentMethod.is_active ? 1 : 0,
      paymentMethod.order_priority
    ]);

    const newPaymentMethod = await dbGet(
      "SELECT * FROM payment_methods WHERE id = ?",
      [result.lastID]
    ) as PaymentMethod;

    res.status(201).json({
      success: true,
      data: [newPaymentMethod]
    } as PaymentMethodsResponse);
  } catch (error) {
    console.error("Error creating payment method:", error);
    res.status(500).json({
      success: false,
      error: "Failed to create payment method"
    } as PaymentMethodsResponse);
  }
};

// Update payment method
export const updatePaymentMethod: RequestHandler = async (req, res) => {
  try {
    const { id } = req.params;
    const paymentMethod = req.body as Partial<PaymentMethod>;

    // Build UPDATE query dynamically
    const updateFields = Object.keys(paymentMethod).filter(key => 
      key !== 'id' && key !== 'created_at' && key !== 'updated_at'
    );
    const setClause = updateFields.map(field => `${field} = ?`).join(', ');
    const values = updateFields.map(field => paymentMethod[field as keyof PaymentMethod]);

    if (updateFields.length === 0) {
      res.status(400).json({
        success: false,
        error: "No valid fields to update"
      } as PaymentMethodsResponse);
      return;
    }

    await dbRun(`
      UPDATE payment_methods 
      SET ${setClause}, updated_at = CURRENT_TIMESTAMP 
      WHERE id = ?
    `, [...values, id]);

    const updatedPaymentMethod = await dbGet(
      "SELECT * FROM payment_methods WHERE id = ?",
      [id]
    ) as PaymentMethod;

    res.json({
      success: true,
      data: [updatedPaymentMethod]
    } as PaymentMethodsResponse);
  } catch (error) {
    console.error("Error updating payment method:", error);
    res.status(500).json({
      success: false,
      error: "Failed to update payment method"
    } as PaymentMethodsResponse);
  }
};

// Delete payment method
export const deletePaymentMethod: RequestHandler = async (req, res) => {
  try {
    const { id } = req.params;

    await dbRun("DELETE FROM payment_methods WHERE id = ?", [id]);

    res.json({
      success: true,
      data: []
    } as PaymentMethodsResponse);
  } catch (error) {
    console.error("Error deleting payment method:", error);
    res.status(500).json({
      success: false,
      error: "Failed to delete payment method"
    } as PaymentMethodsResponse);
  }
};

// Get document requirements
export const getDocumentRequirements: RequestHandler = async (req, res) => {
  try {
    const requirements = await dbAll(
      "SELECT * FROM document_requirements ORDER BY order_priority ASC, created_at ASC"
    ) as DocumentRequirement[];

    res.json({
      success: true,
      data: requirements
    } as DocumentRequirementsResponse);
  } catch (error) {
    console.error("Error fetching document requirements:", error);
    res.status(500).json({
      success: false,
      error: "Failed to fetch document requirements"
    } as DocumentRequirementsResponse);
  }
};

// Create document requirement
export const createDocumentRequirement: RequestHandler = async (req, res) => {
  try {
    const requirement = req.body as Omit<DocumentRequirement, 'id' | 'created_at' | 'updated_at'>;

    const result = await dbRun(`
      INSERT INTO document_requirements (
        name, description, is_required, file_types, 
        max_file_size_mb, order_priority, is_active
      ) VALUES (?, ?, ?, ?, ?, ?, ?)
    `, [
      requirement.name,
      requirement.description,
      requirement.is_required ? 1 : 0,
      requirement.file_types,
      requirement.max_file_size_mb,
      requirement.order_priority,
      requirement.is_active ? 1 : 0
    ]);

    const newRequirement = await dbGet(
      "SELECT * FROM document_requirements WHERE id = ?",
      [result.lastID]
    ) as DocumentRequirement;

    res.status(201).json({
      success: true,
      data: [newRequirement]
    } as DocumentRequirementsResponse);
  } catch (error) {
    console.error("Error creating document requirement:", error);
    res.status(500).json({
      success: false,
      error: "Failed to create document requirement"
    } as DocumentRequirementsResponse);
  }
};

// Update document requirement
export const updateDocumentRequirement: RequestHandler = async (req, res) => {
  try {
    const { id } = req.params;
    const requirement = req.body as Partial<DocumentRequirement>;

    // Build UPDATE query dynamically
    const updateFields = Object.keys(requirement).filter(key => 
      key !== 'id' && key !== 'created_at' && key !== 'updated_at'
    );
    const setClause = updateFields.map(field => `${field} = ?`).join(', ');
    const values = updateFields.map(field => requirement[field as keyof DocumentRequirement]);

    if (updateFields.length === 0) {
      res.status(400).json({
        success: false,
        error: "No valid fields to update"
      } as DocumentRequirementsResponse);
      return;
    }

    await dbRun(`
      UPDATE document_requirements 
      SET ${setClause}, updated_at = CURRENT_TIMESTAMP 
      WHERE id = ?
    `, [...values, id]);

    const updatedRequirement = await dbGet(
      "SELECT * FROM document_requirements WHERE id = ?",
      [id]
    ) as DocumentRequirement;

    res.json({
      success: true,
      data: [updatedRequirement]
    } as DocumentRequirementsResponse);
  } catch (error) {
    console.error("Error updating document requirement:", error);
    res.status(500).json({
      success: false,
      error: "Failed to update document requirement"
    } as DocumentRequirementsResponse);
  }
};

// Delete document requirement
export const deleteDocumentRequirement: RequestHandler = async (req, res) => {
  try {
    const { id } = req.params;

    await dbRun("DELETE FROM document_requirements WHERE id = ?", [id]);

    res.json({
      success: true,
      data: []
    } as DocumentRequirementsResponse);
  } catch (error) {
    console.error("Error deleting document requirement:", error);
    res.status(500).json({
      success: false,
      error: "Failed to delete document requirement"
    } as DocumentRequirementsResponse);
  }
};
