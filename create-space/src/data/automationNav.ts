import type { LucideIcon } from "lucide-react";
import { ZENTROBOT_FEATURES } from "@/data/zentrobotFeatures";

export type AutomationNavCategory = "product";

export interface AutomationMenuItem {
  slug: string;
  title: string;
  subtitle: string;
  Icon: LucideIcon;
}

export const automationProductMenu: AutomationMenuItem[] = ZENTROBOT_FEATURES.map((f) => ({
  slug: f.slug,
  title: f.title,
  subtitle: f.subtitle,
  Icon: f.Icon,
}));

export function getAutomationTopicCopy(
  _category: AutomationNavCategory,
  slug: string,
  fallbackTitle: string,
): { title: string; paragraphs: string[] } {
  const feature = ZENTROBOT_FEATURES.find((f) => f.slug === slug);
  if (!feature) {
    return {
      title: fallbackTitle,
      paragraphs: ["Tell us your volumes and goals — we’ll map the right Zentrobot plan in one session."],
    };
  }
  return {
    title: feature.title,
    paragraphs: [feature.description, ...feature.bullets.map((b) => `• ${b}`)],
  };
}

export function findMenuItem(category: AutomationNavCategory, slug: string): AutomationMenuItem | undefined {
  if (category !== "product") return undefined;
  return automationProductMenu.find((i) => i.slug === slug);
}
