import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { createTenant, fetchPlatformOverview, fetchTenants, ingestLead, type ZfTenant } from "@/lib/zentroflow/api";
import { setActiveTenantId, getActiveTenantId } from "@/lib/zentroflow/auth";
import { toast } from "@/hooks/use-toast";
import { RefreshCw, ExternalLink } from "lucide-react";

export default function AdminZentroFlow() {
  const [overview, setOverview] = useState<Awaited<ReturnType<typeof fetchPlatformOverview>> | null>(null);
  const [tenants, setTenants] = useState<ZfTenant[]>([]);
  const [active, setActive] = useState(getActiveTenantId());
  const [form, setForm] = useState({
    name: "",
    key: "",
    admin_email: "",
    admin_password: "ChangeMe@123",
    admin_name: "",
  });
  const [demoLead, setDemoLead] = useState({ name: "", mobile: "", product: "" });

  const load = async () => {
    try {
      const [ov, t] = await Promise.all([fetchPlatformOverview(), fetchTenants()]);
      setOverview(ov);
      setTenants(t.items);
    } catch (e) {
      toast({ title: "ZentroFlow API", description: (e as Error).message, variant: "destructive" });
    }
  };

  useEffect(() => {
    load();
  }, []);

  const pickTenant = (id: string) => {
    setActiveTenantId(id);
    setActive(id);
    toast({ title: "Active tenant set", description: id });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between gap-3 flex-wrap">
        <div>
          <h1 className="text-2xl md:text-3xl font-extrabold">ZentroFlow</h1>
          <p className="text-sm text-muted-foreground">
            Multi-tenant lead CRM — onboard clients, map Meta, manage ops. Portal:{" "}
            <Link className="text-primary underline" to="/zentroflow/login">
              /zentroflow
            </Link>
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" asChild>
            <Link to="/zentroflow">
              <ExternalLink className="h-4 w-4" /> Open portal
            </Link>
          </Button>
          <Button variant="outline" size="sm" onClick={load}>
            <RefreshCw className="h-4 w-4" /> Refresh
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {[
          { label: "Tenants", value: overview?.tenants ?? "—" },
          { label: "Leads", value: overview?.leads ?? "—" },
          { label: "Users", value: overview?.users ?? "—" },
          { label: "Failed jobs", value: overview?.failed_jobs ?? "—" },
        ].map((s) => (
          <Card key={s.label}>
            <CardContent className="p-4">
              <div className="text-xs text-muted-foreground">{s.label}</div>
              <div className="text-2xl font-extrabold mt-1">{s.value}</div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid lg:grid-cols-2 gap-4">
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Onboard client / tenant</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div>
              <Label>Client name</Label>
              <Input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
            </div>
            <div>
              <Label>Tenant key (optional)</Label>
              <Input value={form.key} onChange={(e) => setForm({ ...form, key: e.target.value })} placeholder="auto from name" />
            </div>
            <div>
              <Label>Client admin email</Label>
              <Input value={form.admin_email} onChange={(e) => setForm({ ...form, admin_email: e.target.value })} />
            </div>
            <div>
              <Label>Client admin name</Label>
              <Input value={form.admin_name} onChange={(e) => setForm({ ...form, admin_name: e.target.value })} />
            </div>
            <Button
              onClick={async () => {
                try {
                  const r = await createTenant(form);
                  toast({ title: "Tenant created", description: r.tenant.key });
                  pickTenant(r.tenant.id);
                  setForm({ name: "", key: "", admin_email: "", admin_password: "ChangeMe@123", admin_name: "" });
                  load();
                } catch (e) {
                  toast({ title: "Failed", description: (e as Error).message, variant: "destructive" });
                }
              }}
            >
              Create tenant
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base">Manual ingest (test lead)</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <p className="text-xs text-muted-foreground">Uses active tenant: {active || "none selected"}</p>
            <div>
              <Label>Name</Label>
              <Input value={demoLead.name} onChange={(e) => setDemoLead({ ...demoLead, name: e.target.value })} />
            </div>
            <div>
              <Label>Mobile</Label>
              <Input value={demoLead.mobile} onChange={(e) => setDemoLead({ ...demoLead, mobile: e.target.value })} />
            </div>
            <div>
              <Label>Product</Label>
              <Input value={demoLead.product} onChange={(e) => setDemoLead({ ...demoLead, product: e.target.value })} />
            </div>
            <Button
              variant="outline"
              onClick={async () => {
                if (!active) {
                  toast({ title: "Pick a tenant first", variant: "destructive" });
                  return;
                }
                const tenant = tenants.find((t) => t.id === active);
                try {
                  await ingestLead({
                    tenant_key: tenant?.key,
                    tenant_id: active,
                    source_channel: "manual",
                    customer: { name: demoLead.name, mobile: demoLead.mobile },
                    interest: { product: demoLead.product },
                    attribution: { source_channel: "manual" },
                  });
                  toast({ title: "Lead ingested" });
                } catch (e) {
                  toast({ title: "Failed", description: (e as Error).message, variant: "destructive" });
                }
              }}
            >
              Ingest lead
            </Button>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Tenants</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          {tenants.map((t) => (
            <div key={t.id} className="flex flex-wrap items-center justify-between gap-2 border rounded-lg p-3 text-sm">
              <div>
                <div className="font-semibold">
                  {t.name}{" "}
                  <span className="text-xs font-normal text-muted-foreground">
                    ({t.key}) · {t.status}
                  </span>
                </div>
                <div className="text-xs text-muted-foreground">{t.id}</div>
              </div>
              <Button size="sm" variant={active === t.id ? "default" : "outline"} onClick={() => pickTenant(t.id)}>
                {active === t.id ? "Active" : "Use tenant"}
              </Button>
            </div>
          ))}
          {!tenants.length && <p className="text-sm text-muted-foreground">No tenants yet — create one above.</p>}
        </CardContent>
      </Card>
    </div>
  );
}
