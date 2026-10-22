import { useEffect, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Check, PartyPopper, Trophy } from "lucide-react";
import { Button } from "@/components/ui/button";
import { OFFER_AMOUNTS } from "@/lib/hyOffers/store";
import type { ReferralSubmission } from "@/lib/hyOffers/types";

type Props = {
  open: boolean;
  submission: ReferralSubmission | null;
  promoCode: string;
  onClose: () => void;
};

const BALLOON_COLORS = ["#FF6B6B", "#4ECDC4", "#FFE66D", "#A78BFA", "#60A5FA", "#F472B6", "#34D399"];

function Balloon({ delay, left, color, size }: { delay: number; left: string; color: string; size: number }) {
  return (
    <motion.div
      className="absolute bottom-[-80px] pointer-events-none"
      style={{ left, width: size, height: size * 1.35 }}
      initial={{ y: 0, opacity: 0, rotate: -8 }}
      animate={{
        y: [0, "-115vh"],
        opacity: [0, 1, 1, 0],
        rotate: [-8, 8, -6, 10],
        x: [0, 18, -12, 8],
      }}
      transition={{
        duration: 5.5 + delay * 0.4,
        delay,
        ease: "easeOut",
        repeat: Infinity,
        repeatDelay: 0.8,
      }}
    >
      <svg viewBox="0 0 60 90" className="w-full h-full drop-shadow-lg">
        <ellipse cx="30" cy="32" rx="26" ry="30" fill={color} />
        <ellipse cx="20" cy="20" rx="6" ry="8" fill="white" opacity="0.35" />
        <polygon points="26,60 34,60 30,68" fill={color} />
        <path d="M30 68 Q28 78 32 88" stroke="#64748b" strokeWidth="1.5" fill="none" />
      </svg>
    </motion.div>
  );
}

function ConfettiPiece({ i }: { i: number }) {
  const colors = ["#FF6B6B", "#FFE66D", "#4ECDC4", "#A78BFA", "#60A5FA", "#F472B6", "#FBBF24"];
  const color = colors[i % colors.length];
  const left = `${(i * 7.3) % 100}%`;
  const rotate = (i * 47) % 360;
  const w = 6 + (i % 5);
  const h = 10 + (i % 7);

  return (
    <motion.span
      className="absolute top-0 rounded-sm pointer-events-none"
      style={{
        left,
        width: w,
        height: h,
        background: color,
        rotate: `${rotate}deg`,
      }}
      initial={{ y: -20, opacity: 0 }}
      animate={{
        y: ["-5vh", "105vh"],
        opacity: [0, 1, 1, 0],
        rotate: [rotate, rotate + 280],
        x: [0, (i % 2 === 0 ? 40 : -40)],
      }}
      transition={{
        duration: 2.8 + (i % 5) * 0.35,
        delay: (i % 12) * 0.08,
        ease: "easeIn",
        repeat: Infinity,
        repeatDelay: 0.4,
      }}
    />
  );
}

export function PrizeCelebration({ open, submission, promoCode, onClose }: Props) {
  const balloons = useMemo(
    () =>
      Array.from({ length: 10 }).map((_, i) => ({
        id: i,
        delay: i * 0.35,
        left: `${6 + ((i * 9.5) % 88)}%`,
        color: BALLOON_COLORS[i % BALLOON_COLORS.length],
        size: 42 + (i % 4) * 10,
      })),
    [],
  );

  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, [open]);

  return (
    <AnimatePresence>
      {open && submission ? (
        <motion.div
          className="fixed inset-0 z-[80] flex items-center justify-center px-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <div className="absolute inset-0 bg-secondary/70 backdrop-blur-sm" onClick={onClose} />

          {/* Confetti rain */}
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            {Array.from({ length: 36 }).map((_, i) => (
              <ConfettiPiece key={i} i={i} />
            ))}
          </div>

          {/* Balloons */}
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            {balloons.map((b) => (
              <Balloon key={b.id} delay={b.delay} left={b.left} color={b.color} size={b.size} />
            ))}
          </div>

          <motion.div
            className="relative w-full max-w-md rounded-3xl border border-white/20 bg-card shadow-elegant overflow-hidden"
            initial={{ scale: 0.7, y: 40, opacity: 0 }}
            animate={{ scale: 1, y: 0, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            transition={{ type: "spring", stiffness: 260, damping: 18 }}
          >
            <div
              className="absolute inset-0 opacity-90 pointer-events-none"
              style={{
                background:
                  "radial-gradient(ellipse at top, hsl(197 100% 58% / 0.25), transparent 55%), radial-gradient(ellipse at bottom right, hsl(268 75% 52% / 0.2), transparent 50%)",
              }}
            />

            <div className="relative p-7 pt-8 text-center space-y-4">
              <motion.div
                className="mx-auto h-20 w-20 rounded-full bg-gradient-primary flex items-center justify-center shadow-brand"
                initial={{ scale: 0, rotate: -30 }}
                animate={{ scale: 1, rotate: 0 }}
                transition={{ type: "spring", stiffness: 300, damping: 12, delay: 0.1 }}
              >
                <Trophy className="h-10 w-10 text-white" />
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="space-y-1"
              >
                <div className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-widest text-primary">
                  <PartyPopper className="h-3.5 w-3.5" />
                  You won a prize!
                </div>
                <h2 className="text-2xl md:text-3xl font-extrabold tracking-tight">
                  Congratulations!
                </h2>
                <p className="text-sm text-muted-foreground">
                  Promo code applied successfully
                </p>
              </motion.div>

              <motion.div
                className="rounded-2xl border-2 border-dashed border-primary/40 bg-primary/5 px-4 py-3"
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: [1, 1.04, 1], opacity: 1 }}
                transition={{ delay: 0.35, duration: 0.6 }}
              >
                <div className="text-[11px] uppercase tracking-wider text-muted-foreground mb-1">
                  Promo code
                </div>
                <div className="font-brand text-lg md:text-xl tracking-[0.12em] text-primary font-bold">
                  {promoCode}
                </div>
                <div className="mt-2 inline-flex items-center gap-1 text-xs font-semibold text-emerald-600">
                  <Check className="h-3.5 w-3.5" />
                  Applied successfully
                </div>
              </motion.div>

              <motion.div
                className="grid grid-cols-2 gap-3"
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.45 }}
              >
                <div className="rounded-xl bg-gradient-primary text-white p-3 shadow-brand">
                  <div className="text-[10px] uppercase tracking-wide opacity-90">You get</div>
                  <div className="text-2xl font-extrabold">₹{submission.friendOffer}</div>
                </div>
                <div className="rounded-xl border border-border bg-muted/60 p-3">
                  <div className="text-[10px] uppercase tracking-wide text-muted-foreground">
                    {submission.referrerName.split(" ")[0]} gets
                  </div>
                  <div className="text-2xl font-extrabold text-foreground">
                    ₹{submission.referrerOffer || OFFER_AMOUNTS.referrer}
                  </div>
                </div>
              </motion.div>

              <p className="text-xs text-muted-foreground leading-relaxed">
                Awesome, <strong>{submission.friendName}</strong>! Your reward is locked in. Share the
                love and keep the prizes coming.
              </p>

              <Button variant="hero" size="lg" className="w-full" onClick={onClose}>
                <PartyPopper className="h-4 w-4" />
                Claim the vibes — Continue
              </Button>
            </div>
          </motion.div>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}
