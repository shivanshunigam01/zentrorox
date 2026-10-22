import type { HyOfferCustomer } from "./types";
import type { BranchCode } from "./branches";

/**
 * Legacy demo seed kept empty — live BR / TR / HY customers come from
 * `public/hy-offers-data/*` (Brite bajaj.xlsx, Tirhut bajaj.xlsx, HY_bajaj.xlsx).
 */
export const DEMO_REFERRAL_CUSTOMERS: HyOfferCustomer[] = [];

export const DEMO_REFERRAL_PATHS: string[] = [];

export function demoCustomersByBranch(_branch: BranchCode): HyOfferCustomer[] {
  return [];
}
