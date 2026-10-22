import { DEMO_REFERRAL_CUSTOMERS } from "./demoSeed";
import { branchFromReferralCode, parseBranchCode, type BranchCode } from "./branches";
import { BRANCH_SHEET_SOURCES } from "./branchSheets";
import type { BulkCampaignMeta, HyOfferCustomer, ReferralSubmission } from "./types";

const CUSTOMERS_KEY = "zv_hy_offers_customers";
const SUBMISSIONS_KEY = "zv_hy_offers_submissions";
const CAMPAIGN_KEY = "zv_hy_offers_campaign";

const REFERRER_OFFER = 500;
const FRIEND_OFFER = 500;

/** In-memory mirror so large 3-branch lists work even if localStorage quota is exceeded. */
let memoryCustomers: HyOfferCustomer[] | null = null;
const bundledByBranch = new Map<BranchCode, HyOfferCustomer[]>();

function uid(prefix: string) {
  return `${prefix}_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 8)}`;
}

function readJson<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return fallback;
    return JSON.parse(raw) as T;
  } catch {
    return fallback;
  }
}

function writeJson(key: string, value: unknown) {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    if (/quota|exceeded/i.test(message)) {
      throw new Error("Browser storage quota exceeded while saving HY Offers list.");
    }
    throw err;
  }
}

export function getCustomers(): HyOfferCustomer[] {
  if (memoryCustomers) return memoryCustomers;
  const stored = readJson<HyOfferCustomer[]>(CUSTOMERS_KEY, []);
  if (stored.length) memoryCustomers = stored;
  return stored;
}

export function setCustomers(customers: HyOfferCustomer[]) {
  memoryCustomers = customers;
  try {
    writeJson(CUSTOMERS_KEY, customers);
  } catch {
    // Keep the full list in memory for this session; landing lookups can use bundled sheets.
    try {
      localStorage.removeItem(CUSTOMERS_KEY);
    } catch {
      /* ignore */
    }
  }
}

export function clearCustomers() {
  memoryCustomers = null;
  localStorage.removeItem(CUSTOMERS_KEY);
  localStorage.removeItem(CAMPAIGN_KEY);
}

async function loadBundledBranch(branch: BranchCode): Promise<HyOfferCustomer[]> {
  const cached = bundledByBranch.get(branch);
  if (cached) return cached;
  const src = BRANCH_SHEET_SOURCES.find((s) => s.branch === branch);
  if (!src) return [];
  const res = await fetch(src.jsonUrl);
  if (!res.ok) return [];
  const rows = (await res.json()) as HyOfferCustomer[];
  if (!Array.isArray(rows)) return [];
  bundledByBranch.set(branch, rows);
  return rows;
}

/** Resolve a referral code from memory, localStorage, demo seed, or bundled branch sheets. */
export async function resolveCustomerByCode(code: string): Promise<HyOfferCustomer | undefined> {
  const normalized = code.trim().toUpperCase();
  if (!normalized) return undefined;

  const fromStore = ensureCustomerInStore(normalized);
  if (fromStore) return fromStore;

  const branch = branchFromReferralCode(normalized);
  if (!branch) return undefined;

  const rows = await loadBundledBranch(branch);
  const found = rows.find((c) => c.referralCode.toUpperCase() === normalized);
  if (!found) return undefined;

  const list = getCustomers();
  const next = [...list, { ...found }];
  setCustomers(next);
  return found;
}

/** Ensures demo referral codes resolve even before Excel import (for shareable /r links). */
export function ensureCustomerInStore(code: string): HyOfferCustomer | undefined {
  const normalized = code.trim().toUpperCase();
  if (!normalized) return undefined;

  const list = getCustomers();
  const existing = list.find((c) => c.referralCode.toUpperCase() === normalized);
  if (existing) return existing;

  const demo = DEMO_REFERRAL_CUSTOMERS.find((c) => c.referralCode.toUpperCase() === normalized);
  if (!demo) return undefined;

  setCustomers([...list, { ...demo }]);
  return demo;
}

export function getCustomerByCode(code: string): HyOfferCustomer | undefined {
  return ensureCustomerInStore(code);
}

export function updateCustomer(
  referralCode: string,
  patch: Partial<HyOfferCustomer>,
): HyOfferCustomer | undefined {
  const list = getCustomers();
  const idx = list.findIndex((c) => c.referralCode.toUpperCase() === referralCode.trim().toUpperCase());
  if (idx < 0) return undefined;
  list[idx] = { ...list[idx], ...patch };
  setCustomers(list);
  return list[idx];
}

export function markLinkClicked(referralCode: string) {
  const existing = getCustomerByCode(referralCode);
  if (!existing) return;
  if (existing.linkClicked) return;
  updateCustomer(referralCode, {
    linkClicked: true,
    clickedAt: new Date().toISOString(),
  });
}

export function getSubmissions(): ReferralSubmission[] {
  return readJson<ReferralSubmission[]>(SUBMISSIONS_KEY, []);
}

export function getSubmissionsForCode(referralCode: string): ReferralSubmission[] {
  const code = referralCode.trim().toUpperCase();
  return getSubmissions().filter((s) => s.referrerCode.toUpperCase() === code);
}

export function addReferralSubmission(input: {
  referrerCode: string;
  referrerName: string;
  referrerMobile: string;
  friendName: string;
  friendMobile: string;
  friendEmail?: string;
}): ReferralSubmission {
  const submission: ReferralSubmission = {
    id: uid("sub"),
    referrerCode: input.referrerCode,
    referrerName: input.referrerName,
    referrerMobile: input.referrerMobile,
    friendName: input.friendName.trim(),
    friendMobile: input.friendMobile.trim(),
    friendEmail: input.friendEmail?.trim() || undefined,
    referrerOffer: REFERRER_OFFER,
    friendOffer: FRIEND_OFFER,
    createdAt: new Date().toISOString(),
  };

  const all = getSubmissions();
  all.unshift(submission);
  writeJson(SUBMISSIONS_KEY, all);

  updateCustomer(input.referrerCode, {
    formSubmitted: true,
    submittedAt: submission.createdAt,
    linkClicked: true,
    clickedAt: getCustomerByCode(input.referrerCode)?.clickedAt ?? submission.createdAt,
  });

  return submission;
}

export function getCampaignMeta(): BulkCampaignMeta {
  return readJson<BulkCampaignMeta>(CAMPAIGN_KEY, {
    total: 0,
    queued: 0,
    delivered: 0,
    failed: 0,
  });
}

export function setCampaignMeta(meta: BulkCampaignMeta) {
  writeJson(CAMPAIGN_KEY, meta);
}

export const OFFER_AMOUNTS = {
  referrer: REFERRER_OFFER,
  friend: FRIEND_OFFER,
} as const;

/** Normalize Excel / pasted links to `/pulsar/BR|TR|HY/CODE`. */
export function normalizeReferralLink(
  raw: string,
  referralCode: string,
  branchHint?: BranchCode | null,
): string {
  const code = referralCode.trim();
  const branch =
    branchHint ||
    branchFromReferralCode(code) ||
    (() => {
      try {
        const cleaned = raw.trim().replace(/^www\./i, "");
        const withProto = /^https?:\/\//i.test(cleaned) ? cleaned : `https://${cleaned}`;
        const url = new URL(withProto);
        const m = url.pathname.match(/\/pulsar\/(BR|TR|HY)\//i);
        return parseBranchCode(m?.[1]);
      } catch {
        return null;
      }
    })() ||
    "BR";

  if (!raw?.trim()) return `/pulsar/${branch}/${code}`;

  let cleaned = raw.trim().replace(/^www\./i, "");
  if (!/^https?:\/\//i.test(cleaned)) cleaned = `https://${cleaned}`;

  try {
    const url = new URL(cleaned);
    const withBranch = url.pathname.match(/\/(?:pulsar|r)\/(BR|TR|HY)\/([^/]+)/i);
    if (withBranch?.[1] && withBranch?.[2]) {
      return `/pulsar/${withBranch[1].toUpperCase()}/${withBranch[2]}`;
    }
    const legacy = url.pathname.match(/\/(?:pulsar|r)\/([^/]+)/i);
    if (legacy?.[1]) {
      const extracted = legacy[1];
      const b = branchFromReferralCode(extracted) || branch;
      return `/pulsar/${b}/${extracted}`;
    }
  } catch {
    /* fall through */
  }

  return `/pulsar/${branch}/${code}`;
}

export function publicReferralPath(referralCode: string, branch?: BranchCode | null): string {
  const b = branch || branchFromReferralCode(referralCode) || "BR";
  return `/pulsar/${b}/${referralCode.trim()}`;
}
