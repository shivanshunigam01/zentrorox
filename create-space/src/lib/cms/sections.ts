import type { LucideIcon } from "lucide-react";
import {
  Briefcase,
  Building2,
  FolderKanban,
  HelpCircle,
  Image,
  LayoutTemplate,
  PlayCircle,
  Star,
  Tag,
} from "lucide-react";

export type CmsArraySectionSlug =
  | "case-studies"
  | "testimonials"
  | "gallery"
  | "product-demos"
  | "faqs"
  | "works";

export type CmsScalarSectionSlug = "company" | "hero-seo";

export type CmsSectionSlug = CmsArraySectionSlug | CmsScalarSectionSlug;

export type CmsNavItem = {
  slug: CmsSectionSlug | "plans";
  to: string;
  label: string;
  icon: LucideIcon;
  description: string;
};

export const CMS_NAV: CmsNavItem[] = [
  {
    slug: "works",
    to: "/admin/content/works",
    label: "Our Work",
    icon: FolderKanban,
    description: "Portfolio projects on /works — same layout as featured projects grid.",
  },
  {
    slug: "case-studies",
    to: "/admin/content/case-studies",
    label: "Case Studies",
    icon: Briefcase,
    description: "Shown in the Case Studies section on the homepage (#portfolio).",
  },
  {
    slug: "testimonials",
    to: "/admin/content/reviews",
    label: "Reviews",
    icon: Star,
    description: "Customer success stories — homepage Customer Success Stories section.",
  },
  {
    slug: "gallery",
    to: "/admin/content/gallery",
    label: "Gallery",
    icon: Image,
    description: "Photos and videos by category — homepage Gallery section (#gallery).",
  },
  {
    slug: "product-demos",
    to: "/admin/content/product-demos",
    label: "Product Demos",
    icon: PlayCircle,
    description: "Product walkthrough videos or screenshots — homepage Product Demos (#demos).",
  },
  {
    slug: "company",
    to: "/admin/content/company",
    label: "Company",
    icon: Building2,
    description: "Company profile, contact info, bank details, and social links.",
  },
  {
    slug: "hero-seo",
    to: "/admin/content/hero-seo",
    label: "Hero & SEO",
    icon: LayoutTemplate,
    description: "Homepage hero banner copy and page meta title/description.",
  },
  {
    slug: "faqs",
    to: "/admin/content/faqs",
    label: "FAQs",
    icon: HelpCircle,
    description: "Frequently asked questions — homepage FAQ section (#faq).",
  },
  {
    slug: "plans",
    to: "/admin/content/plans",
    label: "Pricing plans",
    icon: Tag,
    description: "Basic/Pro monthly & yearly plans, add-ons, and free trial — live on /pricing.",
  },
];

export const uid = () => crypto.randomUUID();
