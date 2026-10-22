/**
 * Local Razorpay order + verify API. Run with: npm run dev:api
 * Set RAZORPAY_KEY_ID and RAZORPAY_KEY_SECRET in .env (never commit secrets).
 */
import "dotenv/config";
import express from "express";
import cors from "cors";
import crypto from "node:crypto";
import Razorpay from "razorpay";
import { createLead, readLeads, updateLead, deleteLead } from "./leadsStore.mjs";
import { notifyNewLead } from "./notify.mjs";
import { readCms, writeCms } from "./cmsStore.mjs";
import { isCloudinaryConfigured, uploadToCloudinary } from "./cloudinary.mjs";

const ADMIN_TOKEN = process.env.ADMIN_PANEL_TOKEN ?? "ZV-ADMIN-2026-DEMO";

const requireAdmin = (req, res, next) => {
  if (req.headers["x-admin-token"] !== ADMIN_TOKEN) {
    return res.status(401).json({ error: "Unauthorized" });
  }
  next();
};

const PLAN_AMOUNTS_PAISE = {
  starter: 499900,
  growth: 1299900,
  pro: 2499900,
};

const keyId = process.env.RAZORPAY_KEY_ID;
const keySecret = process.env.RAZORPAY_KEY_SECRET;

if (!keyId || !keySecret) {
  console.warn(
    "[razorpay-api] Missing RAZORPAY_KEY_ID or RAZORPAY_KEY_SECRET. Create .env in project root (see .env.example).",
  );
}

const rzp =
  keyId && keySecret
    ? new Razorpay({
        key_id: keyId,
        key_secret: keySecret,
      })
    : null;

const app = express();
app.use(cors({ origin: true }));
app.use(express.json());

// --- Leads (website form → admin panel) ---
app.post("/api/leads", async (req, res) => {
  try {
    const { name, phone, email, city, business_type, product_interest, message, source, form_type, audit_type, calculator_type, company_name, tool_id, score, report_summary, report_data } = req.body ?? {};
    if (!name?.trim() || !phone?.trim() || !email?.trim()) {
      return res.status(400).json({ error: "Name, phone and email are required." });
    }
    const lead = await createLead({
      name: String(name).trim(),
      phone: String(phone).trim(),
      email: String(email).trim(),
      city: city ?? null,
      business_type: business_type ?? null,
      product_interest: product_interest ?? null,
      message: message ?? null,
      source: source ?? "website",
      form_type: form_type ?? null,
      audit_type: audit_type ?? null,
      calculator_type: calculator_type ?? null,
      company_name: company_name ?? null,
      tool_id: tool_id ?? null,
      score: score != null ? Number(score) : null,
      report_summary: report_summary ?? null,
      report_data: report_data ?? null,
    });
    notifyNewLead(lead).catch((e) => console.error("[notify]", e));
    return res.status(201).json({ ok: true, lead });
  } catch (e) {
    console.error("[leads] create", e);
    return res.status(500).json({ error: e?.message ?? "Failed to save lead." });
  }
});

app.get("/api/leads", requireAdmin, async (_req, res) => {
  try {
    const leads = await readLeads();
    return res.json({ leads });
  } catch (e) {
    console.error("[leads] list", e);
    return res.status(500).json({ error: e?.message ?? "Failed to fetch leads." });
  }
});

app.post("/api/leads/update", requireAdmin, async (req, res) => {
  try {
    const { id, status, admin_notes } = req.body ?? {};
    if (!id) return res.status(400).json({ error: "id required" });
    const lead = await updateLead(id, { status, admin_notes });
    return res.json({ lead });
  } catch (e) {
    console.error("[leads] update", e);
    return res.status(500).json({ error: e?.message ?? "Update failed." });
  }
});

app.post("/api/leads/delete", requireAdmin, async (req, res) => {
  try {
    const { id } = req.body ?? {};
    if (!id) return res.status(400).json({ error: "id required" });
    await deleteLead(id);
    return res.json({ ok: true });
  } catch (e) {
    console.error("[leads] delete", e);
    return res.status(500).json({ error: e?.message ?? "Delete failed." });
  }
});

app.get("/health", (_req, res) => {
  res.json({
    ok: true,
    service: "zentroverse-api",
    leads: true,
    cms: true,
    cloudinary: isCloudinaryConfigured(),
  });
});

// --- CMS (public read, admin write) ---
app.get("/api/cms", async (_req, res) => {
  try {
    const cms = await readCms();
    return res.json({ cms });
  } catch (e) {
    console.error("[cms] read", e);
    return res.status(500).json({ error: e?.message ?? "Failed to load CMS." });
  }
});

app.put("/api/cms", requireAdmin, async (req, res) => {
  try {
    const cms = await writeCms(req.body ?? {});
    return res.json({ ok: true, cms });
  } catch (e) {
    console.error("[cms] write", e);
    return res.status(500).json({ error: e?.message ?? "Failed to save CMS." });
  }
});

// --- Media upload (Cloudinary) ---
app.post("/api/media/upload", requireAdmin, async (req, res) => {
  try {
    const { file, folder, resourceType } = req.body ?? {};
    if (!file || typeof file !== "string") {
      return res.status(400).json({ error: "file (base64 data URI or URL) is required." });
    }
    const result = await uploadToCloudinary({
      file,
      folder: folder ?? process.env.CLOUDINARY_UPLOAD_FOLDER ?? "zentroverse",
      resourceType: resourceType ?? "auto",
    });
    return res.json({ ok: true, ...result });
  } catch (e) {
    console.error("[media] upload", e);
    return res.status(e?.message?.includes("not configured") ? 503 : 500).json({
      error: e?.message ?? "Upload failed.",
    });
  }
});

app.get("/api/media/status", requireAdmin, (_req, res) => {
  res.json({ configured: isCloudinaryConfigured() });
});

app.post("/api/razorpay/create-order", async (req, res) => {
  try {
    if (!rzp) {
      return res.status(503).json({ error: "Razorpay is not configured on the server." });
    }
    const planId = req.body?.planId;
    const email = typeof req.body?.email === "string" ? req.body.email : "";
    const amount = PLAN_AMOUNTS_PAISE[planId];
    if (amount == null || typeof amount !== "number") {
      return res.status(400).json({ error: "Invalid or unpaid plan." });
    }

    const receipt = `zr_${planId}_${Date.now()}`.slice(0, 40);
    const order = await rzp.orders.create({
      amount,
      currency: "INR",
      receipt,
      notes: {
        planId,
        email: email.slice(0, 120),
      },
    });

    return res.json({
      orderId: order.id,
      amount: order.amount,
      currency: order.currency,
      keyId,
    });
  } catch (e) {
    console.error("[razorpay] create-order", e);
    return res.status(500).json({ error: e?.message ?? "Failed to create order" });
  }
});

app.post("/api/razorpay/verify-payment", (req, res) => {
  try {
    if (!keySecret) {
      return res.status(503).json({ ok: false, error: "Server misconfiguration." });
    }
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body ?? {};
    if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
      return res.status(400).json({ ok: false, error: "Missing payment fields." });
    }
    const body = `${razorpay_order_id}|${razorpay_payment_id}`;
    const expected = crypto.createHmac("sha256", keySecret).update(body).digest("hex");
    const ok = expected === razorpay_signature;
    return res.json({ ok });
  } catch (e) {
    console.error("[razorpay] verify", e);
    return res.status(500).json({ ok: false, error: "Verification failed." });
  }
});

const PORT = Number(process.env.RAZORPAY_API_PORT ?? 8787);
app.listen(PORT, () => {
  console.log(`[razorpay-api] http://localhost:${PORT}`);
});
