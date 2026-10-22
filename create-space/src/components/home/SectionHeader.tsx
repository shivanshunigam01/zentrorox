import { motion } from "framer-motion";

type Props = {
  eyebrow?: string;
  title: string;
  subtitle?: string;
  id?: string;
  className?: string;
  dark?: boolean;
};

export const SectionHeader = ({ eyebrow, title, subtitle, id, className = "", dark = false }: Props) => (
  <motion.div
    id={id}
    initial={{ opacity: 0, y: 20 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true }}
    className={`text-center max-w-3xl mx-auto mb-12 md:mb-14 ${className}`}
  >
    {eyebrow && (
      <div className={`text-xs uppercase tracking-widest font-bold mb-3 ${dark ? "text-primary-glow" : "text-primary"}`}>
        {eyebrow}
      </div>
    )}
    <h2 className={`text-3xl md:text-5xl font-extrabold mb-4 ${dark ? "text-secondary-foreground" : ""}`}>
      {title}
    </h2>
    {subtitle && (
      <p className={`text-lg leading-relaxed ${dark ? "text-secondary-foreground/70" : "text-muted-foreground"}`}>
        {subtitle}
      </p>
    )}
  </motion.div>
);
