import fs from "node:fs/promises";
import path from "node:path";
import crypto from "node:crypto";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const DATA_DIR = path.join(__dirname, "data");
const FILE = path.join(DATA_DIR, "leads.json");

async function ensureFile() {
  await fs.mkdir(DATA_DIR, { recursive: true });
  try {
    await fs.access(FILE);
  } catch {
    await fs.writeFile(FILE, "[]", "utf8");
  }
}

export async function readLeads() {
  await ensureFile();
  const raw = await fs.readFile(FILE, "utf8");
  return JSON.parse(raw);
}

async function writeLeads(leads) {
  await fs.writeFile(FILE, JSON.stringify(leads, null, 2), "utf8");
}

export async function createLead(payload) {
  const leads = await readLeads();
  const now = new Date().toISOString();
  const lead = {
    id: crypto.randomUUID(),
    name: payload.name,
    phone: payload.phone,
    email: payload.email,
    city: payload.city ?? null,
    business_type: payload.business_type ?? null,
    product_interest: payload.product_interest ?? null,
    message: payload.message ?? null,
    source: payload.source ?? "website",
    form_type: payload.form_type ?? null,
    audit_type: payload.audit_type ?? null,
    calculator_type: payload.calculator_type ?? null,
    company_name: payload.company_name ?? null,
    tool_id: payload.tool_id ?? null,
    score: payload.score ?? null,
    report_summary: payload.report_summary ?? null,
    report_data: payload.report_data ?? null,
    status: "new",
    admin_notes: null,
    created_at: now,
    updated_at: now,
  };
  leads.unshift(lead);
  await writeLeads(leads);
  return lead;
}

export async function updateLead(id, patch) {
  const leads = await readLeads();
  const idx = leads.findIndex((l) => l.id === id);
  if (idx < 0) throw new Error("Lead not found");
  const allowed = ["status", "admin_notes"];
  for (const k of allowed) {
    if (k in patch) leads[idx][k] = patch[k];
  }
  leads[idx].updated_at = new Date().toISOString();
  await writeLeads(leads);
  return leads[idx];
}

export async function deleteLead(id) {
  const leads = await readLeads();
  const next = leads.filter((l) => l.id !== id);
  if (next.length === leads.length) throw new Error("Lead not found");
  await writeLeads(next);
}
