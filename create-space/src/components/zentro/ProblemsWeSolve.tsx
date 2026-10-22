import { Building2, Factory, Truck, Users } from "lucide-react";
import { motion } from "framer-motion";

const groups = [
  { title: "For Dealers", icon: Building2, color: "from-orange-500/15 to-orange-500/0", text: "text-orange-600",
    items: ["Lead Leakage", "Poor Conversion", "Weak Follow-up", "No Customer Lifecycle"] },
  { title: "For OEMs", icon: Factory, color: "from-blue-500/15 to-blue-500/0", text: "text-blue-600",
    items: ["Territory Visibility", "Dealer Performance", "Lead Tracking"] },
  { title: "For Fleet Owners", icon: Truck, color: "from-emerald-500/15 to-emerald-500/0", text: "text-emerald-600",
    items: ["Inspection", "Vehicle Health", "Maintenance"] },
  { title: "For Customers", icon: Users, color: "from-violet-500/15 to-violet-500/0", text: "text-violet-600",
    items: ["Transparent Deals", "Best Offers", "Trustworthy Buying"] },
];

export const ProblemsWeSolve = () => (
  <section className="py-16 md:py-24 lg:py-32 bg-background">
    <div className="container">
      <div className="text-center max-w-2xl mx-auto mb-14">
        <div className="text-xs uppercase tracking-widest text-primary font-bold mb-3">Problems We Solve</div>
        <h2 className="text-3xl md:text-5xl font-extrabold">
          Built for every player in the <span className="gradient-brand-text">automotive value chain</span>
        </h2>
      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {groups.map((g, i) => (
          <motion.div
            key={g.title}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.08 }}
            className={`rounded-2xl border border-border bg-gradient-to-b ${g.color} p-6 shadow-card hover:shadow-elegant transition-all hover:-translate-y-1`}
          >
            <div className={`h-11 w-11 rounded-xl bg-background flex items-center justify-center mb-4 ${g.text}`}>
              <g.icon className="h-5 w-5" />
            </div>
            <h3 className="font-extrabold text-lg mb-3">{g.title}</h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              {g.items.map((it) => (
                <li key={it} className="flex items-start gap-2">
                  <span className={`mt-1 h-1.5 w-1.5 rounded-full ${g.text} bg-current`} />
                  {it}
                </li>
              ))}
            </ul>
          </motion.div>
        ))}
      </div>
    </div>
  </section>
);
