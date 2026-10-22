import type { HyOfferCustomer } from "./types";
import { getCampaignMeta, getCustomers, getSubmissions } from "./store";

/**
 * Bulk WhatsApp report stub.
 * Wire to real provider report API later; currently derived from local store.
 */
export type HyOffersReportRow = {
  customerName: string;
  mobileNo: string;
  dealerName: string;
  referralCode: string;
  deliveryStatus: HyOfferCustomer["deliveryStatus"];
  linkClicked: boolean;
  formSubmitted: boolean;
  friendSubmissions: number;
  clickedAt?: string;
  submittedAt?: string;
  failureReason?: string;
};

export type HyOffersReport = {
  generatedAt: string;
  summary: {
    total: number;
    delivered: number;
    failed: number;
    pending: number;
    linkClicks: number;
    formSubmissions: number;
    friendFills: number;
  };
  rows: HyOffersReportRow[];
};

export async function fetchBulkWhatsAppReport(): Promise<HyOffersReport> {
  // TODO: replace with GET /api/hy-offers/whatsapp/report
  const customers = getCustomers();
  const submissions = getSubmissions();
  const campaign = getCampaignMeta();

  const rows: HyOffersReportRow[] = customers.map((c) => ({
    customerName: c.customerName,
    mobileNo: c.mobileNo,
    dealerName: c.dealerName,
    referralCode: c.referralCode,
    deliveryStatus: c.deliveryStatus,
    linkClicked: c.linkClicked,
    formSubmitted: c.formSubmitted,
    friendSubmissions: submissions.filter(
      (s) => s.referrerCode.toUpperCase() === c.referralCode.toUpperCase(),
    ).length,
    clickedAt: c.clickedAt,
    submittedAt: c.submittedAt,
    failureReason: c.failureReason,
  }));

  const delivered =
    campaign.delivered || customers.filter((c) => c.deliveryStatus === "delivered").length;
  const failed = campaign.failed || customers.filter((c) => c.deliveryStatus === "failed").length;
  const pending = customers.filter(
    (c) => c.deliveryStatus === "pending" || c.deliveryStatus === "queued",
  ).length;

  return {
    generatedAt: new Date().toISOString(),
    summary: {
      total: customers.length,
      delivered,
      failed,
      pending,
      linkClicks: customers.filter((c) => c.linkClicked).length,
      formSubmissions: customers.filter((c) => c.formSubmitted).length,
      friendFills: submissions.length,
    },
    rows,
  };
}
