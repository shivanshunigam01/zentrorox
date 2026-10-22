import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { fetchHrOrganizations, fetchHrPlatformOverview } from "@/lib/hr/api";
import type { HrOrganization } from "@/lib/hr/auth";
import { toast } from "@/hooks/use-toast";
import { ExternalLink, RefreshCw } from "lucide-react";

export default function AdminHr() {
  const [overview, setOverview] = useState<Awaited<ReturnType<typeof fetchHrPlatformOverview>> | null>(null);
  const [orgs, setOrgs] = useState<HrOrganization[]>([]);

  const load = async () => {
    try {
      const [ov, o] = await Promise.all([fetchHrPlatformOverview(), fetchHrOrganizations()]);
      setOverview(ov);
      setOrgs(o.items);
    } catch (e) {
      toast({ title: "HR API", description: (e as Error).message, variant: "destructive" });
    }
  };

  useEffect(() => {
    load();
  }, []);

  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between gap-3 flex-wrap">
        <div>
          <h1 className="text-2xl md:text-3xl font-extrabold">HR Module</h1>
          <p className="text-sm text-muted-foreground">
            PeopleFlow-powered HR — organizations, employees, attendance & leave. Portal:{" "}
            <Link className="text-primary underline" to="/hr/login">
              /hr
            </Link>
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" asChild>
            <Link to="/hr/login">
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
          { label: "Organizations", value: overview?.organizations ?? "—" },
          { label: "Employees", value: overview?.employees ?? "—" },
          { label: "Users", value: overview?.users ?? "—" },
          { label: "Pending leave", value: overview?.leavePending ?? "—" },
        ].map((s) => (
          <Card key={s.label}>
            <CardContent className="p-4">
              <div className="text-xs text-muted-foreground">{s.label}</div>
              <div className="text-2xl font-extrabold mt-1">{s.value}</div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Organizations</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          {orgs.map((o) => (
            <div key={o.id} className="flex flex-wrap items-center justify-between gap-2 border rounded-lg p-3 text-sm">
              <div>
                <div className="font-semibold">
                  {o.name}{" "}
                  <span className="text-xs font-normal text-muted-foreground">({o.slug})</span>
                </div>
                <div className="text-xs text-muted-foreground">{o.email || o.id}</div>
              </div>
            </div>
          ))}
          {!orgs.length && (
            <p className="text-sm text-muted-foreground">
              No organizations yet — register one from{" "}
              <Link className="text-primary underline" to="/hr/register">
                /hr/register
              </Link>
              .
            </p>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Quick links</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-wrap gap-2">
          <Button variant="outline" size="sm" asChild>
            <Link to="/hr/register">Create HR workspace</Link>
          </Button>
          <Button variant="outline" size="sm" asChild>
            <Link to="/hr">HR dashboard</Link>
          </Button>
          <Button variant="outline" size="sm" asChild>
            <Link to="/hr/employees">Employees</Link>
          </Button>
          <Button variant="outline" size="sm" asChild>
            <Link to="/hr/leave">Leave</Link>
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
