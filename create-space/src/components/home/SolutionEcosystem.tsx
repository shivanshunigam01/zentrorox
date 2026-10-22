import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowRight, Handshake, Sparkles } from "lucide-react";
import { SOLUTION_BRANDS } from "@/data/homeContent";
import { SectionHeader } from "./SectionHeader";
import logo from "@/assets/zentroverse-logo.jpg";
import { cn } from "@/lib/utils";

const VIEW = 1000;
const CX = 500;
const CY = 500;
const RADIUS = 332;

const SERVICE_LINKS = [
  {
    label: "Business Consultancy",
    desc: "Strategic growth advisory",
    href: "/services/business-consultancy",
    Icon: Handshake,
    tone: "text-brand-purple bg-brand-purple/10 ring-brand-purple/30",
  },
  {
    label: "Network Expansion",
    desc: "Dealer & franchise growth",
    href: "/services/network-expansion",
    Icon: Sparkles,
    tone: "text-primary bg-primary/10 ring-primary/30",
  },
] as const;

function nodePoint(index: number, total: number, radius = RADIUS) {
  const angle = (index / total) * Math.PI * 2 - Math.PI / 2;
  return {
    angle,
    x: CX + radius * Math.cos(angle),
    y: CY + radius * Math.sin(angle),
  };
}

export const SolutionEcosystem = () => {
  const [active, setActive] = useState<string | null>(null);
  const nodes = useMemo(
    () =>
      SOLUTION_BRANDS.map((brand, index) => ({
        ...brand,
        ...nodePoint(index, SOLUTION_BRANDS.length),
      })),
    [],
  );

  return (
    <section id="solutions" className="py-16 md:py-24 lg:py-32 bg-gradient-mesh overflow-x-hidden">
      <div className="container min-w-0">
        <SectionHeader
          eyebrow="Our Ecosystem"
          title="Our Solutions Ecosystem"
          subtitle="Nine integrated brands connected through one Zentroverse — every product feeds the next, from demand generation to operations, intelligence and scale."
        />

        {/* Desktop constellation */}
        <div className="hidden lg:block">
          <div
            className="relative mx-auto w-full max-w-[46rem] xl:max-w-[52rem] aspect-square"
            onMouseLeave={() => setActive(null)}
          >
            <svg
              viewBox={`0 0 ${VIEW} ${VIEW}`}
              className="absolute inset-0 h-full w-full pointer-events-none"
              aria-hidden
            >
              <circle
                cx={CX}
                cy={CY}
                r={RADIUS}
                fill="none"
                className="stroke-border/70"
                strokeWidth="1.2"
                strokeDasharray="5 10"
              />
              <circle
                cx={CX}
                cy={CY}
                r={168}
                fill="none"
                className="stroke-primary/15"
                strokeWidth="1"
              />

              {nodes.map((node, i) => {
                const isActive = active === node.key;
                const dimmed = active !== null && !isActive;
                return (
                  <g key={node.key} className={node.color}>
                    <motion.path
                      d={`M ${CX} ${CY} L ${node.x} ${node.y}`}
                      fill="none"
                      stroke="currentColor"
                      strokeWidth={isActive ? 2.8 : 1.35}
                      strokeLinecap="round"
                      initial={{ pathLength: 0, opacity: 0 }}
                      whileInView={{ pathLength: 1, opacity: dimmed ? 0.18 : isActive ? 1 : 0.45 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.7, delay: 0.08 + i * 0.05, ease: "easeOut" }}
                      style={{ opacity: dimmed ? 0.18 : isActive ? 1 : 0.45 }}
                    />
                    {isActive && (
                      <circle cx={node.x} cy={node.y} r="8" className="fill-current" opacity="0.35" />
                    )}
                  </g>
                );
              })}
            </svg>

            <div className="absolute left-1/2 top-1/2 z-10 w-[9.5rem] xl:w-[10.5rem] -translate-x-1/2 -translate-y-1/2">
              <div className="rounded-[1.75rem] border border-border/80 bg-background/90 backdrop-blur-xl shadow-elegant px-4 py-5 text-center ring-1 ring-primary/15">
                <img
                  src={logo}
                  alt="Zentroverse"
                  className="mx-auto mb-2.5 h-12 w-12 xl:h-14 xl:w-14 rounded-xl object-cover ring-1 ring-border/70"
                />
                <div className="brand-wordmark text-[0.62rem] tracking-[0.16em] text-foreground">Zentroverse</div>
                <p className="mt-1.5 text-[11px] leading-snug text-muted-foreground">One connected growth stack</p>
              </div>
            </div>

            {nodes.map((node, i) => {
              const Icon = node.icon;
              const isActive = active === node.key;
              return (
                <div
                  key={node.key}
                  className={cn(
                    "absolute -translate-x-1/2 -translate-y-1/2",
                    isActive ? "z-30" : "z-20",
                  )}
                  style={{
                    left: `${(node.x / VIEW) * 100}%`,
                    top: `${(node.y / VIEW) * 100}%`,
                  }}
                  onMouseEnter={() => setActive(node.key)}
                  onFocus={() => setActive(node.key)}
                >
                  <motion.div
                    initial={{ opacity: 0, scale: 0.86 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.12 + i * 0.05, duration: 0.35 }}
                  >
                  <div
                    className={cn(
                      "flex w-[8.6rem] xl:w-[9.4rem] flex-col items-center text-center transition-all duration-300",
                      isActive ? "z-30" : active ? "opacity-50" : "opacity-100",
                    )}
                  >
                    <button
                      type="button"
                      className={cn(
                        "flex h-14 w-14 xl:h-16 xl:w-16 items-center justify-center rounded-2xl ring-1 shadow-soft transition-all duration-300",
                        node.bg,
                        node.ring,
                        isActive && "scale-110 shadow-elegant ring-2",
                      )}
                      aria-expanded={isActive}
                      aria-label={node.name}
                    >
                      <Icon className={cn("h-6 w-6 xl:h-7 xl:w-7", node.color)} />
                    </button>
                    <div className="mt-2 text-[12px] xl:text-[13px] font-extrabold leading-tight text-foreground">
                      {node.name}
                    </div>
                    <div
                      className={cn(
                        "grid transition-all duration-300",
                        isActive ? "grid-rows-[1fr] opacity-100 mt-1.5" : "grid-rows-[0fr] opacity-0",
                      )}
                    >
                      <div className="overflow-hidden">
                        <p className="text-[11px] leading-snug text-muted-foreground px-1">
                          {node.tagline}
                        </p>
                        <Link
                          to={`/products/${node.key}`}
                          className={cn(
                            "mt-1.5 inline-flex items-center gap-1 text-[11px] font-bold transition-all hover:gap-1.5",
                            node.color,
                          )}
                        >
                          Explore <ArrowRight className="h-3.5 w-3.5" />
                        </Link>
                      </div>
                    </div>
                  </div>
                  </motion.div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Mobile / tablet: stacked + swipe-friendly, no page overflow */}
        <div className="lg:hidden min-w-0">
          <div className="mx-auto mb-6 flex max-w-xs flex-col items-center rounded-2xl border border-border/80 bg-background/80 px-5 py-5 text-center shadow-soft">
            <img src={logo} alt="Zentroverse" className="mb-2 h-12 w-12 rounded-xl object-cover ring-1 ring-border/70" />
            <div className="brand-wordmark text-[0.62rem] tracking-[0.16em]">Zentroverse</div>
            <p className="mt-1 text-xs text-muted-foreground">All products connect here</p>
          </div>

          <div className="flex snap-x snap-mandatory gap-3 overflow-x-auto overscroll-x-contain pb-2 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
            {SOLUTION_BRANDS.map((brand) => {
              const Icon = brand.icon;
              return (
                <article
                  key={brand.key}
                  className="min-w-[min(78%,17.5rem)] max-w-[17.5rem] shrink-0 snap-center rounded-2xl border border-border bg-card p-5 shadow-card"
                >
                  <div className={cn("mb-3 flex h-12 w-12 items-center justify-center rounded-xl ring-1", brand.bg, brand.ring)}>
                    <Icon className={cn("h-6 w-6", brand.color)} />
                  </div>
                  <h3 className="text-lg font-extrabold leading-tight">{brand.name}</h3>
                  <p className="mt-1 text-sm text-muted-foreground">{brand.tagline}</p>
                  <Link
                    to={`/products/${brand.key}`}
                    className={cn("mt-3 inline-flex items-center gap-1 text-sm font-bold", brand.color)}
                  >
                    Explore <ArrowRight className="h-4 w-4" />
                  </Link>
                </article>
              );
            })}
          </div>
          <p className="mt-2 text-center text-[11px] text-muted-foreground">Swipe to explore each product</p>
        </div>

        <div className="mt-10 md:mt-12 grid gap-3 sm:grid-cols-2 max-w-3xl mx-auto">
          {SERVICE_LINKS.map(({ label, desc, href, Icon, tone }) => (
            <Link
              key={href}
              to={href}
              className="group flex items-center gap-3 rounded-2xl border border-border bg-card/80 px-4 py-3.5 hover:shadow-elegant transition-all"
            >
              <span className={cn("flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ring-1", tone)}>
                <Icon className="h-5 w-5" />
              </span>
              <span className="min-w-0">
                <span className="block text-sm font-extrabold">{label}</span>
                <span className="block text-xs text-muted-foreground">{desc}</span>
              </span>
              <ArrowRight className="ml-auto h-4 w-4 shrink-0 text-muted-foreground group-hover:text-primary group-hover:translate-x-0.5 transition-all" />
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
};
