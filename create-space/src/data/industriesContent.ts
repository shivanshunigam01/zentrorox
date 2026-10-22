export type IndustryPage = {
  id: string;
  name: string;
  icon: string;
  description: string;
  problems: string[];
  solutions: string[];
  cta: string;
};

export const INDUSTRIES_PAGE: IndustryPage[] = [
  {
    id: "automotive",
    name: "Automotive",
    icon: "🚗",
    description:
      "Dealerships and automotive businesses need consistent showroom leads, fast follow-up, sales visibility and a strong dealer network. Zentroverse helps automotive brands grow digitally and operationally.",
    problems: [
      "Low showroom and digital leads",
      "Poor follow-up and lead leakage",
      "Weak dealer and sub-dealer network",
      "No sales team or funnel visibility",
      "Fragmented marketing and CRM data",
    ],
    solutions: ["ZentroADS™", "ZentroFLOW™", "ZentroBOT™", "ZentroSIGHT™", "Network Expansion"],
    cta: "Explore Automotive Growth Solutions",
  },
  {
    id: "ev-e-rickshaw",
    name: "EV & E-Rickshaw",
    icon: "⚡",
    description:
      "EV and e-mobility brands scaling across territories need dealer onboarding, digital lead generation and automated customer engagement at speed.",
    problems: [
      "New brand with limited dealer presence",
      "High cost per lead from digital campaigns",
      "Slow dealer onboarding and training",
      "Customer queries not handled at scale",
    ],
    solutions: ["ZentroADS™", "ZentroBOT™", "ZentroFLOW™", "Network Expansion", "ZentroTRACK™"],
    cta: "Explore EV Growth Solutions",
  },
  {
    id: "manufacturing",
    name: "Manufacturing",
    icon: "🏭",
    description:
      "Manufacturers need ERP-led operations, distributor visibility, field sales tracking and demand generation across channels.",
    problems: [
      "Inventory and billing inefficiencies",
      "Distributor performance not tracked",
      "Field sales lack accountability",
      "Demand generation disconnected from CRM",
    ],
    solutions: ["ZentroOS™", "ZentroSIGHT™", "ZentroTRACK™", "ZentroFLOW™", "ZentroADS™"],
    cta: "Explore Manufacturing Solutions",
  },
  {
    id: "retail",
    name: "Retail",
    icon: "🛍",
    description:
      "Retail chains and multi-outlet brands need omnichannel engagement, loyalty, performance marketing and store-level analytics.",
    problems: [
      "Walk-in decline without digital capture",
      "No unified customer view across outlets",
      "Campaign ROI not measurable",
      "Staff follow-up inconsistent",
    ],
    solutions: ["ZentroADS™", "ZentroBOT™", "ZentroFLOW™", "ZentroSIGHT™", "ZentroOS™"],
    cta: "Explore Retail Growth Solutions",
  },
  {
    id: "education",
    name: "Education",
    icon: "🎓",
    description:
      "Educational institutions and ed-tech providers need lead nurturing, admission funnel automation and parent/student communication at scale.",
    problems: [
      "Admission leads not followed up on time",
      "Counsellor workload and missed calls",
      "No funnel stage visibility",
      "Campaign spend without attribution",
    ],
    solutions: ["ZentroBOT™", "ZentroFLOW™", "ZentroDIAL™", "ZentroADS™", "ZentroSIGHT™"],
    cta: "Explore Education Solutions",
  },
  {
    id: "healthcare",
    name: "Healthcare",
    icon: "🏥",
    description:
      "Clinics, hospitals and healthcare businesses need appointment booking, patient engagement, reminders and operational dashboards.",
    problems: [
      "Missed appointments and no-shows",
      "Manual reminder calls",
      "Patient queries on WhatsApp unmanaged",
      "No central MIS for branches",
    ],
    solutions: ["ZentroBOT™", "ZentroDIAL™", "ZentroFLOW™", "ZentroOS™", "ZentroSIGHT™"],
    cta: "Explore Healthcare Solutions",
  },
  {
    id: "msme",
    name: "MSME",
    icon: "🏢",
    description:
      "MSMEs need affordable growth systems — digital marketing, CRM, WhatsApp automation and business consulting without enterprise complexity.",
    problems: [
      "Limited marketing budget and unclear ROI",
      "Leads in spreadsheets and WhatsApp chats",
      "No CRM or ERP discipline",
      "Owner-dependent sales process",
    ],
    solutions: ["ZentroADS™", "ZentroBOT™", "ZentroFLOW™", "ZentroOS™", "Business Consultancy"],
    cta: "Explore MSME Growth Solutions",
  },
  {
    id: "franchise",
    name: "Franchise Businesses",
    icon: "🤝",
    description:
      "Franchise brands need structured expansion, franchisee onboarding, territory planning and performance monitoring across locations.",
    problems: [
      "Slow franchise partner recruitment",
      "Inconsistent franchisee performance",
      "No territory or compliance tracking",
      "Marketing not localized per region",
    ],
    solutions: ["Network Expansion", "ZentroFLOW™", "ZentroSIGHT™", "ZentroADS™", "Business Consultancy"],
    cta: "Explore Franchise Expansion Solutions",
  },
  {
    id: "distribution",
    name: "Distribution Businesses",
    icon: "📦",
    description:
      "Distributors and channel businesses need field force tracking, secondary sales visibility, dealer engagement and demand generation support.",
    problems: [
      "Secondary sales data delayed or missing",
      "Field reps not visiting planned outlets",
      "Dealer engagement weak between visits",
      "No unified view of territory performance",
    ],
    solutions: ["ZentroTRACK™", "ZentroFLOW™", "ZentroBOT™", "ZentroSIGHT™", "Network Expansion"],
    cta: "Explore Distribution Growth Solutions",
  },
];
