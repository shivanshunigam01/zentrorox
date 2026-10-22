import { useCallback } from "react";
import { toast } from "@/hooks/use-toast";
import { CMS_UPDATED_EVENT, useCms } from "@/contexts/CmsContext";
import { mergeCms, writeCmsCache } from "@/lib/cms/defaults";
import type { CmsContent } from "@/lib/cms/types";
import { notifyContactUpdated } from "@/lib/siteContact";

export function useCmsAdminSave() {
  const { refresh } = useCms();

  const afterSave = useCallback(
    async (next: CmsContent) => {
      const merged = mergeCms(next);
      writeCmsCache(merged);
      notifyContactUpdated();
      window.dispatchEvent(new Event(CMS_UPDATED_EVENT));
      // Single explicit refetch after admin save (event listener only syncs cache).
      await refresh();
    },
    [refresh],
  );

  const publishResult = useCallback(
    async (
      result: { ok: true; cms: CmsContent } | { ok: false; error: string },
      successTitle = "Section published",
      successDescription = "Visible on the homepage now.",
    ) => {
      if (!result.ok) {
        toast({ title: "Save failed", description: result.error, variant: "destructive" });
        return false;
      }
      await afterSave(result.cms);
      toast({ title: successTitle, description: successDescription });
      return true;
    },
    [afterSave],
  );

  return { afterSave, publishResult };
}
