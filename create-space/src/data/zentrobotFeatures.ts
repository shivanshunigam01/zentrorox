import type { LucideIcon } from "lucide-react";
import { Bot, Megaphone, Send } from "lucide-react";

export type ZentrobotFeature = {
  slug: string;
  title: string;
  subtitle: string;
  description: string;
  bullets: string[];
  Icon: LucideIcon;
};

export const ZENTROBOT_FEATURES: ZentrobotFeature[] = [
  {
    slug: "whatsapp-bulk-messaging",
    title: "Bulk messaging on WhatsApp",
    subtitle: "Official API broadcasts at scale",
    description:
      "Send approved template campaigns to segmented audiences from one dashboard. Schedule sends, track delivery and replies, and keep every broadcast compliant with Meta rules.",
    bullets: [
      "Template library & approval workflow",
      "Audience segments from CRM or CSV",
      "Delivery, read & reply analytics",
    ],
    Icon: Send,
  },
  {
    slug: "meta-ads",
    title: "Meta ads",
    subtitle: "Facebook & Instagram lead capture",
    description:
      "Connect Meta ad accounts so leads from Facebook and Instagram land in WhatsApp or your inbox automatically — no manual CSV exports between ads and follow-up.",
    bullets: [
      "Lead forms & Click-to-WhatsApp ads",
      "Campaign-level attribution",
      "Sync leads into nurture flows",
    ],
    Icon: Megaphone,
  },
  {
    slug: "chatbot",
    title: "Chatbot",
    subtitle: "24/7 automated conversations",
    description:
      "Build guided WhatsApp bots that answer FAQs, qualify leads, and hand off to humans with full chat history when the conversation needs a real person.",
    bullets: [
      "Visual flow builder & quick replies",
      "AI-assisted answers on your content",
      "Human handoff inside the same thread",
    ],
    Icon: Bot,
  },
];

export function findZentrobotFeature(slug: string): ZentrobotFeature | undefined {
  return ZENTROBOT_FEATURES.find((f) => f.slug === slug);
}
