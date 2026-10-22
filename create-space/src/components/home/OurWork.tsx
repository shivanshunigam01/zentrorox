import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useWorksSection } from "@/hooks/useCmsSections";
import { WorkCard } from "@/components/works/WorkCard";

export const OurWork = () => {
  const { items: works } = useWorksSection();
  const featured = works.slice(0, 4);

  return (
    <section id="portfolio" className="py-16 md:py-24 lg:py-28 bg-background">
      <div className="container mx-auto px-4">
        <div className="max-w-3xl mx-auto text-center mb-12 md:mb-16">
          <p className="text-xs font-bold uppercase tracking-widest text-primary mb-3">Our Work</p>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4">
            <span className="gradient-text">Featured Projects</span>
          </h2>
          <p className="text-muted-foreground text-base md:text-lg leading-relaxed">
            Production-grade platforms delivered across automotive, healthcare, finance, and enterprise SaaS.
          </p>
        </div>

        {featured.length === 0 ? (
          <div className="text-center py-12 text-muted-foreground border border-dashed rounded-2xl">
            Add projects in Admin → Content CMS → Our Work
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-7xl mx-auto">
            {featured.map((work, i) => (
              <motion.div
                key={work.id}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.07 }}
              >
                <WorkCard work={work} index={i} compact />
              </motion.div>
            ))}
          </div>
        )}

        {works.length > 0 && (
          <div className="flex justify-center mt-12">
            <Button
              size="lg"
              className="bg-gradient-to-r from-primary to-brand-blue hover:opacity-90 text-white border-0"
              asChild
            >
              <Link to="/works">
                View all projects
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>
        )}
      </div>
    </section>
  );
};
