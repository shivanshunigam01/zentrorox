import { zfFetch } from "./auth";

export type ZfLead = {
  id: string;
  tenant_id: string;
  name: string;
  mobile: string;
  email: string;
  city: string;
  current_stage: string;
  verification_status: string;
  qualification_status: string;
  lead_score: number;
  temperature: string;
  last_remark: string;
  next_followup_at: string | null;
  overdue: boolean;
  assigned_user_id: string | null;
  branch_id: string | null;
  interest: { product?: string; variant?: string; buyerType?: string; purchaseTimeline?: string };
  attribution: {
    source_channel: string;
    campaign_name?: string;
    campaign_id?: string;
    form_name?: string;
    utm_source?: string;
  };
  created_at: string;
  outcome?: { lost_reason?: string; sale_value?: number | null };
};

export type ZfTenant = {
  id: string;
  name: string;
  key: string;
  status: string;
  plan: string;
  timezone: string;
  entitlements: Record<string, boolean>;
  contact: { name?: string; email?: string; phone?: string };
  created_at: string;
};

export type ZfDashboard = {
  total: number;
  new_this_week: number;
  overdue_followups: number;
  followups_due: number;
  jobs_failed: number;
  by_stage: Record<string, number>;
  by_temperature: Record<string, number>;
  widgets: Array<{ key: string; label: string; count: number; filter: Record<string, unknown> }>;
};

export async function fetchPlatformOverview() {
  return zfFetch<{ tenants: number; leads: number; users: number; failed_jobs: number; recent_tenants: ZfTenant[] }>(
    "/api/zentroflow/platform/overview",
  );
}

export async function fetchTenants(q = "") {
  return zfFetch<{ items: ZfTenant[]; total: number }>(`/api/zentroflow/tenants?limit=50${q ? `&q=${encodeURIComponent(q)}` : ""}`);
}

export async function createTenant(body: Record<string, unknown>) {
  return zfFetch<{ tenant: ZfTenant; admin: unknown }>("/api/zentroflow/tenants", {
    method: "POST",
    body: JSON.stringify(body),
  });
}

export async function updateTenant(id: string, body: Record<string, unknown>) {
  return zfFetch<{ tenant: ZfTenant }>(`/api/zentroflow/tenants/${id}`, {
    method: "PATCH",
    body: JSON.stringify(body),
  });
}

export async function fetchDashboard(params: Record<string, string> = {}) {
  const qs = new URLSearchParams(params).toString();
  return zfFetch<ZfDashboard>(`/api/zentroflow/dashboard${qs ? `?${qs}` : ""}`);
}

export async function fetchLeads(params: Record<string, string> = {}) {
  const qs = new URLSearchParams(params).toString();
  return zfFetch<{ items: ZfLead[]; total: number; page: number; limit: number }>(
    `/api/zentroflow/leads${qs ? `?${qs}` : ""}`,
  );
}

export async function fetchLead(id: string) {
  return zfFetch<{
    lead: ZfLead;
    customer: unknown;
    timeline: Array<{ id: string; type: string; content: string; actor_label: string; created_at: string; channel: string }>;
    followups: Array<{ id: string; type: string; due_at: string; status: string; outcome: string; remark: string }>;
    assignments: unknown[];
  }>(`/api/zentroflow/leads/${id}`);
}

export async function ingestLead(body: Record<string, unknown>) {
  return zfFetch<{ lead: ZfLead; created: boolean }>("/api/zentroflow/v1/leads/ingest", {
    method: "POST",
    body: JSON.stringify(body),
  });
}

export async function changeStage(id: string, stage: string, reason?: string) {
  return zfFetch<{ lead: ZfLead }>(`/api/zentroflow/leads/${id}/stage`, {
    method: "POST",
    body: JSON.stringify({ stage, reason }),
  });
}

export async function addRemark(id: string, content: string) {
  return zfFetch(`/api/zentroflow/leads/${id}/remarks`, {
    method: "POST",
    body: JSON.stringify({ content }),
  });
}

export async function createFollowUp(id: string, body: Record<string, unknown>) {
  return zfFetch(`/api/zentroflow/leads/${id}/followups`, {
    method: "POST",
    body: JSON.stringify(body),
  });
}

export async function completeFollowUp(followUpId: string, body: Record<string, unknown>) {
  return zfFetch(`/api/zentroflow/followups/${followUpId}/complete`, {
    method: "POST",
    body: JSON.stringify(body),
  });
}

export async function assignLead(id: string, body: Record<string, unknown>) {
  return zfFetch(`/api/zentroflow/leads/${id}/assign`, {
    method: "POST",
    body: JSON.stringify(body),
  });
}

export async function verifyLead(id: string, body: Record<string, unknown>) {
  return zfFetch(`/api/zentroflow/leads/${id}/verify`, {
    method: "POST",
    body: JSON.stringify(body),
  });
}

export async function exportLeads(params: Record<string, string> = {}) {
  const qs = new URLSearchParams(params).toString();
  return zfFetch<{ items: ZfLead[]; count: number }>(`/api/zentroflow/leads/export${qs ? `?${qs}` : ""}`);
}

export async function fetchIntegrations() {
  return zfFetch<{ items: Array<Record<string, unknown>> }>("/api/zentroflow/integrations");
}

export async function upsertIntegration(body: Record<string, unknown>) {
  return zfFetch("/api/zentroflow/integrations", { method: "POST", body: JSON.stringify(body) });
}

export async function fetchJobs(params: Record<string, string> = {}) {
  const qs = new URLSearchParams(params).toString();
  return zfFetch<{ items: Array<Record<string, unknown>>; total: number }>(`/api/zentroflow/jobs${qs ? `?${qs}` : ""}`);
}

export async function retryJob(id: string) {
  return zfFetch(`/api/zentroflow/jobs/${id}/retry`, { method: "POST", body: "{}" });
}

export async function processJobs() {
  return zfFetch<{ processed: number }>("/api/zentroflow/jobs/process", { method: "POST", body: "{}" });
}

export async function fetchBranches() {
  return zfFetch<{ items: Array<{ id: string; name: string; branch_code: string }> }>("/api/zentroflow/branches");
}

export async function createBranch(body: Record<string, unknown>) {
  return zfFetch("/api/zentroflow/branches", { method: "POST", body: JSON.stringify(body) });
}

export async function fetchUsers() {
  return zfFetch<{ items: Array<{ id: string; name: string; email: string; role: string }> }>("/api/zentroflow/users");
}

export async function createUser(body: Record<string, unknown>) {
  return zfFetch("/api/zentroflow/users", { method: "POST", body: JSON.stringify(body) });
}

export async function fetchAutomations() {
  return zfFetch<{ items: Array<Record<string, unknown>> }>("/api/zentroflow/automations");
}

export async function upsertAutomation(body: Record<string, unknown>) {
  return zfFetch("/api/zentroflow/automations", { method: "POST", body: JSON.stringify(body) });
}

export async function fetchCapiEvents() {
  return zfFetch<{ items: Array<Record<string, unknown>> }>("/api/zentroflow/capi/events");
}

export async function fetchAudit() {
  return zfFetch<{ items: Array<Record<string, unknown>>; total: number }>("/api/zentroflow/audit?limit=50");
}

export const LEAD_STAGES = [
  "new", "valid", "invalid", "duplicate", "verification", "qualified", "nurture",
  "not_interested", "follow_up", "appointment", "test_drive", "quotation", "booking", "sale", "lost",
];
