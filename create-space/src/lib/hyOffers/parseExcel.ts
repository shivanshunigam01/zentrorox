import * as XLSX from "xlsx";
import type { HyOfferCustomer } from "./types";
import { normalizeReferralLink } from "./store";

const HEADER_ALIASES: Record<
  keyof Pick<
    HyOfferCustomer,
    "customerName" | "mobileNo" | "dealerName" | "referralCode" | "referralLink"
  >,
  string[]
> = {
  customerName: [
    "customer name",
    "customername",
    "name",
    "customer",
    "owner name",
    "ownername",
    "owner",
  ],
  mobileNo: ["mobile no", "mobile", "mobile number", "phone", "phoneno", "phone no"],
  dealerName: ["dealername", "dealer name", "dealer"],
  referralCode: ["referralcode", "referral code", "code", "refferal code", "refferalcode"],
  referralLink: ["referrallink", "referral link", "link", "refferal link", "referrallink"],
};

function normalizeHeader(h: unknown): string {
  return String(h ?? "")
    .trim()
    .toLowerCase()
    .replace(/[_-]+/g, " ")
    .replace(/\s+/g, " ");
}

function mapHeaders(headers: string[]): Partial<Record<keyof typeof HEADER_ALIASES, number>> {
  const map: Partial<Record<keyof typeof HEADER_ALIASES, number>> = {};
  headers.forEach((header, index) => {
    const n = normalizeHeader(header);
    (Object.keys(HEADER_ALIASES) as (keyof typeof HEADER_ALIASES)[]).forEach((field) => {
      if (map[field] !== undefined) return;
      if (HEADER_ALIASES[field].includes(n)) map[field] = index;
    });
  });
  return map;
}

function cell(row: unknown[], index: number | undefined): string {
  if (index === undefined) return "";
  const v = row[index];
  if (v == null) return "";
  return String(v).trim();
}

function uid(prefix = "cust") {
  return `${prefix}_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 8)}`;
}

export type ParseExcelResult = {
  customers: HyOfferCustomer[];
  errors: string[];
  sheetName?: string;
};

function parseSheetRows(rows: unknown[][], idPrefix?: string): ParseExcelResult {
  if (!rows.length) {
    return { customers: [], errors: ["Sheet is empty."] };
  }

  const headerRow = (rows[0] as unknown[]).map((h) => String(h ?? ""));
  const colMap = mapHeaders(headerRow);
  const required: (keyof typeof HEADER_ALIASES)[] = [
    "customerName",
    "mobileNo",
    "dealerName",
    "referralCode",
  ];
  const missing = required.filter((k) => colMap[k] === undefined);
  if (missing.length) {
    return {
      customers: [],
      errors: [
        `Missing required columns: ${missing.join(", ")}. Expected: Customer Name / Owner Name / Customer, Mobile No, DealerName, ReferralCode, ReferralLink.`,
      ],
    };
  }

  const errors: string[] = [];
  const customers: HyOfferCustomer[] = [];
  const seenCodes = new Set<string>();

  for (let i = 1; i < rows.length; i++) {
    const row = rows[i] as unknown[];
    if (!row || row.every((c) => String(c ?? "").trim() === "")) continue;

    const customerName = cell(row, colMap.customerName);
    const mobileNo = cell(row, colMap.mobileNo).replace(/\D/g, "");
    const dealerName = cell(row, colMap.dealerName);
    const referralCode = cell(row, colMap.referralCode);
    const referralLinkRaw = cell(row, colMap.referralLink);

    if (!customerName || !mobileNo || !dealerName || !referralCode) {
      errors.push(`Row ${i + 1}: incomplete data — skipped.`);
      continue;
    }

    const codeKey = referralCode.toUpperCase();
    if (seenCodes.has(codeKey)) {
      errors.push(`Row ${i + 1}: duplicate referral code ${referralCode} — skipped.`);
      continue;
    }
    seenCodes.add(codeKey);

    customers.push({
      id: uid(idPrefix),
      customerName,
      mobileNo,
      dealerName,
      referralCode,
      referralLink: normalizeReferralLink(referralLinkRaw, referralCode),
      deliveryStatus: "pending",
      linkClicked: false,
      formSubmitted: false,
    });
  }

  if (!customers.length) {
    errors.push("No valid customer rows found.");
  }

  return { customers, errors };
}

export async function parseHyOffersExcel(file: File): Promise<ParseExcelResult> {
  const buffer = await file.arrayBuffer();
  return parseHyOffersWorkbook(buffer, file.name);
}

export function parseHyOffersWorkbook(
  buffer: ArrayBuffer,
  sourceLabel = "workbook",
): ParseExcelResult {
  const workbook = XLSX.read(buffer, { type: "array" });
  const sheetName = workbook.SheetNames[0];
  if (!sheetName) {
    return { customers: [], errors: [`${sourceLabel}: workbook has no sheets.`] };
  }

  const sheet = workbook.Sheets[sheetName];
  const rows = XLSX.utils.sheet_to_json<unknown[]>(sheet, { header: 1, defval: "" });
  const result = parseSheetRows(rows, sourceLabel.replace(/\W+/g, "_").slice(0, 12));
  return { ...result, sheetName };
}

/** Merge customer lists by referral code (later rows win). */
export function mergeCustomers(...lists: HyOfferCustomer[][]): HyOfferCustomer[] {
  const map = new Map<string, HyOfferCustomer>();
  for (const list of lists) {
    for (const c of list) {
      map.set(c.referralCode.toUpperCase(), c);
    }
  }
  return Array.from(map.values());
}
