import { motion } from "framer-motion";

const stats = [
  { value: "20+", label: "Years Automotive Experience" },
  { value: "1", label: "End-to-End Ecosystem" },
  { value: "AI", label: "Powered Automation Engine" },
  { value: "Pan India", label: "Operations Capability" },
  { value: "12+", label: "Industries Covered" },
];

export const WhyZentroverse = () => (
  <section id="why" className="py-16 md:py-24 lg:py-32 bg-secondary text-secondary-foreground relative overflow-hidden">
    <div className="absolute inset-0 grid-pattern opacity-10" />
    <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[40rem] h-[40rem] bg-brand-purple/30 rounded-full blur-3xl" />
    <div className="container relative">
      <div className="text-center max-w-2xl mx-auto mb-14">
        <div className="text-xs uppercase tracking-widest text-primary-glow font-bold mb-3">Why Zentroverse</div>
        <h2 className="text-3xl md:text-5xl font-extrabold">
          A category-defining <span className="gradient-brand-text">automotive intelligence stack</span>
        </h2>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        {stats.map((s, i) => (
          <motion.div
            key={s.label}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.08 }}
            className="rounded-2xl border border-white/10 bg-white/5 backdrop-blur p-6 text-center hover:bg-white/10 transition"
          >
            <div className="text-3xl md:text-4xl font-extrabold gradient-brand-text mb-2">{s.value}</div>
            <div className="text-xs md:text-sm text-white/70 font-medium">{s.label}</div>
          </motion.div>
        ))}
      </div>
    </div>
  </section>
);
