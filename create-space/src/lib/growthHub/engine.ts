import { DIGITAL_MATURITY_AREAS, FLAGSHIP_AUDIT_CATEGORIES } from "@/data/growthHubContent";

export type ToolResult = {
  score: number;
  summary: string;
  strengths: string[];
  weaknesses: string[];
  recommendations: string[];
  details?: Record<string, string | number>;
  categoryScores?: { label: string; score: number }[];
};

const clamp = (n: number, min = 0, max = 100) => Math.max(min, Math.min(max, Math.round(n)));

export function digitalMaturityScore(ratings: Record<string, number>): ToolResult {
  const vals = DIGITAL_MATURITY_AREAS.map((a) => ratings[a] ?? 1);
  const avg = vals.reduce((s, v) => s + v, 0) / vals.length;
  const score = clamp((avg / 5) * 100);
  const areaScores = DIGITAL_MATURITY_AREAS.map((a) => ({ label: a, score: clamp(((ratings[a] ?? 1) / 5) * 100) }));
  const weak = areaScores.filter((x) => x.score < 50).map((x) => x.label);
  const strong = areaScores.filter((x) => x.score >= 70).map((x) => x.label);
  const rec: string[] = [];
  if (weak.includes("CRM Usage") || weak.includes("Lead Management")) rec.push("Implement CRM and lead tracking (ZentroFLOW™)");
  if (weak.includes("WhatsApp Automation")) rec.push("Start WhatsApp automation with ZentroBOT™");
  if (weak.includes("Social Media Presence")) rec.push("Improve social media presence and paid campaigns (ZentroADS™)");
  if (weak.includes("Reporting & Analytics")) rec.push("Deploy business dashboards (ZentroSIGHT™)");
  if (rec.length === 0) rec.push("Optimize existing channels and scale winning campaigns");
  return {
    score,
    summary: `Digital Maturity Score: ${score}/100`,
    strengths: strong.length ? strong : ["Foundation in place — ready to scale"],
    weaknesses: weak.length ? weak : ["Minor gaps across a few areas"],
    recommendations: rec,
    categoryScores: areaScores,
  };
}

export function dealerNetworkPotential(input: {
  population: number; existingDealers: number; targetShare: number;
}): ToolResult {
  const marketUnits = Math.max(1, Math.round(input.population / 50000));
  const required = Math.max(1, Math.round(marketUnits * (input.targetShare / 100)));
  const gap = Math.max(0, required - input.existingDealers);
  const score = clamp(100 - gap * 8);
  return {
    score,
    summary: `Potential Dealers Required: ${required} | Current: ${input.existingDealers} | Gap: ${gap}`,
    strengths: gap === 0 ? ["Network meets target density"] : [`${input.existingDealers} active partners`],
    weaknesses: gap > 0 ? [`${gap} dealer gap in territory`] : [],
    recommendations: gap > 0
      ? ["Conduct market mapping study", "Launch dealer scouting campaign", "Engage Network Expansion consulting"]
      : ["Focus on dealer productivity and support programs"],
    details: { required, current: input.existingDealers, gap },
  };
}

export function socialMediaAudit(input: Record<string, number>): ToolResult {
  const keys = ["Branding", "Engagement", "Posting Frequency", "Reels Usage", "Response Time", "Advertising"];
  const vals = keys.map((k) => input[k] ?? 2);
  const score = clamp((vals.reduce((s, v) => s + v, 0) / (keys.length * 5)) * 100);
  const rec: string[] = [];
  if ((input["Reels Usage"] ?? 2) < 3) rec.push("Increase short-form video / Reels content");
  if ((input["Response Time"] ?? 2) < 3) rec.push("Improve DM and comment response SLAs");
  if ((input["Advertising"] ?? 2) < 3) rec.push("Launch structured Meta ad campaigns");
  if (rec.length === 0) rec.push("Scale top-performing content formats");
  return {
    score,
    summary: `Social Media Health Score: ${score}/100`,
    strengths: score >= 60 ? ["Active social presence"] : [],
    weaknesses: score < 60 ? ["Engagement and consistency need improvement"] : [],
    recommendations: rec,
  };
}

export function yesNoScore(answers: boolean[], labels: string[], product: string): ToolResult {
  const yes = answers.filter(Boolean).length;
  const score = clamp((yes / answers.length) * 100);
  const missed = labels.filter((_, i) => !answers[i]);
  return {
    score,
    summary: `Readiness Score: ${score}/100`,
    strengths: labels.filter((_, i) => answers[i]),
    weaknesses: missed,
    recommendations: missed.length
      ? [`Address: ${missed.slice(0, 3).join(", ")}`, `Recommended: ${product}`]
      : [`You're ready to scale — consider advanced ${product} features`],
  };
}

export function franchiseExpansion(input: {
  revenue: number; cities: number; investment: number; teamStrength: number;
}): ToolResult {
  const score = clamp(
    (Math.min(input.revenue / 10000000, 1) * 30) +
    (Math.min(input.cities, 10) * 5) +
    (Math.min(input.investment / 5000000, 1) * 30) +
    (input.teamStrength * 4),
  );
  const model = score >= 70 ? "Franchise-led expansion" : score >= 45 ? "Hybrid distributor + franchise" : "Pilot city + dealer partner model";
  return {
    score,
    summary: `Franchise Readiness Score: ${score}/100 — ${model}`,
    strengths: score >= 50 ? ["Revenue base supports expansion experiments"] : [],
    weaknesses: score < 50 ? ["Strengthen operations before multi-city rollout"] : [],
    recommendations: [`Recommended model: ${model}`, "Conduct territory feasibility study", "Build partner onboarding playbook"],
    details: { model },
  };
}

export function websiteAudit(input: Record<string, number>): ToolResult {
  const keys = ["SEO Readiness", "Mobile Friendliness", "Speed Score", "Lead Generation", "Trust Score"];
  const vals = keys.map((k) => input[k] ?? 2);
  const score = clamp((vals.reduce((s, v) => s + v, 0) / (keys.length * 5)) * 100);
  return {
    score,
    summary: `Website Performance Score: ${score}/100`,
    strengths: keys.filter((k) => (input[k] ?? 0) >= 4),
    weaknesses: keys.filter((k) => (input[k] ?? 0) < 3),
    recommendations: [
      "Add clear CTAs and lead capture forms",
      "Improve mobile UX and page speed",
      "Add trust signals — testimonials, GSTIN, contact info",
    ],
    categoryScores: keys.map((k) => ({ label: k, score: clamp(((input[k] ?? 2) / 5) * 100) })),
  };
}

export function customerEngagement(input: {
  monthly: number; repeat: number; responseMins: number; rating: number;
}): ToolResult {
  const repeatRate = input.monthly > 0 ? (input.repeat / input.monthly) * 100 : 0;
  const score = clamp(
    repeatRate * 0.4 + Math.max(0, 30 - input.responseMins) + input.rating * 6,
  );
  return {
    score,
    summary: `Customer Engagement Score: ${score}/100`,
    strengths: repeatRate >= 30 ? [`${repeatRate.toFixed(0)}% repeat rate`] : [],
    weaknesses: input.responseMins > 60 ? ["Slow response times hurting retention"] : [],
    recommendations: [
      "Deploy WhatsApp auto-replies for faster response",
      "Launch re-engagement campaigns for inactive customers",
      "Track NPS and review ratings monthly",
    ],
    details: { repeatRate: repeatRate.toFixed(1) },
  };
}

export function salesProductivity(input: {
  executives: number; dailyVisits: number; conversion: number; workingDays: number;
}): ToolResult {
  const potential = input.executives * input.dailyVisits * input.workingDays * (input.conversion / 100);
  const benchmark = input.executives * 4 * input.workingDays * 0.15;
  const lost = Math.max(0, benchmark - potential);
  const score = clamp((potential / Math.max(benchmark, 1)) * 100);
  return {
    score,
    summary: `Productivity Score: ${score}/100 | Est. monthly conversions: ${potential.toFixed(0)}`,
    strengths: score >= 70 ? ["Healthy visit-to-conversion ratio"] : [],
    weaknesses: lost > 0 ? [`~${lost.toFixed(0)} conversions/month opportunity gap`] : [],
    recommendations: ["Implement ZentroTRACK™ for visit compliance", "Standardize daily beat plans", "Review conversion coaching"],
    details: { potential: potential.toFixed(0), lost: lost.toFixed(0) },
  };
}

export function marketingBudget(input: { industry: string; revenue: number; growthTarget: number }): ToolResult {
  const pct = input.growthTarget >= 30 ? 0.12 : input.growthTarget >= 15 ? 0.08 : 0.05;
  const total = input.revenue * pct;
  const meta = total * 0.35;
  const google = total * 0.25;
  const seo = total * 0.2;
  const content = total * 0.2;
  return {
    score: clamp(input.growthTarget * 2),
    summary: `Recommended annual marketing budget: ₹${(total / 100000).toFixed(2)} Lakh`,
    strengths: [`Growth target: ${input.growthTarget}%`],
    weaknesses: [],
    recommendations: [
      `Meta Ads: ₹${(meta / 100000).toFixed(2)} Lakh`,
      `Google Ads: ₹${(google / 100000).toFixed(2)} Lakh`,
      `SEO: ₹${(seo / 100000).toFixed(2)} Lakh`,
      `Content: ₹${(content / 100000).toFixed(2)} Lakh`,
    ],
    details: { total, meta, google, seo, content },
  };
}

export function flagshipBusinessAudit(answers: Record<string, number>): ToolResult {
  const categoryScores = FLAGSHIP_AUDIT_CATEGORIES.map((cat) => {
    const qs = cat.questions;
    const total = qs.reduce((s, _, i) => s + (answers[`${cat.id}-${i}`] ?? 1), 0);
    return { label: cat.label, score: clamp((total / (qs.length * 5)) * 100) };
  });
  const overall = clamp(categoryScores.reduce((s, c) => s + c.score, 0) / categoryScores.length);
  const opportunityCr = ((100 - overall) / 100 * 5 + 1.5).toFixed(1);
  const weak = categoryScores.filter((c) => c.score < 55).map((c) => c.label);
  const rec: string[] = [];
  if (weak.includes("Marketing")) rec.push("ZentroADS™ — performance marketing");
  if (weak.includes("Technology") || weak.includes("Sales")) rec.push("ZentroFLOW™ + ZentroOS™");
  if (weak.includes("Expansion")) rec.push("Network Expansion consulting");
  if (weak.includes("Customer Experience")) rec.push("ZentroBOT™ WhatsApp automation");
  if (rec.length === 0) rec.push("Scale existing systems and expand to new territories");
  return {
    score: overall,
    summary: `Business Growth Score: ${overall}/100 | Opportunity: ₹${opportunityCr} Cr annual potential`,
    strengths: categoryScores.filter((c) => c.score >= 70).map((c) => c.label),
    weaknesses: weak,
    recommendations: rec,
    categoryScores,
    details: { opportunityCr },
  };
}

export function automotiveFinder(type: string): ToolResult {
  const map: Record<string, string[]> = {
    Dealer: ["ZentroFLOW™", "ZentroBOT™", "ZentroADS™"],
    OEM: ["Network Expansion", "ZentroADS™", "ZentroSIGHT™"],
    "Service Center": ["ZentroBOT™", "ZentroDIAL™", "ZentroFLOW™"],
    "Used Vehicle Business": ["ZentroDEAL™", "ZentroSURE™", "ZentroADS™"],
  };
  const products = map[type] ?? map.Dealer;
  return {
    score: 85,
    summary: `Recommended for ${type}: ${products.join(", ")}`,
    strengths: products,
    weaknesses: [],
    recommendations: ["Book a free consultation to customize your stack"],
  };
}

export function msmeFinder(priority: string): ToolResult {
  const map: Record<string, string[]> = {
    Operations: ["ZentroOS™", "Business Consultancy"],
    Marketing: ["ZentroADS™", "ZentroBOT™"],
    Analytics: ["ZentroSIGHT™", "ZentroFLOW™"],
    Expansion: ["Network Expansion", "Business Consultancy"],
  };
  const products = map[priority] ?? ["ZentroOS™", "Business Consultancy", "ZentroSIGHT™"];
  return {
    score: 80,
    summary: `Recommended for MSME (${priority}): ${products.join(", ")}`,
    strengths: products,
    weaknesses: [],
    recommendations: ["Start with a free business growth audit"],
  };
}
