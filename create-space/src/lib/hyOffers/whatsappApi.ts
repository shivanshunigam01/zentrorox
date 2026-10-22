import type { HyOfferCustomer, WhatsAppDeliveryStatus } from "./types";
import { getCampaignMeta, getCustomers, setCampaignMeta, setCustomers } from "./store";

/**
 * WhatsApp bulk-send stub.
 * Replace `sendBulkWhatsApp` body with real provider API later.
 */
export type BulkSendProgress = {
  done: number;
  total: number;
  current?: HyOfferCustomer;
};

export type BulkSendResult = {
  delivered: number;
  failed: number;
  total: number;
};

function simulateStatus(mobileNo: string): WhatsAppDeliveryStatus {
  // Deterministic-ish mock: last digit even → delivered, odd → failed occasionally
  const last = Number(mobileNo.slice(-1));
  if (Number.isNaN(last)) return "delivered";
  if (last === 0 || last === 5) return "failed";
  return "delivered";
}

export async function sendBulkWhatsApp(
  onProgress?: (p: BulkSendProgress) => void,
): Promise<BulkSendResult> {
  const customers = getCustomers();
  if (!customers.length) {
    return { delivered: 0, failed: 0, total: 0 };
  }

  const startedAt = new Date().toISOString();
  let delivered = 0;
  let failed = 0;

  const next = customers.map((c) => ({
    ...c,
    deliveryStatus: "queued" as WhatsAppDeliveryStatus,
    lastMessageAt: startedAt,
    failureReason: undefined,
  }));
  setCustomers(next);
  setCampaignMeta({
    startedAt,
    total: next.length,
    queued: next.length,
    delivered: 0,
    failed: 0,
  });

  for (let i = 0; i < next.length; i++) {
    // Simulate network latency for UX; swap for real API call later.
    await new Promise((r) => setTimeout(r, 180));

    const status = simulateStatus(next[i].mobileNo);
    if (status === "delivered") {
      delivered += 1;
      next[i] = {
        ...next[i],
        deliveryStatus: "delivered",
        lastMessageAt: new Date().toISOString(),
        failureReason: undefined,
      };
    } else {
      failed += 1;
      next[i] = {
        ...next[i],
        deliveryStatus: "failed",
        lastMessageAt: new Date().toISOString(),
        failureReason: "WhatsApp delivery failed (stub)",
      };
    }

    setCustomers([...next]);
    setCampaignMeta({
      startedAt,
      total: next.length,
      queued: next.length - (i + 1),
      delivered,
      failed,
    });
    onProgress?.({ done: i + 1, total: next.length, current: next[i] });
  }

  setCampaignMeta({
    ...getCampaignMeta(),
    completedAt: new Date().toISOString(),
    queued: 0,
    delivered,
    failed,
  });

  return { delivered, failed, total: next.length };
}
