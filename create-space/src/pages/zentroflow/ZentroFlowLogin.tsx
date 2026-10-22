import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { zfLogin } from "@/lib/zentroflow/auth";
import { SeoHead } from "@/components/seo/SeoHead";

export default function ZentroFlowLogin() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("flow@zentroverse.in");
  const [password, setPassword] = useState("ZentroFlow@2026");
  const [err, setErr] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErr(null);
    const res = await zfLogin(email, password);
    setLoading(false);
    if (!res.ok) {
      setErr(res.message);
      return;
    }
    navigate("/zentroflow", { replace: true });
  };

  return (
    <>
      <SeoHead title="ZentroFlow Login" description="Client portal login" path="/zentroflow/login" noindex />
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-slate-800 to-teal-900 p-4">
        <form onSubmit={submit} className="w-full max-w-md bg-white rounded-2xl shadow-xl p-8 space-y-5">
          <div>
            <div className="text-xs uppercase tracking-widest text-teal-700 font-semibold">Zentroverse</div>
            <h1 className="text-2xl font-extrabold mt-1">ZentroFlow</h1>
            <p className="text-sm text-muted-foreground mt-1">Multi-tenant lead CRM portal</p>
          </div>
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
          </div>
          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <Input id="password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
          </div>
          {err && <p className="text-sm text-red-600">{err}</p>}
          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? "Signing in…" : "Sign in"}
          </Button>
        </form>
      </div>
    </>
  );
}
