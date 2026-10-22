import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
  CASE_STUDY_FINDER, DIGITAL_MATURITY_AREAS, FLAGSHIP_AUDIT_CATEGORIES, getGrowthTool,
} from "@/data/growthHubContent";
import {
  automotiveFinder, customerEngagement, dealerNetworkPotential,
  digitalMaturityScore, flagshipBusinessAudit, franchiseExpansion, marketingBudget,
  msmeFinder, salesProductivity, socialMediaAudit, websiteAudit, yesNoScore, type ToolResult,
} from "@/lib/growthHub/engine";
import { CategoryBarChart, ScoreRing } from "./ScoreRing";
import { LeadReportGate } from "./LeadReportGate";

// WhatsApp / CRM readiness use yesNoScore wrapper
function whatsappReadiness(answers: boolean[]) {
  return yesNoScore(answers, [
    "WhatsApp Business app in use", "WhatsApp API integrated", "Chatbot deployed",
    "Leads captured automatically", "Follow-ups automated",
  ], "ZentroBOT™");
}
function crmReadiness(answers: boolean[]) {
  return yesNoScore(answers, [
    "Leads tracked in system", "Lead ownership assigned", "Conversion rates measured", "Follow-ups automated",
  ], "ZentroFLOW™");
}

type Props = { toolId: string };

export const GrowthHubToolRunner = ({ toolId }: Props) => {
  const tool = getGrowthTool(toolId);
  const [result, setResult] = useState<ToolResult | null>(null);

  // Digital maturity state
  const [maturity, setMaturity] = useState<Record<string, number>>(
    Object.fromEntries(DIGITAL_MATURITY_AREAS.map((a) => [a, 2])),
  );

  // Flagship audit
  const [auditAnswers, setAuditAnswers] = useState<Record<string, number>>({});

  // Generic inputs
  const [dealer, setDealer] = useState({ state: "Bihar", district: "Patna", population: 6000000, existingDealers: 4, targetShare: 15 });
  const [social, setSocial] = useState({ fb: "", ig: "", Branding: 3, Engagement: 3, "Posting Frequency": 2, "Reels Usage": 2, "Response Time": 2, Advertising: 2 });
  const [waFlags, setWaFlags] = useState([false, false, false, false, false]);
  const [crmFlags, setCrmFlags] = useState([false, false, false, false]);
  const [franchise, setFranchise] = useState({ revenue: 50000000, cities: 3, investment: 2000000, teamStrength: 3 });
  const [webScores, setWebScores] = useState<Record<string, number>>({ "SEO Readiness": 2, "Mobile Friendliness": 3, "Speed Score": 2, "Lead Generation": 2, "Trust Score": 3 });
  const [engagement, setEngagement] = useState({ monthly: 500, repeat: 120, responseMins: 45, rating: 4 });
  const [sales, setSales] = useState({ executives: 10, dailyVisits: 5, conversion: 12, workingDays: 22 });
  const [budget, setBudget] = useState({ industry: "Automotive", revenue: 100000000, growthTarget: 20 });
  const [webUrl, setWebUrl] = useState("");
  const [autoType, setAutoType] = useState("Dealer");
  const [msmePriority, setMsmePriority] = useState("Operations");
  const [csIndustry, setCsIndustry] = useState("");
  const [csProblem, setCsProblem] = useState("");
  const [csObjective, setCsObjective] = useState("");

  const run = () => {
    let r: ToolResult;
    switch (toolId) {
      case "digital-maturity": r = digitalMaturityScore(maturity); break;
      case "dealer-network-potential": r = dealerNetworkPotential(dealer); break;
      case "social-media-audit": r = socialMediaAudit(social); break;
      case "whatsapp-readiness": r = whatsappReadiness(waFlags); break;
      case "crm-readiness": r = crmReadiness(crmFlags); break;
      case "franchise-expansion": r = franchiseExpansion(franchise); break;
      case "website-audit": r = websiteAudit(webScores); break;
      case "customer-engagement": r = customerEngagement(engagement); break;
      case "sales-productivity": r = salesProductivity(sales); break;
      case "marketing-budget": r = marketingBudget(budget); break;
      case "business-growth-audit": r = flagshipBusinessAudit(auditAnswers); break;
      case "automotive-finder": r = automotiveFinder(autoType); break;
      case "msme-finder": r = msmeFinder(msmePriority); break;
      case "case-study-finder": {
        const match = CASE_STUDY_FINDER.find(
          (c) => (!csIndustry || c.industry === csIndustry) && (!csProblem || c.problem === csProblem) && (!csObjective || c.objective === csObjective),
        ) ?? CASE_STUDY_FINDER[0];
        r = { score: 90, summary: match.title, strengths: [match.outcome], weaknesses: [], recommendations: [`View case study: ${match.title}`, "Book consultation for similar results"], details: { href: match.href } };
        break;
      }
      default: return;
    }
    setResult(r);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const caseMatch = useMemo(() => {
    if (toolId !== "case-study-finder" || !result) return null;
    return CASE_STUDY_FINDER.find((c) => c.title === result.summary) ?? CASE_STUDY_FINDER[0];
  }, [toolId, result]);

  if (!tool) return <p className="text-center py-20">Tool not found.</p>;

  if (result) {
    return (
      <div className="space-y-8">
        <Button variant="ghost" size="sm" onClick={() => setResult(null)}><ArrowLeft className="h-4 w-4" /> Run again</Button>
        <div className="grid md:grid-cols-2 gap-8 items-start">
          <div className="flex flex-col items-center md:items-start gap-4">
            <ScoreRing score={result.score} label={tool.title} />
            <p className="text-lg font-semibold text-center md:text-left">{result.summary}</p>
          </div>
          <div className="space-y-4">
            {result.categoryScores && <CategoryBarChart items={result.categoryScores} />}
            {result.strengths.length > 0 && (
              <div>
                <h4 className="font-bold text-sm mb-2 text-emerald-600">Strengths</h4>
                <ul className="space-y-1">{result.strengths.map((s) => <li key={s} className="text-sm flex gap-2"><CheckCircle2 className="h-4 w-4 text-emerald-500 shrink-0" />{s}</li>)}</ul>
              </div>
            )}
            {result.weaknesses.length > 0 && (
              <div>
                <h4 className="font-bold text-sm mb-2 text-amber-600">Areas to Improve</h4>
                <ul className="space-y-1">{result.weaknesses.map((w) => <li key={w} className="text-sm text-muted-foreground">• {w}</li>)}</ul>
              </div>
            )}
            <div>
              <h4 className="font-bold text-sm mb-2">Recommendations</h4>
              <ul className="space-y-1">{result.recommendations.map((r) => <li key={r} className="text-sm">• {r}</li>)}</ul>
            </div>
          </div>
        </div>
        {caseMatch && (
          <div className="rounded-xl border bg-gradient-to-br from-primary/10 to-brand-purple/10 p-6">
            <h3 className="font-extrabold text-xl mb-2">{caseMatch.title}</h3>
            <p className="text-muted-foreground mb-4">{caseMatch.outcome}</p>
            <Button variant="hero" asChild><Link to={caseMatch.href}>View Full Case Study</Link></Button>
          </div>
        )}
        <LeadReportGate toolId={toolId} toolTitle={tool.title} cta={tool.cta} result={result} recommendedProduct={tool.recommendedProduct} />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <p className="text-muted-foreground">{tool.description}</p>

      {toolId === "digital-maturity" && DIGITAL_MATURITY_AREAS.map((area) => (
        <div key={area} className="space-y-2">
          <div className="flex justify-between text-sm"><Label>{area}</Label><span className="text-muted-foreground">{maturity[area]}/5</span></div>
          <Slider value={[maturity[area]]} min={1} max={5} step={1} onValueChange={([v]) => setMaturity((m) => ({ ...m, [area]: v }))} />
        </div>
      ))}

      {toolId === "business-growth-audit" && (
        <div className="space-y-8">
          {FLAGSHIP_AUDIT_CATEGORIES.map((cat, ci) => (
            <div key={cat.id}>
              <h3 className="font-bold mb-4">{ci + 1}. {cat.label}</h3>
              {cat.questions.map((q, qi) => (
                <div key={q} className="mb-4 space-y-2">
                  <Label className="text-sm">{q}</Label>
                  <Slider
                    value={[auditAnswers[`${cat.id}-${qi}`] ?? 2]}
                    min={1} max={5} step={1}
                    onValueChange={([v]) => setAuditAnswers((a) => ({ ...a, [`${cat.id}-${qi}`]: v }))}
                  />
                </div>
              ))}
            </div>
          ))}
        </div>
      )}

      {toolId === "dealer-network-potential" && (
        <div className="grid sm:grid-cols-2 gap-4">
          <div><Label>State</Label><Input value={dealer.state} onChange={(e) => setDealer((d) => ({ ...d, state: e.target.value }))} /></div>
          <div><Label>District</Label><Input value={dealer.district} onChange={(e) => setDealer((d) => ({ ...d, district: e.target.value }))} /></div>
          <div><Label>Population</Label><Input type="number" value={dealer.population} onChange={(e) => setDealer((d) => ({ ...d, population: +e.target.value }))} /></div>
          <div><Label>Existing Dealers</Label><Input type="number" value={dealer.existingDealers} onChange={(e) => setDealer((d) => ({ ...d, existingDealers: +e.target.value }))} /></div>
          <div><Label>Target Market Share %</Label><Input type="number" value={dealer.targetShare} onChange={(e) => setDealer((d) => ({ ...d, targetShare: +e.target.value }))} /></div>
        </div>
      )}

      {toolId === "social-media-audit" && (
        <>
          <div className="grid sm:grid-cols-2 gap-4">
            <div><Label>Facebook URL</Label><Input placeholder="https://facebook.com/..." value={social.fb} onChange={(e) => setSocial((s) => ({ ...s, fb: e.target.value }))} /></div>
            <div><Label>Instagram URL</Label><Input placeholder="https://instagram.com/..." value={social.ig} onChange={(e) => setSocial((s) => ({ ...s, ig: e.target.value }))} /></div>
          </div>
          {(["Branding", "Engagement", "Posting Frequency", "Reels Usage", "Response Time", "Advertising"] as const).map((k) => (
            <div key={k} className="space-y-2">
              <div className="flex justify-between text-sm"><Label>{k}</Label><span>{social[k]}/5</span></div>
              <Slider value={[social[k]]} min={1} max={5} step={1} onValueChange={([v]) => setSocial((s) => ({ ...s, [k]: v }))} />
            </div>
          ))}
        </>
      )}

      {toolId === "whatsapp-readiness" && ["Use WhatsApp Business?", "Use WhatsApp API?", "Have a chatbot?", "Capture leads automatically?", "Automate follow-ups?"].map((q, i) => (
        <div key={q} className="flex items-center justify-between rounded-lg border p-4">
          <Label>{q}</Label>
          <Switch checked={waFlags[i]} onCheckedChange={(c) => setWaFlags((f) => f.map((v, j) => (j === i ? c : v)))} />
        </div>
      ))}

      {toolId === "crm-readiness" && ["Track leads?", "Assign ownership?", "Measure conversion?", "Automate follow-ups?"].map((q, i) => (
        <div key={q} className="flex items-center justify-between rounded-lg border p-4">
          <Label>{q}</Label>
          <Switch checked={crmFlags[i]} onCheckedChange={(c) => setCrmFlags((f) => f.map((v, j) => (j === i ? c : v)))} />
        </div>
      ))}

      {toolId === "franchise-expansion" && (
        <div className="grid sm:grid-cols-2 gap-4">
          <div><Label>Current Revenue (₹)</Label><Input type="number" value={franchise.revenue} onChange={(e) => setFranchise((f) => ({ ...f, revenue: +e.target.value }))} /></div>
          <div><Label>Target Cities</Label><Input type="number" value={franchise.cities} onChange={(e) => setFranchise((f) => ({ ...f, cities: +e.target.value }))} /></div>
          <div><Label>Investment Capacity (₹)</Label><Input type="number" value={franchise.investment} onChange={(e) => setFranchise((f) => ({ ...f, investment: +e.target.value }))} /></div>
          <div><Label>Support Team Strength (1-5)</Label><Input type="number" min={1} max={5} value={franchise.teamStrength} onChange={(e) => setFranchise((f) => ({ ...f, teamStrength: +e.target.value }))} /></div>
        </div>
      )}

      {toolId === "website-audit" && (
        <>
          <div><Label>Website URL</Label><Input placeholder="https://yoursite.com" value={webUrl} onChange={(e) => setWebUrl(e.target.value)} /></div>
          {Object.keys(webScores).map((k) => (
            <div key={k} className="space-y-2">
              <div className="flex justify-between text-sm"><Label>{k}</Label><span>{webScores[k]}/5</span></div>
              <Slider value={[webScores[k]]} min={1} max={5} step={1} onValueChange={([v]) => setWebScores((s) => ({ ...s, [k]: v }))} />
            </div>
          ))}
        </>
      )}

      {toolId === "customer-engagement" && (
        <div className="grid sm:grid-cols-2 gap-4">
          <div><Label>Monthly Customers</Label><Input type="number" value={engagement.monthly} onChange={(e) => setEngagement((x) => ({ ...x, monthly: +e.target.value }))} /></div>
          <div><Label>Repeat Customers</Label><Input type="number" value={engagement.repeat} onChange={(e) => setEngagement((x) => ({ ...x, repeat: +e.target.value }))} /></div>
          <div><Label>Avg Response Time (mins)</Label><Input type="number" value={engagement.responseMins} onChange={(e) => setEngagement((x) => ({ ...x, responseMins: +e.target.value }))} /></div>
          <div><Label>Review Rating (1-5)</Label><Input type="number" min={1} max={5} value={engagement.rating} onChange={(e) => setEngagement((x) => ({ ...x, rating: +e.target.value }))} /></div>
        </div>
      )}

      {toolId === "sales-productivity" && (
        <div className="grid sm:grid-cols-2 gap-4">
          <div><Label>Sales Executives</Label><Input type="number" value={sales.executives} onChange={(e) => setSales((s) => ({ ...s, executives: +e.target.value }))} /></div>
          <div><Label>Daily Visits (avg)</Label><Input type="number" value={sales.dailyVisits} onChange={(e) => setSales((s) => ({ ...s, dailyVisits: +e.target.value }))} /></div>
          <div><Label>Conversion Rate %</Label><Input type="number" value={sales.conversion} onChange={(e) => setSales((s) => ({ ...s, conversion: +e.target.value }))} /></div>
          <div><Label>Working Days/Month</Label><Input type="number" value={sales.workingDays} onChange={(e) => setSales((s) => ({ ...s, workingDays: +e.target.value }))} /></div>
        </div>
      )}

      {toolId === "marketing-budget" && (
        <div className="grid sm:grid-cols-2 gap-4">
          <div><Label>Industry</Label>
            <Select value={budget.industry} onValueChange={(v) => setBudget((b) => ({ ...b, industry: v }))}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>{["Automotive", "Retail", "Manufacturing", "MSME", "Healthcare"].map((i) => <SelectItem key={i} value={i}>{i}</SelectItem>)}</SelectContent>
            </Select>
          </div>
          <div><Label>Annual Revenue (₹)</Label><Input type="number" value={budget.revenue} onChange={(e) => setBudget((b) => ({ ...b, revenue: +e.target.value }))} /></div>
          <div><Label>Growth Target %</Label><Input type="number" value={budget.growthTarget} onChange={(e) => setBudget((b) => ({ ...b, growthTarget: +e.target.value }))} /></div>
        </div>
      )}

      {toolId === "automotive-finder" && (
        <RadioGroup value={autoType} onValueChange={setAutoType} className="space-y-3">
          {["Dealer", "OEM", "Service Center", "Used Vehicle Business"].map((t) => (
            <div key={t} className="flex items-center gap-2 border rounded-lg p-4">
              <RadioGroupItem value={t} id={t} /><Label htmlFor={t}>{t}</Label>
            </div>
          ))}
        </RadioGroup>
      )}

      {toolId === "msme-finder" && (
        <Select value={msmePriority} onValueChange={setMsmePriority}>
          <SelectTrigger><SelectValue placeholder="Primary priority" /></SelectTrigger>
          <SelectContent>
            {["Operations", "Marketing", "Analytics", "Expansion"].map((p) => <SelectItem key={p} value={p}>{p}</SelectItem>)}
          </SelectContent>
        </Select>
      )}

      {toolId === "case-study-finder" && (
        <div className="grid gap-4">
          <div><Label>Industry</Label>
            <Select value={csIndustry} onValueChange={setCsIndustry}>
              <SelectTrigger><SelectValue placeholder="Select industry" /></SelectTrigger>
              <SelectContent>{[...new Set(CASE_STUDY_FINDER.map((c) => c.industry))].map((i) => <SelectItem key={i} value={i}>{i}</SelectItem>)}</SelectContent>
            </Select>
          </div>
          <div><Label>Problem</Label>
            <Select value={csProblem} onValueChange={setCsProblem}>
              <SelectTrigger><SelectValue placeholder="Select problem" /></SelectTrigger>
              <SelectContent>{[...new Set(CASE_STUDY_FINDER.map((c) => c.problem))].map((p) => <SelectItem key={p} value={p}>{p}</SelectItem>)}</SelectContent>
            </Select>
          </div>
          <div><Label>Objective</Label>
            <Select value={csObjective} onValueChange={setCsObjective}>
              <SelectTrigger><SelectValue placeholder="Select objective" /></SelectTrigger>
              <SelectContent>{[...new Set(CASE_STUDY_FINDER.map((c) => c.objective))].map((o) => <SelectItem key={o} value={o}>{o}</SelectItem>)}</SelectContent>
            </Select>
          </div>
        </div>
      )}

      <Button variant="hero" size="lg" onClick={run} className="w-full sm:w-auto">
        {toolId === "business-growth-audit" ? "Generate Growth Intelligence Report" : "Calculate Score"}
      </Button>
    </div>
  );
};
