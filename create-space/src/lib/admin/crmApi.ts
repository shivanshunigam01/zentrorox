import { apiUrl } from "@/config/api";
import { adminHeaders } from "./auth";
import type { CompanySettings, Customer, Invoice, Quotation, Receipt } from "./types";

const call = async (path: string, init: RequestInit = {}) => {
  const res = await fetch(apiUrl(path), {
    ...init,
    headers: { ...adminHeaders(), ...(init.headers ?? {}) },
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data.error || `Request failed (${res.status})`);
  return data;
};

export const fetchCustomers = async (): Promise<Customer[]> => {
  const d = await call("/api/crm/customers");
  return d.customers ?? [];
};

export const createCustomer = async (body: Omit<Customer, "id" | "createdAt">) => {
  const d = await call("/api/crm/customers", { method: "POST", body: JSON.stringify(body) });
  return d.customer as Customer;
};

export const updateCustomer = async (id: string, body: Partial<Customer>) => {
  const d = await call(`/api/crm/customers/${id}`, { method: "PUT", body: JSON.stringify(body) });
  return d.customer as Customer;
};

export const deleteCustomer = async (id: string) => {
  await call(`/api/crm/customers/${id}`, { method: "DELETE" });
};

export const fetchQuotations = async (): Promise<Quotation[]> => {
  const d = await call("/api/crm/quotations");
  return d.quotations ?? [];
};

export const createQuotation = async (body: Omit<Quotation, "id">) => {
  const d = await call("/api/crm/quotations", { method: "POST", body: JSON.stringify(body) });
  return d.quotation as Quotation;
};

export const updateQuotation = async (id: string, body: Partial<Quotation>) => {
  const d = await call(`/api/crm/quotations/${id}`, { method: "PUT", body: JSON.stringify(body) });
  return d.quotation as Quotation;
};

export const deleteQuotation = async (id: string) => {
  await call(`/api/crm/quotations/${id}`, { method: "DELETE" });
};

export const convertQuotationToInvoice = async (id: string) => {
  const d = await call("/api/crm/quotations/convert-to-invoice", { method: "POST", body: JSON.stringify({ id }) });
  return d.invoice as Invoice;
};

export const fetchInvoices = async (): Promise<Invoice[]> => {
  const d = await call("/api/crm/invoices");
  return d.invoices ?? [];
};

export const createInvoice = async (body: Omit<Invoice, "id">) => {
  const d = await call("/api/crm/invoices", { method: "POST", body: JSON.stringify(body) });
  return d.invoice as Invoice;
};

export const updateInvoice = async (id: string, body: Partial<Invoice>) => {
  const d = await call(`/api/crm/invoices/${id}`, { method: "PUT", body: JSON.stringify(body) });
  return d.invoice as Invoice;
};

export const deleteInvoice = async (id: string) => {
  await call(`/api/crm/invoices/${id}`, { method: "DELETE" });
};

export const markInvoicePaid = async (id: string, mode?: Receipt["mode"]) => {
  const d = await call("/api/crm/invoices/mark-paid", { method: "POST", body: JSON.stringify({ id, mode }) });
  return d as { invoice: Invoice; receipt: Receipt };
};

export const fetchReceipts = async (): Promise<Receipt[]> => {
  const d = await call("/api/crm/receipts");
  return d.receipts ?? [];
};

export const fetchCompanySettings = async (): Promise<CompanySettings> => {
  const d = await call("/api/crm/settings");
  return d.settings as CompanySettings;
};

export const saveCompanySettings = async (settings: CompanySettings) => {
  const d = await call("/api/crm/settings", { method: "PUT", body: JSON.stringify(settings) });
  return d.settings as CompanySettings;
};

export const importCrmBulk = async (payload: {
  customers?: Customer[];
  quotations?: Quotation[];
  invoices?: Invoice[];
  receipts?: Receipt[];
  settings?: CompanySettings;
}) => {
  return call("/api/crm/import", { method: "POST", body: JSON.stringify(payload) });
};
