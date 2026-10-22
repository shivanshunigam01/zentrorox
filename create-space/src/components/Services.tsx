import { motion } from "framer-motion";
import {
  Globe, Users, Database, Target, Palette, Compass, UserPlus, Video, ArrowRight,
} from "lucide-react";

const services = [
  { icon: Globe, title: "Website Development", desc: "Conversion-focused websites built for speed, SEO, and lead capture.", color: "from-brand-blue to-brand-purple" },
  { icon: Users, title: "CRM Development", desc: "Custom CRMs with sales pipelines, automation & dialer integration.", color: "from-brand-purple to-brand-pink" },
  { icon: Database, title: "ERP Development", desc: "End-to-end ERP for inventory, finance, HR & operations control.", color: "from-primary to-brand-blue" },
  { icon: Target, title: "Performance Marketing", desc: "Google Ads + Meta Ads engines that turn budget into qualified leads.", color: "from-brand-pink to-brand-purple" },
  { icon: Palette, title: "Digital Design & Branding", desc: "Identities, creatives & UI that make your brand impossible to ignore.", color: "from-brand-purple to-brand-blue" },
  { icon: Compass, title: "Growth Consultancy", desc: "Strategy, GTM & systems consulting from operators who've scaled brands.", color: "from-primary to-primary-glow" },
  { icon: UserPlus, title: "Network & Recruitment", desc: "Hire vetted talent and expand your dealer network across India.", color: "from-brand-blue to-primary" },
  { icon: Video, title: "Video Production & Ads", desc: "Studio-grade ad films, reels & explainer videos that convert.", color: "from-brand-pink to-brand-blue" },
];

export const Services = () => {
  return (
    <section id="services" className="pt-20 md:pt-28 pb-8 md:pb-10 relative">
      <div className="container">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center max-w-2xl mx-auto mb-14"
        >
          <div className="inline-flex items-center gap-2 rounded-full border border-border bg-muted/50 px-4 py-1.5 text-xs font-semibold mb-4">
            <span className="h-1.5 w-1.5 rounded-full bg-primary" />
            What We Do
          </div>
          <h2 className="text-3xl md:text-5xl font-extrabold mb-4">
            Everything you need to <span className="gradient-text">scale</span>, under one roof.
          </h2>
          <p className="text-lg text-muted-foreground">
            Eight integrated services that work together — so growth doesn't fall through the cracks.
          </p>
        </motion.div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {services.map((s, i) => (
            <motion.div
              key={s.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.05 }}
              className="group relative bg-gradient-card border border-border rounded-2xl p-6 hover:shadow-card hover:-translate-y-1 transition-all duration-300"
            >
              <div className={`inline-flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br ${s.color} mb-4 shadow-soft`}>
                <s.icon className="h-6 w-6 text-white" />
              </div>
              <h3 className="text-lg font-bold mb-2">{s.title}</h3>
              <p className="text-sm text-muted-foreground mb-4 leading-relaxed">{s.desc}</p>
              <a href="#contact" className="inline-flex items-center text-sm font-semibold text-foreground group-hover:text-brand-purple transition-colors">
                Learn more <ArrowRight className="ml-1 h-3.5 w-3.5 group-hover:translate-x-1 transition-transform" />
              </a>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};
