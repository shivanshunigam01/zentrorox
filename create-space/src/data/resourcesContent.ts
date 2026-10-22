import { KNOWLEDGE_CATEGORIES } from "@/data/homeContent";

export const RESOURCE_SECTIONS = [
  { title: "Blogs", desc: "Expert articles on growth, automation and digital transformation.", href: "/blogs" },
  { title: "Guides", desc: "Step-by-step playbooks for CRM, marketing and dealer development.", href: "/resources#guides" },
  { title: "Playbooks", desc: "Dealer expansion, franchise and network growth frameworks.", href: "/resources#downloads" },
  { title: "Templates", desc: "Ready-to-use sheets, checklists and trackers.", href: "/resources#downloads" },
  { title: "Case Studies", desc: "Real outcomes from automotive, EV and MSME clients.", href: "/#portfolio" },
  { title: "FAQs", desc: "Answers on services, pricing approach and implementation.", href: "/#faq" },
  { title: "Business Calculators", desc: "ROI and growth estimation tools.", href: "/#calculators" },
  { title: "Audit Tools", desc: "Free business, digital and CRM readiness assessments.", href: "/growth-hub" },
] as const;

export const RESOURCE_CATEGORIES = KNOWLEDGE_CATEGORIES;

export type DownloadableResource = {
  id: string;
  title: string;
  category: string;
  description: string;
};

export const DOWNLOADABLES: DownloadableResource[] = [
  {
    id: "sales-tracker",
    title: "Sales Tracker",
    category: "CRM & ERP",
    description: "Track daily calls, follow-ups, hot leads and closure status by salesperson.",
  },
  {
    id: "dealer-evaluation",
    title: "Dealer Evaluation Form",
    category: "Dealer Development",
    description: "Score potential dealers on infrastructure, financials, territory fit and commitment.",
  },
  {
    id: "marketing-budget",
    title: "Marketing Budget Sheet",
    category: "Digital Marketing",
    description: "Plan monthly spend across Meta, Google, SEO and creative with ROI columns.",
  },
  {
    id: "crm-checklist",
    title: "CRM Requirement Checklist",
    category: "CRM & ERP",
    description: "Document must-have CRM features before vendor selection or custom build.",
  },
  {
    id: "territory-mapping",
    title: "Territory Mapping Template",
    category: "Network Expansion",
    description: "Map districts, dealer density, competition and expansion priority zones.",
  },
  {
    id: "franchise-assessment",
    title: "Franchise Assessment Form",
    category: "Network Expansion",
    description: "Evaluate franchise applicants on capital, location, experience and brand alignment.",
  },
  {
    id: "lead-followup",
    title: "Lead Follow-Up Tracker",
    category: "AI & Automation",
    description: "Never miss a follow-up — stage-wise lead tracker with WhatsApp and call notes.",
  },
];
