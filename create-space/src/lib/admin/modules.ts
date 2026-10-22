import type { LucideIcon } from "lucide-react";
import { Bike, Brain, FileText, Inbox, LayoutDashboard, ReceiptText, Share2, Users, ClipboardList, Workflow, UserCog } from "lucide-react";

export type AdminModuleKey =
  | "dashboard"
  | "submissions"
  | "leads"
  | "bajaj_asd"
  | "growth_hub"
  | "pulsar"
  | "zentroflow"
  | "hr"
  | "customers"
  | "quotations"
  | "invoices"
  | "receipts"
  | "settings";

export type AdminModuleDef = {
  key: AdminModuleKey;
  label: string;
  to: string;
  icon: LucideIcon;
  group: "command" | "submissions" | "billing" | "system";
  overviewKey?: keyof AdminOverviewModules;
  formTypes?: string[];
  description?: string;
};

type AdminOverviewModules = {
  leads: unknown;
  bajaj_asd: unknown;
  growth_hub: unknown;
  pulsar: unknown;
  customers: unknown;
  invoices: unknown;
  cms: unknown;
};

export const ADMIN_MODULES: AdminModuleDef[] = [
  { key: "dashboard", label: "Dashboard", to: "/admin", icon: LayoutDashboard, group: "command", description: "Command center overview" },
  { key: "submissions", label: "All Submissions", to: "/admin/submissions", icon: Inbox, group: "command", description: "Unified inbox across all public forms" },
  { key: "zentroflow", label: "ZentroFlow", to: "/admin/zentroflow", icon: Workflow, group: "command", description: "Multi-tenant lead CRM & Meta automation" },
  { key: "hr", label: "HR Module", to: "/admin/hr", icon: UserCog, group: "command", description: "People, attendance, leave & org profiles" },
  { key: "leads", label: "Enquiries", to: "/admin/leads", icon: Inbox, group: "submissions", overviewKey: "leads", formTypes: ["contact", "solution", "audit", "calculator"] },
  { key: "bajaj_asd", label: "Bajaj ASD", to: "/admin/bajaj-asd", icon: Bike, group: "submissions", overviewKey: "bajaj_asd", formTypes: ["bajaj_asd"] },
  { key: "growth_hub", label: "Growth Hub", to: "/admin/growth-hub", icon: Brain, group: "submissions", overviewKey: "growth_hub", formTypes: ["growth-tool", "ai-assistant", "calculator", "audit"] },
  { key: "pulsar", label: "Pulsar Referrals", to: "/admin/pulsar", icon: Share2, group: "submissions", overviewKey: "pulsar" },
  { key: "customers", label: "Customers", to: "/admin/customers", icon: Users, group: "billing", overviewKey: "customers" },
  { key: "quotations", label: "Quotations", to: "/admin/quotations", icon: ClipboardList, group: "billing" },
  { key: "invoices", label: "Invoices", to: "/admin/invoices", icon: FileText, group: "billing", overviewKey: "invoices" },
  { key: "receipts", label: "Receipts", to: "/admin/receipts", icon: ReceiptText, group: "billing" },
];

export const SUBMISSION_MODULES = ADMIN_MODULES.filter((m) => m.group === "submissions" || m.key === "submissions");

export function moduleLabelForFormType(formType: string | null | undefined): string {
  const ft = formType ?? "contact";
  const mod = ADMIN_MODULES.find((m) => m.formTypes?.includes(ft));
  return mod?.label ?? "Enquiry";
}
