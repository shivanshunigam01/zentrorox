import { toast } from "sonner";
import { API_ROUTES, apiUrl } from "@/config/api";

type CreateOrderResponse = {
  orderId: string;
  amount: number;
  currency: string;
  keyId: string;
};

declare global {
  interface Window {
    Razorpay?: new (options: Record<string, unknown>) => { open: () => void };
  }
}

export function loadRazorpayScript(): Promise<boolean> {
  return new Promise((resolve) => {
    if (typeof window === "undefined") {
      resolve(false);
      return;
    }
    if (window.Razorpay) {
      resolve(true);
      return;
    }
    const existing = document.querySelector<HTMLScriptElement>('script[src="https://checkout.razorpay.com/v1/checkout.js"]');
    if (existing) {
      existing.addEventListener("load", () => resolve(!!window.Razorpay));
      existing.addEventListener("error", () => resolve(false));
      return;
    }
    const s = document.createElement("script");
    s.src = "https://checkout.razorpay.com/v1/checkout.js";
    s.async = true;
    s.onload = () => resolve(!!window.Razorpay);
    s.onerror = () => resolve(false);
    document.body.appendChild(s);
  });
}

export async function fetchCreateOrder(planId: string, email: string): Promise<CreateOrderResponse> {
  const r = await fetch(apiUrl(API_ROUTES.RAZORPAY_CREATE_ORDER), {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ planId, email }),
  });
  const data = (await r.json()) as CreateOrderResponse & { error?: string };
  if (!r.ok) {
    throw new Error(data.error ?? "Could not start payment.");
  }
  if (!data.orderId || !data.keyId) {
    throw new Error("Invalid order response.");
  }
  return data as CreateOrderResponse;
}

export async function verifyPaymentOnServer(payload: {
  razorpay_order_id: string;
  razorpay_payment_id: string;
  razorpay_signature: string;
}): Promise<boolean> {
  const r = await fetch(apiUrl(API_ROUTES.RAZORPAY_VERIFY_PAYMENT), {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  const data = (await r.json()) as { ok?: boolean };
  return r.ok && data.ok === true;
}

type OpenCheckoutArgs = {
  planId: string;
  planName: string;
  email: string;
  name: string;
  contact: string;
  onPaid: (paymentId: string) => void;
  onFailure?: (message: string) => void;
};

export async function openRazorpayCheckoutForPlan({
  planId,
  planName,
  email,
  name,
  contact,
  onPaid,
  onFailure,
}: OpenCheckoutArgs): Promise<void> {
  const scriptOk = await loadRazorpayScript();
  if (!scriptOk || !window.Razorpay) {
    toast.error("Could not load Razorpay. Check your connection.");
    onFailure?.("script");
    return;
  }

  let order: CreateOrderResponse;
  try {
    order = await fetchCreateOrder(planId, email);
  } catch (e) {
    const msg = e instanceof Error ? e.message : "Payment could not start.";
    toast.error(msg);
    onFailure?.(msg);
    return;
  }

  const options = {
    key: order.keyId,
    amount: String(order.amount),
    currency: order.currency,
    order_id: order.orderId,
    name: "Zentrobot",
    description: `${planName} — monthly platform fee`,
    prefill: {
      email: email || undefined,
      name: name || undefined,
      contact: contact.replace(/\D/g, "").slice(0, 15) || undefined,
    },
    theme: { color: "#0d9488" },
    handler: async (response: {
      razorpay_payment_id: string;
      razorpay_order_id: string;
      razorpay_signature: string;
    }) => {
      const valid = await verifyPaymentOnServer({
        razorpay_order_id: response.razorpay_order_id,
        razorpay_payment_id: response.razorpay_payment_id,
        razorpay_signature: response.razorpay_signature,
      });
      if (!valid) {
        toast.error("Payment verification failed. Contact support if you were charged.");
        onFailure?.("verify");
        return;
      }
      onPaid(response.razorpay_payment_id);
    },
    modal: {
      ondismiss: () => {
        onFailure?.("dismiss");
      },
    },
  };

  const rzp = new window.Razorpay(options);
  rzp.open();
}
