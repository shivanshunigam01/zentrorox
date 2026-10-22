import { Link } from "react-router-dom";
import { BookOpen, ArrowRight } from "lucide-react";
import { BLOG_POSTS } from "@/data/blogPosts";
import { BLOG_CATEGORIES } from "@/data/homeContent";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { WhatsAppButton } from "@/components/WhatsAppButton";
import { SeoHead } from "@/components/seo/SeoHead";
import { JsonLd } from "@/components/seo/JsonLd";
import { breadcrumbSchema } from "@/lib/schemaBuilders";
import { BRAND_TAGLINE } from "@/data/seoContent";

export default function BlogIndex() {
  return (
    <>
      <SeoHead
        title="Blog & Insights | Zentroverse — Digital Marketing, AI, CRM & Business Growth"
        description={`Expert articles on digital marketing, automation, AI, dealer development and network expansion. ${BRAND_TAGLINE}`}
        path="/blogs"
      />
      <JsonLd data={breadcrumbSchema([
        { name: "Home", path: "/" },
        { name: "Blog", path: "/blogs" },
      ])} />

      <main className="min-h-screen bg-background">
        <Navbar />
        <section className="pt-24 pb-16 container">
          <h1 className="text-3xl md:text-5xl font-extrabold mb-4">Blogs & Insights</h1>
          <p className="text-muted-foreground text-lg max-w-2xl mb-8">
            2–3 articles weekly on digital marketing, automation, AI and business growth — built for SEO and answer engines.
          </p>
          <div className="flex flex-wrap gap-2 mb-10">
            {BLOG_CATEGORIES.map((cat) => (
              <span key={cat} className="px-3 py-1.5 rounded-full text-xs font-semibold bg-muted border border-border">
                {cat}
              </span>
            ))}
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {BLOG_POSTS.map((post) => (
              <Link
                key={post.slug}
                to={`/blogs/${post.slug}`}
                className="group rounded-2xl border border-border bg-card p-6 shadow-card hover:shadow-elegant hover:-translate-y-1 transition-all"
              >
                <div className="flex items-center gap-2 text-xs font-bold text-primary mb-3">
                  <BookOpen className="h-3.5 w-3.5" />{post.category}
                </div>
                <h2 className="text-base font-extrabold mb-2 group-hover:text-primary transition-colors leading-snug">
                  {post.title}
                </h2>
                <p className="text-sm text-muted-foreground line-clamp-2 mb-3">{post.excerpt}</p>
                <span className="inline-flex items-center gap-1 text-sm font-bold text-primary">
                  Read article <ArrowRight className="h-4 w-4" />
                </span>
              </Link>
            ))}
          </div>
        </section>
        <Footer />
        <WhatsAppButton />
      </main>
    </>
  );
}
