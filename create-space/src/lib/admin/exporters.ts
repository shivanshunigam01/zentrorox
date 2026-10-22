import * as XLSX from "xlsx";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

export const exportToExcel = (rows: Record<string, unknown>[], filename: string) => {
  const ws = XLSX.utils.json_to_sheet(rows);
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, "Sheet1");
  XLSX.writeFile(wb, `${filename}.xlsx`);
};

export const exportListToPdf = (title: string, columns: string[], rows: (string | number)[][], filename: string) => {
  const doc = new jsPDF({ orientation: "landscape", unit: "pt", format: "a4" });
  doc.setFontSize(16);
  doc.text(title, 40, 40);
  doc.setFontSize(10);
  doc.setTextColor(120);
  doc.text(`Generated ${new Date().toLocaleString()}`, 40, 58);
  autoTable(doc, {
    head: [columns],
    body: rows,
    startY: 80,
    styles: { fontSize: 9, cellPadding: 6 },
    headStyles: { fillColor: [33, 94, 196] },
  });
  doc.save(`${filename}.pdf`);
};
