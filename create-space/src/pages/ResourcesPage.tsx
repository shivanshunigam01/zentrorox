import { useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import {
  BookOpen, Calculator, Download, FileText, HelpCircle, Layers, Sparkles,
} from "lucide-react";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { WhatsAppButton } from "@/components/WhatsAppButton";
import { SeoHead } from "@/components/seo/SeoHead";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { SolutionLeadForm } from "@/components/forms/SolutionLeadForm";
import {
  RESOURCE_SECTIONS,
  RESOURCE_CATEGORIES,
  DOWNLOADABLES,
  type DownloadableResource,
} from "@/data/resourcesContent";
import { BLOG_POSTS } from "@/data/blogPosts";

const sectionIcons: Record<string, typeof BookOpen> = {
  Blogs: BookOpen,
  Guides: FileText,
  Playbooks: Layers,
  Templates: FileText,
  "Case Studies": Sparkles,
  FAQs: HelpCircle,
  "Business Calculators": Calculator,
  "Audit Tools": Sparkles,
};

const ResourcesPage = () => {
  const [downloadTarget, setDownloadTarget] = useState<DownloadableResource | null>(null);

  return (
    <>
      <SeoHead
        title="Resources | Blogs, Guides, Templates & Tools — Zentroverse"
        description="Access blogs, guides, playbooks, templates, case studies, FAQs, calculators and audit tools for business growth."
        path="/resources"
      />
      <main className="min-h-screen bg-background">
        <Navbar />

        <section className="pt-24 pb-12 md:pt-28 md:pb-16 hero-bg">
          <div className="container max-w-4xl text-center">
            <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}>
              <p className="text-xs font-bold uppercase tracking-widest text-primary mb-3">Knowledge Center</p>
              <h1 className="text-3xl md:text-5xl font-extrabold mb-4">Resources</h1>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                Blogs, guides, templates, calculators and audit tools to help you grow smarter.
              </p>
            </motion.div>
          </div>
        </section>

        <section className="py-12 md:py-16">
          <div className="container">
            <div className="flex flex-wrap justify-center gap-2 mb-10">
              {RESOURCE_CATEGORIES.map((cat) => (
                <span key={cat} className="text-xs font-semibold px-3 py-1.5 rounded-full bg-card border border-border">
                  {cat}
                </span>
              ))}
            </div>

            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5 max-w-6xl mx-auto">
              {RESOURCE_SECTIONS.map((section, i) => {
                const Icon = sectionIcons[section.title] ?? BookOpen;
                const isExternal = section.href.startsWith("http");
                const inner = (
                  <>
                    <Icon className="h-8 w-8 text-primary mb-3" />
                    <h2 className="font-extrabold mb-1">{section.title}</h2>
                    <p className="text-sm text-muted-foreground">{section.desc}</p>
                  </>
                );
                return (
                  <motion.div
                    key={section.title}
                    initial={{ opacity: 0, y: 12 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.04 }}
                  >
                    {isExternal ? (
                      <a href={section.href} className="block rounded-2xl border bg-card p-5 hover:shadow-card hover:-translate-y-0.5 transition-all">
                        {inner}
                      </a>
                    ) : (
                      <Link to={section.href} className="block rounded-2xl border bg-card p-5 hover:shadow-card hover:-translate-y-0.5 transition-all">
                        {inner}
                      </Link>
                    )}
                  </motion.div>
                );
              })}
            </div>
          </div>
        </section>

        <section id="guides" className="py-12 md:py-16 bg-muted/30">
          <div className="container max-w-4xl">
            <h2 className="text-2xl font-extrabold mb-6">Latest Articles</h2>
            <div className="grid sm:grid-cols-2 gap-4">
              {BLOG_POSTS.slice(0, 4).map((post) => (
                <Link
                  key={post.slug}
                  to={`/blogs/${post.slug}`}
                  className="rounded-xl border bg-card p-5 hover:shadow-card transition-shadow"
                >
                  <span className="text-[10px] font-bold uppercase text-primary">{post.category}</span>
                  <h3 className="font-bold mt-2 line-clamp-2">{post.title}</h3>
                  <p className="text-xs text-muted-foreground mt-2 line-clamp-2">{post.excerpt}</p>
                </Link>
              ))}
            </div>
            <Button variant="outline-brand" className="mt-6" asChild>
              <Link to="/blogs">View all articles</Link>
            </Button>
          </div>
        </section>

        <section id="downloads" className="py-16 md:py-20">
          <div className="container max-w-6xl">
            <h2 className="text-2xl md:text-3xl font-extrabold mb-2 text-center">Downloadable Resources</h2>
            <p className="text-center text-muted-foreground mb-10 max-w-xl mx-auto">
              Request any template — our team will send it to your email after a quick details form.
            </p>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {DOWNLOADABLES.map((resource, i) => (
                <motion.div
                  key={resource.id}
                  initial={{ opacity: 0, y: 12 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.04 }}
                  className="rounded-2xl border bg-card p-5 flex flex-col"
                >
                  <span className="text-[10px] font-bold uppercase text-primary">{resource.category}</span>
                  <h3 className="font-extrabold text-lg mt-2 mb-2">{resource.title}</h3>
                  <p className="text-sm text-muted-foreground flex-1 mb-4">{resource.description}</p>
                  <Button variant="outline-brand" size="sm" onClick={() => setDownloadTarget(resource)}>
                    <Download className="h-4 w-4" /> Request Download
                  </Button>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        <section className="py-12 container text-center">
          <Button variant="hero" size="lg" asChild>
            <Link to="/growth-hub">Explore Growth Hub Tools</Link>
          </Button>
        </section>

        <Footer />
        <WhatsAppButton />
      </main>

      <Dialog open={!!downloadTarget} onOpenChange={(o) => !o && setDownloadTarget(null)}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Request: {downloadTarget?.title}</DialogTitle>
          </DialogHeader>
          <p className="text-sm text-muted-foreground mb-4">
            Fill in your details and we will email the resource to you within 24 hours.
          </p>
          {downloadTarget && (
            <SolutionLeadForm
              productInterest={`Resource: ${downloadTarget.title}`}
              source={`resource-${downloadTarget.id}`}
            />
          )}
        </DialogContent>
      </Dialog>
    </>
  );
};

export default ResourcesPage;
