import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { hrLogin } from "@/lib/hr/api";
import { toast } from "@/hooks/use-toast";
import logo from "@/assets/zentroverse-logo.jpg";

export default function HrLogin() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await hrLogin({ email, password });
      toast({ title: "Welcome back" });
      navigate("/hr");
    } catch (err) {
      toast({ title: "Login failed", description: (err as Error).message, variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-muted/30 p-4">
      <Card className="w-full max-w-md shadow-sm">
        <CardHeader className="space-y-3">
          <div className="flex items-center gap-3">
            <img src={logo} alt="" className="h-10 w-10 rounded object-cover" />
            <div>
              <div className="brand-wordmark text-sm">Zentroverse</div>
              <CardTitle className="text-lg">HR Module Login</CardTitle>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <form className="space-y-3" onSubmit={submit}>
            <div className="space-y-1.5">
              <Label>Email</Label>
              <Input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
            </div>
            <div className="space-y-1.5">
              <Label>Password</Label>
              <Input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
            </div>
            <Button className="w-full" disabled={loading}>
              {loading ? "Signing in…" : "Sign in"}
            </Button>
          </form>
          <p className="text-xs text-muted-foreground mt-4">
            New organization?{" "}
            <Link className="text-primary underline" to="/hr/register">
              Register
            </Link>
            {" · "}
            <Link className="text-primary underline" to="/admin/hr">
              Admin hub
            </Link>
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
