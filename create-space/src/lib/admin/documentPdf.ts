import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import logoFallback from "@/assets/zentroverse-logo.jpg";
import type { CompanySettings, Customer, DocBase, Invoice, Receipt } from "./types";

const fmtINR = (n: number) =>
  "₹ " + n.toLocaleString("en-IN", { minimumFractionDigits: 2, maximumFractionDigits: 2 });

const fmtDate = (d: string) =>
  new Date(d).toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" });

const amountInWords = (n: number): string => {
  if (!Number.isFinite(n) || n <= 0) return "Zero Rupees Only";
  const ones = ["", "One", "Two", "Three", "Four", "Five", "Six", "Seven", "Eight", "Nine", "Ten", "Eleven", "Twelve", "Thirteen", "Fourteen", "Fifteen", "Sixteen", "Seventeen", "Eighteen", "Nineteen"];
  const tens = ["", "", "Twenty", "Thirty", "Forty", "Fifty", "Sixty", "Seventy", "Eighty", "Ninety"];
  const two = (num: number) => (num < 20 ? ones[num] : `${tens[Math.floor(num / 10)]}${num % 10 ? " " + ones[num % 10] : ""}`.trim());
  const three = (num: number) => (num < 100 ? two(num) : `${ones[Math.floor(num / 100)]} Hundred${num % 100 ? " " + two(num % 100) : ""}`.trim());
  let rupees = Math.floor(n);
  const paise = Math.round((n - rupees) * 100);
  let words = "";
  if (rupees >= 10000000) { words += three(Math.floor(rupees / 10000000)) + " Crore "; rupees %= 10000000; }
  let r = rupees;
  if (r >= 100000) { words += three(Math.floor(r / 100000)) + " Lakh "; r %= 100000; }
  if (r >= 1000) { words += three(Math.floor(r / 1000)) + " Thousand "; r %= 1000; }
  if (r > 0) words += three(r) + " ";
  words = (words.trim() || "Zero") + " Rupees";
  if (paise > 0) words += ` and ${two(paise)} Paise`;
  return words + " Only";
};

const loadImage = (src: string): Promise<{ data: string; w: number; h: number }> =>
  new Promise((resolve) => {
    const img = new Image();
    img.crossOrigin = "anonymous";
    img.onload = () => {
      const c = document.createElement("canvas");
      c.width = img.naturalWidth;
      c.height = img.naturalHeight;
      c.getContext("2d")!.drawImage(img, 0, 0);
      resolve({ data: c.toDataURL("image/png"), w: img.naturalWidth, h: img.naturalHeight });
    };
    img.onerror = () => resolve({ data: "", w: 0, h: 0 });
    img.src = src;
  });

const THEMES = {
  QUOTATION: { primary: [67, 56, 202] as [number, number, number], label: "QUOTATION", sub: "Estimate / Proposal" },
  INVOICE: { primary: [37, 99, 235] as [number, number, number], label: "TAX INVOICE", sub: "Bill of Supply" },
  RECEIPT: { primary: [5, 150, 105] as [number, number, number], label: "PAYMENT RECEIPT", sub: "Official Receipt" },
};

interface BuildArgs {
  kind: "INVOICE" | "QUOTATION" | "RECEIPT";
  settings: CompanySettings;
  customer: Customer | undefined;
  doc: DocBase | Invoice;
  receipt?: Receipt;
}

export const downloadDocumentPdf = async ({ kind, settings, customer, doc, receipt }: BuildArgs) => {
  const pdf = new jsPDF({ unit: "pt", format: "a4" });
  const pageW = pdf.internal.pageSize.getWidth();
  const pageH = pdf.internal.pageSize.getHeight();
  const margin = 36;
  const theme = THEMES[kind];
  const [pr, pg, pb] = theme.primary;

  pdf.setFillColor(pr, pg, pb);
  pdf.rect(0, 0, pageW, 8, "F");

  const logoSrc = settings.logoDataUrl || logoFallback;
  const img = await loadImage(logoSrc);
  let headerY = 28;

  if (img.data) {
    const ratio = img.w / img.h;
    const h = 52;
    pdf.addImage(img.data, "PNG", margin, headerY, h * ratio, h);
    headerY += h + 8;
  }

  pdf.setFont("helvetica", "bold");
  pdf.setFontSize(14);
  pdf.setTextColor(15, 23, 42);
  pdf.text(settings.name, margin, headerY + 4);
  pdf.setFont("helvetica", "normal");
  pdf.setFontSize(8.5);
  pdf.setTextColor(71, 85, 105);
  [settings.address, `GSTIN: ${settings.gstin}`, `${settings.phone}  •  ${settings.email}`].forEach((l, i) =>
    pdf.text(l, margin, headerY + 18 + i * 11),
  );

  const badgeW = 180;
  const badgeX = pageW - margin - badgeW;
  pdf.setFillColor(pr, pg, pb);
  pdf.roundedRect(badgeX, 24, badgeW, 56, 4, 4, "F");
  pdf.setTextColor(255, 255, 255);
  pdf.setFont("helvetica", "bold");
  pdf.setFontSize(14);
  pdf.text(theme.label, badgeX + badgeW / 2, 48, { align: "center" });
  pdf.setFontSize(8);
  pdf.setFont("helvetica", "normal");
  pdf.text(theme.sub, badgeX + badgeW / 2, 62, { align: "center" });

  const divY = Math.max(headerY + 42, 100);
  pdf.setDrawColor(226, 232, 240);
  pdf.line(margin, divY, pageW - margin, divY);

  const metaY = divY + 20;
  pdf.setFont("helvetica", "bold");
  pdf.setFontSize(8);
  pdf.setTextColor(pr, pg, pb);
  pdf.text("DOCUMENT DETAILS", margin, metaY);

  pdf.setFontSize(9);
  pdf.setTextColor(51, 65, 85);
  const metaRows: [string, string][] = [["Document No.", doc.number], ["Date", fmtDate(doc.date)]];
  if (doc.dueDate) metaRows.push(["Valid / Due", fmtDate(doc.dueDate)]);
  if (kind === "RECEIPT" && receipt) {
    metaRows.push(["Receipt No.", receipt.number], ["Payment Date", fmtDate(receipt.date)], ["Payment Mode", receipt.mode]);
  }
  metaRows.forEach(([k, v], i) => {
    pdf.setFont("helvetica", "bold");
    pdf.text(`${k}:`, margin, metaY + 14 + i * 13);
    pdf.setFont("helvetica", "normal");
    pdf.text(v, margin + 78, metaY + 14 + i * 13);
  });

  const billX = pageW / 2 + 10;
  const billW = pageW - margin - billX;
  pdf.setFillColor(248, 250, 252);
  pdf.setDrawColor(226, 232, 240);
  pdf.roundedRect(billX, metaY - 8, billW, 88, 3, 3, "FD");
  pdf.setFont("helvetica", "bold");
  pdf.setFontSize(8);
  pdf.setTextColor(pr, pg, pb);
  pdf.text("BILL TO", billX + 12, metaY + 4);
  if (customer) {
    pdf.setFontSize(10);
    pdf.setTextColor(15, 23, 42);
    pdf.text(customer.company, billX + 12, metaY + 20);
    pdf.setFont("helvetica", "normal");
    pdf.setFontSize(9);
    pdf.setTextColor(71, 85, 105);
    pdf.text(customer.name, billX + 12, metaY + 34);
    pdf.text(customer.address, billX + 12, metaY + 48, { maxWidth: billW - 24 });
    pdf.text(`GSTIN: ${customer.gstin || "—"}`, billX + 12, metaY + 68);
    pdf.text(`${customer.phone}  •  ${customer.email}`, billX + 12, metaY + 80, { maxWidth: billW - 24 });
  }

  const subtotal = doc.items.reduce((s, i) => s + i.qty * i.rate, 0);
  const gst = (subtotal * doc.gstPercent) / 100;
  const total = kind === "RECEIPT" && receipt ? receipt.amount : subtotal + gst;

  autoTable(pdf, {
    startY: metaY + 100,
    head: [["#", "Description", "HSN/SAC", "Qty", "Rate (₹)", "Amount (₹)"]],
    body: doc.items.map((it, i) => [
      String(i + 1), it.description, "9983", String(it.qty),
      it.rate.toLocaleString("en-IN", { minimumFractionDigits: 2 }),
      (it.qty * it.rate).toLocaleString("en-IN", { minimumFractionDigits: 2 }),
    ]),
    styles: { fontSize: 9, cellPadding: 7, lineColor: [226, 232, 240], textColor: [51, 65, 85] },
    headStyles: { fillColor: [pr, pg, pb], textColor: [255, 255, 255], fontStyle: "bold", fontSize: 8.5 },
    alternateRowStyles: { fillColor: [248, 250, 252] },
    columnStyles: {
      0: { cellWidth: 24, halign: "center" },
      1: { cellWidth: "auto" },
      2: { cellWidth: 52, halign: "center" },
      3: { cellWidth: 36, halign: "right" },
      4: { cellWidth: 72, halign: "right" },
      5: { cellWidth: 80, halign: "right", fontStyle: "bold" },
    },
    margin: { left: margin, right: margin },
    didDrawPage: (data) => {
      pdf.setFillColor(pr, pg, pb);
      pdf.rect(0, pageH - 24, pageW, 24, "F");
      pdf.setTextColor(255, 255, 255);
      pdf.setFontSize(8);
      pdf.text(settings.footerNote, pageW / 2, pageH - 10, { align: "center" });
      if (data.pageNumber > 1) {
        pdf.text(`Page ${data.pageNumber}`, pageW - margin, pageH - 10, { align: "right" });
      }
    },
  });

  // @ts-expect-error autoTable injects lastAutoTable
  let y = (pdf.lastAutoTable?.finalY ?? metaY + 180) + 20;

  const boxW = 220;
  const boxX = pageW - margin - boxW;
  pdf.setFillColor(248, 250, 252);
  pdf.roundedRect(boxX, y, boxW, kind === "RECEIPT" ? 72 : 88, 3, 3, "FD");

  const row = (label: string, value: string, bold: boolean, yy: number) => {
    pdf.setFont("helvetica", bold ? "bold" : "normal");
    pdf.setFontSize(bold ? 11 : 9);
    pdf.setTextColor(bold ? 15 : 71, bold ? 23 : 85, bold ? 42 : 105);
    pdf.text(label, boxX + 12, yy);
    pdf.text(value, boxX + boxW - 12, yy, { align: "right" });
  };

  if (kind !== "RECEIPT") {
    row("Subtotal", fmtINR(subtotal), false, y + 18);
    row(`GST (${doc.gstPercent}%)`, fmtINR(gst), false, y + 34);
    pdf.setDrawColor(203, 213, 225);
    pdf.line(boxX + 8, y + 42, boxX + boxW - 8, y + 42);
    row("Grand Total", fmtINR(total), true, y + 58);
  } else {
    row("Amount Received", fmtINR(total), true, y + 24);
    pdf.setFontSize(8);
    pdf.setTextColor(100, 116, 139);
    pdf.text(`Against Invoice ${doc.number}`, boxX + 12, y + 42);
    pdf.text(`Mode: ${receipt?.mode ?? "—"}`, boxX + 12, y + 54);
  }

  y += kind === "RECEIPT" ? 88 : 100;

  pdf.setFont("helvetica", "bold");
  pdf.setFontSize(8);
  pdf.setTextColor(pr, pg, pb);
  pdf.text("AMOUNT IN WORDS", margin, y);
  pdf.setFont("helvetica", "italic");
  pdf.setFontSize(9);
  pdf.setTextColor(51, 65, 85);
  pdf.text(amountInWords(total), margin, y + 14, { maxWidth: pageW - margin * 2 });
  y += 36;

  if (kind === "RECEIPT") {
    pdf.setDrawColor(5, 150, 105);
    pdf.setLineWidth(2);
    pdf.roundedRect(pageW / 2 - 50, y - 8, 100, 32, 2, 2, "S");
    pdf.setFont("helvetica", "bold");
    pdf.setFontSize(16);
    pdf.setTextColor(5, 150, 105);
    pdf.text("PAID", pageW / 2, y + 14, { align: "center" });
    y += 44;
  }

  if (doc.notes && kind === "QUOTATION") {
    pdf.setFont("helvetica", "bold");
    pdf.setFontSize(8);
    pdf.setTextColor(pr, pg, pb);
    pdf.text("TERMS & CONDITIONS", margin, y);
    pdf.setFont("helvetica", "normal");
    pdf.setFontSize(8.5);
    pdf.setTextColor(100, 116, 139);
    pdf.text(doc.notes, margin, y + 14, { maxWidth: pageW - margin * 2 });
    y += 40;
  } else if (kind === "QUOTATION") {
    const defaultTerms =
      "• Prices are valid for 30 days from the date of this quotation.\n• 50% advance required to commence work; balance on delivery.\n• GST as applicable. Scope changes may affect pricing.";
    pdf.setFont("helvetica", "bold");
    pdf.setFontSize(8);
    pdf.setTextColor(pr, pg, pb);
    pdf.text("TERMS & CONDITIONS", margin, y);
    pdf.setFont("helvetica", "normal");
    pdf.setFontSize(8.5);
    pdf.setTextColor(100, 116, 139);
    pdf.text(defaultTerms, margin, y + 14, { maxWidth: pageW - margin * 2 });
    y += 48;
  }

  if (kind === "RECEIPT") {
    pdf.setFont("helvetica", "italic");
    pdf.setFontSize(9);
    pdf.setTextColor(71, 85, 105);
    pdf.text("Thank you for your payment. This is a computer-generated receipt and does not require a signature.", margin, y, {
      maxWidth: pageW - margin * 2,
    });
    y += 28;
  }

  pdf.setFillColor(241, 245, 249);
  pdf.roundedRect(margin, y, pageW - margin * 2, 52, 3, 3, "F");
  pdf.setFont("helvetica", "bold");
  pdf.setFontSize(8);
  pdf.text("BANK DETAILS", margin + 12, y + 16);
  pdf.setFont("helvetica", "normal");
  pdf.setFontSize(8.5);
  pdf.setTextColor(71, 85, 105);
  pdf.text(settings.bankDetails, margin + 12, y + 30, { maxWidth: pageW - margin * 2 - 24 });
  y += 68;

  if (y + 48 > pageH - 32) {
    pdf.addPage();
    y = margin;
  }
  const signAt = y + 24;
  pdf.setDrawColor(203, 213, 225);
  pdf.line(margin, signAt, margin + 140, signAt);
  pdf.line(pageW - margin - 140, signAt, pageW - margin, signAt);
  pdf.setFontSize(8);
  pdf.setTextColor(100, 116, 139);
  pdf.text("Authorized Signatory", margin, signAt + 12);
  pdf.text(kind === "QUOTATION" ? "Customer Acceptance" : "Received By", pageW - margin - 140, signAt + 12);

  pdf.setFillColor(pr, pg, pb);
  pdf.rect(0, pageH - 24, pageW, 24, "F");
  pdf.setTextColor(255, 255, 255);
  pdf.setFontSize(8);
  pdf.text(settings.footerNote, pageW / 2, pageH - 10, { align: "center" });

  pdf.save(kind === "RECEIPT" && receipt ? `receipt-${receipt.number}.pdf` : `${kind.toLowerCase()}-${doc.number}.pdf`);
};
