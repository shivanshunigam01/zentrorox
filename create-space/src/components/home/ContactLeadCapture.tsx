import { useState } from "react";
import { z } from "zod";
import { motion } from "framer-motion";
import { Calendar, Loader2, MessageCircle, Phone, Send, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { toast } from "@/hooks/use-toast";
import { submitLead } from "@/integrations/supabase/client";
import { trackEvent } from "@/lib/analytics";
import { useSiteContact } from "@/hooks/useSiteContact";
import { telHref, whatsAppHref } from "@/lib/siteContact";
import { SectionHeader } from "./SectionHeader";

const schema = z.object({
  name: z.string().trim().min(2, "Name is too short").max(120),
  mobile: z.string().trim().min(6, "Enter a valid mobile").max(20),
  email: z.string().trim().email("Enter a valid email").max(254),
  company: z.string().trim().max(120).optional().or(z.literal("")),
  requirement: z.string().max(2000).optional().or(z.literal("")),
});

export const ContactLeadCapture = () => {
  const contact = useSiteContact();
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);
  const [form, setForm] = useState({
    name: "", mobile: "", email: "", company: "", requirement: "",
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
      phone: parsed.data.mobile,
      email: parsed.data.email,
      company_name: parsed.data.company || null,
      message: [parsed.data.company && `Company: ${parsed.data.company}`, parsed.data.requirement]
        .filter(Boolean)
        .join("\n\n") || null,
      form_type: "contact",
      source: "website",
    });
    setLoading(false);
    if (!result.ok) {
      toast({
        title: "Could not submit",
        description: result.message,
        variant: "destructive",
      });
      return;
    }
    trackEvent("Lead Form Submitted", { form_type: "contact" });
    setDone(true);
    setForm({ name: "", mobile: "", email: "", company: "", requirement: "" });
  };

  return (
    <section id="contact" className="py-16 md:py-24 lg:py-28 bg-gradient-mesh">
      <div className="container">
        <SectionHeader
          eyebrow="Get Started"
          title="Contact Us"
          subtitle="Tell us what you need — we'll respond within 24 hours."
        />

        <div className="grid lg:grid-cols-5 gap-8 max-w-5xl mx-auto">
          <div className="lg:col-span-2 space-y-4">
            <Button variant="hero" size="lg" className="w-full" asChild>
              <a href="#contact-form"><Calendar /> Book Consultation</a>
            </Button>
            <Button variant="outline-brand" size="lg" className="w-full" asChild>
              <a href="#contact-form"><Send /> Request Demo</a>
            </Button>
            <Button variant="outline" size="lg" className="w-full" asChild>
              <a href={whatsAppHref(contact)} target="_blank" rel="noreferrer">
                <MessageCircle /> Talk to Expert
              </a>
            </Button>
            <Button variant="ghost" size="lg" className="w-full text-muted-foreground" asChild>
              <a href={telHref(contact)}><Phone /> {contact.contactPhone}</a>
            </Button>
            <ul className="pt-4 space-y-2 text-sm text-muted-foreground">
              {["Free consultation", "Tailored demo", "No commitment"].map((t) => (
                <li key={t} className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-primary" />
                  {t}
                </li>
              ))}
            </ul>
          </div>

          <motion.form
            id="contact-form"
            onSubmit={onSubmit}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="lg:col-span-3 rounded-2xl border border-border bg-card p-6 md:p-8 shadow-card space-y-4"
          >
            {done ? (
              <div className="text-center py-10">
                <div className="h-14 w-14 rounded-full bg-primary/10 text-primary flex items-center justify-center mx-auto mb-4">
                  <CheckCircle2 className="h-7 w-7" />
                </div>
                <h3 className="text-xl font-extrabold mb-2">Thank you!</h3>
                <p className="text-muted-foreground text-sm mb-4">
                  We've received your enquiry. Our team will get back to you shortly.
                </p>
                <Button variant="outline" type="button" onClick={() => setDone(false)}>
                  Submit another
                </Button>
              </div>
            ) : (
              <>
                <div className="grid sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <Label htmlFor="name">Name *</Label>
                    <Input id="name" required value={form.name} onChange={(e) => update("name", e.target.value)} placeholder="Your name" />
                  </div>
                  <div className="space-y-1.5">
                    <Label htmlFor="mobile">Mobile *</Label>
                    <Input id="mobile" required value={form.mobile} onChange={(e) => update("mobile", e.target.value)} placeholder="+91 98xxx xxxxx" />
                  </div>
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="email">Email *</Label>
                  <Input id="email" type="email" required value={form.email} onChange={(e) => update("email", e.target.value)} placeholder="you@company.com" />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="company">Company</Label>
                  <Input id="company" value={form.company} onChange={(e) => update("company", e.target.value)} placeholder="Company name" />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="requirement">Requirement</Label>
                  <Textarea
                    id="requirement"
                    rows={4}
                    value={form.requirement}
                    onChange={(e) => update("requirement", e.target.value)}
                    placeholder="Tell us about your business needs…"
                  />
                </div>
                <Button type="submit" variant="hero" size="lg" disabled={loading} className="w-full">
                  {loading ? <Loader2 className="animate-spin" /> : <Send />}
                  {loading ? "Submitting…" : "Submit Enquiry"}
                </Button>
              </>
            )}
          </motion.form>
        </div>
      </div>
    </section>
  );
};
