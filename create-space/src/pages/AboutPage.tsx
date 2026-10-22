import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowRight, Building, Check, Target, Eye } from "lucide-react";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { WhatsAppButton } from "@/components/WhatsAppButton";
import { SeoHead } from "@/components/seo/SeoHead";
import { Button } from "@/components/ui/button";
import {
  ABOUT_HERO,
  ABOUT_WHO,
  ABOUT_MISSION,
  ABOUT_VISION,
  ABOUT_ECOSYSTEM,
  ABOUT_WHAT_WE_DO,
  ABOUT_WHY,
  ABOUT_CTA,
  ABOUT_PRODUCTS,
} from "@/data/aboutContent";
import { TIER_LABELS, type SolutionTier } from "@/data/homeContent";
import { IndustriesWeServe } from "@/components/home/IndustriesWeServe";

const TIER_ORDER: SolutionTier[] = [1, 2, 3];

const AboutPage = () => (
  <>
    <SeoHead
      title="About Us | Zentroverse Global — Business Growth & Digital Transformation"
      description="Learn about Zentroverse Global — Business Growth Intelligence, Digital Transformation, CRM, ERP, WhatsApp automation and Network Expansion ecosystem."
      path="/about"
    />
    <main className="min-h-screen bg-background">
      <Navbar />

      <section className="pt-24 pb-12 md:pt-28 md:pb-16 hero-bg">
        <div className="container max-w-4xl">
          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}>
            <p className="text-xs font-bold uppercase tracking-widest text-primary mb-3">About Zentroverse</p>
            <h1 className="text-3xl md:text-5xl font-extrabold leading-tight mb-4">{ABOUT_HERO.title}</h1>
            <p className="text-lg text-muted-foreground leading-relaxed">{ABOUT_HERO.subtitle}</p>
          </motion.div>
        </div>
      </section>

      <section className="py-16 md:py-20">
        <div className="container max-w-4xl">
          <h2 className="text-2xl md:text-3xl font-extrabold mb-6 flex items-center gap-2">
            <Building className="h-7 w-7 text-primary" /> {ABOUT_WHO.title}
          </h2>
          <div className="space-y-4 text-muted-foreground text-lg leading-relaxed">
            {ABOUT_WHO.paragraphs.map((p) => (
              <p key={p.slice(0, 48)}>{p}</p>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16 md:py-20 bg-muted/30">
        <div className="container">
          <h2 className="text-2xl md:text-3xl font-extrabold mb-10 text-center">{ABOUT_WHAT_WE_DO.title}</h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5 max-w-6xl mx-auto">
            {ABOUT_WHAT_WE_DO.items.map((item, i) => {
              const Icon = item.icon;
              return (
                <motion.div
                  key={item.title}
                  initial={{ opacity: 0, y: 16 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.05 }}
                  className="rounded-2xl border bg-card p-6 shadow-soft"
                >
                  <div className={`h-12 w-12 rounded-xl bg-gradient-to-br ${item.color} flex items-center justify-center mb-4`}>
                    <Icon className="h-6 w-6 text-white" />
                  </div>
                  <h3 className="font-extrabold text-lg mb-3">{item.title}</h3>
                  <ul className="space-y-1.5">
                    {item.items.map((sub) => (
                      <li key={sub} className="text-sm text-muted-foreground flex gap-2">
                        <Check className="h-3.5 w-3.5 text-primary shrink-0 mt-0.5" /> {sub}
                      </li>
                    ))}
                  </ul>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      <section className="py-16 md:py-20">
        <div className="container max-w-4xl grid md:grid-cols-2 gap-8">
          <div className="rounded-2xl border bg-card p-8 shadow-card">
            <Target className="h-8 w-8 text-primary mb-4" />
            <h2 className="text-xl font-extrabold mb-3">{ABOUT_MISSION.title}</h2>
            <p className="text-muted-foreground leading-relaxed">{ABOUT_MISSION.text}</p>
          </div>
          <div className="rounded-2xl border bg-card p-8 shadow-card">
            <Eye className="h-8 w-8 text-primary mb-4" />
            <h2 className="text-xl font-extrabold mb-3">{ABOUT_VISION.title}</h2>
            <p className="text-muted-foreground leading-relaxed">{ABOUT_VISION.text}</p>
          </div>
        </div>
      </section>

      <section className="py-16 md:py-20 bg-muted/30">
        <div className="container max-w-6xl">
          <h2 className="text-2xl md:text-3xl font-extrabold mb-2 text-center">{ABOUT_ECOSYSTEM.title}</h2>
          <p className="text-center text-muted-foreground mb-10 max-w-2xl mx-auto">{ABOUT_ECOSYSTEM.subtitle}</p>
          {TIER_ORDER.map((tier) => (
            <div key={tier} className="mb-8 last:mb-0">
              <p className="text-xs font-bold uppercase tracking-widest text-primary mb-4">
                Level {tier} — {TIER_LABELS[tier]}
              </p>
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {ABOUT_PRODUCTS.filter((b) => b.tier === tier).map((brand) => {
                  const Icon = brand.icon;
                  return (
                    <Link
                      key={brand.key}
                      to={`/products/${brand.key}`}
                      className="rounded-xl border bg-card p-5 hover:shadow-card hover:-translate-y-0.5 transition-all"
                    >
                      <Icon className={`h-6 w-6 ${brand.color} mb-2`} />
                      <h3 className="font-bold">{brand.name}</h3>
                      <p className="text-xs text-muted-foreground mt-1">{brand.tagline}</p>
                    </Link>
                  );
                })}
              </div>
            </div>
          ))}
          <div className="grid sm:grid-cols-2 gap-4 mt-6">
            {ABOUT_ECOSYSTEM.extras.map((extra) => (
              <div key={extra.name} className="rounded-xl border bg-card p-5 ring-2 ring-primary/20">
                <h3 className="font-bold text-lg">{extra.name}</h3>
                <p className="text-sm text-muted-foreground mt-1">{extra.tagline}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <IndustriesWeServe />

      <section className="py-16 md:py-20 bg-secondary text-secondary-foreground">
        <div className="container max-w-6xl">
          <h2 className="text-2xl md:text-3xl font-extrabold mb-10 text-center">{ABOUT_WHY.title}</h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {ABOUT_WHY.items.map((item) => {
              const Icon = item.icon;
              return (
                <div key={item.title} className="rounded-2xl border border-white/10 bg-white/5 p-6">
                  <Icon className="h-6 w-6 text-primary-glow mb-3" />
                  <h3 className="font-extrabold mb-2">{item.title}</h3>
                  <p className="text-sm text-white/70">{item.desc}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      <section className="py-16 md:py-20 bg-gradient-primary text-primary-foreground">
        <div className="container max-w-3xl text-center">
          <h2 className="text-2xl md:text-4xl font-extrabold mb-4">{ABOUT_CTA.title}</h2>
          <p className="text-white/80 mb-8 text-lg">{ABOUT_CTA.subtitle}</p>
          <div className="flex flex-wrap gap-3 justify-center">
            <Button variant="secondary" size="lg" asChild>
              <Link to="/#contact">Book Free Consultation</Link>
            </Button>
            <Button variant="outline" size="lg" className="border-white/30 text-white hover:bg-white/10" asChild>
              <Link to="/products">
                Explore Solutions <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
          </div>
        </div>
      </section>

      <Footer />
      <WhatsAppButton />
    </main>
  </>
);

export default AboutPage;
