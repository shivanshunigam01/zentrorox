import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { WhatsAppButton } from "@/components/WhatsAppButton";
import { SeoHead } from "@/components/seo/SeoHead";
import { ContactLeadCapture } from "@/components/home/ContactLeadCapture";

const ContactPage = () => (
  <>
    <SeoHead
      title="Contact Us | Zentroverse Global — Book Consultation & Request Demo"
      description="Book a free consultation, request a demo or get a free business audit. Contact Zentroverse for AI-powered business growth, CRM, ERP and digital transformation."
      path="/contact"
    />
    <main className="min-h-screen bg-background">
      <Navbar />
      <div className="pt-16 md:pt-20">
        <ContactLeadCapture />
      </div>
      <Footer />
      <WhatsAppButton />
    </main>
  </>
);

export default ContactPage;
