import { useState } from "react";
import { z } from "zod";
import { Loader2, Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { toast } from "@/hooks/use-toast";
import { submitLead } from "@/integrations/supabase/client";
import { trackEvent } from "@/lib/analytics";

const schema = z.object({
  name: z.string().trim().min(2),
  phone: z.string().trim().min(6),
  email: z.string().trim().email(),
  message: z.string().max(2000).optional(),
});

type Props = {
  productInterest: string;
  source?: string;
  compact?: boolean;
};

export const SolutionLeadForm = ({ productInterest, source = "solution-page", compact }: Props) => {
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);
  const [form, setForm] = useState({ name: "", phone: "", email: "", message: "" });

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const parsed = schema.safeParse(form);
    if (!parsed.success) {
      toast({ title: "Please check the form", variant: "destructive" });
      return;
    }
    setLoading(true);
    const result = await submitLead({
      name: parsed.data.name,
      phone: parsed.data.phone,
      email: parsed.data.email,
      product_interest: productInterest,
      message: parsed.data.message || null,
      form_type: "solution",
      source,
    });
    setLoading(false);
    if (!result.ok) {
      toast({ title: "Could not submit", description: result.message, variant: "destructive" });
      return;
    }
    trackEvent("Lead Form Submitted", { form_type: "solution", product: productInterest });
    trackEvent("Demo Requested", { product: productInterest });
    setDone(true);
    setForm({ name: "", phone: "", email: "", message: "" });
  };

  if (done) {
    return (
      <div className="rounded-xl bg-primary/10 border border-primary/20 p-6 text-center">
        <p className="font-bold text-primary">Thank you! We'll contact you within 24 hours.</p>
      </div>
    );
  }

  return (
    <form onSubmit={onSubmit} className={`grid gap-3 ${compact ? "sm:grid-cols-2" : ""}`}>
      <div className="space-y-1.5">
        <Label>Name *</Label>
        <Input value={form.name} onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))} required />
      </div>
      <div className="space-y-1.5">
        <Label>Mobile *</Label>
        <Input value={form.phone} onChange={(e) => setForm((f) => ({ ...f, phone: e.target.value }))} required />
      </div>
      <div className={`space-y-1.5 ${compact ? "sm:col-span-2" : ""}`}>
        <Label>Email *</Label>
        <Input type="email" value={form.email} onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))} required />
      </div>
      {!compact && (
        <div className="space-y-1.5">
          <Label>Message</Label>
          <Textarea rows={3} value={form.message} onChange={(e) => setForm((f) => ({ ...f, message: e.target.value }))} />
        </div>
      )}
      <div className={compact ? "sm:col-span-2" : ""}>
        <Button type="submit" variant="hero" className="w-full" disabled={loading}>
          {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
          Request Consultation
        </Button>
      </div>
    </form>
  );
};
