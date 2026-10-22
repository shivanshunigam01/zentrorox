import { motion } from "framer-motion";
import { ArrowUpRight } from "lucide-react";

const projects = [
  { name: "Vikramshila", industry: "Tata Motors Dealership", result: "+312% qualified leads in 6 months", tag: "CRM + Ads", grad: "from-brand-purple to-brand-blue" },
  { name: "JCB", industry: "Construction Equipment", result: "₹4.2Cr pipeline from WhatsApp funnel", tag: "WhatsApp Automation", grad: "from-primary to-brand-blue" },
  { name: "DTS", industry: "Distribution & Logistics", result: "70% reduction in order cycle time", tag: "ERP Build", grad: "from-brand-blue to-brand-pink" },
  { name: "Zentroverse ERP", industry: "SaaS Product", result: "Powering 50+ MSMEs across India", tag: "Product", grad: "from-brand-pink to-brand-purple" },
  { name: "Apollo Network", industry: "Healthcare Group", result: "2.4x patient inquiry conversion", tag: "Performance Marketing", grad: "from-primary to-primary-glow" },
];

export const Portfolio = () => {
  return (
    <section id="portfolio" className="py-20 md:py-28 mesh-bg">
      <div className="container">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 mb-12"
        >
          <div className="max-w-xl">
            <div className="inline-flex items-center gap-2 rounded-full border border-border bg-background px-4 py-1.5 text-xs font-semibold mb-4">
              Our Work
            </div>
            <h2 className="text-3xl md:text-5xl font-extrabold mb-3">
              Real businesses. <span className="gradient-text">Real outcomes.</span>
            </h2>
          </div>
          <p className="text-muted-foreground md:max-w-md">
            We've helped dealerships, hospitals & MSMEs unlock measurable growth. Here's a snapshot.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
          {projects.map((p, i) => (
            <motion.a
              href="#contact"
              key={p.name}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.07 }}
              className={`group relative overflow-hidden rounded-2xl bg-gradient-to-br ${p.grad} p-6 h-64 flex flex-col justify-between text-white shadow-card hover:shadow-elegant hover:-translate-y-1 transition-all duration-300 ${i === 0 ? "lg:row-span-2 lg:h-auto" : ""}`}
            >
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(255,255,255,0.2),transparent_60%)]" />
              <div className="relative flex items-start justify-between">
                <span className="text-xs font-semibold uppercase tracking-wider bg-white/20 backdrop-blur px-3 py-1 rounded-full">
                  {p.tag}
                </span>
                <ArrowUpRight className="h-5 w-5 opacity-70 group-hover:opacity-100 group-hover:translate-x-1 group-hover:-translate-y-1 transition-all" />
              </div>
              <div className="relative">
                <div className="text-xs opacity-80 mb-1">{p.industry}</div>
                <h3 className="text-2xl md:text-3xl font-extrabold mb-3">{p.name}</h3>
                <div className="text-sm font-semibold opacity-95">{p.result}</div>
              </div>
            </motion.a>
          ))}
        </div>
      </div>
    </section>
  );
};
