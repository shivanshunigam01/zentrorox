import { useEffect, useMemo, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Textarea } from "@/components/ui/textarea";
import { FileSpreadsheet, RefreshCw, Save, Search } from "lucide-react";
import { fetchReferrals, updateReferral } from "@/lib/admin/pulsarApi";
import type { ReferralSubmission, ReferralStatus } from "@/lib/hyOffers/types";
import { exportToExcel } from "@/lib/admin/exporters";
import { toast } from "@/hooks/use-toast";
import { Skeleton } from "@/components/ui/skeleton";

const STATUSES: ReferralStatus[] = ["new", "contacted", "qualified", "won", "lost"];

const AdminPulsarReferrals = () => {
  const [list, setList] = useState<ReferralSubmission[] | null>(null);
  const [q, setQ] = useState("");
  const [open, setOpen] = useState<ReferralSubmission | null>(null);

  const load = () => {
    setList(null);
    fetchReferrals().then(setList).catch((e) => toast({ title: "Failed", description: e.message, variant: "destructive" }));
  };
  useEffect(() => { load(); }, []);

  const filtered = useMemo(() => {
    const s = q.toLowerCase();
    return (list ?? []).filter((r) => {
      if (!s) return true;
      return [r.friendName, r.friendMobile, r.referrerCode, r.referrerName, r.branch].some((v) => v?.toLowerCase().includes(s));
    });
  }, [list, q]);

  const rows = filtered.map((r) => ({
    Friend: r.friendName,
    FriendMobile: r.friendMobile,
    Referrer: r.referrerName,
    Code: r.referrerCode,
    Branch: r.branch ?? "",
    Status: r.status ?? "new",
    Date: new Date(r.createdAt).toLocaleString(),
  }));

  const save = async (item: ReferralSubmission, status: ReferralStatus, admin_notes: string) => {
    try {
      const upd = await updateReferral(item.id, { status, admin_notes });
      setList((ls) => ls?.map((x) => x.id === item.id ? { ...x, ...upd } : x) ?? null);
      setOpen({ ...item, ...upd });
      toast({ title: "Updated" });
    } catch (e) {
      toast({ title: "Failed", description: (e as Error).message, variant: "destructive" });
    }
  };

  return (
    <div className="space-y-5">
      <div className="flex items-start justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-2xl md:text-3xl font-extrabold">Pulsar Referrals</h1>
          <p className="text-sm text-muted-foreground">Friend referral submissions from /pulsar links.</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={load}><RefreshCw className="h-4 w-4" /></Button>
          <Button variant="outline" size="sm" disabled={!rows.length} onClick={() => exportToExcel(rows, "pulsar-referrals")}>
            <FileSpreadsheet className="h-4 w-4" /> Excel
          </Button>
        </div>
      </div>

      <Card>
        <CardContent className="p-4">
          <div className="relative max-w-md">
            <Search className="h-4 w-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
            <Input className="pl-9" placeholder="Search…" value={q} onChange={(e) => setQ(e.target.value)} />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-0 overflow-x-auto">
          {list === null ? (
            <div className="p-4 space-y-2">{Array.from({ length: 5 }).map((_, i) => <Skeleton key={i} className="h-12 w-full" />)}</div>
          ) : (
            <table className="w-full text-sm">
              <thead className="bg-muted/50 text-left">
                <tr>{["Friend", "Referrer", "Code", "Offers", "Status", "Date"].map((h) => (
                  <th key={h} className="px-4 py-3 text-xs uppercase font-semibold text-muted-foreground">{h}</th>
                ))}</tr>
              </thead>
              <tbody>
                {filtered.map((r) => (
                  <tr key={r.id} className="border-t hover:bg-muted/30 cursor-pointer" onClick={() => setOpen(r)}>
                    <td className="px-4 py-3"><div className="font-medium">{r.friendName}</div><div className="text-xs text-muted-foreground">{r.friendMobile}</div></td>
                    <td className="px-4 py-3 text-xs">{r.referrerName}</td>
                    <td className="px-4 py-3 text-xs font-mono">{r.referrerCode}</td>
                    <td className="px-4 py-3 text-xs">₹{r.friendOffer} / ₹{r.referrerOffer}</td>
                    <td className="px-4 py-3 text-xs uppercase font-bold">{r.status ?? "new"}</td>
                    <td className="px-4 py-3 text-xs text-muted-foreground">{new Date(r.createdAt).toLocaleString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </CardContent>
      </Card>

      <Sheet open={!!open} onOpenChange={(v) => !v && setOpen(null)}>
        <SheetContent className="overflow-y-auto">
          {open && (
            <>
              <SheetHeader><SheetTitle>{open.friendName}</SheetTitle></SheetHeader>
              <div className="mt-4 space-y-4 text-sm">
                <Detail label="Friend mobile" value={open.friendMobile} />
                <Detail label="Referrer" value={`${open.referrerName} (${open.referrerMobile})`} />
                <Detail label="Code" value={open.referrerCode} />
                <div className="space-y-1.5">
                  <Label>Status</Label>
                  <Select value={open.status ?? "new"} onValueChange={(v) => save(open, v as ReferralStatus, open.admin_notes ?? "")}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>{STATUSES.map((s) => <SelectItem key={s} value={s}>{s}</SelectItem>)}</SelectContent>
                  </Select>
                </div>
                <NotesEditor item={open} onSave={(notes) => save(open, (open.status ?? "new") as ReferralStatus, notes)} />
              </div>
            </>
          )}
        </SheetContent>
      </Sheet>
    </div>
  );
};

const Detail = ({ label, value }: { label: string; value: string }) => (
  <div><div className="text-xs uppercase text-muted-foreground">{label}</div><div className="font-medium">{value}</div></div>
);

const NotesEditor = ({ item, onSave }: { item: ReferralSubmission; onSave: (n: string) => void }) => {
  const [notes, setNotes] = useState(item.admin_notes ?? "");
  return (
    <div className="space-y-1.5">
      <Label>Admin notes</Label>
      <Textarea value={notes} onChange={(e) => setNotes(e.target.value)} rows={4} />
      <Button size="sm" onClick={() => onSave(notes)}><Save className="h-4 w-4" /> Save notes</Button>
    </div>
  );
};

export default AdminPulsarReferrals;
