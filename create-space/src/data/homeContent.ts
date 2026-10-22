import {
  Megaphone, LayoutDashboard, MessageCircle, PhoneCall, Workflow,
  BarChart3, MapPin, ShoppingCart, ShieldCheck, Target, Brain,
  Headphones, TrendingUp, Factory, Settings, Bot, GraduationCap as TrainingIcon, Briefcase,
} from "lucide-react";

import { BRAND_TAGLINE, BRAND_STATEMENT } from "@/data/seoContent";

export const HERO = {
  headline: "AI-Powered Business Growth & Digital Transformation Solutions",
  tagline: BRAND_TAGLINE,
  subheadline:
    "Zentroverse helps businesses generate leads, automate operations, improve customer engagement, manage sales funnels and expand dealer, distributor and franchise networks.",
  ctas: [
    { label: "Book Free Consultation", href: "/contact", variant: "hero" as const, event: "Demo Requested" as const },
    { label: "Request Demo", href: "/contact", variant: "outline-brand" as const, event: "Demo Requested" as const },
    { label: "Get Free Business Audit", href: "/contact", variant: "outline" as const, event: "Audit Requested" as const },
    { label: "Free Trial", href: "https://www.automation.zentroverse.com/signup", variant: "brand" as const },
  ],
};

export const WHO_WE_ARE = {
  heading: "Who We Are",
  intro:
    "Zentroverse Global Pvt. Ltd. is a Business Growth Intelligence, Digital Transformation and Network Expansion Ecosystem helping businesses generate more leads, convert more customers, automate operations, track performance and expand profitably.",
  detail:
    "We combine digital marketing, CRM, ERP, WhatsApp automation, analytics, consulting and network expansion strategy to solve real business growth problems — not just deliver software or campaigns in isolation.",
  specialize: "Our integrated approach covers:",
  pillars: [
    "Business Growth Consulting",
    "Digital Transformation",
    "Lead Generation & CRM",
    "ERP & Sales Funnel Automation",
    "WhatsApp & AI Communication",
    "Analytics & MIS Dashboards",
    "Dealer, Distributor & Franchise Expansion",
    "Industry Solutions (Automotive, EV, MSME, Retail, Healthcare, Education, Manufacturing)",
  ],
  closing:
    "From showroom lead gaps to weak dealer networks and manual follow-ups — we help businesses move from traditional operations to intelligent, measurable growth systems.",
};

export const WHAT_WE_DO = [
  {
    title: "Digital Growth",
    icon: Megaphone,
    color: "from-rose-500 to-brand-pink",
    items: ["Meta Ads", "Google Ads", "SEO", "Social Media Management", "Performance Marketing"],
  },
  {
    title: "Software & Automation",
    icon: LayoutDashboard,
    color: "from-brand-blue to-primary",
    items: ["ERP", "CRM", "DMS", "Mobile Apps", "Custom Software"],
  },
  {
    title: "AI & Communication",
    icon: Bot,
    color: "from-emerald-500 to-primary",
    items: ["WhatsApp API", "Chatbots", "Voice Bots", "IVR", "Autodialer"],
  },
  {
    title: "Business Intelligence",
    icon: BarChart3,
    color: "from-blue-600 to-brand-purple",
    items: ["Dashboards", "Analytics", "MIS", "Reporting", "Data Insights"],
  },
  {
    title: "Consulting",
    icon: Briefcase,
    color: "from-brand-purple to-brand-pink",
    items: ["Business Growth", "Sales Transformation", "Network Expansion", "Process Improvement"],
  },
  {
    title: "Training",
    icon: TrainingIcon,
    color: "from-amber-500 to-orange-500",
    items: ["Sales Training", "Digital Training", "Leadership Programs", "Dealer Development"],
  },
];

export const OUTCOME_CARDS = [
  {
    step: "01",
    stage: "Attract",
    title: "Generate More Leads",
    poweredBy: "ZentroADS™",
    href: "/products/zentroads",
    icon: Megaphone,
    color: "from-rose-500 to-brand-pink",
    detail: "Performance marketing that brings qualified demand into your funnel.",
  },
  {
    step: "02",
    stage: "Engage",
    title: "Convert More Customers",
    poweredBy: "ZentroFLOW™ + ZentroBOT™",
    href: "/products/zentroflow",
    icon: Workflow,
    color: "from-orange-500 to-emerald-500",
    detail: "Nurture, follow up and convert faster — with calling support from ZentroDIAL™.",
  },
  {
    step: "03",
    stage: "Automate",
    title: "Streamline Operations",
    poweredBy: "ZentroOS™",
    href: "/products/zentroos",
    icon: LayoutDashboard,
    color: "from-slate-600 to-primary",
    detail: "ERP, CRM and process automation so teams stop working in silos.",
  },
  {
    step: "04",
    stage: "Analyze",
    title: "Understand Performance",
    poweredBy: "ZentroSIGHT™ + ZentroTRACK™",
    href: "/products/zentrosight",
    icon: BarChart3,
    color: "from-sky-500 to-brand-blue",
    detail: "Dashboards, MIS and field-team visibility to track what actually drives growth.",
  },
  {
    step: "05",
    stage: "Scale",
    title: "Expand Your Business",
    poweredBy: "Network Expansion Consulting",
    href: "/services/network-expansion",
    icon: Target,
    color: "from-brand-purple to-brand-pink",
    detail: "Dealer, distributor and franchise growth with a repeatable playbook.",
  },
];

export const AUDIT_TYPES = [
  "Website Audit",
  "Social Media Audit",
  "Lead Funnel Audit",
  "CRM Audit",
  "WhatsApp Automation Audit",
  "Dealer Network Audit",
] as const;

export const BUSINESS_TYPES = [
  "Automotive Dealer", "OEM", "EV Company", "Manufacturer", "Retail Chain",
  "MSME", "Educational Institution", "Healthcare", "Franchise Brand", "Other",
] as const;

export const WHY_CHOOSE = [
  { icon: Target, title: "End-to-End Solution", desc: "From Lead Generation to Sales Conversion." },
  { icon: Factory, title: "Industry Expertise", desc: "Automotive, Retail, Manufacturing, Service and MSME." },
  { icon: Brain, title: "Technology Driven", desc: "AI, Automation, CRM and Analytics." },
  { icon: TrendingUp, title: "Business First Approach", desc: "We focus on ROI, not just software." },
  { icon: Settings, title: "Customizable Solutions", desc: "Tailor-made for every business." },
  { icon: Headphones, title: "Dedicated Support", desc: "Consultants, Developers and Growth Experts." },
];

export const IMPACT_STATS = [
  { value: "100+", label: "Projects Delivered" },
  { value: "50+", label: "Businesses Digitized" },
  { value: "10+", label: "Industry Verticals" },
  { value: "50000+", label: "Leads Generated" },
  { value: "200%", label: "Average Growth Potential" },
];

export type SolutionTier = 1 | 2 | 3;

export type SolutionBrand = {
  key: string;
  name: string;
  tagline: string;
  features: string[];
  icon: typeof Megaphone;
  tier: SolutionTier;
  color: string;
  bg: string;
  ring: string;
};

export const SOLUTION_BRANDS: SolutionBrand[] = [
  {
    key: "zentroads",
    name: "ZentroADS™️",
    tagline: "Digital Growth Platform",
    features: ["Meta Ads", "Google Ads", "SEO", "Content Marketing", "Performance Campaigns"],
    icon: Megaphone,
    tier: 1,
    color: "text-rose-500",
    bg: "bg-rose-500/10",
    ring: "ring-rose-500/30",
  },
  {
    key: "zentrobot",
    name: "ZentroBOT™️",
    tagline: "WhatsApp Automation",
    features: ["WhatsApp API", "Lead Capture", "Chatbot", "Customer Support"],
    icon: MessageCircle,
    tier: 1,
    color: "text-emerald-500",
    bg: "bg-emerald-500/10",
    ring: "ring-emerald-500/30",
  },
  {
    key: "zentroflow",
    name: "ZentroFLOW™️",
    tagline: "Lead Management Platform",
    features: ["Lead Lifecycle", "Lead Scoring", "Automation", "Customer Engagement"],
    icon: Workflow,
    tier: 1,
    color: "text-orange-500",
    bg: "bg-orange-500/10",
    ring: "ring-orange-500/30",
  },
  {
    key: "zentroos",
    name: "ZentroOS™️",
    tagline: "Business Management Platform",
    features: ["ERP", "CRM", "DMS", "HRMS", "Inventory", "Accounts"],
    icon: LayoutDashboard,
    tier: 2,
    color: "text-slate-700",
    bg: "bg-slate-500/10",
    ring: "ring-slate-500/30",
  },
  {
    key: "zentrodial",
    name: "ZentroDIAL™️",
    tagline: "Communication Platform",
    features: ["IVR", "Autodialer", "Voice Broadcasting", "Lead Calling"],
    icon: PhoneCall,
    tier: 2,
    color: "text-sky-500",
    bg: "bg-sky-500/10",
    ring: "ring-sky-500/30",
  },
  {
    key: "zentrosight",
    name: "ZentroSIGHT™️",
    tagline: "Business Intelligence",
    features: ["Reports", "Dashboards", "KPI Monitoring", "Analytics"],
    icon: BarChart3,
    tier: 2,
    color: "text-blue-600",
    bg: "bg-blue-500/10",
    ring: "ring-blue-500/30",
  },
  {
    key: "zentrotrack",
    name: "ZentroTRACK™️",
    tagline: "Workforce Monitoring",
    features: ["Sales Tracking", "Attendance", "Geo-Fencing", "Productivity Monitoring"],
    icon: MapPin,
    tier: 2,
    color: "text-violet-500",
    bg: "bg-violet-500/10",
    ring: "ring-violet-500/30",
  },
  {
    key: "zentrodeal",
    name: "ZentroDEAL™️",
    tagline: "Marketplace Ecosystem",
    features: ["Vehicles", "Equipment", "Business Listings", "Lead Exchange"],
    icon: ShoppingCart,
    tier: 3,
    color: "text-green-600",
    bg: "bg-green-500/10",
    ring: "ring-green-500/30",
  },
  {
    key: "zentrosure",
    name: "ZentroSURE™️",
    tagline: "Inspection & Verification",
    features: ["Vehicle Inspection", "Asset Verification", "Certification", "Audit Services"],
    icon: ShieldCheck,
    tier: 3,
    color: "text-amber-500",
    bg: "bg-amber-500/10",
    ring: "ring-amber-500/30",
  },
];

export const TIER_LABELS: Record<SolutionTier, string> = {
  1: "Revenue Drivers",
  2: "Enterprise Solutions",
  3: "Specialized Platforms",
};

export const INDUSTRIES = [
  { icon: "🚗", name: "Automotive Dealers" },
  { icon: "⚡", name: "EV Companies" },
  { icon: "🏭", name: "Manufacturers" },
  { icon: "🛍", name: "Retail Chains" },
  { icon: "🏢", name: "MSMEs" },
  { icon: "🎓", name: "Educational Institutions" },
  { icon: "🏥", name: "Healthcare Businesses" },
  { icon: "🤝", name: "Franchise Brands" },
  { icon: "📦", name: "Distribution Businesses" },
];

export const CONSULTING_SERVICES = [
  "Business Transformation",
  "Market Expansion",
  "Revenue Growth Strategy",
  "Dealer Development",
  "Franchise Development",
  "Process Optimization",
  "Digital Transformation Roadmap",
];

export const NETWORK_SERVICES = [
  "Market Mapping",
  "Territory Evaluation",
  "Dealer Recruitment",
  "Distributor Appointment",
  "Franchise Development",
  "Channel Audits",
  "Network Performance Monitoring",
];

export const CASE_STUDIES = [
  {
    title: "EV Network Expansion for ZFORCE",
    problem: "New brand with limited dealer presence.",
    solution: "Market mapping, dealer scouting, partner engagement.",
    outcome: "6 dealers onboarded and 20 prospects under engagement.",
    tags: ["Network Expansion", "EV"],
  },
  {
    title: "Automotive Dealer Digital Transformation",
    problem: "Fragmented marketing and no lead tracking.",
    solution: "ZentroADS campaigns, ZentroBOT WhatsApp, ZentroFLOW CRM.",
    outcome: "3× increase in qualified leads within 90 days.",
    tags: ["Digital Marketing", "CRM", "WhatsApp"],
  },
  {
    title: "Lead Management Platform",
    problem: "Sales team losing follow-ups and hot leads.",
    solution: "ZentroFLOW funnel automation with scoring and reminders.",
    outcome: "40% improvement in lead-to-sale conversion.",
    tags: ["Lead Management", "Automation"],
  },
  {
    title: "Dealer Network Expansion Program",
    problem: "Need to scale from 12 to 36 dealers in new territories.",
    solution: "Territory mapping, recruitment, onboarding playbooks.",
    outcome: "28 new dealer appointments in 6 months.",
    tags: ["Dealer Development"],
  },
  {
    title: "Virtual Showroom Platform",
    problem: "Low footfall and no digital sales channel.",
    solution: "Digital showroom, test-drive booking, WhatsApp nurture.",
    outcome: "Online inquiries matched showroom walk-ins.",
    tags: ["Digital Transformation"],
  },
];

export const TESTIMONIALS = [
  {
    quote: "We improved our lead engagement and conversion process significantly through Zentroverse solutions.",
    name: "Rajesh Kumar",
    company: "Multi-brand Automotive Dealer",
    designation: "Managing Director",
    rating: 5,
    videoUrl: "",
  },
  {
    quote: "Their network expansion expertise helped us onboard dealers faster across new territories.",
    name: "Amit Sharma",
    company: "Regional OEM Head",
    designation: "VP Sales & Marketing",
    rating: 5,
    videoUrl: "",
  },
  {
    quote: "From CRM to WhatsApp automation — everything works as one integrated growth system.",
    name: "Priya Menon",
    company: "Fleet & Logistics Operator",
    designation: "Operations Head",
    rating: 5,
    videoUrl: "",
  },
];

export const GALLERY_CATEGORIES = [
  "Client Meetings",
  "Dealer Events",
  "Training Programs",
  "Digital Campaigns",
  "Network Expansion Activities",
  "Field Activities",
  "Product Demos",
];

export const PROCESS_STEPS = [
  { step: "Discover", desc: "Understand Business" },
  { step: "Analyze", desc: "Identify Gaps" },
  { step: "Strategize", desc: "Build Roadmap" },
  { step: "Implement", desc: "Deploy Solutions" },
  { step: "Optimize", desc: "Continuous Improvement" },
  { step: "Scale", desc: "Achieve Growth" },
];

export const KNOWLEDGE_CATEGORIES = [
  "Digital Marketing",
  "AI & Automation",
  "CRM & ERP",
  "WhatsApp API",
  "Dealer Development",
  "Automotive Growth",
  "Network Expansion",
  "Business Consultancy",
];

/** @deprecated use KNOWLEDGE_CATEGORIES — kept for BlogIndex */
export const BLOG_CATEGORIES = KNOWLEDGE_CATEGORIES;

export const CALCULATORS = [
  { id: "lead-conversion", title: "Lead Conversion Calculator", desc: "See how small improvements can increase revenue." },
  { id: "marketing-roi", title: "Digital Marketing ROI Calculator", desc: "Understand the potential return on your campaigns." },
  { id: "funnel-leakage", title: "Sales Funnel Leakage Calculator", desc: "Find where potential customers are dropping off." },
  { id: "network-roi", title: "Network Expansion ROI Calculator", desc: "Model the revenue impact of adding new dealers." },
  { id: "whatsapp-savings", title: "WhatsApp Automation Savings Calculator", desc: "See how much time and cost automation can save." },
  { id: "marketing-budget", title: "Marketing Budget Planner", desc: "Plan spend across channels and projected lead volume." },
  { id: "crm-roi", title: "CRM ROI Calculator", desc: "Estimate the revenue lift from better follow-up." },
  { id: "erp-roi", title: "ERP ROI Calculator", desc: "Quantify savings from faster, cleaner operations." },
  { id: "dealer-expansion-roi", title: "Dealer Expansion ROI Calculator", desc: "See year-one return from new dealer appointments." },
];

export const BLOG_POSTS = [
  { title: "How AI-Powered Lead Management Transforms Dealer Sales", category: "Automation", date: "Mar 2026" },
  { title: "Building a WhatsApp-First Customer Engagement Strategy", category: "Digital Marketing", date: "Feb 2026" },
  { title: "Dealer Network Expansion: A Step-by-Step Playbook", category: "Network Expansion", date: "Jan 2026" },
];

export const CLIENT_LOGOS = [
  "Tata Motors Projects",
  "Bajaj Dealers",
  "VinFast",
  "ZFORCE",
  "Automotive Clients",
  "MSMEs",
];
