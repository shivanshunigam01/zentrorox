import { Calendar, MessageCircle, Phone } from "lucide-react";
import { Button } from "@/components/ui/button";
import { trackEvent } from "@/lib/analytics";
import { useSiteContact } from "@/hooks/useSiteContact";
import { whatsAppHref } from "@/lib/siteContact";

export const FinalCTA = () => {
  const contact = useSiteContact();

  return (
  <section className="py-16 md:py-20 bg-gradient-primary text-primary-foreground">
    <div className="container max-w-3xl text-center">
      <h2 className="text-2xl md:text-4xl font-extrabold mb-4">Ready to Transform Your Business?</h2>
      <p className="text-white/80 mb-8 text-lg">
        Talk to our growth consultants about leads, automation, CRM, WhatsApp API and network expansion.
      </p>
      <div className="flex flex-col sm:flex-row gap-3 justify-center">
        <Button variant="secondary" size="lg" asChild>
          <a href="#contact" onClick={() => trackEvent("Demo Requested", { source: "final-cta" })}>
            <Phone className="h-4 w-4" /> Talk to Expert
          </a>
        </Button>
        <Button variant="outline" size="lg" className="border-white/30 text-primary hover:bg-white/10 hover:text-primary-foreground" asChild>
          <a href="#contact" onClick={() => trackEvent("Demo Requested", { source: "schedule-demo" })}>
            <Calendar className="h-4 w-4" /> Schedule Demo
          </a>
        </Button>
        <Button variant="outline" size="lg" className="border-white/30 text-primary hover:bg-white/10 hover:text-primary-foreground" asChild>
          <a
            href={whatsAppHref(contact)}
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => trackEvent("WhatsApp Click", { source: "final-cta" })}
          >
            <MessageCircle className="h-4 w-4" /> WhatsApp Us
          </a>
        </Button>
      </div>
    </div>
  </section>
  );
};
