import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { RefreshCw } from "lucide-react";
import { fetchDashboard, type ZfDashboard } from "@/lib/zentroflow/api";
import { getActiveTenantId } from "@/lib/zentroflow/auth";

export default function ZentroFlowDashboard() {
  const [data, setData] = useState<ZfDashboard | null>(null);
  const [err, setErr] = useState<string | null>(null);
  const tenantId = getActiveTenantId();

  const load = () => {
    setErr(null);
    if (!tenantId) {
      setErr("Select or assign a tenant (super admin: open Admin → ZentroFlow and pick a client).");
      return;
    }
    fetchDashboard()
      .then(setData)
      .catch((e) => setErr(e.message));
  };

  useEffect(() => {
    load();
  }, [tenantId]);

  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between gap-3 flex-wrap">
        <div>
          <h1 className="text-2xl font-extrabold">Dashboard</h1>
          <p className="text-sm text-muted-foreground">Stage counts, SLA and temperature — click through to filtered leads.</p>
        </div>
        <Button variant="outline" size="sm" onClick={load}>
          <RefreshCw className="h-4 w-4" /> Refresh
        </Button>
      </div>

      {err && <p className="text-sm text-red-600">{err}</p>}

      <div className="grid grid-cols-2 lg:grid-cols-5 gap-3">
        {(data?.widgets || []).map((w) => {
          const qs = new URLSearchParams();
          Object.entries(w.filter || {}).forEach(([k, v]) => {
            if (v != null && v !== "") qs.set(k, String(v));
          });
          return (
            <Link key={w.key} to={`/zentroflow/leads?${qs.toString()}`}>
              <Card className="hover:border-teal-600/40 transition-colors h-full">
                <CardContent className="p-4">
                  <div className="text-xs text-muted-foreground">{w.label}</div>
                  <div className="text-2xl font-extrabold mt-2">{w.count}</div>
                </CardContent>
              </Card>
            </Link>
          );
        })}
      </div>

      {data && (
        <div className="grid md:grid-cols-3 gap-3 text-sm">
          <Card>
            <CardContent className="p-4">
              <div className="text-muted-foreground">Total leads</div>
              <div className="text-xl font-bold">{data.total}</div>
              <div className="text-xs text-muted-foreground mt-1">{data.new_this_week} new this week</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="text-muted-foreground">Overdue follow-ups</div>
              <div className="text-xl font-bold text-amber-700">{data.overdue_followups}</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="text-muted-foreground">Failed jobs</div>
              <div className="text-xl font-bold text-red-700">{data.jobs_failed}</div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}
