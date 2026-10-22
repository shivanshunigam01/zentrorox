import { motion } from "framer-motion";

const industries = [
  { icon: "🚚", name: "Commercial Vehicles" },
  { icon: "🚌", name: "Buses" },
  { icon: "🚗", name: "Cars" },
  { icon: "🏍", name: "Two Wheelers" },
  { icon: "🛺", name: "Three Wheelers" },
  { icon: "🚜", name: "Tractors" },
  { icon: "🏗", name: "Construction Equipment" },
  { icon: "🚛", name: "Fleet Operators" },
  { icon: "🏢", name: "Automobile Dealers" },
  { icon: "🏭", name: "OEMs" },
  { icon: "🏦", name: "Finance Companies" },
  { icon: "🛡", name: "Insurance Companies" },
];

export const Industries = () => (
  <section className="py-16 md:py-24 lg:py-32 bg-gradient-mesh">
    <div className="container">
      <div className="text-center max-w-2xl mx-auto mb-12">
        <div className="text-xs uppercase tracking-widest text-primary font-bold mb-3">Industries We Serve</div>
        <h2 className="text-3xl md:text-5xl font-extrabold">
          Built for the <span className="gradient-brand-text">entire automotive economy</span>
        </h2>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
        {industries.map((it, i) => (
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
