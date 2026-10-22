import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowRight, Bot, Download, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { WhatsAppButton } from "@/components/WhatsAppButton";
import { SeoHead } from "@/components/seo/SeoHead";
import {
  DOWNLOADABLE_RESOURCES, GROWTH_HUB_CATEGORIES, GROWTH_TOOLS, INDUSTRY_KNOWLEDGE,
} from "@/data/growthHubContent";

const GrowthHubIndex = () => {
  const featured = GROWTH_TOOLS.filter((t) => t.featured);
  const byCategory = (cat: string) => GROWTH_TOOLS.filter((t) => t.category === cat || (cat === "Audits" && t.category === "Assessments"));

  return (
    <>
      <SeoHead
        title="Growth Hub | Business Intelligence Tools & Assessments — Zentroverse"
        description="Free business growth tools, assessments, calculators and audits. Digital maturity, CRM readiness, dealer network potential, marketing budget planner and AI-powered business audit."
        path="/growth-hub"
      />
      <main className="min-h-screen bg-background">
        <Navbar />
        <section className="pt-24 pb-12 md:pt-28 hero-bg">
          <div className="container max-w-4xl text-center">
            <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}>
              <span className="text-xs font-bold uppercase tracking-widest text-primary">Business Growth Intelligence</span>
              <h1 className="text-3xl md:text-5xl font-extrabold mt-3 mb-4">Growth Hub</h1>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto mb-8">
                Evaluate, benchmark and improve your business with data-driven assessments, calculators, audits and AI-powered recommendations.
              </p>
              <div className="flex flex-wrap gap-3 justify-center">
                <Button variant="hero" size="lg" asChild>
                  <Link to="/growth-hub/tools/business-growth-audit"><Sparkles className="h-4 w-4" /> AI Business Growth Audit</Link>
                </Button>
                <Button variant="outline-brand" size="lg" asChild>
                  <Link to="/growth-hub/ask-ai"><Bot className="h-4 w-4" /> Ask Zentro AI</Link>
                </Button>
              </div>
            </motion.div>
          </div>
        </section>

        {featured.map((t) => {
          const Icon = t.icon;
          return (
            <section key={t.id} className="py-8 border-b border-border bg-gradient-mesh">
              <div className="container max-w-4xl">
                <Link to={`/growth-hub/tools/${t.id}`} className="flex flex-col md:flex-row gap-6 items-center rounded-2xl border bg-card p-6 hover:shadow-elegant transition-shadow">
                  <Icon className="h-12 w-12 text-primary shrink-0" />
                  <div className="flex-1 text-center md:text-left">
                    <span className="text-xs font-bold text-primary uppercase">Flagship Tool</span>
                    <h2 className="text-xl font-extrabold">{t.title}</h2>
                    <p className="text-sm text-muted-foreground mt-1">{t.description}</p>
                  </div>
                  <Button variant="hero">Start Assessment <ArrowRight className="h-4 w-4" /></Button>
                </Link>
              </div>
            </section>
          );
        })}

        <section className="py-16 container">
          <h2 className="text-2xl font-extrabold mb-6">Business Intelligence Tools</h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {GROWTH_TOOLS.filter((t) => !t.featured).map((t, i) => {
              const Icon = t.icon;
              return (
                <motion.div key={t.id} initial={{ opacity: 0, y: 12 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.03 }}>
                  <Link to={`/growth-hub/tools/${t.id}`} className="block h-full rounded-xl border bg-card p-5 hover:-translate-y-1 hover:shadow-card transition-all">
                    <Icon className="h-8 w-8 text-primary mb-3" />
                    <span className="text-[10px] font-bold uppercase text-muted-foreground">{t.category}</span>
                    <h3 className="font-bold mt-1 mb-2">{t.title}</h3>
                    <p className="text-xs text-muted-foreground line-clamp-2">{t.description}</p>
                  </Link>
                </motion.div>
              );
            })}
          </div>
        </section>

        <section className="py-16 bg-muted/30">
          <div className="container grid md:grid-cols-2 gap-10">
            <div>
              <h2 className="text-xl font-extrabold mb-4">Industry Knowledge</h2>
              <div className="flex flex-wrap gap-2">
                {INDUSTRY_KNOWLEDGE.map((i) => (
                  <span key={i} className="text-xs font-semibold px-3 py-1.5 rounded-full bg-card border">{i}</span>
                ))}
              </div>
            </div>
            <div>
              <h2 className="text-xl font-extrabold mb-4">Downloadable Resources</h2>
              <ul className="space-y-2">
                {DOWNLOADABLE_RESOURCES.map((r) => (
                  <li key={r.title} className="flex items-center justify-between text-sm rounded-lg border bg-card px-3 py-2">
                    <span>{r.title}</span>
                    <Button variant="ghost" size="sm" asChild>
                      <Link to="/#contact" onClick={() => {}}><Download className="h-3 w-3" /> Request</Link>
                    </Button>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </section>

        <section className="py-12 container">
          <div className="flex flex-wrap gap-2 justify-center">
            {GROWTH_HUB_CATEGORIES.map((c) => (
              <span key={c} className="text-xs px-3 py-1 rounded-full bg-muted text-muted-foreground">{c}</span>
            ))}
          </div>
        </section>

        <Footer />
        <WhatsAppButton />
      </main>
    </>
  );
};

export default GrowthHubIndex;
