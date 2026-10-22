import { motion } from "framer-motion";
import { MapPin, Calendar, User, Building } from "lucide-react";
import logo from "@/assets/zentroverse-logo.jpg";

const facts = [
  { icon: Building, label: "Company", val: "Zentroverse Global Pvt Ltd" },
  { icon: Calendar, label: "Incorporated", val: "September 12, 2025" },
  { icon: User, label: "Director", val: "Manmohan Jha" },
  { icon: MapPin, label: "Headquartered", val: "Patna, Bihar, India" },
];

export const About = () => {
  return (
    <section id="about" className="py-20 md:py-28 relative overflow-hidden">
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-brand-purple/10 rounded-full blur-3xl" />
      <div className="container relative">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
          >
            <div className="inline-flex items-center gap-2 rounded-full border border-border bg-muted/50 px-4 py-1.5 text-xs font-semibold mb-4">
              About Us
            </div>
            <h2 className="text-3xl md:text-5xl font-extrabold mb-6">
              Building the <span className="gradient-brand-text">growth OS</span> for Bharat.
            </h2>
            <div className="space-y-4 text-muted-foreground text-lg leading-relaxed">
              <p>
                Zentroverse is an AI-driven business automation and growth company helping
                dealerships and MSMEs increase revenue through smart systems.
              </p>
              <p>
                We combine SaaS, performance marketing, and human strategy to unlock
                compounding growth — the kind most Indian businesses are still missing.
              </p>
            </div>

            <div className="grid sm:grid-cols-2 gap-3 mt-8">
              {facts.map((f) => (
                <div key={f.label} className="flex items-start gap-3 p-4 rounded-xl bg-muted/40 border border-border">
                  <div className="h-9 w-9 rounded-lg bg-gradient-brand flex items-center justify-center flex-shrink-0">
                    <f.icon className="h-4 w-4 text-white" />
                  </div>
                  <div>
                    <div className="text-xs text-muted-foreground">{f.label}</div>
                    <div className="font-semibold text-sm">{f.val}</div>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="relative"
          >
            <div className="absolute -inset-6 bg-gradient-brand opacity-20 blur-3xl rounded-full" />
            <div className="relative aspect-square max-w-md mx-auto bg-gradient-card border border-border rounded-3xl p-10 shadow-card flex flex-col items-center justify-center text-center">
              <img src={logo} alt="Zentroverse logo" className="h-32 w-32 rounded-2xl object-cover mb-6 shadow-brand" />
              <div className="brand-wordmark text-lg text-foreground mb-2">Zentroverse</div>
              <div className="text-sm text-muted-foreground mb-6">AI-Powered Growth Systems</div>
              <div className="text-xs text-muted-foreground border-t border-border pt-4 w-full">
                2nd Floor, Bihar State Financial Corporation,<br />
                Fraser Rd, Old Jakkanpur, Indira Nagar,<br />
                Patna, Bihar 800001, India
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};
