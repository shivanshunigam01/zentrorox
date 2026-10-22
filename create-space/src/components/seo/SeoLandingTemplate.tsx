import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowRight, CheckCircle2, HelpCircle, Lightbulb, ListOrdered, Target } from "lucide-react";
import {
  Accordion, AccordionContent, AccordionItem, AccordionTrigger,
} from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { WhatsAppButton } from "@/components/WhatsAppButton";
import { SeoHead } from "@/components/seo/SeoHead";
import { JsonLd } from "@/components/seo/JsonLd";
import { SolutionLeadForm } from "@/components/forms/SolutionLeadForm";
import type { SeoLandingPage } from "@/data/seoLandingPages";
import { SITE_URL } from "@/data/seoContent";

type Props = { page: SeoLandingPage };

export const SeoLandingTemplate = ({ page }: Props) => {
  const schemas = [
    {
      "@context": "https://schema.org",
      "@type": "Service",
      name: page.h1,
      description: page.metaDescription,
      provider: { "@type": "Organization", name: "Zentroverse Global Private Limited", url: SITE_URL },
      areaServed: "IN",
    },
    {
      "@context": "https://schema.org",
      "@type": "FAQPage",
      mainEntity: page.faqs.map((f) => ({
        "@type": "Question",
        name: f.question,
        acceptedAnswer: { "@type": "Answer", text: f.answer },
      })),
    },
    {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      itemListElement: [
        { "@type": "ListItem", position: 1, name: "Home", item: SITE_URL },
        { "@type": "ListItem", position: 2, name: page.h1, item: `${SITE_URL}/${page.slug}` },
      ],
    },
  ];

  return (
    <>
      <SeoHead title={page.metaTitle} description={page.metaDescription} path={`/${page.slug}`} keywords={page.keywords} />
      <JsonLd data={schemas} />
      <main className="min-h-screen bg-background">
        <Navbar />
        <section className="pt-24 pb-12 md:pt-28 hero-bg">
          <div className="container max-w-4xl">
            <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}>
              <h1 className="text-3xl md:text-5xl font-extrabold leading-tight mb-4">{page.h1}</h1>
              <p className="text-lg text-muted-foreground leading-relaxed mb-8">{page.intro}</p>
              <div className="flex flex-wrap gap-3">
                <Button variant="hero" size="lg" asChild>
                  <a href="#lead-form">{page.ctaLabel}</a>
                </Button>
                <Button variant="outline-brand" size="lg" asChild>
                  <Link to={page.relatedHref}>Explore Solution <ArrowRight className="h-4 w-4" /></Link>
                </Button>
              </div>
            </motion.div>
          </div>
        </section>

        <Section title="Problems It Solves" icon={HelpCircle}>
          <ul className="grid sm:grid-cols-2 gap-3">
            {page.problems.map((p) => (
              <li key={p} className="flex gap-2 text-sm"><CheckCircle2 className="h-4 w-4 text-destructive shrink-0 mt-0.5" />{p}</li>
            ))}
          </ul>
        </Section>

        <Section title="Key Features" icon={Lightbulb} alt>
          <ul className="grid sm:grid-cols-2 gap-3">
            {page.features.map((f) => (
              <li key={f} className="flex gap-2 text-sm font-medium"><CheckCircle2 className="h-4 w-4 text-primary shrink-0 mt-0.5" />{f}</li>
            ))}
          </ul>
        </Section>

        <Section title="Business Benefits" icon={Target}>
          <ul className="grid sm:grid-cols-2 gap-3">
            {page.benefits.map((b) => (
              <li key={b} className="text-sm text-muted-foreground flex gap-2"><span className="h-1.5 w-1.5 rounded-full bg-primary mt-2 shrink-0" />{b}</li>
            ))}
          </ul>
        </Section>

        <Section title="Use Cases & Industries" icon={ListOrdered} alt>
          <div className="grid md:grid-cols-2 gap-8">
            <div>
              <h3 className="font-bold mb-3">Use Cases</h3>
              <ul className="space-y-2">{page.useCases.map((u) => <li key={u} className="text-sm text-muted-foreground">• {u}</li>)}</ul>
            </div>
            <div>
              <h3 className="font-bold mb-3">Industries</h3>
              <ul className="space-y-2">{page.industries.map((i) => <li key={i} className="text-sm text-muted-foreground">• {i}</li>)}</ul>
            </div>
          </div>
        </Section>

        <Section title="How It Works" icon={ListOrdered}>
          <ol className="space-y-3">
            {page.howItWorks.map((step, i) => (
              <li key={step} className="flex gap-3 text-sm">
                <span className="h-7 w-7 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-xs font-bold shrink-0">{i + 1}</span>
                {step}
              </li>
            ))}
          </ol>
        </Section>

        <section className="py-12 md:py-16">
          <div className="container max-w-3xl">
            <h2 className="text-2xl font-extrabold mb-6 text-center">Frequently Asked Questions</h2>
            <Accordion type="single" collapsible className="space-y-3">
              {page.faqs.map((f, i) => (
                <AccordionItem key={f.question} value={`f-${i}`} className="rounded-xl border px-5">
                  <AccordionTrigger className="font-bold text-left">{f.question}</AccordionTrigger>
                  <AccordionContent className="text-muted-foreground pb-4">{f.answer}</AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </div>
        </section>

        <section id="lead-form" className="py-12 md:py-16 bg-muted/30">
          <div className="container max-w-xl">
            <h2 className="text-2xl font-extrabold mb-2 text-center">{page.ctaLabel}</h2>
            <p className="text-center text-muted-foreground mb-6">Fill in your details and our team will reach out within 24 hours.</p>
            <div className="rounded-2xl border bg-card p-6 shadow-card">
              <SolutionLeadForm productInterest={page.h1} source={`seo-${page.slug}`} />
            </div>
          </div>
        </section>

        <Footer />
        <WhatsAppButton />
      </main>
    </>
  );
};

const Section = ({ title, icon: Icon, children, alt }: { title: string; icon: typeof HelpCircle; children: React.ReactNode; alt?: boolean }) => (
  <section className={`py-12 md:py-16 ${alt ? "bg-muted/30" : ""}`}>
    <div className="container max-w-4xl">
      <div className="flex items-center gap-2 text-primary font-bold text-sm uppercase tracking-widest mb-6">
        <Icon className="h-4 w-4" /> {title}
      </div>
      {children}
    </div>
  </section>
);
