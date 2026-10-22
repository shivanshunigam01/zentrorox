import { apiUrl } from "@/config/api";
import { getSupabase, type LeadInsert } from "@/integrations/supabase/client";

export async function submitLead(payload: LeadInsert): Promise<{ ok: true } | { ok: false; message: string }> {
  // Primary: Node.js API (local file store — works without Supabase)
  try {
    const res = await fetch(apiUrl("/api/leads"), {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    const data = await res.json().catch(() => ({}));
    if (res.ok) return { ok: true };
    if (res.status !== 404 && res.status !== 503) {
      return { ok: false, message: data.error ?? "Could not submit enquiry." };
    }
  } catch {
    // API not running — try Supabase fallback below
  }

  // Fallback: Supabase direct insert (when configured)
  const supabase = getSupabase();
  if (!supabase) {
    console.info("[lead] No API or Supabase — logged locally:", payload);
    return { ok: false, message: "Lead service unavailable. Please call us or email digital@zentroverse.com." };
  }

  const { error } = await supabase.from("leads").insert({
    name: payload.name,
    phone: payload.phone,
    email: payload.email,
    city: payload.city ?? null,
    business_type: payload.business_type ?? null,
    product_interest: payload.product_interest ?? null,
    message: payload.message ?? null,
    source: payload.source ?? "website",
  });

  if (error) return { ok: false, message: error.message };
  return { ok: true };
}
