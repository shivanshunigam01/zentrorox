import { useState } from "react";
import { motion } from "framer-motion";
import { useGallerySection } from "@/hooks/useCmsSections";
import { SectionHeader } from "./SectionHeader";
import { cn } from "@/lib/utils";

const galleryGradients = [
  "from-brand-purple/20 to-brand-blue/20",
  "from-primary/20 to-emerald-500/20",
  "from-rose-500/20 to-brand-pink/20",
  "from-amber-500/20 to-orange-500/20",
];

export const Gallery = () => {
  const { items: gallery, categories } = useGallerySection();
  const [active, setActive] = useState(categories[0] ?? "General");

  const items = gallery.filter((g) => g.url && g.category === active);
  const displayItems = items.length ? items : [];

  return (
    <section id="gallery" className="py-16 md:py-24 lg:py-28 bg-background">
      <div className="container">
        <SectionHeader eyebrow="Gallery" title="Moments That Define Our Journey" />

        <div className="flex flex-wrap justify-center gap-2 mb-10">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActive(cat)}
              className={cn(
                "px-4 py-2 rounded-full text-xs font-bold transition-all border",
                active === cat
                  ? "bg-primary text-primary-foreground border-primary"
                  : "bg-card border-border text-muted-foreground hover:border-primary/40",
              )}
            >
              {cat}
            </button>
          ))}
        </div>

        {displayItems.length === 0 ? (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {Array.from({ length: 4 }).map((_, i) => (
              <div
                key={i}
                className={cn(
                  "aspect-[4/3] rounded-2xl border border-border bg-gradient-to-br flex items-end p-4 shadow-soft",
                  galleryGradients[i % galleryGradients.length],
                )}
              >
                <div>
                  <div className="text-[10px] font-bold uppercase tracking-wider text-primary mb-1">{active}</div>
                  <div className="text-xs font-semibold text-muted-foreground">Add photos in Admin → Content CMS</div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {displayItems.map((item, i) => (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: i * 0.04 }}
                className="aspect-[4/3] rounded-2xl border border-border overflow-hidden shadow-soft hover:shadow-card transition-all relative group"
              >
                {item.mediaType === "video" ? (
                  <video src={item.url} controls className="w-full h-full object-cover" />
                ) : (
                  <img src={item.url} alt={item.alt ?? item.caption ?? active} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                )}
                {item.caption && (
                  <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/70 to-transparent p-3">
                    <p className="text-xs font-semibold text-white">{item.caption}</p>
                  </div>
                )}
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
};
