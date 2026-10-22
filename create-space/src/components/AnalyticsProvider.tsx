import { useEffect, useRef } from "react";
import { useLocation } from "react-router-dom";
import { initAnalytics, trackEvent } from "@/lib/analytics";

/** Initializes GA4/GTM/Meta/Clarity and tracks SPA page views */
export const AnalyticsProvider = ({ children }: { children: React.ReactNode }) => {
  const { pathname } = useLocation();
  const isFirstPageView = useRef(true);

  useEffect(() => {
    initAnalytics();
  }, []);

  useEffect(() => {
    if (typeof window.gtag === "function") {
      window.gtag("config", import.meta.env.VITE_GA4_ID, { page_path: pathname });
    }
    if (window.dataLayer) {
      window.dataLayer.push({ event: "page_view", page_path: pathname });
    }
    if (typeof window.fbq === "function") {
      if (isFirstPageView.current) {
        isFirstPageView.current = false;
      } else {
        window.fbq("track", "PageView");
      }
    }
  }, [pathname]);

  return <>{children}</>;
};

export { trackEvent };
