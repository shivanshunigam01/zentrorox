// Admin-only leads API. Gated by a shared admin token sent in x-admin-token header.
// Uses the service role to bypass RLS so the hardcoded admin login still works.
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, x-admin-token",
  "Access-Control-Allow-Methods": "GET, POST, PATCH, DELETE, OPTIONS",
};

const ADMIN_TOKEN = Deno.env.get("ADMIN_PANEL_TOKEN") ?? "ZV-ADMIN-2026-DEMO";

const supabase = createClient(
  Deno.env.get("SUPABASE_URL")!,
  Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!,
);

const json = (data: unknown, status = 200) =>
  new Response(JSON.stringify(data), {
    status,
    headers: { ...corsHeaders, "Content-Type": "application/json" },
  });

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });

  if (req.headers.get("x-admin-token") !== ADMIN_TOKEN) {
    return json({ error: "Unauthorized" }, 401);
  }

  try {
    const url = new URL(req.url);
    const action = url.searchParams.get("action") ?? "list";

    if (req.method === "GET" || action === "list") {
      const { data, error } = await supabase
        .from("leads")
        .select("*")
        .order("created_at", { ascending: false });
      if (error) throw error;
      return json({ leads: data ?? [] });
    }

    const body = await req.json().catch(() => ({}));

    if (action === "update") {
      const { id, ...patch } = body as { id: string;[k: string]: unknown };
      if (!id) return json({ error: "id required" }, 400);
      const allowed = ["status", "admin_notes"] as const;
      const update: Record<string, unknown> = {};
      for (const k of allowed) if (k in patch) update[k] = patch[k];
      const { data, error } = await supabase.from("leads").update(update).eq("id", id).select().single();
      if (error) throw error;
      return json({ lead: data });
    }

    if (action === "delete") {
      const { id } = body as { id: string };
      if (!id) return json({ error: "id required" }, 400);
      const { error } = await supabase.from("leads").delete().eq("id", id);
      if (error) throw error;
      return json({ ok: true });
    }

    return json({ error: "Unknown action" }, 400);
  } catch (e) {
    console.error("[admin-leads]", e);
    return json({ error: (e as Error).message }, 500);
  }
});
