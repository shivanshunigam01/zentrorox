import { motion } from "framer-motion";
import { ChevronDown } from "lucide-react";
import { PROCESS_STEPS } from "@/data/homeContent";
import { SectionHeader } from "./SectionHeader";

export const OurProcess = () => (
  <section className="py-16 md:py-24 lg:py-28 bg-gradient-mesh">
    <div className="container">
      <SectionHeader eyebrow="How We Work" title="Our Process" />

      <div className="flex flex-col md:flex-row md:flex-wrap md:justify-center items-center gap-4 md:gap-2 max-w-5xl mx-auto">
        {PROCESS_STEPS.map((step, i) => (
          <div key={step.step} className="flex flex-col md:flex-row items-center gap-4 md:gap-2">
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.08 }}
              className="rounded-2xl border border-border bg-card px-6 py-5 text-center shadow-card min-w-[140px] hover:shadow-elegant transition-all"
            >
              <div className="text-xs font-bold text-primary mb-1">Step {i + 1}</div>
              <div className="text-lg font-extrabold mb-1">{step.step}</div>
              <div className="text-xs text-muted-foreground">{step.desc}</div>
            </motion.div>
            {i < PROCESS_STEPS.length - 1 && (
              <ChevronDown className="h-5 w-5 text-primary/50 md:rotate-[-90deg] shrink-0" />
            )}
          </div>
        ))}
      </div>
    </div>
  </section>
);
