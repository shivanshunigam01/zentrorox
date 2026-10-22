import { useEffect, useState } from "react";
import { CONTACT_UPDATED_EVENT, getSiteContact, type SiteContact } from "@/lib/siteContact";
import { CMS_UPDATED_EVENT } from "@/contexts/CmsContext";

export function useSiteContact(): SiteContact {
  const [contact, setContact] = useState(getSiteContact);

  useEffect(() => {
    const refresh = () => setContact(getSiteContact());
    window.addEventListener("storage", refresh);
    window.addEventListener(CONTACT_UPDATED_EVENT, refresh);
    window.addEventListener(CMS_UPDATED_EVENT, refresh);
    return () => {
      window.removeEventListener("storage", refresh);
      window.removeEventListener(CONTACT_UPDATED_EVENT, refresh);
      window.removeEventListener(CMS_UPDATED_EVENT, refresh);
    };
  }, []);

  return contact;
}
