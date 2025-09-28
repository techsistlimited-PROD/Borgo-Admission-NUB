import express from "express";
import { supabase } from "../database/supabase.js";
import { authenticateToken, requireAdmin, AuthRequest } from "../middleware/auth.js";

const router = express.Router();

// Templates
router.get("/templates", authenticateToken, requireAdmin, async (req: AuthRequest, res) => {
  try {
    const { data, error } = await supabase.from("messaging_templates").select("*").order("created_at", { ascending: false });
    if (error) throw error;
    res.json({ success: true, data });
  } catch (err) {
    console.error("Error fetching templates:", err);
    res.status(500).json({ success: false, error: "Failed to load templates" });
  }
});

router.post("/templates", authenticateToken, requireAdmin, async (req: AuthRequest, res) => {
  try {
    const tpl = req.body;
    const { data, error } = await supabase.from("messaging_templates").insert([{ ...tpl }]).select();
    if (error) throw error;
    res.json({ success: true, data: data![0] });
  } catch (err) {
    console.error("Error creating template:", err);
    res.status(500).json({ success: false, error: "Failed to create template" });
  }
});

router.put("/templates/:id", authenticateToken, requireAdmin, async (req: AuthRequest, res) => {
  try {
    const { id } = req.params;
    const upd = req.body;
    const { data, error } = await supabase.from("messaging_templates").update(upd).eq("id", id).select();
    if (error) throw error;
    res.json({ success: true, data: data![0] });
  } catch (err) {
    console.error("Error updating template:", err);
    res.status(500).json({ success: false, error: "Failed to update template" });
  }
});

router.delete("/templates/:id", authenticateToken, requireAdmin, async (req: AuthRequest, res) => {
  try {
    const { id } = req.params;
    const { error } = await supabase.from("messaging_templates").delete().eq("id", id);
    if (error) throw error;
    res.json({ success: true });
  } catch (err) {
    console.error("Error deleting template:", err);
    res.status(500).json({ success: false, error: "Failed to delete template" });
  }
});

// Campaigns
router.get("/campaigns", authenticateToken, requireAdmin, async (req: AuthRequest, res) => {
  try {
    const { data, error } = await supabase.from("messaging_campaigns").select("*").order("created_at", { ascending: false });
    if (error) throw error;
    res.json({ success: true, data });
  } catch (err) {
    console.error("Error fetching campaigns:", err);
    res.status(500).json({ success: false, error: "Failed to load campaigns" });
  }
});

// Create campaign: accepts { name, template_id, recipients: { type, list }, send_at }
// For MVP, recipients.list should be an array of recipient objects: { to, vars }
router.post("/campaigns", authenticateToken, requireAdmin, async (req: AuthRequest, res) => {
  try {
    const payload = req.body;
    const { data: campaignData, error: cErr } = await supabase.from("messaging_campaigns").insert([{ ...payload, status: "scheduled" }]).select();
    if (cErr) throw cErr;
    const campaign = campaignData![0];

    // If recipients list provided, enqueue sends into messaging_logs
    if (payload.recipients && Array.isArray(payload.recipients.list)) {
      const logs = payload.recipients.list.map((r: any) => ({
        campaign_id: campaign.id,
        template_id: campaign.template_id,
        to: r.to,
        channel: r.channel || "sms",
        vars: r.vars || {},
        status: "queued",
        attempts: 0,
        created_at: new Date().toISOString(),
      }));
      const { data: logData, error: lErr } = await supabase.from("messaging_logs").insert(logs).select();
      if (lErr) throw lErr;
    }

    res.json({ success: true, data: campaign });
  } catch (err) {
    console.error("Error creating campaign:", err);
    res.status(500).json({ success: false, error: "Failed to create campaign" });
  }
});

// Logs
router.get("/logs", authenticateToken, requireAdmin, async (req: AuthRequest, res) => {
  try {
    const { campaignId, status, limit = 100, offset = 0 } = req.query as any;
    let query = supabase.from("messaging_logs").select("*").order("created_at", { ascending: false }).range(Number(offset), Number(offset) + Number(limit) - 1);

    if (campaignId) query = query.eq("campaign_id", campaignId);
    if (status) query = query.eq("status", status);

    const { data, error } = await query;
    if (error) throw error;
    res.json({ success: true, data });
  } catch (err) {
    console.error("Error fetching logs:", err);
    res.status(500).json({ success: false, error: "Failed to load logs" });
  }
});

// Test send (server-side mock send) - will insert a log with status 'sent' (mock)
router.post("/test-send", authenticateToken, requireAdmin, async (req: AuthRequest, res) => {
  try {
    const { templateId, channel, to, vars } = req.body;

    // Fetch template
    const { data: tplData, error: tplErr } = await supabase.from("messaging_templates").select("*").eq("id", templateId).single();
    if (tplErr) throw tplErr;
    const tpl = tplData;

    // Render preview (simple replace of {{var}})
    let rendered = tpl.body || "";
    if (vars) {
      Object.entries(vars).forEach(([k, v]) => {
        rendered = rendered.replace(new RegExp(`{{\\s*${k}\\s*}}`, "g"), String(v));
      });
    }

    const log = {
      campaign_id: null,
      template_id: templateId,
      to,
      channel,
      status: "sent",
      provider_message_id: "mock-" + Date.now(),
      provider_response: { preview: rendered },
      attempts: 1,
      created_at: new Date().toISOString(),
    };

    const { data: logData, error: lErr } = await supabase.from("messaging_logs").insert([log]).select();
    if (lErr) throw lErr;

    res.json({ success: true, data: { preview: rendered, log: logData![0] } });
  } catch (err) {
    console.error("Error in test-send:", err);
    res.status(500).json({ success: false, error: "Test send failed" });
  }
});

export default router;
