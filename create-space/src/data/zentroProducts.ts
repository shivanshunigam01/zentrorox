import {
  Workflow, MessageCircle, PhoneCall, MapPin, ShieldCheck,
  LayoutDashboard, Megaphone, ShoppingCart, BarChart3,
} from "lucide-react";

export type ZentroProduct = {
  key: string;
  name: string;
  tagline: string;
  description: string;
  features: string[];
  icon: any;
  color: string; // tailwind text color class
  bg: string;   // tailwind bg tint class
  ring: string; // tailwind ring class
  scope?: string; // build / integration scope summary
};

export const ZENTRO_PRODUCTS: ZentroProduct[] = [
  {
    key: "zentroflow",
    name: "ZentroFlow",
    tagline: "AI Powered Lead Engagement Engine",
    description: "Lead Engagement & Conversion Engine",
    features: ["Lead Capture", "Lead Scoring", "Lead Nurturing", "Action Engine", "Lifecycle Automation"],
    scope: "Flow design as per the shared Google file, plus deep integration of BOT, Dialer, IVR and Campaign modules with a unified Dashboard & reporting layer.",
    icon: Workflow,
    color: "text-orange-500",
    bg: "bg-orange-500/10",
    ring: "ring-orange-500/30",
  },
  {
    key: "zentrobot",
    name: "ZentroBOT",
    tagline: "WhatsApp Automation Platform",
    description: "AI Chatbot & Customer Engagement",
    features: ["AI Chatbot", "Campaign Automation", "Customer Support", "FAQ Engine"],
    scope: "Full integration with AiSensy — all APIs, login, subscription purchase flow and end-to-end automation.",
    icon: MessageCircle,
    color: "text-emerald-500",
    bg: "bg-emerald-500/10",
    ring: "ring-emerald-500/30",
  },
  {
    key: "zentrodial",
    name: "ZentroDIAL",
    tagline: "AI Calling & Autodialer",
    description: "Voice Automation Platform",
    features: ["AI Calling", "Bulk Calling", "IVR", "Missed Call Campaigns"],
    scope: "Integration with Tata Teleservices with automation across subscription purchase and calling workflows.",
    icon: PhoneCall,
    color: "text-sky-500",
    bg: "bg-sky-500/10",
    ring: "ring-sky-500/30",
  },
  {
    key: "zentrotrack",
    name: "ZentroTRACK",
    tagline: "Field Force Tracking",
    description: "Live Team Visibility",
    features: ["Live Tracking", "Route Management", "Visit Adherence", "Productivity Analytics"],
    icon: MapPin,
    color: "text-violet-500",
    bg: "bg-violet-500/10",
    ring: "ring-violet-500/30",
  },
  {
    key: "zentrosure",
    name: "ZentroSURE",
    tagline: "Inspection & Certification Platform",
    description: "Trust-Grade Vehicle Inspection",
    features: ["New Vehicle PDI", "Used Vehicle Evaluation", "Insurance Inspection", "Fleet Certification"],
    scope: "Remaining inspection models to be built per the shared Google file (resending) — covering full PDI, used vehicle, insurance and fleet workflows.",
    icon: ShieldCheck,
    color: "text-amber-500",
    bg: "bg-amber-500/10",
    ring: "ring-amber-500/30",
  },
  {
    key: "zentroos",
    name: "ZentroOS",
    tagline: "Dealer ERP · CRM · DMS",
    description: "Operating System for Dealerships",
    features: ["Sales", "CRM", "Workshop", "Inventory", "Billing", "Accounts"],
    icon: LayoutDashboard,
    color: "text-slate-700",
    bg: "bg-slate-500/10",
    ring: "ring-slate-500/30",
  },
  {
    key: "zentroads",
    name: "ZentroADS",
    tagline: "Performance Marketing",
    description: "Demand Generation Engine",
    features: ["Meta Ads", "Google Ads", "SEO", "Lead Generation"],
    icon: Megaphone,
    color: "text-rose-500",
    bg: "bg-rose-500/10",
    ring: "ring-rose-500/30",
  },
  {
    key: "zentrodeal",
    name: "ZentroDEAL",
    tagline: "Vehicle Buying Marketplace",
    description: "Transparent Buying Experience",
    features: ["Compare Vehicles", "Dealer Quotes", "Insurance Quotes", "Finance Quotes"],
    icon: ShoppingCart,
    color: "text-green-600",
    bg: "bg-green-500/10",
    ring: "ring-green-500/30",
  },
  {
    key: "zentrosight",
    name: "ZentroSIGHT",
    tagline: "Analytics & Business Intelligence",
    description: "Decisions Powered by Data",
    features: ["Sales Dashboard", "Market Intelligence", "Territory Analytics", "Predictive Reports"],
    icon: BarChart3,
    color: "text-blue-600",
    bg: "bg-blue-500/10",
    ring: "ring-blue-500/30",
  },
];
