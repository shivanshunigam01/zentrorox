import { useState } from "react";
import { motion } from "framer-motion";
import { ArrowRight, Phone, Mail, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";

export const CTA = () => {
  const [submitting, setSubmitting] = useState(false);

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setTimeout(() => {
      toast.success("Thanks! Our team will reach out within 24 hours.");
      (e.target as HTMLFormElement).reset();
      setSubmitting(false);
    }, 800);
  };

  return (
    <section id="contact" className="py-20 md:py-28 relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-brand opacity-95" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(255,255,255,0.2),transparent_50%)]" />
      <div className="absolute inset-0 grid-pattern opacity-20" />

      <div className="container relative">
        <div className="grid lg:grid-cols-2 gap-12 items-center text-white">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <div className="inline-flex items-center gap-2 rounded-full bg-white/15 backdrop-blur px-4 py-1.5 text-xs font-semibold mb-5">
              <Sparkles className="h-3.5 w-3.5" />
              Ready to scale?
            </div>
            <h2 className="text-3xl md:text-5xl font-extrabold mb-5 leading-tight">
              Ready to Scale Your Business?
            </h2>
            <p className="text-lg md:text-xl text-white/90 mb-8 max-w-md">
              Book a 30-minute strategy call. We'll audit your funnel and show you exactly where revenue is leaking.
            </p>
            <div className="space-y-3">
              <a href="tel:+919973045587" className="flex items-center gap-3 text-white/90 hover:text-white transition-colors">
                <div className="h-10 w-10 rounded-full bg-white/15 flex items-center justify-center">
                  <Phone className="h-4 w-4" />
                </div>
                <span className="font-medium">+91 99730 45587</span>
              </a>
              <a href="mailto:hello@zentroverse.com" className="flex items-center gap-3 text-white/90 hover:text-white transition-colors">
                <div className="h-10 w-10 rounded-full bg-white/15 flex items-center justify-center">
                  <Mail className="h-4 w-4" />
                </div>
                <span className="font-medium">hello@zentroverse.com</span>
              </a>
            </div>
          </motion.div>

          <motion.form
            onSubmit={onSubmit}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.15 }}
            className="bg-background text-foreground rounded-3xl p-7 md:p-9 shadow-elegant"
          >
            <div className="mb-5">
              <h3 className="text-2xl font-bold mb-1">Get a Free Consultation</h3>
              <p className="text-sm text-muted-foreground">No commitments. Just clarity.</p>
            </div>
            <div className="space-y-3">
              <Input required name="name" placeholder="Full name" className="h-12 rounded-xl" />
              <div className="grid sm:grid-cols-2 gap-3">
                <Input required type="email" name="email" placeholder="Work email" className="h-12 rounded-xl" />
                <Input required name="phone" placeholder="Phone (WhatsApp)" className="h-12 rounded-xl" />
              </div>
              <Input name="company" placeholder="Company name" className="h-12 rounded-xl" />
              <Textarea name="message" placeholder="Tell us what you're trying to grow..." className="min-h-24 rounded-xl" />
              <Button type="submit" variant="hero" size="xl" className="w-full" disabled={submitting}>
                {submitting ? "Sending..." : (<>Talk to an Expert <ArrowRight /></>)}
              </Button>
              <p className="text-xs text-center text-muted-foreground">We respond within 24 hours, Mon–Sat.</p>
            </div>
          </motion.form>
        </div>
      </div>
    </section>
  );
};
