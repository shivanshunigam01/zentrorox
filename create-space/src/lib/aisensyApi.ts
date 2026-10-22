import {
  AISENSY_BASE_URL,
  AISENSY_PARTNER_API_KEY,
  AISENSY_PARTNER_ID,
} from "@/config/aisensy";

const ensureCreds = () => {
  if (!AISENSY_PARTNER_ID || !AISENSY_PARTNER_API_KEY) {
    throw new Error(
      "AiSensy credentials missing. Set VITE_AISENSY_PARTNER_ID and VITE_AISENSY_PARTNER_API_KEY (or edit src/config/aisensy.ts).",
    );
  }
};

export type CreateBusinessInput = {
  display_name: string;
  email: string;
  company: string;
  contact: string; // digits, e.g. 919876543210
  timezone?: string;
  currency?: string;
  companySize?: string;
  password?: string;
};

export type CreateBusinessResult = {
  aisensy: any;
  generatedPassword?: string;
};

const randomPassword = () =>
  Array.from(crypto.getRandomValues(new Uint8Array(9)))
    .map((b) => "abcdefghijkmnpqrstuvwxyzABCDEFGHJKLMNPQRSTUVWXYZ23456789"[b % 56])
    .join("") + "!1";

export async function createAisensyBusiness(
  input: CreateBusinessInput,
): Promise<CreateBusinessResult> {
  ensureCreds();
  const password = input.password ?? randomPassword();
  const url = `${AISENSY_BASE_URL}/partner-apis/v1/partner/${AISENSY_PARTNER_ID}/business`;
  const res = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "X-AiSensy-Partner-API-Key": AISENSY_PARTNER_API_KEY,
    },
    body: JSON.stringify({
      display_name: input.display_name,
      email: input.email,
      password,
      company: input.company,
      contact: input.contact,
      timezone: input.timezone ?? "Asia/Calcutta GMT+05:30",
      currency: input.currency ?? "INR",
      companySize: input.companySize ?? "10 - 20",
    }),
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    throw new Error(
      data?.message || data?.error || `AiSensy create business failed (${res.status})`,
    );
  }
  return { aisensy: data, generatedPassword: password };
}

export async function getAisensyBusiness(businessId: string): Promise<any> {
  ensureCreds();
  const url = `${AISENSY_BASE_URL}/partner-apis/v1/partner/${AISENSY_PARTNER_ID}/business/${businessId}`;
  const res = await fetch(url, {
    headers: { "X-AiSensy-Partner-API-Key": AISENSY_PARTNER_API_KEY },
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    throw new Error(
      data?.message || data?.error || `AiSensy get business failed (${res.status})`,
    );
  }
  return data;
}

export type UpdateBusinessInput = {
  display_name?: string;
  company?: string;
  contact?: string;
};

export async function updateAisensyBusiness(
  businessId: string,
  patch: UpdateBusinessInput,
): Promise<any> {
  ensureCreds();
  const url = `${AISENSY_BASE_URL}/partner-apis/v1/partner/${AISENSY_PARTNER_ID}/business/${businessId}`;
  const res = await fetch(url, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
      "X-AiSensy-Partner-API-Key": AISENSY_PARTNER_API_KEY,
    },
    body: JSON.stringify(patch),
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    throw new Error(
      data?.message || data?.error || `AiSensy update business failed (${res.status})`,
    );
  }
  return data;
}
