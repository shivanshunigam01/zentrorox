import {
  AUTOMOTIVE_BUSINESS_TYPES,
  CONSENT_POLICY_VERSION,
  validateLocationSelection,
} from "./masters";

export type YesNo = "Yes" | "No";

export type BajajAsdApplication = {
  state: string;
  districts: string[];
  locations: string[];
  applicant_name: string;
  mobile: string;
  alternate_mobile: string;
  email: string;
  current_town: string;
  pan: string;
  gst_number: string;
  is_existing_business: YesNo;
  business_name: string;
  business_type: string;
  other_business_type: string;
  years_in_business: string;
  existing_oem: YesNo;
  oem_brand: string;
  investment_capacity: string;
  space_status: string;
  showroom_space: string;
  workshop_space: string;
  frontage: string;
  start_timeline: string;
  applicant_remarks: string;
  contact_consent: boolean;
  disclaimer_ack: boolean;
  consent_policy_version: string;
  consent_at: string;
  lead_score: number;
};

export function computeLeadScore(form: Pick<
  BajajAsdApplication,
  | "business_type"
  | "years_in_business"
  | "investment_capacity"
  | "space_status"
  | "showroom_space"
  | "workshop_space"
  | "frontage"
  | "start_timeline"
>): number {
  let score = 0;

  if (AUTOMOTIVE_BUSINESS_TYPES.has(form.business_type)) score += 15;
  else if (form.business_type && form.business_type !== "New Entrepreneur") score += 8;

  const yearsScore: Record<string, number> = {
    "Less than 1 year": 4,
    "1–3 years": 6,
    "3–5 years": 8,
    "5–10 years": 10,
    "More than 10 years": 10,
  };
  if (form.years_in_business) score += yearsScore[form.years_in_business] ?? 0;

  const investScore: Record<string, number> = {
    "Below ₹5 Lakh": 8,
    "₹5–10 Lakh": 12,
    "₹10–15 Lakh": 18,
    "₹15–25 Lakh": 22,
    "Above ₹25 Lakh": 25,
  };
  if (form.investment_capacity) score += investScore[form.investment_capacity] ?? 0;

  const spaceScore: Record<string, number> = {
    "Own space available": 20,
    "Rented space available": 16,
    "Can arrange suitable space": 12,
    "Currently not available": 4,
  };
  if (form.space_status) score += spaceScore[form.space_status] ?? 0;

  if (form.showroom_space && form.showroom_space !== "Not sure") score += 3;
  if (form.workshop_space && form.workshop_space !== "Not sure") score += 3;
  if (form.frontage && form.frontage !== "Not sure") score += 4;

  const timelineScore: Record<string, number> = {
    Immediately: 20,
    "Within 1 Month": 16,
    "1–3 Months": 12,
    "3–6 Months": 8,
    "More than 6 Months": 4,
  };
  if (form.start_timeline) score += timelineScore[form.start_timeline] ?? 0;

  return score;
}

export function normalizeMobile(raw: string): string {
  return raw.replace(/\D/g, "").slice(-10);
}

export function isValidMobile(raw: string): boolean {
  const m = normalizeMobile(raw);
  return /^[6-9]\d{9}$/.test(m);
}

export function isValidEmail(raw: string): boolean {
  if (!raw.trim()) return true;
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(raw.trim());
}

export function normalizePan(raw: string): string {
  return raw.replace(/\s/g, "").toUpperCase();
}

export function normalizeGst(raw: string): string {
  return raw.replace(/\s/g, "").toUpperCase();
}

export function isValidPan(raw: string): boolean {
  if (!raw.trim()) return true;
  return /^[A-Z]{5}[0-9]{4}[A-Z]$/.test(normalizePan(raw));
}

export function isValidGst(raw: string): boolean {
  if (!raw.trim()) return true;
  return /^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z][1-9A-Z]Z[0-9A-Z]$/.test(normalizeGst(raw));
}

export type ValidationResult = { ok: true } | { ok: false; message: string };

/** In-progress form (radio fields may be unset). */
export type FormDraft = Omit<
  BajajAsdApplication,
  "lead_score" | "consent_at" | "consent_policy_version" | "is_existing_business" | "existing_oem"
> & {
  is_existing_business: YesNo | "";
  existing_oem: YesNo | "";
};

export const FORM_STEP_COUNT = 6;

export const FORM_STEP_LABELS = [
  "Location",
  "Your details",
  "Business",
  "Investment",
  "Readiness",
  "Consent",
] as const;

/** Validate a single wizard step before advancing. */
export function validateStep(step: number, form: FormDraft): ValidationResult {
  switch (step) {
    case 0: {
      return validateLocationSelection(form.state, form.districts, form.locations);
    }
    case 1: {
      const name = form.applicant_name.trim();
      if (name.length < 2 || name.length > 80) {
        return { ok: false, message: "Applicant name must be 2–80 characters." };
      }
      if (!isValidMobile(form.mobile)) {
        return { ok: false, message: "Enter a valid 10-digit mobile number." };
      }
      if (form.alternate_mobile.trim()) {
        if (!isValidMobile(form.alternate_mobile)) {
          return { ok: false, message: "Alternate mobile number is not valid." };
        }
        if (normalizeMobile(form.alternate_mobile) === normalizeMobile(form.mobile)) {
          return { ok: false, message: "Alternate number must differ from primary mobile." };
        }
      }
      if (!isValidEmail(form.email)) {
        return { ok: false, message: "Enter a valid email address." };
      }
      const town = form.current_town.trim();
      if (town.length < 2 || town.length > 100) {
        return { ok: false, message: "Current town must be 2–100 characters." };
      }
      return { ok: true };
    }
    case 2: {
      if (!form.is_existing_business) {
        return { ok: false, message: "Please indicate whether you run a business today." };
      }
      const existing = form.is_existing_business === "Yes";
      if (existing) {
        const bn = form.business_name.trim();
        if (bn.length < 2 || bn.length > 120) {
          return { ok: false, message: "Business / firm name must be 2–120 characters." };
        }
        if (!form.years_in_business) {
          return { ok: false, message: "Select years in business." };
        }
      }
      if (!form.business_type) {
        return { ok: false, message: "Select a business type." };
      }
      if (form.business_type === "Other Existing Business") {
        const other = form.other_business_type.trim();
        if (other.length < 2 || other.length > 100) {
          return { ok: false, message: "Other business type must be 2–100 characters." };
        }
      }
      if (!form.existing_oem) {
        return { ok: false, message: "Please indicate OEM / EV brand association." };
      }
      if (form.existing_oem === "Yes") {
        const brand = form.oem_brand.trim();
        if (brand.length < 2 || brand.length > 100) {
          return { ok: false, message: "Brand name must be 2–100 characters." };
        }
      }
      if (!isValidPan(form.pan)) {
        return { ok: false, message: "Enter a valid PAN (e.g. ABCDE1234F)." };
      }
      if (!isValidGst(form.gst_number)) {
        return { ok: false, message: "Enter a valid 15-character GST number." };
      }
      return { ok: true };
    }
    case 3: {
      if (!form.investment_capacity) {
        return { ok: false, message: "Select investment capacity." };
      }
      if (!form.space_status) {
        return { ok: false, message: "Select commercial space availability." };
      }
      if (!form.showroom_space) {
        return { ok: false, message: "Select showroom space." };
      }
      if (!form.workshop_space) {
        return { ok: false, message: "Select workshop space." };
      }
      if (!form.frontage) {
        return { ok: false, message: "Select frontage." };
      }
      return { ok: true };
    }
    case 4: {
      if (!form.start_timeline) {
        return { ok: false, message: "Select when you can start." };
      }
      if (form.applicant_remarks.trim().length > 500) {
        return { ok: false, message: "Additional remarks must be at most 500 characters." };
      }
      return { ok: true };
    }
    case 5: {
      if (!form.contact_consent) {
        return { ok: false, message: "Contact consent is required." };
      }
      if (!form.disclaimer_ack) {
        return { ok: false, message: "Disclaimer acknowledgement is required." };
      }
      return { ok: true };
    }
    default:
      return { ok: true };
  }
}

export function validateApplication(
  form: Omit<BajajAsdApplication, "lead_score" | "consent_at" | "consent_policy_version">,
): ValidationResult {
  const locationCheck = validateLocationSelection(form.state, form.districts, form.locations);
  if (!locationCheck.ok) return locationCheck;

  const name = form.applicant_name.trim();
  if (name.length < 2 || name.length > 80) {
    return { ok: false, message: "Applicant name must be 2–80 characters." };
  }

  if (!isValidMobile(form.mobile)) {
    return { ok: false, message: "Enter a valid 10-digit mobile number." };
  }

  if (form.alternate_mobile.trim()) {
    if (!isValidMobile(form.alternate_mobile)) {
      return { ok: false, message: "Alternate mobile number is not valid." };
    }
    if (normalizeMobile(form.alternate_mobile) === normalizeMobile(form.mobile)) {
      return { ok: false, message: "Alternate number must differ from primary mobile." };
    }
  }

  if (!isValidEmail(form.email)) {
    return { ok: false, message: "Enter a valid email address." };
  }

  const town = form.current_town.trim();
  if (town.length < 2 || town.length > 100) {
    return { ok: false, message: "Current town must be 2–100 characters." };
  }

  if (!form.is_existing_business) {
    return { ok: false, message: "Please indicate whether you run a business today." };
  }

  const existing = form.is_existing_business === "Yes";

  if (existing) {
    const bn = form.business_name.trim();
    if (bn.length < 2 || bn.length > 120) {
      return { ok: false, message: "Business / firm name must be 2–120 characters." };
    }
    if (!form.years_in_business) {
      return { ok: false, message: "Select years in business." };
    }
  }

  if (!form.business_type) {
    return { ok: false, message: "Select a business type." };
  }

  if (form.business_type === "Other Existing Business") {
    const other = form.other_business_type.trim();
    if (other.length < 2 || other.length > 100) {
      return { ok: false, message: "Other business type must be 2–100 characters." };
    }
  }

  if (!form.existing_oem) {
    return { ok: false, message: "Please indicate OEM / EV brand association." };
  }

  if (form.existing_oem === "Yes") {
    const brand = form.oem_brand.trim();
    if (brand.length < 2 || brand.length > 100) {
      return { ok: false, message: "Brand name must be 2–100 characters." };
    }
  }

  if (!isValidPan(form.pan)) {
    return { ok: false, message: "Enter a valid PAN (e.g. ABCDE1234F)." };
  }
  if (!isValidGst(form.gst_number)) {
    return { ok: false, message: "Enter a valid 15-character GST number." };
  }

  if (!form.investment_capacity) {
    return { ok: false, message: "Select investment capacity." };
  }
  if (!form.space_status) {
    return { ok: false, message: "Select commercial space availability." };
  }
  if (!form.showroom_space) {
    return { ok: false, message: "Select showroom space." };
  }
  if (!form.workshop_space) {
    return { ok: false, message: "Select workshop space." };
  }
  if (!form.frontage) {
    return { ok: false, message: "Select frontage." };
  }
  if (!form.start_timeline) {
    return { ok: false, message: "Select when you can start." };
  }

  if (form.applicant_remarks.trim().length > 500) {
    return { ok: false, message: "Additional remarks must be at most 500 characters." };
  }

  if (!form.contact_consent) {
    return { ok: false, message: "Contact consent is required." };
  }
  if (!form.disclaimer_ack) {
    return { ok: false, message: "Disclaimer acknowledgement is required." };
  }

  return { ok: true };
}

export function buildApplicationPayload(
  form: Omit<BajajAsdApplication, "lead_score" | "consent_at" | "consent_policy_version">,
): BajajAsdApplication {
  const lead_score = computeLeadScore(form);
  return {
    ...form,
    applicant_name: form.applicant_name.trim(),
    mobile: normalizeMobile(form.mobile),
    alternate_mobile: form.alternate_mobile.trim() ? normalizeMobile(form.alternate_mobile) : "",
    email: form.email.trim(),
    current_town: form.current_town.trim(),
    pan: normalizePan(form.pan),
    gst_number: normalizeGst(form.gst_number),
    districts: [...form.districts],
    locations: [...form.locations],
    business_name: form.business_name.trim(),
    other_business_type: form.other_business_type.trim(),
    oem_brand: form.oem_brand.trim(),
    applicant_remarks: form.applicant_remarks.trim(),
    consent_policy_version: CONSENT_POLICY_VERSION,
    consent_at: new Date().toISOString(),
    lead_score,
  };
}
