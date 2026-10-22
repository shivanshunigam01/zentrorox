import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowRight, Calendar, ClipboardCheck, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { HERO } from "@/data/homeContent";
import { trackEvent } from "@/lib/analytics";
import { useHeroSeoSection } from "@/hooks/useCmsSections";

export const HeroBanner = () => {
  const { hero } = useHeroSeoSection();
  const headline = hero.headline || HERO.headline;
  const tagline = hero.tagline || HERO.tagline;
  const subheadline = hero.subheadline || HERO.subheadline;
  const ctas = HERO.ctas;

  return (
    <section className="relative pt-20 md:pt-28 pb-16 md:pb-20 overflow-hidden hero-bg" aria-label="Hero">
      <div className="absolute -top-20 -left-20 w-[28rem] h-[28rem] bg-brand-purple/20 rounded-full blur-3xl animate-float" />
      <div className="absolute top-20 -right-20 w-[28rem] h-[28rem] bg-primary/20 rounded-full blur-3xl animate-float-delayed" />
      <div className="absolute inset-0 grid-pattern opacity-40" />

      <div className="container relative text-center max-w-5xl">
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="text-[1.75rem] sm:text-4xl md:text-5xl lg:text-6xl font-extrabold leading-[1.08] mb-4"
        >
          {headline.split("&").map((part, i) =>
            i === 0 ? (
              <span key={i}>{part.trim()} & </span>
            ) : (
              <span key={i} className="gradient-brand-text">{part.trim()}</span>
            ),
          )}
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
          className="text-sm sm:text-base font-semibold text-primary mb-4 max-w-3xl mx-auto"
        >
          {tagline}
        </motion.p>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="text-base sm:text-lg md:text-xl text-muted-foreground mb-10 max-w-4xl mx-auto leading-relaxed"
        >
          {subheadline}
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="flex flex-col sm:flex-row flex-wrap gap-3 justify-center"
        >
          {ctas.map((cta) => {
            const icon =
              cta.label === "Book Free Consultation" ? <Calendar className="h-4 w-4" /> :
              cta.label === "Request Demo" ? <ArrowRight className="h-4 w-4" /> :
              cta.label === "Get Free Business Audit" ? <ClipboardCheck className="h-4 w-4" /> :
              cta.label === "Free Trial" ? <Sparkles className="h-4 w-4" /> :
              null;
            const onClick = () => cta.event && trackEvent(cta.event, { source: "hero", cta: cta.label });
            const isRoute = cta.href.startsWith("/");

            return (
              <Button key={cta.label} variant={cta.variant} size="xl" asChild>
                {isRoute ? (
                  <Link to={cta.href} onClick={onClick}>
                    {icon}
                    {cta.label}
                  </Link>
                ) : (
                  <a href={cta.href} onClick={onClick}>
                    {icon}
                    {cta.label}
                  </a>
                )}
              </Button>
            );
          })}
        </motion.div>
      </div>
    </section>
  );
};
