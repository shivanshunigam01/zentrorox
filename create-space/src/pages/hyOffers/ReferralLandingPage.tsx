import { useEffect, useMemo, useState, type ReactNode } from "react";
import { Link, useParams } from "react-router-dom";
import { motion } from "framer-motion";
import { Copy, Gift, MapPin, Share2, ShieldCheck, Sparkles, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "@/hooks/use-toast";
import { PrizeCelebration } from "@/components/hyOffers/PrizeCelebration";
import {
  BRANCHES,
  branchFromReferralCode,
  parseBranchCode,
  type BranchCode,
} from "@/lib/hyOffers/branches";
import {
  OFFER_AMOUNTS,
  addReferralSubmission,
  getCustomerByCode,
  getSubmissionsForCode,
  markLinkClicked,
  publicReferralPath,
  resolveCustomerByCode,
} from "@/lib/hyOffers/store";
import { submitReferralApi, trackReferralClickApi } from "@/lib/hyOffers/api";
import type { HyOfferCustomer, ReferralSubmission } from "@/lib/hyOffers/types";

const HERO = "/images/pulsar/hero.jpg";
const BAJAJ_LOGO = "/images/pulsar/bajaj-logo.png";
const DETAIL = "/images/pulsar/detail.jpg";
const GROUP = "/images/pulsar/group.jpg";

/** Bajaj corporate blue */
const BAJAJ_BLUE = "#0054A6";
const BAJAJ_BLUE_DARK = "#003d7a";

const ReferralLandingPage = () => {
  const { branch: branchParam = "", code = "" } = useParams<{ branch?: string; code: string }>();
  const [customer, setCustomer] = useState<HyOfferCustomer | undefined>();
  const [loadingCustomer, setLoadingCustomer] = useState(true);
  const [submissions, setSubmissions] = useState<ReferralSubmission[]>([]);
  const [friendName, setFriendName] = useState("");
  const [friendMobile, setFriendMobile] = useState("");
  const [friendEmail, setFriendEmail] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState<ReferralSubmission | null>(null);

  const resolvedCode = useMemo(() => {
    if (code) return code;
    return branchParam;
  }, [branchParam, code]);

  const branch: BranchCode = useMemo(() => {
    const fromParam = parseBranchCode(code ? branchParam : undefined);
    const fromCode = branchFromReferralCode(resolvedCode);
    return fromParam || fromCode || "BR";
  }, [branchParam, code, resolvedCode]);

  const branchInfo = BRANCHES[branch];

  useEffect(() => {
    let cancelled = false;
    setLoadingCustomer(true);
    setCustomer(undefined);
    void (async () => {
      const c = await resolveCustomerByCode(resolvedCode);
      if (cancelled) return;
      setCustomer(c);
      if (c) {
        void trackReferralClickApi(c.referralCode);
        markLinkClicked(c.referralCode);
        const refreshed = await resolveCustomerByCode(c.referralCode);
        if (cancelled) return;
        setCustomer(refreshed);
        setSubmissions(getSubmissionsForCode(c.referralCode));
      }
      setLoadingCustomer(false);
    })();
    return () => {
      cancelled = true;
    };
  }, [resolvedCode]);

  const shareUrl = useMemo(() => {
    const path = publicReferralPath(resolvedCode, branch);
    if (typeof window === "undefined") return path;
    return `${window.location.origin}${path}`;
  }, [resolvedCode, branch]);

  const onShare = async () => {
    try {
      if (navigator.share) {
        await navigator.share({
          title: `${customer?.customerName} invited you — Pulsar ₹${OFFER_AMOUNTS.friend} offer`,
          text: `Claim your ₹${OFFER_AMOUNTS.friend} Bajaj Pulsar referral reward!`,
          url: shareUrl,
        });
      } else {
        await navigator.clipboard.writeText(shareUrl);
        toast({ title: "Link copied", description: shareUrl });
      }
    } catch {
      /* cancelled */
    }
  };

  const onCopyLink = async () => {
    await navigator.clipboard.writeText(shareUrl);
    toast({ title: "Referral link copied", description: shareUrl });
  };

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customer) return;

    const mobile = friendMobile.replace(/\D/g, "");
    if (mobile.length < 10) {
      toast({ title: "Enter a valid mobile number", variant: "destructive" });
      return;
    }
    if (mobile === customer.mobileNo) {
      toast({
        title: "Use a friend's number",
        description: "The referrer cannot claim their own shared link.",
        variant: "destructive",
      });
      return;
    }

    setSubmitting(true);
    void (async () => {
      const apiResult = await submitReferralApi({
        referrerCode: customer.referralCode,
        referrerName: customer.customerName,
        referrerMobile: customer.mobileNo,
        friendName,
        friendMobile: mobile,
        friendEmail: friendEmail || undefined,
        branch: branch ?? "",
      });

      if (apiResult.ok) {
        setSuccess({
          id: apiResult.submission.id,
          referrerCode: apiResult.submission.referrerCode,
          referrerName: apiResult.submission.referrerName,
          referrerMobile: apiResult.submission.referrerMobile,
          friendName: apiResult.submission.friendName,
          friendMobile: apiResult.submission.friendMobile,
          friendEmail: apiResult.submission.friendEmail,
          referrerOffer: apiResult.submission.referrerOffer,
          friendOffer: apiResult.submission.friendOffer,
          createdAt: apiResult.submission.createdAt,
        });
      } else {
        const sub = addReferralSubmission({
          referrerCode: customer.referralCode,
          referrerName: customer.customerName,
          referrerMobile: customer.mobileNo,
          friendName,
          friendMobile: mobile,
          friendEmail: friendEmail || undefined,
        });
        setSuccess(sub);
        toast({ title: "Saved locally", description: apiResult.message, variant: "destructive" });
      }

      setSubmissions(getSubmissionsForCode(customer.referralCode));
      setCustomer(getCustomerByCode(customer.referralCode));
      setFriendName("");
      setFriendMobile("");
      setFriendEmail("");
      setSubmitting(false);
    })();
  };

  if (loadingCustomer) {
    return (
      <main className="min-h-screen bg-gradient-to-b from-sky-50 via-white to-blue-50 flex items-center justify-center px-4">
        <div className="text-sm text-slate-500">Loading referral…</div>
      </main>
    );
  }

  if (!customer) {
    return (
      <main className="min-h-screen bg-gradient-to-b from-sky-50 via-white to-blue-50 flex items-center justify-center px-4">
        <div className="max-w-md w-full rounded-2xl border border-blue-100 bg-white p-8 text-center space-y-3 shadow-card">
          <img
            src={BAJAJ_LOGO}
            alt="Bajaj"
            className="h-16 w-16 mx-auto rounded-2xl object-contain bg-white p-2 border border-blue-100"
          />
          <h1 className="text-xl font-extrabold text-slate-900">Referral not found</h1>
          <p className="text-sm text-slate-500">
            Code <code className="bg-slate-100 px-1.5 py-0.5 rounded text-xs">{resolvedCode || "—"}</code>{" "}
            is not in this campaign.
          </p>
          <Button asChild variant="outline">
            <Link to="/hy_offers/login">Go to HY Offers</Link>
          </Button>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-gradient-to-b from-sky-50 via-white to-blue-50 text-slate-900 overflow-x-hidden">
      <PrizeCelebration
        open={!!success}
        submission={success}
        promoCode={customer.referralCode}
        onClose={() => setSuccess(null)}
      />

      {/* Light hero */}
      <section className="relative min-h-[68vh] sm:min-h-[74vh] flex flex-col">
        <img
          src={HERO}
          alt="Bajaj Pulsar motorcycles"
          className="absolute inset-0 h-full w-full object-cover object-[55%_center]"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-white/75 via-white/45 to-sky-50" />
        <div
          className="absolute inset-0"
          style={{
            background: `radial-gradient(ellipse at 80% 20%, ${BAJAJ_BLUE}22, transparent 50%)`,
          }}
        />

        <header className="relative z-10 flex items-center justify-between gap-3 px-4 sm:px-6 pt-5 max-w-5xl mx-auto w-full">
          <div className="flex items-center gap-2.5 min-w-0">
            <div className="h-11 w-11 sm:h-12 sm:w-12 rounded-xl bg-white p-1.5 shadow-soft border border-blue-100 shrink-0 flex items-center justify-center">
              <img src={BAJAJ_LOGO} alt="Bajaj" className="h-full w-full object-contain" />
            </div>
            <div className="min-w-0">
              <div
                className="text-[10px] sm:text-xs uppercase tracking-[0.22em] font-semibold"
                style={{ color: BAJAJ_BLUE }}
              >
                Bajaj Pulsar
              </div>
              <div className="text-sm sm:text-base font-bold truncate text-slate-900">Referral Reward</div>
            </div>
          </div>
          <div
            className="shrink-0 rounded-full px-3 py-1.5 text-[10px] sm:text-xs font-bold uppercase tracking-wider text-white shadow-soft"
            style={{ background: BAJAJ_BLUE }}
          >
            {branchInfo.shortLabel}
          </div>
        </header>

        <div className="relative z-10 flex-1 flex flex-col justify-end px-4 sm:px-6 pb-10 sm:pb-14 max-w-5xl mx-auto w-full">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55 }}
            className="max-w-xl space-y-4"
          >
            <div className="inline-flex items-center gap-1.5 rounded-full bg-white/90 border border-blue-100 px-3 py-1 text-[11px] font-semibold uppercase tracking-wider shadow-soft text-slate-700">
              <Sparkles className="h-3.5 w-3.5" style={{ color: BAJAJ_BLUE }} />
              Limited dealer offer
            </div>
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight leading-[1.1] text-slate-900">
              Unlock ₹{OFFER_AMOUNTS.friend}
              <span className="block" style={{ color: BAJAJ_BLUE }}>
                Pulsar cash reward
              </span>
            </h1>
            <p className="text-sm sm:text-base text-slate-600 max-w-md leading-relaxed">
              Invited by <strong className="text-slate-900">{customer.customerName}</strong> via{" "}
              <strong className="text-slate-900">{branchInfo.name}</strong>. Register for a ₹
              {OFFER_AMOUNTS.friend} voucher — redeemable after vehicle purchase.
            </p>
            <div className="flex flex-wrap gap-2 pt-1">
              <span
                className="rounded-lg px-3 py-1.5 text-sm font-extrabold text-white shadow-soft"
                style={{ background: BAJAJ_BLUE }}
              >
                ₹{OFFER_AMOUNTS.friend} voucher
              </span>
              <span className="rounded-lg bg-white border border-blue-100 px-3 py-1.5 text-sm font-medium text-slate-700 inline-flex items-center gap-1.5 shadow-soft">
                <MapPin className="h-3.5 w-3.5" style={{ color: BAJAJ_BLUE }} />
                {branchInfo.name}
              </span>
            </div>
            <div className="rounded-xl border border-amber-200 bg-amber-50 px-3.5 py-2.5 text-xs sm:text-sm text-amber-950 leading-snug shadow-soft">
              <strong className="font-bold">Important:</strong> This ₹{OFFER_AMOUNTS.friend} amount /
              voucher will be claimed only after the user purchases a Bajaj vehicle from the dealer.
            </div>
          </motion.div>
        </div>
      </section>

      <div className="relative max-w-5xl mx-auto px-4 sm:px-6 -mt-6 sm:-mt-8 pb-16 space-y-5 sm:space-y-6">
        <div className="grid lg:grid-cols-2 gap-5 sm:gap-6">
          <motion.section
            className="rounded-2xl border border-blue-100 bg-white p-5 sm:p-6 space-y-4 shadow-card"
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <div className="flex gap-3 items-start">
              <img
                src={DETAIL}
                alt=""
                className="h-20 w-28 sm:h-24 sm:w-32 rounded-xl object-cover shrink-0 border border-blue-100"
              />
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <div className="h-8 w-8 rounded-lg bg-white p-1 shrink-0 flex items-center justify-center border border-blue-100">
                    <img src={BAJAJ_LOGO} alt="" className="h-full w-full object-contain" />
                  </div>
                  <div className="text-[11px] uppercase tracking-wider text-slate-400 font-semibold">
                    Your invite
                  </div>
                </div>
                <h2 className="text-lg sm:text-xl font-extrabold truncate text-slate-900">
                  {customer.customerName}
                </h2>
                <p className="text-xs text-slate-500 mt-0.5">{branchInfo.cityHint}</p>
              </div>
            </div>

            <div className="rounded-xl bg-sky-50/80 border border-blue-100 p-3.5 space-y-2.5">
              <InfoRow icon={<User className="h-4 w-4" />} label="Name" value={customer.customerName} />
              <InfoRow
                icon={<span className="text-[10px] font-bold">IN</span>}
                label="Mobile"
                value={customer.mobileNo}
              />
              <InfoRow icon={<MapPin className="h-4 w-4" />} label="Dealer" value={customer.dealerName} />
              <InfoRow
                icon={<ShieldCheck className="h-4 w-4" />}
                label="Promo"
                value={customer.referralCode}
                mono
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <PrizeTile label="You get" amount={OFFER_AMOUNTS.friend} />
              <PrizeTile label="Friend gets" amount={OFFER_AMOUNTS.referrer} soft />
            </div>

            <div className="flex gap-2">
              <Button
                className="flex-1 text-white border-0 hover:opacity-95"
                style={{ background: BAJAJ_BLUE }}
                onClick={onShare}
              >
                <Share2 className="h-4 w-4" />
                Share
              </Button>
              <Button variant="outline" className="flex-1 border-blue-200" onClick={onCopyLink}>
                <Copy className="h-4 w-4" />
                Copy
              </Button>
            </div>
            <p className="text-[10px] sm:text-[11px] text-slate-400 break-all leading-relaxed">{shareUrl}</p>
          </motion.section>

          <motion.section
            id="claim"
            className="rounded-2xl border border-blue-100 bg-white p-5 sm:p-6 space-y-4 shadow-card"
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.18 }}
          >
            <div>
              <div
                className="inline-flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wider"
                style={{ color: BAJAJ_BLUE }}
              >
                <Gift className="h-3.5 w-3.5" />
                Claim ₹{OFFER_AMOUNTS.friend}
              </div>
              <h2 className="text-xl sm:text-2xl font-extrabold mt-1 tracking-tight text-slate-900">
                Friend claim form
              </h2>
              <p className="text-sm text-slate-500 mt-1">
                Apply promo <strong className="text-slate-800">{customer.referralCode}</strong> to register
                for the reward. The voucher is redeemed only after vehicle purchase.
              </p>
            </div>

            <div className="rounded-xl border border-blue-200 bg-sky-50 px-3.5 py-2.5 text-xs text-slate-700 leading-snug flex gap-2">
              <ShieldCheck className="h-4 w-4 shrink-0 mt-0.5" style={{ color: BAJAJ_BLUE }} />
              <span>
                <strong style={{ color: BAJAJ_BLUE }}>Voucher condition:</strong> ₹
                {OFFER_AMOUNTS.friend} will be claimed / credited once the customer purchases a
                vehicle from <strong>{branchInfo.name}</strong>.
              </span>
            </div>

            <form onSubmit={onSubmit} className="space-y-3.5">
              <div className="space-y-1.5">
                <Label htmlFor="friend-name" className="text-slate-700">
                  Your name
                </Label>
                <Input
                  id="friend-name"
                  required
                  value={friendName}
                  onChange={(e) => setFriendName(e.target.value)}
                  placeholder="Full name"
                  className="h-11 border-blue-100 focus-visible:ring-[#0054A6]/30"
                />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="friend-mobile" className="text-slate-700">
                  Your mobile
                </Label>
                <Input
                  id="friend-mobile"
                  required
                  inputMode="numeric"
                  value={friendMobile}
                  onChange={(e) => setFriendMobile(e.target.value)}
                  placeholder="10-digit mobile"
                  className="h-11 border-blue-100 focus-visible:ring-[#0054A6]/30"
                />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="friend-email" className="text-slate-700">
                  Email (optional)
                </Label>
                <Input
                  id="friend-email"
                  type="email"
                  value={friendEmail}
                  onChange={(e) => setFriendEmail(e.target.value)}
                  placeholder="you@email.com"
                  className="h-11 border-blue-100 focus-visible:ring-[#0054A6]/30"
                />
              </div>
              <Button
                type="submit"
                size="lg"
                className="w-full h-12 text-base font-bold text-white border-0 hover:opacity-95"
                style={{ background: `linear-gradient(135deg, ${BAJAJ_BLUE}, ${BAJAJ_BLUE_DARK})` }}
                disabled={submitting}
              >
                <Gift className="h-4 w-4" />
                {submitting ? "Applying…" : `Apply promo · Get ₹${OFFER_AMOUNTS.friend}`}
              </Button>
            </form>
          </motion.section>
        </div>

        {submissions.length > 0 && (
          <section className="rounded-2xl border border-blue-100 bg-white p-5 space-y-3 shadow-soft">
            <h3 className="text-sm font-bold text-slate-800">Friends who claimed this offer</h3>
            <ul className="space-y-2">
              {submissions.map((s) => (
                <li
                  key={s.id}
                  className="flex items-center justify-between gap-2 text-sm rounded-xl bg-sky-50 border border-blue-100 px-3 py-2.5"
                >
                  <div>
                    <div className="font-medium text-slate-900">{s.friendName}</div>
                    <div className="text-xs text-slate-500">{s.friendMobile}</div>
                  </div>
                  <div className="text-xs font-bold" style={{ color: BAJAJ_BLUE }}>
                    ₹{s.friendOffer}
                  </div>
                </li>
              ))}
            </ul>
          </section>
        )}

        <section className="rounded-2xl overflow-hidden border border-blue-100 bg-white shadow-soft">
          <img
            src={GROUP}
            alt="Bajaj Pulsar bikes at the dealership"
            className="w-full h-40 sm:h-52 md:h-64 object-cover object-center"
          />
          <div className="px-4 py-3 flex items-center gap-2 border-t border-blue-100">
            <img src={BAJAJ_LOGO} alt="" className="h-7 w-7 object-contain" />
            <p className="text-xs sm:text-sm text-slate-600">
              <strong className="text-slate-900">Bajaj Pulsar range</strong> — visit{" "}
              {branchInfo.name} to purchase & claim your ₹{OFFER_AMOUNTS.friend} voucher.
            </p>
          </div>
        </section>

        <footer className="text-center text-[11px] text-slate-400 pt-2 pb-4 space-y-1">
          <p>
            Authorized Bajaj dealer campaign · {branchInfo.name} ({branch})
          </p>
          <p>Powered by Zentroverse</p>
        </footer>
      </div>
    </main>
  );
};

function InfoRow({
  icon,
  label,
  value,
  mono,
}: {
  icon: ReactNode;
  label: string;
  value: string;
  mono?: boolean;
}) {
  return (
    <div className="flex items-center gap-2 text-sm">
      <span
        className="h-7 w-7 rounded-lg bg-white border border-blue-100 flex items-center justify-center shrink-0"
        style={{ color: BAJAJ_BLUE }}
      >
        {icon}
      </span>
      <span className="text-slate-400 w-[4.5rem] shrink-0 text-xs">{label}</span>
      <span
        className={`font-semibold text-slate-900 truncate ${mono ? "font-mono text-xs tracking-wide" : ""}`}
      >
        {value}
      </span>
    </div>
  );
}

function PrizeTile({ label, amount, soft }: { label: string; amount: number; soft?: boolean }) {
  return (
    <div
      className={`rounded-xl border p-3 text-center ${
        soft ? "border-blue-100 bg-sky-50" : "border-transparent text-white"
      }`}
      style={soft ? undefined : { background: `linear-gradient(135deg, ${BAJAJ_BLUE}, ${BAJAJ_BLUE_DARK})` }}
    >
      <div className={`text-[10px] uppercase tracking-wider ${soft ? "text-slate-500" : "text-white/80"}`}>
        {label}
      </div>
      <div className={`text-xl font-extrabold ${soft ? "text-slate-900" : "text-white"}`}>₹{amount}</div>
    </div>
  );
}

export default ReferralLandingPage;
