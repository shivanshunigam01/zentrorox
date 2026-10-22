import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { fetchLeads, verifyLead, type ZfLead } from "@/lib/zentroflow/api";
import { toast } from "@/hooks/use-toast";

export default function ZentroFlowVerification() {
  const [items, setItems] = useState<ZfLead[]>([]);
  const [err, setErr] = useState<string | null>(null);

  const load = () => {
    fetchLeads({ verification_status: "pending", limit: "50" })
      .then((r) => setItems(r.items))
      .catch((e) => setErr(e.message));
  };

  useEffect(() => {
    load();
  }, []);

  const disposition = async (lead: ZfLead, qualification_status: string) => {
    try {
      await verifyLead(lead.id, {
        verification_status: qualification_status === "invalid" ? "rejected" : "verified",
        qualification_status,
      });
      toast({ title: "Updated", description: qualification_status });
      load();
    } catch (e) {
      toast({ title: "Failed", description: (e as Error).message, variant: "destructive" });
    }
  };

  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-2xl font-extrabold">Verification queue</h1>
        <p className="text-sm text-muted-foreground">Zentroverse ops qualify leads before or after client assignment.</p>
      </div>
      {err && <p className="text-sm text-red-600">{err}</p>}
      <div className="space-y-2">
        {items.map((l) => (
          <Card key={l.id}>
            <CardContent className="p-4 flex flex-wrap items-center justify-between gap-3">
              <div>
                <Link to={`/zentroflow/leads/${l.id}`} className="font-semibold hover:underline">
                  {l.name}
                </Link>
                <div className="text-xs text-muted-foreground">
                  {l.mobile} · {l.interest?.product || "—"} · {l.attribution?.source_channel}
                </div>
              </div>
              <div className="flex gap-2 items-center">
                <Select onValueChange={(v) => disposition(l, v)}>
                  <SelectTrigger className="w-48">
                    <SelectValue placeholder="Disposition" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="qualified">Qualified</SelectItem>
                    <SelectItem value="warm_nurture">Warm / Nurture</SelectItem>
                    <SelectItem value="not_interested">Not interested</SelectItem>
                    <SelectItem value="invalid">Invalid</SelectItem>
                    <SelectItem value="duplicate">Duplicate</SelectItem>
                    <SelectItem value="out_of_territory">Out of territory</SelectItem>
                    <SelectItem value="client_review">Client review</SelectItem>
                  </SelectContent>
                </Select>
                <Button variant="outline" size="sm" asChild>
                  <Link to={`/zentroflow/leads/${l.id}`}>Open</Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
        {!items.length && !err && <p className="text-sm text-muted-foreground">Queue empty.</p>}
      </div>
    </div>
  );
}
