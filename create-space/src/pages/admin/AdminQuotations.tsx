import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { ArrowRight, Download, FileSpreadsheet, FileText, Pencil, Plus, RefreshCw, Search, Trash2 } from "lucide-react";
import {
  convertQuotationToInvoice,
  createQuotation,
  deleteQuotation,
  fetchCompanySettings,
  fetchCustomers,
  fetchQuotations,
  updateQuotation,
} from "@/lib/admin/crmApi";
import { seedSettings } from "@/lib/admin/seed";
import type { CompanySettings, Customer, DocStatus, Quotation } from "@/lib/admin/types";
import { DocumentEditor, computeTotal, validateDocument } from "./DocumentEditor";
import { downloadDocumentPdf } from "@/lib/admin/documentPdf";
import { exportListToPdf, exportToExcel } from "@/lib/admin/exporters";
import { toast } from "@/hooks/use-toast";
import { Skeleton } from "@/components/ui/skeleton";

const STATUSES: DocStatus[] = ["draft", "sent", "accepted", "expired"];

const empty = (gst: number): Omit<Quotation, "id"> => ({
  number: "",
  customerId: "",
  date: new Date().toISOString().slice(0, 10),
  dueDate: new Date(Date.now() + 14 * 86400000).toISOString().slice(0, 10),
  items: [{ id: crypto.randomUUID(), description: "", qty: 1, rate: 0 }],
  gstPercent: gst,
  status: "draft",
  notes: "",
});

const isExisting = (list: Quotation[] | null, d: Quotation | Omit<Quotation, "id">) =>
  Boolean("id" in d && d.id && list?.some((x) => x.id === d.id));

const AdminQuotations = () => {
  const navigate = useNavigate();
  const [settings, setSettings] = useState<CompanySettings>(seedSettings);
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [list, setList] = useState<Quotation[] | null>(null);
  const [q, setQ] = useState("");
  const [editing, setEditing] = useState<(Quotation | Omit<Quotation, "id">) | null>(null);
  const [saving, setSaving] = useState(false);

  const load = () => {
    setList(null);
    Promise.all([fetchQuotations(), fetchCustomers(), fetchCompanySettings()])
      .then(([qts, cust, s]) => {
        setList(qts);
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
      if (!s) return true;
      const c = customers.find((x) => x.id === d.customerId);
      return [d.number, c?.name, c?.company].filter(Boolean).some((v) => v!.toLowerCase().includes(s));
    });
  }, [list, q, customers]);

  const save = async (d: Quotation | Omit<Quotation, "id">) => {
    const error = validateDocument(d);
    if (error) {
      toast({ title: "Cannot save", description: error, variant: "destructive" });
      return;
    }
    setSaving(true);
    try {
      if (isExisting(list, d)) {
        const upd = await updateQuotation((d as Quotation).id, d);
        setList((ls) => ls?.map((x) => (x.id === upd.id ? upd : x)) ?? null);
      } else {
        const { id: _id, ...body } = d as Quotation;
        const created = await createQuotation(body);
        setList((ls) => [created, ...(ls ?? [])]);
      }
      setEditing(null);
      toast({ title: "Quotation saved" });
    } catch (e) {
      toast({ title: "Failed", description: (e as Error).message, variant: "destructive" });
    } finally {
      setSaving(false);
    }
  };

  const remove = async (id: string) => {
    if (!window.confirm("Delete this quotation?")) return;
    try {
      await deleteQuotation(id);
      setList((ls) => ls?.filter((d) => d.id !== id) ?? null);
      toast({ title: "Deleted" });
    } catch (e) {
      toast({ title: "Failed", description: (e as Error).message, variant: "destructive" });
    }
  };

  const convert = async (qt: Quotation) => {
    try {
      const inv = await convertQuotationToInvoice(qt.id);
      setList((ls) => ls?.map((x) => (x.id === qt.id ? { ...x, status: "accepted" } : x)) ?? null);
      toast({
        title: "Converted to invoice",
        description: `${inv.number} created — open Invoices to collect payment.`,
      });
      navigate("/admin/invoices");
    } catch (e) {
      toast({ title: "Failed", description: (e as Error).message, variant: "destructive" });
    }
  };

  const download = async (d: Quotation) => {
    const c = customers.find((x) => x.id === d.customerId);
    if (!c) {
      toast({ title: "Customer missing", description: "Assign a customer before exporting.", variant: "destructive" });
      return;
    }
    try {
      await downloadDocumentPdf({ kind: "QUOTATION", settings, customer: c, doc: d });
      toast({ title: "PDF downloaded", description: `${d.number || "quotation"}.pdf` });
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
      Status: d.status,
      "Total (₹)": Math.round(computeTotal(d)),
    };
  });

  return (
    <div className="space-y-5">
      <div className="flex items-start justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-2xl md:text-3xl font-extrabold">Quotations</h1>
          <p className="text-sm text-muted-foreground">
            Create branded quotations for customers, export PDF with Zentroverse logo, convert to invoices.
          </p>
        </div>
        <div className="flex gap-2 flex-wrap">
          <Button variant="outline" size="sm" onClick={load} title="Refresh">
            <RefreshCw className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            size="sm"
            disabled={!rows.length}
            onClick={() => exportToExcel(rows, "quotations")}
          >
            <FileSpreadsheet className="h-4 w-4" /> Excel
          </Button>
          <Button
            variant="outline"
            size="sm"
            disabled={!rows.length}
            onClick={() =>
              exportListToPdf(
                "Quotations",
                Object.keys(rows[0] ?? { Number: "" }),
                rows.map((r) => Object.values(r) as (string | number)[]),
                "quotations",
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
                  description: "Create a customer under Customers, then quote them.",
                  variant: "destructive",
                });
                navigate("/admin/customers");
                return;
              }
              setEditing(empty(settings.defaultGstPercent));
            }}
          >
            <Plus className="h-4 w-4" /> New quotation
          </Button>
        </div>
      </div>

      <Card>
        <CardContent className="p-4">
          <div className="relative max-w-sm">
            <Search className="h-4 w-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
            <Input className="pl-9" placeholder="Search number or customer…" value={q} onChange={(e) => setQ(e.target.value)} />
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
                        <span className="text-[10px] font-bold uppercase bg-muted px-2 py-1 rounded">{d.status}</span>
                      </td>
                      <td className="px-4 py-3 font-semibold">₹{Math.round(computeTotal(d)).toLocaleString("en-IN")}</td>
                      <td className="px-4 py-3 flex gap-1 justify-end">
                        <Button size="icon" variant="ghost" onClick={() => download(d)} title="Download PDF">
                          <Download className="h-4 w-4" />
                        </Button>
                        <Button size="icon" variant="ghost" onClick={() => convert(d)} title="Convert to invoice">
                          <ArrowRight className="h-4 w-4" />
                        </Button>
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
                      No quotations yet — create one for a customer.
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
            <DialogTitle>{editing && isExisting(list, editing) ? "Edit quotation" : "New quotation"}</DialogTitle>
          </DialogHeader>
          {editing && (
            <DocumentEditor
              value={editing}
              customers={customers}
              statuses={STATUSES}
              onChange={(v) => setEditing(v as Quotation)}
            />
          )}
          <DialogFooter className="gap-2 sm:gap-0">
            {editing && isExisting(list, editing) && (
              <Button variant="outline" onClick={() => download(editing as Quotation)}>
                <Download className="h-4 w-4" /> Export PDF
              </Button>
            )}
            <Button variant="ghost" onClick={() => setEditing(null)}>
              Cancel
            </Button>
            <Button disabled={saving} onClick={() => editing && save(editing)}>
              {saving ? "Saving…" : "Save quotation"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AdminQuotations;
