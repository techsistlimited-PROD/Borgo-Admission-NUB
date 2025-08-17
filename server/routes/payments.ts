import express from "express";
import { dbRun, dbGet } from "../database/config.js";

const router = express.Router();

// Clear payment for an application (dummy payment mechanism)
router.post("/clear/:trackingId", async (req, res) => {
  try {
    const { trackingId } = req.params;
    
    // Find the application by tracking ID
    const application = await dbGet(
      "SELECT id FROM applications WHERE tracking_id = ?",
      [trackingId]
    );
    
    if (!application) {
      return res.status(404).json({ 
        error: "Application not found" 
      });
    }
    
    // Update payment status to paid
    await dbRun(
      "UPDATE applications SET payment_status = 'paid', updated_at = CURRENT_TIMESTAMP WHERE tracking_id = ?",
      [trackingId]
    );
    
    res.json({
      success: true,
      message: "Payment cleared successfully",
      tracking_id: trackingId
    });
  } catch (error) {
    console.error("Payment clearance error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// Get payment status for an application
router.get("/status/:trackingId", async (req, res) => {
  try {
    const { trackingId } = req.params;
    
    const application = await dbGet(
      "SELECT payment_status, final_amount FROM applications WHERE tracking_id = ?",
      [trackingId]
    );
    
    if (!application) {
      return res.status(404).json({ 
        error: "Application not found" 
      });
    }
    
    res.json({
      success: true,
      data: {
        payment_status: application.payment_status,
        final_amount: application.final_amount
      }
    });
  } catch (error) {
    console.error("Get payment status error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

export default router;
