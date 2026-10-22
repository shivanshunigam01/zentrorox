import { motion } from "framer-motion";
import { Star } from "lucide-react";

const testimonials = [
  {
    quote: "Zentroverse rebuilt our entire lead engine. We went from 80 leads/month to 600+, and our sales team finally has clarity.",
    name: "Rohit Kumar", role: "GM, Vikramshila Motors", avatar: "RK", color: "from-brand-purple to-brand-blue",
  },
  {
    quote: "The WhatsApp automation alone paid for itself in 3 weeks. Their team feels like an extension of ours, not a vendor.",
    name: "Anjali Sharma", role: "Marketing Head, Patliputra.com", avatar: "AS", color: "from-primary to-brand-blue",
  },
  {
    quote: "We tried 4 CRMs before Zentroverse. This is the first one our dealers actually use daily. ROI is undeniable.",
    name: "Vikram Singh", role: "Founder, Skybolt Industries", avatar: "VS", color: "from-brand-pink to-brand-purple",
  },
  {
    quote: "From branding to performance ads — one team, one vision. Saved us months of coordination headaches.",
    name: "Meera Patel", role: "CEO, GS Textile", avatar: "MP", color: "from-brand-blue to-primary",
  },
];

export const Testimonials = () => {
  return (
    <section className="py-20 md:py-28">
      <div className="container">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center max-w-2xl mx-auto mb-14"
        >
          <div className="inline-flex items-center gap-2 rounded-full border border-border bg-muted/50 px-4 py-1.5 text-xs font-semibold mb-4">
            Loved by founders
          </div>
          <h2 className="text-3xl md:text-5xl font-extrabold mb-3">
            Don't take our word — <span className="gradient-text">take theirs.</span>
          </h2>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-5">
          {testimonials.map((t, i) => (
            <motion.div
              key={t.name}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="bg-gradient-card border border-border rounded-2xl p-7 shadow-soft hover:shadow-card transition-all"
            >
              <div className="flex gap-0.5 mb-4">
                {[...Array(5)].map((_, j) => (
                  <Star key={j} className="h-4 w-4 fill-primary text-primary" />
                ))}
              </div>
              <p className="text-base md:text-lg leading-relaxed mb-6 text-foreground/90">"{t.quote}"</p>
              <div className="flex items-center gap-3">
                <div className={`h-11 w-11 rounded-full bg-gradient-to-br ${t.color} flex items-center justify-center text-white font-bold text-sm`}>
                  {t.avatar}
                </div>
                <div>
                  <div className="font-semibold text-sm">{t.name}</div>
                  <div className="text-xs text-muted-foreground">{t.role}</div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};
