import { corsHeaders } from "npm:@supabase/supabase-js@2/cors";

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const partnerId = Deno.env.get("AISENSY_PARTNER_ID");
    const apiKey = Deno.env.get("AISENSY_PARTNER_API_KEY");

    if (!partnerId || !apiKey) {
      return new Response(
        JSON.stringify({ error: "AiSensy partner credentials are not configured." }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } },
      );
    }

    const url = new URL(req.url);
    let businessId = url.searchParams.get("business_id");

    if (!businessId && (req.method === "POST" || req.method === "PUT")) {
      const body = await req.json().catch(() => null) as { business_id?: string } | null;
      businessId = body?.business_id ?? null;
    }

    if (!businessId || !/^[a-zA-Z0-9_-]{6,64}$/.test(businessId)) {
      return new Response(
        JSON.stringify({ error: "Missing or invalid business_id." }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } },
      );
    }

    const upstreamUrl = `https://apis.aisensy.com/partner-apis/v1/partner/${partnerId}/business/${businessId}`;

    const upstream = await fetch(upstreamUrl, {
      method: "GET",
      headers: {
        "Accept": "application/json",
        "X-AiSensy-Partner-API-Key": apiKey,
      },
    });

    const text = await upstream.text();
    let parsed: unknown = text;
    try { parsed = JSON.parse(text); } catch { /* keep raw */ }

    if (!upstream.ok) {
      console.error("AiSensy get business failed", upstream.status, parsed);
      return new Response(
        JSON.stringify({ error: "AiSensy API error", status: upstream.status, details: parsed }),
        { status: upstream.status === 404 ? 404 : 502, headers: { ...corsHeaders, "Content-Type": "application/json" } },
      );
    }

    return new Response(
      JSON.stringify({ ok: true, business: parsed }),
      { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } },
    );
  } catch (err) {
    console.error("aisensy-get-business error", err);
    return new Response(
      JSON.stringify({ error: err instanceof Error ? err.message : "Unknown error" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } },
    );
  }
});
