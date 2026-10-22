import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowRight, ChevronRight } from "lucide-react";
import { OUTCOME_CARDS } from "@/data/homeContent";
import { SectionHeader } from "./SectionHeader";
import { cn } from "@/lib/utils";

export const BusinessOutcomeCards = () => (
  <section className="py-16 md:py-20 bg-background overflow-hidden">
    <div className="container">
      <SectionHeader
        eyebrow="Business Growth Journey"
        title="What We Help You Achieve"
        subtitle="Every solution is mapped to a measurable business outcome — not just software features."
      />

      {/* Desktop / laptop: connected horizontal journey */}
      <div className="hidden lg:block relative pt-2">
        <motion.div
          aria-hidden
          initial={{ scaleX: 0 }}
          whileInView={{ scaleX: 1 }}
          viewport={{ once: true, amount: 0.4 }}
          transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
          className="absolute top-[2.35rem] left-[7%] right-[7%] h-px origin-left bg-gradient-to-r from-primary/20 via-primary/55 to-primary/20"
        />

        <div className="grid grid-cols-5 gap-4 xl:gap-6">
          {OUTCOME_CARDS.map((card, i) => {
            const Icon = card.icon;
            return (
              <motion.div
                key={card.step}
                initial={{ opacity: 0, y: 28 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.35 }}
                transition={{ delay: 0.12 + i * 0.1, duration: 0.45, ease: "easeOut" }}
                className="relative flex flex-col items-center text-center"
              >
                {i < OUTCOME_CARDS.length - 1 && (
                  <motion.span
                    aria-hidden
                    initial={{ opacity: 0, x: -6 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.45 + i * 0.1 }}
                    className="absolute top-[1.85rem] -right-3 xl:-right-4 z-0 text-primary/50"
                  >
                    <ChevronRight className="h-5 w-5" />
                  </motion.span>
                )}

                <Link to={card.href} className="group flex flex-col items-center w-full">
                  <span
                    className={cn(
                      "relative z-10 mb-5 flex h-[4.7rem] w-[4.7rem] items-center justify-center rounded-full bg-gradient-to-br shadow-soft ring-4 ring-background transition-all duration-300",
                      "group-hover:scale-110 group-hover:shadow-elegant group-hover:ring-primary/15",
                      card.color,
                    )}
                  >
                    <Icon className="h-6 w-6 text-white" />
                    <span className="absolute -top-1 -right-1 flex h-6 min-w-6 items-center justify-center rounded-full bg-background px-1 text-[10px] font-extrabold tabular-nums text-primary ring-1 ring-border">
                      {card.step}
                    </span>
                  </span>

                  <span className="text-[11px] font-bold uppercase tracking-[0.18em] text-primary mb-1.5">
                    {card.stage}
                  </span>
                  <h3 className="text-base xl:text-lg font-extrabold leading-snug mb-2 group-hover:text-primary transition-colors">
                    {card.title}
                  </h3>
                  <p className="text-xs text-muted-foreground leading-relaxed mb-2 max-w-[16rem]">
                    {card.detail}
                  </p>
                  <p className="text-[11px] text-primary font-semibold mb-3">Powered by {card.poweredBy}</p>
                  <span className="inline-flex items-center gap-1 text-xs font-bold text-muted-foreground group-hover:text-primary group-hover:gap-1.5 transition-all">
                    Learn more <ArrowRight className="h-3.5 w-3.5" />
                  </span>
                </Link>
              </motion.div>
            );
          })}
        </div>
      </div>

      {/* Mobile / tablet: vertical timeline */}
      <div className="lg:hidden relative max-w-lg mx-auto">
        <motion.div
          aria-hidden
          initial={{ scaleY: 0 }}
          whileInView={{ scaleY: 1 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
          className="absolute left-[1.45rem] top-4 bottom-6 w-px origin-top bg-gradient-to-b from-primary/50 via-primary/30 to-primary/10"
        />

        <ol className="space-y-8">
          {OUTCOME_CARDS.map((card, i) => {
            const Icon = card.icon;
            return (
              <motion.li
                key={card.step}
                initial={{ opacity: 0, x: -18 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, amount: 0.4 }}
                transition={{ delay: i * 0.08, duration: 0.4, ease: "easeOut" }}
                className="relative flex gap-4"
              >
                <Link to={card.href} className="group flex gap-4 min-w-0 w-full">
                  <span
                    className={cn(
                      "relative z-10 mt-0.5 flex h-[2.9rem] w-[2.9rem] shrink-0 items-center justify-center rounded-full bg-gradient-to-br shadow-soft ring-4 ring-background transition-transform duration-300 group-hover:scale-105",
                      card.color,
                    )}
                  >
                    <Icon className="h-4 w-4 text-white" />
                  </span>

                  <div className="min-w-0 pt-0.5">
                    <div className="flex items-baseline gap-2 mb-1">
                      <span className="text-[11px] font-extrabold tabular-nums text-primary">{card.step}</span>
                      <span className="text-[11px] font-bold uppercase tracking-[0.16em] text-primary">
                        {card.stage}
                      </span>
                    </div>
                    <h3 className="text-lg font-extrabold leading-snug mb-1 group-hover:text-primary transition-colors">
                      {card.title}
                    </h3>
                    <p className="text-sm text-muted-foreground leading-relaxed mb-2">{card.detail}</p>
                    <p className="text-xs text-primary font-semibold mb-2">Powered by {card.poweredBy}</p>
                    <span className="inline-flex items-center gap-1 text-sm font-bold text-muted-foreground group-hover:text-primary group-hover:gap-1.5 transition-all">
                      Learn more <ArrowRight className="h-4 w-4" />
                    </span>
                  </div>
                </Link>
              </motion.li>
            );
          })}
        </ol>
      </div>
    </div>
  </section>
);
