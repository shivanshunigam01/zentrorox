import { motion } from "framer-motion";
import {
  Zap,
  MessageSquare,
  GitBranch,
  Repeat,
  Phone,
  RefreshCw,
  Check,
  MapPinned,
  FileBarChart,
  Car,
} from "lucide-react";

const features = [
  { icon: Zap, title: "Lead Generation Engine", desc: "Multi-channel capture from ads, web, WhatsApp & calls into one funnel." },
  { icon: MessageSquare, title: "WhatsApp Automation", desc: "Official WhatsApp API + smart bots for 24/7 conversations & broadcasts." },
  { icon: GitBranch, title: "CRM + Sales Pipeline", desc: "Visual deal stages, auto-assignment & full lead history at a glance." },
  { icon: Repeat, title: "Auto Follow-up System", desc: "Drip sequences, reminders & nudges that never let a lead go cold." },
  { icon: Phone, title: "Dialer Integration", desc: "Click-to-call with auto-logging, recordings & call analytics." },
  { icon: RefreshCw, title: "Lifecycle Management", desc: "Onboard, nurture, retain & re-engage — across the full customer journey." },
  {
    icon: MapPinned,
    title: "Dristi X",
    desc: "Live location tracking for sales executives on field visits — routes, check-ins & accountability in one view.",
  },
  {
    icon: FileBarChart,
    title: "CIBIL & credit intelligence",
    desc: "CIBIL score checks with a detailed PDF report powered by Experian — faster credit decisions with clear documentation.",
  },
  {
    icon: Car,
    title: "Virtual showroom",
    desc: "A digital showroom for automobile dealers — showcase inventory, trims & offers so buyers explore anytime, anywhere.",
  },
];

export const Platform = () => {
  return (
    <section id="platform" className="pt-8 md:pt-10 pb-20 md:pb-28 relative overflow-hidden">
      <div className="absolute inset-0 mesh-bg opacity-60" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-brand-purple/10 rounded-full blur-3xl" />

      <div className="container relative">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center max-w-3xl mx-auto mb-14"
        >
          <div className="inline-flex items-center gap-2 rounded-full bg-gradient-brand px-4 py-1.5 text-xs font-semibold mb-4 text-white">
            <Zap className="h-3.5 w-3.5" />
            The Zentroverse Platform
          </div>
          <h2 className="text-3xl md:text-5xl font-extrabold mb-4">
            One platform. <span className="gradient-brand-text">Every growth lever.</span>
          </h2>
          <p className="text-lg text-muted-foreground">
            Replace 6 disconnected tools with a single AI-powered system that captures, converts & retains.
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-3 gap-6">
          {features.map((f, i) => (
            <motion.div
              key={f.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.08 }}
              className="glass-card rounded-2xl p-6 hover:shadow-elegant transition-all duration-300"
            >
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0 h-12 w-12 rounded-xl bg-gradient-brand flex items-center justify-center shadow-brand">
                  <f.icon className="h-6 w-6 text-white" />
                </div>
                <div>
                  <h3 className="font-bold text-lg mb-1.5">{f.title}</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">{f.desc}</p>
                </div>
              </div>
              <div className="mt-4 pt-4 border-t border-border/50 flex items-center gap-2 text-xs font-semibold text-primary">
                <Check className="h-3.5 w-3.5" /> Included in every plan
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};
