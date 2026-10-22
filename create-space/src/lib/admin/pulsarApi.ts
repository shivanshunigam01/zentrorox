import { apiUrl } from "@/config/api";
import { adminHeaders } from "@/lib/admin/auth";
import type { ReferralStatus, ReferralSubmission } from "@/lib/hyOffers/types";

const call = async (path: string, init: RequestInit = {}) => {
  const res = await fetch(apiUrl(path), {
    ...init,
    headers: { ...adminHeaders(), ...(init.headers ?? {}) },
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data.error || `Request failed (${res.status})`);
  return data;
};

export const fetchReferrals = async (): Promise<ReferralSubmission[]> => {
  const d = await call("/api/hy-offers/referrals");
  return d.referrals ?? [];
};

export const updateReferral = async (id: string, patch: { status?: ReferralStatus; admin_notes?: string }) => {
  const d = await call("/api/hy-offers/referrals/update", { method: "POST", body: JSON.stringify({ id, ...patch }) });
  return d.referral as ReferralSubmission;
};

export const importHyOfferCustomers = async (customers: unknown[], branch?: string) => {
  return call("/api/hy-offers/customers/import", { method: "POST", body: JSON.stringify({ customers, branch }) });
};
