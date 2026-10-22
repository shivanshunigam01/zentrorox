import { apiUrl } from "@/config/api";
import { adminHeaders } from "./auth";

export type LeadStatus = "new" | "contacted" | "qualified" | "won" | "lost";

export interface Lead {
  id: string;
  name: string;
  phone: string;
  email: string;
  city: string | null;
  business_type: string | null;
  product_interest: string | null;
  message: string | null;
  form_type: string | null;
  audit_type: string | null;
  calculator_type: string | null;
  company_name: string | null;
  tool_id: string | null;
  score: number | null;
  report_summary: string | null;
  report_data: string | null;
  source: string | null;
  status: LeadStatus;
  admin_notes: string | null;
  created_at: string;
  updated_at: string;
}

const headers = () => adminHeaders();

const call = async (path: string, init: RequestInit = {}) => {
  let res: Response;
  try {
    res = await fetch(apiUrl(path), {
      ...init,
      headers: { ...headers(), ...(init.headers ?? {}) },
    });
  } catch {
    throw new Error(
      "Cannot reach the leads API. Run npm run dev:all (Vite + Node on port 8787) or set VITE_API_BASE_URL to your deployed API.",
    );
  }
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data.error || `Request failed (${res.status})`);
  return data;
};

export const fetchLeads = async (): Promise<Lead[]> => {
  const d = await call("/api/leads");
  return d.leads ?? [];
};

export const updateLead = async (id: string, patch: Partial<Pick<Lead, "status" | "admin_notes">>) => {
  const d = await call("/api/leads/update", { method: "POST", body: JSON.stringify({ id, ...patch }) });
  return d.lead as Lead;
};

export const deleteLead = async (id: string) => {
  await call("/api/leads/delete", { method: "POST", body: JSON.stringify({ id }) });
};
