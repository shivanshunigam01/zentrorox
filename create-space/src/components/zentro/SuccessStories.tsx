import { motion } from "framer-motion";
import { Quote, PlayCircle } from "lucide-react";

const stories = [
  { type: "Dealer", quote: "Zentroverse reduced our lead leakage by 70% in the first quarter.", who: "Rajesh K. · Multi-brand Dealer" },
  { type: "Fleet Owner", quote: "ZentroSURE inspections cut our maintenance surprises in half.", who: "Priya M. · Fleet of 240 trucks" },
  { type: "OEM", quote: "Finally — real visibility into dealer performance across territories.", who: "Amit S. · Regional Head, OEM" },
];

export const SuccessStories = () => (
  <section className="py-16 md:py-24 lg:py-32 bg-gradient-mesh">
    <div className="container">
      <div className="text-center max-w-2xl mx-auto mb-14">
        <div className="text-xs uppercase tracking-widest text-primary font-bold mb-3">Success Stories</div>
        <h2 className="text-3xl md:text-5xl font-extrabold">
          Trusted by <span className="gradient-brand-text">dealers, fleets and OEMs</span>
        </h2>
      </div>

      <div className="grid md:grid-cols-3 gap-6">
        {stories.map((s, i) => (
          <motion.div
            key={s.who}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.1 }}
            className="rounded-2xl bg-card border border-border p-6 shadow-card group relative overflow-hidden"
          >
            <div className="aspect-video rounded-xl bg-gradient-primary/20 bg-gradient-to-br from-primary/15 to-brand-purple/15 mb-4 flex items-center justify-center group-hover:scale-[1.02] transition-transform">
              <PlayCircle className="h-12 w-12 text-primary" />
            </div>
            <div className="inline-block text-[10px] font-bold uppercase tracking-wider px-2 py-1 rounded bg-primary/10 text-primary mb-3">
              {s.type} Testimonial
            </div>
            <Quote className="h-5 w-5 text-primary/40 mb-2" />
            <p className="text-sm leading-relaxed mb-4">{s.quote}</p>
            <div className="text-xs font-semibold text-muted-foreground">{s.who}</div>
          </motion.div>
        ))}
      </div>
    </div>
  </section>
);
