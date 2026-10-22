import { Check, Plus } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { additionalAddons, includedFeatures, isPaidPlan, type PricingPlan } from "@/data/pricingPlans";

type PricingPlanCardProps = {
  plan: PricingPlan;
  onSelect?: (plan: PricingPlan) => void;
  processing?: boolean;
  ctaHref?: string;
};

export function PricingPlanCard({ plan, onSelect, processing, ctaHref }: PricingPlanCardProps) {
  const included = includedFeatures(plan);
  const addons = additionalAddons(plan);
  const cycleLabel = plan.billingCycle === "yearly" ? "Yearly" : "Monthly";
  const showTrial = plan.freeTrialEnabled && plan.trialDays > 0;
  const ctaLabel = processing ? "Opening checkout…" : plan.cta;

  return (
    <article
      className={cn(
        "flex flex-col rounded-2xl border bg-card p-6 md:p-7 shadow-soft hover:shadow-elegant hover:-translate-y-1 transition-all",
        plan.highlighted ? "border-primary ring-2 ring-primary/30 shadow-elegant" : "border-border",
      )}
    >
      <div className="flex flex-wrap items-center gap-2 mb-3">
        <span className="text-xs font-bold uppercase tracking-widest text-muted-foreground">{plan.tier}</span>
        <Badge variant={plan.billingCycle === "yearly" ? "default" : "secondary"}>{cycleLabel}</Badge>
        {plan.highlighted ? <Badge>Most popular</Badge> : null}
        {showTrial ? (
          <Badge variant="outline" className="border-primary/40 text-primary">
            {plan.trialDays}-day trial
          </Badge>
        ) : null}
      </div>

      <h3 className="text-xl font-extrabold tracking-tight">{plan.name}</h3>
      <div className="mt-3 flex items-baseline gap-1">
        <span className="text-3xl md:text-4xl font-extrabold tracking-tight">{plan.priceLabel}</span>
        {plan.periodLabel ? <span className="text-sm text-muted-foreground">{plan.periodLabel}</span> : null}
      </div>
      <p className="mt-2 text-sm text-muted-foreground leading-relaxed">{plan.blurb}</p>

      {onSelect ? (
        <Button
          type="button"
          variant={plan.highlighted ? "hero" : "outline"}
          className="mt-5 mb-6 w-full"
          disabled={processing}
          onClick={() => onSelect(plan)}
        >
          {ctaLabel}
        </Button>
      ) : (
        <Button variant={plan.highlighted ? "hero" : "outline"} className="mt-5 mb-6 w-full" asChild>
          <Link to={ctaHref ?? `/register?plan=${encodeURIComponent(plan.slug || plan.id)}`}>{plan.cta}</Link>
        </Button>
      )}

      {included.length > 0 ? (
        <div className="mb-4">
          <p className="text-[11px] font-bold uppercase tracking-widest text-primary mb-2">Included in plan</p>
          <ul className="space-y-2">
            {included.map((f) => (
              <li key={f.id} className="flex gap-2 text-sm">
                <Check className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                <span>{f.label}</span>
              </li>
            ))}
          </ul>
        </div>
      ) : null}

      {addons.length > 0 ? (
        <div className="border-t border-border pt-4 mt-auto">
          <p className="text-[11px] font-bold uppercase tracking-widest text-amber-700 dark:text-amber-400 mb-2">
            Additional add-ons
          </p>
          <ul className="space-y-3">
            {addons.map((a) => (
              <li key={a.id} className="flex gap-2 text-sm text-muted-foreground">
                <Plus className="mt-0.5 h-4 w-4 shrink-0 text-amber-600" />
                <span>
                  <span className="text-foreground">{a.name}</span>
                  {a.priceLabel ? (
                    <span className="ml-1.5 text-[11px] font-semibold uppercase tracking-wide text-amber-700 dark:text-amber-400">
                      · {a.priceLabel}
                    </span>
                  ) : (
                    <span className="ml-1.5 text-[11px] font-semibold uppercase tracking-wide text-amber-700 dark:text-amber-400">
                      · Additional
                    </span>
                  )}
                  {a.description ? <span className="block text-xs mt-0.5">{a.description}</span> : null}
                </span>
              </li>
            ))}
          </ul>
        </div>
      ) : null}

      {!isPaidPlan(plan) && plan.amountInPaise === null ? (
        <p className="mt-4 text-xs text-muted-foreground">Custom pricing — our team will scope this with you.</p>
      ) : null}
    </article>
  );
}
