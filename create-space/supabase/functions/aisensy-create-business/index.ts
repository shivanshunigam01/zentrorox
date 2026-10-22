import { corsHeaders } from "npm:@supabase/supabase-js@2/cors";

interface CreateBusinessBody {
  display_name: string;
  email: string;
  company: string;
  contact: string;
  timezone?: string;
  currency?: string;
  companySize?: string;
  password?: string;
}

function generatePassword(len = 14): string {
  const chars =
    "ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnpqrstuvwxyz23456789!@#$%";
  let out = "";
  const arr = new Uint32Array(len);
  crypto.getRandomValues(arr);
  for (let i = 0; i < len; i++) out += chars[arr[i] % chars.length];
  return out;
}

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

    const body = (await req.json().catch(() => null)) as CreateBusinessBody | null;
    if (!body) {
      return new Response(
        JSON.stringify({ error: "Invalid JSON body." }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } },
      );
    }

    const required: (keyof CreateBusinessBody)[] = ["display_name", "email", "company", "contact"];
    for (const f of required) {
      if (!body[f] || String(body[f]).trim().length === 0) {
        return new Response(
          JSON.stringify({ error: `Missing required field: ${f}` }),
          { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } },
        );
      }
    }

    const password = body.password && body.password.length >= 8 ? body.password : generatePassword();

    const payload = {
      display_name: body.display_name,
      email: body.email,
      company: body.company,
      contact: body.contact,
      timezone: body.timezone ?? "Asia/Calcutta GMT+05:30",
      currency: body.currency ?? "INR",
      companySize: body.companySize ?? "10 - 20",
      password,
    };

    const url = `https://apis.aisensy.com/partner-apis/v1/partner/${partnerId}/business`;

    const upstream = await fetch(url, {
      method: "POST",
      headers: {
        "Accept": "application/json",
        "Content-Type": "application/json",
        "X-AiSensy-Partner-API-Key": apiKey,
      },
      body: JSON.stringify(payload),
    });

    const text = await upstream.text();
    let parsed: unknown = text;
    try { parsed = JSON.parse(text); } catch { /* keep raw text */ }

    if (!upstream.ok) {
      console.error("AiSensy create business failed", upstream.status, parsed);
      return new Response(
        JSON.stringify({ error: "AiSensy API error", status: upstream.status, details: parsed }),
        { status: 502, headers: { ...corsHeaders, "Content-Type": "application/json" } },
      );
    }

    return new Response(
      JSON.stringify({ ok: true, aisensy: parsed, generatedPassword: body.password ? undefined : password }),
      { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } },
    );
  } catch (err) {
    console.error("aisensy-create-business error", err);
    return new Response(
      JSON.stringify({ error: err instanceof Error ? err.message : "Unknown error" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } },
    );
  }
});
