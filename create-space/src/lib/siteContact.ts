/** Website WhatsApp & phone — from CMS (Admin → Content) via API cache. */

import { getCachedCms } from "@/contexts/CmsContext";
import { CMS_UPDATED_EVENT } from "@/contexts/CmsContext";

const ADMIN_SETTINGS_KEY = "zv_admin_settings";

export type SiteContact = {
  whatsappNumber: string;
  contactPhone: string;
  contactPhoneTel: string;
  whatsappMessage: string;
};

const CANONICAL_WA = "919973045587";
const DEFAULT_WA = toWhatsAppDigits(
  (import.meta.env.VITE_WHATSAPP_NUMBER as string | undefined)?.trim() || CANONICAL_WA,
);
const DEFAULT_PHONE =
  (import.meta.env.VITE_CONTACT_PHONE as string | undefined)?.trim() || "+91 99730 45587";
const DEFAULT_WA_MSG = "Hi Zentroverse, I'd like to learn more about your business growth solutions.";

export const CONTACT_UPDATED_EVENT = "zv-contact-updated";

export function digitsOnly(value: string): string {
  return value.replace(/\D/g, "");
}

/** WhatsApp wa.me IDs need country code. 99730 45587 → 919973045587 */
export function toWhatsAppDigits(value: string): string {
  let d = digitsOnly(value);
  if (d.startsWith("0")) d = d.slice(1);
  if (d.length === 10) return `91${d}`;
  return d;
}

type AdminSettingsSlice = { phone?: string };

function readAdminPhone(): string | undefined {
  try {
    const raw = localStorage.getItem(ADMIN_SETTINGS_KEY);
    if (!raw) return undefined;
    return (JSON.parse(raw) as AdminSettingsSlice).phone;
  } catch {
    return undefined;
  }
}

export function getSiteContact(): SiteContact {
  const company = getCachedCms().company;
  const adminPhone = readAdminPhone();

  const whatsappNumber = DEFAULT_WA;
  const contactPhone = company.phone?.trim() || adminPhone?.trim() || DEFAULT_PHONE;
  const whatsappMessage = company.whatsappMessage?.trim() || DEFAULT_WA_MSG;

  return {
    whatsappNumber,
    contactPhone,
    contactPhoneTel: digitsOnly(contactPhone),
    whatsappMessage,
  };
}

export function whatsAppHref(contact: SiteContact): string {
  return `https://wa.me/${contact.whatsappNumber}?text=${encodeURIComponent(contact.whatsappMessage)}`;
}

export function telHref(contact: SiteContact): string {
  return `tel:+${contact.contactPhoneTel}`;
}

export function notifyContactUpdated(): void {
  window.dispatchEvent(new Event(CONTACT_UPDATED_EVENT));
  window.dispatchEvent(new Event(CMS_UPDATED_EVENT));
}
