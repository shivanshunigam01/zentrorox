import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowRight, BookOpen } from "lucide-react";
import { BLOG_POSTS } from "@/data/blogPosts";
import { BLOG_CATEGORIES } from "@/data/homeContent";
import { SectionHeader } from "./SectionHeader";

export const BlogsInsights = () => (
  <section id="blogs" className="py-16 md:py-24 lg:py-28 bg-background">
    <div className="container">
      <SectionHeader
        eyebrow="Insights"
        title="Blogs & Insights"
        subtitle="2–3 articles weekly on digital marketing, automation, AI, dealer development and network expansion — targeting 100+ quality articles for SEO and AEO."
      />

      <div className="flex flex-wrap justify-center gap-2 mb-10">
        {BLOG_CATEGORIES.map((cat) => (
          <span
            key={cat}
            className="px-3 py-1.5 rounded-full text-xs font-semibold bg-muted text-muted-foreground border border-border"
          >
            {cat}
          </span>
        ))}
      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {BLOG_POSTS.slice(0, 6).map((post, i) => (
          <motion.div
            key={post.slug}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.06 }}
          >
            <Link
              to={`/blogs/${post.slug}`}
              className="group block rounded-2xl border border-border bg-card p-6 shadow-card hover:shadow-elegant hover:-translate-y-1 transition-all"
            >
              <div className="flex items-center gap-2 text-xs font-bold text-primary mb-3">
                <BookOpen className="h-3.5 w-3.5" />
                {post.category}
              </div>
              <h3 className="text-base font-extrabold mb-2 group-hover:text-primary transition-colors leading-snug">
                {post.title}
              </h3>
              <div className="text-xs text-muted-foreground mb-4">
                {new Date(post.datePublished).toLocaleDateString("en-IN", { month: "short", year: "numeric" })}
              </div>
              <span className="inline-flex items-center gap-1 text-sm font-bold text-primary group-hover:gap-2 transition-all">
                Read article <ArrowRight className="h-4 w-4" />
              </span>
            </Link>
          </motion.div>
        ))}
      </div>
      <div className="text-center mt-8">
        <Link to="/blogs" className="inline-flex items-center gap-2 text-sm font-bold text-primary hover:gap-3 transition-all">
          View all articles <ArrowRight className="h-4 w-4" />
        </Link>
      </div>
    </div>
  </section>
);
