/** Conversion & analytics tracking — wire IDs via .env (VITE_GA4_ID, VITE_GTM_ID, VITE_META_PIXEL_ID) */

declare global {
  interface Window {
    gtag?: (...args: unknown[]) => void;
    dataLayer?: unknown[];
    fbq?: (...args: unknown[]) => void;
    lintrk?: (...args: unknown[]) => void;
    clarity?: (...args: unknown[]) => void;
  }
}

export type TrackEvent =
  | "Lead Form Submitted"
  | "Demo Requested"
  | "Audit Requested"
  | "WhatsApp Click"
  | "Call Button Click"
  | "Calculator Completed"
  | "Brochure Downloaded"
  | "Assessment Completed"
  | "Tool Report Downloaded";

type EventPayload = Record<string, string | number | boolean | undefined>;

export const trackEvent = (name: TrackEvent, payload: EventPayload = {}) => {
  const params = { event_category: "conversion", ...payload };

  if (typeof window.gtag === "function") {
    window.gtag("event", name.replace(/\s+/g, "_").toLowerCase(), params);
  }

  if (window.dataLayer) {
    window.dataLayer.push({ event: name, ...params });
  }

  if (typeof window.fbq === "function") {
    const map: Partial<Record<TrackEvent, string>> = {
      "Lead Form Submitted": "Lead",
      "Demo Requested": "Schedule",
      "Audit Requested": "Lead",
      "Calculator Completed": "Lead",
    };
    const fbEvent = map[name] ?? "Contact";
    window.fbq("track", fbEvent, params);
  }

  if (typeof window.lintrk === "function") {
    window.lintrk("track", { conversion_id: name });
  }

  if (import.meta.env.DEV) {
    console.info("[analytics]", name, params);
  }
};

export const initAnalytics = () => {
  const gtm = import.meta.env.VITE_GTM_ID as string | undefined;
  const ga4 = import.meta.env.VITE_GA4_ID as string | undefined;
  const pixel = import.meta.env.VITE_META_PIXEL_ID as string | undefined;
  const clarity = import.meta.env.VITE_CLARITY_ID as string | undefined;

  if (gtm && !document.getElementById("gtm-script") && !document.querySelector('script[src*="googletagmanager.com/gtm.js"]')) {
    window.dataLayer = window.dataLayer ?? [];
    window.dataLayer.push({ "gtm.start": Date.now(), event: "gtm.js" });
    const s = document.createElement("script");
    s.id = "gtm-script";
    s.async = true;
    s.src = `https://www.googletagmanager.com/gtm.js?id=${gtm}`;
    document.head.appendChild(s);
  }

  if (ga4 && !document.getElementById("ga4-script")) {
    const s = document.createElement("script");
    s.id = "ga4-script";
    s.async = true;
    s.src = `https://www.googletagmanager.com/gtag/js?id=${ga4}`;
    document.head.appendChild(s);
    window.dataLayer = window.dataLayer ?? [];
    window.gtag = function gtag(...args: unknown[]) {
      window.dataLayer!.push(args);
    };
    window.gtag("js", new Date());
    window.gtag("config", ga4);
  }

  if (pixel && !document.querySelector('script[src*="fbevents.js"]') && !document.getElementById("meta-pixel")) {
    const n = window.fbq as ((...a: unknown[]) => void) & { callMethod?: (...a: unknown[]) => void; queue?: unknown[]; loaded?: boolean; version?: string; push?: (...a: unknown[]) => void };
    if (!window.fbq) {
      const q: unknown[] = [];
      n.callMethod = n.callMethod ?? function (...a: unknown[]) { q.push(a); };
      n.queue = q;
      n.loaded = true;
      n.version = "2.0";
      n.push = n.push ?? n.callMethod;
      window.fbq = n as Window["fbq"];
    }
    window.fbq!("init", pixel);
    window.fbq!("track", "PageView");
    const s = document.createElement("script");
    s.id = "meta-pixel";
    s.async = true;
    s.src = "https://connect.facebook.net/en_US/fbevents.js";
    document.head.appendChild(s);
  }

  if (clarity && !document.getElementById("clarity-script")) {
    const s = document.createElement("script");
    s.id = "clarity-script";
    s.async = true;
    s.innerHTML = `(function(c,l,a,r,i,t,y){c[a]=c[a]||function(){(c[a].q=c[a].q||[]).push(arguments)};t=l.createElement(r);t.async=1;t.src="https://www.clarity.ms/tag/"+i;y=l.getElementsByTagName(r)[0];y.parentNode.insertBefore(t,y);})(window,document,"clarity","script","${clarity}");`;
    document.head.appendChild(s);
  }

  const linkedIn = import.meta.env.VITE_LINKEDIN_PARTNER_ID as string | undefined;
  if (linkedIn && !document.getElementById("linkedin-insight")) {
    window.lintrk = window.lintrk ?? function (...a: unknown[]) {
      (window.lintrk as { q?: unknown[] }).q = (window.lintrk as { q?: unknown[] }).q ?? [];
      (window.lintrk as { q: unknown[] }).q.push(a);
    };
    const s = document.createElement("script");
    s.id = "linkedin-insight";
    s.async = true;
    s.src = "https://snap.licdn.com/li.lms-analytics/insight.min.js";
    document.head.appendChild(s);
    window.lintrk!("init", { partner_id: linkedIn });
  }
};
