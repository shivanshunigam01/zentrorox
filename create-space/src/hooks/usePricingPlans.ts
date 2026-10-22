import { useCallback, useEffect, useState } from "react";
import { DEFAULT_PRICING_CATALOG, type FreeTrialOffer, type PricingPlan } from "@/data/pricingPlans";
import { fetchPricingCatalog, PLANS_UPDATED_EVENT, readPlansCache } from "@/lib/plans/plansApi";

export function usePricingPlans() {
  const cached = readPlansCache();
  const [plans, setPlans] = useState<PricingPlan[]>(cached?.plans ?? DEFAULT_PRICING_CATALOG.plans);
  const [trial, setTrial] = useState<FreeTrialOffer>(cached?.trial ?? DEFAULT_PRICING_CATALOG.trial);
  const [loading, setLoading] = useState(!cached);

  const refresh = useCallback(async () => {
    const catalog = await fetchPricingCatalog();
    setPlans(catalog.plans);
    setTrial(catalog.trial);
    setLoading(false);
  }, []);

  useEffect(() => {
    void refresh();
  }, [refresh]);

  useEffect(() => {
    const onUpdate = () => {
      void refresh();
    };
    window.addEventListener(PLANS_UPDATED_EVENT, onUpdate);
    return () => window.removeEventListener(PLANS_UPDATED_EVENT, onUpdate);
  }, [refresh]);

  return { plans, trial, loading, refresh };
}
