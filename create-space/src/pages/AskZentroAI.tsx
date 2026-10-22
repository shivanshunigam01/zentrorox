import { useState } from "react";
import { Link } from "react-router-dom";
import { Bot, Loader2, Send, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { WhatsAppButton } from "@/components/WhatsAppButton";
import { SeoHead } from "@/components/seo/SeoHead";
import { AI_KNOWLEDGE } from "@/data/growthHubContent";
import { trackEvent } from "@/lib/analytics";
import { submitGrowthLead } from "@/lib/growthHub/submitToolLead";

type Message = { role: "user" | "assistant"; text: string; products?: string[]; resource?: string };

function matchAnswer(q: string) {
  const lower = q.toLowerCase();
  for (const item of AI_KNOWLEDGE) {
    if (item.keywords.some((k) => lower.includes(k))) return item;
  }
  return {
    keywords: [],
    answer: "Zentroverse helps businesses grow through digital marketing (ZentroADS™), WhatsApp automation (ZentroBOT™), lead management (ZentroFLOW™), ERP/CRM (ZentroOS™), analytics (ZentroSIGHT™), field tracking (ZentroTRACK™) and network expansion consulting. Tell us your industry and goal for tailored guidance.",
    products: ["ZentroFLOW™", "ZentroBOT™", "ZentroADS™"],
    resource: "/growth-hub/tools/business-growth-audit",
  };
}

const AskZentroAI = () => {
  const [messages, setMessages] = useState<Message[]>([
    { role: "assistant", text: "Hi! I'm Zentro AI — your business growth assistant. Ask me about sales, CRM, WhatsApp automation, dealer recruitment, or digital marketing." },
  ]);
  const [input, setInput] = useState("");
  const [gate, setGate] = useState(false);
  const [contact, setContact] = useState({ name: "", phone: "", email: "" });
  const [loading, setLoading] = useState(false);
  const [pendingQ, setPendingQ] = useState("");

  const ask = (question: string) => {
    if (!question.trim()) return;
    setMessages((m) => [...m, { role: "user", text: question }]);
    setInput("");
    setPendingQ(question);
    setGate(true);
  };

  const unlock = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!contact.name || !contact.phone || !contact.email) return;
    setLoading(true);
    const match = matchAnswer(pendingQ);
    await submitGrowthLead({
      name: contact.name,
      phone: contact.phone,
      email: contact.email,
      tool_id: "ask-zentro-ai",
      form_type: "ai-assistant",
      message: `Q: ${pendingQ}\nA: ${match.answer}`,
      product_interest: match.products?.join(", "),
      source: "ask-zentro-ai",
    });
    trackEvent("Lead Form Submitted", { form_type: "ai-assistant" });
    setLoading(false);
    setGate(false);
    setMessages((m) => [
      ...m,
      {
        role: "assistant",
        text: match.answer,
        products: match.products,
        resource: match.resource,
      },
    ]);
  };

  const suggestions = [
    "How can I improve sales?",
    "How can I recruit dealers?",
    "Which CRM should I use?",
    "How can I automate WhatsApp?",
  ];

  return (
    <>
      <SeoHead title="Ask Zentro AI | Business Growth Assistant — Zentroverse" description="AI-powered business guidance on sales, CRM, WhatsApp automation, dealer recruitment and digital marketing." path="/growth-hub/ask-ai" />
      <main className="min-h-screen bg-background flex flex-col">
        <Navbar />
        <section className="flex-1 pt-24 pb-8 md:pt-28">
          <div className="container max-w-2xl">
            <div className="flex items-center gap-3 mb-6">
              <div className="h-12 w-12 rounded-xl bg-primary/10 flex items-center justify-center">
                <Bot className="h-6 w-6 text-primary" />
              </div>
              <div>
                <h1 className="text-2xl font-extrabold">Ask Zentro AI</h1>
                <p className="text-sm text-muted-foreground">Instant business guidance + recommended solutions</p>
              </div>
            </div>

            <div className="rounded-2xl border bg-card shadow-card min-h-[420px] flex flex-col">
              <div className="flex-1 p-4 space-y-4 overflow-y-auto max-h-[50vh]">
                {messages.map((m, i) => (
                  <div key={i} className={`flex ${m.role === "user" ? "justify-end" : "justify-start"}`}>
                    <div className={`max-w-[85%] rounded-2xl px-4 py-3 text-sm ${m.role === "user" ? "bg-primary text-primary-foreground" : "bg-muted"}`}>
                      <p>{m.text}</p>
                      {m.products && (
                        <div className="mt-2 pt-2 border-t border-border/50">
                          <span className="text-xs font-bold">Recommended: </span>
                          {m.products.join(", ")}
                        </div>
                      )}
                      {m.resource && (
                        <Button variant="link" size="sm" className="px-0 h-auto mt-1" asChild>
                          <Link to={m.resource}>Explore tool →</Link>
                        </Button>
                      )}
                    </div>
                  </div>
                ))}
              </div>

              {gate ? (
                <form onSubmit={unlock} className="border-t p-4 space-y-3 bg-muted/30">
                  <p className="text-xs text-muted-foreground flex items-center gap-1"><Sparkles className="h-3 w-3" /> Enter your details to receive the detailed answer and recommendations.</p>
                  <div className="grid sm:grid-cols-3 gap-2">
                    <Input placeholder="Name" value={contact.name} onChange={(e) => setContact((c) => ({ ...c, name: e.target.value }))} required />
                    <Input placeholder="Mobile" value={contact.phone} onChange={(e) => setContact((c) => ({ ...c, phone: e.target.value }))} required />
                    <Input placeholder="Email" type="email" value={contact.email} onChange={(e) => setContact((c) => ({ ...c, email: e.target.value }))} required />
                  </div>
                  <Button type="submit" variant="hero" disabled={loading}>
                    {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : "Get Detailed Answer"}
                  </Button>
                </form>
              ) : (
                <div className="border-t p-4">
                  <div className="flex flex-wrap gap-2 mb-3">
                    {suggestions.map((s) => (
                      <button key={s} type="button" onClick={() => ask(s)} className="text-xs px-3 py-1 rounded-full border hover:bg-muted transition-colors">{s}</button>
                    ))}
                  </div>
                  <form onSubmit={(e) => { e.preventDefault(); ask(input); }} className="flex gap-2">
                    <Input placeholder="Ask about sales, CRM, WhatsApp, dealers..." value={input} onChange={(e) => setInput(e.target.value)} />
                    <Button type="submit" variant="hero" size="icon"><Send className="h-4 w-4" /></Button>
                  </form>
                </div>
              )}
            </div>
          </div>
        </section>
        <Footer />
        <WhatsAppButton />
      </main>
    </>
  );
};

export default AskZentroAI;
