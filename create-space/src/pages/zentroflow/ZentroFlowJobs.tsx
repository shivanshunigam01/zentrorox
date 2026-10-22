import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { fetchJobs, processJobs, retryJob } from "@/lib/zentroflow/api";
import { toast } from "@/hooks/use-toast";

export default function ZentroFlowJobs() {
  const [items, setItems] = useState<Array<Record<string, unknown>>>([]);
  const [total, setTotal] = useState(0);

  const load = () =>
    fetchJobs({ limit: "50" })
      .then((r) => {
        setItems(r.items);
        setTotal(r.total);
      })
      .catch((e) => toast({ title: e.message, variant: "destructive" }));

  useEffect(() => {
    load();
  }, []);

  return (
    <div className="space-y-4">
      <div className="flex items-start justify-between gap-3 flex-wrap">
        <div>
          <h1 className="text-2xl font-extrabold">Jobs & failures</h1>
          <p className="text-sm text-muted-foreground">{total} jobs · Meta retrieve, CAPI, notifications, retries</p>
        </div>
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={async () => {
              const r = await processJobs();
              toast({ title: `Processed ${r.processed}` });
              load();
            }}
          >
            Run worker tick
          </Button>
          <Button variant="outline" size="sm" onClick={load}>
            Refresh
          </Button>
        </div>
      </div>

      {items.map((j) => (
        <Card key={String(j.id)}>
          <CardContent className="p-4 text-sm flex justify-between gap-3 flex-wrap">
            <div>
              <div className="font-semibold">
                {String(j.type)} · <span className="font-normal">{String(j.status)}</span>
              </div>
              <div className="text-xs text-muted-foreground">
                attempts {String(j.attempts)}/{String(j.max_attempts)} · {j.last_error ? String(j.last_error) : "ok"}
              </div>
            </div>
            {(j.status === "failed" || j.status === "dead") && (
              <Button
                size="sm"
                variant="outline"
                onClick={async () => {
                  await retryJob(String(j.id));
                  load();
                }}
              >
                Retry
              </Button>
            )}
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
