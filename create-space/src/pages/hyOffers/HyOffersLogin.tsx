import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Gift, Lock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "@/hooks/use-toast";
import {
  HY_OFFERS_PASSWORD,
  HY_OFFERS_USER,
  hyOffersLogin,
  isHyOffersAuthed,
} from "@/lib/hyOffers/auth";
import logo from "@/assets/zentroverse-logo.jpg";

const HyOffersLogin = () => {
  const navigate = useNavigate();
  const [userId, setUserId] = useState(HY_OFFERS_USER);
  const [password, setPassword] = useState(HY_OFFERS_PASSWORD);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isHyOffersAuthed()) navigate("/hy_offers", { replace: true });
  }, [navigate]);

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      if (hyOffersLogin(userId, password)) {
        toast({ title: "Welcome", description: "Signed in to HY Offers." });
        navigate("/hy_offers", { replace: true });
      } else {
        toast({ title: "Invalid credentials", variant: "destructive" });
      }
      setLoading(false);
    }, 200);
  };

  return (
    <main className="min-h-screen flex items-center justify-center px-4 bg-gradient-mesh relative overflow-hidden">
      <div
        className="pointer-events-none absolute inset-0 opacity-60"
        style={{
          background:
            "radial-gradient(ellipse at 20% 10%, hsl(197 100% 58% / 0.18), transparent 45%), radial-gradient(ellipse at 80% 90%, hsl(268 75% 52% / 0.12), transparent 40%)",
        }}
      />
      <form
        onSubmit={onSubmit}
        className="relative w-full max-w-md bg-card/95 backdrop-blur border border-border rounded-2xl shadow-card p-8 space-y-5"
      >
        <div className="flex items-center gap-3">
          <img src={logo} alt="" className="h-11 w-11 rounded-xl object-cover shadow-soft" />
          <div>
            <div className="brand-wordmark text-[0.7rem] text-foreground">Zentroverse</div>
            <div className="text-lg font-extrabold leading-tight mt-0.5 flex items-center gap-1.5">
              <Gift className="h-4 w-4 text-primary" />
              HY Offers
            </div>
            <div className="text-xs text-muted-foreground mt-0.5">Sign in with ID &amp; password</div>
          </div>
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="hy-user">User ID</Label>
          <Input
            id="hy-user"
            required
            autoComplete="username"
            value={userId}
            onChange={(e) => setUserId(e.target.value)}
            placeholder="hy_admin"
          />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="hy-pass">Password</Label>
          <Input
            id="hy-pass"
            type="password"
            required
            autoComplete="current-password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>

        <Button type="submit" variant="hero" size="lg" className="w-full" disabled={loading}>
          <Lock className="h-4 w-4" />
          {loading ? "Signing in…" : "Sign in"}
        </Button>

        <div className="text-[11px] text-muted-foreground bg-muted/60 rounded-lg p-3 leading-relaxed">
          <strong>Demo credentials</strong> — ID <code>{HY_OFFERS_USER}</code> / password{" "}
          <code>{HY_OFFERS_PASSWORD}</code>.
          <br />
          Replace with real auth before going live.
        </div>
      </form>
    </main>
  );
};

export default HyOffersLogin;
