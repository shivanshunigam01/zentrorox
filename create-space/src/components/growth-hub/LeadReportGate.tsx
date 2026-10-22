import { useState } from "react";
import { z } from "zod";
import { Download, FileText, Loader2, Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "@/hooks/use-toast";
import { trackEvent } from "@/lib/analytics";
import type { ToolResult } from "@/lib/growthHub/engine";
import { downloadPdfReport, downloadTextReport } from "@/lib/growthHub/reportDownload";
import { submitGrowthLead } from "@/lib/growthHub/submitToolLead";

const schema = z.object({
  name: z.string().trim().min(2),
  phone: z.string().trim().min(6),
  email: z.string().trim().email(),
});

type Props = {
  toolId: string;
  toolTitle: string;
  cta: string;
  result: ToolResult;
  recommendedProduct?: string;
};

export const LeadReportGate = ({ toolId, toolTitle, cta, result, recommendedProduct }: Props) => {
  const [form, setForm] = useState({ name: "", phone: "", email: "" });
  const [loading, setLoading] = useState(false);
  const [unlocked, setUnlocked] = useState(false);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    const parsed = schema.safeParse(form);
    if (!parsed.success) {
      toast({ title: "Enter valid contact details", variant: "destructive" });
      return;
    }
    setLoading(true);
    const res = await submitGrowthLead({
      name: parsed.data.name,
      phone: parsed.data.phone,
      email: parsed.data.email,
      tool_id: toolId,
      score: result.score,
      report_summary: result.summary,
      report_data: result,
      product_interest: recommendedProduct ?? toolTitle,
      source: `growth-hub-${toolId}`,
      form_type: "growth-tool",
    });
    setLoading(false);
    if (!res.ok) {
      toast({ title: "Could not submit", description: res.message, variant: "destructive" });
      return;
    }
    trackEvent("Calculator Completed", { tool_id: toolId, score: result.score });
    trackEvent("Lead Form Submitted", { form_type: "growth-tool", tool_id: toolId });
    if (toolId.includes("audit")) trackEvent("Audit Requested", { tool_id: toolId });
    setUnlocked(true);
    toast({ title: "Report unlocked!", description: "Download your report below. Our team will follow up within 24 hours." });
  };

  const contact = unlocked ? form : undefined;

  return (
    <div className="rounded-2xl border border-border bg-card p-6 shadow-card">
      <h3 className="text-lg font-extrabold mb-1">{unlocked ? "Your Report is Ready" : cta}</h3>
      <p className="text-sm text-muted-foreground mb-4">
        {unlocked
          ? "Download your report. A Zentroverse consultant will share a detailed roadmap on call."
          : "Submit your details to receive the full report and personalized recommendations."}
      </p>

      {!unlocked ? (
        <form onSubmit={submit} className="grid sm:grid-cols-3 gap-3">
          <div className="space-y-1.5">
            <Label>Name *</Label>
            <Input value={form.name} onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))} required />
          </div>
          <div className="space-y-1.5">
            <Label>Mobile *</Label>
            <Input value={form.phone} onChange={(e) => setForm((f) => ({ ...f, phone: e.target.value }))} required />
          </div>
          <div className="space-y-1.5">
            <Label>Email *</Label>
            <Input type="email" value={form.email} onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))} required />
          </div>
          <div className="sm:col-span-3">
            <Button type="submit" variant="hero" className="w-full sm:w-auto" disabled={loading}>
              {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
              {cta}
            </Button>
          </div>
        </form>
      ) : (
        <div className="flex flex-wrap gap-3">
          <Button variant="hero" onClick={() => downloadPdfReport(toolTitle, result, contact)}>
            <FileText className="h-4 w-4" /> Download PDF Report
          </Button>
          <Button variant="outline" onClick={() => { downloadTextReport(toolTitle, result, contact); trackEvent("Brochure Downloaded", { tool_id: toolId }); }}>
            <Download className="h-4 w-4" /> Download Text Report
          </Button>
          <Button variant="outline-brand" asChild>
            <a href="/#contact">Schedule Consultation</a>
          </Button>
        </div>
      )}
    </div>
  );
};
