import { CLIENT_LOGOS } from "@/data/homeContent";
import { SectionHeader } from "./SectionHeader";

export const ClientLogos = () => {
  const logos = [...CLIENT_LOGOS, ...CLIENT_LOGOS];

  return (
    <section className="py-16 md:py-20 bg-secondary/5 border-y border-border overflow-hidden">
      <div className="container mb-8">
        <SectionHeader eyebrow="Trusted By" title="Client Logos" />
      </div>

      <div className="relative">
        <div className="absolute left-0 top-0 bottom-0 w-20 bg-gradient-to-r from-background to-transparent z-10" />
        <div className="absolute right-0 top-0 bottom-0 w-20 bg-gradient-to-l from-background to-transparent z-10" />

        <div className="flex animate-marquee gap-8 w-max">
          {logos.map((logo, i) => (
            <div
              key={`${logo}-${i}`}
              className="flex items-center justify-center min-w-[180px] h-16 px-6 rounded-xl border border-border bg-card shadow-soft"
            >
              <span className="text-sm font-bold text-muted-foreground whitespace-nowrap">{logo}</span>
            </div>
          ))}
        </div>
      </div>

      <p className="text-center text-[11px] text-muted-foreground mt-6 px-4">
        Logos displayed where usage rights permit.
      </p>
    </section>
  );
};
