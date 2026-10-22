import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Inbox, Users, FileText, IndianRupee, Bike, Brain, Share2, RefreshCw } from "lucide-react";
import { Bar, BarChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { fetchLeads, type Lead } from "@/lib/admin/leadsApi";
import { fetchAdminOverview } from "@/lib/admin/overviewApi";
import { ADMIN_MODULES } from "@/lib/admin/modules";
import { migrateLocalCrmToBackend } from "@/lib/admin/migrateCrm";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "@/hooks/use-toast";

const AdminDashboard = () => {
  const [leads, setLeads] = useState<Lead[] | null>(null);
  const [overview, setOverview] = useState<Awaited<ReturnType<typeof fetchAdminOverview>> | null>(null);
  const [err, setErr] = useState<string | null>(null);

  const load = async () => {
    setErr(null);
    try {
      const [ov, ls] = await Promise.all([fetchAdminOverview(), fetchLeads()]);
      setOverview(ov);
      setLeads(ls);
    } catch (e) {
      setErr((e as Error).message);
    }
  };

  useEffect(() => {
    migrateLocalCrmToBackend().then((migrated) => {
      if (migrated) toast({ title: "CRM data migrated", description: "Local billing data imported to backend." });
    });
    load();
  }, []);

  const weekAgo = Date.now() - 7 * 86400000;
  const newThisWeek = (leads ?? []).filter((l) => new Date(l.created_at).getTime() > weekAgo).length;

  const stats = [
    { label: "Total Leads", value: overview?.modules.leads.total ?? leads?.length ?? "—", icon: Inbox, sub: `${newThisWeek} new this week`, to: "/admin/leads" },
    { label: "Bajaj ASD", value: overview?.modules.bajaj_asd.total ?? "—", icon: Bike, sub: "Applications", to: "/admin/bajaj-asd" },
    { label: "Growth Hub", value: overview?.modules.growth_hub.total ?? "—", icon: Brain, sub: "Tool submissions", to: "/admin/growth-hub" },
    { label: "Pulsar", value: overview?.modules.pulsar.total ?? "—", icon: Share2, sub: "Referrals", to: "/admin/pulsar" },
    { label: "Customers", value: overview?.modules.customers.total ?? "—", icon: Users, sub: "CRM accounts", to: "/admin/customers" },
    { label: "Revenue (paid)", value: overview ? `₹${overview.modules.invoices.revenue_paid.toLocaleString("en-IN")}` : "—", icon: IndianRupee, sub: `${overview?.modules.invoices.total ?? 0} invoices`, to: "/admin/invoices" },
    { label: "Pending Invoices", value: overview?.modules.invoices.by_status?.sent ?? "—", icon: FileText, sub: "Awaiting payment", to: "/admin/invoices" },
  ];

  const monthly = [
    { m: "Leads", revenue: overview?.modules.leads.total ?? 0 },
    { m: "ASD", revenue: overview?.modules.bajaj_asd.total ?? 0 },
    { m: "Growth", revenue: overview?.modules.growth_hub.total ?? 0 },
    { m: "Pulsar", revenue: overview?.modules.pulsar.total ?? 0 },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between gap-3 flex-wrap">
        <div>
          <h1 className="text-2xl md:text-3xl font-extrabold">Command Center</h1>
          <p className="text-sm text-muted-foreground">Live overview of all public submissions and CRM modules.</p>
        </div>
        <Button variant="outline" size="sm" onClick={load}><RefreshCw className="h-4 w-4" /> Refresh</Button>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4">
        {stats.map((s) => (
          <Link key={s.label} to={s.to}>
            <Card className="hover:border-primary/40 transition-colors h-full">
              <CardContent className="p-4 md:p-5">
                <div className="flex items-start justify-between">
                  <div className="text-xs text-muted-foreground">{s.label}</div>
                  <s.icon className="h-4 w-4 text-primary" />
                </div>
                <div className="text-xl md:text-2xl font-extrabold mt-2">{s.value}</div>
                <div className="text-[11px] text-muted-foreground mt-1">{s.sub}</div>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>

      <div className="grid lg:grid-cols-3 gap-4">
        <Card className="lg:col-span-2">
          <CardHeader><CardTitle className="text-base">Submissions by module</CardTitle></CardHeader>
          <CardContent className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={monthly}>
                <XAxis dataKey="m" stroke="hsl(var(--muted-foreground))" fontSize={12} />
                <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} />
                <Tooltip />
                <Bar dataKey="revenue" fill="hsl(var(--primary))" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader><CardTitle className="text-base">Recent Leads</CardTitle></CardHeader>
          <CardContent className="space-y-2">
            {leads === null && !err && Array.from({ length: 4 }).map((_, i) => <Skeleton key={i} className="h-12 w-full" />)}
            {err && <p className="text-xs text-destructive">{err}</p>}
            {leads?.slice(0, 5).map((l) => (
              <div key={l.id} className="flex items-center justify-between border rounded-lg p-2.5">
                <div className="min-w-0">
                  <div className="text-sm font-semibold truncate">{l.name}</div>
                  <div className="text-[11px] text-muted-foreground truncate">{l.form_type ?? "contact"}</div>
                </div>
                <span className="text-[10px] uppercase font-bold text-primary">{l.status}</span>
              </div>
            ))}
            <Link to="/admin/submissions" className="text-xs text-primary hover:underline inline-block mt-2">View all submissions →</Link>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader><CardTitle className="text-base">Modules</CardTitle></CardHeader>
        <CardContent className="grid sm:grid-cols-2 lg:grid-cols-3 gap-2">
          {ADMIN_MODULES.map((m) => (
            <Link key={m.key} to={m.to} className="rounded-lg border p-3 hover:bg-muted/40 text-sm font-medium">{m.label}</Link>
          ))}
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminDashboard;
