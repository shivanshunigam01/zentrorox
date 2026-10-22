import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { MapPin, CheckCircle2 } from "lucide-react";
import { NETWORK_SERVICES } from "@/data/homeContent";
import { SectionHeader } from "./SectionHeader";

export const NetworkExpansion = () => (
  <section id="network" className="py-16 md:py-24 lg:py-28 bg-secondary text-secondary-foreground relative overflow-hidden">
    <div className="absolute inset-0 grid-pattern opacity-10" />
    <div className="container relative">
      <SectionHeader
        eyebrow="Unique Offering"
        title="Dealer & Network Expansion"
        subtitle="A rare capability — we don't just build software, we help you grow your channel network."
        dark
      />

      <div className="grid lg:grid-cols-2 gap-8 max-w-5xl mx-auto">
        <motion.ul
          initial={{ opacity: 0, x: -20 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          className="grid sm:grid-cols-2 gap-3"
        >
          {NETWORK_SERVICES.map((service) => (
            <li key={service} className="flex items-center gap-2.5 text-sm font-medium text-white/90">
              <CheckCircle2 className="h-4 w-4 text-primary-glow shrink-0" />
              {service}
            </li>
          ))}
        </motion.ul>

        <motion.div
          initial={{ opacity: 0, x: 20 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          className="rounded-2xl border border-white/15 bg-white/5 backdrop-blur p-6 md:p-8"
        >
          <div className="flex items-start gap-3 mb-4">
            <div className="h-10 w-10 rounded-xl bg-primary/20 flex items-center justify-center shrink-0">
              <MapPin className="h-5 w-5 text-primary-glow" />
            </div>
            <div>
              <div className="text-xs font-bold uppercase tracking-widest text-primary-glow mb-1">Highlight</div>
              <p className="text-sm leading-relaxed text-white/80">
                Successfully supporting network expansion projects across Automotive and EV sectors.
              </p>
            </div>
          </div>
          <Link
            to="/services/network-expansion"
            className="inline-flex items-center justify-center w-full rounded-xl bg-primary text-primary-foreground font-bold py-3 text-sm hover:opacity-90 transition"
          >
            View Network Expansion Services
          </Link>
        </motion.div>
      </div>
    </div>
  </section>
);
