export type WhatsAppDeliveryStatus = "pending" | "queued" | "delivered" | "failed" | "read";

export type HyOfferCustomer = {
  id: string;
  customerName: string;
  mobileNo: string;
  dealerName: string;
  referralCode: string;
  referralLink: string;
  deliveryStatus: WhatsAppDeliveryStatus;
  linkClicked: boolean;
  formSubmitted: boolean;
  clickedAt?: string;
  submittedAt?: string;
  lastMessageAt?: string;
  failureReason?: string;
};

export type ReferralStatus = "new" | "contacted" | "qualified" | "won" | "lost";

export type ReferralSubmission = {
  id: string;
  referrerCode: string;
  referrerName: string;
  referrerMobile: string;
  friendName: string;
  friendMobile: string;
  friendEmail?: string;
  referrerOffer: number;
  friendOffer: number;
  branch?: string;
  status?: ReferralStatus;
  admin_notes?: string | null;
  createdAt: string;
};

export type BulkCampaignMeta = {
  startedAt?: string;
  completedAt?: string;
  total: number;
  queued: number;
  delivered: number;
  failed: number;
};
