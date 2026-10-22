import { useState } from "react";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { WhatsAppButton } from "@/components/WhatsAppButton";
import { SeoHead } from "@/components/seo/SeoHead";
import { SectionHeader } from "@/components/home/SectionHeader";
import { FaqSection } from "@/components/home/FaqSection";
import { FinalCTA } from "@/components/home/FinalCTA";
import { ContactLeadCapture } from "@/components/home/ContactLeadCapture";
import { PricingGrid } from "@/components/pricing/PricingGrid";
import { usePricingPlans } from "@/hooks/usePricingPlans";
import type { BillingCycle } from "@/data/pricingPlans";

const PricingPage = () => {
  const { plans, trial } = usePricingPlans();
  const [cycle, setCycle] = useState<BillingCycle>("monthly");

  return (
    <>
      <SeoHead
        title="Pricing | Zentroverse — Basic & Pro plans, monthly or yearly"
        description="Choose Basic Monthly, Basic Yearly, Pro Monthly or Pro Yearly. Included features and additional add-ons are listed clearly. Start a free trial."
        path="/pricing"
      />
      <main className="min-h-screen bg-background">
        <Navbar />

        <section className="relative pt-24 pb-12 md:pt-32 md:pb-16 overflow-hidden hero-bg">
          <div className="absolute -top-20 -left-20 w-[28rem] h-[28rem] bg-brand-purple/20 rounded-full blur-3xl animate-float" />
          <div className="absolute top-20 -right-20 w-[28rem] h-[28rem] bg-primary/20 rounded-full blur-3xl animate-float-delayed" />
          <div className="absolute inset-0 grid-pattern opacity-40" />
          <div className="container relative max-w-4xl text-center">
            <p className="text-xs font-bold uppercase tracking-widest text-primary mb-3">Pricing</p>
            <h1 className="text-3xl md:text-5xl font-extrabold leading-tight mb-4">
              Simple plans for <span className="gradient-brand-text">WhatsApp growth</span>
            </h1>
            <p className="text-lg text-muted-foreground leading-relaxed max-w-2xl mx-auto">
              Basic and Pro, billed monthly or yearly. Features that come with the plan are marked Included.
              Extras are marked Additional add-on.
            </p>
          </div>
        </section>

        <section className="py-16 md:py-20">
          <div className="container">
            <SectionHeader
              eyebrow="Plans"
              title="Basic & Pro — Monthly or Yearly"
              subtitle="Switch billing to compare. Start a free trial, then upgrade when you are ready."
            />
            <PricingGrid plans={plans} trial={trial} cycle={cycle} onCycleChange={setCycle} />
          </div>
        </section>

        <FaqSection />
        <FinalCTA />
        <ContactLeadCapture />
        <Footer />
        <WhatsAppButton />
      </main>
    </>
  );
};

export default PricingPage;
