import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import { fetchCms } from "@/lib/cms/cmsApi";
import { CMS_CACHE_KEY, DEFAULT_CMS, mergeCms, readCmsCache, writeCmsCache } from "@/lib/cms/defaults";
import type { CmsContent } from "@/lib/cms/types";

type CmsContextValue = {
  cms: CmsContent;
  loading: boolean;
  refresh: () => Promise<void>;
};

const CmsContext = createContext<CmsContextValue>({
  cms: DEFAULT_CMS,
  loading: true,
  refresh: async () => {},
});

export const CMS_UPDATED_EVENT = "zv-cms-updated";

export function CmsProvider({ children }: { children: ReactNode }) {
  const [cms, setCms] = useState<CmsContent>(() => readCmsCache() ?? DEFAULT_CMS);
  const [loading, setLoading] = useState(true);

  const refresh = useCallback(async () => {
    const remote = await fetchCms();
    const merged = mergeCms(remote ?? readCmsCache());
    setCms(merged);
    writeCmsCache(merged);
    setLoading(false);
  }, []);

  const syncFromCache = useCallback(() => {
    setCms(mergeCms(readCmsCache()));
    setLoading(false);
  }, []);

  useEffect(() => {
    void refresh();
  }, [refresh]);

  // Sync from localStorage when admin publishes — do NOT re-fetch /api/cms here
  // (refresh() used to dispatch CMS_UPDATED_EVENT, which re-triggered refresh → infinite loop).
  useEffect(() => {
    window.addEventListener(CMS_UPDATED_EVENT, syncFromCache);
    return () => window.removeEventListener(CMS_UPDATED_EVENT, syncFromCache);
  }, [syncFromCache]);

  const value = useMemo(() => ({ cms, loading, refresh }), [cms, loading, refresh]);

  return <CmsContext.Provider value={value}>{children}</CmsContext.Provider>;
}

export function useCms() {
  return useContext(CmsContext);
}

/** For non-React modules (e.g. siteContact) */
export function getCachedCms(): CmsContent {
  return readCmsCache() ?? DEFAULT_CMS;
}

export { CMS_CACHE_KEY, mergeCms, writeCmsCache };
