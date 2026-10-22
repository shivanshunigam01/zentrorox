import { submitBajajAsdToApi, type BajajAsdApplicationPublic } from "./api";
import { validateApplication, type BajajAsdApplication, type ValidationResult } from "./types";

const STORAGE_KEY = "zv_bajaj_asd_applications";

export type StoredApplication = BajajAsdApplicationPublic;

function loadStored(): StoredApplication[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as unknown;
    return Array.isArray(parsed) ? (parsed as StoredApplication[]) : [];
  } catch {
    return [];
  }
}

function saveStored(items: StoredApplication[]) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(items.slice(0, 50)));
}

export async function submitBajajAsdApplication(
  form: Omit<BajajAsdApplication, "lead_score" | "consent_at" | "consent_policy_version">,
): Promise<{ ok: true; application: StoredApplication } | { ok: false; message: string }> {
  const validation: ValidationResult = validateApplication(form);
  if (!validation.ok) return validation;

  const apiResult = await submitBajajAsdToApi({
    ...form,
    is_existing_business: form.is_existing_business,
    existing_oem: form.existing_oem,
    business_type:
      form.is_existing_business === "No" ? "New Entrepreneur" : form.business_type,
  });

  if (!apiResult.ok) {
    return { ok: false, message: apiResult.message };
  }

  const stored = apiResult.application;
  const items = loadStored();
  items.unshift(stored);
  saveStored(items);

  return { ok: true, application: stored };
}
