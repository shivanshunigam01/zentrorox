import { useState } from "react";
import { z } from "zod";
import { motion } from "framer-motion";
import { Loader2, Send, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import { toast } from "@/hooks/use-toast";
import { submitLead } from "@/integrations/supabase/client";
import { ZENTRO_PRODUCTS } from "@/data/zentroProducts";

const schema = z.object({
  name: z.string().trim().min(2, "Name is too short").max(120),
  phone: z.string().trim().min(6, "Enter a valid phone").max(20),
  email: z.string().trim().email("Enter a valid email").max(254),
  city: z.string().trim().max(80).optional().or(z.literal("")),
  business_type: z.string().max(80).optional().or(z.literal("")),
  product_interest: z.string().max(80).optional().or(z.literal("")),
  message: z.string().max(2000).optional().or(z.literal("")),
});

const businessTypes = [
  "Dealer", "OEM", "Fleet Owner", "Finance Company", "Insurance Company", "Other",
];

export const EnquiryForm = () => {
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);
  const [form, setForm] = useState({
    name: "", phone: "", email: "", city: "",
    business_type: "", product_interest: "", message: "",
  });

  const update = (k: string, v: string) => setForm((f) => ({ ...f, [k]: v }));

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const parsed = schema.safeParse(form);
    if (!parsed.success) {
      toast({
        title: "Please check the form",
        description: parsed.error.issues[0]?.message ?? "Invalid input",
        variant: "destructive",
      });
      return;
    }
    setLoading(true);
    const result = await submitLead({
      name: parsed.data.name,
      phone: parsed.data.phone,
      email: parsed.data.email,
      city: parsed.data.city || null,
      business_type: parsed.data.business_type || null,
      product_interest: parsed.data.product_interest || null,
      message: parsed.data.message || null,
      source: "website",
    });
    setLoading(false);
    if (!result.ok) {
      toast({ title: "Could not submit", description: result.message, variant: "destructive" });
      return;
    }
    setDone(true);
    setForm({ name: "", phone: "", email: "", city: "", business_type: "", product_interest: "", message: "" });
  };

  return (
    <section id="enquiry" className="py-16 md:py-24 lg:py-32 bg-gradient-mesh">
      <div className="container">
        <div className="grid md:grid-cols-2 gap-10 md:gap-12 items-start max-w-6xl mx-auto">
          <div>
            <div className="text-xs uppercase tracking-widest text-primary font-bold mb-3">Get in touch</div>
            <h2 className="text-3xl md:text-5xl font-extrabold mb-4">
              Tell us about your <span className="gradient-brand-text">business</span>
            </h2>
            <p className="text-muted-foreground text-lg mb-6">
              Share a few details and our team will reach out within 24 hours with a personalized walkthrough.
            </p>
            <ul className="space-y-3 text-sm">
              {["Free consultation", "Tailored ecosystem demo", "No commitment", "Dedicated success manager"].map((t) => (
                <li key={t} className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-primary" />
                  {t}
                </li>
              ))}
            </ul>
          </div>

          <motion.form
            onSubmit={onSubmit}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="rounded-2xl border border-border bg-card p-6 md:p-8 shadow-card space-y-4"
          >
            {done ? (
              <div className="text-center py-12">
                <div className="h-14 w-14 rounded-full bg-primary/10 text-primary flex items-center justify-center mx-auto mb-4">
                  <CheckCircle2 className="h-7 w-7" />
                </div>
                <h3 className="text-xl font-extrabold mb-2">Thank you!</h3>
                <p className="text-muted-foreground text-sm mb-4">
                  We've received your enquiry. Our team will get back to you shortly.
                </p>
                <Button variant="outline" onClick={() => setDone(false)}>Submit another</Button>
              </div>
            ) : (
              <>
                <div className="grid sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <Label htmlFor="name">Full Name *</Label>
                    <Input id="name" required value={form.name} onChange={(e) => update("name", e.target.value)} placeholder="Rajesh Kumar" />
                  </div>
                  <div className="space-y-1.5">
                    <Label htmlFor="phone">Phone *</Label>
                    <Input id="phone" required value={form.phone} onChange={(e) => update("phone", e.target.value)} placeholder="+91 98xxx xxxxx" />
                  </div>
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="email">Email *</Label>
                  <Input id="email" type="email" required value={form.email} onChange={(e) => update("email", e.target.value)} placeholder="you@company.com" />
                </div>
                <div className="grid sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <Label htmlFor="city">City</Label>
                    <Input id="city" value={form.city} onChange={(e) => update("city", e.target.value)} placeholder="Mumbai" />
                  </div>
                  <div className="space-y-1.5">
                    <Label htmlFor="business_type">Business Type</Label>
                    <Select value={form.business_type} onValueChange={(v) => update("business_type", v)}>
                      <SelectTrigger><SelectValue placeholder="Select" /></SelectTrigger>
                      <SelectContent>
                        {businessTypes.map((t) => <SelectItem key={t} value={t}>{t}</SelectItem>)}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="product_interest">Product of interest</Label>
                  <Select value={form.product_interest} onValueChange={(v) => update("product_interest", v)}>
                    <SelectTrigger><SelectValue placeholder="Optional — pick a product" /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Ecosystem (multiple)">Entire Zentroverse Ecosystem</SelectItem>
                      {ZENTRO_PRODUCTS.map((p) => <SelectItem key={p.key} value={p.name}>{p.name}</SelectItem>)}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="message">Message</Label>
                  <Textarea id="message" rows={4} value={form.message} onChange={(e) => update("message", e.target.value)} placeholder="Tell us a bit about your business and what you're looking for…" />
                </div>
                <Button type="submit" variant="hero" size="lg" disabled={loading} className="w-full">
                  {loading ? <Loader2 className="animate-spin" /> : <Send />}
                  {loading ? "Submitting…" : "Submit Enquiry"}
                </Button>
                <p className="text-[11px] text-muted-foreground text-center">
                  By submitting, you agree to be contacted by the Zentroverse team.
                </p>
              </>
            )}
          </motion.form>
        </div>
      </div>
    </section>
  );
};
