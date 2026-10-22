import { apiUrl } from "@/config/api";
import type { LeadInsert } from "@/integrations/supabase/client";
import type { ToolResult } from "./engine";

export type GrowthLeadPayload = LeadInsert & {
  tool_id: string;
  score?: number;
  report_summary?: string;
  report_data?: ToolResult;
};

export async function submitGrowthLead(payload: GrowthLeadPayload) {
  const body = {
    ...payload,
    form_type: payload.form_type ?? "growth-tool",
    message: payload.message ?? payload.report_summary ?? null,
    report_data: payload.report_data ? JSON.stringify(payload.report_data) : null,
  };

  try {
    const res = await fetch(apiUrl("/api/leads"), {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
    const data = await res.json().catch(() => ({}));
    if (res.ok) return { ok: true as const };
    return { ok: false as const, message: data.error ?? "Could not submit." };
  } catch {
    return { ok: false as const, message: "Lead service unavailable. Run npm run dev:all or deploy the API." };
  }
}
