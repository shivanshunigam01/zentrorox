import { motion } from "framer-motion";
import { WHY_CHOOSE } from "@/data/homeContent";
import { SectionHeader } from "./SectionHeader";

export const WhyChooseUs = () => (
  <section id="why" className="py-16 md:py-24 lg:py-28 bg-secondary text-secondary-foreground relative overflow-hidden">
    <div className="absolute inset-0 grid-pattern opacity-10" />
    <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[40rem] h-[40rem] bg-brand-purple/30 rounded-full blur-3xl" />
    <div className="container relative">
      <SectionHeader
        eyebrow="Why Us"
        title="Why Businesses Choose Zentroverse"
        dark
      />

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {WHY_CHOOSE.map((item, i) => {
          const Icon = item.icon;
          return (
            <motion.div
              key={item.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.07 }}
              className="rounded-2xl border border-white/10 bg-white/5 backdrop-blur p-6 hover:bg-white/10 transition"
            >
              <div className="h-11 w-11 rounded-xl bg-primary/20 flex items-center justify-center mb-4">
                <Icon className="h-5 w-5 text-primary-glow" />
              </div>
              <h3 className="text-lg font-extrabold mb-2">{item.title}</h3>
              <p className="text-sm text-white/70 leading-relaxed">{item.desc}</p>
            </motion.div>
          );
        })}
      </div>
    </div>
  </section>
);
