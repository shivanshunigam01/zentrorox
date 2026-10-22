import { apiUrl } from "@/config/api";
import { adminHeaders } from "@/lib/admin/auth";
import {
  DEFAULT_PRICING_CATALOG,
  normalizePlan,
  serializePlan,
  trialFromPlans,
  type FreeTrialOffer,
  type PricingCatalog,
  type PricingPlan,
} from "@/data/pricingPlans";

const CACHE_KEY = "zv_plans_cache";

export const PLANS_UPDATED_EVENT = "zv-plans-updated";

function notifyPlansUpdated() {
  window.dispatchEvent(new Event(PLANS_UPDATED_EVENT));
}

export function publishPlansLocally(catalog: PricingCatalog) {
  writePlansCache(catalog);
  notifyPlansUpdated();
}

export function readPlansCache(): PricingCatalog | null {
  try {
    const raw = localStorage.getItem(CACHE_KEY);
    if (!raw) return null;
    const data = JSON.parse(raw) as Partial<PricingCatalog> & { plans?: unknown[] };
    if (!data || !Array.isArray(data.plans)) return null;
    return normalizeCatalog(data);
  } catch {
    return null;
  }
}

export function writePlansCache(catalog: PricingCatalog) {
  try {
    localStorage.setItem(CACHE_KEY, JSON.stringify(catalog));
  } catch {
    /* ignore quota */
  }
}

export type PlansApiFail = { ok: false; error: string; status?: number; authExpired?: boolean };

function failFromResponse(res: Response, data: { error?: string }, fallback: string): PlansApiFail {
  const error = data.error ?? fallback;
  const authExpired = res.status === 401 || /invalid or expired token/i.test(error);
  return {
    ok: false,
    error: authExpired ? "Your admin session expired. Please sign in again." : error,
    status: res.status,
    authExpired,
  };
}

function normalizeCatalog(raw: Record<string, unknown> | Partial<PricingCatalog> | null | undefined): PricingCatalog {
  const source = (raw && typeof raw === "object" ? raw : {}) as {
    trial?: FreeTrialOffer;
    plans?: unknown[];
    catalog?: { trial?: FreeTrialOffer; plans?: unknown[]; updatedAt?: string | null };
    updatedAt?: string | null;
  };
  const inner = source.catalog ?? source;
  const plans = Array.isArray(inner.plans) ? inner.plans.map((p) => normalizePlan(p as PricingPlan)) : [];
  const trial = inner.trial ?? (plans.length ? trialFromPlans(plans) : DEFAULT_PRICING_CATALOG.trial);
  return {
    trial,
    plans: plans.length ? plans : DEFAULT_PRICING_CATALOG.plans,
    updatedAt: inner.updatedAt ?? source.updatedAt ?? null,
  };
}

export async function fetchPricingCatalog(): Promise<PricingCatalog> {
  try {
    const res = await fetch(apiUrl("/api/plans"));
    if (!res.ok) {
      return readPlansCache() ?? DEFAULT_PRICING_CATALOG;
    }
    const data = (await res.json()) as Record<string, unknown>;
    const catalog = normalizeCatalog(data);
    writePlansCache(catalog);
    return catalog;
  } catch {
    return readPlansCache() ?? DEFAULT_PRICING_CATALOG;
  }
}

export async function savePricingCatalog(
  catalog: PricingCatalog,
): Promise<{ ok: true; catalog: PricingCatalog } | PlansApiFail> {
  try {
    const res = await fetch(apiUrl("/api/plans/catalog"), {
      method: "PUT",
      headers: adminHeaders(),
      body: JSON.stringify({
        trial: catalog.trial,
        plans: catalog.plans.map(serializePlan),
      }),
    });
    const data = (await res.json().catch(() => ({}))) as { catalog?: PricingCatalog; error?: string };
    if (!res.ok) return failFromResponse(res, data, "Failed to save plans.");
    const next = normalizeCatalog(data.catalog ?? catalog);
    writePlansCache(next);
    notifyPlansUpdated();
    return { ok: true, catalog: next };
  } catch {
    return { ok: false, error: "Could not reach the API server." };
  }
}

export async function createPricingPlan(
  plan: PricingPlan,
): Promise<{ ok: true; plan: PricingPlan } | PlansApiFail> {
  try {
    const res = await fetch(apiUrl("/api/plans"), {
      method: "POST",
      headers: adminHeaders(),
      body: JSON.stringify(serializePlan(plan)),
    });
    const data = (await res.json().catch(() => ({}))) as { plan?: PricingPlan; error?: string };
    if (!res.ok) return failFromResponse(res, data, "Failed to create plan.");
    notifyPlansUpdated();
    return { ok: true, plan: normalizePlan((data.plan ?? plan) as PricingPlan) };
  } catch {
    return { ok: false, error: "Could not reach the API server." };
  }
}

export async function updatePricingPlan(
  id: string,
  plan: PricingPlan,
): Promise<{ ok: true; plan: PricingPlan } | PlansApiFail> {
  try {
    const res = await fetch(apiUrl(`/api/plans/${encodeURIComponent(id)}`), {
      method: "PUT",
      headers: adminHeaders(),
      body: JSON.stringify(serializePlan(plan)),
    });
    const data = (await res.json().catch(() => ({}))) as { plan?: PricingPlan; error?: string };
    if (!res.ok) return failFromResponse(res, data, "Failed to update plan.");
    notifyPlansUpdated();
    return { ok: true, plan: normalizePlan((data.plan ?? plan) as PricingPlan) };
  } catch {
    return { ok: false, error: "Could not reach the API server." };
  }
}

export async function deletePricingPlan(id: string): Promise<{ ok: true } | PlansApiFail> {
  try {
    const res = await fetch(apiUrl(`/api/plans/${encodeURIComponent(id)}`), {
      method: "DELETE",
      headers: adminHeaders(),
    });
    const data = (await res.json().catch(() => ({}))) as { error?: string };
    if (!res.ok) return failFromResponse(res, data, "Failed to delete plan.");
    notifyPlansUpdated();
    return { ok: true };
  } catch {
    return { ok: false, error: "Could not reach the API server." };
  }
}

export async function saveFreeTrial(
  trial: FreeTrialOffer,
): Promise<{ ok: true; trial: FreeTrialOffer } | PlansApiFail> {
  try {
    const res = await fetch(apiUrl("/api/plans/trial"), {
      method: "PUT",
      headers: adminHeaders(),
      body: JSON.stringify(trial),
    });
    const data = (await res.json().catch(() => ({}))) as { trial?: FreeTrialOffer; error?: string };
    if (!res.ok) return failFromResponse(res, data, "Failed to save free trial.");
    notifyPlansUpdated();
    return { ok: true, trial: data.trial ?? trial };
  } catch {
    return { ok: false, error: "Could not reach the API server." };
  }
}

export async function startFreeTrial(email: string, planSlug?: string): Promise<{ ok: true } | { ok: false; error: string }> {
  try {
    const res = await fetch(apiUrl("/api/plans/trial/start"), {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, planSlug: planSlug ?? "basic-monthly" }),
    });
    const data = (await res.json().catch(() => ({}))) as { error?: string };
    if (!res.ok) return { ok: false, error: data.error ?? "Could not start free trial." };
    return { ok: true };
  } catch {
    return { ok: false, error: "Could not reach the API server." };
  }
}
