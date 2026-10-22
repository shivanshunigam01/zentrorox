import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { fetchIntegrations, upsertIntegration } from "@/lib/zentroflow/api";
import { toast } from "@/hooks/use-toast";

export default function ZentroFlowIntegrations() {
  const [items, setItems] = useState<Array<Record<string, unknown>>>([]);
  const [form, setForm] = useState({
    provider: "meta",
    label: "Meta Lead Ads",
    pageId: "",
    formId: "",
    formName: "",
    adAccountId: "",
    datasetId: "",
    verifyToken: "",
  });

  const load = () => fetchIntegrations().then((r) => setItems(r.items)).catch((e) => toast({ title: e.message, variant: "destructive" }));
  useEffect(() => {
    load();
  }, []);

  const save = async () => {
    try {
      await upsertIntegration({
        provider: form.provider,
        label: form.label,
        health: "unknown",
        meta: {
          pageId: form.pageId,
          formId: form.formId,
          formName: form.formName,
          adAccountId: form.adAccountId,
          datasetId: form.datasetId,
          verifyToken: form.verifyToken,
        },
        capi: { datasetId: form.datasetId, eventMap: { qualified: "Lead", sale: "Purchase" } },
      });
      toast({ title: "Integration saved" });
      load();
    } catch (e) {
      toast({ title: "Failed", description: (e as Error).message, variant: "destructive" });
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-extrabold">Integrations</h1>
        <p className="text-sm text-muted-foreground">
          Meta asset mapping, WhatsApp/email/voice shells, CAPI dataset. Paste provider env keys on the server when ready.
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Meta Lead Ads mapping</CardTitle>
        </CardHeader>
        <CardContent className="grid md:grid-cols-2 gap-3">
          <div>
            <Label>Page ID</Label>
            <Input value={form.pageId} onChange={(e) => setForm({ ...form, pageId: e.target.value })} />
          </div>
          <div>
            <Label>Form ID</Label>
            <Input value={form.formId} onChange={(e) => setForm({ ...form, formId: e.target.value })} />
          </div>
          <div>
            <Label>Form name</Label>
            <Input value={form.formName} onChange={(e) => setForm({ ...form, formName: e.target.value })} />
          </div>
          <div>
            <Label>Ad account ID</Label>
            <Input value={form.adAccountId} onChange={(e) => setForm({ ...form, adAccountId: e.target.value })} />
          </div>
          <div>
            <Label>Dataset ID (CAPI)</Label>
            <Input value={form.datasetId} onChange={(e) => setForm({ ...form, datasetId: e.target.value })} />
          </div>
          <div>
            <Label>Webhook verify token</Label>
            <Input value={form.verifyToken} onChange={(e) => setForm({ ...form, verifyToken: e.target.value })} />
          </div>
          <div className="md:col-span-2">
            <Button onClick={save}>Save Meta mapping</Button>
            <p className="text-xs text-muted-foreground mt-2">
              Webhook URL: <code className="bg-slate-100 px-1 rounded">/api/zentroflow/webhooks/meta</code>
            </p>
          </div>
        </CardContent>
      </Card>

      <div className="space-y-2">
        {items.map((it) => (
          <Card key={String(it.id)}>
            <CardContent className="p-4 text-sm flex justify-between gap-3">
              <div>
                <div className="font-semibold">
                  {String(it.provider)} · {String(it.label || "")}
                </div>
                <div className="text-xs text-muted-foreground">
                  health: {String(it.health)} · status: {String(it.status)}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid md:grid-cols-3 gap-3">
        {["whatsapp", "email", "voice"].map((p) => (
          <Card key={p}>
            <CardContent className="p-4">
              <div className="font-semibold capitalize">{p}</div>
              <p className="text-xs text-muted-foreground mt-1">Adapter reserved. Configure after env keys.</p>
              <Button
                className="mt-3"
                size="sm"
                variant="outline"
                onClick={async () => {
                  await upsertIntegration({ provider: p, label: `${p} primary`, health: "not_configured" });
                  load();
                }}
              >
                Create shell
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
