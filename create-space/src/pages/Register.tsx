import { useEffect, useState } from "react";
import { Link, useLocation, useNavigate, type Location } from "react-router-dom";
import { GoogleLogin } from "@react-oauth/google";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { PostRegisterPlanPicker } from "@/components/auth/PostRegisterPlanPicker";
import { demoUserFromApiPublic, upsertDemoUserFromApi, saveSelectedPlanForSession } from "@/lib/demoAuth";
import { fetchAuthExists, registerAccountApi } from "@/lib/authApi";
import { parseGoogleJwtPayload } from "@/lib/googleJwt";
import { openRazorpayCheckoutForPlan } from "@/lib/razorpayCheckout";
import { cn } from "@/lib/utils";
import { findPlanByIdOrSlug, isPaidPlan, type PricingPlanId } from "@/data/pricingPlans";
import { usePricingPlans } from "@/hooks/usePricingPlans";
import { startFreeTrial } from "@/lib/plans/plansApi";
import { toast } from "sonner";
import { createAisensyBusiness } from "@/lib/aisensyApi";
import { rememberAisensyBusinessId } from "@/lib/aisensyStore";
import {
  COUNTRIES,
  COMPANY_SIZES,
  INDUSTRIES,
  PHONE_DIAL_OPTIONS,
  STATES_BY_COUNTRY,
  TIMEZONE_OPTIONS,
} from "@/data/accountFormOptions";

type RegisterLocationState = {
  backgroundLocation?: Location;
  googleDraft?: { name?: string; email?: string; picture?: string };
};

type RegisterProps = {
  isPopup?: boolean;
};

type Phase = "form" | "plan" | "done";

const fieldClass =
  "h-11 rounded-xl border border-border bg-slate-100 text-slate-900 shadow-sm placeholder:text-slate-500 focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background";

const selectTriggerClass =
  "h-11 w-full rounded-xl border border-border bg-slate-100 text-left text-slate-900 focus:ring-2 focus:ring-ring focus:ring-offset-2 focus:ring-offset-background";

const textareaClass =
  "min-h-[100px] rounded-xl border border-border bg-slate-100 text-slate-900 shadow-sm placeholder:text-slate-500 focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background";

const Register = ({ isPopup = false }: RegisterProps) => {
  const navigate = useNavigate();
  const location = useLocation();
  const backgroundLocation = (location.state as RegisterLocationState | null)?.backgroundLocation;

  const [phase, setPhase] = useState<Phase>("form");
  const [step, setStep] = useState(1);
  const [isGoogleSignup, setIsGoogleSignup] = useState(false);
  const [profilePic, setProfilePic] = useState<string | undefined>();

  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [phoneDial, setPhoneDial] = useState<string | undefined>(undefined);
  const [phoneNational, setPhoneNational] = useState("");

  const [companyName, setCompanyName] = useState("");
  const [companyDescription, setCompanyDescription] = useState("");
  const [country, setCountry] = useState<string | undefined>(undefined);
  const [stateRegion, setStateRegion] = useState<string | undefined>(undefined);
  const [companySize, setCompanySize] = useState<string | undefined>(undefined);
  const [industry, setIndustry] = useState<string | undefined>(undefined);
  const [websiteUrl, setWebsiteUrl] = useState("");
  const [timezone, setTimezone] = useState<string | undefined>(undefined);

  const [submitting, setSubmitting] = useState(false);
  const [step1Busy, setStep1Busy] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [planPaymentBusy, setPlanPaymentBusy] = useState(false);
  const [processingPlanId, setProcessingPlanId] = useState<PricingPlanId | null>(null);
  const [trialBusy, setTrialBusy] = useState(false);
  const { plans, trial } = usePricingPlans();

  useEffect(() => {
    const draft = (location.state as RegisterLocationState | null)?.googleDraft;
    if (!draft?.email) return;
    setEmail(draft.email);
    setFullName(draft.name ?? "");
    setProfilePic(draft.picture);
    setIsGoogleSignup(true);
  }, [location.state]);

  useEffect(() => {
    if (!country) {
      setStateRegion(undefined);
      return;
    }
    const opts = STATES_BY_COUNTRY[country] ?? STATES_BY_COUNTRY.Other;
    setStateRegion((prev) => (prev && opts.includes(prev) ? prev : undefined));
  }, [country]);

  const stateOptions = country ? STATES_BY_COUNTRY[country] ?? STATES_BY_COUNTRY.Other : [];

  const onGoogleRegisterSuccess = (credential: string | undefined) => {
    if (!credential) {
      setError("Google did not return a login token.");
      return;
    }
    const parsed = parseGoogleJwtPayload(credential);
    if (!parsed?.email) {
      setError("Google did not return an email address.");
      return;
    }
    setEmail(parsed.email);
    setFullName(parsed.name ?? "");
    setProfilePic(parsed.picture);
    setIsGoogleSignup(true);
    setError("");
  };

  const onContinueStep1 = async () => {
    setError("");
    if (!phoneDial) {
      setError("Please select a country code for your phone number.");
      return;
    }
    if (!fullName.trim() || !email.trim() || !phoneNational.trim()) {
      setError("Please enter your full name, email, and phone number.");
      return;
    }
    setStep1Busy(true);
    try {
      const ex = await fetchAuthExists(email.trim());
      if (ex.exists) {
        setError("An account with this email already exists.");
        return;
      }
      setStep(2);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not verify email. Is the API running?");
    } finally {
      setStep1Busy(false);
    }
  };

  const onFinish = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setMessage("");
    if (!country?.trim() || !stateRegion?.trim() || !companySize?.trim() || !industry?.trim() || !timezone?.trim()) {
      setError("Please select country, state / region, company size, industry, and timezone.");
      return;
    }
    setSubmitting(true);
    const profile = {
      fullName: fullName.trim(),
      email: email.trim(),
      phoneDialCode: PHONE_DIAL_OPTIONS.find((o) => o.label === phoneDial)?.code ?? "",
      phoneNational: phoneNational.trim(),
      companyName: companyName.trim(),
      companyDescription: companyDescription.trim(),
      country,
      state: stateRegion,
      companySize,
      industry,
      websiteUrl: websiteUrl.trim(),
      timezone,
      picture: profilePic,
    };
    try {
      const apiUser = await registerAccountApi({
        ...profile,
        authMethod: isGoogleSignup ? "google" : "pending",
      });
      upsertDemoUserFromApi(demoUserFromApiPublic(apiUser));

      // Provision AiSensy WhatsApp business (ZentroBOT) — direct API call
      try {
        const contact = `${(phoneDial ?? "").replace(/[^\d]/g, "")}${phoneNational.replace(/[^\d]/g, "")}`;
        const aisensyRes = await createAisensyBusiness({
          display_name: fullName.trim(),
          email: email.trim(),
          company: companyName.trim() || fullName.trim(),
          contact,
          timezone: "Asia/Calcutta GMT+05:30",
          currency: "INR",
          companySize: companySize ?? "10 - 20",
        });
        const businessId: string | undefined =
          aisensyRes?.aisensy?.id ??
          aisensyRes?.aisensy?.business_id ??
          aisensyRes?.aisensy?._id;
        if (businessId) {
          rememberAisensyBusinessId(email.trim(), businessId);
        }
        if (aisensyRes?.generatedPassword) {
          toast.success("WhatsApp workspace created on AiSensy.", {
            description: `Temporary password: ${aisensyRes.generatedPassword}`,
            duration: 15000,
          });
        } else {
          toast.success("WhatsApp workspace created on AiSensy.");
        }
      } catch (aisensyEx) {
        console.warn("AiSensy provisioning failed", aisensyEx);
        toast.warning(
          aisensyEx instanceof Error
            ? `AiSensy: ${aisensyEx.message}`
            : "Account created. AiSensy provisioning will be retried later.",
        );
      }

      setPhase("plan");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Registration failed. Is the API running?");
    } finally {
      setSubmitting(false);
    }
  };

  const handlePlanSelect = async (planId: PricingPlanId, planName: string) => {
    const def = findPlanByIdOrSlug(plans, planId);
    if (!def) return;

    if (!isPaidPlan(def)) {
      saveSelectedPlanForSession(def.slug || planId);
      setPhase("done");
      setMessage(
        def.amountInPaise === null
          ? `Thanks — we saved ${planName} on your profile. Our team will contact you for scoping and pricing.`
          : `Your workspace is on the ${planName} plan.`,
      );
      return;
    }

    setProcessingPlanId(planId);
    setPlanPaymentBusy(true);
    await openRazorpayCheckoutForPlan({
      planId: def.slug || planId,
      planName,
      email: email.trim(),
      name: fullName.trim(),
      contact: `${PHONE_DIAL_OPTIONS.find((o) => o.label === phoneDial)?.code ?? ""}${phoneNational}`,
      onPaid: (paymentId) => {
        saveSelectedPlanForSession(def.slug || planId, paymentId);
        setPhase("done");
        setMessage(`Payment received. Your workspace is on the ${planName} plan.`);
        toast.success("Payment successful");
        setPlanPaymentBusy(false);
        setProcessingPlanId(null);
      },
      onFailure: (reason) => {
        setPlanPaymentBusy(false);
        setProcessingPlanId(null);
        if (reason && reason !== "dismiss") {
          toast.error(
            reason === "script" || reason === "verify"
              ? "Payment could not complete. Ensure the payment server is running (see README) or try again."
              : reason,
          );
        }
      },
    });
  };

  const handleStartTrial = async () => {
    setTrialBusy(true);
    const result = await startFreeTrial(email.trim(), "basic-monthly");
    saveSelectedPlanForSession("free-trial");
    setTrialBusy(false);
    setPhase("done");
    setMessage(`Your ${trial.days}-day free trial is active. Upgrade anytime from Pricing.`);
    if (result.ok) toast.success("Free trial started");
  };

  const onPlanSkip = () => {
    setPhase("done");
    setMessage("Account created. You can pick a plan anytime from the pricing page.");
  };

  const formCard = (
    <div className="rounded-2xl border border-border bg-card p-6 text-card-foreground shadow-2xl md:p-8">
      {phase === "done" ? (
        <>
          <h2 className="text-2xl font-bold tracking-tight text-foreground">You&apos;re all set</h2>
          <p className="mt-3 text-sm font-medium text-primary md:text-base">{message}</p>
          <Button variant="hero" size="lg" className="mt-6 w-full rounded-xl font-semibold sm:w-auto" asChild>
            <Link to="/automation" state={backgroundLocation ? { backgroundLocation } : undefined}>
              Go to Zentrobot
            </Link>
          </Button>
        </>
      ) : (
        <>
          {step === 1 ? (
            <>
              <p className="text-xs font-semibold uppercase tracking-wide text-primary">Step 1 of 2</p>
              <h1 className="mt-1 text-2xl font-bold tracking-tight text-foreground">Create Your Zentroverse Global Account</h1>
              <p className="mt-2 text-sm text-muted-foreground">Fill in the details below.</p>

              {!isGoogleSignup ? (
                <div className="mt-6 space-y-4">
                  <div className="flex w-full justify-center overflow-hidden rounded-xl border border-border bg-background/60 py-2">
                    <GoogleLogin
                      onSuccess={(credentialResponse) => onGoogleRegisterSuccess(credentialResponse.credential)}
                      onError={() => setError("Google sign-up failed. Please try again.")}
                      theme="filled_black"
                      size="large"
                      shape="rectangular"
                      text="signup_with"
                      width={340}
                    />
                  </div>
                  <div className="relative my-2">
                    <div className="absolute inset-0 flex items-center" aria-hidden>
                      <span className="w-full border-t border-border" />
                    </div>
                    <div className="relative flex justify-center text-xs uppercase">
                      <span className="bg-card px-3 font-medium text-muted-foreground">Or use email</span>
                    </div>
                  </div>
                </div>
              ) : null}

              <div className="mt-6 space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="reg-fullName" className="text-foreground">
                    Full name
                  </Label>
                  <Input
                    id="reg-fullName"
                    autoComplete="name"
                    value={fullName}
                    onChange={(ev) => setFullName(ev.target.value)}
                    placeholder="Full name"
                    className={fieldClass}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="reg-email" className="text-foreground">
                    Email
                  </Label>
                  <Input
                    id="reg-email"
                    type="email"
                    autoComplete="email"
                    value={email}
                    onChange={(ev) => setEmail(ev.target.value)}
                    placeholder="you@company.com"
                    readOnly={isGoogleSignup}
                    className={fieldClass}
                  />
                </div>
                <div className="space-y-2">
                  <Label className="text-foreground">Phone number</Label>
                  <div className="flex w-full min-w-0 gap-2">
                    <Select value={phoneDial ?? undefined} onValueChange={setPhoneDial}>
                      <SelectTrigger
                        className={cn(
                          selectTriggerClass,
                          "h-11 w-[6rem] max-w-[6.5rem] shrink-0 px-2 text-sm font-semibold tabular-nums",
                          "justify-center",
                        )}
                        aria-label="Country code"
                        title={phoneDial ?? "Select country code"}
                      >
                        <SelectValue placeholder="Code">
                          {PHONE_DIAL_OPTIONS.find((o) => o.label === phoneDial)?.code ?? "Code"}
                        </SelectValue>
                      </SelectTrigger>
                      <SelectContent align="start" className="max-h-72 min-w-[16rem]">
                        {PHONE_DIAL_OPTIONS.map((o) => (
                          <SelectItem key={o.label} value={o.label} title={o.label} className="font-semibold tabular-nums">
                            {o.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <Input
                      id="reg-phone"
                      type="tel"
                      autoComplete="tel-national"
                      value={phoneNational}
                      onChange={(ev) => setPhoneNational(ev.target.value)}
                      placeholder="Phone number"
                      className={cn(fieldClass, "min-w-0 flex-1 basis-0")}
                    />
                  </div>
                </div>

                <p className="text-xs text-muted-foreground">
                  {isGoogleSignup
                    ? "You are signing up with Google. Complete company details on the next step."
                    : "Access is provisioned by your administrator. You will sign in with email and password after your account is activated."}
                </p>

                <Button
                  type="button"
                  variant="hero"
                  size="lg"
                  className="w-full font-semibold"
                  disabled={step1Busy}
                  onClick={() => void onContinueStep1()}
                >
                  {step1Busy ? "Checking…" : "Continue"}
                </Button>
              </div>
            </>
          ) : (
            <form onSubmit={onFinish}>
              <p className="text-xs font-semibold uppercase tracking-wide text-primary">Step 2 of 2</p>
              <h1 className="mt-1 text-2xl font-bold tracking-tight text-foreground">Tell us a bit about yourself</h1>
              <p className="mt-2 text-sm text-muted-foreground">
                Please fill in the following details to help us customize your experience.
              </p>

              <div className="mt-6 space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="co-name" className="text-foreground">
                    Company name
                  </Label>
                  <Input
                    id="co-name"
                    value={companyName}
                    onChange={(ev) => setCompanyName(ev.target.value)}
                    placeholder="Company name"
                    className={fieldClass}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="co-desc" className="text-foreground">
                    Company description
                  </Label>
                  <Textarea
                    id="co-desc"
                    value={companyDescription}
                    onChange={(ev) => setCompanyDescription(ev.target.value)}
                    placeholder="Company description"
                    className={textareaClass}
                  />
                </div>
                <div className="space-y-2">
                  <Label className="text-foreground">Country</Label>
                  <Select value={country ?? undefined} onValueChange={setCountry}>
                    <SelectTrigger className={selectTriggerClass}>
                      <SelectValue placeholder="Select country" />
                    </SelectTrigger>
                    <SelectContent>
                      {COUNTRIES.map((c) => (
                        <SelectItem key={c} value={c}>
                          {c}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label className="text-foreground">State / region</Label>
                  <Select
                    value={stateRegion ?? undefined}
                    onValueChange={setStateRegion}
                    disabled={!country}
                  >
                    <SelectTrigger className={selectTriggerClass}>
                      <SelectValue placeholder={country ? "Select state / region" : "Choose country first"} />
                    </SelectTrigger>
                    <SelectContent>
                      {stateOptions.map((s) => (
                        <SelectItem key={s} value={s}>
                          {s}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label className="text-foreground">Company size</Label>
                  <Select value={companySize ?? undefined} onValueChange={setCompanySize}>
                    <SelectTrigger className={selectTriggerClass}>
                      <SelectValue placeholder="Select company size" />
                    </SelectTrigger>
                    <SelectContent>
                      {COMPANY_SIZES.map((s) => (
                        <SelectItem key={s} value={s}>
                          {s}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label className="text-foreground">Industry</Label>
                  <Select value={industry ?? undefined} onValueChange={setIndustry}>
                    <SelectTrigger className={selectTriggerClass}>
                      <SelectValue placeholder="Select industry" />
                    </SelectTrigger>
                    <SelectContent>
                      {INDUSTRIES.map((s) => (
                        <SelectItem key={s} value={s}>
                          {s}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="co-web" className="text-foreground">
                    Website URL
                  </Label>
                  <Input
                    id="co-web"
                    type="url"
                    inputMode="url"
                    value={websiteUrl}
                    onChange={(ev) => setWebsiteUrl(ev.target.value)}
                    placeholder="https://example.com"
                    className={fieldClass}
                  />
                </div>
                <div className="space-y-2">
                  <Label className="text-foreground">Timezone</Label>
                  <Select value={timezone ?? undefined} onValueChange={setTimezone}>
                    <SelectTrigger className={selectTriggerClass}>
                      <SelectValue placeholder="Select timezone" />
                    </SelectTrigger>
                    <SelectContent>
                      {TIMEZONE_OPTIONS.map((tz) => (
                        <SelectItem key={tz.value} value={tz.value}>
                          {tz.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="flex flex-col gap-3 pt-2 sm:flex-row sm:justify-between">
                  <Button type="button" variant="outline" className="rounded-xl sm:w-auto" onClick={() => setStep(1)}>
                    Back
                  </Button>
                  <Button
                    type="submit"
                    variant="hero"
                    size="lg"
                    disabled={submitting}
                    className="w-full font-semibold sm:ml-auto sm:w-auto sm:min-w-[200px]"
                  >
                    {submitting ? "Saving…" : "Start"}
                  </Button>
                </div>
              </div>
            </form>
          )}

          {error ? <p className="mt-4 text-sm text-destructive">{error}</p> : null}

          <p className="mt-6 text-center text-sm text-muted-foreground">
            Already have an account?{" "}
            <Link
              to="/login"
              state={backgroundLocation ? { backgroundLocation } : undefined}
              className="font-semibold text-primary underline-offset-4 hover:underline"
            >
              Sign in
            </Link>
          </p>
        </>
      )}
    </div>
  );

  const handlePopupOpenChange = (open: boolean) => {
    if (open) return;
    if (phase === "plan") {
      onPlanSkip();
      return;
    }
    if (phase === "done") {
      navigate(-1);
      return;
    }
    navigate(-1);
  };

  if (isPopup) {
    return (
      <Dialog open onOpenChange={handlePopupOpenChange}>
        <DialogContent
          className={cn(
            "theme-automation max-h-[min(90vh,760px)] overflow-y-auto border-border bg-card p-0 text-card-foreground",
            phase === "plan" ? "max-w-6xl" : "max-w-xl",
          )}
        >
          {phase === "plan" ? (
            <>
              <DialogHeader className="border-b border-border px-4 pb-4 pt-2 text-center sm:px-6 sm:pb-6 sm:pt-4">
                <DialogTitle className="text-xl md:text-2xl">Choose your plan</DialogTitle>
                <DialogDescription className="text-muted-foreground">
                  Select one tier to align billing and feature limits with your rollout.
                </DialogDescription>
              </DialogHeader>
              <PostRegisterPlanPicker
                onSelectPlan={handlePlanSelect}
                onSkip={onPlanSkip}
                onStartTrial={handleStartTrial}
                isProcessing={planPaymentBusy}
                processingPlanId={processingPlanId}
                trialProcessing={trialBusy}
              />
            </>
          ) : (
            <>
              <DialogHeader className="sr-only">
                <DialogTitle>Create account</DialogTitle>
                <DialogDescription>Register your Zentroverse account and company profile.</DialogDescription>
              </DialogHeader>
              {formCard}
            </>
          )}
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <>
      {(phase === "form" || phase === "done") && (
        <main className="theme-automation min-h-screen bg-background px-4 pb-16 pt-28 text-foreground">
          <div className="mx-auto max-w-xl">{formCard}</div>
        </main>
      )}
      {phase === "plan" && (
        <Dialog
          open
          onOpenChange={(open) => {
            if (!open) onPlanSkip();
          }}
        >
          <DialogContent className="theme-automation max-h-[min(92vh,880px)] max-w-6xl overflow-y-auto border-border bg-card p-0 text-card-foreground">
            <DialogHeader className="border-b border-border px-4 pb-4 pt-2 text-center sm:px-6 sm:pb-6 sm:pt-4">
              <DialogTitle className="text-xl md:text-2xl">Choose your plan</DialogTitle>
              <DialogDescription className="text-muted-foreground">
                Select one tier to align billing and feature limits with your rollout.
              </DialogDescription>
            </DialogHeader>
            <PostRegisterPlanPicker
              onSelectPlan={handlePlanSelect}
              onSkip={onPlanSkip}
              onStartTrial={handleStartTrial}
              isProcessing={planPaymentBusy}
              processingPlanId={processingPlanId}
              trialProcessing={trialBusy}
            />
          </DialogContent>
        </Dialog>
      )}
    </>
  );
};

export default Register;
