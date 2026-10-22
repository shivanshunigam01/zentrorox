import { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { RefreshCw } from "lucide-react";
import { fetchAttendance, fetchEmployees, type HrAttendance, type HrEmployee } from "@/lib/hr/api";
import { toast } from "@/hooks/use-toast";
import { Skeleton } from "@/components/ui/skeleton";

export default function HrAttendance() {
  const [rows, setRows] = useState<HrAttendance[] | null>(null);
  const [employees, setEmployees] = useState<HrEmployee[]>([]);

  const load = async () => {
    setRows(null);
    try {
      const [att, emps] = await Promise.all([fetchAttendance(), fetchEmployees()]);
      setRows(att.items);
      setEmployees(emps.items);
    } catch (e) {
      setRows([]);
      toast({ title: "Failed", description: (e as Error).message, variant: "destructive" });
    }
  };

  useEffect(() => {
    load();
  }, []);

  const nameFor = (id?: string) => employees.find((e) => e.id === id)?.fullName || id || "—";

  return (
    <div className="space-y-5">
      <div className="flex items-start justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-2xl md:text-3xl font-extrabold">Attendance</h1>
          <p className="text-sm text-muted-foreground">Daily check-in / check-out log.</p>
        </div>
        <Button variant="outline" size="sm" onClick={load}>
          <RefreshCw className="h-4 w-4" />
        </Button>
      </div>

      <Card>
        <CardContent className="p-0 overflow-x-auto">
          {rows === null ? (
            <div className="p-4 space-y-2">
              {Array.from({ length: 4 }).map((_, i) => (
                <Skeleton key={i} className="h-12 w-full" />
              ))}
            </div>
          ) : (
            <table className="w-full text-sm">
              <thead className="bg-muted/50 text-left">
                <tr>
                  {["Date", "Employee", "Status", "In", "Out", "Minutes"].map((h) => (
                    <th key={h} className="px-4 py-3 text-xs uppercase font-semibold text-muted-foreground">
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {rows.map((r) => (
                  <tr key={r.id} className="border-t hover:bg-muted/30">
                    <td className="px-4 py-3 font-semibold">{r.date}</td>
                    <td className="px-4 py-3 text-xs">{nameFor(r.employeeId)}</td>
                    <td className="px-4 py-3">
                      <span className="text-[10px] font-bold uppercase bg-muted px-2 py-1 rounded">{r.status}</span>
                    </td>
                    <td className="px-4 py-3 text-xs">
                      {r.checkInAt ? new Date(r.checkInAt).toLocaleTimeString("en-IN") : "—"}
                    </td>
                    <td className="px-4 py-3 text-xs">
                      {r.checkOutAt ? new Date(r.checkOutAt).toLocaleTimeString("en-IN") : "—"}
                    </td>
                    <td className="px-4 py-3 text-xs">{r.workMinutes ?? 0}</td>
                  </tr>
                ))}
                {!rows.length && (
                  <tr>
                    <td colSpan={6} className="text-center py-8 text-muted-foreground text-sm">
                      No attendance records yet.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
