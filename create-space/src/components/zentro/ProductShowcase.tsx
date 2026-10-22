import { motion } from "framer-motion";
import { ArrowRight, Check } from "lucide-react";
import { ZENTRO_PRODUCTS } from "@/data/zentroProducts";

export const ProductShowcase = () => (
  <section id="products" className="py-16 md:py-24 lg:py-32 bg-gradient-mesh">
    <div className="container">
      <div className="text-center max-w-2xl mx-auto mb-14">
        <div className="text-xs uppercase tracking-widest text-primary font-bold mb-3">Product Showcase</div>
        <h2 className="text-3xl md:text-5xl font-extrabold mb-4">
          Nine purpose-built products. <span className="gradient-brand-text">One stack.</span>
        </h2>
        <p className="text-muted-foreground text-lg">
          Each product solves a specific problem — together they form India's most complete automotive growth engine.
        </p>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {ZENTRO_PRODUCTS.map((p, i) => {
          const Icon = p.icon;
          return (
            <motion.div
              key={p.key}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{ delay: (i % 3) * 0.08 }}
              className="group relative rounded-2xl border border-border bg-card p-6 shadow-card hover:shadow-elegant hover:-translate-y-1 transition-all"
            >
              <div className={`h-12 w-12 rounded-xl ${p.bg} ring-1 ${p.ring} flex items-center justify-center mb-4`}>
                <Icon className={`h-6 w-6 ${p.color}`} />
              </div>
              <h3 className="text-xl font-extrabold">{p.name}</h3>
              <p className="text-sm text-muted-foreground mb-4">{p.tagline}</p>
              <ul className="space-y-1.5 mb-4">
                {p.features.map((f) => (
                  <li key={f} className="flex items-center gap-2 text-sm">
                    <Check className={`h-4 w-4 ${p.color}`} />
                    {f}
                  </li>
                ))}
              </ul>
              {p.scope && (
                <div className={`mb-5 rounded-lg ${p.bg} ring-1 ${p.ring} p-3`}>
                  <div className={`text-[10px] uppercase tracking-widest font-bold ${p.color} mb-1`}>Build Scope</div>
                  <p className="text-xs text-muted-foreground leading-relaxed">{p.scope}</p>
                </div>
              )}
              <a href="#enquiry" className={`inline-flex items-center gap-1.5 text-sm font-bold ${p.color} group-hover:gap-2.5 transition-all`}>
                Explore {p.name} <ArrowRight className="h-4 w-4" />
              </a>
            </motion.div>
          );
        })}
      </div>
    </div>
  </section>
);
