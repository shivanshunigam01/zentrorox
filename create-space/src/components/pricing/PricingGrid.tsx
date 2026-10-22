import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Check, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { plansForCycle, type BillingCycle, type FreeTrialOffer, type PricingPlan } from "@/data/pricingPlans";
import { PricingPlanCard } from "./PricingPlanCard";

type PricingGridProps = {
  plans: PricingPlan[];
  trial: FreeTrialOffer;
  cycle: BillingCycle;
  onCycleChange: (cycle: BillingCycle) => void;
  onSelectPlan?: (plan: PricingPlan) => void;
  onStartTrial?: () => void;
  processingPlanId?: string | null;
  trialHref?: string;
  trialProcessing?: boolean;
};

export function PricingGrid({
  plans,
  trial,
  cycle,
  onCycleChange,
  onSelectPlan,
  onStartTrial,
  processingPlanId,
  trialHref = "/register?trial=1",
  trialProcessing,
}: PricingGridProps) {
  const visible = plansForCycle(plans, cycle);
  const yearlySavings = cycle === "yearly";

  return (
    <div>
      <div className="flex flex-col items-center gap-4 mb-10">
        <div className="inline-flex rounded-full border border-border bg-muted/40 p-1 shadow-soft">
          {(["monthly", "yearly"] as const).map((c) => (
            <button
              key={c}
              type="button"
              onClick={() => onCycleChange(c)}
              className={cn(
                "rounded-full px-5 py-2 text-sm font-semibold capitalize transition-all",
                cycle === c ? "bg-primary text-primary-foreground shadow-soft" : "text-muted-foreground hover:text-foreground",
              )}
            >
              {c === "yearly" ? "Yearly" : "Monthly"}
            </button>
          ))}
        </div>
        {yearlySavings ? (
          <p className="text-sm text-primary font-semibold">Yearly billing — save two months versus monthly.</p>
        ) : null}
      </div>

      {trial.enabled ? (
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-10 rounded-2xl border border-primary/30 bg-gradient-to-br from-primary/10 via-card to-card p-6 md:p-8 shadow-soft"
        >
          <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
            <div className="max-w-xl">
              <div className="inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/10 px-3 py-1 text-xs font-bold uppercase tracking-widest text-primary mb-3">
                <Sparkles className="h-3.5 w-3.5" /> Free trial
              </div>
              <h3 className="text-2xl font-extrabold tracking-tight">{trial.title}</h3>
              <p className="mt-2 text-sm md:text-base text-muted-foreground leading-relaxed">{trial.blurb}</p>
              {trial.features.length > 0 ? (
                <ul className="mt-4 grid sm:grid-cols-2 gap-2">
                  {trial.features.map((f) => (
                    <li key={f} className="flex gap-2 text-sm">
                      <Check className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                      {f}
                    </li>
                  ))}
                </ul>
              ) : null}
            </div>
            {onStartTrial ? (
              <Button variant="hero" size="lg" className="shrink-0" disabled={trialProcessing} onClick={onStartTrial}>
                {trialProcessing ? "Starting…" : trial.cta}
              </Button>
            ) : (
              <Button variant="hero" size="lg" className="shrink-0" asChild>
                <Link to={trialHref}>{trial.cta}</Link>
              </Button>
            )}
          </div>
        </motion.div>
      ) : null}

      <div className={cn("grid gap-6", visible.length >= 3 ? "md:grid-cols-2 xl:grid-cols-3" : "md:grid-cols-2 max-w-4xl mx-auto")}>
        {visible.map((plan, i) => (
          <motion.div
            key={plan.id}
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.06 }}
          >
            <PricingPlanCard
              plan={plan}
              onSelect={onSelectPlan}
              processing={processingPlanId === plan.id || processingPlanId === plan.slug}
            />
          </motion.div>
        ))}
      </div>

      {visible.length === 0 ? (
        <p className="text-center text-muted-foreground">No {cycle} plans are published yet.</p>
      ) : null}

      <div className="mt-8 flex flex-wrap justify-center gap-4 text-xs text-muted-foreground">
        <span className="inline-flex items-center gap-1.5">
          <span className="h-2 w-2 rounded-full bg-primary" /> Included in plan
        </span>
        <span className="inline-flex items-center gap-1.5">
          <span className="h-2 w-2 rounded-full bg-amber-500" /> Additional add-on (not part of base price)
        </span>
      </div>
    </div>
  );
}
