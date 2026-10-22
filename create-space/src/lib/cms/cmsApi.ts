import { apiUrl } from "@/config/api";
import { adminHeaders } from "@/lib/admin/auth";
import type {
  CaseStudy,
  CmsContent,
  CompanyProfile,
  FaqItem,
  GalleryItem,
  MediaUploadResult,
  ProductDemo,
  Testimonial,
  WorkItem,
} from "./types";
import type { CmsArraySectionSlug, CmsScalarSectionSlug, CmsSectionSlug } from "./sections";

export type { CmsSectionSlug, CmsArraySectionSlug, CmsScalarSectionSlug };

const adminHeadersFn = () => adminHeaders();

let cmsFetchInFlight: Promise<CmsContent | null> | null = null;

export async function fetchCms(): Promise<CmsContent | null> {
  if (cmsFetchInFlight) return cmsFetchInFlight;

  cmsFetchInFlight = (async () => {
    try {
      const res = await fetch(apiUrl("/api/cms"));
      if (!res.ok) return null;
      const data = await res.json();
      return data.cms as CmsContent;
    } catch {
      return null;
    } finally {
      cmsFetchInFlight = null;
    }
  })();

  return cmsFetchInFlight;
}

export async function saveCms(cms: CmsContent): Promise<{ ok: true; cms: CmsContent } | { ok: false; error: string }> {
  try {
    const res = await fetch(apiUrl("/api/cms"), {
      method: "PUT",
      headers: adminHeadersFn(),
      body: JSON.stringify(cms),
    });
    const data = await res.json().catch(() => ({}));
    if (!res.ok) return { ok: false, error: data.error ?? "Failed to save CMS." };
    return { ok: true, cms: data.cms as CmsContent };
  } catch {
    return { ok: false, error: "Could not reach the API server." };
  }
}

export async function fetchCmsSection(section: CmsArraySectionSlug): Promise<{
  section: string;
  items: CaseStudy[] | Testimonial[] | GalleryItem[] | ProductDemo[] | FaqItem[] | WorkItem[];
  categories?: string[];
} | null>;

export async function fetchCmsSection(section: "company"): Promise<{ section: string; company: CompanyProfile } | null>;

export async function fetchCmsSection(section: "hero-seo"): Promise<{
  section: string;
  hero: CmsContent["hero"];
  meta: CmsContent["meta"];
} | null>;

export async function fetchCmsSection(section: CmsSectionSlug) {
  try {
    const res = await fetch(apiUrl(`/api/cms/sections/${section}`));
    if (!res.ok) return null;
    return res.json();
  } catch {
    return null;
  }
}

export async function saveCmsSection(
  section: CmsArraySectionSlug,
  items: CaseStudy[] | Testimonial[] | GalleryItem[] | ProductDemo[] | FaqItem[] | WorkItem[],
  categories?: string[],
): Promise<{ ok: true; cms: CmsContent } | { ok: false; error: string }> {
  try {
    const body: { items: unknown[]; categories?: string[] } = { items };
    if (section === "gallery" && categories) body.categories = categories;

    const res = await fetch(apiUrl(`/api/cms/sections/${section}`), {
      method: "PUT",
      headers: adminHeadersFn(),
      body: JSON.stringify(body),
    });
    const data = await res.json().catch(() => ({}));
    if (!res.ok) return { ok: false, error: data.error ?? "Failed to save section." };
    return { ok: true, cms: data.cms as CmsContent };
  } catch {
    return { ok: false, error: "Could not reach the API server." };
  }
}

export async function saveCmsCompany(
  company: CompanyProfile,
): Promise<{ ok: true; cms: CmsContent } | { ok: false; error: string }> {
  try {
    const res = await fetch(apiUrl("/api/cms/sections/company"), {
      method: "PUT",
      headers: adminHeadersFn(),
      body: JSON.stringify({ company }),
    });
    const data = await res.json().catch(() => ({}));
    if (!res.ok) return { ok: false, error: data.error ?? "Failed to save company." };
    return { ok: true, cms: data.cms as CmsContent };
  } catch {
    return { ok: false, error: "Could not reach the API server." };
  }
}

export async function saveCmsHeroSeo(
  hero: CmsContent["hero"],
  meta: CmsContent["meta"],
): Promise<{ ok: true; cms: CmsContent } | { ok: false; error: string }> {
  try {
    const res = await fetch(apiUrl("/api/cms/sections/hero-seo"), {
      method: "PUT",
      headers: adminHeadersFn(),
      body: JSON.stringify({ hero, meta }),
    });
    const data = await res.json().catch(() => ({}));
    if (!res.ok) return { ok: false, error: data.error ?? "Failed to save hero & SEO." };
    return { ok: true, cms: data.cms as CmsContent };
  } catch {
    return { ok: false, error: "Could not reach the API server." };
  }
}

export async function uploadMedia(
  file: string,
  folder: string,
  resourceType: "auto" | "image" | "video" = "auto",
): Promise<MediaUploadResult> {
  const res = await fetch(apiUrl("/api/media/upload"), {
    method: "POST",
    headers: adminHeadersFn(),
    body: JSON.stringify({ file, folder, resourceType }),
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data.error ?? "Upload failed.");
  return data as MediaUploadResult;
}

export async function cloudinaryConfigured(): Promise<boolean> {
  try {
    const res = await fetch(apiUrl("/api/media/status"), { headers: adminHeadersFn() });
    if (!res.ok) return false;
    const data = await res.json();
    return Boolean(data.configured);
  } catch {
    return false;
  }
}

export function fileToDataUrl(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result));
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}
