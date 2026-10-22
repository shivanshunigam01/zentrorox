import { motion, useInView } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import { IMPACT_STATS } from "@/data/homeContent";
import { SectionHeader } from "./SectionHeader";

const parseValue = (val: string) => {
  const match = val.match(/^(\d+)(.*)$/);
  if (!match) return { num: 0, suffix: val };
  return { num: parseInt(match[1], 10), suffix: match[2] };
};

const Counter = ({ value, label }: { value: string; label: string }) => {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });
  const { num, suffix } = parseValue(value);
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (!inView) return;
    const duration = 1500;
    const start = performance.now();
    const tick = (now: number) => {
      const progress = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setCount(Math.round(num * eased));
      if (progress < 1) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  }, [inView, num]);

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className="rounded-2xl border border-border bg-card p-6 md:p-8 text-center shadow-card"
    >
      <div className="text-3xl md:text-5xl font-extrabold gradient-brand-text mb-2">
        {inView ? `${count.toLocaleString()}${suffix}` : `0${suffix}`}
      </div>
      <div className="text-sm md:text-base font-semibold text-muted-foreground">{label}</div>
    </motion.div>
  );
};

export const OurImpact = () => (
  <section className="py-16 md:py-24 lg:py-28 bg-background">
    <div className="container">
      <SectionHeader eyebrow="Results" title="Our Impact" />

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 md:gap-5">
        {IMPACT_STATS.map((stat) => (
          <Counter key={stat.label} value={stat.value} label={stat.label} />
        ))}
      </div>
    </div>
  </section>
);
