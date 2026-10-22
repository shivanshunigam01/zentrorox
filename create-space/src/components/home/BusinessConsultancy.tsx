import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { CheckCircle2 } from "lucide-react";
import { CONSULTING_SERVICES } from "@/data/homeContent";
import { SectionHeader } from "./SectionHeader";

export const BusinessConsultancy = () => (
  <section id="consulting" className="py-16 md:py-24 lg:py-28 bg-gradient-mesh">
    <div className="container">
      <div className="grid lg:grid-cols-2 gap-10 md:gap-14 items-center max-w-6xl mx-auto">
        <SectionHeader
          eyebrow="Consulting"
          title="Business Consultancy Services"
          subtitle="Partner with growth consultants who understand your industry — not just your software stack."
          className="mb-0 text-left max-w-none"
        />

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="rounded-2xl border border-border bg-card p-6 md:p-8 shadow-card"
        >
          <ul className="grid sm:grid-cols-2 gap-3">
            {CONSULTING_SERVICES.map((service) => (
              <li key={service} className="flex items-start gap-2.5 text-sm font-medium">
                <CheckCircle2 className="h-4 w-4 text-primary shrink-0 mt-0.5" />
                {service}
              </li>
            ))}
          </ul>
          <Link
            to="/services/business-consultancy"
            className="mt-6 inline-flex items-center justify-center w-full rounded-xl bg-primary text-primary-foreground font-bold py-3 text-sm hover:opacity-90 transition"
          >
            View Consultancy Services
          </Link>
        </motion.div>
      </div>
    </div>
  </section>
);
