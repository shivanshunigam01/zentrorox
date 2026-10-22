import { useEffect, useMemo, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { FileSpreadsheet, FileText, Pencil, Plus, RefreshCw, Search, Trash2 } from "lucide-react";
import { createCustomer, deleteCustomer, fetchCustomers, updateCustomer } from "@/lib/admin/crmApi";
import type { Customer } from "@/lib/admin/types";
import { exportListToPdf, exportToExcel } from "@/lib/admin/exporters";
import { toast } from "@/hooks/use-toast";
import { Skeleton } from "@/components/ui/skeleton";

const empty = (): Omit<Customer, "id"> & { id?: string } => ({
  name: "", company: "", gstin: "", phone: "", email: "", city: "", address: "", totalSpend: 0, createdAt: new Date().toISOString().slice(0, 10),
});

const AdminCustomers = () => {
  const [list, setList] = useState<Customer[] | null>(null);
  const [q, setQ] = useState("");
  const [cityFilter, setCityFilter] = useState("all");
  const [editing, setEditing] = useState<(Customer | (Omit<Customer, "id"> & { id?: string })) | null>(null);

  const load = () => {
    setList(null);
    fetchCustomers().then(setList).catch((e) => toast({ title: "Failed to load", description: e.message, variant: "destructive" }));
  };
  useEffect(() => { load(); }, []);

  const cities = useMemo(() => Array.from(new Set((list ?? []).map((c) => c.city).filter(Boolean))), [list]);
  const filtered = useMemo(() => {
    const s = q.toLowerCase();
    return (list ?? []).filter((c) => {
      if (cityFilter !== "all" && c.city !== cityFilter) return false;
      if (!s) return true;
      return [c.name, c.company, c.email, c.phone, c.gstin].some((v) => v.toLowerCase().includes(s));
    });
  }, [list, q, cityFilter]);

  const save = async (c: Customer | (Omit<Customer, "id"> & { id?: string })) => {
    try {
      if (c.id && list?.some((x) => x.id === c.id)) {
        const upd = await updateCustomer(c.id, c);
        setList((ls) => ls?.map((x) => x.id === c.id ? upd : x) ?? null);
      } else {
        const { id: _id, ...body } = c as Customer;
        const created = await createCustomer(body);
        setList((ls) => [created, ...(ls ?? [])]);
      }
      setEditing(null);
      toast({ title: "Customer saved" });
    } catch (e) {
      toast({ title: "Failed", description: (e as Error).message, variant: "destructive" });
    }
  };

  const remove = async (id: string) => {
    try {
      await deleteCustomer(id);
      setList((ls) => ls?.filter((c) => c.id !== id) ?? null);
      toast({ title: "Customer deleted" });
    } catch (e) {
      toast({ title: "Failed", description: (e as Error).message, variant: "destructive" });
    }
  };

  const rows = filtered.map((c) => ({
    Name: c.name, Company: c.company, GSTIN: c.gstin, Phone: c.phone, Email: c.email, City: c.city, "Total Spend (₹)": c.totalSpend,
  }));

  return (
    <div className="space-y-5">
      <div className="flex items-start justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-2xl md:text-3xl font-extrabold">Customers</h1>
          <p className="text-sm text-muted-foreground">Manage your customer accounts.</p>
        </div>
        <div className="flex gap-2 flex-wrap">
          <Button variant="outline" size="sm" onClick={load}><RefreshCw className="h-4 w-4" /></Button>
          <Button variant="outline" size="sm" disabled={!rows.length} onClick={() => exportToExcel(rows, "zentroverse-customers")}>
            <FileSpreadsheet className="h-4 w-4" /> Excel
          </Button>
          <Button variant="outline" size="sm" disabled={!rows.length} onClick={() => exportListToPdf("Customers", Object.keys(rows[0] ?? { Name: "" }), rows.map((r) => Object.values(r) as (string | number)[]), "zentroverse-customers")}>
            <FileText className="h-4 w-4" /> PDF
          </Button>
          <Button size="sm" onClick={() => setEditing(empty())}><Plus className="h-4 w-4" /> New customer</Button>
        </div>
      </div>

      <Card>
        <CardContent className="p-4 grid sm:grid-cols-3 gap-3">
          <div className="relative sm:col-span-2">
            <Search className="h-4 w-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
            <Input placeholder="Search name, company, email…" value={q} onChange={(e) => setQ(e.target.value)} className="pl-9" />
          </div>
          <Select value={cityFilter} onValueChange={setCityFilter}>
            <SelectTrigger><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All cities</SelectItem>
              {cities.map((c) => <SelectItem key={c} value={c}>{c}</SelectItem>)}
            </SelectContent>
          </Select>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-0 overflow-x-auto">
          {list === null ? (
            <div className="p-4 space-y-2">{Array.from({ length: 4 }).map((_, i) => <Skeleton key={i} className="h-12 w-full" />)}</div>
          ) : (
            <table className="w-full text-sm">
              <thead className="bg-muted/50 text-left">
                <tr>{["Customer", "Company", "Contact", "City", "Spend", ""].map((h) => <th key={h} className="px-4 py-3 text-xs uppercase font-semibold text-muted-foreground">{h}</th>)}</tr>
              </thead>
              <tbody>
                {filtered.map((c) => (
                  <tr key={c.id} className="border-t hover:bg-muted/30">
                    <td className="px-4 py-3"><div className="font-medium">{c.name}</div><div className="text-xs text-muted-foreground">{c.gstin}</div></td>
                    <td className="px-4 py-3 text-xs">{c.company}</td>
                    <td className="px-4 py-3 text-xs"><div>{c.email}</div><div className="text-muted-foreground">{c.phone}</div></td>
                    <td className="px-4 py-3 text-xs">{c.city}</td>
                    <td className="px-4 py-3 text-xs font-semibold">₹{c.totalSpend.toLocaleString("en-IN")}</td>
                    <td className="px-4 py-3 flex gap-1">
                      <Button size="icon" variant="ghost" onClick={() => setEditing(c)}><Pencil className="h-4 w-4" /></Button>
                      <Button size="icon" variant="ghost" onClick={() => remove(c.id)}><Trash2 className="h-4 w-4" /></Button>
                    </td>
                  </tr>
                ))}
                {filtered.length === 0 && <tr><td colSpan={6} className="text-center py-8 text-muted-foreground text-sm">No customers</td></tr>}
              </tbody>
            </table>
          )}
        </CardContent>
      </Card>

      <Dialog open={!!editing} onOpenChange={(v) => !v && setEditing(null)}>
        <DialogContent className="max-w-xl">
          <DialogHeader><DialogTitle>{editing && "id" in editing && editing.id ? "Edit customer" : "New customer"}</DialogTitle></DialogHeader>
          {editing && <CustomerForm value={editing as Customer} onChange={setEditing} />}
          <DialogFooter>
            <Button variant="ghost" onClick={() => setEditing(null)}>Cancel</Button>
            <Button onClick={() => editing && save(editing)}>Save</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

const CustomerForm = ({ value, onChange }: { value: Customer; onChange: (v: Customer) => void }) => {
  const set = <K extends keyof Customer>(k: K, v: Customer[K]) => onChange({ ...value, [k]: v });
  return (
    <div className="grid sm:grid-cols-2 gap-3">
      <Field label="Name"><Input value={value.name} onChange={(e) => set("name", e.target.value)} /></Field>
      <Field label="Company"><Input value={value.company} onChange={(e) => set("company", e.target.value)} /></Field>
      <Field label="GSTIN"><Input value={value.gstin} onChange={(e) => set("gstin", e.target.value)} /></Field>
      <Field label="City"><Input value={value.city} onChange={(e) => set("city", e.target.value)} /></Field>
      <Field label="Phone"><Input value={value.phone} onChange={(e) => set("phone", e.target.value)} /></Field>
      <Field label="Email"><Input value={value.email} onChange={(e) => set("email", e.target.value)} /></Field>
      <Field label="Address" full><Input value={value.address} onChange={(e) => set("address", e.target.value)} /></Field>
      <Field label="Total Spend (₹)"><Input type="number" value={value.totalSpend} onChange={(e) => set("totalSpend", Number(e.target.value))} /></Field>
    </div>
  );
};

const Field = ({ label, children, full }: { label: string; children: React.ReactNode; full?: boolean }) => (
  <div className={`space-y-1.5 ${full ? "sm:col-span-2" : ""}`}>
    <Label>{label}</Label>
    {children}
  </div>
);

export default AdminCustomers;
