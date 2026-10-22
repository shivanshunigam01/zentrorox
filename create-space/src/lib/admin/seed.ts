import type { Customer, Quotation, Invoice, Receipt, CompanySettings } from "./types";

export const seedCustomers: Customer[] = [
  { id: "cus_1", name: "Rajesh Kumar", company: "Kumar Motors", gstin: "27ABCDE1234F1Z5", phone: "+91 98200 11111", email: "rajesh@kumarmotors.in", city: "Mumbai", address: "12 Linking Rd, Bandra W, Mumbai 400050", totalSpend: 245000, createdAt: "2026-01-12" },
  { id: "cus_2", name: "Anita Sharma", company: "Sharma Auto Finance", gstin: "07AAAAA0000A1Z1", phone: "+91 98100 22222", email: "anita@sharmafin.in", city: "Delhi", address: "B-22 Connaught Place, New Delhi 110001", totalSpend: 180000, createdAt: "2026-02-04" },
  { id: "cus_3", name: "Vikram Patel", company: "Patel Fleet Co.", gstin: "24AAACP0000C1Z9", phone: "+91 99090 33333", email: "vikram@patelfleet.com", city: "Ahmedabad", address: "Sarkhej-Gandhinagar Hwy, Ahmedabad 380054", totalSpend: 412000, createdAt: "2026-02-21" },
  { id: "cus_4", name: "Sneha Reddy", company: "Reddy Insurance", gstin: "36AAACR0000D1Z2", phone: "+91 98480 44444", email: "sneha@reddyins.in", city: "Hyderabad", address: "Banjara Hills Rd 3, Hyderabad 500034", totalSpend: 96000, createdAt: "2026-03-09" },
  { id: "cus_5", name: "Mohit Verma", company: "Verma OEM Pvt Ltd", gstin: "29AAACV0000E1Z3", phone: "+91 99860 55555", email: "mohit@vermaoem.com", city: "Bengaluru", address: "Electronic City Phase 2, Bengaluru 560100", totalSpend: 528000, createdAt: "2026-03-18" },
  { id: "cus_6", name: "Pooja Singh", company: "Singh Dealers", gstin: "06AAACS0000F1Z4", phone: "+91 95551 66666", email: "pooja@singhdealers.in", city: "Gurugram", address: "Sector 14, Gurugram 122001", totalSpend: 134000, createdAt: "2026-04-02" },
  { id: "cus_7", name: "Arjun Iyer", company: "Iyer Logistics", gstin: "33AAACI0000G1Z5", phone: "+91 90030 77777", email: "arjun@iyerlog.in", city: "Chennai", address: "OMR Thoraipakkam, Chennai 600097", totalSpend: 312000, createdAt: "2026-04-19" },
  { id: "cus_8", name: "Neha Joshi", company: "Joshi Motors", gstin: "27AAACJ0000H1Z6", phone: "+91 98330 88888", email: "neha@joshimotors.in", city: "Pune", address: "FC Road, Pune 411005", totalSpend: 78000, createdAt: "2026-05-01" },
];

export const seedQuotations: Quotation[] = [
  {
    id: "qt_1", number: "QT-0001", customerId: "cus_1", date: "2026-05-04", dueDate: "2026-05-18", gstPercent: 18, status: "sent",
    items: [
      { id: "li_1", description: "Zentroverse CRM — Annual Subscription", qty: 1, rate: 60000 },
      { id: "li_2", description: "Onboarding & training", qty: 1, rate: 12000 },
    ],
    notes: "Valid for 14 days.",
  },
  {
    id: "qt_2", number: "QT-0002", customerId: "cus_3", date: "2026-05-12", dueDate: "2026-05-26", gstPercent: 18, status: "accepted",
    items: [
      { id: "li_3", description: "Fleet Tracker — 25 vehicles / year", qty: 25, rate: 4800 },
    ],
  },
  {
    id: "qt_3", number: "QT-0003", customerId: "cus_5", date: "2026-05-20", dueDate: "2026-06-03", gstPercent: 18, status: "draft",
    items: [
      { id: "li_4", description: "OEM Dashboard Pro", qty: 1, rate: 150000 },
      { id: "li_5", description: "Custom integrations (per hour)", qty: 20, rate: 2500 },
    ],
  },
];

export const seedInvoices: Invoice[] = [
  {
    id: "inv_1", number: "INV-0001", customerId: "cus_3", quotationId: "qt_2", date: "2026-05-28", dueDate: "2026-06-11", gstPercent: 18, status: "paid", paidAt: "2026-06-02",
    items: [{ id: "li_6", description: "Fleet Tracker — 25 vehicles / year", qty: 25, rate: 4800 }],
  },
  {
    id: "inv_2", number: "INV-0002", customerId: "cus_1", date: "2026-06-01", dueDate: "2026-06-15", gstPercent: 18, status: "sent",
    items: [{ id: "li_7", description: "Zentroverse CRM — Annual", qty: 1, rate: 60000 }],
  },
  {
    id: "inv_3", number: "INV-0003", customerId: "cus_7", date: "2026-05-15", dueDate: "2026-05-29", gstPercent: 18, status: "overdue",
    items: [{ id: "li_8", description: "Logistics module setup", qty: 1, rate: 85000 }],
  },
];

export const seedReceipts: Receipt[] = [
  { id: "rc_1", number: "RC-0001", invoiceId: "inv_1", customerId: "cus_3", amount: 141600, date: "2026-06-02", mode: "Bank Transfer" },
];

export const seedSettings: CompanySettings = {
  name: "Zentroverse Pvt Ltd",
  address: "5th Floor, Spectrum Tower, MG Road, Bengaluru, Karnataka 560001",
  gstin: "29AAACZ1234F1Z5",
  phone: "+91 80 1234 5678",
  email: "billing@zentroverse.in",
  defaultGstPercent: 18,
  bankDetails: "HDFC Bank • A/c 50100123456789 • IFSC HDFC0000123 • Branch: MG Road, Bengaluru",
  footerNote: "Thank you for your business with Zentroverse.",
  logoDataUrl: "",
};
