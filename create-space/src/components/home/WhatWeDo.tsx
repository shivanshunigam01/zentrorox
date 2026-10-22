import { motion } from "framer-motion";
import { WHAT_WE_DO } from "@/data/homeContent";
import { SectionHeader } from "./SectionHeader";

export const WhatWeDo = () => (
  <section id="services" className="py-16 md:py-24 lg:py-28 bg-gradient-mesh">
    <div className="container">
      <SectionHeader eyebrow="Capabilities" title="What We Do" />

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5 md:gap-6">
        {WHAT_WE_DO.map((box, i) => {
          const Icon = box.icon;
          return (
            <motion.div
              key={box.title}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.06 }}
              className="rounded-2xl border border-border bg-card p-6 shadow-card hover:shadow-elegant hover:-translate-y-1 transition-all"
            >
              <div className={`inline-flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br ${box.color} mb-4 shadow-soft`}>
                <Icon className="h-6 w-6 text-white" />
              </div>
              <h3 className="text-xl font-extrabold mb-4">{box.title}</h3>
              <ul className="space-y-2">
                {box.items.map((item) => (
                  <li key={item} className="flex items-center gap-2 text-sm text-muted-foreground">
                    <span className="h-1.5 w-1.5 rounded-full bg-primary shrink-0" />
                    {item}
                  </li>
                ))}
              </ul>
            </motion.div>
          );
        })}
      </div>
    </div>
  </section>
);
