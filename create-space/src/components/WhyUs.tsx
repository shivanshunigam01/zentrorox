import { motion } from "framer-motion";
import { Brain, Workflow, Users, Globe, TrendingUp } from "lucide-react";

const points = [
  { icon: Brain, title: "AI-driven automation", desc: "Smart routing, scoring & follow-ups powered by ML." },
  { icon: Workflow, title: "Full lifecycle control", desc: "Capture to retention — never lose a touchpoint." },
  { icon: Users, title: "Hybrid: bots + humans", desc: "Automation handles scale, humans handle nuance." },
  {
    icon: Globe,
    title: "Built for teams worldwide",
    desc: "Local languages, payment rails & ad channels wherever you sell — same platform from first touch to close.",
  },
  { icon: TrendingUp, title: "High-ROI marketing", desc: "Every spend tracked, every lead attributed." },
];

const stats = [
  { num: "5X", label: "Revenue Potential" },
  { num: "70%", label: "Faster Conversion" },
  { num: "90%", label: "Lead Tracking Accuracy" },
];

export const WhyUs = () => {
  return (
    <section id="why" className="py-20 md:py-28">
      <div className="container">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
          <div>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              <div className="inline-flex items-center gap-2 rounded-full border border-border bg-muted/50 px-4 py-1.5 text-xs font-semibold mb-4">
                Why Zentroverse
              </div>
              <h2 className="text-3xl md:text-5xl font-extrabold mb-5">
                We don't sell software.<br />We deliver <span className="gradient-text">growth outcomes.</span>
              </h2>
              <p className="text-lg text-muted-foreground mb-8">
                Most agencies hand you tools and walk away. We embed with your team and own the outcome.
              </p>
            </motion.div>

            <div className="space-y-3">
              {points.map((p, i) => (
                <motion.div
                  key={p.title}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                  className="flex items-start gap-4 p-4 rounded-xl hover:bg-muted/40 transition-colors"
                >
                  <div className="flex-shrink-0 h-10 w-10 rounded-lg bg-gradient-brand flex items-center justify-center">
                    <p.icon className="h-5 w-5 text-white" />
                  </div>
                  <div>
                    <div className="font-semibold">{p.title}</div>
                    <div className="text-sm text-muted-foreground">{p.desc}</div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>

          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="relative"
          >
            <div className="absolute -inset-4 bg-gradient-brand opacity-20 blur-3xl rounded-3xl" />
            <div className="relative bg-gradient-card border border-border rounded-3xl p-8 shadow-card">
              <div className="grid gap-4">
                {stats.map((s, i) => (
                  <motion.div
                    key={s.label}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.15 }}
                    className="flex items-center justify-between p-6 rounded-2xl bg-gradient-mesh border border-border/50"
                  >
                    <div className="text-5xl md:text-6xl font-extrabold gradient-brand-text">{s.num}</div>
                    <div className="text-right">
                      <div className="text-sm text-muted-foreground">Average</div>
                      <div className="font-semibold text-lg">{s.label}</div>
                    </div>
                  </motion.div>
                ))}
              </div>
              <div className="mt-6 pt-6 border-t border-border text-center text-xs text-muted-foreground">
                Based on 12-month performance data across our client portfolio
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};
