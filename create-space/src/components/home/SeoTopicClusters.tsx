import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { TOPIC_CLUSTERS } from "@/data/seoContent";

export const SeoTopicClusters = () => (
  <section id="services" className="py-16 md:py-24 lg:py-28 bg-background">
    <div className="container">
      <div className="grid lg:grid-cols-2 gap-10 md:gap-12">
        {TOPIC_CLUSTERS.map((cluster, i) => (
          <motion.article
            key={cluster.id}
            id={cluster.id}
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.06 }}
            className="rounded-2xl border border-border bg-card p-6 md:p-8 shadow-card hover:shadow-elegant transition-all"
          >
            <div className="text-xs font-bold uppercase tracking-widest text-primary mb-2">
              {cluster.product}
            </div>
            <h2 className="text-2xl md:text-3xl font-extrabold mb-3">{cluster.heading}</h2>
            <p className="text-muted-foreground leading-relaxed mb-5">{cluster.summary}</p>
            <div className="flex flex-wrap gap-2 mb-5">
              {cluster.keywords.map((kw) => (
                <span
                  key={kw}
                  className="text-[11px] font-medium px-2.5 py-1 rounded-full bg-muted text-muted-foreground border border-border"
                >
                  {kw}
                </span>
              ))}
            </div>
            <Link
              to={`/services/${cluster.id}`}
              className="inline-flex items-center gap-1.5 text-sm font-bold text-primary hover:gap-2.5 transition-all"
            >
              Explore {cluster.product} <ArrowRight className="h-4 w-4" />
            </Link>
          </motion.article>
        ))}
      </div>
    </div>
  </section>
);
