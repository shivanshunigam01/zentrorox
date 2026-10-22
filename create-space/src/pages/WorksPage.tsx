import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { WhatsAppButton } from "@/components/WhatsAppButton";
import { SeoHead } from "@/components/seo/SeoHead";
import { WorkCard } from "@/components/works/WorkCard";
import { useWorksSection } from "@/hooks/useCmsSections";

const WorksPage = () => {
  const { items: works, loading } = useWorksSection();

  return (
    <>
      <SeoHead
        title="Featured Projects | Zentroverse — Our Work"
        description="Production-grade applications built across Automotive, Healthcare, Finance, and Enterprise SaaS using modern full-stack technologies."
        path="/works"
      />
      <main className="min-h-screen bg-background">
        <Navbar />
        <div className="min-h-screen pt-24 pb-20">
          <div className="container mx-auto px-4">
            <div className="max-w-3xl mx-auto text-center mb-16">
              <h1 className="text-4xl lg:text-6xl font-bold mb-6">
                <span className="gradient-text">Featured Projects</span>
              </h1>
              <p className="text-lg text-muted-foreground leading-relaxed">
                Production-grade applications built across multiple industries including Automotive,
                Healthcare, Finance, and Enterprise SaaS using modern full-stack technologies.
              </p>
            </div>

            {loading ? (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-7xl mx-auto">
                {Array.from({ length: 4 }).map((_, i) => (
                  <div key={i} className="h-[520px] rounded-2xl bg-muted animate-pulse" />
                ))}
              </div>
            ) : works.length === 0 ? (
              <div className="text-center py-20 text-muted-foreground border border-dashed rounded-2xl max-w-2xl mx-auto">
                Projects will appear here once added in Admin → Content CMS → Our Work.
              </div>
            ) : (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-7xl mx-auto">
                {works.map((work, idx) => (
                  <WorkCard key={work.id} work={work} index={idx} />
                ))}
              </div>
            )}
          </div>
        </div>
        <Footer />
        <WhatsAppButton />
      </main>
    </>
  );
};

export default WorksPage;
