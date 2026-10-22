import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { fetchCompanySettings, saveCompanySettings } from "@/lib/admin/crmApi";
import { seedSettings } from "@/lib/admin/seed";
import type { CompanySettings } from "@/lib/admin/types";
import logoFallback from "@/assets/zentroverse-logo.jpg";
import { notifyContactUpdated } from "@/lib/siteContact";
import { toast } from "@/hooks/use-toast";
import { Skeleton } from "@/components/ui/skeleton";

const AdminSettings = () => {
  const [s, setS] = useState<CompanySettings | null>(null);

  useEffect(() => {
    fetchCompanySettings().then(setS).catch(() => setS(seedSettings));
  }, []);

  const set = <K extends keyof CompanySettings>(k: K, v: CompanySettings[K]) =>
    setS((p) => (p ? { ...p, [k]: v } : p));

  const onLogo = (file: File) => {
    const reader = new FileReader();
    reader.onload = () => set("logoDataUrl", String(reader.result));
    reader.readAsDataURL(file);
  };

  const save = async () => {
    if (!s) return;
    try {
      const saved = await saveCompanySettings(s);
      setS(saved);
      notifyContactUpdated();
      toast({ title: "Settings saved" });
    } catch (e) {
      toast({ title: "Failed", description: (e as Error).message, variant: "destructive" });
    }
  };

  if (!s) {
    return <div className="space-y-3">{Array.from({ length: 3 }).map((_, i) => <Skeleton key={i} className="h-24 w-full" />)}</div>;
  }

  return (
    <div className="space-y-5 max-w-3xl">
      <div>
        <h1 className="text-2xl md:text-3xl font-extrabold">Company Settings</h1>
        <p className="text-sm text-muted-foreground">
          Used on quotations, invoices and receipts. Leave logo empty to use the default Zentroverse logo on PDFs.
        </p>
      </div>

      <Card>
        <CardHeader><CardTitle className="text-base">Logo</CardTitle></CardHeader>
        <CardContent className="flex items-center gap-4">
          <img src={s.logoDataUrl || logoFallback} alt="" className="h-16 w-16 rounded-lg object-contain bg-muted p-1" />
          <div className="flex gap-2">
            <label className="inline-flex items-center px-3 py-2 rounded-lg border text-sm cursor-pointer hover:bg-muted">
              Upload new
              <input type="file" accept="image/*" className="hidden" onChange={(e) => e.target.files?.[0] && onLogo(e.target.files[0])} />
            </label>
            {s.logoDataUrl && <Button variant="ghost" onClick={() => set("logoDataUrl", "")}>Reset</Button>}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader><CardTitle className="text-base">Business details</CardTitle></CardHeader>
        <CardContent className="grid sm:grid-cols-2 gap-3">
          <Field label="Company name"><Input value={s.name} onChange={(e) => set("name", e.target.value)} /></Field>
          <Field label="GSTIN"><Input value={s.gstin} onChange={(e) => set("gstin", e.target.value)} /></Field>
          <Field label="Phone"><Input value={s.phone} onChange={(e) => set("phone", e.target.value)} /></Field>
          <Field label="Email"><Input value={s.email} onChange={(e) => set("email", e.target.value)} /></Field>
          <Field label="Default GST %"><Input type="number" value={s.defaultGstPercent} onChange={(e) => set("defaultGstPercent", Number(e.target.value))} /></Field>
          <Field label="Address" full><Textarea rows={2} value={s.address} onChange={(e) => set("address", e.target.value)} /></Field>
          <Field label="Bank details" full><Textarea rows={2} value={s.bankDetails} onChange={(e) => set("bankDetails", e.target.value)} /></Field>
          <Field label="Footer note" full><Input value={s.footerNote} onChange={(e) => set("footerNote", e.target.value)} /></Field>
        </CardContent>
      </Card>

      <Button onClick={save} size="lg">Save settings</Button>
    </div>
  );
};

const Field = ({ label, children, full }: { label: string; children: React.ReactNode; full?: boolean }) => (
  <div className={`space-y-1.5 ${full ? "sm:col-span-2" : ""}`}>
    <Label>{label}</Label>
    {children}
  </div>
);

export default AdminSettings;
