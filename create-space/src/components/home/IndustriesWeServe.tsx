import { motion } from "framer-motion";
import { INDUSTRIES } from "@/data/homeContent";
import { SectionHeader } from "./SectionHeader";

export const IndustriesWeServe = () => (
  <section id="industries" className="py-16 md:py-24 lg:py-28 bg-background">
    <div className="container">
      <SectionHeader eyebrow="Sectors" title="Industries We Serve" />

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
        {INDUSTRIES.map((it, i) => (
          <motion.div
            key={it.name}
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.04 }}
            className="rounded-2xl bg-card border border-border p-5 text-center shadow-soft hover:shadow-card hover:-translate-y-1 hover:border-primary/40 transition-all"
          >
            <div className="text-3xl mb-2">{it.icon}</div>
            <div className="text-sm font-bold">{it.name}</div>
          </motion.div>
        ))}
      </div>
    </div>
  </section>
);
