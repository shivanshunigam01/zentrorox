import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "@/hooks/use-toast";
import { adminLoginApi } from "@/lib/admin/auth";
import { ShieldCheck } from "lucide-react";
import logo from "@/assets/zentroverse-logo.jpg";

const AdminLogin = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const result = await adminLoginApi(email, password);
    setLoading(false);
    if (result.ok) {
      toast({ title: "Welcome back", description: "Signed in to admin panel." });
      navigate("/admin", { replace: true });
    } else {
      toast({ title: "Invalid credentials", description: result.message, variant: "destructive" });
    }
  };

  return (
    <main className="min-h-screen flex items-center justify-center px-4 bg-gradient-mesh">
      <form onSubmit={onSubmit} className="w-full max-w-md bg-card border border-border rounded-2xl shadow-card p-8 space-y-5">
        <div className="flex items-center gap-3">
          <img src={logo} alt="" className="h-10 w-10 rounded-lg object-cover" />
          <div>
            <div className="text-lg font-extrabold leading-none">Zentroverse Admin</div>
            <div className="text-xs text-muted-foreground mt-0.5">Command center sign in</div>
          </div>
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="email">Email</Label>
          <Input id="email" type="email" required value={email} onChange={(e) => setEmail(e.target.value)} placeholder="admin@zentroverse.in" />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="password">Password</Label>
          <Input id="password" type="password" required value={password} onChange={(e) => setPassword(e.target.value)} />
        </div>
        <Button type="submit" variant="hero" size="lg" className="w-full" disabled={loading}>
          <ShieldCheck className="h-4 w-4" />
          {loading ? "Signing in…" : "Sign in"}
        </Button>
      </form>
    </main>
  );
};

export default AdminLogin;
