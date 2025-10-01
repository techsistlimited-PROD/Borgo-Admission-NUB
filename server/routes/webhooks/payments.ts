import express from "express";
import crypto from "crypto";
import { dbRun, dbGet } from "../../server/database/config.js";

const router = express.Router();

// POST /webhooks/payments/:provider
router.post("/:provider", async (req, res) => {
  try {
    const { provider } = req.params;
    const signature = req.headers["x-signature"] || req.headers["x-signature-256"] || req.headers["x-sslcommerz-signature"] || '';
    const rawBody = JSON.stringify(req.body || {});

    // Decide secret by provider env var or generic
    const envKey = `PAYMENT_WEBHOOK_SECRET_${provider.toUpperCase()}`;
    const secret = (process.env as any)[envKey] || (process.env as any)["PAYMENT_WEBHOOK_SECRET"] || null;

    let signatureValid = false;
    if (secret) {
      const hmac = crypto.createHmac("sha256", secret).update(rawBody).digest("hex");
      signatureValid = String(signature).replace(/"/g, '') === hmac;
    } else {
      console.warn("No payment webhook secret configured; skipping signature validation");
    }

    // Idempotency key attempt
    const idempotencyKey = req.headers["idempotency-key"] || req.body?.idempotency_key || null;

    // If idempotency exists and already processed, return 200
    if (idempotencyKey) {
      const existing = await dbGet(`SELECT * FROM payment_webhook_events WHERE idempotency_key = ?`, [String(idempotencyKey)]);
      if (existing && existing.processed_at) {
        return res.status(200).json({ success: true, message: 'Already processed' });
      }
    }

    // Insert event record
    const result = await dbRun(`INSERT INTO payment_webhook_events (provider, payload_json, signature_header, signature_valid, idempotency_key, received_at, status) VALUES (?, ?, ?, ?, ?, datetime('now'), ?)`, [
      provider,
      rawBody,
      String(signature) || null,
      signatureValid ? 1 : 0,
      idempotencyKey || null,
      'Queued',
    ]);

    // For MVP: mark processed immediately (in real system a worker would process async)
    try {
      // Simulate processing: basic ledger write would be here
      await dbRun(`UPDATE payment_webhook_events SET processed_at = datetime('now'), status = 'Processed' WHERE webhook_id = ?`, [result.lastID]);
    } catch (err) {
      await dbRun(`UPDATE payment_webhook_events SET status = 'Failed', error = ? WHERE webhook_id = ?`, [String(err), result.lastID]);
      console.error('Webhook processing failed', err);
      return res.status(500).json({ error: 'Processing failed' });
    }

    res.json({ success: true });
  } catch (error) {
    console.error('Payment webhook error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Endpoint to process queued webhooks (idempotent)
router.post('/process-queue', async (req, res) => {
  try {
    // Fetch queued events (limit 50)
    const rows = await dbGet(`SELECT COUNT(*) as cnt FROM payment_webhook_events WHERE status = 'Queued'`);
    // For simplicity, process all queued events one by one
    const queued = await (async () => {
      const db = await import('../../server/database/config.js');
      return db.dbAll(`SELECT * FROM payment_webhook_events WHERE status = 'Queued' ORDER BY received_at ASC LIMIT 100`, []);
    })();

    for (const ev of queued) {
      try {
        // Basic processing stub: mark processed
        await dbRun(`UPDATE payment_webhook_events SET processed_at = datetime('now'), status = 'Processed' WHERE webhook_id = ?`, [ev.webhook_id]);
      } catch (err) {
        console.error('Failed processing webhook', ev.webhook_id, err);
        await dbRun(`UPDATE payment_webhook_events SET status = 'Failed', error = ? WHERE webhook_id = ?`, [String(err), ev.webhook_id]);
      }
    }

    res.json({ success: true, processed: queued.length });
  } catch (error) {
    console.error('Process queue error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

export default router;
