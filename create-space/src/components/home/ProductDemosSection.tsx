import { useProductDemosSection } from "@/hooks/useCmsSections";
import { motion } from "framer-motion";
import { PlayCircle } from "lucide-react";
import { SectionHeader } from "./SectionHeader";

export const ProductDemosSection = () => {
  const { items } = useProductDemosSection();
  const demos = items.filter((d) => d.url);

  return (
    <section id="demos" className="py-16 md:py-24 lg:py-28 bg-muted/30">
      <div className="container">
        <SectionHeader eyebrow="Product Demos" title="See Our Solutions in Action" subtitle="Videos and walkthroughs from the Zentroverse product ecosystem." />

        {demos.length === 0 ? (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="rounded-2xl border border-dashed border-border bg-card/50 aspect-video flex items-center justify-center text-sm text-muted-foreground p-6 text-center">
                Product demos will appear here — add them in Admin → Content CMS → Product Demos
              </div>
            ))}
          </div>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {demos.map((demo, i) => {
              const isVideo = demo.mediaType === "video" || demo.url.includes("/video/upload/");
              return (
                <motion.div
                  key={demo.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.08 }}
                  className="rounded-2xl border border-border bg-card overflow-hidden shadow-card"
                >
                  <div className="aspect-video bg-muted relative">
                    {isVideo ? (
                      <video src={demo.url} controls className="w-full h-full object-cover" />
                    ) : (
                      <img src={demo.url} alt={demo.title} className="w-full h-full object-cover" />
                    )}
                    {isVideo && (
                      <div className="absolute top-3 left-3 bg-background/80 rounded-full p-1.5 pointer-events-none">
                        <PlayCircle className="h-4 w-4 text-primary" />
                      </div>
                    )}
                  </div>
                  <div className="p-4">
                    {demo.product && <div className="text-[10px] font-bold uppercase tracking-wider text-primary mb-1">{demo.product}</div>}
                    <h3 className="font-extrabold">{demo.title}</h3>
                    {demo.caption && <p className="text-sm text-muted-foreground mt-1">{demo.caption}</p>}
                  </div>
                </motion.div>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
};
