import { useEffect, useMemo, useState, type ReactNode } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { FileSpreadsheet, FileText, RefreshCw, Save, Search } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "@/hooks/use-toast";
import { exportListToPdf, exportToExcel } from "@/lib/admin/exporters";
import {
  fetchBajajAsdApplications,
  updateBajajAsdApplication,
  type BajajAsdApplicationRecord,
} from "@/lib/admin/bajajAsdApi";
import type { LeadStatus } from "@/lib/admin/leadsApi";

const STATUSES: LeadStatus[] = ["new", "contacted", "qualified", "won", "lost"];
const statusColor: Record<LeadStatus, string> = {
  new: "bg-blue-100 text-blue-700",
  contacted: "bg-yellow-100 text-yellow-800",
  qualified: "bg-purple-100 text-purple-700",
  won: "bg-green-100 text-green-700",
  lost: "bg-red-100 text-red-700",
};

const AdminBajajAsd = () => {
  const [apps, setApps] = useState<BajajAsdApplicationRecord[] | null>(null);
  const [err, setErr] = useState<string | null>(null);
  const [q, setQ] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [stateFilter, setStateFilter] = useState<string>("all");
  const [open, setOpen] = useState<BajajAsdApplicationRecord | null>(null);

  const load = () => {
    setApps(null);
    setErr(null);
    fetchBajajAsdApplications().then(setApps).catch((e) => setErr(e.message));
  };

  useEffect(() => {
    load();
  }, []);

  const filtered = useMemo(() => {
    if (!apps) return [];
    const s = q.toLowerCase();
    return apps.filter((a) => {
      if (statusFilter !== "all" && a.status !== statusFilter) return false;
      if (stateFilter !== "all" && a.state !== stateFilter) return false;
      if (!s) return true;
      return [
        a.applicant_name,
        a.mobile,
        a.email,
        a.district,
        a.districts?.join(" "),
        a.current_town,
        a.target_location_label,
        a.business_type,
      ].some((v) => v?.toLowerCase().includes(s));
    });
  }, [apps, q, statusFilter, stateFilter]);

  const rows = filtered.map((a) => ({
    Name: a.applicant_name,
    Mobile: a.mobile,
    Email: a.email,
    Location: a.target_location_label,
    Districts: a.districts?.join(", ") ?? a.district,
    Locations: a.locations?.length ?? 0,
    State: a.state,
    PAN: a.pan,
    GST: a.gst_number,
    Investment: a.investment_capacity,
    Score: a.lead_score,
    Status: a.status,
    Submitted: new Date(a.submitted_at).toLocaleString(),
  }));

  const setStatus = async (app: BajajAsdApplicationRecord, status: LeadStatus) => {
    try {
      const upd = await updateBajajAsdApplication(app.id, { status });
      setApps((list) => list?.map((a) => (a.id === app.id ? upd : a)) ?? null);
      if (open?.id === app.id) setOpen(upd);
      toast({ title: "Status updated" });
    } catch (e) {
      toast({ title: "Failed", description: (e as Error).message, variant: "destructive" });
    }
  };

  const saveNotes = async (app: BajajAsdApplicationRecord, admin_notes: string) => {
    try {
      const upd = await updateBajajAsdApplication(app.id, { admin_notes });
      setApps((list) => list?.map((a) => (a.id === app.id ? upd : a)) ?? null);
      setOpen(upd);
      toast({ title: "Notes saved" });
    } catch (e) {
      toast({ title: "Failed", description: (e as Error).message, variant: "destructive" });
    }
  };

  return (
    <div className="space-y-5">
      <div className="flex items-start justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-2xl md:text-3xl font-extrabold">Bajaj ASD Applications</h1>
          <p className="text-sm text-muted-foreground">
            Dealer applications submitted from the <code className="text-xs">/bajaj_asd</code> landing page.
          </p>
        </div>
        <div className="flex gap-2 flex-wrap">
          <Button variant="outline" size="sm" onClick={load}>
            <RefreshCw className="h-4 w-4" /> Refresh
          </Button>
          <Button variant="outline" size="sm" onClick={() => exportToExcel(rows, "bajaj-asd-applications")}>
            <FileSpreadsheet className="h-4 w-4" /> Excel
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() =>
              exportListToPdf(
                "Bajaj ASD Applications",
                Object.keys(rows[0] ?? { Name: "" }),
                rows.map((r) => Object.values(r) as (string | number)[]),
                "bajaj-asd-applications",
              )
            }
          >
            <FileText className="h-4 w-4" /> PDF
          </Button>
        </div>
      </div>

      <Card>
        <CardContent className="p-4 grid sm:grid-cols-2 lg:grid-cols-4 gap-3">
          <div className="relative">
            <Search className="h-4 w-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Search name, mobile, district…"
              value={q}
              onChange={(e) => setQ(e.target.value)}
              className="pl-9"
            />
          </div>
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger>
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All statuses</SelectItem>
              {STATUSES.map((s) => (
                <SelectItem key={s} value={s}>
                  {s}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select value={stateFilter} onValueChange={setStateFilter}>
            <SelectTrigger>
              <SelectValue placeholder="State" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All states</SelectItem>
              <SelectItem value="Bihar">Bihar</SelectItem>
              <SelectItem value="Jharkhand">Jharkhand</SelectItem>
            </SelectContent>
          </Select>
          <div className="text-sm text-muted-foreground self-center">
            Showing <strong>{filtered.length}</strong> of {apps?.length ?? 0}
          </div>
        </CardContent>
      </Card>

      {err && (
        <Card>
          <CardContent className="p-4 text-sm text-destructive">{err}</CardContent>
        </Card>
      )}

      <Card>
        <CardContent className="p-0 overflow-x-auto">
          {apps === null ? (
            <div className="p-4 space-y-2">
              {Array.from({ length: 5 }).map((_, i) => (
                <Skeleton key={i} className="h-12 w-full" />
              ))}
            </div>
          ) : (
            <table className="w-full text-sm hidden md:table">
              <thead className="bg-muted/50 text-left">
                <tr>
                  {["Applicant", "Contact", "Location", "Business", "Investment", "Score", "Status", "Date", ""].map(
                    (h) => (
                      <th
                        key={h}
                        className="px-4 py-3 font-semibold text-xs uppercase tracking-wide text-muted-foreground"
                      >
                        {h}
                      </th>
                    ),
                  )}
                </tr>
              </thead>
              <tbody>
                {filtered.map((a) => (
                  <tr key={a.id} className="border-t hover:bg-muted/30">
                    <td className="px-4 py-3 font-medium">{a.applicant_name}</td>
                    <td className="px-4 py-3">
                      <div className="text-xs">{a.mobile}</div>
                      {a.email && <div className="text-xs text-muted-foreground">{a.email}</div>}
                    </td>
                    <td className="px-4 py-3 text-xs">
                      <div className="font-medium">{a.target_location_label}</div>
                      <div className="text-muted-foreground">
                        {a.district}, {a.state}
                      </div>
                    </td>
                    <td className="px-4 py-3 text-xs">{a.business_type}</td>
                    <td className="px-4 py-3 text-xs">{a.investment_capacity}</td>
                    <td className="px-4 py-3">
                      <span className="text-xs font-bold px-2 py-1 rounded bg-[#0054A6]/10 text-[#0054A6]">
                        {a.lead_score}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <span className={`text-[10px] font-bold px-2 py-1 rounded uppercase ${statusColor[a.status]}`}>
                        {a.status}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-xs text-muted-foreground">
                      {new Date(a.submitted_at).toLocaleDateString()}
                    </td>
                    <td className="px-4 py-3">
                      <Button size="sm" variant="outline" onClick={() => setOpen(a)}>
                        Manage
                      </Button>
                    </td>
                  </tr>
                ))}
                {filtered.length === 0 && (
                  <tr>
                    <td colSpan={9} className="px-4 py-10 text-center text-muted-foreground">
                      No applications yet. Submissions from /bajaj_asd will appear here.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          )}

          <div className="md:hidden divide-y">
            {filtered.map((a) => (
              <button key={a.id} onClick={() => setOpen(a)} className="w-full text-left p-4 hover:bg-muted/30">
                <div className="flex justify-between items-start gap-3">
                  <div className="min-w-0">
                    <div className="font-semibold truncate">{a.applicant_name}</div>
                    <div className="text-xs text-muted-foreground truncate">
                      {a.mobile} • {a.target_location_label}
                    </div>
                    <div className="text-xs text-muted-foreground truncate mt-1">
                      Score {a.lead_score} • {a.investment_capacity}
                    </div>
                  </div>
                  <span className={`text-[10px] font-bold px-2 py-1 rounded uppercase shrink-0 ${statusColor[a.status]}`}>
                    {a.status}
                  </span>
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
              <SheetHeader>
                <SheetTitle>{open.applicant_name}</SheetTitle>
              </SheetHeader>
              <div className="space-y-4 mt-4 text-sm">
                <Section title="Location">
                  <Detail label="State" value={open.state} />
                  <Detail label="Districts" value={open.districts?.join(", ") || open.district || "—"} />
                  <Detail label="ASD Locations" value={open.target_location_label || "—"} />
                  <Detail label="Current Town" value={open.current_town} />
                </Section>

                <Section title="Contact">
                  <Detail label="Mobile" value={open.mobile} />
                  {open.alternate_mobile && <Detail label="Alternate" value={open.alternate_mobile} />}
                  <Detail label="Email" value={open.email || "—"} />
                </Section>

                <Section title="Business">
                  <Detail label="Existing Business" value={open.is_existing_business} />
                  {open.business_name && <Detail label="Business Name" value={open.business_name} />}
                  <Detail label="Business Type" value={open.business_type} />
                  {open.other_business_type && <Detail label="Other Type" value={open.other_business_type} />}
                  {open.years_in_business && <Detail label="Years in Business" value={open.years_in_business} />}
                  {open.pan && <Detail label="PAN" value={open.pan} />}
                  {open.gst_number && <Detail label="GST Number" value={open.gst_number} />}
                  <Detail label="Existing OEM" value={open.existing_oem} />
                  {open.oem_brand && <Detail label="OEM Brand" value={open.oem_brand} />}
                </Section>

                <Section title="Investment & Space">
                  <Detail label="Investment Capacity" value={open.investment_capacity} />
                  <Detail label="Space Status" value={open.space_status} />
                  <Detail label="Showroom Space" value={open.showroom_space || "—"} />
                  <Detail label="Workshop Space" value={open.workshop_space || "—"} />
                  <Detail label="Frontage" value={open.frontage || "—"} />
                  <Detail label="Start Timeline" value={open.start_timeline} />
                  <Detail label="Lead Score" value={String(open.lead_score)} />
                </Section>

                {open.applicant_remarks && (
                  <div>
                    <Label className="text-xs uppercase text-muted-foreground">Remarks</Label>
                    <p className="mt-1 text-sm whitespace-pre-wrap bg-muted/40 p-3 rounded-lg">{open.applicant_remarks}</p>
                  </div>
                )}

                <Detail label="Submitted" value={new Date(open.submitted_at).toLocaleString()} />

                <div className="space-y-1.5">
                  <Label>Status</Label>
                  <Select value={open.status} onValueChange={(v) => setStatus(open, v as LeadStatus)}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {STATUSES.map((s) => (
                        <SelectItem key={s} value={s}>
                          {s}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <NotesEditor app={open} onSave={saveNotes} />
              </div>
            </>
          )}
        </SheetContent>
      </Sheet>
    </div>
  );
};

const Section = ({ title, children }: { title: string; children: ReactNode }) => (
  <div className="space-y-2">
    <div className="text-xs font-bold uppercase tracking-wide text-[#0054A6]">{title}</div>
    <div className="space-y-1">{children}</div>
  </div>
);

const Detail = ({ label, value }: { label: string; value: string }) => (
  <div className="flex justify-between gap-3 border-b pb-2">
    <span className="text-xs uppercase text-muted-foreground">{label}</span>
    <span className="text-sm font-medium text-right break-all">{value}</span>
  </div>
);

const NotesEditor = ({
  app,
  onSave,
}: {
  app: BajajAsdApplicationRecord;
  onSave: (app: BajajAsdApplicationRecord, notes: string) => void;
}) => {
  const [notes, setNotes] = useState(app.admin_notes ?? "");
  useEffect(() => setNotes(app.admin_notes ?? ""), [app.id]);
  return (
    <div className="space-y-1.5">
      <Label>Admin notes</Label>
      <Textarea rows={4} value={notes} onChange={(e) => setNotes(e.target.value)} placeholder="Internal notes…" />
      <Button size="sm" onClick={() => onSave(app, notes)}>
        <Save className="h-4 w-4" /> Save notes
      </Button>
    </div>
  );
};

export default AdminBajajAsd;
