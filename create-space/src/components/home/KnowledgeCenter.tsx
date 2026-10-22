import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowRight, BookOpen, HelpCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { BLOG_POSTS } from "@/data/blogPosts";
import { FAQ_ITEMS, TOPIC_CLUSTERS } from "@/data/seoContent";
import { KNOWLEDGE_CATEGORIES } from "@/data/homeContent";
import { SectionHeader } from "./SectionHeader";

export const KnowledgeCenter = () => (
  <section id="resources" className="py-16 md:py-24 lg:py-28 bg-gradient-mesh">
    <div className="container">
      <SectionHeader
        eyebrow="Knowledge Center"
        title="Blogs, Guides & FAQs"
        subtitle="Expert insights on digital marketing, automation, CRM, dealer development and network expansion."
      />

      <div className="flex flex-wrap gap-2 mb-8 justify-center">
        {KNOWLEDGE_CATEGORIES.map((cat) => (
          <span key={cat} className="text-xs font-semibold px-3 py-1.5 rounded-full bg-card border border-border">
            {cat}
          </span>
        ))}
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <div className="flex items-center gap-2 mb-4">
            <BookOpen className="h-5 w-5 text-primary" />
            <h3 className="font-extrabold text-lg">Latest Articles</h3>
          </div>
          <div className="grid sm:grid-cols-2 gap-4">
            {BLOG_POSTS.slice(0, 4).map((post, i) => (
              <motion.div
                key={post.slug}
                initial={{ opacity: 0, y: 12 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.05 }}
              >
                <Link to={`/blogs/${post.slug}`} className="block rounded-xl border border-border bg-card p-5 hover:shadow-card transition-shadow h-full">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-primary">{post.category}</span>
                  <h4 className="font-bold mt-2 mb-2 line-clamp-2">{post.title}</h4>
                  <p className="text-xs text-muted-foreground line-clamp-2">{post.excerpt}</p>
                </Link>
              </motion.div>
            ))}
          </div>
          <Button variant="outline-brand" className="mt-6" asChild>
            <Link to="/growth-hub">Explore Growth Hub tools <ArrowRight className="h-4 w-4" /></Link>
          </Button>
          <Button variant="outline" className="mt-3 ml-0" asChild>
            <Link to="/blogs">View all articles <ArrowRight className="h-4 w-4" /></Link>
          </Button>
        </div>

        <div>
          <div className="flex items-center gap-2 mb-4">
            <HelpCircle className="h-5 w-5 text-primary" />
            <h3 className="font-extrabold text-lg">Quick FAQs</h3>
          </div>
          <ul className="space-y-3 mb-6">
            {FAQ_ITEMS.slice(0, 5).map((f) => (
              <li key={f.question} className="text-sm rounded-lg border border-border bg-card p-3">
                <div className="font-semibold mb-1">{f.question}</div>
                <p className="text-xs text-muted-foreground line-clamp-2">{f.answer}</p>
              </li>
            ))}
          </ul>
          <a href="#faq" className="text-sm font-bold text-primary hover:underline">See all FAQs →</a>

          <div className="mt-8 pt-6 border-t border-border">
            <h4 className="text-sm font-extrabold mb-3">Service Guides</h4>
            <ul className="space-y-2">
              {TOPIC_CLUSTERS.slice(0, 4).map((c) => (
                <li key={c.id}>
                  <Link to={`/services/${c.id}`} className="text-sm text-muted-foreground hover:text-primary flex items-center gap-1">
                    <ArrowRight className="h-3 w-3" /> {c.heading}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  </section>
);
