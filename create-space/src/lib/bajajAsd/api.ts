import { apiUrl, API_ROUTES } from "@/config/api";
import type { BajajAsdApplication } from "./types";

export type BajajAsdApplicationPublic = BajajAsdApplication & {
  id: string;
  target_location_label?: string;
  lead_id?: string | null;
  status?: string;
  admin_notes?: string | null;
  submitted_at: string;
  created_at?: string;
  updated_at?: string;
};

export type BajajAsdApplyBody = Omit<
  BajajAsdApplication,
  "lead_score" | "consent_at" | "consent_policy_version"
>;

async function readError(res: Response): Promise<string> {
  try {
    const j = (await res.json()) as { error?: string };
    if (j.error) return j.error;
  } catch {
    /* ignore */
  }
  return res.statusText || "Request failed";
}

/** POST `/api/bajaj-asd/apply` — primary submission endpoint. */
export async function submitBajajAsdToApi(
  body: BajajAsdApplyBody,
): Promise<{ ok: true; application: BajajAsdApplicationPublic } | { ok: false; message: string }> {
  try {
    const res = await fetch(apiUrl(API_ROUTES.BAJAJ_ASD_APPLY), {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });

    const data = (await res.json().catch(() => ({}))) as {
      ok?: boolean;
      application?: BajajAsdApplicationPublic;
      error?: string;
    };

    if (!res.ok) {
      return { ok: false, message: data.error ?? (await readError(res)) };
    }

    if (!data.application) {
      return { ok: false, message: "Invalid server response." };
    }

    return { ok: true, application: data.application };
  } catch {
    return {
      ok: false,
      message: "Could not reach the server. Please try again later.",
    };
  }
}
