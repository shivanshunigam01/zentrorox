import { motion } from "framer-motion";

const journey = [
  "Lead", "Engagement", "Qualification", "Inspection",
  "Purchase", "Service", "Renewal", "Exchange", "Repeat Purchase",
];

export const ClientJourney = () => (
  <section className="py-16 md:py-24 lg:py-32 bg-background">
    <div className="container">
      <div className="text-center max-w-2xl mx-auto mb-14">
        <div className="text-xs uppercase tracking-widest text-primary font-bold mb-3">Client Journey</div>
        <h2 className="text-3xl md:text-5xl font-extrabold mb-3">
          We Manage The <span className="gradient-brand-text">Entire Customer Lifecycle</span>
        </h2>
      </div>

      <div className="relative">
        <div className="absolute left-1/2 -translate-x-1/2 top-0 bottom-0 w-px bg-gradient-to-b from-transparent via-primary/40 to-transparent" />
        <div className="flex flex-col gap-6">
          {journey.map((step, i) => (
            <motion.div
              key={step}
              initial={{ opacity: 0, x: i % 2 ? 40 : -40 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.06 }}
              className={`w-full flex ${i % 2 ? "justify-end" : "justify-start"}`}
            >
              <div className="w-1/2 px-4">
                <div className={`rounded-2xl border border-border bg-card p-5 shadow-card hover:shadow-elegant transition-all ${i % 2 ? "ml-4" : "mr-4"}`}>
                  <div className="text-xs font-bold text-primary mb-1">Step {i + 1}</div>
                  <div className="text-lg font-extrabold">{step}</div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  </section>
);
