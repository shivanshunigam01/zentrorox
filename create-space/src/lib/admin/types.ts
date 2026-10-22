export interface Customer {
  id: string;
  name: string;
  company: string;
  gstin: string;
  phone: string;
  email: string;
  city: string;
  address: string;
  totalSpend: number;
  createdAt: string;
}

export interface LineItem {
  id: string;
  description: string;
  qty: number;
  rate: number;
}

export type DocStatus = "draft" | "sent" | "paid" | "overdue" | "accepted" | "expired";

export interface DocBase {
  id: string;
  number: string;
  customerId: string;
  date: string;
  dueDate?: string;
  items: LineItem[];
  gstPercent: number;
  notes?: string;
  status: DocStatus;
}

export type Quotation = DocBase;
export type Invoice = DocBase & { quotationId?: string; paidAt?: string };

export interface Receipt {
  id: string;
  number: string;
  invoiceId: string;
  customerId: string;
  amount: number;
  date: string;
  mode: "Cash" | "UPI" | "Bank Transfer" | "Cheque" | "Card";
}

export interface CompanySettings {
  name: string;
  address: string;
  gstin: string;
  phone: string;
  email: string;
  defaultGstPercent: number;
  bankDetails: string;
  footerNote: string;
  logoDataUrl: string; // base64 — empty string falls back to bundled logo
}
