/** Main site navigation — single source for Navbar & Footer */

export type NavDropdown = "solutions" | "ecosystem" | "industries" | "resources";

export type NavLinkItem = {
  label: string;
  href: string;
  desc?: string;
};

export type NavLinkGroup = {
  heading: string;
  items: readonly NavLinkItem[];
};

export const PRIMARY_CTA = {
  label: "Get Free Business Audit",
  href: "/growth-hub/tools/business-growth-audit",
} as const;

export const SOLUTION_GROUPS: readonly NavLinkGroup[] = [
  {
    heading: "Consulting & Growth",
    items: [
      { label: "All Services", href: "/services", desc: "Browse every Zentroverse service" },
      { label: "Business Consultancy", href: "/services/business-consultancy", desc: "Growth strategy & transformation" },
      { label: "Network Expansion", href: "/services/network-expansion", desc: "Dealer & franchise development" },
      { label: "Pricing", href: "/pricing", desc: "Plans and packages" },
    ],
  },
  {
    heading: "Marketing & Demand",
    items: [
      { label: "Digital Marketing Services", href: "/services/digital-marketing", desc: "Meta, Google Ads, SEO & lead gen" },
      { label: "WhatsApp API & AI Chatbots", href: "/services/whatsapp-ai", desc: "Chatbots and WhatsApp automation" },
    ],
  },
  {
    heading: "Operations & Conversion",
    items: [
      { label: "Business Automation", href: "/services/business-automation", desc: "ERP, CRM, DMS & custom software" },
      { label: "Lead Management & CRM", href: "/services/lead-management", desc: "Funnels, scoring and pipeline" },
    ],
  },
  {
    heading: "Popular Topics",
    items: [
      { label: "Digital Marketing Company India", href: "/digital-marketing-company-india" },
      { label: "Automotive Digital Marketing", href: "/automotive-digital-marketing" },
      { label: "WhatsApp API Solutions", href: "/whatsapp-api-solutions" },
      { label: "Lead Management Software", href: "/lead-management-software" },
      { label: "CRM / ERP Solutions", href: "/crm-erp-solutions" },
      { label: "Dealer Network Expansion", href: "/dealer-network-expansion" },
      { label: "Business Growth Consultancy", href: "/business-consultancy" },
    ],
  },
];

export const ECOSYSTEM_GROUPS: readonly NavLinkGroup[] = [
  {
    heading: "Demand & Engagement",
    items: [
      { label: "ZentroADS™", href: "/products/zentroads", desc: "Digital marketing & lead generation" },
      { label: "ZentroBOT™", href: "/products/zentrobot", desc: "WhatsApp API & chatbot automation" },
      { label: "ZentroFLOW™", href: "/products/zentroflow", desc: "Lead management & sales funnel" },
      { label: "ZentroDIAL™", href: "/products/zentrodial", desc: "IVR, autodialer & call center" },
    ],
  },
  {
    heading: "Operations & Intelligence",
    items: [
      { label: "ZentroOS™", href: "/products/zentroos", desc: "ERP, CRM, DMS & HRMS" },
      { label: "ZentroSIGHT™", href: "/products/zentrosight", desc: "Dashboards, MIS & analytics" },
      { label: "ZentroTRACK™", href: "/products/zentrotrack", desc: "Field force tracking" },
      { label: "ZentroDEAL™", href: "/products/zentrodeal", desc: "Marketplace & lead exchange" },
      { label: "ZentroSURE™", href: "/products/zentrosure", desc: "Inspection & verification" },
    ],
  },
  {
    heading: "Explore",
    items: [
      { label: "All Products", href: "/products", desc: "The full Zentroverse ecosystem" },
      { label: "ZentroBOT Automation", href: "/automation", desc: "WhatsApp automation workspace" },
      { label: "Field Force Tracking", href: "/field-force-tracking" },
      { label: "Business Analytics Dashboard", href: "/business-analytics-dashboard" },
      { label: "Inspection & Verification", href: "/inspection-verification-services" },
    ],
  },
];

export const INDUSTRY_LINKS: readonly NavLinkItem[] = [
  { label: "All Industries", href: "/industries" },
  { label: "Automotive", href: "/industries#automotive" },
  { label: "EV & E-Rickshaw", href: "/industries#ev-e-rickshaw" },
  { label: "Manufacturing", href: "/industries#manufacturing" },
  { label: "Retail", href: "/industries#retail" },
  { label: "Education", href: "/industries#education" },
  { label: "Healthcare", href: "/industries#healthcare" },
  { label: "MSME", href: "/industries#msme" },
  { label: "Franchise Businesses", href: "/industries#franchise" },
  { label: "Distribution Businesses", href: "/industries#distribution" },
];

export const RESOURCE_GROUPS: readonly NavLinkGroup[] = [
  {
    heading: "Company & Proof",
    items: [
      { label: "About Us", href: "/about" },
      { label: "Our Work", href: "/works" },
      { label: "Case Studies", href: "/#portfolio" },
      { label: "Gallery", href: "/#gallery" },
      { label: "Contact Us", href: "/contact" },
    ],
  },
  {
    heading: "Learn",
    items: [
      { label: "Resources Hub", href: "/resources" },
      { label: "Blog", href: "/blogs" },
      { label: "FAQs", href: "/#faq" },
    ],
  },
  {
    heading: "Tools",
    items: [
      { label: "Growth Hub", href: "/growth-hub", desc: "Audits, calculators and assessments" },
      { label: "Ask ZentroAI", href: "/growth-hub/ask-ai" },
      { label: "Business Calculators", href: "/#calculators" },
      { label: "AI Business Growth Audit", href: "/growth-hub/tools/business-growth-audit" },
      { label: "Digital Maturity Assessment", href: "/growth-hub/tools/digital-maturity" },
      { label: "Dealer Network Potential", href: "/growth-hub/tools/dealer-network-potential" },
      { label: "Social Media Audit", href: "/growth-hub/tools/social-media-audit" },
      { label: "WhatsApp Readiness", href: "/growth-hub/tools/whatsapp-readiness" },
      { label: "CRM Readiness", href: "/growth-hub/tools/crm-readiness" },
      { label: "Franchise Expansion", href: "/growth-hub/tools/franchise-expansion" },
      { label: "Website Performance Audit", href: "/growth-hub/tools/website-audit" },
      { label: "Customer Engagement Score", href: "/growth-hub/tools/customer-engagement" },
      { label: "Sales Productivity Calculator", href: "/growth-hub/tools/sales-productivity" },
      { label: "Marketing Budget Planner", href: "/growth-hub/tools/marketing-budget" },
      { label: "Automotive Growth Finder", href: "/growth-hub/tools/automotive-finder" },
      { label: "MSME Growth Finder", href: "/growth-hub/tools/msme-finder" },
      { label: "Case Study Finder", href: "/growth-hub/tools/case-study-finder" },
    ],
  },
  {
    heading: "Locations",
    items: [
      { label: "Locations We Serve", href: "/locations" },
      { label: "Bihar", href: "/locations/bihar" },
      { label: "Jharkhand", href: "/locations/jharkhand" },
      { label: "Patna", href: "/locations/patna" },
    ],
  },
];

export const INDUSTRY_GROUPS: readonly NavLinkGroup[] = [
  { heading: "Industries we serve", items: INDUSTRY_LINKS },
];

export const DROPDOWN_MENUS: Record<
  NavDropdown,
  { groups: readonly NavLinkGroup[]; columns: 1 | 3 | 4; width: string }
> = {
  solutions: { groups: SOLUTION_GROUPS, columns: 4, width: "w-[min(58rem,calc(100vw-2rem))]" },
  ecosystem: { groups: ECOSYSTEM_GROUPS, columns: 3, width: "w-[min(48rem,calc(100vw-2rem))]" },
  industries: { groups: INDUSTRY_GROUPS, columns: 1, width: "w-[16.5rem]" },
  resources: { groups: RESOURCE_GROUPS, columns: 4, width: "w-[min(62rem,calc(100vw-2rem))]" },
};

export const ECOSYSTEM_PRODUCTS = ECOSYSTEM_GROUPS.flatMap((g) => g.items).filter((item) =>
  item.href.startsWith("/products/"),
);

export const MAIN_NAV: readonly { label: string; href: string; dropdown?: NavDropdown }[] = [
  { label: "Home", href: "/" },
  { label: "Solutions", href: "/services", dropdown: "solutions" },
  { label: "Ecosystem", href: "/products", dropdown: "ecosystem" },
  { label: "Industries", href: "/industries", dropdown: "industries" },
  { label: "Resources", href: "/resources", dropdown: "resources" },
];

export const FOOTER_QUICK_LINKS: readonly NavLinkItem[] = [
  { label: "Home", href: "/" },
  { label: "Solutions", href: "/services" },
  { label: "Ecosystem", href: "/products" },
  { label: "Industries", href: "/industries" },
  { label: "Resources", href: "/resources" },
  { label: "About Us", href: "/about" },
  { label: "Contact Us", href: "/contact" },
  { label: PRIMARY_CTA.label, href: PRIMARY_CTA.href },
];

const SOLUTION_PREFIXES = ["/services", "/pricing"];
const SOLUTION_EXACT = [
  "/digital-marketing-company-india",
  "/automotive-digital-marketing",
  "/whatsapp-api-solutions",
  "/lead-management-software",
  "/crm-erp-solutions",
  "/dealer-network-expansion",
  "/business-consultancy",
];
const ECOSYSTEM_PREFIXES = ["/products", "/automation"];
const ECOSYSTEM_EXACT = [
  "/field-force-tracking",
  "/business-analytics-dashboard",
  "/inspection-verification-services",
];
const RESOURCE_PREFIXES = [
  "/resources",
  "/about",
  "/works",
  "/blogs",
  "/growth-hub",
  "/contact",
  "/locations",
  "/privacy-policy",
  "/terms-and-conditions",
];

function matchesPrefix(pathname: string, prefixes: string[]) {
  return prefixes.some((prefix) => pathname === prefix || pathname.startsWith(`${prefix}/`));
}

/** Resolve nav href — hash links on homepage use in-page anchors when already on `/`. */
export function resolveNavHref(href: string, pathname: string): string {
  if (href.startsWith("/#") && pathname === "/") {
    return href.slice(1);
  }
  return href;
}

export function isRouterLink(href: string): boolean {
  if (href === "/") return true;
  if (href.startsWith("/") && !href.startsWith("/#")) return true;
  if (href.startsWith("/#")) return true;
  return false;
}

export function isNavActive(href: string, pathname: string, hash: string) {
  if (href === "/") return pathname === "/";
  if (href.startsWith("/#")) return pathname === "/" && hash === href.slice(1);
  if (href === "/services") {
    return matchesPrefix(pathname, SOLUTION_PREFIXES) || SOLUTION_EXACT.includes(pathname);
  }
  if (href === "/products") {
    return matchesPrefix(pathname, ECOSYSTEM_PREFIXES) || ECOSYSTEM_EXACT.includes(pathname);
  }
  if (href === "/industries") {
    return pathname === "/industries" || pathname.startsWith("/industries/");
  }
  if (href === "/resources") {
    return matchesPrefix(pathname, RESOURCE_PREFIXES);
  }
  return pathname === href || pathname.startsWith(`${href}/`);
}
