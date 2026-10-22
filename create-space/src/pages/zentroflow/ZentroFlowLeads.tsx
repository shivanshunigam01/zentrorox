import { useEffect, useMemo, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { RefreshCw, Download } from "lucide-react";
import { exportLeads, fetchLeads, LEAD_STAGES, type ZfLead } from "@/lib/zentroflow/api";
import { toast } from "@/hooks/use-toast";

const tempColor: Record<string, string> = {
  hot: "bg-red-100 text-red-700",
  warm: "bg-amber-100 text-amber-800",
  cold: "bg-slate-100 text-slate-700",
};

export default function ZentroFlowLeads() {
  const [params, setParams] = useSearchParams();
  const [items, setItems] = useState<ZfLead[]>([]);
  const [total, setTotal] = useState(0);
  const [err, setErr] = useState<string | null>(null);
  const [q, setQ] = useState(params.get("q") || "");

  const filters = useMemo(
    () => ({
      stage: params.get("stage") || "",
      temperature: params.get("temperature") || "",
      qualification_status: params.get("qualification_status") || "",
      overdue: params.get("overdue") || "",
      q: params.get("q") || "",
      page: params.get("page") || "1",
    }),
    [params],
  );

  const load = () => {
    setErr(null);
    const p: Record<string, string> = { limit: "50" };
    Object.entries(filters).forEach(([k, v]) => {
      if (v) p[k] = v;
    });
    fetchLeads(p)
      .then((r) => {
        setItems(r.items);
        setTotal(r.total);
      })
      .catch((e) => setErr(e.message));
  };

  useEffect(() => {
    load();
  }, [filters.stage, filters.temperature, filters.qualification_status, filters.overdue, filters.q, filters.page]);

  const setFilter = (key: string, value: string) => {
    const next = new URLSearchParams(params);
    if (!value || value === "all") next.delete(key);
    else next.set(key, value);
    next.delete("page");
    setParams(next);
  };

  const doExport = async () => {
    try {
      const p: Record<string, string> = {};
      Object.entries(filters).forEach(([k, v]) => {
        if (v && k !== "page") p[k] = v;
      });
      const res = await exportLeads(p);
      const blob = new Blob([JSON.stringify(res.items, null, 2)], { type: "application/json" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `zentroflow-leads-${Date.now()}.json`;
      a.click();
      URL.revokeObjectURL(url);
      toast({ title: "Export ready", description: `${res.count} leads (audited)` });
    } catch (e) {
      toast({ title: "Export failed", description: (e as Error).message, variant: "destructive" });
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-start justify-between gap-3 flex-wrap">
        <div>
          <h1 className="text-2xl font-extrabold">Leads</h1>
          <p className="text-sm text-muted-foreground">{total} matching · server-side filters</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={doExport}>
            <Download className="h-4 w-4" /> Export
          </Button>
          <Button variant="outline" size="sm" onClick={load}>
            <RefreshCw className="h-4 w-4" /> Refresh
          </Button>
        </div>
      </div>

      <div className="flex flex-wrap gap-2">
        <Input
          placeholder="Search name, mobile, product…"
          className="max-w-xs"
          value={q}
          onChange={(e) => setQ(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && setFilter("q", q)}
        />
        <Select value={filters.stage || "all"} onValueChange={(v) => setFilter("stage", v)}>
          <SelectTrigger className="w-40">
            <SelectValue placeholder="Stage" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All stages</SelectItem>
            {LEAD_STAGES.map((s) => (
              <SelectItem key={s} value={s}>
                {s}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Select value={filters.temperature || "all"} onValueChange={(v) => setFilter("temperature", v)}>
          <SelectTrigger className="w-36">
            <SelectValue placeholder="Temp" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All temps</SelectItem>
            <SelectItem value="hot">Hot</SelectItem>
            <SelectItem value="warm">Warm</SelectItem>
            <SelectItem value="cold">Cold</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {err && <p className="text-sm text-red-600">{err}</p>}

      <Card>
        <CardContent className="p-0 overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-slate-50 text-left text-xs uppercase text-muted-foreground">
              <tr>
                <th className="px-3 py-2">Name</th>
                <th className="px-3 py-2">Mobile</th>
                <th className="px-3 py-2">Product</th>
                <th className="px-3 py-2">Source</th>
                <th className="px-3 py-2">Stage</th>
                <th className="px-3 py-2">Temp</th>
                <th className="px-3 py-2">Next FU</th>
                <th className="px-3 py-2">Remark</th>
              </tr>
            </thead>
            <tbody>
              {items.map((l) => (
                <tr key={l.id} className="border-t hover:bg-slate-50">
                  <td className="px-3 py-2">
                    <Link className="font-medium text-teal-800 hover:underline" to={`/zentroflow/leads/${l.id}`}>
                      {l.name}
                    </Link>
                  </td>
                  <td className="px-3 py-2 font-mono text-xs">{l.mobile}</td>
                  <td className="px-3 py-2">{l.interest?.product || "—"}</td>
                  <td className="px-3 py-2 text-xs">{l.attribution?.source_channel}</td>
                  <td className="px-3 py-2">
                    <span className="text-xs px-2 py-0.5 rounded bg-slate-100">{l.current_stage}</span>
                  </td>
                  <td className="px-3 py-2">
                    <span className={`text-xs px-2 py-0.5 rounded ${tempColor[l.temperature] || ""}`}>{l.temperature}</span>
                  </td>
                  <td className="px-3 py-2 text-xs">
                    {l.overdue ? <span className="text-red-600">Overdue</span> : l.next_followup_at ? new Date(l.next_followup_at).toLocaleString() : "—"}
                  </td>
                  <td className="px-3 py-2 text-xs max-w-[180px] truncate">{l.last_remark || "—"}</td>
                </tr>
              ))}
              {!items.length && !err && (
                <tr>
                  <td colSpan={8} className="px-3 py-8 text-center text-muted-foreground">
                    No leads yet — ingest via API, Meta webhook, or manual create in admin.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </CardContent>
      </Card>
    </div>
  );
}
