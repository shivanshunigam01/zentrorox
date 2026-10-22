import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Loader2, Save, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { getDemoSession } from "@/lib/demoAuth";
import { getAisensyBusinessId, rememberAisensyBusinessId } from "@/lib/aisensyStore";
import {
  getAisensyBusiness,
  updateAisensyBusiness,
} from "@/lib/aisensyApi";

const fieldClass =
  "h-11 rounded-xl border border-border bg-slate-100 text-slate-900 shadow-sm focus-visible:ring-2 focus-visible:ring-ring";

const BusinessSettings = () => {
  const session = getDemoSession();
  const email = session?.email ?? "";
  const [businessId, setBusinessId] = useState<string>(() =>
    email ? getAisensyBusinessId(email) ?? "" : "",
  );
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [profile, setProfile] = useState<any>(null);
  const [displayName, setDisplayName] = useState("");
  const [company, setCompany] = useState("");
  const [contact, setContact] = useState("");

  const load = async (id: string) => {
    if (!id.trim()) {
      toast.error("Enter a business id first.");
      return;
    }
    setLoading(true);
    try {
      const data = await getAisensyBusiness(id.trim());
      const biz = data?.business ?? data;
      setProfile(biz);
      setDisplayName(biz?.display_name ?? "");
      setCompany(biz?.company ?? "");
      setContact(biz?.contact ?? "");
      if (email) rememberAisensyBusinessId(email, id.trim());
      toast.success("Loaded business profile.");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to load business.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (businessId) void load(businessId);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const save = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!businessId.trim()) {
      toast.error("Missing business id.");
      return;
    }
    setSaving(true);
    try {
      const patch: Record<string, string> = {};
      if (displayName.trim()) patch.display_name = displayName.trim();
      if (company.trim()) patch.company = company.trim();
      if (contact.trim()) patch.contact = contact.trim().replace(/[^\d]/g, "");
      const data = await updateAisensyBusiness(businessId.trim(), patch);
      const biz = data?.business ?? data;
      setProfile(biz);
      toast.success("Business details updated.");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Update failed.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <main className="theme-automation min-h-screen bg-background px-4 pb-16 pt-28 text-foreground">
      <div className="mx-auto max-w-2xl space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold">AiSensy Business Settings</h1>
            <p className="text-sm text-muted-foreground">
              View and update your WhatsApp workspace details.
            </p>
          </div>
          <Button variant="outline" asChild><Link to="/automation">Back</Link></Button>
        </div>

        <div className="rounded-2xl border border-border bg-card p-6 space-y-4">
          <div className="space-y-2">
            <Label>Business ID</Label>
            <div className="flex gap-2">
              <Input
                className={fieldClass}
                value={businessId}
                onChange={(e) => setBusinessId(e.target.value)}
                placeholder="AiSensy business id"
              />
              <Button type="button" variant="outline" onClick={() => void load(businessId)} disabled={loading}>
                {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <RefreshCw className="h-4 w-4" />}
                Load
              </Button>
            </div>
          </div>

          <form onSubmit={save} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="display_name">Owner name (display_name)</Label>
              <Input id="display_name" className={fieldClass} value={displayName} onChange={(e) => setDisplayName(e.target.value)} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="company">Company</Label>
              <Input id="company" className={fieldClass} value={company} onChange={(e) => setCompany(e.target.value)} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="contact">Contact (digits, with country code)</Label>
              <Input id="contact" className={fieldClass} value={contact} onChange={(e) => setContact(e.target.value)} placeholder="919876543210" />
            </div>
            <Button type="submit" variant="hero" size="lg" disabled={saving} className="w-full">
              {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
              {saving ? "Saving…" : "Update business"}
            </Button>
          </form>

          {profile ? (
            <details className="rounded-xl bg-muted/40 p-3 text-xs">
              <summary className="cursor-pointer font-semibold">Raw profile JSON</summary>
              <pre className="mt-2 overflow-x-auto whitespace-pre-wrap">{JSON.stringify(profile, null, 2)}</pre>
            </details>
          ) : null}
        </div>
      </div>
    </main>
  );
};

export default BusinessSettings;
