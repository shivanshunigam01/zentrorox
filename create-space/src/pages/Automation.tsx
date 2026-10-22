import { useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Check, Zap, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { PricingGrid } from "@/components/pricing/PricingGrid";
import { usePricingPlans } from "@/hooks/usePricingPlans";
import { ZENTROBOT_FEATURES } from "@/data/zentrobotFeatures";
import type { BillingCycle } from "@/data/pricingPlans";

const faqs = [
  {
    q: "How does WhatsApp bulk messaging work?",
    a: "You create approved Meta templates, pick an audience segment, and schedule or send broadcasts. Delivery and replies are tracked in one inbox.",
  },
  {
    q: "Can Meta ads send leads straight to WhatsApp?",
    a: "Yes. Growth and Pro plans connect Facebook and Instagram campaigns so new leads enter your WhatsApp flows without manual exports.",
  },
  {
    q: "What can the chatbot handle?",
    a: "FAQs, lead qualification, and scripted journeys. When needed, the same conversation hands off to a human agent with full history.",
  },
];

const AutomationHome = () => {
  const { plans, trial } = usePricingPlans();
  const [cycle, setCycle] = useState<BillingCycle>("monthly");
  return (
    <main>
      {/* Hero */}
      <section className="automation-hero-shell border-b border-border/80 pb-16 pt-28 md:pb-20 md:pt-32">
        <div className="container">
          <div className="grid items-center gap-12 lg:grid-cols-12 lg:gap-10">
            <div className="lg:col-span-7">
              <motion.div
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                className="mb-4 inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/10 px-3 py-1 text-xs font-semibold text-primary"
              >
                <Zap className="h-3.5 w-3.5" />
                Zentrobot
              </motion.div>
              <motion.h1
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.05 }}
                className="text-3xl font-extrabold tracking-tight text-foreground sm:text-4xl md:text-5xl lg:text-[2.65rem] lg:leading-[1.08]"
              >
                WhatsApp growth with{" "}
                <span className="bg-gradient-to-r from-primary via-[hsl(190,90%,52%)] to-primary bg-clip-text text-transparent">
                  bulk messaging, Meta ads & chatbots
                </span>
              </motion.h1>
              <motion.p
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="mt-5 max-w-xl text-base leading-relaxed text-muted-foreground md:text-lg"
              >
                Zentrobot is built around three core capabilities: reach customers at scale on WhatsApp, capture leads
                from Meta ads, and automate conversations with intelligent chatbots.
              </motion.p>
              <motion.div
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.15 }}
                className="mt-8 flex flex-wrap gap-3"
              >
                <Button variant="hero" size="lg" asChild>
                  <a href="#features">See features</a>
                </Button>
                <Button variant="outline" size="lg" className="border-border/80 bg-background/40" asChild>
                  <a href="#pricing">View pricing</a>
                </Button>
                <Button variant="ghost" size="lg" className="text-muted-foreground hover:text-foreground" asChild>
                  <Link to="/#contact">Contact us</Link>
                </Button>
              </motion.div>
            </div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="automation-panel relative overflow-hidden p-6 lg:col-span-5"
            >
              <p className="text-xs font-semibold uppercase tracking-wide text-primary">Core features</p>
              <h2 className="mt-1 text-lg font-bold text-foreground">Everything you need on WhatsApp</h2>
              <ul className="mt-5 space-y-3">
                {ZENTROBOT_FEATURES.map((feature) => (
                  <li
                    key={feature.slug}
                    className="flex gap-3 rounded-xl border border-border/60 bg-background/40 px-3 py-3 transition-colors hover:border-primary/35"
                  >
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary/12 text-primary">
                      <feature.Icon className="h-5 w-5" />
                    </div>
                    <div className="min-w-0">
                      <p className="text-sm font-semibold text-foreground">{feature.title}</p>
                      <p className="mt-0.5 text-xs leading-relaxed text-muted-foreground">{feature.subtitle}</p>
                    </div>
                  </li>
                ))}
              </ul>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Feature cards */}
      <section id="features" className="border-b border-border/80 bg-muted/15 py-16 md:py-20">
        <div className="container">
          <div className="mx-auto mb-12 max-w-2xl text-center">
            <p className="font-mono text-xs font-semibold uppercase tracking-[0.2em] text-primary">Features</p>
            <h2 className="mt-3 text-3xl font-extrabold tracking-tight md:text-4xl">Built for WhatsApp growth</h2>
            <p className="mt-4 text-muted-foreground">
              Bulk messaging, Meta ads, and chatbots — the three pillars of Zentrobot.
            </p>
          </div>

          <div className="grid gap-6 md:grid-cols-3">
            {ZENTROBOT_FEATURES.map((feature, i) => (
              <motion.article
                key={feature.slug}
                id={feature.slug}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.08 }}
                className="automation-panel flex flex-col p-6 md:p-8"
              >
                <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-xl bg-primary/15 text-primary">
                  <feature.Icon className="h-6 w-6" />
                </div>
                <h3 className="text-xl font-bold text-foreground">{feature.title}</h3>
                <p className="mt-2 text-sm text-muted-foreground">{feature.subtitle}</p>
                <p className="mt-4 flex-1 text-sm leading-relaxed text-muted-foreground">{feature.description}</p>
                <ul className="mt-5 space-y-2 border-t border-border/60 pt-5">
                  {feature.bullets.map((b) => (
                    <li key={b} className="flex gap-2 text-sm text-foreground">
                      <Check className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                      {b}
                    </li>
                  ))}
                </ul>
                <Button variant="link" className="mt-6 h-auto justify-start p-0 text-primary" asChild>
                  <Link to={`/automation/product/${feature.slug}`} className="inline-flex items-center gap-1">
                    Learn more <ArrowRight className="h-4 w-4" />
                  </Link>
                </Button>
              </motion.article>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section id="pricing" className="py-16 md:py-20">
        <div className="container">
          <div className="mx-auto mb-12 max-w-2xl text-center">
            <h2 className="text-2xl font-bold md:text-3xl">Pricing</h2>
            <p className="mt-3 text-sm text-muted-foreground md:text-base">
              Basic and Pro, monthly or yearly. Included features and additional add-ons are labelled on each card.
            </p>
          </div>
          <PricingGrid plans={plans} trial={trial} cycle={cycle} onCycleChange={setCycle} />
        </div>
      </section>

      {/* FAQ */}
      <section id="faq" className="border-t border-border/80 bg-muted/15 py-16 md:py-20">
        <div className="container max-w-2xl">
          <h2 className="text-center text-2xl font-bold md:text-3xl">FAQ</h2>
          <Accordion type="single" collapsible className="mt-8 w-full">
            {faqs.map((item, i) => (
              <AccordionItem key={item.q} value={`item-${i}`} className="border-border/60">
                <AccordionTrigger className="text-left text-sm hover:no-underline md:text-base">{item.q}</AccordionTrigger>
                <AccordionContent className="text-muted-foreground">{item.a}</AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </section>

      {/* CTA */}
      <section className="py-14 md:py-20">
        <div className="container">
          <div className="relative overflow-hidden rounded-3xl border border-primary/25 bg-gradient-to-br from-primary/15 via-card to-card p-8 md:p-12">
            <div className="relative flex flex-col gap-8 md:flex-row md:items-end md:justify-between">
              <div className="max-w-xl">
                <h2 className="text-2xl font-extrabold tracking-tight md:text-3xl">Start with Zentrobot</h2>
                <p className="mt-3 text-sm leading-relaxed text-muted-foreground md:text-base">
                  Launch bulk WhatsApp campaigns, connect Meta ads, and deploy chatbots — all in one platform.
                </p>
              </div>
              <div className="flex flex-wrap gap-3">
                <Button variant="hero" size="lg" asChild>
                  <Link to="/#contact">Book a demo</Link>
                </Button>
                <Button variant="outline" size="lg" className="border-border/80 bg-background/40" asChild>
                  <Link to="/register">Create account</Link>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
};

export default AutomationHome;
