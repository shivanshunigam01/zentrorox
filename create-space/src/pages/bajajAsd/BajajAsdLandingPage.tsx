import { useCallback, useEffect, useMemo, useRef, useState, type FormEvent, type ReactNode } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import {
  ArrowLeft,
  ArrowRight,
  Award,
  Building2,
  Check,
  CheckCircle2,
  ClipboardList,
  LayoutDashboard,
  Megaphone,
  MessageCircle,
  PhoneCall,
  MapPin,
  TrendingUp,
  Users,
  Wallet,
  Zap,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { SeoHead } from "@/components/seo/SeoHead";
import { toast } from "@/hooks/use-toast";
import {
  BUSINESS_TYPES,
  formatLocationSummary,
  ASD_SPACE_DEFAULTS,
  FRONTAGE,
  getDistrictsForState,
  getLocationOptions,
  INVESTMENT_CAPACITY,
  parseLocationId,
  resolveLocationFromQuery,
  SHOWROOM_SPACE,
  SPACE_STATUS,
  START_TIMELINE,
  STATE_CODES,
  STATES,
  WORKSHOP_SPACE,
  YEARS_IN_BUSINESS,
} from "@/lib/bajajAsd/masters";
import { submitBajajAsdApplication } from "@/lib/bajajAsd/submitApplication";
import {
  FORM_STEP_COUNT,
  FORM_STEP_LABELS,
  validateStep,
  type FormDraft,
  type YesNo,
} from "@/lib/bajajAsd/types";

const HERO = "/images/bajaj-asd/hero-header.png?v=2";
const BAJAJ_LOGO = "/images/pulsar/bajaj-logo.png";
const LINEUP = "/images/pulsar/bajaj-lineup.png";

const BAJAJ_BLUE = "#0054A6";
const BAJAJ_BLUE_DARK = "#003d7a";

const inputClass =
  "h-11 border-blue-200/80 bg-white focus-visible:ring-[#0054A6]/35 shadow-sm";

const selectMenuProps = {
  position: "popper" as const,
  sideOffset: 4,
  className: "max-h-[min(16rem,50vh)]",
};

const BENEFITS = [
  { icon: TrendingUp, title: "High-demand portfolio", desc: "Pulsar, Platina, CT, Avenger, Dominar & Chetak" },
  { icon: Users, title: "Dedicated support", desc: "Training, marketing & operational guidance" },
  { icon: Award, title: "Trusted brand", desc: "India's leading two-wheeler manufacturer" },
  { icon: Zap, title: "Fast-track review", desc: "Applications reviewed on a rolling basis" },
];

const PRODUCT_ADS = [
  {
    name: "ZentroADS",
    tagline: "Performance marketing",
    headline: "Fill your showroom with qualified buyers",
    points: ["Meta Ads", "Google Ads", "SEO"],
    href: "/products/zentroads",
    icon: Megaphone,
    accent: "from-rose-500 to-pink-600",
    tint: "bg-rose-50",
    text: "text-rose-600",
  },
  {
    name: "ZentroOS",
    tagline: "Dealer ERP · CRM · DMS",
    headline: "Run your dealership on one operating system",
    points: ["Sales", "Workshop", "Inventory"],
    href: "/products/zentroos",
    icon: LayoutDashboard,
    accent: "from-slate-700 to-slate-900",
    tint: "bg-slate-100",
    text: "text-slate-800",
  },
  {
    name: "ZentroBOT",
    tagline: "WhatsApp automation",
    headline: "Convert every WhatsApp enquiry, automatically",
    points: ["Chatbot", "Campaigns", "Support"],
    href: "/products/zentrobot",
    icon: MessageCircle,
    accent: "from-emerald-500 to-teal-600",
    tint: "bg-emerald-50",
    text: "text-emerald-600",
  },
  {
    name: "ZentroDIAL",
    tagline: "IVR & autodialer",
    headline: "Never miss a follow-up call",
    points: ["IVR", "Autodialer", "Missed-call"],
    href: "/products/zentrodial",
    icon: PhoneCall,
    accent: "from-sky-500 to-blue-600",
    tint: "bg-sky-50",
    text: "text-sky-600",
  },
];

const EMPTY_FORM: FormDraft = {
  state: "",
  districts: [],
  locations: [],
  applicant_name: "",
  mobile: "",
  alternate_mobile: "",
  email: "",
  current_town: "",
  pan: "",
  gst_number: "",
  is_existing_business: "",
  business_name: "",
  business_type: "",
  other_business_type: "",
  years_in_business: "",
  existing_oem: "",
  oem_brand: "",
  investment_capacity: "",
  space_status: "",
  showroom_space: ASD_SPACE_DEFAULTS.showroomSpace,
  workshop_space: ASD_SPACE_DEFAULTS.workshopSpace,
  frontage: ASD_SPACE_DEFAULTS.frontage,
  start_timeline: "",
  applicant_remarks: "",
  contact_consent: false,
  disclaimer_ack: false,
};

const stepMotion = {
  initial: { opacity: 0, y: 10 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -6 },
  transition: { duration: 0.22, ease: [0.22, 1, 0.36, 1] as const },
};

const BajajAsdLandingPage = () => {
  const [searchParams] = useSearchParams();
  const [form, setForm] = useState<FormDraft>(EMPTY_FORM);
  const [step, setStep] = useState(0);
  const [maxStepReached, setMaxStepReached] = useState(0);
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [refId, setRefId] = useState("");
  const formPanelRef = useRef<HTMLDivElement>(null);
  const stepPanelRef = useRef<HTMLDivElement>(null);

  const locationParam = searchParams.get("location");

  useEffect(() => {
    const resolved = resolveLocationFromQuery(locationParam);
    if (!resolved) return;
    setForm((prev) => ({
      ...prev,
      state: resolved.state,
      districts: resolved.districts,
      locations: resolved.locations,
    }));
  }, [locationParam]);

  const locationSummary = useMemo(
    () => (form.state && form.locations.length ? formatLocationSummary(form.state, form.districts, form.locations) : ""),
    [form.state, form.districts, form.locations],
  );

  const isExistingBusiness = form.is_existing_business === "Yes";
  const showOemBrand = form.existing_oem === "Yes";
  const showOtherBusiness = form.business_type === "Other Existing Business";
  const isLastStep = step === FORM_STEP_COUNT - 1;

  const districtOptions = useMemo(() => getDistrictsForState(form.state), [form.state]);

  const locationOptions = useMemo(
    () => getLocationOptions(form.state, form.districts),
    [form.state, form.districts],
  );

  const patch = useCallback(<K extends keyof FormDraft>(key: K, value: FormDraft[K]) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  }, []);

  const scrollToForm = useCallback(() => {
    formPanelRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  }, []);

  const onStateChange = (state: string) => {
    setForm((prev) => ({
      ...prev,
      state,
      districts: [],
      locations: [],
    }));
  };

  const toggleDistrict = (district: string) => {
    setForm((prev) => {
      const districts = prev.districts.includes(district)
        ? prev.districts.filter((d) => d !== district)
        : [...prev.districts, district];
      const districtSet = new Set(districts);
      const locations = prev.locations.filter((id) => {
        const parsed = parseLocationId(id);
        return parsed ? districtSet.has(parsed.district) : false;
      });
      return { ...prev, districts, locations };
    });
  };

  const toggleLocation = (locationId: string) => {
    setForm((prev) => ({
      ...prev,
      locations: prev.locations.includes(locationId)
        ? prev.locations.filter((id) => id !== locationId)
        : [...prev.locations, locationId],
    }));
  };

  const goNext = () => {
    const result = validateStep(step, form);
    if (!result.ok) {
      toast({ title: result.message, variant: "destructive" });
      return;
    }
    const next = Math.min(step + 1, FORM_STEP_COUNT - 1);
    setStep(next);
    setMaxStepReached((m) => Math.max(m, next));
    scrollToForm();
  };

  const goBack = () => {
    setStep((s) => Math.max(0, s - 1));
    scrollToForm();
  };

  const goToStep = (target: number) => {
    if (target > maxStepReached || target === step) return;
    setStep(target);
    scrollToForm();
  };

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault();
    const result = validateStep(step, form);
    if (!result.ok) {
      toast({ title: result.message, variant: "destructive" });
      return;
    }

    setSubmitting(true);
    try {
      const payload = {
        ...form,
        is_existing_business: form.is_existing_business as YesNo,
        existing_oem: form.existing_oem as YesNo,
        business_type:
          form.is_existing_business === "No" ? "New Entrepreneur" : form.business_type,
      };

      const submitResult = await submitBajajAsdApplication(payload);
      if (!submitResult.ok) {
        toast({ title: submitResult.message, variant: "destructive" });
        return;
      }
      setRefId(submitResult.application.id.slice(0, 8).toUpperCase());
      setSubmitted(true);
      setStep(0);
      setMaxStepReached(0);
      toast({
        title: "Application submitted successfully",
        description: "Our team will contact you shortly.",
      });
      setForm(EMPTY_FORM);
      window.scrollTo({ top: 0, behavior: "smooth" });
    } finally {
      setSubmitting(false);
    }
  };

  const progressPct = ((step + 1) / FORM_STEP_COUNT) * 100;

  return (
    <>
      <SeoHead
        title="Bajaj Auto Sub-Dealership Application | ASD"
        description="Apply online for Bajaj Auto Sub-Dealership (ASD) in Bihar & Jharkhand."
        path="/bajaj_asd"
        keywords={["Bajaj ASD", "Sub-Dealership", "Bajaj Auto", "Bihar", "Jharkhand"]}
      />

      <main className="min-h-screen w-full max-w-[100vw] overflow-x-clip bg-[#f0f6fc]">
        <header className="relative z-20 bg-white/95 backdrop-blur-sm border-b border-blue-100/80">
          <div className="flex items-center justify-between gap-3 px-4 sm:px-8 lg:px-12 h-14 sm:h-16 max-w-7xl mx-auto w-full">
            <div className="flex items-center gap-2.5 min-w-0">
              <div className="h-9 w-9 sm:h-10 sm:w-10 rounded-xl bg-white p-1.5 shadow-sm border border-blue-100 shrink-0">
                <img src={BAJAJ_LOGO} alt="Bajaj" className="h-full w-full object-contain" />
              </div>
              <div className="min-w-0">
                <p className="text-[10px] uppercase tracking-[0.22em] font-bold text-[#0054A6]">
                  Bajaj Auto
                </p>
                <p className="text-sm font-extrabold text-slate-900 leading-tight truncate">
                  Sub-Dealership Program
                </p>
              </div>
            </div>
            <span className="inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-[10px] sm:text-xs font-bold uppercase tracking-wider text-[#0054A6] bg-blue-50 border border-blue-100 shrink-0">
              <MapPin className="h-3.5 w-3.5" />
              Bihar · Jharkhand
            </span>
          </div>
        </header>

        <section className="relative w-full overflow-hidden bg-white">
          <img
            src={HERO}
            alt="Partner with Bajaj — Grow with India's #1 brand. CT, Platina, Pulsar, Avenger, Dominar and Chetak."
            width={1920}
            height={960}
            loading="eager"
            fetchPriority="high"
            decoding="sync"
            className="block w-full h-auto max-w-[1920px] mx-auto object-contain contrast-[1.04] saturate-[1.05] [image-rendering:auto] [-webkit-backface-visibility:hidden] pointer-events-none select-none"
          />

          {!submitted ? (
            <div className="flex justify-center px-4 py-4 sm:py-5 bg-white border-b border-blue-100/80">
              <Button
                type="button"
                size="lg"
                onClick={scrollToForm}
                className="h-11 sm:h-12 px-6 font-bold text-white border-0 shadow-lg hover:opacity-95 hover:shadow-xl transition-shadow"
                style={{ background: `linear-gradient(135deg, ${BAJAJ_BLUE}, ${BAJAJ_BLUE_DARK})` }}
              >
                Start application
                <ArrowRight className="h-4 w-4 ml-1" />
              </Button>
            </div>
          ) : null}

          {submitted ? (
            <div className="absolute inset-0 z-20 flex items-center justify-center bg-white/90 px-4">
              <motion.div
                initial={{ opacity: 0, scale: 0.96 }}
                animate={{ opacity: 1, scale: 1 }}
                className="max-w-xl rounded-2xl border border-emerald-300/40 bg-white p-5 sm:p-7 shadow-xl space-y-3"
              >
                <div className="flex items-center gap-3 text-emerald-700">
                  <div className="h-11 w-11 rounded-full bg-emerald-100 flex items-center justify-center shrink-0">
                    <CheckCircle2 className="h-6 w-6" />
                  </div>
                  <div>
                    <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900">Application received!</h1>
                    {refId ? (
                      <p className="text-sm font-mono text-emerald-600 mt-0.5">Ref: {refId}</p>
                    ) : null}
                  </div>
                </div>
                <p className="text-slate-600 leading-relaxed text-sm sm:text-base">
                  Thank you for applying. The Bajaj Auto team will review your profile and contact
                  shortlisted candidates for the next steps.
                </p>
              </motion.div>
            </div>
          ) : null}
        </section>

        {/* Split: showcase left · form right */}
        {!submitted ? (
          <section className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10 lg:py-12">
            <div className="grid lg:grid-cols-2 gap-6 lg:gap-10 xl:gap-12 items-start">
              <motion.div
                initial={{ opacity: 0, x: -16 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4 }}
                className="lg:sticky lg:top-8"
              >
                <div className="rounded-3xl overflow-hidden border border-blue-100/80 bg-white shadow-[0_20px_60px_-15px_rgba(0,84,166,0.18)]">
                  <img
                    src={LINEUP}
                    alt="Bajaj Auto — CT, Platina, Pulsar, Avenger, Dominar, and Chetak"
                    className="w-full h-auto object-contain bg-white p-2 sm:p-4"
                  />
                  <div
                    className="px-5 py-4 text-center"
                    style={{ background: `linear-gradient(135deg, ${BAJAJ_BLUE}, ${BAJAJ_BLUE_DARK})` }}
                  >
                    <p className="text-white font-extrabold text-sm sm:text-base tracking-wide uppercase">
                      6 Iconic Rides · Endless Possibilities
                    </p>
                  </div>
                </div>
              </motion.div>

              {/* RIGHT — application form */}
              <motion.div
                ref={formPanelRef}
                id="application-form"
                initial={{ opacity: 0, x: 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.1 }}
                className="rounded-3xl border border-blue-100/80 bg-white shadow-[0_24px_64px_-12px_rgba(0,84,166,0.22)] overflow-x-clip"
              >
                <div
                  className="px-6 sm:px-7 pt-6 pb-4 text-white"
                  style={{ background: `linear-gradient(135deg, ${BAJAJ_BLUE} 0%, ${BAJAJ_BLUE_DARK} 100%)` }}
                >
                  <div className="flex items-center justify-between gap-3 mb-4">
                    <div className="flex items-center gap-2.5">
                      <div className="h-9 w-9 rounded-xl bg-white/15 flex items-center justify-center">
                        <ClipboardList className="h-5 w-5" />
                      </div>
                      <div>
                        <p className="text-[10px] uppercase tracking-widest font-semibold text-blue-200">
                          Online application
                        </p>
                        <p className="text-lg font-extrabold leading-tight">{FORM_STEP_LABELS[step]}</p>
                      </div>
                    </div>
                    <span className="text-sm font-bold bg-white/15 rounded-full px-3 py-1">
                      {step + 1}/{FORM_STEP_COUNT}
                    </span>
                  </div>
                  <div className="h-2 rounded-full bg-white/20 overflow-hidden">
                    <motion.div
                      className="h-full rounded-full bg-white"
                      initial={false}
                      animate={{ width: `${progressPct}%` }}
                      transition={{ duration: 0.35 }}
                    />
                  </div>
                  <div className="mt-4">
                    <StepPills current={step} maxReached={maxStepReached} onJump={goToStep} dark />
                  </div>
                  {locationSummary ? (
                    <p className="text-xs text-blue-100 mt-3 line-clamp-2">
                      📍 {locationSummary}
                    </p>
                  ) : null}
                </div>

                <form onSubmit={onSubmit}>
                  <div ref={stepPanelRef} className="px-6 sm:px-7 py-6">
                    <AnimatePresence mode="wait">
                      <motion.div key={step} {...stepMotion} className="space-y-4">
                        {step === 0 && (
                          <>
                            <Field label="State *" hint="BH = Bihar · JH = Jharkhand">
                              <Select modal={false} value={form.state || undefined} onValueChange={onStateChange}>
                                <SelectTrigger className={inputClass}>
                                  <SelectValue placeholder="Select state" />
                                </SelectTrigger>
                                <SelectContent {...selectMenuProps}>
                                  {STATES.map((s) => (
                                    <SelectItem key={s} value={s}>
                                      {s} ({STATE_CODES[s]})
                                    </SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                            </Field>

                            <Field label="District(s) *" hint="Select one or more districts">
                              <MultiCheckboxPanel
                                disabled={!form.state}
                                emptyMessage={form.state ? "No districts available." : "Select a state first."}
                                options={districtOptions.map((d) => ({ id: d, label: d }))}
                                selected={form.districts}
                                onToggle={toggleDistrict}
                              />
                            </Field>

                            <Field label="Location(s) *" hint="Select one or more ASD locations">
                              <MultiCheckboxPanel
                                disabled={!form.districts.length}
                                emptyMessage={form.districts.length ? "No locations available." : "Select district(s) first."}
                                grouped={form.districts.map((district) => ({
                                  title: district,
                                  options: locationOptions
                                    .filter((o) => o.district === district)
                                    .map((o) => ({ id: o.id, label: o.location })),
                                }))}
                                selected={form.locations}
                                onToggle={toggleLocation}
                              />
                            </Field>
                          </>
                        )}

                        {step === 1 && (
                          <>
                            <Field label="Full name *">
                              <Input value={form.applicant_name} onChange={(e) => patch("applicant_name", e.target.value)} placeholder="Full name" className={inputClass} maxLength={80} autoFocus />
                            </Field>
                            <div className="grid sm:grid-cols-2 gap-3.5 items-start">
                              <Field label="Mobile / WhatsApp *">
                                <Input inputMode="numeric" value={form.mobile} onChange={(e) => patch("mobile", e.target.value)} placeholder="9876543210" className={inputClass} maxLength={14} />
                              </Field>
                              <Field label="Alternate mobile" hint="Optional">
                                <Input inputMode="numeric" value={form.alternate_mobile} onChange={(e) => patch("alternate_mobile", e.target.value)} placeholder="Alternate" className={inputClass} maxLength={14} />
                              </Field>
                            </div>
                            <div className="grid sm:grid-cols-2 gap-3.5 items-start">
                              <Field label="Email" hint="Optional">
                                <Input type="email" value={form.email} onChange={(e) => patch("email", e.target.value)} placeholder="you@email.com" className={inputClass} />
                              </Field>
                              <Field label="Current city / town *">
                                <Input value={form.current_town} onChange={(e) => patch("current_town", e.target.value)} placeholder="Your current city / town" className={inputClass} maxLength={100} />
                              </Field>
                            </div>
                          </>
                        )}

                        {step === 2 && (
                          <>
                            <Field label="Do you currently run a business? *">
                              <RadioGroup value={form.is_existing_business} onValueChange={(v) => {
                                const yesNo = v as YesNo;
                                patch("is_existing_business", yesNo);
                                if (yesNo === "No") {
                                  setForm((prev) => ({ ...prev, is_existing_business: yesNo, business_name: "", years_in_business: "", business_type: "New Entrepreneur" }));
                                }
                              }} className="flex gap-4 pt-1">
                                <div className="flex items-center gap-2"><RadioGroupItem value="Yes" id="existing-yes" /><Label htmlFor="existing-yes" className="font-normal cursor-pointer">Yes</Label></div>
                                <div className="flex items-center gap-2"><RadioGroupItem value="No" id="existing-no" /><Label htmlFor="existing-no" className="font-normal cursor-pointer">No</Label></div>
                              </RadioGroup>
                            </Field>
                            {isExistingBusiness ? (
                              <Field label="Business / firm name *">
                                <Input value={form.business_name} onChange={(e) => patch("business_name", e.target.value)} placeholder="Business name" className={inputClass} maxLength={120} />
                              </Field>
                            ) : null}
                            <Field label="Business type *">
                              <Select modal={false} value={form.business_type} onValueChange={(v) => patch("business_type", v)} disabled={form.is_existing_business === "No"}>
                                <SelectTrigger className={inputClass}><SelectValue placeholder="Select type" /></SelectTrigger>
                                <SelectContent {...selectMenuProps}>
                                  {BUSINESS_TYPES.map((t) => (<SelectItem key={t} value={t}>{t}</SelectItem>))}
                                </SelectContent>
                              </Select>
                            </Field>
                            {showOtherBusiness ? (
                              <Field label="Describe other business type *">
                                <Input value={form.other_business_type} onChange={(e) => patch("other_business_type", e.target.value)} placeholder="Business type" className={inputClass} maxLength={100} />
                              </Field>
                            ) : null}
                            {isExistingBusiness ? (
                              <Field label="Years in business *">
                                <Select modal={false} value={form.years_in_business} onValueChange={(v) => patch("years_in_business", v)}>
                                  <SelectTrigger className={inputClass}><SelectValue placeholder="Select experience" /></SelectTrigger>
                                  <SelectContent {...selectMenuProps}>
                                    {YEARS_IN_BUSINESS.map((y) => (<SelectItem key={y} value={y}>{y}</SelectItem>))}
                                  </SelectContent>
                                </Select>
                              </Field>
                            ) : null}
                            <Field label="Associated with an automobile / EV brand? *">
                              <RadioGroup value={form.existing_oem} onValueChange={(v) => patch("existing_oem", v as YesNo)} className="flex gap-4 pt-1">
                                <div className="flex items-center gap-2"><RadioGroupItem value="Yes" id="oem-yes" /><Label htmlFor="oem-yes" className="font-normal cursor-pointer">Yes</Label></div>
                                <div className="flex items-center gap-2"><RadioGroupItem value="No" id="oem-no" /><Label htmlFor="oem-no" className="font-normal cursor-pointer">No</Label></div>
                              </RadioGroup>
                            </Field>
                            {showOemBrand ? (
                              <Field label="Brand name *">
                                <Input value={form.oem_brand} onChange={(e) => patch("oem_brand", e.target.value)} placeholder="Brand name" className={inputClass} maxLength={100} />
                              </Field>
                            ) : null}
                            <div className="grid sm:grid-cols-2 gap-3.5 items-start">
                              <Field label="PAN" hint="Optional · e.g. ABCDE1234F">
                                <Input
                                  value={form.pan}
                                  onChange={(e) => patch("pan", e.target.value.toUpperCase())}
                                  placeholder="ABCDE1234F"
                                  className={`${inputClass} uppercase`}
                                  maxLength={10}
                                />
                              </Field>
                              <Field label="GST number" hint="Optional · 15 characters">
                                <Input
                                  value={form.gst_number}
                                  onChange={(e) => patch("gst_number", e.target.value.toUpperCase())}
                                  placeholder="22AAAAA0000A1Z5"
                                  className={`${inputClass} uppercase`}
                                  maxLength={15}
                                />
                              </Field>
                            </div>
                          </>
                        )}

                        {step === 3 && (
                          <>
                            <Field label="Estimated investment capacity *">
                              <Select modal={false} value={form.investment_capacity} onValueChange={(v) => patch("investment_capacity", v)}>
                                <SelectTrigger className={inputClass}><SelectValue placeholder="Select range" /></SelectTrigger>
                                <SelectContent {...selectMenuProps}>
                                  {INVESTMENT_CAPACITY.map((o) => (<SelectItem key={o} value={o}>{o}</SelectItem>))}
                                </SelectContent>
                              </Select>
                            </Field>
                            <Field label="Commercial space available? *">
                              <Select modal={false} value={form.space_status} onValueChange={(v) => patch("space_status", v)}>
                                <SelectTrigger className={inputClass}><SelectValue placeholder="Select status" /></SelectTrigger>
                                <SelectContent {...selectMenuProps}>
                                  {SPACE_STATUS.map((o) => (<SelectItem key={o} value={o}>{o}</SelectItem>))}
                                </SelectContent>
                              </Select>
                            </Field>
                            <div className="grid sm:grid-cols-2 gap-3.5 items-start">
                              <Field label="Showroom space *">
                                <Select modal={false} value={form.showroom_space} onValueChange={(v) => patch("showroom_space", v)}>
                                  <SelectTrigger className={inputClass}><SelectValue placeholder="Select showroom space" /></SelectTrigger>
                                  <SelectContent {...selectMenuProps}>
                                    {SHOWROOM_SPACE.map((o) => (<SelectItem key={o} value={o}>{o}</SelectItem>))}
                                  </SelectContent>
                                </Select>
                              </Field>
                              <Field label="Workshop space *">
                                <Select modal={false} value={form.workshop_space} onValueChange={(v) => patch("workshop_space", v)}>
                                  <SelectTrigger className={inputClass}><SelectValue placeholder="Select workshop space" /></SelectTrigger>
                                  <SelectContent {...selectMenuProps}>
                                    {WORKSHOP_SPACE.map((o) => (<SelectItem key={o} value={o}>{o}</SelectItem>))}
                                  </SelectContent>
                                </Select>
                              </Field>
                            </div>
                            <Field label="Frontage *">
                              <Select modal={false} value={form.frontage} onValueChange={(v) => patch("frontage", v)}>
                                <SelectTrigger className={inputClass}><SelectValue placeholder="Select frontage" /></SelectTrigger>
                                <SelectContent {...selectMenuProps}>
                                  {FRONTAGE.map((o) => (<SelectItem key={o} value={o}>{o}</SelectItem>))}
                                </SelectContent>
                              </Select>
                            </Field>
                          </>
                        )}

                        {step === 4 && (
                          <>
                            <Field label="When can you start? *">
                              <Select modal={false} value={form.start_timeline} onValueChange={(v) => patch("start_timeline", v)}>
                                <SelectTrigger className={inputClass}><SelectValue placeholder="Select timeline" /></SelectTrigger>
                                <SelectContent {...selectMenuProps}>
                                  {START_TIMELINE.map((o) => (<SelectItem key={o} value={o}>{o}</SelectItem>))}
                                </SelectContent>
                              </Select>
                            </Field>
                            <Field label="Additional information" hint="Optional">
                              <Textarea value={form.applicant_remarks} onChange={(e) => patch("applicant_remarks", e.target.value)} placeholder="Anything else we should know" className="min-h-[88px] border-blue-200 focus-visible:ring-[#0054A6]/35" maxLength={500} />
                            </Field>
                          </>
                        )}

                        {step === 5 && (
                          <>
                            <label className="flex items-start gap-3 cursor-pointer rounded-xl border-2 border-blue-100 bg-sky-50/60 p-4 hover:border-blue-200 transition-colors">
                              <Checkbox checked={form.contact_consent} onCheckedChange={(c) => patch("contact_consent", c === true)} className="mt-0.5" />
                              <span className="text-sm text-slate-700 leading-snug">I consent to the review of my information and to being contacted. *</span>
                            </label>
                            <label className="flex items-start gap-3 cursor-pointer rounded-xl border-2 border-blue-100 bg-sky-50/60 p-4 hover:border-blue-200 transition-colors">
                              <Checkbox checked={form.disclaimer_ack} onCheckedChange={(c) => patch("disclaimer_ack", c === true)} className="mt-0.5" />
                              <span className="text-sm text-slate-700 leading-snug">I understand this form does not guarantee a Sub-Dealership. *</span>
                            </label>
                          </>
                        )}
                      </motion.div>
                    </AnimatePresence>
                  </div>

                  <div className="flex gap-3 px-6 sm:px-7 py-5 border-t border-blue-50 bg-slate-50/50">
                    <Button type="button" variant="outline" className="flex-1 sm:flex-none sm:min-w-[110px] border-blue-200 bg-white h-12 font-semibold" onClick={goBack} disabled={step === 0 || submitting}>
                      <ArrowLeft className="h-4 w-4" /> Back
                    </Button>
                    {isLastStep ? (
                      <Button type="submit" className="flex-[2] h-12 font-bold text-white border-0 shadow-lg hover:opacity-95" style={{ background: `linear-gradient(135deg, ${BAJAJ_BLUE}, ${BAJAJ_BLUE_DARK})` }} disabled={submitting}>
                        <Wallet className="h-4 w-4" />
                        {submitting ? "Submitting…" : "Submit application"}
                      </Button>
                    ) : (
                      <Button type="button" className="flex-[2] h-12 font-bold text-white border-0 shadow-lg hover:opacity-95" style={{ background: `linear-gradient(135deg, ${BAJAJ_BLUE}, ${BAJAJ_BLUE_DARK})` }} onClick={goNext}>
                        Continue <ArrowRight className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                </form>
              </motion.div>
            </div>

            <div className="mt-8 sm:mt-10 grid sm:grid-cols-2 lg:grid-cols-4 gap-3">
              {BENEFITS.map(({ icon: Icon, title, desc }) => (
                <div
                  key={title}
                  className="flex gap-3 rounded-2xl border border-blue-100 bg-white p-4 shadow-sm hover:shadow-md transition-shadow"
                >
                  <div
                    className="h-10 w-10 shrink-0 rounded-xl flex items-center justify-center text-white"
                    style={{ background: `linear-gradient(135deg, ${BAJAJ_BLUE}, ${BAJAJ_BLUE_DARK})` }}
                  >
                    <Icon className="h-5 w-5" />
                  </div>
                  <div className="min-w-0">
                    <p className="font-bold text-slate-900 text-sm">{title}</p>
                    <p className="text-xs text-slate-500 mt-0.5 leading-snug">{desc}</p>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-4 rounded-2xl border border-amber-200/80 bg-gradient-to-br from-amber-50 to-orange-50/50 p-4 flex gap-3">
              <Building2 className="h-5 w-5 text-amber-700 shrink-0 mt-0.5" />
              <p className="text-sm text-amber-950 leading-relaxed">
                <strong>Important:</strong> Submitting this form does not guarantee a
                Sub-Dealership. Final selection follows Bajaj Auto evaluation and interview.
              </p>
            </div>
          </section>
        ) : null}

        <section className="border-t border-blue-100 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-12">
            <div className="flex flex-wrap items-end justify-between gap-3 mb-6">
              <div>
                <p className="text-[10px] uppercase tracking-[0.22em] font-bold text-[#0054A6]">
                  Powered by Zentroverse
                </p>
                <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 mt-1">
                  Grow your dealership with our products
                </h2>
              </div>
              <Link
                to="/products"
                className="text-sm font-semibold text-[#0054A6] hover:underline underline-offset-4"
              >
                View all products →
              </Link>
            </div>
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {PRODUCT_ADS.map(({ name, tagline, headline, points, href, icon: Icon, accent, tint, text }) => (
                <Link
                  key={name}
                  to={href}
                  className="group rounded-2xl border border-slate-200/80 bg-white p-5 shadow-sm hover:shadow-lg hover:-translate-y-0.5 transition-all"
                >
                  <div className="flex items-center gap-3 mb-4">
                    <div className={`h-11 w-11 rounded-xl ${tint} flex items-center justify-center ${text}`}>
                      <Icon className="h-5 w-5" />
                    </div>
                    <div className="min-w-0">
                      <p className="font-extrabold text-slate-900 leading-tight">{name}</p>
                      <p className="text-[11px] text-slate-500 font-medium">{tagline}</p>
                    </div>
                  </div>
                  <p className="text-sm font-semibold text-slate-800 leading-snug mb-3">{headline}</p>
                  <div className="flex flex-wrap gap-1.5 mb-4">
                    {points.map((point) => (
                      <span
                        key={point}
                        className="text-[10px] font-semibold uppercase tracking-wide text-slate-500 bg-slate-50 border border-slate-100 rounded-full px-2 py-0.5"
                      >
                        {point}
                      </span>
                    ))}
                  </div>
                  <span className={`inline-flex items-center gap-1 text-xs font-bold ${text} group-hover:gap-2 transition-all`}>
                    Learn more
                    <ArrowRight className="h-3.5 w-3.5" />
                  </span>
                  <div className={`mt-4 h-1 rounded-full bg-gradient-to-r ${accent} opacity-80`} />
                </Link>
              ))}
            </div>
          </div>
        </section>

        <footer className="border-t border-blue-100 bg-white py-8 px-4 text-center space-y-2">
          <img src={BAJAJ_LOGO} alt="Bajaj" className="h-8 w-8 mx-auto opacity-70 object-contain" />
          <p className="text-xs text-slate-500">Authorized Bajaj Auto ASD Application · Bihar & Jharkhand</p>
          <p className="text-[11px] text-slate-400">Powered by Zentroverse</p>
        </footer>
      </main>
    </>
  );
};

function StepPills({
  current,
  maxReached,
  onJump,
  dark = false,
}: {
  current: number;
  maxReached: number;
  onJump: (step: number) => void;
  dark?: boolean;
}) {
  return (
    <div className="flex flex-wrap gap-1.5">
      {FORM_STEP_LABELS.map((label, i) => {
        const done = i < current;
        const active = i === current;
        const clickable = i !== current && i <= maxReached;
        return (
          <button
            key={label}
            type="button"
            disabled={!clickable && !active}
            onClick={() => clickable && onJump(i)}
            className={`inline-flex items-center gap-1 shrink-0 text-[10px] sm:text-[11px] px-2.5 py-1 rounded-full font-semibold transition-all ${
              active
                ? dark ? "bg-white text-[#0054A6] shadow-md" : "text-white shadow-soft"
                : done
                  ? dark ? "bg-white/20 text-white hover:bg-white/30" : "bg-sky-100 text-slate-700"
                  : dark ? "bg-white/10 text-blue-200/70" : "bg-slate-100 text-slate-400"
            } ${clickable ? "cursor-pointer" : "cursor-default"}`}
            style={active && !dark ? { background: BAJAJ_BLUE } : undefined}
          >
            {done ? <Check className="h-3 w-3" /> : null}
            {label}
          </button>
        );
      })}
    </div>
  );
}

function Field({ label, hint, children }: { label: string; hint?: string; children: ReactNode }) {
  return (
    <div className="flex h-full flex-col gap-1.5">
      <div className="min-h-[3rem]">
        <Label className="text-slate-800 font-semibold text-sm leading-snug block">{label}</Label>
        <p className="mt-0.5 min-h-[1rem] text-[11px] leading-snug text-slate-500">{hint ?? "\u00a0"}</p>
      </div>
      {children}
    </div>
  );
}

type MultiOption = { id: string; label: string };

function MultiCheckboxPanel({
  options,
  grouped,
  selected,
  onToggle,
  disabled,
  emptyMessage,
}: {
  options?: MultiOption[];
  grouped?: { title: string; options: MultiOption[] }[];
  selected: string[];
  onToggle: (id: string) => void;
  disabled?: boolean;
  emptyMessage: string;
}) {
  const flatOptions = options ?? grouped?.flatMap((g) => g.options) ?? [];
  if (disabled || flatOptions.length === 0) {
    return (
      <div className="rounded-xl border border-blue-100 bg-slate-50 px-4 py-3 text-sm text-slate-500">
        {emptyMessage}
      </div>
    );
  }

  const renderOption = (option: MultiOption) => {
    const checked = selected.includes(option.id);
    return (
      <label
        key={option.id}
        className={`flex items-center gap-2.5 rounded-lg border px-3 py-2 cursor-pointer transition-colors ${
          checked ? "border-[#0054A6]/40 bg-blue-50" : "border-blue-100 bg-white hover:bg-slate-50"
        }`}
      >
        <Checkbox checked={checked} onCheckedChange={() => onToggle(option.id)} />
        <span className="text-sm text-slate-800">{option.label}</span>
      </label>
    );
  };

  return (
    <div className="rounded-xl border border-blue-100 bg-white p-3 max-h-56 overflow-y-auto space-y-2">
      {grouped
        ? grouped.map((group) => (
            <div key={group.title} className="space-y-2">
              <p className="text-[11px] font-bold uppercase tracking-wide text-[#0054A6] px-1">{group.title}</p>
              <div className="grid sm:grid-cols-2 gap-2">{group.options.map(renderOption)}</div>
            </div>
          ))
        : <div className="grid sm:grid-cols-2 gap-2">{options!.map(renderOption)}</div>}
      {selected.length ? (
        <p className="text-[11px] text-slate-500 pt-1 border-t border-blue-50">
          {selected.length} selected
        </p>
      ) : null}
    </div>
  );
}

export default BajajAsdLandingPage;
