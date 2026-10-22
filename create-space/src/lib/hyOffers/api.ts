import { apiUrl } from "@/config/api";
import type { ReferralSubmission } from "./types";

export type { ReferralSubmission };

export async function submitReferralApi(body: {
  referrerCode: string;
  referrerName: string;
  referrerMobile: string;
  friendName: string;
  friendMobile: string;
  friendEmail?: string;
  referrerOffer?: number;
  friendOffer?: number;
  branch?: string;
}): Promise<{ ok: true; submission: ReferralSubmission } | { ok: false; message: string }> {
  try {
    const res = await fetch(apiUrl("/api/hy-offers/referrals"), {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
    const data = await res.json().catch(() => ({}));
    if (!res.ok) return { ok: false, message: data.error ?? "Submission failed." };
    return { ok: true, submission: data.submission as ReferralSubmission };
  } catch {
    return { ok: false, message: "Could not reach the server." };
  }
}

export async function trackReferralClickApi(referrerCode: string): Promise<void> {
  try {
    await fetch(apiUrl("/api/hy-offers/track-click"), {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ referrerCode }),
    });
  } catch {
    /* non-blocking */
  }
}

export async function lookupReferralCustomerApi(code: string) {
  const res = await fetch(apiUrl(`/api/hy-offers/referrals/lookup/${encodeURIComponent(code)}`));
  if (!res.ok) return null;
  const data = await res.json();
  return data.customer as { customerName: string; mobileNo: string; referralCode: string; dealerName: string };
}
