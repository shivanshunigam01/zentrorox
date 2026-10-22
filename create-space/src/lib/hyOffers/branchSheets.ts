import type { BranchCode } from "./branches";
import { BRANCHES } from "./branches";
import type { HyOfferCustomer } from "./types";

export type BranchSheetSource = {
  branch: BranchCode;
  /** Bundled JSON under /hy-offers-data (pre-parsed from Excel) */
  jsonUrl: string;
  /** Excel file for download */
  excelUrl: string;
  /** Download / display filename */
  excelLabel: string;
  /** Expected row count from source sheets */
  expectedCount: number;
};

/** The three dealer branch sheets currently wired for HY Offers. */
export const BRANCH_SHEET_SOURCES: BranchSheetSource[] = [
  {
    branch: "BR",
    jsonUrl: "/hy-offers-data/brite-bajaj.json",
    excelUrl: "/hy-offers-data/brite-bajaj.xlsx",
    excelLabel: "Brite bajaj.xlsx",
    expectedCount: 7038,
  },
  {
    branch: "TR",
    jsonUrl: "/hy-offers-data/tirhut-bajaj.json",
    excelUrl: "/hy-offers-data/tirhut-bajaj.xlsx",
    excelLabel: "Tirhut bajaj.xlsx",
    expectedCount: 2087,
  },
  {
    branch: "HY",
    jsonUrl: "/hy-offers-data/hy-bajaj.json",
    excelUrl: "/hy-offers-data/hy-bajaj.xlsx",
    excelLabel: "HY_bajaj.xlsx",
    expectedCount: 1208,
  },
];

export type LoadBranchSheetsResult = {
  customers: HyOfferCustomer[];
  perBranch: { branch: BranchCode; count: number; label: string }[];
  errors: string[];
};

export async function loadBundledBranchSheets(): Promise<LoadBranchSheetsResult> {
  const errors: string[] = [];
  const perBranch: LoadBranchSheetsResult["perBranch"] = [];
  const customers: HyOfferCustomer[] = [];

  await Promise.all(
    BRANCH_SHEET_SOURCES.map(async (src) => {
      try {
        const res = await fetch(src.jsonUrl);
        if (!res.ok) {
          errors.push(`${src.excelLabel}: failed to load (${res.status})`);
          perBranch.push({
            branch: src.branch,
            count: 0,
            label: BRANCHES[src.branch].name,
          });
          return;
        }
        const rows = (await res.json()) as HyOfferCustomer[];
        if (!Array.isArray(rows)) {
          errors.push(`${src.excelLabel}: invalid JSON payload`);
          perBranch.push({
            branch: src.branch,
            count: 0,
            label: BRANCHES[src.branch].name,
          });
          return;
        }
        customers.push(...rows);
        perBranch.push({
          branch: src.branch,
          count: rows.length,
          label: BRANCHES[src.branch].name,
        });
      } catch (err) {
        console.error(err);
        errors.push(`${src.excelLabel}: ${err instanceof Error ? err.message : "load failed"}`);
        perBranch.push({
          branch: src.branch,
          count: 0,
          label: BRANCHES[src.branch].name,
        });
      }
    }),
  );

  perBranch.sort(
    (a, b) =>
      BRANCH_SHEET_SOURCES.findIndex((s) => s.branch === a.branch) -
      BRANCH_SHEET_SOURCES.findIndex((s) => s.branch === b.branch),
  );

  return { customers, perBranch, errors };
}

/** Trigger browser download for a branch Excel file. */
export function downloadBranchSheet(branch: BranchCode) {
  const src = BRANCH_SHEET_SOURCES.find((s) => s.branch === branch);
  if (!src) return;
  const a = document.createElement("a");
  a.href = src.excelUrl;
  a.download = src.excelLabel;
  a.rel = "noopener";
  document.body.appendChild(a);
  a.click();
  a.remove();
}
