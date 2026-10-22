/**
 * Lead notifications — configure via environment variables.
 * LEAD_WEBHOOK_URL: generic webhook (Zapier/Make/n8n) for email + CRM + sheets
 * WHATSAPP_NOTIFY_URL: WhatsApp API webhook (AiSensy, WATI, etc.)
 * ADMIN_NOTIFY_EMAIL: included in webhook payload for email routing
 */

export async function notifyNewLead(lead) {
  const webhook = process.env.LEAD_WEBHOOK_URL;
  const waUrl = process.env.WHATSAPP_NOTIFY_URL;
  const adminEmail = process.env.ADMIN_NOTIFY_EMAIL ?? "digital@zentroverse.com";

  const payload = {
    type: "new_lead",
    timestamp: new Date().toISOString(),
    notify_email: adminEmail,
    lead,
    summary: formatLeadSummary(lead),
  };

  const tasks = [];

  if (webhook) {
    tasks.push(
      fetch(webhook, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      }).catch((e) => console.error("[notify] webhook", e.message)),
    );
  }

  if (waUrl) {
    const waText = encodeURIComponent(
      `🆕 New Lead — Zentroverse\n\n` +
      `Name: ${lead.name}\nPhone: ${lead.phone}\nEmail: ${lead.email}\n` +
      `Type: ${lead.form_type ?? "contact"}${lead.tool_id ? `\nTool: ${lead.tool_id}` : ""}` +
      `${lead.score != null ? `\nScore: ${lead.score}/100` : ""}` +
      `${lead.audit_type ? `\nAudit: ${lead.audit_type}` : ""}` +
      `\nSource: ${lead.source ?? "website"}`,
    );
    tasks.push(
      fetch(`${waUrl}${waUrl.includes("?") ? "&" : "?"}text=${waText}`, {
        method: "GET",
      }).catch((e) => console.error("[notify] whatsapp", e.message)),
    );
  }

  if (!webhook && !waUrl) {
    console.info("[notify] New lead (configure LEAD_WEBHOOK_URL or WHATSAPP_NOTIFY_URL):", lead.name, lead.email, lead.form_type);
  }

  await Promise.allSettled(tasks);
}

function formatLeadSummary(lead) {
  const parts = [
    `New lead from ${lead.source ?? "website"}`,
    `Name: ${lead.name}`,
    `Phone: ${lead.phone}`,
    `Email: ${lead.email}`,
  ];
  if (lead.form_type) parts.push(`Form: ${lead.form_type}`);
  if (lead.tool_id) parts.push(`Tool: ${lead.tool_id}`);
  if (lead.score != null) parts.push(`Score: ${lead.score}/100`);
  if (lead.report_summary) parts.push(`Report: ${lead.report_summary}`);
  if (lead.audit_type) parts.push(`Audit: ${lead.audit_type}`);
  if (lead.calculator_type) parts.push(`Calculator: ${lead.calculator_type}`);
  if (lead.company_name) parts.push(`Company: ${lead.company_name}`);
  return parts.join("\n");
}
