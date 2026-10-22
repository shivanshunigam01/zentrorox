import { Link } from "react-router-dom";
import { PRODUCT_GEO_PAGES } from "@/data/geoContent";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { WhatsAppButton } from "@/components/WhatsAppButton";
import { SeoHead } from "@/components/seo/SeoHead";
import { BRAND_TAGLINE } from "@/data/seoContent";

export default function ProductsIndex() {
  return (
    <>
      <SeoHead
        title="Products | Zentroverse Ecosystem — ZentroADS, ZentroBOT, ZentroFLOW & More"
        description={`Nine integrated Zentroverse products for digital marketing, CRM, ERP, WhatsApp API, lead management and more. ${BRAND_TAGLINE}`}
        path="/products"
      />
      <main className="min-h-screen bg-background">
        <Navbar />
        <section className="pt-24 pb-16 container">
          <h1 className="text-3xl md:text-5xl font-extrabold mb-4">Our Solution Ecosystem</h1>
          <p className="text-muted-foreground text-lg max-w-2xl mb-10">{BRAND_TAGLINE}</p>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {PRODUCT_GEO_PAGES.map((p) => (
              <Link
                key={p.slug}
                to={`/products/${p.slug}`}
                className="rounded-2xl border border-border bg-card p-6 shadow-card hover:shadow-elegant hover:-translate-y-1 transition-all"
              >
                <div className="text-xs font-bold text-primary uppercase tracking-widest mb-2">{p.tagline}</div>
                <h2 className="text-xl font-extrabold mb-2">{p.title}</h2>
                <p className="text-sm text-muted-foreground line-clamp-3">{p.whatIsIt}</p>
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
