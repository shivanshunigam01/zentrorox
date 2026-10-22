import { SeoHead } from "@/components/seo/SeoHead";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { WhatsAppButton } from "@/components/WhatsAppButton";
import { HomepageSchema } from "@/components/seo/HomepageSchema";
import { HeroBanner } from "@/components/home/HeroBanner";
import { BusinessOutcomeCards } from "@/components/home/BusinessOutcomeCards";
import { WhoWeAre } from "@/components/home/WhoWeAre";
import { SolutionEcosystem } from "@/components/home/SolutionEcosystem";
import { IndustriesWeServe } from "@/components/home/IndustriesWeServe";
import { FreeAuditSection } from "@/components/home/FreeAuditSection";
import { OurWork } from "@/components/home/OurWork";
import { CalculatorsSection } from "@/components/home/CalculatorsSection";
import { ClientSuccessStories } from "@/components/home/ClientSuccessStories";
import { Gallery } from "@/components/home/Gallery";
import { KnowledgeCenter } from "@/components/home/KnowledgeCenter";
import { WhyChooseUs } from "@/components/home/WhyChooseUs";
import { LocalSeoStrip } from "@/components/home/LocalSeoStrip";
import { FaqSection } from "@/components/home/FaqSection";
import { FinalCTA } from "@/components/home/FinalCTA";
import { ContactLeadCapture } from "@/components/home/ContactLeadCapture";
import { ProductDemosSection } from "@/components/home/ProductDemosSection";
import { useHeroSeoSection } from "@/hooks/useCmsSections";

const Index = () => {
  const { meta } = useHeroSeoSection();

  return (
    <>
      <SeoHead title={meta.title} description={meta.description} path="/" keywords={[]} />
      <HomepageSchema />
      <main className="min-h-screen bg-background">
        <Navbar />
        <HeroBanner />
        <BusinessOutcomeCards />
        <WhoWeAre />
        <SolutionEcosystem />
        <IndustriesWeServe />
        <FreeAuditSection />
        <OurWork />
        <CalculatorsSection />
        <ClientSuccessStories />
        <ProductDemosSection />
        <Gallery />
        <KnowledgeCenter />
        <WhyChooseUs />
        <LocalSeoStrip />
        <FaqSection />
        <FinalCTA />
        <ContactLeadCapture />
        <Footer />
        <WhatsAppButton />
      </main>
    </>
  );
};

export default Index;
