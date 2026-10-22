import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { attendanceToday, checkIn, checkOut, fetchHrDashboard } from "@/lib/hr/api";
import { toast } from "@/hooks/use-toast";
import { Skeleton } from "@/components/ui/skeleton";

export default function HrDashboard() {
  const [data, setData] = useState<Awaited<ReturnType<typeof fetchHrDashboard>> | null>(null);
  const [today, setToday] = useState<Awaited<ReturnType<typeof attendanceToday>> | null | undefined>(undefined);

  const load = async () => {
    try {
      const [d, t] = await Promise.all([fetchHrDashboard(), attendanceToday()]);
      setData(d);
      setToday(t);
    } catch (e) {
      toast({ title: "Failed to load", description: (e as Error).message, variant: "destructive" });
    }
  };

  useEffect(() => {
    load();
  }, []);

  if (!data) {
    return (
      <div className="space-y-3">
        {Array.from({ length: 4 }).map((_, i) => (
          <Skeleton key={i} className="h-24 w-full" />
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl md:text-3xl font-extrabold">Dashboard</h1>
        <p className="text-sm text-muted-foreground">People, attendance and leave at a glance.</p>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {[
          { label: "Employees", value: data.employees },
          { label: "Present today", value: data.presentToday },
          { label: "Pending leave", value: data.pendingLeave },
          { label: "Departments", value: data.departments },
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
          <CardTitle className="text-base">My attendance today</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-wrap items-center gap-3">
          <div className="text-sm text-muted-foreground flex-1">
            {today === undefined
              ? "Loading…"
              : today?.checkInAt
                ? `Checked in ${new Date(today.checkInAt).toLocaleTimeString("en-IN")}${
                    today.checkOutAt ? ` · out ${new Date(today.checkOutAt).toLocaleTimeString("en-IN")}` : ""
                  }`
                : "Not checked in yet"}
          </div>
          <Button
            variant="outline"
            disabled={Boolean(today?.checkInAt)}
            onClick={async () => {
              try {
                setToday(await checkIn());
                toast({ title: "Checked in" });
                load();
              } catch (e) {
                toast({ title: "Failed", description: (e as Error).message, variant: "destructive" });
              }
            }}
          >
            Check in
          </Button>
          <Button
            disabled={!today?.checkInAt || Boolean(today?.checkOutAt)}
            onClick={async () => {
              try {
                setToday(await checkOut());
                toast({ title: "Checked out" });
                load();
              } catch (e) {
                toast({ title: "Failed", description: (e as Error).message, variant: "destructive" });
              }
            }}
          >
            Check out
          </Button>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Announcements</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {data.announcements.map((a) => (
            <div key={a.id} className="border rounded-lg p-3">
              <div className="font-semibold text-sm">{a.title}</div>
              <p className="text-sm text-muted-foreground mt-1 whitespace-pre-wrap">{a.body}</p>
            </div>
          ))}
          {!data.announcements.length && <p className="text-sm text-muted-foreground">No announcements yet.</p>}
        </CardContent>
      </Card>
    </div>
  );
}
