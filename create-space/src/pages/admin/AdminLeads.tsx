import { useEffect, useMemo, useState, type ReactNode } from "react";
import { Link } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { FileSpreadsheet, FileText, RefreshCw, Save, Search, Trash2 } from "lucide-react";
import { deleteLead, fetchLeads, updateLead, type Lead, type LeadStatus } from "@/lib/admin/leadsApi";
import { exportListToPdf, exportToExcel } from "@/lib/admin/exporters";
import { toast } from "@/hooks/use-toast";
import { Skeleton } from "@/components/ui/skeleton";

const STATUSES: LeadStatus[] = ["new", "contacted", "qualified", "won", "lost"];
const statusColor: Record<LeadStatus, string> = {
  new: "bg-blue-100 text-blue-700",
  contacted: "bg-yellow-100 text-yellow-800",
  qualified: "bg-purple-100 text-purple-700",
  won: "bg-green-100 text-green-700",
  lost: "bg-red-100 text-red-700",
};

const AdminLeads = () => {
  const [leads, setLeads] = useState<Lead[] | null>(null);
  const [err, setErr] = useState<string | null>(null);
  const [q, setQ] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [bizFilter, setBizFilter] = useState<string>("all");
  const [formFilter, setFormFilter] = useState<string>("all");
  const [open, setOpen] = useState<Lead | null>(null);

  const load = () => {
    setLeads(null); setErr(null);
    fetchLeads().then(setLeads).catch((e) => setErr(e.message));
  };
  useEffect(() => { load(); }, []);

  const businessTypes = useMemo(() => Array.from(new Set((leads ?? []).map((l) => l.business_type).filter(Boolean))) as string[], [leads]);

  const filtered = useMemo(() => {
    if (!leads) return [];
    const s = q.toLowerCase();
    return leads.filter((l) => {
      if (statusFilter !== "all" && l.status !== statusFilter) return false;
      if (bizFilter !== "all" && l.business_type !== bizFilter) return false;
      if (formFilter !== "all" && (l.form_type ?? "contact") !== formFilter) return false;
      if (!s) return true;
      return [l.name, l.email, l.phone, l.city, l.product_interest, l.message, l.source, l.report_summary].some((v) =>
        v?.toLowerCase().includes(s),
      );
    });
  }, [leads, q, statusFilter, bizFilter, formFilter]);

  const parseBajajAsd = (lead: Lead) => {
    if (!lead.report_data) return null;
    try {
      return JSON.parse(lead.report_data) as Record<string, string | number | boolean | null>;
    } catch {
      return null;
    }
  };

  const rows = filtered.map((l) => ({
    Name: l.name, Phone: l.phone, Email: l.email, City: l.city ?? "", Business: l.business_type ?? "",
    Interest: l.product_interest ?? "", Status: l.status, Created: new Date(l.created_at).toLocaleString(),
  }));

  const setStatus = async (lead: Lead, status: LeadStatus) => {
    try {
      const upd = await updateLead(lead.id, { status });
      setLeads((ls) => ls?.map((l) => l.id === lead.id ? upd : l) ?? null);
      if (open?.id === lead.id) setOpen(upd);
      toast({ title: "Status updated" });
    } catch (e) { toast({ title: "Failed", description: (e as Error).message, variant: "destructive" }); }
  };

  const saveNotes = async (lead: Lead, admin_notes: string) => {
    try {
      const upd = await updateLead(lead.id, { admin_notes });
      setLeads((ls) => ls?.map((l) => l.id === lead.id ? upd : l) ?? null);
      setOpen(upd);
      toast({ title: "Notes saved" });
    } catch (e) { toast({ title: "Failed", description: (e as Error).message, variant: "destructive" }); }
  };

  const remove = async (lead: Lead) => {
    try {
      await deleteLead(lead.id);
      setLeads((ls) => ls?.filter((l) => l.id !== lead.id) ?? null);
      setOpen(null);
      toast({ title: "Lead deleted" });
    } catch (e) { toast({ title: "Failed", description: (e as Error).message, variant: "destructive" }); }
  };

  return (
    <div className="space-y-5">
      <div className="flex items-start justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-2xl md:text-3xl font-extrabold">Enquiries</h1>
          <p className="text-sm text-muted-foreground">Enquiries submitted from the website.</p>
        </div>
        <div className="flex gap-2 flex-wrap">
          <Button variant="outline" size="sm" onClick={load}><RefreshCw className="h-4 w-4" /> Refresh</Button>
          <Button variant="outline" size="sm" onClick={() => exportToExcel(rows, "zentroverse-leads")}>
            <FileSpreadsheet className="h-4 w-4" /> Excel
          </Button>
          <Button variant="outline" size="sm" onClick={() => exportListToPdf("Leads", Object.keys(rows[0] ?? { Name: "" }), rows.map((r) => Object.values(r) as (string | number)[]), "zentroverse-leads")}>
            <FileText className="h-4 w-4" /> PDF
          </Button>
        </div>
      </div>

      <Card>
        <CardContent className="p-4 grid sm:grid-cols-2 lg:grid-cols-5 gap-3">
          <div className="relative">
            <Search className="h-4 w-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
            <Input placeholder="Search name, email, phone…" value={q} onChange={(e) => setQ(e.target.value)} className="pl-9" />
          </div>
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger><SelectValue placeholder="Status" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All statuses</SelectItem>
              {STATUSES.map((s) => <SelectItem key={s} value={s}>{s}</SelectItem>)}
            </SelectContent>
          </Select>
          <Select value={formFilter} onValueChange={setFormFilter}>
            <SelectTrigger><SelectValue placeholder="Form type" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All forms</SelectItem>
              <SelectItem value="contact">Contact</SelectItem>
              <SelectItem value="bajaj_asd">Bajaj ASD</SelectItem>
            </SelectContent>
          </Select>
          <Select value={bizFilter} onValueChange={setBizFilter}>
            <SelectTrigger><SelectValue placeholder="Business type" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All business types</SelectItem>
              {businessTypes.map((b) => <SelectItem key={b} value={b}>{b}</SelectItem>)}
            </SelectContent>
          </Select>
          <div className="text-sm text-muted-foreground self-center">
            Showing <strong>{filtered.length}</strong> of {leads?.length ?? 0}
          </div>
        </CardContent>
      </Card>

      {err && <Card><CardContent className="p-4 text-sm text-destructive">{err}</CardContent></Card>}

      <Card>
        <CardContent className="p-0 overflow-x-auto">
          {leads === null ? (
            <div className="p-4 space-y-2">{Array.from({ length: 5 }).map((_, i) => <Skeleton key={i} className="h-12 w-full" />)}</div>
          ) : (
            <table className="w-full text-sm hidden md:table">
              <thead className="bg-muted/50 text-left">
                <tr>
                  {["Name", "Contact", "Type", "Enquiry", "City", "Business", "Status", "Date", ""].map((h) => (
                    <th key={h} className="px-4 py-3 font-semibold text-xs uppercase tracking-wide text-muted-foreground">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filtered.map((l) => (
                  <tr key={l.id} className="border-t hover:bg-muted/30">
                    <td className="px-4 py-3 font-medium">{l.name}</td>
                    <td className="px-4 py-3"><div className="text-xs">{l.email}</div><div className="text-xs text-muted-foreground">{l.phone}</div></td>
                    <td className="px-4 py-3 text-xs">
                      <span className="font-semibold capitalize">{l.form_type ?? "contact"}</span>
                      {l.audit_type && <div className="text-muted-foreground">{l.audit_type}</div>}
                      {l.calculator_type && <div className="text-muted-foreground">{l.calculator_type}</div>}
                    </td>
                    <td className="px-4 py-3 text-xs max-w-[200px]">
                      <div className="truncate text-muted-foreground" title={l.message ?? undefined}>
                        {l.message?.split("\n")[0] ?? l.product_interest ?? "—"}
                      </div>
                      {l.form_type === "bajaj_asd" && l.score != null && (
                        <div className="text-[10px] font-bold text-[#0054A6] mt-0.5">Score {l.score}</div>
                      )}
                      {l.source && <div className="text-[10px] uppercase tracking-wide text-muted-foreground/80 mt-0.5">{l.source}</div>}
                    </td>
                    <td className="px-4 py-3 text-xs">{l.city ?? "—"}</td>
                    <td className="px-4 py-3 text-xs">{l.business_type ?? "—"}</td>
                    <td className="px-4 py-3"><span className={`text-[10px] font-bold px-2 py-1 rounded uppercase ${statusColor[l.status]}`}>{l.status}</span></td>
                    <td className="px-4 py-3 text-xs text-muted-foreground">{new Date(l.created_at).toLocaleDateString()}</td>
                    <td className="px-4 py-3"><Button size="sm" variant="outline" onClick={() => setOpen(l)}>Manage</Button></td>
                  </tr>
                ))}
                {filtered.length === 0 && <tr><td colSpan={9} className="px-4 py-10 text-center text-muted-foreground">No leads found.</td></tr>}
              </tbody>
            </table>
          )}

          {/* Mobile cards */}
          <div className="md:hidden divide-y">
            {filtered.map((l) => (
              <button key={l.id} onClick={() => setOpen(l)} className="w-full text-left p-4 hover:bg-muted/30">
                <div className="flex justify-between items-start gap-3">
                  <div className="min-w-0">
                    <div className="font-semibold truncate">{l.name}</div>
                    <div className="text-xs text-muted-foreground truncate">{l.email} • {l.phone}</div>
                    <div className="text-xs text-muted-foreground truncate mt-1">{l.message?.split("\n")[0] ?? l.product_interest ?? "—"}</div>
                  </div>
                  <span className={`text-[10px] font-bold px-2 py-1 rounded uppercase shrink-0 ${statusColor[l.status]}`}>{l.status}</span>
                </div>
              </button>
            ))}
          </div>
        </CardContent>
      </Card>

      <Sheet open={!!open} onOpenChange={(v) => !v && setOpen(null)}>
        <SheetContent className="w-full sm:max-w-lg overflow-y-auto">
          {open && (
            <>
              <SheetHeader><SheetTitle>{open.name}</SheetTitle></SheetHeader>
              <div className="space-y-4 mt-4 text-sm">
                <Detail label="Email" value={open.email} />
                <Detail label="Phone" value={open.phone} />
                <Detail label="City" value={open.city ?? "—"} />
                <Detail label="Business Type" value={open.business_type ?? "—"} />
                <Detail label="Form Type" value={open.form_type ?? "contact"} />
                {open.audit_type && <Detail label="Audit Type" value={open.audit_type} />}
                {open.calculator_type && <Detail label="Calculator" value={open.calculator_type} />}
                {open.company_name && <Detail label="Company" value={open.company_name} />}
                <Detail label="Product Interest" value={open.product_interest ?? "—"} />
                <Detail label="Source" value={open.source ?? "website"} />
                <Detail label="Created" value={new Date(open.created_at).toLocaleString()} />
                {open.report_summary && <Detail label="Summary" value={open.report_summary} />}
                {open.score != null && <Detail label="Lead Score" value={String(open.score)} />}
                {open.form_type === "bajaj_asd" && parseBajajAsd(open) && (
                  <div className="space-y-2">
                    <Label className="text-xs uppercase text-muted-foreground">Bajaj ASD Application</Label>
                    <div className="bg-muted/40 p-3 rounded-lg space-y-1 text-xs">
                      {[
                        ["ASD Location", parseBajajAsd(open)?.target_location_label],
                        ["Investment", parseBajajAsd(open)?.investment_capacity],
                        ["Space", parseBajajAsd(open)?.space_status],
                        ["Timeline", parseBajajAsd(open)?.start_timeline],
                        ["Existing OEM", parseBajajAsd(open)?.existing_oem],
                      ].map(([label, val]) =>
                        val ? (
                          <div key={String(label)} className="flex justify-between gap-2">
                            <span className="text-muted-foreground">{label}</span>
                            <span className="font-medium text-right">{String(val)}</span>
                          </div>
                        ) : null,
                      )}
                    </div>
                    <Button size="sm" variant="outline" asChild>
                      <Link to="/admin/bajaj-asd">View full application in Bajaj ASD →</Link>
                    </Button>
                  </div>
                )}
                {open.message && (
                  <div>
                    <Label className="text-xs uppercase text-muted-foreground">Message</Label>
                    <p className="mt-1 text-sm whitespace-pre-wrap bg-muted/40 p-3 rounded-lg">{open.message}</p>
                  </div>
                )}
                <div className="space-y-1.5">
                  <Label>Status</Label>
                  <Select value={open.status} onValueChange={(v) => setStatus(open, v as LeadStatus)}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>{STATUSES.map((s) => <SelectItem key={s} value={s}>{s}</SelectItem>)}</SelectContent>
                  </Select>
                </div>
                <NotesEditor lead={open} onSave={saveNotes} />
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button variant="destructive" className="w-full"><Trash2 className="h-4 w-4" /> Delete lead</Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>Delete this lead?</AlertDialogTitle>
                      <AlertDialogDescription>This cannot be undone.</AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Cancel</AlertDialogCancel>
                      <AlertDialogAction onClick={() => remove(open)}>Delete</AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </div>
            </>
          )}
        </SheetContent>
      </Sheet>
    </div>
  );
};

const Detail = ({ label, value }: { label: string; value: string }) => (
  <div className="flex justify-between gap-3 border-b pb-2">
    <span className="text-xs uppercase text-muted-foreground">{label}</span>
    <span className="text-sm font-medium text-right break-all">{value}</span>
  </div>
);

const NotesEditor = ({ lead, onSave }: { lead: Lead; onSave: (lead: Lead, notes: string) => void }) => {
  const [notes, setNotes] = useState(lead.admin_notes ?? "");
  useEffect(() => setNotes(lead.admin_notes ?? ""), [lead.id]);
  return (
    <div className="space-y-1.5">
      <Label>Admin notes</Label>
      <Textarea rows={4} value={notes} onChange={(e) => setNotes(e.target.value)} placeholder="Internal notes…" />
      <Button size="sm" onClick={() => onSave(lead, notes)}><Save className="h-4 w-4" /> Save notes</Button>
    </div>
  );
};

export default AdminLeads;
