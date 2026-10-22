import { loadList } from "./store";
import { seedCustomers, seedInvoices, seedQuotations, seedReceipts, seedSettings } from "./seed";
import { importCrmBulk } from "./crmApi";
import type { Customer, Invoice, Quotation, Receipt, CompanySettings } from "./types";

const MIGRATION_KEY = "zv_crm_migrated_v1";

export async function migrateLocalCrmToBackend(): Promise<boolean> {
  if (localStorage.getItem(MIGRATION_KEY) === "1") return false;

  const customers = loadList<Customer>("customers", seedCustomers);
  const quotations = loadList<Quotation>("quotations", seedQuotations);
  const invoices = loadList<Invoice>("invoices", seedInvoices);
  const receipts = loadList<Receipt>("receipts", seedReceipts);
  const settings = loadList<CompanySettings>("settings", [seedSettings])[0] ?? seedSettings;

  const hasLocal =
    customers.length > 0 || quotations.length > 0 || invoices.length > 0 || receipts.length > 0;

  if (!hasLocal) {
    localStorage.setItem(MIGRATION_KEY, "1");
    return false;
  }

  try {
    await importCrmBulk({ customers, quotations, invoices, receipts, settings });
    localStorage.setItem(MIGRATION_KEY, "1");
    return true;
  } catch {
    return false;
  }
}
