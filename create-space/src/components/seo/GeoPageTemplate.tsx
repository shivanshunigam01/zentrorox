import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowRight, CheckCircle2, HelpCircle, IndianRupee, Lightbulb, ListOrdered, Quote, Target, Wrench } from "lucide-react";
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
import { geoPageSchemas } from "@/lib/schemaBuilders";
import type { GeoPageContent } from "@/types/geoPage";

type Props = {
  page: GeoPageContent;
  breadcrumbs: { name: string; path: string }[];
  basePath: "products" | "services" | "locations";
};

export const GeoPageTemplate = ({ page, breadcrumbs, basePath }: Props) => {
  const schemas = geoPageSchemas(page, breadcrumbs);

  return (
    <>
      <SeoHead
        title={page.metaTitle}
        description={page.metaDescription}
        path={`/${basePath}/${page.slug}`}
        keywords={page.keywords}
      />
      <JsonLd data={schemas} />

      <main className="min-h-screen bg-background">
        <Navbar />

        {/* Hero */}
        <section className="pt-24 pb-12 md:pt-28 md:pb-16 hero-bg">
          <div className="container max-w-4xl">
            <nav className="text-xs text-muted-foreground mb-6 flex flex-wrap gap-1">
              {breadcrumbs.map((b, i) => (
                <span key={b.path} className="flex items-center gap-1">
                  {i > 0 && <span>/</span>}
                  {i < breadcrumbs.length - 1 ? (
                    <Link to={b.path} className="hover:text-primary">{b.name}</Link>
                  ) : (
                    <span className="text-foreground font-medium">{b.name}</span>
                  )}
                </span>
              ))}
            </nav>
            <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}>
              <div className="text-xs font-bold uppercase tracking-widest text-primary mb-3">{page.tagline}</div>
              <h1 className="text-3xl md:text-5xl font-extrabold leading-tight mb-4">{page.h1}</h1>
              <p className="text-lg text-muted-foreground leading-relaxed mb-8">{page.whatIsIt}</p>
              <div className="flex flex-wrap gap-3">
                <Button variant="hero" size="lg" asChild>
                  <Link to="/#contact">Book Free Consultation</Link>
                </Button>
                <Button variant="outline-brand" size="lg" asChild>
                  <Link to="/#solutions">Explore Ecosystem</Link>
                </Button>
              </div>
            </motion.div>
          </div>
        </section>

        {/* What is this solution? — covered in hero via whatIsIt */}

        {/* Problems It Solves */}
        <section className="py-12 md:py-16 bg-muted/30">
          <div className="container max-w-4xl">
            <div className="flex items-center gap-2 text-primary font-bold text-sm uppercase tracking-widest mb-3">
              <HelpCircle className="h-4 w-4" /> Problems It Solves
            </div>
            <ul className="space-y-3">
              {(page.problemsSolved ?? [page.whyRequired]).map((p) => (
                <li key={p} className="flex items-start gap-2.5 text-sm text-muted-foreground">
                  <CheckCircle2 className="h-4 w-4 text-destructive shrink-0 mt-0.5" />{p}
                </li>
              ))}
            </ul>
          </div>
        </section>

        {/* Key Features */}
        <section className="py-12 md:py-16">
          <div className="container max-w-4xl">
            <div className="flex items-center gap-2 text-primary font-bold text-sm uppercase tracking-widest mb-6">
              <Wrench className="h-4 w-4" /> Key Features
            </div>
            <ul className="grid sm:grid-cols-2 gap-3">
              {(page.keyFeatures ?? page.benefits).map((b) => (
                <li key={b} className="flex items-start gap-2.5 text-sm font-medium">
                  <CheckCircle2 className="h-4 w-4 text-primary shrink-0 mt-0.5" />
                  {b}
                </li>
              ))}
            </ul>
          </div>
        </section>

        {/* Business Benefits */}
        <section className="py-12 md:py-16 bg-gradient-mesh">
          <div className="container max-w-4xl">
            <div className="flex items-center gap-2 text-primary font-bold text-sm uppercase tracking-widest mb-6">
              <Lightbulb className="h-4 w-4" /> Business Benefits
            </div>
            <ul className="grid sm:grid-cols-2 gap-3">
              {page.benefits.map((b) => (
                <li key={b} className="flex items-start gap-2.5 text-sm font-medium">
                  <CheckCircle2 className="h-4 w-4 text-primary shrink-0 mt-0.5" />
                  {b}
                </li>
              ))}
            </ul>
          </div>
        </section>

        {/* How It Works */}
        {page.howItWorks && page.howItWorks.length > 0 && (
          <section className="py-12 md:py-16">
            <div className="container max-w-4xl">
              <div className="flex items-center gap-2 text-primary font-bold text-sm uppercase tracking-widest mb-6">
                <ListOrdered className="h-4 w-4" /> How It Works
              </div>
              <ol className="space-y-4">
                {page.howItWorks.map((step, i) => (
                  <li key={step} className="flex gap-3 text-sm">
                    <span className="h-8 w-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-xs font-bold shrink-0">{i + 1}</span>
                    <span className="pt-1.5">{step}</span>
                  </li>
                ))}
              </ol>
            </div>
          </section>
        )}

        {/* Industries & Use Cases */}
        <section className="py-12 md:py-16 bg-gradient-mesh">
          <div className="container max-w-4xl grid md:grid-cols-2 gap-10">
            <div>
              <div className="flex items-center gap-2 text-primary font-bold text-sm uppercase tracking-widest mb-4">
                <Target className="h-4 w-4" /> Industries
              </div>
              <ul className="space-y-2">
                {page.industries.map((ind) => (
                  <li key={ind} className="text-sm text-muted-foreground flex items-center gap-2">
                    <span className="h-1.5 w-1.5 rounded-full bg-primary" />{ind}
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <div className="flex items-center gap-2 text-primary font-bold text-sm uppercase tracking-widest mb-4">
                <ArrowRight className="h-4 w-4" /> Use Cases
              </div>
              <ul className="space-y-2">
                {page.useCases.map((uc) => (
                  <li key={uc} className="text-sm text-muted-foreground flex items-center gap-2">
                    <span className="h-1.5 w-1.5 rounded-full bg-primary" />{uc}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </section>

        {/* Pricing */}
        <section className="py-12 md:py-16">
          <div className="container max-w-4xl">
            <div className="rounded-2xl border border-border bg-card p-6 md:p-8 shadow-card">
              <div className="flex items-center gap-2 text-primary font-bold text-sm uppercase tracking-widest mb-3">
                <IndianRupee className="h-4 w-4" /> Pricing Model
              </div>
              <p className="text-muted-foreground leading-relaxed">{page.pricingModel}</p>
            </div>
          </div>
        </section>

        {/* Success Story */}
        <section className="py-12 md:py-16 bg-secondary text-secondary-foreground">
          <div className="container max-w-4xl">
            <Quote className="h-8 w-8 text-primary-glow mb-4" />
            <blockquote className="text-xl md:text-2xl font-semibold leading-relaxed mb-4">
              "{page.successStory.quote}"
            </blockquote>
            <div className="text-sm font-bold">{page.successStory.author}</div>
            <div className="text-xs text-white/60">{page.successStory.company}</div>
          </div>
        </section>

        {/* FAQ */}
        <section className="py-12 md:py-16">
          <div className="container max-w-3xl">
            <h2 className="text-2xl md:text-3xl font-extrabold mb-6 text-center">Frequently Asked Questions</h2>
            <Accordion type="single" collapsible className="space-y-3">
              {page.faqs.map((f, i) => (
                <AccordionItem key={f.question} value={`faq-${i}`} className="rounded-xl border border-border bg-card px-5">
                  <AccordionTrigger className="text-left font-bold hover:no-underline">{f.question}</AccordionTrigger>
                  <AccordionContent className="text-muted-foreground leading-relaxed pb-4">{f.answer}</AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </div>
        </section>

        {/* Related */}
        {page.relatedLinks.length > 0 && (
          <section className="py-10 border-t border-border">
            <div className="container max-w-4xl">
              <h2 className="text-lg font-extrabold mb-4">Related Solutions</h2>
              <div className="flex flex-wrap gap-3">
                {page.relatedLinks.map((link) => (
                  <Link
                    key={link.href}
                    to={link.href}
                    className="px-4 py-2 rounded-full border border-border bg-card text-sm font-semibold hover:border-primary hover:text-primary transition"
                  >
                    {link.label}
                  </Link>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* CTA Form */}
        <section id="solution-form" className="py-12 md:py-16 bg-muted/30">
          <div className="container max-w-xl">
            <h2 className="text-2xl md:text-3xl font-extrabold mb-2 text-center">Get Started with {page.title}</h2>
            <p className="text-center text-muted-foreground mb-6">Request a free consultation or demo — we'll respond within 24 hours.</p>
            <div className="rounded-2xl border border-border bg-card p-6 shadow-card">
              <SolutionLeadForm productInterest={page.title} source={`geo-${page.slug}`} />
            </div>
          </div>
        </section>

        <Footer />
        <WhatsAppButton />
      </main>
    </>
  );
};
