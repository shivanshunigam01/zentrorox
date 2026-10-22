import { Link, useParams } from "react-router-dom";
import { getGeoPage } from "@/data/geoContent";
import { GeoPageTemplate } from "@/components/seo/GeoPageTemplate";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";

export default function LocationPage() {
  const { slug } = useParams();
  const page = slug ? getGeoPage("location", slug) : undefined;

  if (!page) {
    return (
      <main className="min-h-screen flex flex-col">
        <Navbar />
        <div className="flex-1 flex items-center justify-center px-4">
          <div className="text-center">
            <h1 className="text-3xl font-extrabold mb-4">Location not found</h1>
            <Link to="/" className="text-primary font-semibold hover:underline">Back to home</Link>
          </div>
        </div>
        <Footer />
      </main>
    );
  }

  return (
    <GeoPageTemplate
      page={page}
      basePath="locations"
      breadcrumbs={[
        { name: "Home", path: "/" },
        { name: "Locations", path: "/locations" },
        { name: page.title, path: `/locations/${page.slug}` },
      ]}
    />
  );
}
