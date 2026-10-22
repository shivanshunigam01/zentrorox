import { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Check, Plus, RefreshCw, X } from "lucide-react";
import {
  createLeaveRequest,
  fetchEmployees,
  fetchLeaveRequests,
  fetchLeaveTypes,
  reviewLeaveRequest,
  type HrEmployee,
  type HrLeaveRequest,
  type HrLeaveType,
} from "@/lib/hr/api";
import { getHrUser } from "@/lib/hr/auth";
import { toast } from "@/hooks/use-toast";
import { Skeleton } from "@/components/ui/skeleton";

export default function HrLeave() {
  const user = getHrUser();
  const canReview = user?.role === "SUPER_ADMIN" || user?.role === "HR_ADMIN" || user?.role === "MANAGER";
  const [requests, setRequests] = useState<HrLeaveRequest[] | null>(null);
  const [types, setTypes] = useState<HrLeaveType[]>([]);
  const [employees, setEmployees] = useState<HrEmployee[]>([]);
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({
    leaveTypeId: "",
    startDate: new Date().toISOString().slice(0, 10),
    endDate: new Date().toISOString().slice(0, 10),
    reason: "",
  });

  const load = async () => {
    setRequests(null);
    try {
      const [r, t, e] = await Promise.all([fetchLeaveRequests(), fetchLeaveTypes(), fetchEmployees()]);
      setRequests(r.items);
      setTypes(t.items);
      setEmployees(e.items);
      if (!form.leaveTypeId && t.items[0]) setForm((f) => ({ ...f, leaveTypeId: t.items[0].id }));
    } catch (err) {
      setRequests([]);
      toast({ title: "Failed", description: (err as Error).message, variant: "destructive" });
    }
  };

  useEffect(() => {
    load();
  }, []);

  const empName = (id: string) => employees.find((e) => e.id === id)?.fullName || id;
  const typeName = (id: string) => types.find((t) => t.id === id)?.name || id;

  return (
    <div className="space-y-5">
      <div className="flex items-start justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-2xl md:text-3xl font-extrabold">Leave</h1>
          <p className="text-sm text-muted-foreground">Apply and approve leave requests.</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={load}>
            <RefreshCw className="h-4 w-4" />
          </Button>
          <Button size="sm" onClick={() => setOpen(true)}>
            <Plus className="h-4 w-4" /> Apply leave
          </Button>
        </div>
      </div>

      <Card>
        <CardContent className="p-0 overflow-x-auto">
          {requests === null ? (
            <div className="p-4 space-y-2">
              {Array.from({ length: 4 }).map((_, i) => (
                <Skeleton key={i} className="h-12 w-full" />
              ))}
            </div>
          ) : (
            <table className="w-full text-sm">
              <thead className="bg-muted/50 text-left">
                <tr>
                  {["Employee", "Type", "Dates", "Days", "Status", ""].map((h) => (
                    <th key={h} className="px-4 py-3 text-xs uppercase font-semibold text-muted-foreground">
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {requests.map((r) => (
                  <tr key={r.id} className="border-t hover:bg-muted/30">
                    <td className="px-4 py-3 text-xs">{empName(r.employeeId)}</td>
                    <td className="px-4 py-3 text-xs">{typeName(r.leaveTypeId)}</td>
                    <td className="px-4 py-3 text-xs">
                      {r.startDate} → {r.endDate}
                    </td>
                    <td className="px-4 py-3 font-semibold">{r.days}</td>
                    <td className="px-4 py-3">
                      <span
                        className={`text-[10px] font-bold uppercase px-2 py-1 rounded ${
                          r.status === "approved"
                            ? "bg-emerald-100 text-emerald-800"
                            : r.status === "rejected"
                              ? "bg-red-100 text-red-800"
                              : "bg-muted"
                        }`}
                      >
                        {r.status}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-right">
                      {canReview && r.status === "pending" && (
                        <div className="flex gap-1 justify-end">
                          <Button
                            size="icon"
                            variant="ghost"
                            title="Approve"
                            onClick={async () => {
                              try {
                                await reviewLeaveRequest(r.id, "approved");
                                toast({ title: "Approved" });
                                load();
                              } catch (e) {
                                toast({ title: "Failed", description: (e as Error).message, variant: "destructive" });
                              }
                            }}
                          >
                            <Check className="h-4 w-4" />
                          </Button>
                          <Button
                            size="icon"
                            variant="ghost"
                            title="Reject"
                            onClick={async () => {
                              try {
                                await reviewLeaveRequest(r.id, "rejected");
                                toast({ title: "Rejected" });
                                load();
                              } catch (e) {
                                toast({ title: "Failed", description: (e as Error).message, variant: "destructive" });
                              }
                            }}
                          >
                            <X className="h-4 w-4" />
                          </Button>
                        </div>
                      )}
                    </td>
                  </tr>
                ))}
                {!requests.length && (
                  <tr>
                    <td colSpan={6} className="text-center py-8 text-muted-foreground text-sm">
                      No leave requests.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          )}
        </CardContent>
      </Card>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Apply leave</DialogTitle>
          </DialogHeader>
          <div className="space-y-3">
            <div className="space-y-1.5">
              <Label>Leave type</Label>
              <Select value={form.leaveTypeId} onValueChange={(v) => setForm({ ...form, leaveTypeId: v })}>
                <SelectTrigger>
                  <SelectValue placeholder="Select" />
                </SelectTrigger>
                <SelectContent>
                  {types.map((t) => (
                    <SelectItem key={t.id} value={t.id}>
                      {t.name} ({t.code})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label>From</Label>
                <Input type="date" value={form.startDate} onChange={(e) => setForm({ ...form, startDate: e.target.value })} />
              </div>
              <div className="space-y-1.5">
                <Label>To</Label>
                <Input type="date" value={form.endDate} onChange={(e) => setForm({ ...form, endDate: e.target.value })} />
              </div>
            </div>
            <div className="space-y-1.5">
              <Label>Reason</Label>
              <Textarea rows={3} value={form.reason} onChange={(e) => setForm({ ...form, reason: e.target.value })} />
            </div>
          </div>
          <DialogFooter>
            <Button variant="ghost" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button
              onClick={async () => {
                try {
                  await createLeaveRequest(form);
                  toast({ title: "Leave applied" });
                  setOpen(false);
                  load();
                } catch (e) {
                  toast({ title: "Failed", description: (e as Error).message, variant: "destructive" });
                }
              }}
            >
              Submit
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
