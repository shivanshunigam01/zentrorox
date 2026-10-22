import { DEFAULT_WORKS } from "@/data/defaultWorks";
import { HERO } from "@/data/homeContent";
import { FAQ_ITEMS, META, BRAND_TAGLINE } from "@/data/seoContent";
import type { CmsContent } from "./types";

export const CMS_CACHE_KEY = "zv_cms_cache";

export const DEFAULT_CMS: CmsContent = {
  hero: {
    headline: HERO.headline,
    tagline: HERO.tagline,
    subheadline: HERO.subheadline,
  },
  meta: {
    title: META.title,
    description: META.description,
  },
  company: {
    legalName: "Zentroverse Global Pvt. Ltd.",
    tagline: BRAND_TAGLINE,
    address: "2nd Floor, Bihar State Financial Corporation, Fraser Rd,\nOld Jakkanpur, Indira Nagar,\nPatna, Bihar 800001, India",
    gstin: "10AACCZ7470L1Z3",
    email: "digital@zentroverse.com",
    website: "https://zentroverse.com",
    phone: import.meta.env.VITE_CONTACT_PHONE?.trim() || "+91 99730 45587",
    whatsappNumber: import.meta.env.VITE_WHATSAPP_NUMBER?.trim() || "919973045587",
    whatsappMessage: "Hi Zentroverse, I'd like to learn more about your business growth solutions.",
    hours: "Mon–Sat, 10am–7pm IST",
    bankName: "",
    accountName: "Zentroverse Global Pvt. Ltd.",
    accountNumber: "",
    ifsc: "",
    upi: "",
    social: [
      { platform: "linkedin", url: "" },
      { platform: "instagram", url: "" },
      { platform: "twitter", url: "" },
      { platform: "facebook", url: "" },
      { platform: "youtube", url: "" },
    ],
  },
  galleryCategories: [
    "Client Meetings",
    "Dealer Events",
    "Training Programs",
    "Digital Campaigns",
    "Network Expansion Activities",
    "Field Activities",
    "Product Demos",
  ],
  works: DEFAULT_WORKS.map((w) => ({ ...w })),
  caseStudies: [
    {
      id: "cs-1",
      title: "EV Network Expansion for ZFORCE",
      problem: "New brand with limited dealer presence.",
      solution: "Market mapping, dealer scouting, partner engagement.",
      outcome: "6 dealers onboarded and 20 prospects under engagement.",
      tags: ["Network Expansion", "EV"],
      imageUrl: "",
    },
    {
      id: "cs-2",
      title: "Automotive Dealer Digital Transformation",
      problem: "Fragmented marketing and no lead tracking.",
      solution: "ZentroADS campaigns, ZentroBOT WhatsApp, ZentroFLOW CRM.",
      outcome: "3× increase in qualified leads within 90 days.",
      tags: ["Digital Marketing", "CRM", "WhatsApp"],
      imageUrl: "",
    },
    {
      id: "cs-3",
      title: "Lead Management Platform",
      problem: "Sales team losing follow-ups and hot leads.",
      solution: "ZentroFLOW funnel automation with scoring and reminders.",
      outcome: "40% improvement in lead-to-sale conversion.",
      tags: ["Lead Management", "Automation"],
      imageUrl: "",
    },
    {
      id: "cs-4",
      title: "Dealer Network Expansion Program",
      problem: "Need to scale from 12 to 36 dealers in new territories.",
      solution: "Territory mapping, recruitment, onboarding playbooks.",
      outcome: "28 new dealer appointments in 6 months.",
      tags: ["Dealer Development"],
      imageUrl: "",
    },
    {
      id: "cs-5",
      title: "Virtual Showroom Platform",
      problem: "Low footfall and no digital sales channel.",
      solution: "Digital showroom, test-drive booking, WhatsApp nurture.",
      outcome: "Online inquiries matched showroom walk-ins.",
      tags: ["Digital Transformation"],
      imageUrl: "",
    },
  ],
  testimonials: [
    {
      id: "t-1",
      quote:
        "We improved our lead engagement and conversion process significantly through Zentroverse solutions.",
      name: "Rajesh Kumar",
      company: "Multi-brand Automotive Dealer",
      designation: "Managing Director",
      rating: 5,
      mediaType: "video",
      videoUrl: "",
      thumbnailUrl: "",
    },
    {
      id: "t-2",
      quote: "Their network expansion expertise helped us onboard dealers faster across new territories.",
      name: "Amit Sharma",
      company: "Regional OEM Head",
      designation: "VP Sales & Marketing",
      rating: 5,
      mediaType: "video",
      videoUrl: "",
      thumbnailUrl: "",
    },
    {
      id: "t-3",
      quote: "From CRM to WhatsApp automation — everything works as one integrated growth system.",
      name: "Priya Menon",
      company: "Fleet & Logistics Operator",
      designation: "Operations Head",
      rating: 5,
      mediaType: "video",
      videoUrl: "",
      thumbnailUrl: "",
    },
  ],
  gallery: [],
  productDemos: [],
  faqs: FAQ_ITEMS.map((f) => ({ ...f })),
  updatedAt: null,
};

export function mergeCms(partial?: Partial<CmsContent> | null): CmsContent {
  if (!partial) return structuredClone(DEFAULT_CMS);
  return {
    ...DEFAULT_CMS,
    ...partial,
    hero: { ...DEFAULT_CMS.hero, ...partial.hero },
    meta: { ...DEFAULT_CMS.meta, ...partial.meta },
    company: { ...DEFAULT_CMS.company, ...partial.company, social: partial.company?.social ?? DEFAULT_CMS.company.social },
    caseStudies: Array.isArray(partial.caseStudies) ? partial.caseStudies : DEFAULT_CMS.caseStudies,
    works: Array.isArray(partial.works) ? partial.works : DEFAULT_CMS.works,
    testimonials: Array.isArray(partial.testimonials) ? partial.testimonials : DEFAULT_CMS.testimonials,
    gallery: Array.isArray(partial.gallery) ? partial.gallery : DEFAULT_CMS.gallery,
    productDemos: Array.isArray(partial.productDemos) ? partial.productDemos : DEFAULT_CMS.productDemos,
    galleryCategories: Array.isArray(partial.galleryCategories) ? partial.galleryCategories : DEFAULT_CMS.galleryCategories,
    faqs: Array.isArray(partial.faqs) ? partial.faqs : DEFAULT_CMS.faqs,
  };
}

export function readCmsCache(): CmsContent | null {
  try {
    const raw = localStorage.getItem(CMS_CACHE_KEY);
    if (!raw) return null;
    return mergeCms(JSON.parse(raw));
  } catch {
    return null;
  }
}

export function writeCmsCache(cms: CmsContent) {
  localStorage.setItem(CMS_CACHE_KEY, JSON.stringify(cms));
}
