// Frontend AiSensy test config.
// WARNING: these keys are bundled into the browser. Use ONLY for local testing.
// Move to a backend proxy before going live.

export const AISENSY_PARTNER_ID =
  import.meta.env.VITE_AISENSY_PARTNER_ID ?? "69b8117a181be5294874279c";

export const AISENSY_PARTNER_API_KEY =
  import.meta.env.VITE_AISENSY_PARTNER_API_KEY ??
  "d0d0e793f79c041f184c1_69b8117a181be5294874279c";

export const AISENSY_SHARED_SECRET =
  import.meta.env.VITE_AISENSY_SHARED_SECRET ?? "f7f3fc3d6e91e3c9ffdb4";

export const AISENSY_PARTNER_PLAN_FAMILY_ID =
  import.meta.env.VITE_AISENSY_PARTNER_PLAN_FAMILY_ID ?? "69b8117a181be529487427a6";

export const AISENSY_PLAN_FAMILY_ID =
  import.meta.env.VITE_AISENSY_PLAN_FAMILY_ID ?? "69b8117a181be529487427a0";

export const AISENSY_BASE_URL = "https://apis.aisensy.com";
