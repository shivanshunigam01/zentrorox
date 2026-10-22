import { useEffect, useMemo, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Plus, RefreshCw, Search } from "lucide-react";
import {
  createEmployee,
  fetchDepartments,
  fetchDesignations,
  fetchEmployees,
  type HrDepartment,
  type HrDesignation,
  type HrEmployee,
} from "@/lib/hr/api";
import { toast } from "@/hooks/use-toast";
import { Skeleton } from "@/components/ui/skeleton";

const emptyForm = () => ({
  firstName: "",
  lastName: "",
  email: "",
  password: "Welcome@123",
  phone: "",
  departmentId: "",
  designationId: "",
  employmentType: "full_time",
  dateOfJoining: new Date().toISOString().slice(0, 10),
});

export default function HrEmployees() {
  const [list, setList] = useState<HrEmployee[] | null>(null);
  const [departments, setDepartments] = useState<HrDepartment[]>([]);
  const [designations, setDesignations] = useState<HrDesignation[]>([]);
  const [q, setQ] = useState("");
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState(emptyForm());
  const [saving, setSaving] = useState(false);

  const load = async () => {
    setList(null);
    try {
      const [emps, deps, des] = await Promise.all([fetchEmployees(), fetchDepartments(), fetchDesignations()]);
      setList(emps.items);
      setDepartments(deps.items);
      setDesignations(des.items);
    } catch (e) {
      setList([]);
      toast({ title: "Failed", description: (e as Error).message, variant: "destructive" });
    }
  };

  useEffect(() => {
    load();
  }, []);

  const filtered = useMemo(() => {
    const s = q.toLowerCase();
    return (list ?? []).filter((e) => {
      if (!s) return true;
      return [e.fullName, e.employeeCode, e.phone].filter(Boolean).some((v) => v!.toLowerCase().includes(s));
    });
  }, [list, q]);

  const deptName = (id?: string | null) => departments.find((d) => d.id === id)?.name || "—";
  const desName = (id?: string | null) => designations.find((d) => d.id === id)?.name || "—";

  return (
    <div className="space-y-5">
      <div className="flex items-start justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-2xl md:text-3xl font-extrabold">Employees</h1>
          <p className="text-sm text-muted-foreground">Directory of people in your organization.</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={load}>
            <RefreshCw className="h-4 w-4" />
          </Button>
          <Button
            size="sm"
            onClick={() => {
              setForm(emptyForm());
              setOpen(true);
            }}
          >
            <Plus className="h-4 w-4" /> Add employee
          </Button>
        </div>
      </div>

      <Card>
        <CardContent className="p-4">
          <div className="relative max-w-sm">
            <Search className="h-4 w-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
            <Input className="pl-9" placeholder="Search…" value={q} onChange={(e) => setQ(e.target.value)} />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-0 overflow-x-auto">
          {list === null ? (
            <div className="p-4 space-y-2">
              {Array.from({ length: 4 }).map((_, i) => (
                <Skeleton key={i} className="h-12 w-full" />
              ))}
            </div>
          ) : (
            <table className="w-full text-sm">
              <thead className="bg-muted/50 text-left">
                <tr>
                  {["Code", "Name", "Department", "Designation", "Status"].map((h) => (
                    <th key={h} className="px-4 py-3 text-xs uppercase font-semibold text-muted-foreground">
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filtered.map((e) => (
                  <tr key={e.id} className="border-t hover:bg-muted/30">
                    <td className="px-4 py-3 font-semibold">{e.employeeCode}</td>
                    <td className="px-4 py-3">
                      <div className="font-medium">{e.fullName}</div>
                      <div className="text-xs text-muted-foreground">{e.phone || "—"}</div>
                    </td>
                    <td className="px-4 py-3 text-xs">{deptName(e.departmentId)}</td>
                    <td className="px-4 py-3 text-xs">{desName(e.designationId)}</td>
                    <td className="px-4 py-3">
                      <span className="text-[10px] font-bold uppercase bg-muted px-2 py-1 rounded">{e.employmentStatus}</span>
                    </td>
                  </tr>
                ))}
                {!filtered.length && (
                  <tr>
                    <td colSpan={5} className="text-center py-8 text-muted-foreground text-sm">
                      No employees yet.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          )}
        </CardContent>
      </Card>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Add employee</DialogTitle>
          </DialogHeader>
          <div className="grid sm:grid-cols-2 gap-3">
            {(
              [
                ["firstName", "First name"],
                ["lastName", "Last name"],
                ["email", "Login email"],
                ["password", "Temp password"],
                ["phone", "Phone"],
                ["dateOfJoining", "Date of joining"],
              ] as const
            ).map(([key, label]) => (
              <div key={key} className="space-y-1.5">
                <Label>{label}</Label>
                <Input
                  type={key === "dateOfJoining" ? "date" : key === "password" ? "password" : "text"}
                  value={form[key]}
                  onChange={(e) => setForm({ ...form, [key]: e.target.value })}
                />
              </div>
            ))}
            <div className="space-y-1.5">
              <Label>Department</Label>
              <Select value={form.departmentId || "none"} onValueChange={(v) => setForm({ ...form, departmentId: v === "none" ? "" : v })}>
                <SelectTrigger>
                  <SelectValue placeholder="Select" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="none">None</SelectItem>
                  {departments.map((d) => (
                    <SelectItem key={d.id} value={d.id}>
                      {d.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1.5">
              <Label>Designation</Label>
              <Select value={form.designationId || "none"} onValueChange={(v) => setForm({ ...form, designationId: v === "none" ? "" : v })}>
                <SelectTrigger>
                  <SelectValue placeholder="Select" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="none">None</SelectItem>
                  {designations.map((d) => (
                    <SelectItem key={d.id} value={d.id}>
                      {d.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button variant="ghost" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button
              disabled={saving}
              onClick={async () => {
                setSaving(true);
                try {
                  await createEmployee({
                    ...form,
                    departmentId: form.departmentId || undefined,
                    designationId: form.designationId || undefined,
                  });
                  toast({ title: "Employee created" });
                  setOpen(false);
                  load();
                } catch (e) {
                  toast({ title: "Failed", description: (e as Error).message, variant: "destructive" });
                } finally {
                  setSaving(false);
                }
              }}
            >
              {saving ? "Saving…" : "Save"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
