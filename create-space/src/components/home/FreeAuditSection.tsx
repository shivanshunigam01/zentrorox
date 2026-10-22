import { useState } from "react";
import { z } from "zod";
import { motion } from "framer-motion";
import { ClipboardCheck, Loader2, Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "@/hooks/use-toast";
import { submitLead } from "@/integrations/supabase/client";
import { trackEvent } from "@/lib/analytics";
import { AUDIT_TYPES, BUSINESS_TYPES } from "@/data/homeContent";
import { SectionHeader } from "./SectionHeader";

const schema = z.object({
  name: z.string().trim().min(2).max(120),
  mobile: z.string().trim().min(6).max(20),
  email: z.string().trim().email().max(254),
  company: z.string().trim().max(120).optional().or(z.literal("")),
  business_type: z.string().min(1, "Select business type"),
  audit_type: z.string().min(1, "Select audit type"),
  message: z.string().max(2000).optional().or(z.literal("")),
});

export const FreeAuditSection = () => {
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);
  const [form, setForm] = useState({
    name: "", mobile: "", email: "", company: "", business_type: "", audit_type: "", message: "",
  });

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const parsed = schema.safeParse(form);
    if (!parsed.success) {
      toast({ title: "Please check the form", description: parsed.error.issues[0]?.message, variant: "destructive" });
      return;
    }
    setLoading(true);
    const result = await submitLead({
      name: parsed.data.name,
      phone: parsed.data.mobile,
      email: parsed.data.email,
      company_name: parsed.data.company || null,
      business_type: parsed.data.business_type,
      product_interest: parsed.data.audit_type,
      audit_type: parsed.data.audit_type,
      form_type: "audit",
      message: parsed.data.message || null,
      source: "website-audit",
    });
    setLoading(false);
    if (!result.ok) {
      toast({ title: "Could not submit", description: result.message, variant: "destructive" });
      return;
    }
    trackEvent("Audit Requested", { audit_type: parsed.data.audit_type });
    trackEvent("Lead Form Submitted", { form_type: "audit" });
    setDone(true);
    setForm({ name: "", mobile: "", email: "", company: "", business_type: "", audit_type: "", message: "" });
  };

  return (
    <section id="audit" className="py-16 md:py-24 bg-muted/30">
      <div className="container max-w-4xl">
        <SectionHeader
          eyebrow="Free Audit"
          title="Get a Free Business Growth Audit"
          subtitle="Choose an audit type and our consultants will review your current setup and share actionable recommendations."
        />

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="rounded-2xl border border-border bg-card p-6 md:p-8 shadow-card"
        >
          {done ? (
            <div className="text-center py-8">
              <ClipboardCheck className="h-12 w-12 text-primary mx-auto mb-4" />
              <h3 className="text-xl font-extrabold mb-2">Audit Request Received!</h3>
              <p className="text-muted-foreground">Our team will contact you within 24 hours with next steps.</p>
            </div>
          ) : (
            <form onSubmit={onSubmit} className="grid sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <Label htmlFor="audit-name">Name *</Label>
                <Input id="audit-name" value={form.name} onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))} />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="audit-mobile">Mobile *</Label>
                <Input id="audit-mobile" value={form.mobile} onChange={(e) => setForm((f) => ({ ...f, mobile: e.target.value }))} />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="audit-email">Email *</Label>
                <Input id="audit-email" type="email" value={form.email} onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))} />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="audit-company">Company Name</Label>
                <Input id="audit-company" value={form.company} onChange={(e) => setForm((f) => ({ ...f, company: e.target.value }))} />
              </div>
              <div className="space-y-1.5">
                <Label>Business Type *</Label>
                <Select value={form.business_type} onValueChange={(v) => setForm((f) => ({ ...f, business_type: v }))}>
                  <SelectTrigger><SelectValue placeholder="Select type" /></SelectTrigger>
                  <SelectContent>
                    {BUSINESS_TYPES.map((t) => <SelectItem key={t} value={t}>{t}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-1.5">
                <Label>Audit Type *</Label>
                <Select value={form.audit_type} onValueChange={(v) => setForm((f) => ({ ...f, audit_type: v }))}>
                  <SelectTrigger><SelectValue placeholder="Select audit" /></SelectTrigger>
                  <SelectContent>
                    {AUDIT_TYPES.map((t) => <SelectItem key={t} value={t}>{t}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
              <div className="sm:col-span-2 space-y-1.5">
                <Label htmlFor="audit-msg">Message</Label>
                <Textarea id="audit-msg" rows={3} value={form.message} onChange={(e) => setForm((f) => ({ ...f, message: e.target.value }))} />
              </div>
              <div className="sm:col-span-2">
                <Button type="submit" variant="hero" size="lg" className="w-full sm:w-auto" disabled={loading}>
                  {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
                  Request Free Audit
                </Button>
              </div>
            </form>
          )}
        </motion.div>
      </div>
    </section>
  );
};
