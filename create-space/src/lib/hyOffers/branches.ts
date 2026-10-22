export type BranchCode = "BR" | "TR" | "HY";

export type BranchInfo = {
  code: BranchCode;
  name: string;
  shortLabel: string;
  cityHint: string;
  accent: string;
};

export const BRANCHES: Record<BranchCode, BranchInfo> = {
  BR: {
    code: "BR",
    name: "Brite Bajaj",
    shortLabel: "Brite",
    cityHint: "Authorized Bajaj dealer",
    accent: "#E31C23",
  },
  TR: {
    code: "TR",
    name: "Tirhut Bajaj",
    shortLabel: "Tirhut",
    cityHint: "Authorized Bajaj dealer",
    accent: "#1B4F9C",
  },
  HY: {
    code: "HY",
    name: "HY Bajaj",
    shortLabel: "HY Bajaj",
    cityHint: "Authorized Bajaj dealer",
    accent: "#0B6E4F",
  },
};

export const BRANCH_ORDER: BranchCode[] = ["BR", "TR", "HY"];

export function parseBranchCode(value: string | undefined): BranchCode | null {
  const v = (value ?? "").trim().toUpperCase();
  if (v === "BR" || v === "TR" || v === "HY") return v;
  return null;
}

/** Extract BR | TR | HY from codes like N160-BR-072026-0001 */
export function branchFromReferralCode(referralCode: string): BranchCode | null {
  const m = referralCode.toUpperCase().match(/-(BR|TR|HY)-/);
  return m ? (m[1] as BranchCode) : null;
}

export function dealerNameForBranch(branch: BranchCode): string {
  return BRANCHES[branch].name;
}
