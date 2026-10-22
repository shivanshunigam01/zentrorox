import { createClient, type SupabaseClient } from "@supabase/supabase-js";
import type { Database } from "./types";

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL as string | undefined;
const SUPABASE_PUBLISHABLE_KEY = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY as string | undefined;

export const isSupabaseConfigured = Boolean(SUPABASE_URL && SUPABASE_PUBLISHABLE_KEY);

let client: SupabaseClient<Database> | null = null;

/** Lazy Supabase client — returns null when env vars are not set (avoids startup crash). */
export function getSupabase(): SupabaseClient<Database> | null {
  if (!isSupabaseConfigured) return null;
  if (!client) {
    client = createClient<Database>(SUPABASE_URL!, SUPABASE_PUBLISHABLE_KEY!, {
      auth: {
        storage: localStorage,
        persistSession: true,
        autoRefreshToken: true,
      },
    });
  }
  return client;
}

export type LeadInsert = {
  name: string;
  phone: string;
  email: string;
  city?: string | null;
  business_type?: string | null;
  product_interest?: string | null;
  message?: string | null;
  source?: string;
  form_type?: string | null;
  audit_type?: string | null;
  calculator_type?: string | null;
  company_name?: string | null;
  tool_id?: string | null;
  score?: number | null;
  report_summary?: string | null;
  report_data?: string | null;
};

// Re-export submitLead from shared module
export { submitLead } from "@/lib/leadsApi";
