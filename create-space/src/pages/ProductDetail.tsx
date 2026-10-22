import { Link, useParams } from "react-router-dom";
import { getGeoPage, PRODUCT_GEO_PAGES } from "@/data/geoContent";
import { GeoPageTemplate } from "@/components/seo/GeoPageTemplate";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";

export default function ProductDetail() {
  const { slug } = useParams();
  const page = slug ? getGeoPage("product", slug) : undefined;

  if (!page) {
    return (
      <main className="min-h-screen flex flex-col">
        <Navbar />
        <div className="flex-1 flex items-center justify-center px-4">
          <div className="text-center">
            <h1 className="text-3xl font-extrabold mb-4">Product not found</h1>
            <Link to="/" className="text-primary font-semibold hover:underline">Back to home</Link>
          </div>
        </div>
        <Footer />
      </main>
    );
  }

  const related = PRODUCT_GEO_PAGES.filter((p) => p.slug !== page.slug).slice(0, 4).map((p) => ({
    label: p.title,
    href: `/products/${p.slug}`,
  }));

  return (
    <GeoPageTemplate
      page={{ ...page, relatedLinks: [...page.relatedLinks, ...related] }}
      basePath="products"
      breadcrumbs={[
        { name: "Home", path: "/" },
        { name: "Products", path: "/products" },
        { name: page.title, path: `/products/${page.slug}` },
      ]}
    />
  );
}
