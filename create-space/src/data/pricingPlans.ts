export type PlanTier = "basic" | "pro";
export type BillingCycle = "monthly" | "yearly";
export type FeatureKind = "included" | "addon";
export type AddonKind = "included" | "additional";

/** Dynamic id from the API (slug / id is used as Razorpay `planId`). */
export type PricingPlanId = string;

export type PlanFeature = {
  id: string;
  label: string;
  /** `included` = part of the plan. `addon` = additional / paid extra. */
  kind: FeatureKind;
  extraLabel?: string;
};

export type PlanAddon = {
  id: string;
  name: string;
  description: string;
  kind: AddonKind;
  priceLabel: string;
  amountInPaise: number | null;
};

export type PricingPlan = {
  id: string;
  slug: string;
  name: string;
  tier: PlanTier;
  billingCycle: BillingCycle;
  priceLabel: string;
  periodLabel: string;
  amountInPaise: number | null;
  blurb: string;
  cta: string;
  highlighted: boolean;
  isActive: boolean;
  sortOrder: number;
  trialDays: number;
  freeTrialEnabled: boolean;
  /** Included-in-plan bullets (API `features` string[]). */
  featureLabels: string[];
  addons: PlanAddon[];
};

export type FreeTrialOffer = {
  enabled: boolean;
  days: number;
  title: string;
  blurb: string;
  cta: string;
  features: string[];
};

export type PricingCatalog = {
  trial: FreeTrialOffer;
  plans: PricingPlan[];
  updatedAt?: string | null;
};

const basicFeatureLabels = [
  "WhatsApp bulk messaging",
  "Template campaigns & segments",
  "Shared inbox",
  "Up to 3 users",
  "Email support",
];

const proFeatureLabels = [
  "Everything in Basic",
  "Meta ads lead sync",
  "Click-to-WhatsApp campaigns",
  "WhatsApp chatbot builder",
  "AI-assisted replies",
  "Human handoff & routing",
  "Priority chat support",
];

const basicAddons = (suffix: string): PlanAddon[] => [
  {
    id: `addon-meta-ads-${suffix}`,
    name: "Meta ads lead sync",
    description: "Send Facebook & Instagram leads into WhatsApp.",
    kind: "additional",
    priceLabel: "₹4,999/mo",
    amountInPaise: 499900,
  },
  {
    id: `addon-chatbot-${suffix}`,
    name: "WhatsApp chatbot",
    description: "Automated FAQs, qualification and journeys.",
    kind: "additional",
    priceLabel: "₹7,999/mo",
    amountInPaise: 799900,
  },
];

const proAddons = (suffix: string): PlanAddon[] => [
  {
    id: `addon-meta-ads-pro-${suffix}`,
    name: "Meta ads lead sync",
    description: "Facebook & Instagram campaigns into WhatsApp.",
    kind: "included",
    priceLabel: "",
    amountInPaise: null,
  },
  {
    id: `addon-chatbot-pro-${suffix}`,
    name: "WhatsApp chatbot",
    description: "Builder, AI replies and human handoff.",
    kind: "included",
    priceLabel: "",
    amountInPaise: null,
  },
  {
    id: `addon-success-mgr-${suffix}`,
    name: "Dedicated success manager",
    description: "Named CSM for onboarding and ongoing support.",
    kind: "additional",
    priceLabel: "₹9,999/mo",
    amountInPaise: 999900,
  },
];

export const DEFAULT_TRIAL: FreeTrialOffer = {
  enabled: true,
  days: 14,
  title: "14-day free trial",
  blurb: "Try Basic features with no credit card. Upgrade to Monthly or Yearly anytime.",
  cta: "Start free trial",
  features: [
    "Full Basic plan access for 14 days",
    "WhatsApp bulk messaging & shared inbox",
    "No credit card required",
    "Cancel anytime before the trial ends",
  ],
};

export const DEFAULT_PLANS: PricingPlan[] = [
  {
    id: "basic-monthly",
    slug: "basic-monthly",
    name: "Basic",
    tier: "basic",
    billingCycle: "monthly",
    priceLabel: "₹4,999",
    periodLabel: "/month",
    amountInPaise: 499900,
    blurb: "WhatsApp bulk messaging for one team.",
    cta: "Get started",
    highlighted: false,
    isActive: true,
    sortOrder: 10,
    trialDays: 14,
    freeTrialEnabled: true,
    featureLabels: basicFeatureLabels,
    addons: basicAddons("bm"),
  },
  {
    id: "basic-yearly",
    slug: "basic-yearly",
    name: "Basic",
    tier: "basic",
    billingCycle: "yearly",
    priceLabel: "₹49,990",
    periodLabel: "/year",
    amountInPaise: 4999000,
    blurb: "WhatsApp bulk messaging — 2 months free vs monthly.",
    cta: "Get started",
    highlighted: false,
    isActive: true,
    sortOrder: 11,
    trialDays: 14,
    freeTrialEnabled: true,
    featureLabels: basicFeatureLabels,
    addons: basicAddons("by"),
  },
  {
    id: "pro-monthly",
    slug: "pro-monthly",
    name: "Pro",
    tier: "pro",
    billingCycle: "monthly",
    priceLabel: "₹12,999",
    periodLabel: "/month",
    amountInPaise: 1299900,
    blurb: "Bulk messaging, Meta ads and chatbot in one plan.",
    cta: "Start Pro",
    highlighted: true,
    isActive: true,
    sortOrder: 20,
    trialDays: 14,
    freeTrialEnabled: true,
    featureLabels: proFeatureLabels,
    addons: proAddons("pm"),
  },
  {
    id: "pro-yearly",
    slug: "pro-yearly",
    name: "Pro",
    tier: "pro",
    billingCycle: "yearly",
    priceLabel: "₹1,29,990",
    periodLabel: "/year",
    amountInPaise: 12999000,
    blurb: "Full stack at a yearly rate — 2 months free vs monthly.",
    cta: "Start Pro",
    highlighted: true,
    isActive: true,
    sortOrder: 21,
    trialDays: 14,
    freeTrialEnabled: true,
    featureLabels: proFeatureLabels,
    addons: proAddons("py"),
  },
];

export const DEFAULT_PRICING_CATALOG: PricingCatalog = {
  trial: DEFAULT_TRIAL,
  plans: DEFAULT_PLANS,
};

export const pricingPlans = DEFAULT_PLANS;

export function isPaidPlan(plan: PricingPlan): boolean {
  return plan.amountInPaise != null && plan.amountInPaise > 0;
}

export function includedFeatures(plan: PricingPlan): PlanFeature[] {
  const fromLabels = (plan.featureLabels ?? []).map((label, i) => ({
    id: `${plan.id}-f-${i}`,
    label,
    kind: "included" as const,
  }));
  const fromAddons = (plan.addons ?? [])
    .filter((a) => a.kind === "included")
    .map((a) => ({ id: a.id, label: a.name, kind: "included" as const }));
  const seen = new Set<string>();
  return [...fromLabels, ...fromAddons].filter((f) => {
    const key = f.label.trim().toLowerCase();
    if (!key || seen.has(key)) return false;
    seen.add(key);
    return true;
  });
}

export function additionalAddons(plan: PricingPlan): PlanAddon[] {
  return (plan.addons ?? []).filter((a) => a.kind !== "included");
}

export function plansForCycle(plans: PricingPlan[], cycle: BillingCycle): PricingPlan[] {
  return plans
    .filter((p) => p.isActive !== false && p.billingCycle === cycle)
    .sort((a, b) => a.sortOrder - b.sortOrder || a.name.localeCompare(b.name));
}

export function findPlanByIdOrSlug(plans: PricingPlan[], idOrSlug: string): PricingPlan | undefined {
  return plans.find((p) => p.id === idOrSlug || p.slug === idOrSlug);
}

type ApiAddon = {
  id?: string;
  name?: string;
  description?: string;
  kind?: string;
  priceLabel?: string;
  amountInPaise?: number | null;
};

/** Raw plan document from GET /api/plans */
export type ApiPricingPlan = {
  id?: string;
  slug?: string;
  name?: string;
  tier?: string;
  billingCycle?: string;
  price?: string;
  period?: string;
  priceLabel?: string;
  periodLabel?: string;
  amountInPaise?: number | null;
  blurb?: string;
  cta?: string;
  highlighted?: boolean;
  features?: unknown;
  addons?: ApiAddon[];
  freeTrialEnabled?: boolean;
  freeTrialDays?: number;
  trialDays?: number;
  active?: boolean;
  isActive?: boolean;
  sortOrder?: number;
  updatedAt?: string;
};

export function normalizePlan(raw: ApiPricingPlan | PricingPlan | Record<string, unknown>): PricingPlan {
  const r = raw as ApiPricingPlan & Partial<PricingPlan> & { featureLabels?: string[] };
  const id = String(r.id ?? r.slug ?? "");
  const cycle: BillingCycle = r.billingCycle === "yearly" ? "yearly" : "monthly";
  const tier: PlanTier = r.tier === "pro" ? "pro" : "basic";

  const featureLabels: string[] = Array.isArray(r.featureLabels)
    ? r.featureLabels.filter((x) => typeof x === "string")
    : Array.isArray(r.features)
      ? r.features.flatMap((f) => {
          if (typeof f === "string") return [f];
          if (f && typeof f === "object" && "label" in f && typeof (f as PlanFeature).label === "string") {
            return (f as PlanFeature).kind === "addon" ? [] : [(f as PlanFeature).label];
          }
          return [];
        })
      : [];

  const addonsFromField: PlanAddon[] = Array.isArray(r.addons)
    ? r.addons.map((a, i) => ({
        id: String(a.id ?? `${id}-addon-${i}`),
        name: String(a.name ?? ""),
        description: String(a.description ?? ""),
        kind: a.kind === "included" ? "included" : "additional",
        priceLabel: String(a.priceLabel ?? ""),
        amountInPaise: typeof a.amountInPaise === "number" ? a.amountInPaise : null,
      }))
    : [];

  const addonsFromLegacyFeatures: PlanAddon[] = Array.isArray(r.features)
    ? r.features.flatMap((f, i) => {
        if (!f || typeof f !== "object" || !("kind" in f)) return [];
        const feat = f as PlanFeature;
        if (feat.kind !== "addon") return [];
        return [
          {
            id: feat.id || `${id}-legacy-addon-${i}`,
            name: feat.label,
            description: "",
            kind: "additional" as const,
            priceLabel: feat.extraLabel ?? "Additional",
            amountInPaise: null,
          },
        ];
      })
    : [];

  const trialDays = Number(r.trialDays ?? r.freeTrialDays ?? 0) || 0;

  return {
    id,
    slug: String(r.slug ?? id),
    name: String(r.name ?? "Plan"),
    tier,
    billingCycle: cycle,
    priceLabel: String(r.priceLabel ?? r.price ?? ""),
    periodLabel: String(r.periodLabel ?? r.period ?? ""),
    amountInPaise: typeof r.amountInPaise === "number" ? r.amountInPaise : null,
    blurb: String(r.blurb ?? ""),
    cta: String(r.cta ?? "Get started"),
    highlighted: Boolean(r.highlighted),
    isActive: r.isActive ?? r.active ?? true,
    sortOrder: Number(r.sortOrder) || 0,
    trialDays,
    freeTrialEnabled: r.freeTrialEnabled ?? trialDays > 0,
    featureLabels,
    addons: addonsFromField.length ? addonsFromField : addonsFromLegacyFeatures,
  };
}

export function serializePlan(plan: PricingPlan): Record<string, unknown> {
  return {
    id: plan.slug || plan.id,
    name: plan.name,
    tier: plan.tier,
    billingCycle: plan.billingCycle,
    price: plan.priceLabel,
    period: plan.periodLabel,
    amountInPaise: plan.amountInPaise,
    blurb: plan.blurb,
    cta: plan.cta,
    highlighted: plan.highlighted,
    features: plan.featureLabels.map((s) => s.trim()).filter(Boolean),
    addons: plan.addons,
    freeTrialEnabled: plan.freeTrialEnabled,
    freeTrialDays: plan.trialDays,
    active: plan.isActive,
    sortOrder: plan.sortOrder,
  };
}

export function trialFromPlans(plans: PricingPlan[], fallback = DEFAULT_TRIAL): FreeTrialOffer {
  const withTrial = plans.find((p) => p.freeTrialEnabled && p.trialDays > 0);
  if (!withTrial) return { ...fallback, enabled: false };
  return {
    ...fallback,
    enabled: true,
    days: withTrial.trialDays,
    title: `${withTrial.trialDays}-day free trial`,
  };
}
