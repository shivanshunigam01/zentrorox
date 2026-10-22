import { Link, useParams } from "react-router-dom";
import { getBlogPost } from "@/data/blogPosts";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { WhatsAppButton } from "@/components/WhatsAppButton";
import { SeoHead } from "@/components/seo/SeoHead";
import { JsonLd } from "@/components/seo/JsonLd";
import { articleSchema, breadcrumbSchema, faqSchema } from "@/lib/schemaBuilders";
import {
  Accordion, AccordionContent, AccordionItem, AccordionTrigger,
} from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";

export default function BlogPostPage() {
  const { slug } = useParams();
  const post = slug ? getBlogPost(slug) : undefined;

  if (!post) {
    return (
      <main className="min-h-screen flex flex-col">
        <Navbar />
        <div className="flex-1 flex items-center justify-center px-4">
          <div className="text-center">
            <h1 className="text-3xl font-extrabold mb-4">Article not found</h1>
            <Link to="/blogs" className="text-primary font-semibold hover:underline">View all articles</Link>
          </div>
        </div>
        <Footer />
      </main>
    );
  }

  const breadcrumbs = [
    { name: "Home", path: "/" },
    { name: "Blog", path: "/blogs" },
    { name: post.title, path: `/blogs/${post.slug}` },
  ];

  return (
    <>
      <SeoHead
        title={`${post.title} | Zentroverse Blog`}
        description={post.metaDescription}
        path={`/blogs/${post.slug}`}
        ogType="article"
        keywords={post.keywords}
      />
      <JsonLd data={[breadcrumbSchema(breadcrumbs), articleSchema(post), faqSchema(post.faqs)]} />

      <main className="min-h-screen bg-background">
        <Navbar />
        <article className="pt-24 pb-16 container max-w-3xl">
          <nav className="text-xs text-muted-foreground mb-6">
            <Link to="/" className="hover:text-primary">Home</Link>
            {" / "}
            <Link to="/blogs" className="hover:text-primary">Blog</Link>
            {" / "}
            <span className="text-foreground">{post.category}</span>
          </nav>
          <div className="text-xs font-bold uppercase tracking-widest text-primary mb-3">{post.category}</div>
          <h1 className="text-3xl md:text-4xl font-extrabold leading-tight mb-4">{post.title}</h1>
          <time className="text-sm text-muted-foreground block mb-8" dateTime={post.datePublished}>
            {new Date(post.datePublished).toLocaleDateString("en-IN", { year: "numeric", month: "long", day: "numeric" })}
          </time>
          <p className="text-lg text-muted-foreground leading-relaxed mb-8 font-medium">{post.excerpt}</p>
          <div className="prose prose-slate max-w-none space-y-5">
            {post.body.map((para) => (
              <p key={para.slice(0, 40)} className="text-muted-foreground leading-relaxed">{para}</p>
            ))}
          </div>

          {post.faqs.length > 0 && (
            <section className="mt-12">
              <h2 className="text-xl font-extrabold mb-4">FAQ</h2>
              <Accordion type="single" collapsible className="space-y-2">
                {post.faqs.map((f, i) => (
                  <AccordionItem key={f.question} value={`faq-${i}`} className="rounded-xl border border-border px-4">
                    <AccordionTrigger className="text-left font-semibold hover:no-underline">{f.question}</AccordionTrigger>
                    <AccordionContent className="text-muted-foreground pb-4">{f.answer}</AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </section>
          )}

          <div className="mt-12 p-6 rounded-2xl bg-gradient-primary text-primary-foreground text-center">
            <p className="font-bold mb-4">Need help implementing this for your business?</p>
            <Button variant="secondary" asChild>
              <Link to="/#contact">Book Free Consultation</Link>
            </Button>
          </div>
        </article>
        <Footer />
        <WhatsAppButton />
      </main>
    </>
  );
}
