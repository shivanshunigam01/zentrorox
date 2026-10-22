import jsPDF from "jspdf";
import type { ToolResult } from "./engine";

export function downloadTextReport(title: string, result: ToolResult, contact?: { name: string; email: string }) {
  const lines = [
    `ZENTROVERSE — ${title}`,
    `Generated: ${new Date().toLocaleString("en-IN")}`,
    contact ? `Prepared for: ${contact.name} (${contact.email})` : "",
    "",
    result.summary,
    "",
    "STRENGTHS:",
    ...result.strengths.map((s) => `• ${s}`),
    "",
    "AREAS TO IMPROVE:",
    ...result.weaknesses.map((w) => `• ${w}`),
    "",
    "RECOMMENDATIONS:",
    ...result.recommendations.map((r) => `• ${r}`),
    "",
    "---",
    "Zentroverse Global Pvt. Ltd. | digital@zentroverse.com | zentroverse.com",
  ].filter(Boolean);

  const blob = new Blob([lines.join("\n")], { type: "text/plain" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `zentroverse-${title.toLowerCase().replace(/\s+/g, "-")}-report.txt`;
  a.click();
  URL.revokeObjectURL(url);
}

export function downloadPdfReport(title: string, result: ToolResult, contact?: { name: string; email: string }) {
  const pdf = new jsPDF();
  const margin = 40;
  let y = margin;
  pdf.setFont("helvetica", "bold");
  pdf.setFontSize(16);
  pdf.text("Zentroverse Growth Intelligence Report", margin, y);
  y += 20;
  pdf.setFontSize(12);
  pdf.text(title, margin, y);
  y += 14;
  pdf.setFont("helvetica", "normal");
  pdf.setFontSize(10);
  if (contact) {
    pdf.text(`Prepared for: ${contact.name} (${contact.email})`, margin, y);
    y += 12;
  }
  pdf.text(`Date: ${new Date().toLocaleDateString("en-IN")}`, margin, y);
  y += 20;
  pdf.setFont("helvetica", "bold");
  pdf.text(`Score Summary`, margin, y);
  y += 12;
  pdf.setFont("helvetica", "normal");
  pdf.text(result.summary, margin, y, { maxWidth: 500 });
  y += 24;

  const section = (heading: string, items: string[]) => {
    if (y > 700) { pdf.addPage(); y = margin; }
    pdf.setFont("helvetica", "bold");
    pdf.text(heading, margin, y);
    y += 12;
    pdf.setFont("helvetica", "normal");
    items.forEach((item) => {
      pdf.text(`• ${item}`, margin, y, { maxWidth: 500 });
      y += 14;
    });
    y += 8;
  };

  if (result.categoryScores?.length) {
    section("Category Scores", result.categoryScores.map((c) => `${c.label}: ${c.score}/100`));
  }
  section("Strengths", result.strengths.length ? result.strengths : ["—"]);
  section("Areas to Improve", result.weaknesses.length ? result.weaknesses : ["—"]);
  section("Recommendations", result.recommendations);

  pdf.save(`zentroverse-${title.toLowerCase().replace(/\s+/g, "-")}.pdf`);
}
