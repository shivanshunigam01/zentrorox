import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { CheckCircle2, Download, FileSpreadsheet, FileText, Pencil, Plus, RefreshCw, Search, Trash2 } from "lucide-react";
import {
  createInvoice,
  deleteInvoice,
  fetchCompanySettings,
  fetchCustomers,
  fetchInvoices,
  markInvoicePaid,
  updateInvoice,
} from "@/lib/admin/crmApi";
import { seedSettings } from "@/lib/admin/seed";
import type { CompanySettings, Customer, DocStatus, Invoice, Receipt } from "@/lib/admin/types";
import { DocumentEditor, computeTotal, validateDocument } from "./DocumentEditor";
import { downloadDocumentPdf } from "@/lib/admin/documentPdf";
import { exportListToPdf, exportToExcel } from "@/lib/admin/exporters";
import { toast } from "@/hooks/use-toast";
import { Skeleton } from "@/components/ui/skeleton";

const STATUSES: DocStatus[] = ["draft", "sent", "paid", "overdue"];
const PAY_MODES: Receipt["mode"][] = ["Bank Transfer", "UPI", "Cash", "Cheque", "Card"];

const empty = (gst: number): Omit<Invoice, "id"> => ({
  number: "",
  customerId: "",
  date: new Date().toISOString().slice(0, 10),
  dueDate: new Date(Date.now() + 14 * 86400000).toISOString().slice(0, 10),
  items: [{ id: crypto.randomUUID(), description: "", qty: 1, rate: 0 }],
  gstPercent: gst,
  status: "draft",
  notes: "",
});

const isExisting = (list: Invoice[] | null, d: Invoice | Omit<Invoice, "id">) =>
  Boolean("id" in d && d.id && list?.some((x) => x.id === d.id));

const AdminInvoices = () => {
  const navigate = useNavigate();
  const [settings, setSettings] = useState<CompanySettings>(seedSettings);
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [list, setList] = useState<Invoice[] | null>(null);
  const [q, setQ] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [editing, setEditing] = useState<(Invoice | Omit<Invoice, "id">) | null>(null);
  const [payTarget, setPayTarget] = useState<Invoice | null>(null);
  const [payMode, setPayMode] = useState<Receipt["mode"]>("Bank Transfer");
  const [saving, setSaving] = useState(false);
  const [paying, setPaying] = useState(false);

  const load = () => {
    setList(null);
    Promise.all([fetchInvoices(), fetchCustomers(), fetchCompanySettings()])
      .then(([invoices, cust, s]) => {
        setList(invoices);
        setCustomers(cust);
        setSettings(s);
      })
      .catch((e) => {
        setList([]);
        toast({ title: "Failed to load", description: e.message, variant: "destructive" });
      });
  };
  useEffect(() => {
    load();
  }, []);

  const filtered = useMemo(() => {
    const s = q.toLowerCase();
    return (list ?? []).filter((d) => {
      if (statusFilter !== "all" && d.status !== statusFilter) return false;
      if (!s) return true;
      const c = customers.find((x) => x.id === d.customerId);
      return [d.number, c?.name, c?.company].filter(Boolean).some((v) => v!.toLowerCase().includes(s));
    });
  }, [list, q, statusFilter, customers]);

  const save = async (d: Invoice | Omit<Invoice, "id">) => {
    const error = validateDocument(d);
    if (error) {
      toast({ title: "Cannot save", description: error, variant: "destructive" });
      return;
    }
    setSaving(true);
    try {
      if (isExisting(list, d)) {
        const upd = await updateInvoice((d as Invoice).id, d);
        setList((ls) => ls?.map((x) => (x.id === upd.id ? upd : x)) ?? null);
      } else {
        const { id: _id, ...body } = d as Invoice;
        const created = await createInvoice(body);
        setList((ls) => [created, ...(ls ?? [])]);
      }
      setEditing(null);
      toast({ title: "Invoice saved" });
    } catch (e) {
      toast({ title: "Failed", description: (e as Error).message, variant: "destructive" });
    } finally {
      setSaving(false);
    }
  };

  const remove = async (id: string) => {
    if (!window.confirm("Delete this invoice?")) return;
    try {
      await deleteInvoice(id);
      setList((ls) => ls?.filter((d) => d.id !== id) ?? null);
      toast({ title: "Deleted" });
    } catch (e) {
      toast({ title: "Failed", description: (e as Error).message, variant: "destructive" });
    }
  };

  const confirmPaid = async () => {
    if (!payTarget) return;
    setPaying(true);
    try {
      const result = await markInvoicePaid(payTarget.id, payMode);
      setList((ls) => ls?.map((x) => (x.id === payTarget.id ? result.invoice : x)) ?? null);
      setPayTarget(null);
      toast({
        title: "Marked as paid",
        description: `Receipt ${result.receipt.number} generated.`,
      });
      navigate("/admin/receipts");
    } catch (e) {
      toast({ title: "Failed", description: (e as Error).message, variant: "destructive" });
    } finally {
      setPaying(false);
    }
  };

  const download = async (d: Invoice) => {
    const c = customers.find((x) => x.id === d.customerId);
    if (!c) {
      toast({ title: "Customer missing", description: "Assign a customer before exporting.", variant: "destructive" });
      return;
    }
    try {
      await downloadDocumentPdf({ kind: "INVOICE", settings, customer: c, doc: d });
      toast({ title: "PDF downloaded", description: `${d.number || "invoice"}.pdf` });
    } catch (e) {
      toast({ title: "Export failed", description: (e as Error).message, variant: "destructive" });
    }
  };

  const rows = filtered.map((d) => {
    const c = customers.find((x) => x.id === d.customerId);
    return {
      Number: d.number,
      Customer: c?.company || c?.name || "—",
      Date: d.date,
      Due: d.dueDate ?? "",
      Status: d.status,
      "Total (₹)": Math.round(computeTotal(d)),
    };
  });

  return (
    <div className="space-y-5">
      <div className="flex items-start justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-2xl md:text-3xl font-extrabold">Invoices</h1>
          <p className="text-sm text-muted-foreground">
            Bill customers, export branded PDFs, mark paid to generate receipts.
          </p>
        </div>
        <div className="flex gap-2 flex-wrap">
          <Button variant="outline" size="sm" onClick={load} title="Refresh">
            <RefreshCw className="h-4 w-4" />
          </Button>
          <Button variant="outline" size="sm" disabled={!rows.length} onClick={() => exportToExcel(rows, "invoices")}>
            <FileSpreadsheet className="h-4 w-4" /> Excel
          </Button>
          <Button
            variant="outline"
            size="sm"
            disabled={!rows.length}
            onClick={() =>
              exportListToPdf(
                "Invoices",
                Object.keys(rows[0] ?? { Number: "" }),
                rows.map((r) => Object.values(r) as (string | number)[]),
                "invoices",
              )
            }
          >
            <FileText className="h-4 w-4" /> PDF list
          </Button>
          <Button
            size="sm"
            onClick={() => {
              if (!customers.length) {
                toast({
                  title: "Add a customer first",
                  description: "Create a customer under Customers, then invoice them.",
                  variant: "destructive",
                });
                navigate("/admin/customers");
                return;
              }
              setEditing(empty(settings.defaultGstPercent));
            }}
          >
            <Plus className="h-4 w-4" /> New invoice
          </Button>
        </div>
      </div>

      <Card>
        <CardContent className="p-4 grid sm:grid-cols-3 gap-3">
          <div className="relative sm:col-span-2">
            <Search className="h-4 w-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
            <Input className="pl-9" placeholder="Search number or customer…" value={q} onChange={(e) => setQ(e.target.value)} />
          </div>
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All statuses</SelectItem>
              {STATUSES.map((s) => (
                <SelectItem key={s} value={s}>
                  {s}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
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
                  {["Number", "Customer", "Date", "Status", "Total", ""].map((h) => (
                    <th key={h} className="px-4 py-3 text-xs uppercase font-semibold text-muted-foreground">
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filtered.map((d) => {
                  const c = customers.find((x) => x.id === d.customerId);
                  return (
                    <tr key={d.id} className="border-t hover:bg-muted/30">
                      <td className="px-4 py-3 font-semibold">{d.number}</td>
                      <td className="px-4 py-3 text-xs">{c?.company || c?.name || "—"}</td>
                      <td className="px-4 py-3 text-xs">{new Date(d.date).toLocaleDateString("en-IN")}</td>
                      <td className="px-4 py-3">
                        <span
                          className={`text-[10px] font-bold uppercase px-2 py-1 rounded ${
                            d.status === "paid" ? "bg-emerald-100 text-emerald-800" : "bg-muted"
                          }`}
                        >
                          {d.status}
                        </span>
                      </td>
                      <td className="px-4 py-3 font-semibold">₹{Math.round(computeTotal(d)).toLocaleString("en-IN")}</td>
                      <td className="px-4 py-3 flex gap-1 justify-end">
                        <Button size="icon" variant="ghost" onClick={() => download(d)} title="Download PDF">
                          <Download className="h-4 w-4" />
                        </Button>
                        {d.status !== "paid" && (
                          <Button
                            size="icon"
                            variant="ghost"
                            onClick={() => {
                              setPayMode("Bank Transfer");
                              setPayTarget(d);
                            }}
                            title="Mark paid"
                          >
                            <CheckCircle2 className="h-4 w-4" />
                          </Button>
                        )}
                        <Button size="icon" variant="ghost" onClick={() => setEditing(d)} title="Edit">
                          <Pencil className="h-4 w-4" />
                        </Button>
                        <Button size="icon" variant="ghost" onClick={() => remove(d.id)} title="Delete">
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </td>
                    </tr>
                  );
                })}
                {filtered.length === 0 && (
                  <tr>
                    <td colSpan={6} className="text-center py-8 text-muted-foreground text-sm">
                      No invoices yet — create one or convert a quotation.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          )}
        </CardContent>
      </Card>

      <Dialog open={!!editing} onOpenChange={(v) => !v && setEditing(null)}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{editing && isExisting(list, editing) ? "Edit invoice" : "New invoice"}</DialogTitle>
          </DialogHeader>
          {editing && (
            <DocumentEditor
              value={editing}
              customers={customers}
              statuses={STATUSES}
              onChange={(v) => setEditing(v as Invoice)}
            />
          )}
          <DialogFooter className="gap-2 sm:gap-0">
            {editing && isExisting(list, editing) && (
              <Button variant="outline" onClick={() => download(editing as Invoice)}>
                <Download className="h-4 w-4" /> Export PDF
              </Button>
            )}
            <Button variant="ghost" onClick={() => setEditing(null)}>
              Cancel
            </Button>
            <Button disabled={saving} onClick={() => editing && save(editing)}>
              {saving ? "Saving…" : "Save invoice"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={!!payTarget} onOpenChange={(v) => !v && setPayTarget(null)}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Mark invoice paid</DialogTitle>
          </DialogHeader>
          {payTarget && (
            <div className="space-y-3 text-sm">
              <p>
                <span className="font-semibold">{payTarget.number}</span> — ₹
                {Math.round(computeTotal(payTarget)).toLocaleString("en-IN")}
              </p>
              <p className="text-muted-foreground">A payment receipt will be generated automatically.</p>
              <div className="space-y-1.5">
                <Label>Payment mode</Label>
                <Select value={payMode} onValueChange={(v) => setPayMode(v as Receipt["mode"])}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {PAY_MODES.map((m) => (
                      <SelectItem key={m} value={m}>
                        {m}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="ghost" onClick={() => setPayTarget(null)}>
              Cancel
            </Button>
            <Button disabled={paying} onClick={confirmPaid}>
              {paying ? "Recording…" : "Confirm paid"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AdminInvoices;
