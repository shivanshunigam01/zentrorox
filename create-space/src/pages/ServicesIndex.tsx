import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import {
  ArrowRight,
  Briefcase,
  LayoutDashboard,
  Megaphone,
  MessageCircle,
  Target,
  Workflow,
  type LucideIcon,
} from "lucide-react";
import { SERVICE_GEO_PAGES } from "@/data/geoContent";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { WhatsAppButton } from "@/components/WhatsAppButton";
import { SeoHead } from "@/components/seo/SeoHead";
import { JsonLd } from "@/components/seo/JsonLd";
import { breadcrumbSchema } from "@/lib/schemaBuilders";
import { BRAND_TAGLINE } from "@/data/seoContent";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const SERVICE_ICONS: Record<string, LucideIcon> = {
  "digital-marketing": Megaphone,
  "business-automation": LayoutDashboard,
  "lead-management": Workflow,
  "whatsapp-ai": MessageCircle,
  "business-consultancy": Briefcase,
  "network-expansion": Target,
};

const SERVICE_TONES: Record<string, { icon: string; wash: string }> = {
  "digital-marketing": { icon: "from-rose-500 to-brand-pink", wash: "from-rose-500/12 via-transparent to-transparent" },
  "business-automation": { icon: "from-slate-600 to-primary", wash: "from-primary/10 via-transparent to-transparent" },
  "lead-management": { icon: "from-orange-500 to-emerald-500", wash: "from-orange-500/10 via-transparent to-transparent" },
  "whatsapp-ai": { icon: "from-emerald-500 to-primary", wash: "from-emerald-500/10 via-transparent to-transparent" },
  "business-consultancy": { icon: "from-brand-purple to-brand-pink", wash: "from-brand-purple/10 via-transparent to-transparent" },
  "network-expansion": { icon: "from-primary to-brand-blue", wash: "from-primary/10 via-transparent to-transparent" },
};

export default function ServicesIndex() {
  const [featured, ...supporting] = SERVICE_GEO_PAGES;
  const FeaturedIcon = SERVICE_ICONS[featured.slug] ?? Megaphone;
  const featuredTone = SERVICE_TONES[featured.slug];

  return (
    <>
      <SeoHead
        title="Services | Zentroverse Global — Digital Marketing, CRM, ERP & Consulting"
        description={`Explore Zentroverse services: digital marketing, business automation, lead management, WhatsApp API, consultancy and network expansion. ${BRAND_TAGLINE}`}
        path="/services"
      />
      <JsonLd data={breadcrumbSchema([
        { name: "Home", path: "/" },
        { name: "Services", path: "/services" },
      ])} />

      <main className="min-h-screen bg-background">
        <Navbar />
        <section className="pt-24 pb-16 md:pt-28 md:pb-20 container">
          <h1 className="text-3xl md:text-5xl font-extrabold mb-4">Our Services</h1>
          <p className="text-muted-foreground text-lg max-w-2xl mb-10 md:mb-14">{BRAND_TAGLINE}</p>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 md:gap-6 lg:gap-7">
            <motion.div
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
              className="lg:col-span-8 lg:row-span-2"
            >
              <Link
                to={`/services/${featured.slug}`}
                className={cn(
                  "group relative flex h-full min-h-[22rem] flex-col overflow-hidden rounded-3xl border border-border bg-card p-7 md:p-10 shadow-card",
                  "transition-all duration-300 hover:border-primary/25 hover:shadow-elegant",
                )}
              >
                <div className={cn("pointer-events-none absolute inset-0 bg-gradient-to-br opacity-90", featuredTone?.wash)} />
                <div className="relative flex h-full flex-col">
                  <div className="mb-8 flex items-start justify-between gap-4">
                    <span
                      className={cn(
                        "inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br text-white shadow-soft transition-transform duration-300 group-hover:scale-105",
                        featuredTone?.icon,
                      )}
                    >
                      <FeaturedIcon className="h-7 w-7" />
                    </span>
                    <span className="text-[11px] font-bold uppercase tracking-[0.18em] text-primary">
                      Featured
                    </span>
                  </div>
                  <div className="text-xs font-bold uppercase tracking-widest text-primary mb-3">
                    {featured.tagline}
                  </div>
                  <h2 className="text-3xl md:text-4xl font-extrabold tracking-tight mb-4 max-w-xl">
                    {featured.title}
                  </h2>
                  <p className="text-muted-foreground text-base md:text-lg leading-relaxed max-w-2xl mb-8">
                    {featured.whatIsIt}
                  </p>
                  <div className="mt-auto">
                    <Button variant="hero" size="lg" className="pointer-events-none">
                      Explore {featured.title}
                      <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-0.5" />
                    </Button>
                  </div>
                </div>
              </Link>
            </motion.div>

            {supporting.slice(0, 2).map((s, i) => {
              const Icon = SERVICE_ICONS[s.slug] ?? Target;
              const tone = SERVICE_TONES[s.slug];
              return (
                <motion.div
                  key={s.slug}
                  initial={{ opacity: 0, y: 18 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: 0.08 + i * 0.05 }}
                  className="lg:col-span-4"
                >
                  <Link
                    to={`/services/${s.slug}`}
                    className="group flex h-full flex-col rounded-3xl border border-border bg-card p-6 md:p-7 shadow-card transition-all duration-300 hover:border-primary/20 hover:shadow-elegant"
                  >
                    <span
                      className={cn(
                        "mb-5 inline-flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br text-white shadow-soft transition-transform duration-300 group-hover:scale-105",
                        tone?.icon,
                      )}
                    >
                      <Icon className="h-5 w-5" />
                    </span>
                    <div className="text-[11px] font-bold uppercase tracking-widest text-primary mb-2">
                      {s.tagline}
                    </div>
                    <h2 className="text-xl font-extrabold mb-2 leading-snug">{s.title}</h2>
                    <p className="text-sm text-muted-foreground leading-relaxed line-clamp-3 mb-5">
                      {s.whatIsIt}
                    </p>
                    <span className="mt-auto inline-flex items-center gap-1 text-sm font-bold text-foreground group-hover:text-primary group-hover:gap-1.5 transition-all">
                      Explore <ArrowRight className="h-4 w-4" />
                    </span>
                  </Link>
                </motion.div>
              );
            })}

            {supporting.slice(2).map((s, i) => {
              const Icon = SERVICE_ICONS[s.slug] ?? Target;
              const tone = SERVICE_TONES[s.slug];
              return (
                <motion.div
                  key={s.slug}
                  initial={{ opacity: 0, y: 18 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: 0.18 + i * 0.05 }}
                  className="lg:col-span-4"
                >
                  <Link
                    to={`/services/${s.slug}`}
                    className="group flex h-full flex-col rounded-2xl border border-border bg-card/80 p-5 md:p-6 transition-all duration-300 hover:border-primary/20 hover:bg-card hover:shadow-elegant"
                  >
                    <span
                      className={cn(
                        "mb-4 inline-flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br text-white shadow-soft transition-transform duration-300 group-hover:scale-105",
                        tone?.icon,
                      )}
                    >
                      <Icon className="h-5 w-5" />
                    </span>
                    <div className="text-[11px] font-bold uppercase tracking-widest text-primary mb-1.5">
                      {s.tagline}
                    </div>
                    <h2 className="text-lg font-extrabold mb-2 leading-snug">{s.title}</h2>
                    <p className="text-sm text-muted-foreground leading-relaxed line-clamp-2 mb-4">
                      {s.whatIsIt}
                    </p>
                    <span className="mt-auto inline-flex items-center gap-1 text-sm font-bold text-muted-foreground group-hover:text-primary group-hover:gap-1.5 transition-all">
                      Explore <ArrowRight className="h-3.5 w-3.5" />
                    </span>
                  </Link>
                </motion.div>
              );
            })}
          </div>
        </section>
        <Footer />
        <WhatsAppButton />
      </main>
    </>
  );
}
