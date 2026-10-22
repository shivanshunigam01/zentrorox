import {
  BarChart3, Bot, Calculator, ClipboardCheck, Globe, MapPin, Megaphone,
  MessageCircle, Search, Sparkles, Target, TrendingUp, Users, Workflow, Building2,
} from "lucide-react";

export type ToolCategory =
  | "Business Tools"
  | "Business Calculators"
  | "Assessments"
  | "Audits"
  | "Finders";

export type GrowthTool = {
  id: string;
  title: string;
  description: string;
  category: ToolCategory;
  phase: 1 | 2 | 3;
  icon: typeof Calculator;
  cta: string;
  ctaHref?: string;
  recommendedProduct?: string;
  featured?: boolean;
};

export const GROWTH_HUB_CATEGORIES = [
  "Business Tools",
  "Business Calculators",
  "Assessments",
  "Audits",
  "Resources",
  "Blogs",
  "Guides",
  "Templates",
  "Case Studies",
  "Success Stories",
  "Industry Insights",
] as const;

export const INDUSTRY_KNOWLEDGE = [
  "Automotive", "EV & Mobility", "Manufacturing", "Retail",
  "Healthcare", "Education", "Franchise Business", "MSME Growth",
] as const;

export const DOWNLOADABLE_RESOURCES = [
  { title: "Website Audit Checklist", type: "Audit Checklists" },
  { title: "Dealer Expansion Playbook", type: "Expansion Playbooks" },
  { title: "Meta Ads Campaign Template", type: "Marketing Templates" },
  { title: "CRM Implementation Guide", type: "CRM Implementation Guides" },
  { title: "WhatsApp Automation Blueprint", type: "WhatsApp Automation Blueprints" },
  { title: "Dealer Recruitment Framework", type: "Dealer Recruitment Frameworks" },
] as const;

export const GROWTH_TOOLS: GrowthTool[] = [
  { id: "business-growth-audit", title: "AI-Powered Business Growth Audit", description: "25-question assessment with category scores, growth roadmap and solution recommendations.", category: "Audits", phase: 3, icon: Sparkles, cta: "Schedule Consultation", featured: true },
  { id: "digital-maturity", title: "Digital Maturity Assessment", description: "Score your digital transformation readiness across 10 business areas.", category: "Assessments", phase: 2, icon: BarChart3, cta: "Get Full Transformation Roadmap", recommendedProduct: "ZentroOS™" },
  { id: "dealer-network-potential", title: "Dealer Network Potential Calculator", description: "Estimate dealer network gap and expansion opportunity by territory.", category: "Business Calculators", phase: 2, icon: MapPin, cta: "Request Market Mapping Study", recommendedProduct: "Network Expansion" },
  { id: "social-media-audit", title: "Social Media Audit Score", description: "Evaluate branding, engagement, reels usage and ad activity.", category: "Audits", phase: 2, icon: Megaphone, cta: "Request Detailed Social Media Audit", recommendedProduct: "ZentroADS™" },
  { id: "whatsapp-readiness", title: "WhatsApp Readiness Assessment", description: "Check WhatsApp Business API, chatbot and automation readiness.", category: "Assessments", phase: 2, icon: MessageCircle, cta: "Implement ZentroBOT™", recommendedProduct: "ZentroBOT™" },
  { id: "crm-readiness", title: "CRM Readiness Assessment", description: "Measure lead tracking, ownership, conversion and follow-up maturity.", category: "Assessments", phase: 2, icon: Workflow, cta: "Implement ZentroFLOW™", recommendedProduct: "ZentroFLOW™" },
  { id: "franchise-expansion", title: "Franchise Expansion Feasibility", description: "Evaluate franchise readiness based on revenue, cities and team strength.", category: "Business Calculators", phase: 2, icon: Building2, cta: "Talk to Network Expansion Expert", recommendedProduct: "Network Expansion" },
  { id: "website-audit", title: "Website Performance Audit", description: "SEO, mobile, speed, lead generation and trust scoring.", category: "Audits", phase: 2, icon: Globe, cta: "Get Detailed Website Audit", recommendedProduct: "ZentroADS™" },
  { id: "customer-engagement", title: "Customer Engagement Score", description: "Score retention, response time and review performance.", category: "Assessments", phase: 2, icon: Users, cta: "Improve Customer Experience", recommendedProduct: "ZentroBOT™" },
  { id: "sales-productivity", title: "Sales Team Productivity Calculator", description: "Estimate productivity score and revenue opportunity for field teams.", category: "Business Calculators", phase: 2, icon: Target, cta: "Track Your Sales Team", recommendedProduct: "ZentroTRACK™" },
  { id: "marketing-budget", title: "Marketing Budget Planner", description: "Recommended Meta, Google, SEO and content budgets by revenue.", category: "Business Calculators", phase: 2, icon: TrendingUp, cta: "Get Growth Plan", recommendedProduct: "ZentroADS™" },
  { id: "automotive-finder", title: "Automotive Growth Finder", description: "Guided solution recommendations for dealers, OEMs and service businesses.", category: "Finders", phase: 3, icon: Search, cta: "Book Consultation" },
  { id: "msme-finder", title: "MSME Growth Finder", description: "Find the right stack for MSME digital transformation and growth.", category: "Finders", phase: 3, icon: Building2, cta: "Book Consultation" },
  { id: "case-study-finder", title: "Interactive Case Study Finder", description: "Match industry, problem and objective to relevant success stories.", category: "Finders", phase: 3, icon: ClipboardCheck, cta: "Talk to Expert" },
];

export const DIGITAL_MATURITY_AREAS = [
  "Website Presence", "Social Media Presence", "Lead Management", "CRM Usage",
  "Customer Retention", "WhatsApp Automation", "Reporting & Analytics",
  "Sales Process", "Team Productivity", "Network Expansion",
] as const;

export const FLAGSHIP_AUDIT_CATEGORIES = [
  { id: "sales", label: "Sales", questions: [
    "Do you have a documented sales process?",
    "Do you track lead-to-sale conversion rates?",
    "Do sales reps follow a structured follow-up cadence?",
    "Do you measure average deal size and sales cycle length?",
  ]},
  { id: "marketing", label: "Marketing", questions: [
    "Do you run trackable Meta or Google ad campaigns?",
    "Is your website optimized for lead capture?",
    "Do you publish content or social media consistently?",
    "Do you measure cost per lead and marketing ROI?",
  ]},
  { id: "operations", label: "Operations", questions: [
    "Are core business processes documented?",
    "Do teams use a single system for daily operations?",
    "Is inventory or service delivery tracked digitally?",
    "Do you have SOPs for customer onboarding?",
  ]},
  { id: "technology", label: "Technology", questions: [
    "Do you use CRM or ERP software?",
    "Is WhatsApp integrated into customer communication?",
    "Do you have business dashboards or MIS reports?",
    "Are systems integrated (ads → CRM → WhatsApp)?",
  ]},
  { id: "expansion", label: "Expansion", questions: [
    "Do you have a dealer/distributor expansion plan?",
    "Is territory mapping data available for new markets?",
    "Do you track partner performance systematically?",
    "Have you evaluated franchise or channel models?",
  ]},
  { id: "cx", label: "Customer Experience", questions: [
    "Do you measure customer satisfaction or NPS?",
    "Is response time to inquiries under 15 minutes?",
    "Do you have a retention or loyalty program?",
    "Do you collect and act on customer reviews?",
  ]},
];

export const CASE_STUDY_FINDER = [
  { industry: "Automotive", problem: "Low Leads", objective: "Need Sales Growth", title: "Automotive Dealer Digital Transformation", outcome: "3× qualified leads in 90 days", href: "/#portfolio" },
  { industry: "Automotive", problem: "Limited Dealer Network", objective: "Expand Territory", title: "EV Network Expansion for ZFORCE", outcome: "6 dealers onboarded", href: "/#portfolio" },
  { industry: "EV & Mobility", problem: "Limited Dealer Network", objective: "Expand Territory", title: "EV Network Expansion for ZFORCE", outcome: "20 prospects engaged", href: "/#portfolio" },
  { industry: "Manufacturing", problem: "Manual Operations", objective: "Automate Processes", title: "Lead Management Platform", outcome: "40% conversion improvement", href: "/#portfolio" },
  { industry: "MSME Growth", problem: "Low Leads", objective: "Need Sales Growth", title: "Virtual Showroom Platform", outcome: "Digital inquiries matched walk-ins", href: "/#portfolio" },
  { industry: "Franchise Business", problem: "Limited Dealer Network", objective: "Expand Territory", title: "Dealer Network Expansion Program", outcome: "28 new appointments in 6 months", href: "/#portfolio" },
];

export const AI_KNOWLEDGE = [
  { keywords: ["improve sales", "increase sales", "sales growth"], answer: "Improve sales by implementing lead tracking (ZentroFLOW™), WhatsApp follow-up automation (ZentroBOT™), and performance marketing (ZentroADS™). Start with a CRM funnel and measure conversion at each stage.", products: ["ZentroFLOW™", "ZentroBOT™", "ZentroADS™"], resource: "/growth-hub/tools/crm-readiness" },
  { keywords: ["recruit dealer", "dealer network", "expand dealer", "distributor"], answer: "Dealer recruitment requires territory mapping, partner profiling, engagement programs and onboarding playbooks. Zentroverse Network Expansion consulting helps OEMs and brands scale dealer networks systematically.", products: ["Network Expansion"], resource: "/growth-hub/tools/dealer-network-potential" },
  { keywords: ["which crm", "crm should", "need crm"], answer: "Choose CRM based on your industry, team size and integration needs. ZentroFLOW™ handles lead lifecycle; ZentroOS™ adds ERP, inventory and accounts for full operations.", products: ["ZentroFLOW™", "ZentroOS™"], resource: "/growth-hub/tools/crm-readiness" },
  { keywords: ["automate whatsapp", "whatsapp api", "whatsapp bot"], answer: "WhatsApp automation starts with WhatsApp Business API, approved templates, chatbot flows and CRM integration. ZentroBOT™ connects Meta ads to WhatsApp nurture journeys.", products: ["ZentroBOT™"], resource: "/growth-hub/tools/whatsapp-readiness" },
  { keywords: ["customer retention", "repeat customer", "engagement"], answer: "Improve retention with faster response times, WhatsApp nurture, loyalty programs and engagement dashboards. Track repeat purchase rate and NPS monthly.", products: ["ZentroBOT™", "ZentroSIGHT™"], resource: "/growth-hub/tools/customer-engagement" },
  { keywords: ["digital marketing", "meta ads", "google ads"], answer: "Digital marketing ROI improves with tracked campaigns, landing pages, CRM integration and weekly optimization. ZentroADS™ manages Meta, Google and SEO holistically.", products: ["ZentroADS™"], resource: "/digital-marketing-company-india" },
  { keywords: ["field team", "sales tracking", "field force"], answer: "Field team productivity improves with GPS tracking, visit compliance, beat planning and manager dashboards. ZentroTRACK™ is built for sales and service field teams.", products: ["ZentroTRACK™"], resource: "/growth-hub/tools/sales-productivity" },
];

export const getGrowthTool = (id: string) => GROWTH_TOOLS.find((t) => t.id === id);
