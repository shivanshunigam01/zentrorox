import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { RefreshCw, Search } from "lucide-react";
import { fetchLeads, type Lead } from "@/lib/admin/leadsApi";
import { fetchBajajAsdApplications } from "@/lib/admin/bajajAsdApi";
import { fetchReferrals } from "@/lib/admin/pulsarApi";
import { moduleLabelForFormType } from "@/lib/admin/modules";
import type { ReferralSubmission } from "@/lib/hyOffers/types";
import type { BajajAsdApplicationRecord } from "@/lib/admin/bajajAsdApi";
import { Skeleton } from "@/components/ui/skeleton";

type Row =
  | { kind: "lead"; id: string; name: string; contact: string; module: string; status: string; date: string; link: string }
  | { kind: "asd"; id: string; name: string; contact: string; module: string; status: string; date: string; link: string }
  | { kind: "pulsar"; id: string; name: string; contact: string; module: string; status: string; date: string; link: string };

const AdminSubmissions = () => {
  const [leads, setLeads] = useState<Lead[] | null>(null);
  const [asd, setAsd] = useState<BajajAsdApplicationRecord[] | null>(null);
  const [referrals, setReferrals] = useState<ReferralSubmission[] | null>(null);
  const [q, setQ] = useState("");
  const [tab, setTab] = useState("all");

  const load = () => {
    setLeads(null);
    setAsd(null);
    setReferrals(null);
    Promise.all([fetchLeads(), fetchBajajAsdApplications(), fetchReferrals()])
      .then(([l, a, r]) => { setLeads(l); setAsd(a); setReferrals(r); })
      .catch(() => { setLeads([]); setAsd([]); setReferrals([]); });
  };
  useEffect(() => { load(); }, []);

  const rows = useMemo(() => {
    const out: Row[] = [];
    (leads ?? []).forEach((l) => {
      out.push({
        kind: "lead",
        id: l.id,
        name: l.name,
        contact: `${l.email} · ${l.phone}`,
        module: moduleLabelForFormType(l.form_type),
        status: l.status,
        date: l.created_at,
        link: l.form_type === "bajaj_asd" ? "/admin/bajaj-asd" : "/admin/leads",
      });
    });
    (asd ?? []).forEach((a) => {
      out.push({
        kind: "asd",
        id: a.id,
        name: a.applicant_name,
        contact: `${a.email} · ${a.mobile}`,
        module: "Bajaj ASD",
        status: a.status,
        date: a.submitted_at,
        link: "/admin/bajaj-asd",
      });
    });
    (referrals ?? []).forEach((r) => {
      out.push({
        kind: "pulsar",
        id: r.id,
        name: r.friendName,
        contact: `${r.friendMobile} · ref ${r.referrerCode}`,
        module: "Pulsar Referral",
        status: r.status ?? "new",
        date: r.createdAt,
        link: "/admin/pulsar",
      });
    });
    return out.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  }, [leads, asd, referrals]);

  const filtered = useMemo(() => {
    const s = q.toLowerCase();
    return rows.filter((r) => {
      if (tab === "leads" && r.kind !== "lead") return false;
      if (tab === "asd" && r.kind !== "asd") return false;
      if (tab === "pulsar" && r.kind !== "pulsar") return false;
      if (!s) return true;
      return [r.name, r.contact, r.module, r.status].some((v) => v.toLowerCase().includes(s));
    });
  }, [rows, q, tab]);

  const loading = leads === null;

  return (
    <div className="space-y-5">
      <div className="flex items-start justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-2xl md:text-3xl font-extrabold">All Submissions</h1>
          <p className="text-sm text-muted-foreground">Unified inbox across enquiries, Bajaj ASD and Pulsar referrals.</p>
        </div>
        <Button variant="outline" size="sm" onClick={load}><RefreshCw className="h-4 w-4" /> Refresh</Button>
      </div>

      <Card>
        <CardContent className="p-4 space-y-3">
          <div className="relative max-w-md">
            <Search className="h-4 w-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
            <Input className="pl-9" placeholder="Search submissions…" value={q} onChange={(e) => setQ(e.target.value)} />
          </div>
          <Tabs value={tab} onValueChange={setTab}>
            <TabsList>
              <TabsTrigger value="all">All</TabsTrigger>
              <TabsTrigger value="leads">Enquiries</TabsTrigger>
              <TabsTrigger value="asd">Bajaj ASD</TabsTrigger>
              <TabsTrigger value="pulsar">Pulsar</TabsTrigger>
            </TabsList>
            <TabsContent value={tab} className="mt-3">
              {loading ? (
                <div className="space-y-2">{Array.from({ length: 5 }).map((_, i) => <Skeleton key={i} className="h-12 w-full" />)}</div>
              ) : (
                <div className="divide-y border rounded-lg">
                  {filtered.map((r) => (
                    <Link key={`${r.kind}-${r.id}`} to={r.link} className="flex items-center justify-between p-3 hover:bg-muted/30 gap-3">
                      <div className="min-w-0">
                        <div className="font-medium truncate">{r.name}</div>
                        <div className="text-xs text-muted-foreground truncate">{r.contact}</div>
                      </div>
                      <div className="text-right shrink-0">
                        <div className="text-[10px] uppercase font-bold text-primary">{r.module}</div>
                        <div className="text-[10px] text-muted-foreground">{new Date(r.date).toLocaleString()}</div>
                        <div className="text-[10px] font-semibold">{r.status}</div>
                      </div>
                    </Link>
                  ))}
                  {filtered.length === 0 && <p className="p-6 text-sm text-muted-foreground text-center">No submissions found.</p>}
                </div>
              )}
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminSubmissions;
