import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  addRemark,
  changeStage,
  completeFollowUp,
  createFollowUp,
  fetchLead,
  LEAD_STAGES,
  verifyLead,
  type ZfLead,
} from "@/lib/zentroflow/api";
import { toast } from "@/hooks/use-toast";

export default function ZentroFlowLeadDetail() {
  const { id } = useParams();
  const [data, setData] = useState<Awaited<ReturnType<typeof fetchLead>> | null>(null);
  const [err, setErr] = useState<string | null>(null);
  const [remark, setRemark] = useState("");
  const [fuDue, setFuDue] = useState("");
  const [tab, setTab] = useState<"overview" | "timeline" | "followups" | "source">("overview");

  const load = () => {
    if (!id) return;
    setErr(null);
    fetchLead(id)
      .then(setData)
      .catch((e) => setErr(e.message));
  };

  useEffect(() => {
    load();
  }, [id]);

  const lead = data?.lead as ZfLead | undefined;

  const onStage = async (stage: string) => {
    if (!id) return;
    try {
      await changeStage(id, stage);
      toast({ title: "Stage updated" });
      load();
    } catch (e) {
      toast({ title: "Failed", description: (e as Error).message, variant: "destructive" });
    }
  };

  const onRemark = async () => {
    if (!id || !remark.trim()) return;
    try {
      await addRemark(id, remark.trim());
      setRemark("");
      toast({ title: "Remark added" });
      load();
    } catch (e) {
      toast({ title: "Failed", description: (e as Error).message, variant: "destructive" });
    }
  };

  const onFollowUp = async () => {
    if (!id || !fuDue) return;
    try {
      await createFollowUp(id, { due_at: new Date(fuDue).toISOString(), type: "call" });
      setFuDue("");
      toast({ title: "Follow-up scheduled" });
      load();
    } catch (e) {
      toast({ title: "Failed", description: (e as Error).message, variant: "destructive" });
    }
  };

  if (err) return <p className="text-red-600 text-sm">{err}</p>;
  if (!lead) return <p className="text-sm text-muted-foreground">Loading…</p>;

  return (
    <div className="space-y-4">
      <Link to="/zentroflow/leads" className="text-sm text-teal-800 hover:underline">
        ← Back to leads
      </Link>

      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h1 className="text-2xl font-extrabold">{lead.name}</h1>
          <p className="text-sm text-muted-foreground font-mono">
            {lead.mobile} · {lead.email || "no email"} · score {lead.lead_score} · {lead.temperature}
          </p>
        </div>
        <div className="flex flex-wrap gap-2 items-center">
          <Select value={lead.current_stage} onValueChange={onStage}>
            <SelectTrigger className="w-44">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {LEAD_STAGES.map((s) => (
                <SelectItem key={s} value={s}>
                  {s}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Button
            variant="outline"
            size="sm"
            onClick={async () => {
              try {
                await verifyLead(lead.id, {
                  verification_status: "verified",
                  qualification_status: "qualified",
                  remark: "Qualified from Lead 360",
                });
                toast({ title: "Marked qualified" });
                load();
              } catch (e) {
                toast({ title: "Failed", description: (e as Error).message, variant: "destructive" });
              }
            }}
          >
            Qualify
          </Button>
        </div>
      </div>

      <div className="flex gap-2 text-sm border-b pb-2">
        {(["overview", "timeline", "followups", "source"] as const).map((t) => (
          <button
            key={t}
            type="button"
            onClick={() => setTab(t)}
            className={`px-3 py-1 rounded ${tab === t ? "bg-slate-900 text-white" : "hover:bg-slate-100"}`}
          >
            {t}
          </button>
        ))}
      </div>

      {tab === "overview" && (
        <div className="grid md:grid-cols-2 gap-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Interest & ownership</CardTitle>
            </CardHeader>
            <CardContent className="text-sm space-y-1">
              <div>Product: {lead.interest?.product || "—"}</div>
              <div>Variant: {lead.interest?.variant || "—"}</div>
              <div>Buyer: {lead.interest?.buyerType || "—"}</div>
              <div>Timeline: {lead.interest?.purchaseTimeline || "—"}</div>
              <div>Verification: {lead.verification_status}</div>
              <div>Qualification: {lead.qualification_status}</div>
              <div>Owner: {lead.assigned_user_id || "unassigned"}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Add remark</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <Textarea value={remark} onChange={(e) => setRemark(e.target.value)} rows={3} />
              <Button size="sm" onClick={onRemark}>
                Save remark
              </Button>
            </CardContent>
          </Card>
        </div>
      )}

      {tab === "timeline" && (
        <div className="space-y-2">
          {(data?.timeline || []).map((a) => (
            <div key={a.id} className="border rounded-lg p-3 text-sm bg-white">
              <div className="flex justify-between text-xs text-muted-foreground">
                <span>
                  {a.type} · {a.channel} · {a.actor_label}
                </span>
                <span>{new Date(a.created_at).toLocaleString()}</span>
              </div>
              <div className="mt-1">{a.content}</div>
            </div>
          ))}
        </div>
      )}

      {tab === "followups" && (
        <div className="space-y-4">
          <Card>
            <CardContent className="p-4 flex flex-wrap gap-2 items-end">
              <div>
                <div className="text-xs mb-1">Due at</div>
                <Input type="datetime-local" value={fuDue} onChange={(e) => setFuDue(e.target.value)} />
              </div>
              <Button size="sm" onClick={onFollowUp}>
                Schedule
              </Button>
            </CardContent>
          </Card>
          {(data?.followups || []).map((f) => (
            <div key={f.id} className="border rounded-lg p-3 text-sm flex justify-between gap-3 bg-white">
              <div>
                <div className="font-medium">
                  {f.type} · {f.status}
                </div>
                <div className="text-xs text-muted-foreground">Due {new Date(f.due_at).toLocaleString()}</div>
                <div>{f.remark || f.outcome}</div>
              </div>
              {f.status !== "done" && (
                <Button
                  size="sm"
                  variant="outline"
                  onClick={async () => {
                    await completeFollowUp(f.id, { outcome: "completed", remark: "Done from portal" });
                    load();
                  }}
                >
                  Complete
                </Button>
              )}
            </div>
          ))}
        </div>
      )}

      {tab === "source" && (
        <Card>
          <CardContent className="p-4 text-sm space-y-1 font-mono">
            {Object.entries(lead.attribution || {}).map(([k, v]) => (
              <div key={k}>
                <span className="text-muted-foreground">{k}:</span> {String(v || "—")}
              </div>
            ))}
          </CardContent>
        </Card>
      )}
    </div>
  );
}
