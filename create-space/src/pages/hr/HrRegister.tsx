import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { hrRegister } from "@/lib/hr/api";
import { toast } from "@/hooks/use-toast";
import logo from "@/assets/zentroverse-logo.jpg";

export default function HrRegister() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    organizationName: "",
    name: "",
    email: "",
    password: "",
  });
  const [loading, setLoading] = useState(false);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await hrRegister(form);
      toast({ title: "Organization created" });
      navigate("/hr");
    } catch (err) {
      toast({ title: "Registration failed", description: (err as Error).message, variant: "destructive" });
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
              <CardTitle className="text-lg">Create HR workspace</CardTitle>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <form className="space-y-3" onSubmit={submit}>
            {(
              [
                ["organizationName", "Organization name"],
                ["name", "Your name"],
                ["email", "Work email"],
                ["password", "Password"],
              ] as const
            ).map(([key, label]) => (
              <div key={key} className="space-y-1.5">
                <Label>{label}</Label>
                <Input
                  type={key === "password" ? "password" : key === "email" ? "email" : "text"}
                  value={form[key]}
                  onChange={(e) => setForm({ ...form, [key]: e.target.value })}
                  required
                />
              </div>
            ))}
            <Button className="w-full" disabled={loading}>
              {loading ? "Creating…" : "Create workspace"}
            </Button>
          </form>
          <p className="text-xs text-muted-foreground mt-4">
            Already have an account?{" "}
            <Link className="text-primary underline" to="/hr/login">
              Sign in
            </Link>
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
