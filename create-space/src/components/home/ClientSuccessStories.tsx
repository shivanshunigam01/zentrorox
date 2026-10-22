import { motion } from "framer-motion";
import { PlayCircle, Quote, Star } from "lucide-react";
import { useTestimonialsSection } from "@/hooks/useCmsSections";
import { SectionHeader } from "./SectionHeader";

export const ClientSuccessStories = () => {
  const { items: testimonials } = useTestimonialsSection();

  return (
    <section className="py-16 md:py-24 lg:py-28 bg-gradient-mesh">
      <div className="container">
        <SectionHeader eyebrow="Testimonials" title="Customer Success Stories" />

        <div className="grid md:grid-cols-3 gap-6">
          {testimonials.map((t, i) => {
            const mediaUrl = t.videoUrl || t.thumbnailUrl;
            const isVideo = t.mediaType === "video" || mediaUrl?.includes("/video/");

            return (
              <motion.div
                key={t.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="rounded-2xl bg-card border border-border p-6 shadow-card group overflow-hidden"
              >
                {mediaUrl ? (
                  isVideo ? (
                    <div className="aspect-video rounded-xl overflow-hidden mb-4 bg-muted">
                      <video src={mediaUrl} controls className="w-full h-full object-cover" />
                    </div>
                  ) : (
                    <a href={mediaUrl} target="_blank" rel="noreferrer" className="block aspect-video rounded-xl overflow-hidden mb-4">
                      <img src={mediaUrl} alt={t.name} className="w-full h-full object-cover group-hover:scale-[1.02] transition-transform" />
                    </a>
                  )
                ) : (
                  <div className="aspect-video rounded-xl bg-gradient-to-br from-primary/15 to-brand-purple/15 mb-4 flex items-center justify-center">
                    <PlayCircle className="h-12 w-12 text-primary" />
                  </div>
                )}
                <Quote className="h-5 w-5 text-primary/40 mb-2" />
                <p className="text-sm leading-relaxed mb-4">{t.quote}</p>
                <div className="flex gap-0.5 mb-3">
                  {Array.from({ length: t.rating }).map((_, j) => (
                    <Star key={j} className="h-4 w-4 fill-amber-400 text-amber-400" />
                  ))}
                </div>
                <div className="text-sm font-extrabold">{t.name}</div>
                {t.designation && <div className="text-xs text-muted-foreground">{t.designation}</div>}
                <div className="text-xs text-muted-foreground">{t.company}</div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
