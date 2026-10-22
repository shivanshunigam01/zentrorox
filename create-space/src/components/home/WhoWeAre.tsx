import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowRight, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { WHO_WE_ARE } from "@/data/homeContent";
import { SectionHeader } from "./SectionHeader";

export const WhoWeAre = () => (
  <section id="about" className="py-16 md:py-24 lg:py-28 bg-background">
    <div className="container">
      <SectionHeader eyebrow="About" title={WHO_WE_ARE.heading} />

      <div className="grid lg:grid-cols-2 gap-10 md:gap-14 items-start max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          className="space-y-5 text-muted-foreground text-lg leading-relaxed"
        >
          <p>{WHO_WE_ARE.intro}</p>
          <p>{WHO_WE_ARE.detail}</p>
          <p className="font-semibold text-foreground">{WHO_WE_ARE.specialize}</p>
          <Button variant="hero" size="lg" asChild className="mt-2">
            <Link to="/about">
              Know More <ArrowRight className="h-4 w-4" />
            </Link>
          </Button>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 20 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          className="rounded-2xl border border-border bg-card p-6 md:p-8 shadow-card"
        >
          <ul className="grid sm:grid-cols-2 gap-3 mb-6">
            {WHO_WE_ARE.pillars.map((item) => (
              <li key={item} className="flex items-start gap-2.5 text-sm font-medium">
                <CheckCircle2 className="h-4 w-4 text-primary shrink-0 mt-0.5" />
                {item}
              </li>
            ))}
          </ul>
          <p className="text-sm text-muted-foreground leading-relaxed border-t border-border pt-5">
            {WHO_WE_ARE.closing}
          </p>
        </motion.div>
      </div>
    </div>
  </section>
);
