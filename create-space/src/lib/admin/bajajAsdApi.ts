import { apiUrl, API_ROUTES } from "@/config/api";
import { adminHeaders } from "./auth";
import type { LeadStatus } from "./leadsApi";

export type BajajAsdApplicationRecord = {
  id: string;
  state: string;
  districts: string[];
  locations: string[];
  target_location: string;
  target_location_label: string;
  district: string;
  applicant_name: string;
  mobile: string;
  alternate_mobile: string;
  email: string;
  current_town: string;
  pan: string;
  gst_number: string;
  is_existing_business: string;
  business_name: string;
  business_type: string;
  other_business_type: string;
  years_in_business: string;
  existing_oem: string;
  oem_brand: string;
  investment_capacity: string;
  space_status: string;
  showroom_space: string;
  workshop_space: string;
  space_size: string;
  frontage: string;
  start_timeline: string;
  applicant_remarks: string;
  contact_consent: boolean;
  disclaimer_ack: boolean;
  consent_policy_version: string;
  consent_at: string;
  lead_score: number;
  lead_id: string | null;
  status: LeadStatus;
  admin_notes: string | null;
  submitted_at: string;
  created_at: string;
  updated_at: string;
};

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
      "Cannot reach the Bajaj ASD API. Run npm run dev:all (Vite + Node on port 8787) or set VITE_API_BASE_URL.",
    );
  }
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data.error || `Request failed (${res.status})`);
  return data;
};

export const fetchBajajAsdApplications = async (): Promise<BajajAsdApplicationRecord[]> => {
  const d = await call(API_ROUTES.BAJAJ_ASD_APPLICATIONS);
  return d.applications ?? [];
};

export const updateBajajAsdApplication = async (
  id: string,
  patch: Partial<Pick<BajajAsdApplicationRecord, "status" | "admin_notes">>,
) => {
  const d = await call(API_ROUTES.BAJAJ_ASD_UPDATE, {
    method: "POST",
    body: JSON.stringify({ id, ...patch }),
  });
  return d.application as BajajAsdApplicationRecord;
};
