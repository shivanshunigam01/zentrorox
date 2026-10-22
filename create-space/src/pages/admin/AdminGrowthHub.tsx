import { useEffect, useMemo, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Textarea } from "@/components/ui/textarea";
import { RefreshCw, Save } from "lucide-react";
import { fetchLeads, updateLead, type Lead, type LeadStatus } from "@/lib/admin/leadsApi";
import { GROWTH_TOOLS } from "@/data/growthHubContent";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "@/hooks/use-toast";

const GROWTH_FORM_TYPES = new Set(["growth-tool", "ai-assistant", "calculator", "audit"]);
const STATUSES: LeadStatus[] = ["new", "contacted", "qualified", "won", "lost"];

const AdminGrowthHub = () => {
  const [leads, setLeads] = useState<Lead[] | null>(null);
  const [err, setErr] = useState<string | null>(null);
  const [open, setOpen] = useState<Lead | null>(null);

  const load = () => {
    setLeads(null);
    setErr(null);
    fetchLeads().then(setLeads).catch((e) => setErr(e.message));
  };
  useEffect(() => { load(); }, []);

  const growthLeads = useMemo(
    () => (leads ?? []).filter(
      (l) => GROWTH_FORM_TYPES.has(l.form_type ?? "") || l.tool_id || l.source?.startsWith("growth-hub"),
    ),
    [leads],
  );

  const byTool = useMemo(() => {
    const m: Record<string, number> = {};
    growthLeads.forEach((l) => {
      const k = l.tool_id ?? l.form_type ?? "other";
      m[k] = (m[k] ?? 0) + 1;
    });
    return m;
  }, [growthLeads]);

  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-2xl md:text-3xl font-extrabold">Growth Hub Intelligence</h1>
          <p className="text-sm text-muted-foreground">Assessment results, calculator submissions, audit requests and AI assistant leads.</p>
        </div>
        <Button variant="outline" size="sm" onClick={load}><RefreshCw className="h-4 w-4" /> Refresh</Button>
      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card><CardContent className="p-4"><div className="text-2xl font-extrabold">{growthLeads.length}</div><div className="text-xs text-muted-foreground">Total submissions</div></CardContent></Card>
        {GROWTH_TOOLS.slice(0, 3).map((t) => (
          <Card key={t.id}><CardContent className="p-4"><div className="text-2xl font-extrabold">{byTool[t.id] ?? 0}</div><div className="text-xs text-muted-foreground truncate">{t.title}</div></CardContent></Card>
        ))}
      </div>

      {err && <Card><CardContent className="p-4 text-destructive text-sm">{err}</CardContent></Card>}

      <Card>
        <CardContent className="p-0 overflow-x-auto">
          {leads === null ? (
            <div className="p-4 space-y-2">{Array.from({ length: 5 }).map((_, i) => <Skeleton key={i} className="h-12 w-full" />)}</div>
          ) : (
            <table className="w-full text-sm">
              <thead className="bg-muted/50 text-left">
                <tr>
                  {["Name", "Contact", "Tool", "Score", "Summary", "Date"].map((h) => (
                    <th key={h} className="px-4 py-3 text-xs font-semibold uppercase text-muted-foreground">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {growthLeads.map((l) => (
                  <tr key={l.id} className="border-t hover:bg-muted/30 cursor-pointer" onClick={() => setOpen(l)}>
                    <td className="px-4 py-3 font-medium">{l.name}</td>
                    <td className="px-4 py-3 text-xs"><div>{l.email}</div><div className="text-muted-foreground">{l.phone}</div></td>
                    <td className="px-4 py-3 text-xs">{l.tool_id ?? l.form_type ?? "—"}</td>
                    <td className="px-4 py-3 font-bold">{l.score != null ? `${l.score}/100` : "—"}</td>
                    <td className="px-4 py-3 text-xs max-w-[200px] truncate" title={l.report_summary ?? undefined}>{l.report_summary ?? l.message ?? "—"}</td>
                    <td className="px-4 py-3 text-xs text-muted-foreground">{new Date(l.created_at).toLocaleString()}</td>
                  </tr>
                ))}
                {growthLeads.length === 0 && (
                  <tr><td colSpan={6} className="px-4 py-10 text-center text-muted-foreground">No Growth Hub submissions yet.</td></tr>
                )}
              </tbody>
            </table>
          )}
        </CardContent>
      </Card>

      <Sheet open={!!open} onOpenChange={(v) => !v && setOpen(null)}>
        <SheetContent className="overflow-y-auto">
          {open && (
            <>
              <SheetHeader><SheetTitle>{open.name}</SheetTitle></SheetHeader>
              <div className="mt-4 space-y-4 text-sm">
                <p>{open.email} · {open.phone}</p>
                <p className="text-muted-foreground">{open.report_summary ?? open.message}</p>
                <div className="space-y-1.5">
                  <Label>Status</Label>
                  <Select
                    value={open.status}
                    onValueChange={async (v) => {
                      try {
                        const upd = await updateLead(open.id, { status: v as LeadStatus });
                        setLeads((ls) => ls?.map((x) => x.id === open.id ? upd : x) ?? null);
                        setOpen(upd);
                        toast({ title: "Status updated" });
                      } catch (e) {
                        toast({ title: "Failed", description: (e as Error).message, variant: "destructive" });
                      }
                    }}
                  >
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>{STATUSES.map((s) => <SelectItem key={s} value={s}>{s}</SelectItem>)}</SelectContent>
                  </Select>
                </div>
                <NotesEditor lead={open} onSave={async (notes) => {
                  const upd = await updateLead(open.id, { admin_notes: notes });
                  setLeads((ls) => ls?.map((x) => x.id === open.id ? upd : x) ?? null);
                  setOpen(upd);
                  toast({ title: "Notes saved" });
                }} />
              </div>
            </>
          )}
        </SheetContent>
      </Sheet>
    </div>
  );
};

const NotesEditor = ({ lead, onSave }: { lead: Lead; onSave: (n: string) => Promise<void> }) => {
  const [notes, setNotes] = useState(lead.admin_notes ?? "");
  return (
    <div className="space-y-1.5">
      <Label>Admin notes</Label>
      <Textarea value={notes} onChange={(e) => setNotes(e.target.value)} rows={4} />
      <Button size="sm" onClick={() => onSave(notes)}><Save className="h-4 w-4" /> Save notes</Button>
    </div>
  );
};

export default AdminGrowthHub;
