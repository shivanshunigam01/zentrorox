import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  CheckCircle2,
  Copy,
  Download,
  ExternalLink,
  FileSpreadsheet,
  Gift,
  LogOut,
  MessageSquare,
  MousePointerClick,
  RefreshCw,
  Send,
  Trash2,
  Upload,
  XCircle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { toast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";
import { hyOffersLogout, isHyOffersAuthed } from "@/lib/hyOffers/auth";
import { mergeCustomers, parseHyOffersExcel } from "@/lib/hyOffers/parseExcel";
import {
  BRANCH_SHEET_SOURCES,
  downloadBranchSheet,
  loadBundledBranchSheets,
} from "@/lib/hyOffers/branchSheets";
import {
  clearCustomers,
  getCustomers,
  OFFER_AMOUNTS,
  publicReferralPath,
  setCustomers,
} from "@/lib/hyOffers/store";
import { BRANCH_ORDER, BRANCHES, branchFromReferralCode, type BranchCode } from "@/lib/hyOffers/branches";
import type { HyOfferCustomer } from "@/lib/hyOffers/types";
import { sendBulkWhatsApp } from "@/lib/hyOffers/whatsappApi";
import { fetchBulkWhatsAppReport, type HyOffersReport } from "@/lib/hyOffers/reportApi";
import logo from "@/assets/zentroverse-logo.jpg";

const statusBadge = (status: HyOfferCustomer["deliveryStatus"]) => {
  switch (status) {
    case "delivered":
      return <Badge className="bg-emerald-600 hover:bg-emerald-600">Delivered</Badge>;
    case "failed":
      return <Badge variant="destructive">Failed</Badge>;
    case "queued":
      return <Badge className="bg-amber-500 hover:bg-amber-500">Queued</Badge>;
    case "read":
      return <Badge className="bg-sky-600 hover:bg-sky-600">Read</Badge>;
    default:
      return <Badge variant="secondary">Pending</Badge>;
  }
};

const TABLE_PAGE_SIZE = 100;
const LINKS_PAGE_SIZE = 25;

const HyOffersDashboard = () => {
  const navigate = useNavigate();
  const fileRef = useRef<HTMLInputElement>(null);
  const [customers, setCustomersState] = useState<HyOfferCustomer[]>([]);
  const [importing, setImporting] = useState(false);
  const [sending, setSending] = useState(false);
  const [sendProgress, setSendProgress] = useState({ done: 0, total: 0 });
  const [report, setReport] = useState<HyOffersReport | null>(null);
  const [reportLoading, setReportLoading] = useState(false);
  const [tableBranch, setTableBranch] = useState<"ALL" | BranchCode>("ALL");
  const [tablePage, setTablePage] = useState(0);
  const [branchPages, setBranchPages] = useState<Record<BranchCode, number>>({
    BR: 0,
    TR: 0,
    HY: 0,
  });
  const autoLoaded = useRef(false);

  const refresh = useCallback(() => {
    setCustomersState(getCustomers());
  }, []);

  const commitCustomers = useCallback(
    (parsed: HyOfferCustomer[], description: string, errors: string[], quiet = false) => {
      setCustomers(parsed);
      setCustomersState(parsed);
      setReport(null);
      setTableBranch("ALL");
      setTablePage(0);
      setBranchPages({ BR: 0, TR: 0, HY: 0 });
      if (!quiet) {
        toast({
          title: `Loaded ${parsed.length.toLocaleString()} customers`,
          description: errors.length ? `${errors.length} warning(s). ${description}` : description,
        });
      }
      if (errors.length) console.warn("HY Offers import warnings", errors);
      return true;
    },
    [],
  );

  const loadBundled = useCallback(
    async (quiet = false) => {
      setImporting(true);
      try {
        const { customers: parsed, perBranch, errors } = await loadBundledBranchSheets();
        if (!parsed.length) {
          if (!quiet) {
            toast({
              title: "Load failed",
              description: errors[0] ?? "No branch sheets found.",
              variant: "destructive",
            });
          }
          return;
        }
        const summary = perBranch
          .map((b) => `${b.branch} ${b.count.toLocaleString()}`)
          .join(" · ");
        commitCustomers(parsed, `BR / TR / HY sheets · ${summary}`, errors, quiet);
      } catch (err) {
        console.error(err);
        if (!quiet) {
          toast({ title: "Could not load branch sheets", variant: "destructive" });
        }
      } finally {
        setImporting(false);
      }
    },
    [commitCustomers],
  );

  useEffect(() => {
    if (!isHyOffersAuthed()) {
      navigate("/hy_offers/login", { replace: true });
      return;
    }
    if (autoLoaded.current) return;
    autoLoaded.current = true;
    // Replace any old demo / cached list with the three uploaded branch sheets.
    void loadBundled(true);
  }, [navigate, loadBundled]);

  const stats = useMemo(() => {
    const total = customers.length;
    const delivered = customers.filter((c) => c.deliveryStatus === "delivered").length;
    const failed = customers.filter((c) => c.deliveryStatus === "failed").length;
    const clicked = customers.filter((c) => c.linkClicked).length;
    const submitted = customers.filter((c) => c.formSubmitted).length;
    return { total, delivered, failed, clicked, submitted };
  }, [customers]);

  const customersByBranch = useMemo(() => {
    const map: Record<BranchCode, HyOfferCustomer[]> = { BR: [], TR: [], HY: [] };
    for (const c of customers) {
      const b = branchFromReferralCode(c.referralCode);
      if (b) map[b].push(c);
    }
    return map;
  }, [customers]);

  const countsByBranch = useMemo(
    () => ({
      BR: customersByBranch.BR.length,
      TR: customersByBranch.TR.length,
      HY: customersByBranch.HY.length,
    }),
    [customersByBranch],
  );

  const filteredCustomers = useMemo(() => {
    if (tableBranch === "ALL") return customers;
    return customersByBranch[tableBranch];
  }, [customers, tableBranch, customersByBranch]);

  const tablePageCount = Math.max(1, Math.ceil(filteredCustomers.length / TABLE_PAGE_SIZE));
  const pagedCustomers = useMemo(() => {
    const page = Math.min(tablePage, tablePageCount - 1);
    const start = page * TABLE_PAGE_SIZE;
    return filteredCustomers.slice(start, start + TABLE_PAGE_SIZE);
  }, [filteredCustomers, tablePage, tablePageCount]);

  const onPickFiles = async (fileList: FileList | null) => {
    if (!fileList?.length) return;
    setImporting(true);
    try {
      const files = Array.from(fileList);
      const lists: HyOfferCustomer[][] = [];
      const errors: string[] = [];
      for (const file of files) {
        const { customers: parsed, errors: fileErrors, sheetName } = await parseHyOffersExcel(file);
        if (!parsed.length) {
          errors.push(`${file.name}: ${fileErrors[0] ?? "No rows found."}`);
          continue;
        }
        lists.push(parsed);
        errors.push(
          ...fileErrors.map((e) => `${file.name}${sheetName ? ` [${sheetName}]` : ""}: ${e}`),
        );
      }
      const merged = mergeCustomers(...lists);
      if (!merged.length) {
        toast({
          title: "Import failed",
          description: errors[0] ?? "No rows found.",
          variant: "destructive",
        });
        return;
      }
      commitCustomers(
        merged,
        files.length > 1
          ? `Merged ${files.length} files · Sheet1 of each workbook.`
          : `From ${files[0].name} · first sheet.`,
        errors.filter((e) => e.includes("skipped") || e.includes("incomplete") || e.includes("duplicate")),
      );
    } catch (err) {
      console.error(err);
      toast({ title: "Could not read Excel", variant: "destructive" });
    } finally {
      setImporting(false);
      if (fileRef.current) fileRef.current.value = "";
    }
  };

  const onBulkSend = async () => {
    if (!customers.length) {
      toast({ title: "Import an Excel file first", variant: "destructive" });
      return;
    }
    setSending(true);
    setSendProgress({ done: 0, total: customers.length });
    try {
      const result = await sendBulkWhatsApp((p) => {
        setSendProgress({ done: p.done, total: p.total });
        setCustomersState(getCustomers());
      });
      refresh();
      toast({
        title: "Bulk messages sent (stub)",
        description: `${result.delivered} delivered · ${result.failed} failed. Wire real WhatsApp API later.`,
      });
      const r = await fetchBulkWhatsAppReport();
      setReport(r);
    } finally {
      setSending(false);
    }
  };

  const onLoadReport = async () => {
    setReportLoading(true);
    try {
      const r = await fetchBulkWhatsAppReport();
      setReport(r);
      toast({ title: "Report refreshed" });
    } finally {
      setReportLoading(false);
    }
  };

  const onClear = () => {
    clearCustomers();
    setCustomersState([]);
    setReport(null);
    setTablePage(0);
    setTableBranch("ALL");
    setBranchPages({ BR: 0, TR: 0, HY: 0 });
    toast({ title: "List cleared" });
  };

  const handleLogout = () => {
    hyOffersLogout();
    navigate("/hy_offers/login", { replace: true });
  };

  const progressPct =
    sendProgress.total > 0 ? Math.round((sendProgress.done / sendProgress.total) * 100) : 0;

  return (
    <div className="min-h-screen bg-gradient-mesh">
      <header className="sticky top-0 z-20 border-b border-border/80 bg-card/90 backdrop-blur">
        <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between gap-3">
          <div className="flex items-center gap-3 min-w-0">
            <img src={logo} alt="" className="h-9 w-9 rounded-lg object-cover" />
            <div className="h-9 w-9 rounded-lg bg-white border border-border p-1 flex items-center justify-center shrink-0">
              <img src="/images/pulsar/bajaj-logo.png" alt="Bajaj" className="h-full w-full object-contain" />
            </div>
            <div className="min-w-0">
              <div className="brand-wordmark text-[0.62rem] text-foreground">Zentroverse</div>
              <div className="text-sm font-bold flex items-center gap-1.5 truncate">
                <Gift className="h-3.5 w-3.5 text-primary shrink-0" />
                HY Offers · Pulsar
              </div>
            </div>
          </div>
          <Button variant="outline" size="sm" onClick={handleLogout}>
            <LogOut className="h-4 w-4" />
            Logout
          </Button>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-8 space-y-8">
        <section className="space-y-2">
          <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight">
            Bulk WhatsApp <span className="gradient-text">referral campaign</span>
          </h1>
          <p className="text-muted-foreground max-w-2xl text-sm md:text-base">
            Dashboard loads Brite, Tirhut, and HY sheets automatically — preview recipients, start
            bulk messaging, then track delivery, link clicks, and form submissions.
          </p>
        </section>

        {/* Step cards */}
        <section className="grid md:grid-cols-3 gap-4">
          {[
            { step: "1", title: "Sign in", done: true, desc: "Authenticated session" },
            {
              step: "2",
              title: "Branch sheets",
              done: customers.length > 0,
              desc: "Brite · Tirhut · HY loaded",
            },
            {
              step: "3",
              title: "Bulk + Report",
              done: customers.some((c) => c.deliveryStatus !== "pending"),
              desc: "Send messages & track outcomes",
            },
          ].map((s) => (
            <div
              key={s.step}
              className={cn(
                "rounded-2xl border bg-card p-4 shadow-soft",
                s.done ? "border-primary/30" : "border-border",
              )}
            >
              <div className="flex items-center gap-2 mb-1">
                <span
                  className={cn(
                    "h-7 w-7 rounded-full text-xs font-bold flex items-center justify-center",
                    s.done ? "bg-gradient-primary text-white" : "bg-muted text-muted-foreground",
                  )}
                >
                  {s.done ? <CheckCircle2 className="h-4 w-4" /> : s.step}
                </span>
                <span className="font-semibold">{s.title}</span>
              </div>
              <p className="text-xs text-muted-foreground pl-9">{s.desc}</p>
            </div>
          ))}
        </section>

        {/* Three branch sections — data + download after login */}
        <section className="space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-2">
            <div>
              <h2 className="text-lg font-bold">Branch sheets</h2>
              <p className="text-sm text-muted-foreground mt-1">
                Brite · Tirhut · HY loaded after login · ₹{OFFER_AMOUNTS.friend} voucher ·{" "}
                {importing && customers.length === 0
                  ? "loading…"
                  : `${customers.length.toLocaleString()} customers`}
              </p>
            </div>
            <div className="flex flex-wrap gap-2">
              {BRANCH_SHEET_SOURCES.map((src) => (
                <Button
                  key={src.branch}
                  size="sm"
                  variant="outline"
                  onClick={() => {
                    downloadBranchSheet(src.branch);
                    toast({
                      title: "Downloading",
                      description: src.excelLabel,
                    });
                  }}
                >
                  <Download className="h-3.5 w-3.5" />
                  {src.excelLabel}
                </Button>
              ))}
            </div>
          </div>

          <div className="rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-950 leading-snug">
            <strong>Note:</strong> The ₹{OFFER_AMOUNTS.friend} amount / voucher is claimed only after
            the user purchases a Bajaj vehicle from the respective dealer branch (BR / TR / HY).
          </div>

          {importing && customers.length === 0 ? (
            <div className="rounded-2xl border border-border bg-card p-10 text-center text-sm text-muted-foreground">
              Loading Brite, Tirhut &amp; HY sheets…
            </div>
          ) : (
            <div className="space-y-5">
              {BRANCH_ORDER.map((branch) => {
                const src = BRANCH_SHEET_SOURCES.find((s) => s.branch === branch)!;
                const info = BRANCHES[branch];
                const rows = customersByBranch[branch];
                const page = branchPages[branch] ?? 0;
                const pageCount = Math.max(1, Math.ceil(rows.length / LINKS_PAGE_SIZE));
                const safePage = Math.min(page, pageCount - 1);
                const start = safePage * LINKS_PAGE_SIZE;
                const pageRows = rows.slice(start, start + LINKS_PAGE_SIZE);

                return (
                  <div
                    key={branch}
                    className="rounded-2xl border border-border bg-card shadow-card overflow-hidden"
                  >
                    <div
                      className="px-5 py-4 border-b border-border flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                      style={{ borderTop: `3px solid ${info.accent}` }}
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        <span
                          className="h-10 w-10 rounded-xl text-white text-sm font-extrabold flex items-center justify-center shrink-0"
                          style={{ background: info.accent }}
                        >
                          {branch}
                        </span>
                        <div className="min-w-0">
                          <div className="font-bold">{info.name}</div>
                          <div className="text-xs text-muted-foreground truncate">
                            {src.excelLabel} · Sheet1 · {rows.length.toLocaleString()} referral
                            links · /pulsar/{branch}/…
                          </div>
                        </div>
                      </div>
                      <Button
                        size="sm"
                        variant="hero"
                        onClick={() => {
                          downloadBranchSheet(branch);
                          toast({ title: "Downloading", description: src.excelLabel });
                        }}
                      >
                        <Download className="h-4 w-4" />
                        Download sheet
                      </Button>
                    </div>

                    {rows.length === 0 ? (
                      <p className="px-5 py-8 text-sm text-muted-foreground text-center">
                        No customers loaded for this branch.
                      </p>
                    ) : (
                      <div className="px-5 py-4 space-y-3">
                        <p className="text-[11px] text-muted-foreground">
                          Showing {pageRows.length.toLocaleString()} of{" "}
                          {rows.length.toLocaleString()}
                        </p>
                        <ul className="space-y-2">
                          {pageRows.map((c) => {
                            const path = publicReferralPath(c.referralCode, branch);
                            const full =
                              typeof window !== "undefined"
                                ? `${window.location.origin}${path}`
                                : path;
                            return (
                              <li
                                key={c.referralCode}
                                className="flex flex-col sm:flex-row sm:items-center gap-2 rounded-xl border border-border bg-muted/40 px-3 py-2.5"
                              >
                                <div className="min-w-0 flex-1">
                                  <div className="text-sm font-semibold truncate">
                                    {c.customerName}{" "}
                                    <code className="text-[10px] font-normal text-muted-foreground ml-1">
                                      {c.referralCode}
                                    </code>
                                  </div>
                                  <div className="text-[11px] text-muted-foreground">
                                    {c.mobileNo} · {c.dealerName}
                                  </div>
                                  <a
                                    href={path}
                                    target="_blank"
                                    rel="noreferrer"
                                    className="text-xs text-primary hover:underline break-all"
                                  >
                                    {full}
                                  </a>
                                </div>
                                <div className="flex gap-2 shrink-0">
                                  <Button
                                    size="sm"
                                    variant="outline"
                                    onClick={() => {
                                      void navigator.clipboard.writeText(full);
                                      toast({ title: "Copied", description: full });
                                    }}
                                  >
                                    <Copy className="h-3.5 w-3.5" />
                                    Copy
                                  </Button>
                                  <Button size="sm" variant="secondary" asChild>
                                    <Link to={path} target="_blank">
                                      <ExternalLink className="h-3.5 w-3.5" />
                                      Open
                                    </Link>
                                  </Button>
                                </div>
                              </li>
                            );
                          })}
                        </ul>
                        {pageCount > 1 && (
                          <div className="flex items-center justify-between gap-3 pt-1">
                            <Button
                              size="sm"
                              variant="outline"
                              disabled={safePage <= 0}
                              onClick={() =>
                                setBranchPages((p) => ({
                                  ...p,
                                  [branch]: Math.max(0, safePage - 1),
                                }))
                              }
                            >
                              Previous
                            </Button>
                            <span className="text-xs text-muted-foreground">
                              Page {safePage + 1} / {pageCount}
                            </span>
                            <Button
                              size="sm"
                              variant="outline"
                              disabled={safePage >= pageCount - 1}
                              onClick={() =>
                                setBranchPages((p) => ({
                                  ...p,
                                  [branch]: Math.min(pageCount - 1, safePage + 1),
                                }))
                              }
                            >
                              Next
                            </Button>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </section>

        {/* Import */}
        <section className="rounded-2xl border border-border bg-card shadow-card p-6 space-y-4">
          <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-4">
            <div className="space-y-3 min-w-0">
              <div>
                <h2 className="text-lg font-bold flex items-center gap-2">
                  <FileSpreadsheet className="h-5 w-5 text-primary" />
                  Step 2 — Load branch sheets
                </h2>
                <p className="text-sm text-muted-foreground mt-1">
                  Using Sheet1 from each workbook. Headers: Customer / Owner Name, Mobile No,
                  DealerName, ReferralCode, ReferralLink
                </p>
              </div>
              <ul className="grid sm:grid-cols-3 gap-2 text-xs">
                {BRANCH_SHEET_SOURCES.map((src) => (
                  <li
                    key={src.branch}
                    className="rounded-xl border border-border bg-muted/40 px-3 py-2.5 space-y-2"
                  >
                    <div className="font-bold flex items-center gap-1.5">
                      <span
                        className="h-5 w-5 rounded text-white text-[10px] font-extrabold inline-flex items-center justify-center"
                        style={{ background: BRANCHES[src.branch].accent }}
                      >
                        {src.branch}
                      </span>
                      {BRANCHES[src.branch].name}
                    </div>
                    <div className="text-muted-foreground truncate" title={src.excelLabel}>
                      {src.excelLabel}
                    </div>
                    <div className="text-muted-foreground">
                      {countsByBranch[src.branch]
                        ? `${countsByBranch[src.branch].toLocaleString()} loaded`
                        : `~${src.expectedCount.toLocaleString()} rows`}{" "}
                      · Sheet1
                    </div>
                    <Button
                      size="sm"
                      variant="outline"
                      className="w-full"
                      onClick={() => {
                        downloadBranchSheet(src.branch);
                        toast({ title: "Downloading", description: src.excelLabel });
                      }}
                    >
                      <Download className="h-3.5 w-3.5" />
                      Download
                    </Button>
                  </li>
                ))}
              </ul>
            </div>
            <div className="flex flex-wrap gap-2 shrink-0">
              <input
                ref={fileRef}
                type="file"
                accept=".xlsx,.xls,.csv"
                multiple
                className="hidden"
                onChange={(e) => onPickFiles(e.target.files)}
              />
              <Button
                variant="hero"
                disabled={importing || sending}
                onClick={() => void loadBundled(false)}
              >
                <Upload className="h-4 w-4" />
                {importing ? "Loading…" : "Reload all 3 branch sheets"}
              </Button>
              <Button
                variant="outline"
                disabled={importing || sending}
                onClick={() => fileRef.current?.click()}
              >
                <Upload className="h-4 w-4" />
                Upload Excel…
              </Button>
              {customers.length > 0 && (
                <Button variant="outline" disabled={sending} onClick={onClear}>
                  <Trash2 className="h-4 w-4" />
                  Clear list
                </Button>
              )}
            </div>
          </div>
          {customers.length > 0 && (
            <div className="flex flex-wrap gap-2 text-xs text-muted-foreground border-t border-border pt-3">
              {BRANCH_ORDER.map((b) => {
                const count = customers.filter(
                  (c) => branchFromReferralCode(c.referralCode) === b,
                ).length;
                return (
                  <span
                    key={b}
                    className="rounded-full border border-border px-2.5 py-1 bg-background"
                  >
                    <strong style={{ color: BRANCHES[b].accent }}>{b}</strong>{" "}
                    {count.toLocaleString()} loaded
                  </span>
                );
              })}
            </div>
          )}
        </section>

        {/* Stats + action */}
        {customers.length > 0 && (
          <>
            <section className="grid grid-cols-2 md:grid-cols-5 gap-3">
              {[
                { label: "Recipients", value: stats.total },
                { label: "Delivered", value: stats.delivered },
                { label: "Failed", value: stats.failed },
                { label: "Link clicks", value: stats.clicked },
                { label: "Forms filled", value: stats.submitted },
              ].map((s) => (
                <div key={s.label} className="rounded-xl border border-border bg-card p-4 shadow-soft">
                  <div className="text-2xl font-extrabold text-foreground">{s.value}</div>
                  <div className="text-xs text-muted-foreground mt-0.5">{s.label}</div>
                </div>
              ))}
            </section>

            <section className="rounded-2xl border border-border bg-card shadow-card p-6 space-y-4">
              <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                <div>
                  <h2 className="text-lg font-bold flex items-center gap-2">
                    <MessageSquare className="h-5 w-5 text-primary" />
                    Start bulk message
                  </h2>
                  <p className="text-sm text-muted-foreground mt-1">
                    Sends WhatsApp to every mobile in the list. Provider API will be plugged in later
                    — currently simulated on the frontend.
                  </p>
                </div>
                <Button
                  variant="hero"
                  size="lg"
                  disabled={sending}
                  onClick={onBulkSend}
                  className="shrink-0"
                >
                  <Send className="h-4 w-4" />
                  {sending ? `Sending ${sendProgress.done}/${sendProgress.total}…` : "Start Bulk Message"}
                </Button>
              </div>
              {sending && (
                <div className="space-y-2">
                  <Progress value={progressPct} className="h-2" />
                  <p className="text-xs text-muted-foreground">{progressPct}% complete</p>
                </div>
              )}
            </section>

            <section className="rounded-2xl border border-border bg-card shadow-card overflow-hidden">
              <div className="px-6 py-4 border-b border-border flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <h2 className="font-bold">Imported recipients</h2>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    Showing {pagedCustomers.length.toLocaleString()} of{" "}
                    {filteredCustomers.length.toLocaleString()}
                    {tableBranch !== "ALL" ? ` (${tableBranch})` : ""} ·{" "}
                    {customers.length.toLocaleString()} total
                  </p>
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {(["ALL", ...BRANCH_ORDER] as const).map((b) => (
                    <Button
                      key={b}
                      size="sm"
                      variant={tableBranch === b ? "default" : "outline"}
                      onClick={() => {
                        setTableBranch(b);
                        setTablePage(0);
                      }}
                    >
                      {b === "ALL" ? "All" : `${b}`}
                    </Button>
                  ))}
                </div>
              </div>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Customer Name</TableHead>
                    <TableHead>Mobile No</TableHead>
                    <TableHead>DealerName</TableHead>
                    <TableHead>ReferralCode</TableHead>
                    <TableHead>Referral Link</TableHead>
                    <TableHead>WhatsApp</TableHead>
                    <TableHead>Click</TableHead>
                    <TableHead>Form</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {pagedCustomers.map((c) => (
                    <TableRow key={c.id}>
                      <TableCell className="font-medium">{c.customerName}</TableCell>
                      <TableCell>{c.mobileNo}</TableCell>
                      <TableCell>{c.dealerName}</TableCell>
                      <TableCell>
                        <code className="text-xs bg-muted px-1.5 py-0.5 rounded">{c.referralCode}</code>
                      </TableCell>
                      <TableCell>
                        <Link
                          to={publicReferralPath(c.referralCode)}
                          className="text-primary text-xs inline-flex items-center gap-1 hover:underline"
                          target="_blank"
                          rel="noreferrer"
                        >
                          {publicReferralPath(c.referralCode)}
                          <ExternalLink className="h-3 w-3" />
                        </Link>
                      </TableCell>
                      <TableCell>{statusBadge(c.deliveryStatus)}</TableCell>
                      <TableCell>
                        {c.linkClicked ? (
                          <span className="inline-flex items-center gap-1 text-emerald-600 text-xs font-medium">
                            <MousePointerClick className="h-3.5 w-3.5" /> Yes
                          </span>
                        ) : (
                          <span className="text-xs text-muted-foreground">—</span>
                        )}
                      </TableCell>
                      <TableCell>
                        {c.formSubmitted ? (
                          <span className="inline-flex items-center gap-1 text-emerald-600 text-xs font-medium">
                            <CheckCircle2 className="h-3.5 w-3.5" /> Yes
                          </span>
                        ) : (
                          <span className="text-xs text-muted-foreground">—</span>
                        )}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
              {tablePageCount > 1 && (
                <div className="px-6 py-3 border-t border-border flex items-center justify-between gap-3">
                  <Button
                    size="sm"
                    variant="outline"
                    disabled={tablePage <= 0}
                    onClick={() => setTablePage((p) => Math.max(0, p - 1))}
                  >
                    Previous
                  </Button>
                  <span className="text-xs text-muted-foreground">
                    Page {Math.min(tablePage, tablePageCount - 1) + 1} / {tablePageCount}
                  </span>
                  <Button
                    size="sm"
                    variant="outline"
                    disabled={tablePage >= tablePageCount - 1}
                    onClick={() => setTablePage((p) => Math.min(tablePageCount - 1, p + 1))}
                  >
                    Next
                  </Button>
                </div>
              )}
            </section>

            {/* Report */}
            <section className="rounded-2xl border border-border bg-card shadow-card p-6 space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <h2 className="text-lg font-bold">Bulk WhatsApp report</h2>
                  <p className="text-sm text-muted-foreground mt-1">
                    Tracks delivery, link clicks, and friend form fills. Report API can replace this
                    stub later.
                  </p>
                </div>
                <Button variant="outline" onClick={onLoadReport} disabled={reportLoading}>
                  <RefreshCw className={cn("h-4 w-4", reportLoading && "animate-spin")} />
                  Refresh report
                </Button>
              </div>

              {report && (
                <>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                    <ReportStat label="Delivered" value={report.summary.delivered} ok />
                    <ReportStat label="Failed" value={report.summary.failed} bad={report.summary.failed > 0} />
                    <ReportStat label="Link clicks" value={report.summary.linkClicks} />
                    <ReportStat label="Friend forms" value={report.summary.friendFills} />
                  </div>
                  <p className="text-[11px] text-muted-foreground">
                    Generated {new Date(report.generatedAt).toLocaleString()}
                  </p>
                </>
              )}
            </section>
          </>
        )}
      </main>
    </div>
  );
};

function ReportStat({
  label,
  value,
  ok,
  bad,
}: {
  label: string;
  value: number;
  ok?: boolean;
  bad?: boolean;
}) {
  return (
    <div className="rounded-xl bg-muted/50 border border-border p-3">
      <div
        className={cn(
          "text-xl font-extrabold flex items-center gap-1.5",
          ok && "text-emerald-600",
          bad && "text-destructive",
        )}
      >
        {bad ? <XCircle className="h-4 w-4" /> : null}
        {ok ? <CheckCircle2 className="h-4 w-4" /> : null}
        {value}
      </div>
      <div className="text-xs text-muted-foreground">{label}</div>
    </div>
  );
}

export default HyOffersDashboard;
