import { useEffect, useMemo, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Download, FileSpreadsheet, FileText, RefreshCw, Search } from "lucide-react";
import { fetchCompanySettings, fetchCustomers, fetchInvoices, fetchReceipts } from "@/lib/admin/crmApi";
import { seedSettings } from "@/lib/admin/seed";
import type { CompanySettings, Customer, Invoice, Receipt } from "@/lib/admin/types";
import { downloadDocumentPdf } from "@/lib/admin/documentPdf";
import { exportListToPdf, exportToExcel } from "@/lib/admin/exporters";
import { toast } from "@/hooks/use-toast";
import { Skeleton } from "@/components/ui/skeleton";

const AdminReceipts = () => {
  const [settings, setSettings] = useState<CompanySettings>(seedSettings);
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [receipts, setReceipts] = useState<Receipt[] | null>(null);
  const [q, setQ] = useState("");

  const load = () => {
    setReceipts(null);
    Promise.all([fetchReceipts(), fetchCustomers(), fetchInvoices(), fetchCompanySettings()])
      .then(([r, c, i, s]) => {
        setReceipts(r);
        setCustomers(c);
        setInvoices(i);
        setSettings(s);
      })
      .catch((e) => {
        setReceipts([]);
        toast({ title: "Failed to load", description: e.message, variant: "destructive" });
      });
  };
  useEffect(() => {
    load();
  }, []);

  const filtered = useMemo(() => {
    const s = q.toLowerCase();
    return (receipts ?? []).filter((r) => {
      if (!s) return true;
      const c = customers.find((x) => x.id === r.customerId);
      return [r.number, c?.name, c?.company].filter(Boolean).some((v) => v!.toLowerCase().includes(s));
    });
  }, [receipts, q, customers]);

  const download = async (r: Receipt) => {
    const inv = invoices.find((i) => i.id === r.invoiceId);
    const c = customers.find((x) => x.id === r.customerId);
    if (!inv) {
      toast({
        title: "Invoice missing",
        description: "Linked invoice was not found for this receipt.",
        variant: "destructive",
      });
      return;
    }
    try {
      await downloadDocumentPdf({ kind: "RECEIPT", settings, customer: c, doc: inv, receipt: r });
      toast({ title: "PDF downloaded", description: `${r.number}.pdf` });
    } catch (e) {
      toast({ title: "Export failed", description: (e as Error).message, variant: "destructive" });
    }
  };

  const rows = filtered.map((r) => {
    const c = customers.find((x) => x.id === r.customerId);
    return {
      Number: r.number,
      Customer: c?.company || c?.name || "—",
      Amount: r.amount,
      Mode: r.mode,
      Date: r.date,
    };
  });

  return (
    <div className="space-y-5">
      <div className="flex items-start justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-2xl md:text-3xl font-extrabold">Receipts</h1>
          <p className="text-sm text-muted-foreground">
            Generated when invoices are marked as paid. Export branded PDFs with the Zentroverse logo.
          </p>
        </div>
        <div className="flex gap-2 flex-wrap">
          <Button variant="outline" size="sm" onClick={load} title="Refresh">
            <RefreshCw className="h-4 w-4" />
          </Button>
          <Button variant="outline" size="sm" disabled={!rows.length} onClick={() => exportToExcel(rows, "receipts")}>
            <FileSpreadsheet className="h-4 w-4" /> Excel
          </Button>
          <Button
            variant="outline"
            size="sm"
            disabled={!rows.length}
            onClick={() =>
              exportListToPdf(
                "Receipts",
                Object.keys(rows[0] ?? { Number: "" }),
                rows.map((r) => Object.values(r) as (string | number)[]),
                "receipts",
              )
            }
          >
            <FileText className="h-4 w-4" /> PDF list
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
          {receipts === null ? (
            <div className="p-4 space-y-2">
              {Array.from({ length: 4 }).map((_, i) => (
                <Skeleton key={i} className="h-12 w-full" />
              ))}
            </div>
          ) : (
            <table className="w-full text-sm">
              <thead className="bg-muted/50 text-left">
                <tr>
                  {["Number", "Customer", "Amount", "Mode", "Date", ""].map((h) => (
                    <th key={h} className="px-4 py-3 text-xs uppercase font-semibold text-muted-foreground">
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filtered.map((r) => {
                  const c = customers.find((x) => x.id === r.customerId);
                  return (
                    <tr key={r.id} className="border-t hover:bg-muted/30">
                      <td className="px-4 py-3 font-semibold">{r.number}</td>
                      <td className="px-4 py-3 text-xs">{c?.company || c?.name || "—"}</td>
                      <td className="px-4 py-3 font-semibold">₹{r.amount.toLocaleString("en-IN")}</td>
                      <td className="px-4 py-3 text-xs">{r.mode}</td>
                      <td className="px-4 py-3 text-xs">{new Date(r.date).toLocaleDateString("en-IN")}</td>
                      <td className="px-4 py-3 text-right">
                        <Button size="sm" variant="outline" onClick={() => download(r)}>
                          <Download className="h-4 w-4" /> PDF
                        </Button>
                      </td>
                    </tr>
                  );
                })}
                {filtered.length === 0 && (
                  <tr>
                    <td colSpan={6} className="text-center py-8 text-muted-foreground text-sm">
                      No receipts yet — mark an invoice as paid.
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
};

export default AdminReceipts;
