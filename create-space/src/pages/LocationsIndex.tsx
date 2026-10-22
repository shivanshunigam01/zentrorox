import { Link } from "react-router-dom";
import { LOCATION_GEO_PAGES } from "@/data/geoContent";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { WhatsAppButton } from "@/components/WhatsAppButton";
import { SeoHead } from "@/components/seo/SeoHead";

export default function LocationsIndex() {
  return (
    <>
      <SeoHead
        title="Locations | Zentroverse — Bihar, Jharkhand & Pan-India"
        description="Zentroverse serves Bihar, Jharkhand and pan-India with digital marketing, CRM, ERP, WhatsApp API and business consulting from Patna headquarters."
        path="/locations"
      />
      <main className="min-h-screen bg-background">
        <Navbar />
        <section className="pt-24 pb-16 container">
          <h1 className="text-3xl md:text-5xl font-extrabold mb-4">Locations We Serve</h1>
          <p className="text-muted-foreground text-lg max-w-2xl mb-10">
            Headquartered in Patna, Bihar — delivering across Bihar, Jharkhand and all of India.
          </p>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {LOCATION_GEO_PAGES.map((loc) => (
              <Link
                key={loc.slug}
                to={`/locations/${loc.slug}`}
                className="rounded-2xl border border-border bg-card p-6 shadow-card hover:shadow-elegant hover:-translate-y-1 transition-all"
              >
                <h2 className="text-xl font-extrabold mb-2">{loc.title}</h2>
                <p className="text-sm text-muted-foreground line-clamp-3">{loc.whatIsIt}</p>
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
