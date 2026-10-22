import { Link, Navigate, useParams } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { WhatsAppButton } from "@/components/WhatsAppButton";
import { SeoHead } from "@/components/seo/SeoHead";
import { GrowthHubToolRunner } from "@/components/growth-hub/GrowthHubToolRunner";
import { getGrowthTool } from "@/data/growthHubContent";

const GrowthHubToolPage = () => {
  const { toolId } = useParams<{ toolId: string }>();
  const tool = toolId ? getGrowthTool(toolId) : undefined;
  if (!tool) return <Navigate to="/growth-hub" replace />;

  const Icon = tool.icon;

  return (
    <>
      <SeoHead title={`${tool.title} | Growth Hub — Zentroverse`} description={tool.description} path={`/growth-hub/tools/${tool.id}`} />
      <main className="min-h-screen bg-background">
        <Navbar />
        <section className="pt-24 pb-16 md:pt-28">
          <div className="container max-w-3xl">
            <Button variant="ghost" size="sm" className="mb-6" asChild>
              <Link to="/growth-hub"><ArrowLeft className="h-4 w-4" /> Growth Hub</Link>
            </Button>
            <div className="flex items-start gap-4 mb-8">
              <div className="h-12 w-12 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
                <Icon className="h-6 w-6 text-primary" />
              </div>
              <div>
                <span className="text-xs font-bold uppercase text-primary">{tool.category}</span>
                <h1 className="text-2xl md:text-3xl font-extrabold">{tool.title}</h1>
              </div>
            </div>
            <GrowthHubToolRunner toolId={tool.id} />
          </div>
        </section>
        <Footer />
        <WhatsAppButton />
      </main>
    </>
  );
};

export default GrowthHubToolPage;
