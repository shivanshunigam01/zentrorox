import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowDown, ArrowUp, Plus, Trash2 } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { CmsModuleHeader } from "@/components/admin/cms/CmsModuleHeader";
import { uid } from "@/lib/cms/sections";
import { adminLogout } from "@/lib/admin/auth";
import { toast } from "@/hooks/use-toast";
import {
  DEFAULT_PRICING_CATALOG,
  type AddonKind,
  type BillingCycle,
  type FreeTrialOffer,
  type PlanAddon,
  type PlanTier,
  type PricingPlan,
} from "@/data/pricingPlans";
import {
  deletePricingPlan,
  fetchPricingCatalog,
  saveFreeTrial,
  savePricingCatalog,
  type PlansApiFail,
} from "@/lib/plans/plansApi";

function moveItem<T>(list: T[], from: number, to: number): T[] {
  if (to < 0 || to >= list.length) return list;
  const next = [...list];
  const [item] = next.splice(from, 1);
  next.splice(to, 0, item);
  return next;
}

const emptyAddon = (): PlanAddon => ({
  id: uid(),
  name: "",
  description: "",
  kind: "additional",
  priceLabel: "Additional",
  amountInPaise: null,
});

const emptyPlan = (): PricingPlan => ({
  id: uid(),
  slug: `plan-${Date.now()}`,
  name: "New plan",
  tier: "basic",
  billingCycle: "monthly",
  priceLabel: "₹0",
  periodLabel: "/month",
  amountInPaise: 0,
  blurb: "",
  cta: "Get started",
  highlighted: false,
  isActive: true,
  sortOrder: 99,
  trialDays: 14,
  freeTrialEnabled: true,
  featureLabels: [""],
  addons: [],
});

const AdminPlans = () => {
  const navigate = useNavigate();
  const [plans, setPlans] = useState<PricingPlan[]>(DEFAULT_PRICING_CATALOG.plans);
  const [trial, setTrial] = useState<FreeTrialOffer>(DEFAULT_PRICING_CATALOG.trial);
  const [saving, setSaving] = useState(false);

  const failSave = (result: PlansApiFail, title = "Save failed") => {
    toast({ title, description: result.error, variant: "destructive" });
    if (result.authExpired) {
      adminLogout();
      navigate("/admin/login", { replace: true });
    }
  };

  useEffect(() => {
    fetchPricingCatalog().then((catalog) => {
      setPlans(catalog.plans);
      setTrial(catalog.trial);
    });
  }, []);

  const updatePlan = (id: string, patch: Partial<PricingPlan>) =>
    setPlans((list) => list.map((p) => (p.id === id ? { ...p, ...patch } : p)));

  const updateAddon = (planId: string, addonId: string, patch: Partial<PlanAddon>) =>
    setPlans((list) =>
      list.map((p) =>
        p.id === planId ? { ...p, addons: p.addons.map((a) => (a.id === addonId ? { ...a, ...patch } : a)) } : p,
      ),
    );

  const handleSaveAll = async () => {
    setSaving(true);
    const ordered = plans.map((p, i) => ({ ...p, sortOrder: i + 1 }));
    const result = await savePricingCatalog({ trial, plans: ordered });
    setSaving(false);
    if (!result.ok) {
      failSave(result);
      return;
    }
    setPlans(result.catalog.plans);
    setTrial(result.catalog.trial);
    toast({
      title: "Plans published",
      description: "Visible on /pricing, registration, and the automation page.",
    });
  };

  const handleSaveTrial = async () => {
    setSaving(true);
    const result = await saveFreeTrial(trial);
    setSaving(false);
    if (!result.ok) {
      failSave(result, "Trial save failed");
      return;
    }
    setTrial(result.trial);
    toast({ title: "Free trial updated", description: "Shown on /pricing and after registration." });
  };

  const handleDelete = async (plan: PricingPlan) => {
    if (!window.confirm(`Delete “${plan.name}”? This removes it from the user pricing page.`)) return;
    const result = await deletePricingPlan(plan.id);
    if (!result.ok) {
      failSave(result, "Delete failed");
      return;
    }
    const next = plans.filter((p) => p.id !== plan.id);
    setPlans(next);
    toast({ title: "Plan deleted", description: `${plan.name} is no longer published.` });
  };

  return (
    <div className="space-y-6">
      <CmsModuleHeader
        title="Pricing plans"
        description="Basic Monthly, Basic Yearly, Pro Monthly, Pro Yearly — plus free trial and add-ons. Live on /pricing."
        onSave={handleSaveAll}
        saving={saving}
      />

      <Card>
        <CardHeader className="flex flex-row items-start justify-between gap-4">
          <div>
            <CardTitle className="text-base">Free trial</CardTitle>
            <CardDescription>Shown as a banner on /pricing and after user registration.</CardDescription>
          </div>
          <div className="flex items-center gap-2">
            <Label htmlFor="trial-enabled">Enabled</Label>
            <Switch
              id="trial-enabled"
              checked={trial.enabled}
              onCheckedChange={(enabled) => setTrial((t) => ({ ...t, enabled }))}
            />
          </div>
        </CardHeader>
        <CardContent className="grid gap-4">
          <div className="grid sm:grid-cols-2 gap-4">
            <div className="grid gap-2">
              <Label>Trial days</Label>
              <Input
                type="number"
                min={0}
                value={trial.days}
                onChange={(e) => setTrial((t) => ({ ...t, days: Number(e.target.value) || 0 }))}
              />
            </div>
            <div className="grid gap-2">
              <Label>CTA label</Label>
              <Input value={trial.cta} onChange={(e) => setTrial((t) => ({ ...t, cta: e.target.value }))} />
            </div>
          </div>
          <div className="grid gap-2">
            <Label>Title</Label>
            <Input value={trial.title} onChange={(e) => setTrial((t) => ({ ...t, title: e.target.value }))} />
          </div>
          <div className="grid gap-2">
            <Label>Description</Label>
            <Textarea value={trial.blurb} onChange={(e) => setTrial((t) => ({ ...t, blurb: e.target.value }))} />
          </div>
          <div className="grid gap-2">
            <Label>Trial features (one per line)</Label>
            <Textarea
              rows={4}
              value={trial.features.join("\n")}
              onChange={(e) =>
                setTrial((t) => ({
                  ...t,
                  features: e.target.value.split("\n").map((s) => s.trim()).filter(Boolean),
                }))
              }
            />
          </div>
          <div>
            <Button variant="outline" size="sm" onClick={() => void handleSaveTrial()} disabled={saving}>
              Save trial only
            </Button>
          </div>
        </CardContent>
      </Card>

      <Button variant="outline" size="sm" onClick={() => setPlans((list) => [...list, emptyPlan()])}>
        <Plus className="h-4 w-4" /> Add plan
      </Button>

      {plans.map((plan, index) => (
        <Card key={plan.id}>
          <CardHeader className="pb-2">
            <div className="flex justify-between items-start gap-3">
              <div>
                <CardTitle className="text-base flex items-center gap-2 flex-wrap">
                  <span className="text-muted-foreground font-mono text-xs">#{index + 1}</span>
                  {plan.name || "Untitled plan"}
                  <Badge variant="secondary" className="capitalize">
                    {plan.tier} · {plan.billingCycle}
                  </Badge>
                  {!plan.isActive ? <Badge variant="outline">Hidden</Badge> : null}
                </CardTitle>
                <CardDescription>
                  slug: {plan.slug} · Razorpay planId must match this slug
                </CardDescription>
              </div>
              <div className="flex gap-1 shrink-0">
                <Button
                  variant="ghost"
                  size="sm"
                  disabled={index === 0}
                  onClick={() => setPlans((list) => moveItem(list, index, index - 1))}
                >
                  <ArrowUp className="h-4 w-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  disabled={index === plans.length - 1}
                  onClick={() => setPlans((list) => moveItem(list, index, index + 1))}
                >
                  <ArrowDown className="h-4 w-4" />
                </Button>
                <Button variant="ghost" size="sm" onClick={() => void handleDelete(plan)}>
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent className="grid gap-4">
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="grid gap-2">
                <Label>Display name</Label>
                <Input value={plan.name} onChange={(e) => updatePlan(plan.id, { name: e.target.value })} />
              </div>
              <div className="grid gap-2">
                <Label>Slug (planId)</Label>
                <Input value={plan.slug} onChange={(e) => updatePlan(plan.id, { slug: e.target.value.trim() })} />
              </div>
              <div className="grid gap-2">
                <Label>Tier</Label>
                <Select value={plan.tier} onValueChange={(tier) => updatePlan(plan.id, { tier: tier as PlanTier })}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="basic">Basic</SelectItem>
                    <SelectItem value="pro">Pro</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="grid gap-2">
                <Label>Billing cycle</Label>
                <Select
                  value={plan.billingCycle}
                  onValueChange={(billingCycle) =>
                    updatePlan(plan.id, {
                      billingCycle: billingCycle as BillingCycle,
                      periodLabel: billingCycle === "yearly" ? "/year" : "/month",
                    })
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="monthly">Monthly</SelectItem>
                    <SelectItem value="yearly">Yearly</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="grid gap-2">
                <Label>Price label</Label>
                <Input
                  value={plan.priceLabel}
                  onChange={(e) => updatePlan(plan.id, { priceLabel: e.target.value })}
                />
              </div>
              <div className="grid gap-2">
                <Label>Period label</Label>
                <Input
                  value={plan.periodLabel}
                  onChange={(e) => updatePlan(plan.id, { periodLabel: e.target.value })}
                />
              </div>
              <div className="grid gap-2">
                <Label>Amount (paise)</Label>
                <Input
                  type="number"
                  min={0}
                  placeholder="Leave empty for custom"
                  value={plan.amountInPaise ?? ""}
                  onChange={(e) => {
                    const raw = e.target.value;
                    updatePlan(plan.id, { amountInPaise: raw === "" ? null : Number(raw) });
                  }}
                />
              </div>
              <div className="grid gap-2">
                <Label>Trial days on this plan</Label>
                <Input
                  type="number"
                  min={0}
                  value={plan.trialDays}
                  onChange={(e) =>
                    updatePlan(plan.id, {
                      trialDays: Number(e.target.value) || 0,
                      freeTrialEnabled: (Number(e.target.value) || 0) > 0,
                    })
                  }
                />
              </div>
            </div>

            <div className="grid sm:grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label>Short description</Label>
                <Textarea value={plan.blurb} onChange={(e) => updatePlan(plan.id, { blurb: e.target.value })} />
              </div>
              <div className="grid gap-2">
                <Label>CTA button</Label>
                <Input value={plan.cta} onChange={(e) => updatePlan(plan.id, { cta: e.target.value })} />
                <div className="flex flex-wrap items-center gap-6 pt-2">
                  <label className="flex items-center gap-2 text-sm">
                    <Switch
                      checked={plan.highlighted}
                      onCheckedChange={(highlighted) => updatePlan(plan.id, { highlighted })}
                    />
                    Highlighted
                  </label>
                  <label className="flex items-center gap-2 text-sm">
                    <Switch
                      checked={plan.isActive}
                      onCheckedChange={(isActive) => updatePlan(plan.id, { isActive })}
                    />
                    Visible on site
                  </label>
                </div>
              </div>
            </div>

            <div className="grid gap-2">
              <Label>Included in plan (one per line)</Label>
              <Textarea
                rows={5}
                value={plan.featureLabels.join("\n")}
                onChange={(e) => updatePlan(plan.id, { featureLabels: e.target.value.split("\n") })}
              />
            </div>

            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <Label>Add-ons</Label>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => updatePlan(plan.id, { addons: [...plan.addons, emptyAddon()] })}
                >
                  <Plus className="h-4 w-4" /> Add-on
                </Button>
              </div>
              {plan.addons.map((a) => (
                <div key={a.id} className="rounded-lg border border-border p-3 grid gap-2">
                  <div className="grid sm:grid-cols-12 gap-2 items-center">
                    <div className="sm:col-span-3">
                      <Select
                        value={a.kind}
                        onValueChange={(kind) => updateAddon(plan.id, a.id, { kind: kind as AddonKind })}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="included">Included in plan</SelectItem>
                          <SelectItem value="additional">Additional add-on</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="sm:col-span-4">
                      <Input
                        placeholder="Add-on name"
                        value={a.name}
                        onChange={(e) => updateAddon(plan.id, a.id, { name: e.target.value })}
                      />
                    </div>
                    <div className="sm:col-span-4">
                      <Input
                        placeholder="Price label e.g. ₹4,999/mo"
                        disabled={a.kind === "included"}
                        value={a.priceLabel}
                        onChange={(e) => updateAddon(plan.id, a.id, { priceLabel: e.target.value })}
                      />
                    </div>
                    <div className="sm:col-span-1 flex justify-end">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => updatePlan(plan.id, { addons: plan.addons.filter((x) => x.id !== a.id) })}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                  <Input
                    placeholder="Short description"
                    value={a.description}
                    onChange={(e) => updateAddon(plan.id, a.id, { description: e.target.value })}
                  />
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default AdminPlans;
