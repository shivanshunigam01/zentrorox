import { apiUrl } from "@/config/api";
import { adminHeaders } from "./auth";

export type AdminOverview = {
  modules: {
    leads: { total: number; by_status: Record<string, number>; by_form_type: Record<string, number> };
    bajaj_asd: { total: number };
    growth_hub: { total: number };
    pulsar: { total: number };
    customers: { total: number };
    invoices: { total: number; by_status: Record<string, number>; revenue_paid: number };
    cms: { updated_at: string | null; works: number; case_studies: number; testimonials: number; gallery: number };
  };
  generated_at: string;
};

export async function fetchAdminOverview(): Promise<AdminOverview> {
  const res = await fetch(apiUrl("/api/admin/overview"), { headers: adminHeaders() });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data.error || "Failed to load overview.");
  return data.overview as AdminOverview;
}
