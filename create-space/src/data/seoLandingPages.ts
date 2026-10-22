import type { GeoFaq } from "@/types/geoPage";

export type SeoLandingPage = {
  slug: string;
  metaTitle: string;
  metaDescription: string;
  h1: string;
  intro: string;
  problems: string[];
  features: string[];
  benefits: string[];
  useCases: string[];
  industries: string[];
  howItWorks: string[];
  faqs: GeoFaq[];
  ctaLabel: string;
  relatedHref: string;
  keywords: string[];
};

const faq = (items: GeoFaq[]) => items;

export const SEO_LANDING_PAGES: SeoLandingPage[] = [
  {
    slug: "digital-marketing-company-india",
    metaTitle: "Digital Marketing Company India | Meta Ads, Google Ads & SEO — Zentroverse",
    metaDescription: "Zentroverse is a digital marketing company in India offering Meta Ads, Google Ads, SEO, lead generation and performance marketing for dealers and MSMEs.",
    h1: "Digital Marketing Company in India",
    intro: "Zentroverse Global delivers ROI-focused digital marketing — Meta Ads, Google Ads, SEO, social media and lead generation — powered by ZentroADS™ for automotive, retail and MSME brands across India.",
    problems: ["Low-quality leads from untracked campaigns", "High cost per lead on Meta and Google", "No SEO visibility for local searches", "Agencies without industry expertise"],
    features: ["Meta & Instagram Ads", "Google Search & Display Ads", "SEO & content marketing", "Landing pages & conversion tracking", "Automotive digital marketing", "Monthly ROI dashboards"],
    benefits: ["More qualified inbound leads", "Lower CPL with optimization", "Long-term organic visibility", "Transparent reporting"],
    useCases: ["Dealer lead generation", "Brand launch campaigns", "Festival seasonal promotions", "B2B lead gen for MSMEs"],
    industries: ["Automotive", "Retail", "Manufacturing", "MSME", "Healthcare"],
    howItWorks: ["Audit current marketing & competitors", "Build channel strategy & creatives", "Launch campaigns with tracking", "Optimize weekly for ROI", "Scale winning channels"],
    faqs: faq([
      { question: "Is Zentroverse a digital marketing company in India?", answer: "Yes. Zentroverse Global provides digital marketing services across India through ZentroADS™ — Meta Ads, Google Ads, SEO and lead generation." },
      { question: "Do you specialize in automotive digital marketing?", answer: "Yes. We have deep experience in automotive dealer marketing, OEM campaigns and fleet lead generation." },
    ]),
    ctaLabel: "Get Marketing Proposal",
    relatedHref: "/products/zentroads",
    keywords: ["Digital Marketing Company India", "Meta Ads Agency", "Google Ads Management"],
  },
  {
    slug: "whatsapp-api-solutions",
    metaTitle: "WhatsApp API Solutions | Business API & Chatbot — Zentroverse",
    metaDescription: "WhatsApp Business API solutions for lead capture, chatbot automation, bulk messaging and customer support. Powered by ZentroBOT™.",
    h1: "WhatsApp API Solutions for Business Growth",
    intro: "Automate customer engagement with official WhatsApp Business API — chatbots, lead qualification, bulk messaging and CRM integration via ZentroBOT™.",
    problems: ["Slow manual WhatsApp replies", "Leads lost after ad clicks", "No template-based bulk messaging", "Support team overload"],
    features: ["WhatsApp Business API setup", "AI chatbot & flows", "Meta ads → WhatsApp sync", "Template messaging", "CRM integration", "Human handoff"],
    benefits: ["Instant lead response", "Higher conversion from ads", "Scalable customer support", "Compliance with Meta policies"],
    useCases: ["Dealership inquiries", "Service reminders", "Promotional campaigns", "Lead nurturing sequences"],
    industries: ["Automotive", "Retail", "Healthcare", "Education", "MSME"],
    howItWorks: ["API onboarding & number setup", "Design conversation flows", "Connect ads & CRM", "Launch & monitor", "Optimize automation"],
    faqs: faq([
      { question: "Does Zentroverse provide WhatsApp API?", answer: "Yes. ZentroBOT™ is our WhatsApp Business API platform for chatbots, automation and lead capture." },
    ]),
    ctaLabel: "Request WhatsApp API Demo",
    relatedHref: "/products/zentrobot",
    keywords: ["WhatsApp API Solutions", "WhatsApp Business API India", "WhatsApp Chatbot"],
  },
  {
    slug: "lead-management-software",
    metaTitle: "Lead Management Software | CRM Funnel & Follow-up — Zentroverse",
    metaDescription: "Lead management software with scoring, funnel automation, follow-up reminders and sales analytics. Powered by ZentroFLOW™.",
    h1: "Lead Management Software for Sales Teams",
    intro: "Track, score and convert leads with ZentroFLOW™ — lifecycle management, automated follow-ups, funnel analytics and integration with ads and WhatsApp.",
    problems: ["Leads falling through cracks", "No visibility on sales pipeline", "Manual follow-up reminders", "Poor lead-to-sale conversion"],
    features: ["Lead capture & assignment", "Scoring & prioritization", "Automated follow-ups", "Funnel dashboards", "WhatsApp & call integration", "Team performance reports"],
    benefits: ["Higher conversion rates", "Faster response times", "Clear pipeline visibility", "Accountability for sales teams"],
    useCases: ["Dealer sales teams", "Inside sales for MSMEs", "Franchise lead distribution", "Post-campaign lead nurture"],
    industries: ["Automotive", "Real Estate", "Education", "B2B Services"],
    howItWorks: ["Map your lead sources", "Configure funnel stages", "Set automation rules", "Train sales team", "Review analytics weekly"],
    faqs: faq([
      { question: "What is ZentroFLOW?", answer: "ZentroFLOW is Zentroverse's lead management platform for capture, scoring, funnel automation and sales follow-up." },
    ]),
    ctaLabel: "Book Lead Management Demo",
    relatedHref: "/products/zentroflow",
    keywords: ["Lead Management Software", "Sales Funnel Software", "CRM Lead Tracking"],
  },
  {
    slug: "crm-erp-solutions",
    metaTitle: "CRM & ERP Solutions | Business Management Software — Zentroverse",
    metaDescription: "Integrated CRM, ERP, DMS, inventory, HRMS and accounts on one platform. Powered by ZentroOS™ for dealers and enterprises.",
    h1: "CRM & ERP Solutions for Growing Businesses",
    intro: "Unify sales, operations, inventory, HR and finance with ZentroOS™ — customizable CRM and ERP built for automotive dealers, manufacturers and MSMEs.",
    problems: ["Disconnected spreadsheets and tools", "No single customer view", "Inventory & accounts mismatch", "Manual reporting delays"],
    features: ["CRM & lead management", "ERP & inventory", "DMS for dealers", "HRMS & payroll", "Accounts & GST", "Custom modules"],
    benefits: ["One platform for operations", "Real-time business visibility", "Reduced manual errors", "Scalable as you grow"],
    useCases: ["Multi-branch dealers", "Manufacturing operations", "Distribution networks", "Service businesses"],
    industries: ["Automotive", "Manufacturing", "Retail", "Logistics"],
    howItWorks: ["Business process discovery", "Module configuration", "Data migration", "Training & go-live", "Support & upgrades"],
    faqs: faq([
      { question: "Does Zentroverse provide CRM and ERP?", answer: "Yes. ZentroOS™ combines CRM, ERP, DMS, inventory, HRMS and accounts in one integrated platform." },
    ]),
    ctaLabel: "Request CRM/ERP Consultation",
    relatedHref: "/products/zentroos",
    keywords: ["CRM ERP Solutions", "ERP Development Company", "CRM Development Company"],
  },
  {
    slug: "dealer-network-expansion",
    metaTitle: "Dealer Network Expansion | Dealer & Franchise Development — Zentroverse",
    metaDescription: "Dealer network expansion services — market mapping, dealer recruitment, distributor appointment and franchise development across India.",
    h1: "Dealer Network Expansion Services",
    intro: "Scale your dealer, distributor and franchise network with Zentroverse — territory mapping, partner scouting, onboarding and performance monitoring.",
    problems: ["Slow dealer onboarding", "Wrong territory selection", "Weak partner pipeline", "No network performance tracking"],
    features: ["Market & territory mapping", "Dealer scouting & recruitment", "Distributor appointment", "Franchise development", "Partner engagement programs", "Network audits"],
    benefits: ["Faster network growth", "Quality partner selection", "Structured onboarding", "Measurable expansion ROI"],
    useCases: ["EV brand dealer rollout", "OEM territory expansion", "Franchise retail growth", "Distribution channel build"],
    industries: ["Automotive", "EV", "Retail", "Manufacturing", "Franchise"],
    howItWorks: ["Define target territories", "Identify & qualify partners", "Engage & negotiate", "Onboard & train", "Monitor performance"],
    faqs: faq([
      { question: "Does Zentroverse help in dealer network expansion?", answer: "Yes. Our Network Expansion consulting covers dealer recruitment, distributor appointment, franchise development and channel audits." },
    ]),
    ctaLabel: "Discuss Network Expansion",
    relatedHref: "/services/network-expansion",
    keywords: ["Dealer Network Expansion", "Franchise Development", "Dealer Recruitment"],
  },
  {
    slug: "business-consultancy",
    metaTitle: "Business Consultancy | Growth Strategy & Digital Transformation — Zentroverse",
    metaDescription: "Business consultancy for growth strategy, sales transformation, process improvement and digital transformation roadmaps.",
    h1: "Business Growth Consultancy",
    intro: "Strategic consulting to align technology, marketing and operations — growth roadmaps, sales transformation and digital transformation for MSMEs and enterprises.",
    problems: ["Unclear growth strategy", "Siloed sales and marketing", "Inefficient processes", "Technology without ROI"],
    features: ["Growth strategy workshops", "Sales process redesign", "Digital transformation roadmap", "KPI framework design", "Change management support"],
    benefits: ["Clear priorities and roadmap", "Aligned teams", "Measurable milestones", "Technology that drives ROI"],
    useCases: ["MSME scaling", "Dealer group transformation", "New market entry", "Post-merger integration"],
    industries: ["Automotive", "Manufacturing", "Retail", "MSME", "Franchise"],
    howItWorks: ["Discovery & diagnostics", "Strategy workshop", "Roadmap & quick wins", "Implementation support", "Review & optimize"],
    faqs: faq([
      { question: "How does Zentroverse help businesses?", answer: "We combine consulting, digital marketing, CRM/ERP, automation and network expansion to help businesses generate leads, convert customers and scale operations." },
    ]),
    ctaLabel: "Book Strategy Session",
    relatedHref: "/services/business-consultancy",
    keywords: ["Business Consultancy", "Business Growth Consulting", "Digital Transformation Services"],
  },
  {
    slug: "automotive-digital-marketing",
    metaTitle: "Automotive Digital Marketing | Dealer Lead Generation — Zentroverse",
    metaDescription: "Automotive digital marketing for dealers and OEMs — Meta Ads, Google Ads, lead management and WhatsApp automation for vehicle sales.",
    h1: "Automotive Digital Marketing for Dealers",
    intro: "Purpose-built automotive marketing — dealer lead generation, test-drive campaigns, inventory promotion and WhatsApp nurture for 2-wheeler, 4-wheeler and EV dealers.",
    problems: ["Generic agencies without auto expertise", "Poor lead quality from ads", "No integration with DMS/CRM", "Seasonal campaign gaps"],
    features: ["Dealer-specific ad creatives", "Click-to-WhatsApp funnels", "Inventory-led campaigns", "CRM & DMS integration", "Multi-location management"],
    benefits: ["More showroom visits", "Trackable cost per lead", "Faster lead follow-up", "OEM-dealer alignment"],
    useCases: ["New model launches", "Exchange & finance offers", "EV test-drive campaigns", "Service booking ads"],
    industries: ["Automotive Dealers", "OEM", "EV Companies", "Fleet"],
    howItWorks: ["Dealer audit", "Creative & offer strategy", "Campaign launch", "Lead routing to CRM", "Monthly optimization"],
    faqs: faq([
      { question: "Does Zentroverse specialize in automotive?", answer: "Yes. Automotive is a core vertical — we serve dealers, OEMs, EV brands and fleet operators across India." },
    ]),
    ctaLabel: "Get Dealer Marketing Plan",
    relatedHref: "/products/zentroads",
    keywords: ["Automotive Digital Marketing", "Dealer Lead Generation", "Car Dealer Marketing"],
  },
  {
    slug: "field-force-tracking",
    metaTitle: "Field Force Tracking Software | GPS & Attendance — Zentroverse",
    metaDescription: "Field force tracking with GPS, attendance, geo-fencing and productivity monitoring. Powered by ZentroTRACK™.",
    h1: "Field Force Tracking & Monitoring",
    intro: "Monitor sales teams and field staff in real time — GPS tracking, attendance, geo-fencing, visit logs and productivity dashboards with ZentroTRACK™.",
    problems: ["No visibility on field visits", "Fake attendance & location", "Missed dealer visits", "Manual reporting"],
    features: ["Live GPS tracking", "Geo-fencing & alerts", "Visit & beat planning", "Attendance & timesheets", "Photo & note capture", "Manager dashboards"],
    benefits: ["Accountability in the field", "More productive visits", "Accurate reporting", "Better territory coverage"],
    useCases: ["Sales rep tracking", "Dealer visit compliance", "Delivery & service teams", "Merchandising audits"],
    industries: ["Automotive", "FMCG", "Pharma", "Distribution"],
    howItWorks: ["Define beats & territories", "Deploy mobile app", "Configure geo-fences", "Train field team", "Review dashboards"],
    faqs: faq([
      { question: "What is ZentroTRACK?", answer: "ZentroTRACK is Zentroverse's field force tracking platform for GPS, attendance, geo-fencing and sales visit monitoring." },
    ]),
    ctaLabel: "Request ZentroTRACK Demo",
    relatedHref: "/products/zentrotrack",
    keywords: ["Field Force Tracking", "Sales Team GPS Tracking", "Field Staff Monitoring"],
  },
  {
    slug: "business-analytics-dashboard",
    metaTitle: "Business Analytics Dashboard | MIS & KPI Monitoring — Zentroverse",
    metaDescription: "Business analytics dashboards, MIS reports and KPI monitoring for sales, marketing and operations. Powered by ZentroSIGHT™.",
    h1: "Business Analytics & Dashboard Solutions",
    intro: "Turn data into decisions with ZentroSIGHT™ — custom dashboards, MIS reports, KPI monitoring and executive analytics across marketing, sales and operations.",
    problems: ["Data scattered across tools", "Delayed manual MIS", "No real-time KPIs", "Decisions without insights"],
    features: ["Executive dashboards", "Sales & marketing analytics", "Custom MIS reports", "KPI alerts", "Multi-source data integration", "Mobile-friendly views"],
    benefits: ["Real-time visibility", "Faster decisions", "Aligned teams on metrics", "Proactive issue detection"],
    useCases: ["Dealer group MIS", "Marketing ROI dashboards", "Sales pipeline analytics", "Operations KPI boards"],
    industries: ["Automotive", "Manufacturing", "Retail", "MSME"],
    howItWorks: ["Identify key metrics", "Connect data sources", "Design dashboards", "Deploy & train users", "Iterate with feedback"],
    faqs: faq([
      { question: "Does Zentroverse provide analytics dashboards?", answer: "Yes. ZentroSIGHT™ delivers business intelligence, MIS and KPI monitoring dashboards tailored to your operations." },
    ]),
    ctaLabel: "See Dashboard Demo",
    relatedHref: "/products/zentrosight",
    keywords: ["Business Analytics Dashboard", "MIS Reporting", "KPI Monitoring"],
  },
  {
    slug: "inspection-verification-services",
    metaTitle: "Inspection & Verification Services | Certification & Audit — Zentroverse",
    metaDescription: "Vehicle inspection, asset verification, certification and audit services. Powered by ZentroSURE™ for dealers, finance and fleet operators.",
    h1: "Inspection & Verification Services",
    intro: "Professional inspection, verification and certification services for vehicles, assets and business processes — powered by ZentroSURE™.",
    problems: ["Inconsistent inspection quality", "Fraud in used vehicle deals", "No standardized audit process", "Delayed certification"],
    features: ["Vehicle inspection reports", "Asset verification", "Certification programs", "Audit & compliance checks", "Digital report delivery", "API integration"],
    benefits: ["Trust in transactions", "Reduced fraud risk", "Standardized quality", "Faster deal closure"],
    useCases: ["Used car certification", "Fleet asset audits", "Dealer stock verification", "Finance company inspections"],
    industries: ["Automotive", "Finance", "Fleet", "Insurance"],
    howItWorks: ["Define inspection checklist", "Train certified inspectors", "Conduct on-site/digital inspection", "Deliver verified report", "Integrate with marketplace/CRM"],
    faqs: faq([
      { question: "What is ZentroSURE?", answer: "ZentroSURE is Zentroverse's inspection, verification, certification and audit services platform." },
    ]),
    ctaLabel: "Request Inspection Services",
    relatedHref: "/products/zentrosure",
    keywords: ["Inspection Verification Services", "Vehicle Inspection", "Asset Verification"],
  },
];

export const getSeoLandingPage = (slug: string) =>
  SEO_LANDING_PAGES.find((p) => p.slug === slug);

export const SEO_LANDING_SLUGS = SEO_LANDING_PAGES.map((p) => p.slug);
