import { Calendar, MessageCircle, Phone } from "lucide-react";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { useSiteContact } from "@/hooks/useSiteContact";
import { telHref, whatsAppHref } from "@/lib/siteContact";

export const ContactCTA = () => {
  const contact = useSiteContact();

  return (
  <section id="contact" className="py-16 md:py-24 lg:py-32 bg-background">
    <div className="container">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="relative overflow-hidden rounded-3xl bg-gradient-primary text-primary-foreground p-10 md:p-16 text-center shadow-elegant"
      >
        <div className="absolute -top-20 -left-20 w-80 h-80 bg-white/10 rounded-full blur-3xl" />
        <div className="absolute -bottom-20 -right-20 w-80 h-80 bg-brand-purple/30 rounded-full blur-3xl" />

        <div className="relative">
          <h2 className="text-3xl md:text-5xl font-extrabold mb-4 max-w-3xl mx-auto">
            Ready To Transform Your Automotive Business?
          </h2>
          <p className="text-lg md:text-xl text-white/80 mb-8 max-w-2xl mx-auto">
            Book a personalized demo today and see the Zentroverse ecosystem in action.
          </p>

          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Button size="xl" variant="secondary" asChild>
              <a href="#enquiry"><Calendar /> Schedule Demo</a>
            </Button>
            <Button size="xl" variant="outline-brand" asChild className="bg-white/10 border-white/30 text-white hover:bg-white/20 hover:text-white">
              <a href={whatsAppHref(contact)} target="_blank" rel="noreferrer"><MessageCircle /> WhatsApp Us</a>
            </Button>
            <Button size="xl" variant="outline-brand" asChild className="bg-white/10 border-white/30 text-white hover:bg-white/20 hover:text-white">
              <a href={telHref(contact)}><Phone /> Request Callback</a>
            </Button>
          </div>
        </div>
      </motion.div>
    </div>
  </section>
  );
};
