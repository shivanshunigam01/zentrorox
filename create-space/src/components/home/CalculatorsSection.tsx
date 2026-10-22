import { useState } from "react";
import { z } from "zod";
import { motion } from "framer-motion";
import {
  ArrowRight,
  Building2,
  Filter,
  IndianRupee,
  LayoutDashboard,
  Loader2,
  MessageCircle,
  Network,
  PieChart,
  TrendingUp,
  Workflow,
  type LucideIcon,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { toast } from "@/hooks/use-toast";
import { submitLead } from "@/lib/leadsApi";
import { trackEvent } from "@/lib/analytics";
import { CALCULATORS } from "@/data/homeContent";
import { SectionHeader } from "./SectionHeader";
import { cn } from "@/lib/utils";

type CalcId = (typeof CALCULATORS)[number]["id"];

type CalcField = { key: string; label: string; default: number; min?: number; max?: number };

type CalcResult = { summary: string; value: number };

const CALC_UI: Record<CalcId, { Icon: LucideIcon; accent: string; hint: string }> = {
  "lead-conversion": { Icon: TrendingUp, accent: "from-rose-500 to-brand-pink", hint: "Conversion lift" },
  "marketing-roi": { Icon: IndianRupee, accent: "from-brand-blue to-primary", hint: "Campaign return" },
  "funnel-leakage": { Icon: Filter, accent: "from-orange-500 to-amber-500", hint: "Drop-off map" },
  "network-roi": { Icon: Network, accent: "from-brand-purple to-brand-pink", hint: "Dealer growth" },
  "whatsapp-savings": { Icon: MessageCircle, accent: "from-emerald-500 to-primary", hint: "Time saved" },
  "marketing-budget": { Icon: PieChart, accent: "from-sky-500 to-brand-blue", hint: "Channel mix" },
  "crm-roi": { Icon: Workflow, accent: "from-violet-500 to-brand-purple", hint: "Pipeline lift" },
  "erp-roi": { Icon: LayoutDashboard, accent: "from-slate-600 to-primary", hint: "Ops savings" },
  "dealer-expansion-roi": { Icon: Building2, accent: "from-primary to-brand-purple", hint: "Year-1 ROI" },
};

function MiniPreview({ id }: { id: CalcId }) {
  if (id === "funnel-leakage") {
    return (
      <div className="flex flex-col items-center gap-[3px] w-14" aria-hidden>
        <span className="h-1.5 w-14 rounded-sm bg-primary/35 group-hover:bg-primary/55 transition-colors" />
        <span className="h-1.5 w-10 rounded-sm bg-primary/25 group-hover:bg-primary/45 transition-colors" />
        <span className="h-1.5 w-6 rounded-sm bg-primary/15 group-hover:bg-primary/35 transition-colors" />
      </div>
    );
  }
  if (id === "marketing-budget") {
    return (
      <div className="flex h-9 w-9 overflow-hidden rounded-full ring-1 ring-border" aria-hidden>
        <span className="w-[40%] bg-primary/50 group-hover:bg-primary/70 transition-colors" />
        <span className="w-[35%] bg-primary/30" />
        <span className="w-[25%] bg-primary/15" />
      </div>
    );
  }
  const bars =
    id === "lead-conversion" || id === "crm-roi" || id === "dealer-expansion-roi"
      ? [40, 55, 48, 72, 88]
      : id === "whatsapp-savings" || id === "erp-roi"
        ? [70, 58, 44, 32, 22]
        : [45, 62, 50, 78, 64];
  return (
    <div className="flex items-end gap-[3px] h-9" aria-hidden>
      {bars.map((h, i) => (
        <span
          key={i}
          className="w-1.5 rounded-sm bg-primary/25 group-hover:bg-primary/55 transition-all duration-300"
          style={{ height: `${h}%` }}
        />
      ))}
    </div>
  );
}

const CALC_FIELDS: Record<CalcId, CalcField[]> = {
  "lead-conversion": [
    { key: "leads", label: "Monthly leads", default: 100, min: 1 },
    { key: "rate", label: "Current conversion %", default: 5, min: 0.1, max: 100 },
    { key: "improved", label: "Target conversion %", default: 15, min: 0.1, max: 100 },
  ],
  "marketing-roi": [
    { key: "spend", label: "Monthly ad spend (₹)", default: 50000, min: 1 },
    { key: "revenue", label: "Revenue attributed (₹)", default: 200000, min: 0 },
  ],
  "funnel-leakage": [
    { key: "top", label: "Top-of-funnel leads", default: 1000, min: 1 },
    { key: "mid", label: "Qualified leads", default: 300, min: 0 },
    { key: "bottom", label: "Closed deals", default: 80, min: 0 },
  ],
  "network-roi": [
    { key: "dealers", label: "New dealers planned", default: 10, min: 1 },
    { key: "avg", label: "Avg annual revenue/dealer (₹)", default: 500000, min: 1 },
  ],
  "whatsapp-savings": [
    { key: "hours", label: "Hours saved/month", default: 40, min: 1 },
    { key: "cost", label: "Cost per hour (₹)", default: 500, min: 1 },
  ],
  "marketing-budget": [
    { key: "budget", label: "Total monthly budget (₹)", default: 100000, min: 1000 },
    { key: "cpl", label: "Expected cost per lead (₹)", default: 250, min: 1 },
    { key: "metaPct", label: "Meta Ads allocation %", default: 40, min: 0, max: 100 },
  ],
  "crm-roi": [
    { key: "leads", label: "Monthly leads", default: 200, min: 1 },
    { key: "lift", label: "Expected conversion lift %", default: 20, min: 1, max: 200 },
    { key: "avgDeal", label: "Average deal value (₹)", default: 50000, min: 1 },
    { key: "baseRate", label: "Current conversion %", default: 8, min: 0.1, max: 100 },
  ],
  "erp-roi": [
    { key: "staffHours", label: "Manual hours saved/month", default: 60, min: 1 },
    { key: "hourlyCost", label: "Cost per hour (₹)", default: 400, min: 1 },
    { key: "errorSavings", label: "Monthly error/rework savings (₹)", default: 25000, min: 0 },
  ],
  "dealer-expansion-roi": [
    { key: "dealers", label: "New dealers to appoint", default: 15, min: 1 },
    { key: "costPerDealer", label: "Onboarding cost per dealer (₹)", default: 75000, min: 1 },
    { key: "yearOneRev", label: "Avg year-1 revenue per dealer (₹)", default: 800000, min: 1 },
  ],
};

function parseInputs(fields: CalcField[], raw: Record<string, number>): Record<string, number> | null {
  const out: Record<string, number> = {};
  for (const f of fields) {
    const v = raw[f.key];
    if (v == null || Number.isNaN(v) || !Number.isFinite(v)) {
      toast({ title: "Invalid input", description: `Enter a valid number for ${f.label}.`, variant: "destructive" });
      return null;
    }
    if (f.min != null && v < f.min) {
      toast({ title: "Invalid input", description: `${f.label} must be at least ${f.min}.`, variant: "destructive" });
      return null;
    }
    if (f.max != null && v > f.max) {
      toast({ title: "Invalid input", description: `${f.label} must be at most ${f.max}.`, variant: "destructive" });
      return null;
    }
    out[f.key] = v;
  }
  return out;
}

function compute(id: CalcId, inputs: Record<string, number>): CalcResult | null {
  switch (id) {
    case "lead-conversion": {
      const { leads, rate, improved } = inputs;
      if (improved <= rate) {
        toast({ title: "Invalid input", description: "Target conversion must be higher than current conversion.", variant: "destructive" });
        return null;
      }
      const before = leads * (rate / 100);
      const after = leads * (improved / 100);
      const extra = Math.round(after - before);
      return { summary: `Estimated additional conversions: ${extra}/month`, value: extra };
    }
    case "marketing-roi": {
      const { spend, revenue } = inputs;
      const roi = ((revenue - spend) / spend) * 100;
      return { summary: `ROI: ${roi.toFixed(0)}% on ₹${spend.toLocaleString("en-IN")} spend`, value: revenue - spend };
    }
    case "funnel-leakage": {
      const { top, mid, bottom } = inputs;
      if (mid > top || bottom > mid) {
        toast({ title: "Invalid funnel", description: "Qualified ≤ top and closed ≤ qualified.", variant: "destructive" });
        return null;
      }
      const lost = top - bottom;
      return { summary: `Potential leads lost in funnel: ${lost} (${((lost / top) * 100).toFixed(0)}%)`, value: lost };
    }
    case "network-roi": {
      const { dealers, avg } = inputs;
      const total = dealers * avg;
      return { summary: `Projected annual revenue from ${dealers} dealers: ₹${total.toLocaleString("en-IN")}`, value: total };
    }
    case "whatsapp-savings": {
      const { hours, cost } = inputs;
      const savings = hours * cost;
      return { summary: `Monthly savings: ₹${savings.toLocaleString("en-IN")} (${hours} staff-hours)`, value: savings };
    }
    case "marketing-budget": {
      const { budget, cpl, metaPct } = inputs;
      const metaSpend = budget * (metaPct / 100);
      const googleSpend = budget - metaSpend;
      const estLeads = Math.floor(budget / cpl);
      return {
        summary: `~${estLeads} leads/month · Meta ₹${Math.round(metaSpend).toLocaleString("en-IN")} · Google ₹${Math.round(googleSpend).toLocaleString("en-IN")}`,
        value: estLeads,
      };
    }
    case "crm-roi": {
      const { leads, lift, avgDeal, baseRate } = inputs;
      const current = leads * (baseRate / 100) * avgDeal;
      const improved = leads * (baseRate / 100) * (1 + lift / 100) * avgDeal;
      const gain = Math.round(improved - current);
      return { summary: `Estimated monthly revenue lift: ₹${gain.toLocaleString("en-IN")}`, value: gain };
    }
    case "erp-roi": {
      const { staffHours, hourlyCost, errorSavings } = inputs;
      const labor = staffHours * hourlyCost;
      const total = labor + errorSavings;
      return { summary: `Estimated monthly savings: ₹${total.toLocaleString("en-IN")}`, value: total };
    }
    case "dealer-expansion-roi": {
      const { dealers, costPerDealer, yearOneRev } = inputs;
      const investment = dealers * costPerDealer;
      const revenue = dealers * yearOneRev;
      const roi = ((revenue - investment) / investment) * 100;
      return {
        summary: `Year-1 ROI: ${roi.toFixed(0)}% · Revenue ₹${revenue.toLocaleString("en-IN")} vs investment ₹${investment.toLocaleString("en-IN")}`,
        value: revenue - investment,
      };
    }
    default:
      return null;
  }
}

const leadSchema = z.object({
  name: z.string().trim().min(2),
  mobile: z.string().trim().min(6),
  email: z.string().trim().email(),
});

export const CalculatorsSection = () => {
  const [active, setActive] = useState<CalcId | null>(null);
  const [inputs, setInputs] = useState<Record<string, number>>({});
  const [result, setResult] = useState<CalcResult | null>(null);
  const [showLead, setShowLead] = useState(false);
  const [lead, setLead] = useState({ name: "", mobile: "", email: "" });
  const [loading, setLoading] = useState(false);

  const openCalc = (id: CalcId) => {
    const fields = CALC_FIELDS[id];
    const defaults: Record<string, number> = {};
    fields.forEach((f) => { defaults[f.key] = f.default; });
    setInputs(defaults);
    setResult(null);
    setShowLead(false);
    setLead({ name: "", mobile: "", email: "" });
    setActive(id);
  };

  const runCalc = () => {
    if (!active) return;
    const fields = CALC_FIELDS[active];
    const parsed = parseInputs(fields, inputs);
    if (!parsed) return;
    const r = compute(active, parsed);
    if (!r) return;
    setResult(r);
    setShowLead(true);
    trackEvent("Calculator Started", { calculator: active });
  };

  const submitReport = async (e: React.FormEvent) => {
    e.preventDefault();
    const parsed = leadSchema.safeParse(lead);
    if (!parsed.success) {
      toast({ title: "Enter valid name, mobile and email", variant: "destructive" });
      return;
    }
    setLoading(true);
    const calc = CALCULATORS.find((c) => c.id === active);
    const res = await submitLead({
      name: parsed.data.name,
      phone: parsed.data.mobile,
      email: parsed.data.email,
      form_type: "calculator",
      calculator_type: active ?? undefined,
      product_interest: calc?.title ?? null,
      message: result?.summary ?? null,
      report_summary: result?.summary ?? null,
      source: "website-calculator",
    });
    setLoading(false);
    if (!res.ok) {
      toast({ title: "Could not submit", description: res.message, variant: "destructive" });
      return;
    }
    trackEvent("Calculator Completed", { calculator: active ?? "" });
    trackEvent("Lead Form Submitted", { form_type: "calculator" });
    toast({ title: "Full report request sent!", description: "We'll email your detailed report shortly." });
    setActive(null);
  };

  const handleInputChange = (key: string, value: string, fallback: number) => {
    if (value === "" || value === "-") {
      setInputs((p) => ({ ...p, [key]: NaN }));
      return;
    }
    const n = Number(value);
    setInputs((p) => ({ ...p, [key]: n }));
  };

  return (
    <section id="calculators" className="py-16 md:py-24 bg-background">
      <div className="container">
        <SectionHeader
          eyebrow="Tools"
          title="Discover Your Growth Potential"
          subtitle="Run a quick estimate — then submit your details to receive the full report from our team."
        />
        <div className="grid sm:grid-cols-2 xl:grid-cols-3 gap-5 md:gap-6">
          {CALCULATORS.map((c, i) => {
            const id = c.id as CalcId;
            const ui = CALC_UI[id];
            const Icon = ui.Icon;
            return (
              <motion.div
                key={c.id}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.04 }}
              >
                <button
                  type="button"
                  onClick={() => openCalc(id)}
                  className={cn(
                    "group flex h-full w-full min-h-[15.5rem] flex-col rounded-2xl border border-border bg-card p-5 md:p-6 text-left shadow-card",
                    "transition-all duration-300 hover:-translate-y-1 hover:border-primary/25 hover:shadow-elegant",
                    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/60",
                  )}
                >
                  <div className="mb-5 flex items-start justify-between gap-3">
                    <span
                      className={cn(
                        "inline-flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br text-white shadow-soft transition-transform duration-300 group-hover:scale-105",
                        ui.accent,
                      )}
                    >
                      <Icon className="h-5 w-5" />
                    </span>
                    <div className="flex flex-col items-end gap-1">
                      <MiniPreview id={id} />
                      <span className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
                        {ui.hint}
                      </span>
                    </div>
                  </div>
                  <h3 className="text-lg font-extrabold leading-snug mb-2">{c.title}</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed mb-5">{c.desc}</p>
                  <span className="mt-auto inline-flex items-center gap-1.5 text-sm font-bold text-primary group-hover:gap-2.5 transition-all">
                    Calculate now
                    <ArrowRight className="h-4 w-4" />
                  </span>
                </button>
              </motion.div>
            );
          })}
        </div>
      </div>

      <Dialog open={!!active} onOpenChange={(o) => !o && setActive(null)}>
        <DialogContent className="max-w-md max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{CALCULATORS.find((c) => c.id === active)?.title}</DialogTitle>
          </DialogHeader>
          {!showLead ? (
            <div className="space-y-4">
              {active && CALC_FIELDS[active].map((f) => (
                <div key={f.key} className="space-y-1.5">
                  <Label>{f.label}</Label>
                  <Input
                    type="number"
                    min={f.min}
                    max={f.max}
                    value={Number.isNaN(inputs[f.key]) ? "" : (inputs[f.key] ?? f.default)}
                    onChange={(e) => handleInputChange(f.key, e.target.value, f.default)}
                  />
                </div>
              ))}
              <Button variant="hero" className="w-full" onClick={runCalc}>Calculate</Button>
            </div>
          ) : (
            <div className="space-y-4">
              <p className="text-sm font-semibold text-primary bg-primary/10 p-3 rounded-lg">{result?.summary}</p>
              <p className="text-sm text-muted-foreground">Submit your details to receive the full report.</p>
              <form onSubmit={submitReport} className="space-y-3">
                <Input placeholder="Name *" value={lead.name} onChange={(e) => setLead((l) => ({ ...l, name: e.target.value }))} />
                <Input placeholder="Mobile *" value={lead.mobile} onChange={(e) => setLead((l) => ({ ...l, mobile: e.target.value }))} />
                <Input placeholder="Email *" type="email" value={lead.email} onChange={(e) => setLead((l) => ({ ...l, email: e.target.value }))} />
                <Button type="submit" variant="hero" className="w-full" disabled={loading}>
                  {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : "Get Full Report"}
                </Button>
              </form>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </section>
  );
};
