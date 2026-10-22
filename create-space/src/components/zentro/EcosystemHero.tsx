import { motion } from "framer-motion";
import { ArrowRight, PlayCircle, MessageCircle } from "lucide-react";
import { Button } from "@/components/ui/button";


export const EcosystemHero = () => {
  return (
    <section className="relative pt-20 md:pt-24 pb-8 overflow-hidden hero-bg">
      <div className="absolute -top-20 -left-20 w-[28rem] h-[28rem] bg-brand-purple/20 rounded-full blur-3xl animate-float" />
      <div className="absolute top-20 -right-20 w-[28rem] h-[28rem] bg-primary/20 rounded-full blur-3xl animate-float-delayed" />
      <div className="absolute inset-0 grid-pattern opacity-40" />

      <div className="container relative text-center max-w-5xl">
        <motion.div
          initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
          className="inline-flex items-center gap-2 rounded-full border border-border bg-background/80 backdrop-blur px-4 py-1.5 text-xs font-semibold mb-6 shadow-soft"
        >
          <span className="h-1.5 w-1.5 rounded-full bg-primary animate-pulse" />
          Zentroverse Global Pvt Ltd
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
          className="text-[2rem] sm:text-5xl md:text-6xl lg:text-7xl font-extrabold leading-[1.05] mb-6"
        >
          India's First{" "}
          <span className="gradient-brand-text">Automotive Intelligence</span>{" "}
          Ecosystem
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
          className="text-base sm:text-lg md:text-xl text-muted-foreground mb-8 max-w-3xl mx-auto"
        >
          AI Powered Lead Management, Inspection, CRM, Automation, Marketplace,
          Tracking, Marketing & Dealer Growth Platform — all in one connected stack.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}
          className="flex flex-col sm:flex-row gap-3 justify-center mb-12"
        >
          <Button variant="hero" size="xl" asChild>
            <a href="#enquiry">Book Demo <ArrowRight /></a>
          </Button>
          <Button variant="outline-brand" size="xl" asChild>
            <a href="#products"><PlayCircle /> Explore Products</a>
          </Button>
          <Button variant="outline" size="xl" asChild>
            <a href="#enquiry"><MessageCircle /> Talk To Expert</a>
          </Button>
        </motion.div>

      </div>
    </section>
  );
};
