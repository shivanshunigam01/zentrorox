import { motion } from "framer-motion";
import { ArrowRight, Sparkles, MessageCircle, TrendingUp, Users, Phone, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";

export const Hero = () => {
  return (
    <section className="relative pt-28 md:pt-36 pb-20 md:pb-28 overflow-hidden hero-bg">
      {/* Decorative blobs */}
      <div className="absolute top-20 -left-20 w-96 h-96 bg-brand-purple/15 rounded-full blur-3xl animate-float" />
      <div className="absolute top-40 -right-20 w-96 h-96 bg-primary/15 rounded-full blur-3xl animate-float-delayed" />
      <div className="absolute inset-0 grid-pattern opacity-40" />

      <div className="container relative">
        <div className="grid lg:grid-cols-12 gap-12 items-center">
          {/* Left: Copy */}
          <div className="lg:col-span-6 text-center lg:text-left">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="inline-flex items-center gap-2 rounded-full border border-border bg-background/80 backdrop-blur px-4 py-1.5 text-xs font-semibold mb-6 shadow-soft"
            >
              <Sparkles className="h-3.5 w-3.5 text-brand-purple" />
              <span>India's All-in-One Growth OS</span>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="text-4xl md:text-5xl lg:text-6xl font-extrabold leading-[1.05] mb-6"
            >
              Scale Your Business with{" "}
              <span className="gradient-brand-text">AI-Powered Growth</span> Systems
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="text-lg md:text-xl text-muted-foreground mb-8 max-w-xl mx-auto lg:mx-0"
            >
              Combine CRM, performance marketing, WhatsApp automation & human strategy — built for Indian MSMEs and dealerships.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="flex flex-col sm:flex-row gap-3 justify-center lg:justify-start mb-8"
            >
              <Button variant="hero" size="xl" asChild>
                <a href="#contact">
                  Get Free Consultation <ArrowRight className="ml-1" />
                </a>
              </Button>
              <Button variant="outline-brand" size="xl" asChild>
                <a href="#contact">Book a Demo</a>
              </Button>
            </motion.div>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
              className="flex flex-wrap gap-x-6 gap-y-2 justify-center lg:justify-start text-sm text-muted-foreground"
            >
              {["No setup fees", "14-day pilot", "Dedicated success manager"].map((t) => (
                <div key={t} className="flex items-center gap-1.5">
                  <CheckCircle2 className="h-4 w-4 text-primary" />
                  <span>{t}</span>
                </div>
              ))}
            </motion.div>
          </div>

          {/* Right: Dashboard mockup built in JSX */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.7, delay: 0.3 }}
            className="lg:col-span-6 relative"
          >
            <div className="absolute -inset-8 bg-gradient-brand opacity-20 blur-3xl rounded-full" />
            <div className="relative grid grid-cols-2 gap-4">
              {/* Main dashboard card */}
              <div className="col-span-2 glass-card rounded-2xl p-5">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <div className="text-xs text-muted-foreground font-medium">Sales Pipeline</div>
                    <div className="text-2xl font-bold">₹ 48.6L <span className="text-sm font-medium text-primary">↑ 23%</span></div>
                  </div>
                  <div className="flex gap-1">
                    {[40, 65, 50, 80, 60, 90, 75].map((h, i) => (
                      <div key={i} className="w-2 rounded-full bg-gradient-to-t from-brand-purple to-brand-blue" style={{ height: `${h * 0.4}px` }} />
                    ))}
                  </div>
                </div>
                <div className="grid grid-cols-3 gap-2">
                  {[
                    { label: "Leads", val: "1,284", color: "bg-brand-purple/10 text-brand-purple" },
                    { label: "Qualified", val: "642", color: "bg-brand-blue/10 text-brand-blue" },
                    { label: "Closed", val: "189", color: "bg-primary/10 text-primary" },
                  ].map((s) => (
                    <div key={s.label} className={`rounded-xl p-3 ${s.color}`}>
                      <div className="text-[10px] uppercase tracking-wider opacity-80">{s.label}</div>
                      <div className="text-lg font-bold">{s.val}</div>
                    </div>
                  ))}
                </div>
              </div>

              {/* WhatsApp card */}
              <motion.div
                animate={{ y: [0, -8, 0] }}
                transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                className="glass-card rounded-2xl p-4"
              >
                <div className="flex items-center gap-2 mb-3">
                  <div className="h-8 w-8 rounded-full bg-primary flex items-center justify-center">
                    <MessageCircle className="h-4 w-4 text-primary-foreground" />
                  </div>
                  <div>
                    <div className="text-xs font-bold">WhatsApp Bot</div>
                    <div className="text-[10px] text-primary">● Online</div>
                  </div>
                </div>
                <div className="space-y-1.5">
                  <div className="bg-muted rounded-lg rounded-tl-sm px-2.5 py-1.5 text-[10px] max-w-[80%]">Hi! Interested in JCB?</div>
                  <div className="bg-primary/10 text-primary rounded-lg rounded-tr-sm px-2.5 py-1.5 text-[10px] max-w-[80%] ml-auto font-medium">Yes! Send brochure</div>
                  <div className="bg-muted rounded-lg rounded-tl-sm px-2.5 py-1.5 text-[10px] max-w-[80%]">Sent ✓ EMI options?</div>
                </div>
              </motion.div>

              {/* CRM Lead card */}
              <motion.div
                animate={{ y: [0, -8, 0] }}
                transition={{ duration: 4, repeat: Infinity, ease: "easeInOut", delay: 1 }}
                className="glass-card rounded-2xl p-4"
              >
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xs font-bold">Hot Leads</span>
                  <TrendingUp className="h-4 w-4 text-primary" />
                </div>
                {[
                  { n: "Rajesh K.", t: "JCB 3DX", icon: Users },
                  { n: "Priya M.", t: "ERP Demo", icon: Phone },
                  { n: "Amit S.", t: "Web Dev", icon: Sparkles },
                ].map((l) => (
                  <div key={l.n} className="flex items-center gap-2 py-1.5 border-b border-border/50 last:border-0">
                    <div className="h-6 w-6 rounded-full bg-gradient-brand flex items-center justify-center">
                      <l.icon className="h-3 w-3 text-white" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="text-[10px] font-semibold truncate">{l.n}</div>
                      <div className="text-[9px] text-muted-foreground">{l.t}</div>
                    </div>
                    <div className="h-1.5 w-1.5 rounded-full bg-primary animate-pulse" />
                  </div>
                ))}
              </motion.div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};
