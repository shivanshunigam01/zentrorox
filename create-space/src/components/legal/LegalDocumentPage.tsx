import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { WhatsAppButton } from "@/components/WhatsAppButton";
import { SeoHead } from "@/components/seo/SeoHead";
import type { LegalDocument } from "@/data/legalContent";

function sectionId(title: string) {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

type Props = {
  document: LegalDocument;
  alternate?: { label: string; href: string };
};

export const LegalDocumentPage = ({ document, alternate }: Props) => (
  <>
    <SeoHead title={document.seoTitle} description={document.seoDescription} path={document.path} />
    <main className="min-h-screen bg-background">
      <Navbar />

      <section className="pt-24 pb-10 md:pt-28 md:pb-12 hero-bg">
        <div className="container max-w-3xl">
          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}>
            <p className="text-xs font-bold uppercase tracking-widest text-primary mb-3">{document.eyebrow}</p>
            <h1 className="text-3xl md:text-4xl font-extrabold mb-3">{document.title}</h1>
            <p className="text-sm text-muted-foreground">Last updated: {document.lastUpdated}</p>
            {alternate && (
              <p className="text-sm text-muted-foreground mt-2">
                See also{" "}
                <Link to={alternate.href} className="text-primary font-medium hover:underline">
                  {alternate.label}
                </Link>
              </p>
            )}
          </motion.div>
        </div>
      </section>

      <section className="pb-20 md:pb-24">
        <div className="container max-w-3xl">
          <p className="text-muted-foreground leading-relaxed mb-10">{document.intro}</p>
          <div className="space-y-10">
            {document.sections.map((section) => (
              <article key={section.title} id={sectionId(section.title)} className="scroll-mt-28">
                <h2 className="text-xl font-bold mb-3">{section.title}</h2>
                {section.paragraphs?.map((p) => (
                  <p key={p.slice(0, 40)} className="text-muted-foreground leading-relaxed mb-3 last:mb-0">
                    {p}
                  </p>
                ))}
                {section.bullets && (
                  <ul className="list-disc pl-5 space-y-2 text-muted-foreground leading-relaxed">
                    {section.bullets.map((item) => (
                      <li key={item.slice(0, 48)}>{item}</li>
                    ))}
                  </ul>
                )}
              </article>
            ))}
          </div>
        </div>
      </section>

      <Footer />
      <WhatsAppButton />
    </main>
  </>
);
