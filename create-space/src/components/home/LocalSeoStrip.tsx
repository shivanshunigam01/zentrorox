import { Link } from "react-router-dom";
import { LOCAL_SEO } from "@/data/seoContent";
import { SectionHeader } from "./SectionHeader";

const REGIONS = [
  { region: "Bihar", slug: "bihar", keywords: LOCAL_SEO.bihar },
  { region: "Jharkhand", slug: "jharkhand", keywords: LOCAL_SEO.jharkhand },
  { region: "India", slug: "patna", keywords: LOCAL_SEO.india },
];

export const LocalSeoStrip = () => (
  <section className="py-10 bg-muted/50 border-y border-border">
    <div className="container">
      <SectionHeader
        eyebrow="Pan-India Presence"
        title="Serving Businesses Across India"
        subtitle="Headquartered in Patna, Bihar — delivering digital transformation, CRM, ERP and network expansion across Bihar, Jharkhand and pan-India markets."
        className="mb-8"
      />
      <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
        {REGIONS.map(({ region, slug, keywords }) => (
          <Link
            key={region}
            to={`/locations/${slug}`}
            className="rounded-xl border border-border bg-card p-5 shadow-soft hover:shadow-card hover:border-primary/40 transition-all"
          >
            <h3 className="font-extrabold text-lg mb-3">{region}</h3>
            <ul className="space-y-1.5">
              {keywords.map((kw) => (
                <li key={kw} className="text-xs text-muted-foreground">{kw}</li>
              ))}
            </ul>
          </Link>
        ))}
      </div>
    </div>
  </section>
);
