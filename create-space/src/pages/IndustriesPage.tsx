import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowRight, CheckCircle2, HelpCircle } from "lucide-react";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { WhatsAppButton } from "@/components/WhatsAppButton";
import { SeoHead } from "@/components/seo/SeoHead";
import { Button } from "@/components/ui/button";
import { INDUSTRIES_PAGE } from "@/data/industriesContent";

const IndustriesPage = () => (
  <>
    <SeoHead
      title="Industries We Serve | Zentroverse Global"
      description="Industry-specific business growth solutions for automotive, EV, manufacturing, retail, healthcare, education, MSME, franchise and distribution businesses."
      path="/industries"
    />
    <main className="min-h-screen bg-background">
      <Navbar />

      <section className="pt-24 pb-12 md:pt-28 md:pb-16 hero-bg">
        <div className="container max-w-4xl text-center">
          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}>
            <p className="text-xs font-bold uppercase tracking-widest text-primary mb-3">Sectors</p>
            <h1 className="text-3xl md:text-5xl font-extrabold mb-4">Industries We Serve</h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Tailored growth, automation and network expansion solutions for every sector we work with.
            </p>
          </motion.div>
        </div>
      </section>

      <section className="py-16 md:py-20">
        <div className="container max-w-6xl space-y-10">
          {INDUSTRIES_PAGE.map((industry, i) => (
            <motion.article
              key={industry.id}
              id={industry.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.04 }}
              className="scroll-mt-28 rounded-2xl border border-border bg-card p-6 md:p-8 shadow-card"
            >
              <div className="flex items-start gap-4 mb-4">
                <span className="text-4xl" aria-hidden>{industry.icon}</span>
                <div>
                  <h2 className="text-2xl font-extrabold">{industry.name}</h2>
                  <p className="text-muted-foreground mt-2 leading-relaxed">{industry.description}</p>
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-6 mt-6">
                <div>
                  <h3 className="flex items-center gap-2 text-sm font-bold uppercase tracking-wider text-destructive mb-3">
                    <HelpCircle className="h-4 w-4" /> Problems We Solve
                  </h3>
                  <ul className="space-y-2">
                    {industry.problems.map((p) => (
                      <li key={p} className="text-sm text-muted-foreground flex gap-2">
                        <span className="text-destructive mt-1">•</span> {p}
                      </li>
                    ))}
                  </ul>
                </div>
                <div>
                  <h3 className="flex items-center gap-2 text-sm font-bold uppercase tracking-wider text-primary mb-3">
                    <CheckCircle2 className="h-4 w-4" /> Relevant Solutions
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {industry.solutions.map((s) => (
                      <span key={s} className="text-xs font-semibold px-3 py-1.5 rounded-full bg-primary/10 text-primary">
                        {s}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              <Button variant="hero" className="mt-6" asChild>
                <Link to="/#contact">
                  {industry.cta} <ArrowRight className="h-4 w-4" />
                </Link>
              </Button>
            </motion.article>
          ))}
        </div>
      </section>

      <Footer />
      <WhatsAppButton />
    </main>
  </>
);

export default IndustriesPage;
