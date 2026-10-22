import { motion } from "framer-motion";

const logos = [
  "dgmarket", "Peepl", "Vikramshila", "Skybolt Industr.", "Patliputra.com",
  "Maurya Motors", "Kika Gaming", "GS Textile", "Tata Motors Ltd.",
];

export const TrustBar = () => {
  return (
    <section className="py-12 md:py-16 border-y border-border bg-muted/30">
      <div className="container">
        <p className="text-center text-sm font-semibold text-muted-foreground mb-8 uppercase tracking-wider">
          Trusted by 200+ growing businesses & dealerships
        </p>
        <div className="relative overflow-hidden">
          <motion.div
            animate={{ x: [0, -1200] }}
            transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
            className="flex gap-12 md:gap-16 whitespace-nowrap"
          >
            {[...logos, ...logos, ...logos].map((logo, i) => (
              <div key={i} className="flex-shrink-0 text-xl md:text-2xl font-bold text-muted-foreground/60 hover:text-foreground transition-colors">
                {logo}
              </div>
            ))}
          </motion.div>
          <div className="absolute inset-y-0 left-0 w-20 bg-gradient-to-r from-muted/30 to-transparent" />
          <div className="absolute inset-y-0 right-0 w-20 bg-gradient-to-l from-muted/30 to-transparent" />
        </div>
      </div>
    </section>
  );
};
