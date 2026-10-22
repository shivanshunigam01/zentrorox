import { useState } from "react";
import { PricingGrid } from "@/components/pricing/PricingGrid";
import { usePricingPlans } from "@/hooks/usePricingPlans";
import type { BillingCycle, PricingPlan, PricingPlanId } from "@/data/pricingPlans";

type PostRegisterPlanPickerProps = {
  onSelectPlan: (planId: PricingPlanId, planName: string) => void | Promise<void>;
  onSkip: () => void;
  onStartTrial?: () => void | Promise<void>;
  isProcessing?: boolean;
  processingPlanId?: PricingPlanId | null;
  trialProcessing?: boolean;
};

export const PostRegisterPlanPicker = ({
  onSelectPlan,
  onSkip,
  onStartTrial,
  isProcessing = false,
  processingPlanId = null,
  trialProcessing = false,
}: PostRegisterPlanPickerProps) => {
  const { plans, trial } = usePricingPlans();
  const [cycle, setCycle] = useState<BillingCycle>("monthly");

  const handleSelect = (plan: PricingPlan) => {
    void onSelectPlan(plan.slug || plan.id, plan.name);
  };

  return (
    <div className="p-4 text-card-foreground sm:p-6 md:p-8">
      <div className="mx-auto mb-8 max-w-2xl text-center">
        <h2 className="text-xl font-bold tracking-tight text-foreground md:text-2xl">Choose your plan</h2>
        <p className="mt-2 text-sm text-muted-foreground md:text-base">
          Basic or Pro, billed monthly or yearly. Included features and additional add-ons are labelled on each card.
        </p>
      </div>

      <PricingGrid
        plans={plans}
        trial={trial}
        cycle={cycle}
        onCycleChange={setCycle}
        onSelectPlan={handleSelect}
        onStartTrial={onStartTrial}
        processingPlanId={processingPlanId}
        trialProcessing={trialProcessing || isProcessing}
      />

      <div className="mt-8 text-center">
        <button
          type="button"
          disabled={!!isProcessing && !!processingPlanId}
          className="text-sm font-medium text-muted-foreground underline-offset-4 hover:text-foreground hover:underline disabled:opacity-50"
          onClick={onSkip}
        >
          I&apos;ll decide later
        </button>
      </div>
    </div>
  );
};
