/** Category badges + gradients — matched to portfolio Projects page */
export const WORK_CATEGORIES = [
  "Automobile",
  "EV",
  "Corporate",
  "Finance",
  "Tools",
  "Travel",
  "SaaS",
  "Healthcare",
  "Insurance",
  "Enterprise",
] as const;

export const WORK_CATEGORY_STYLES: Record<string, string> = {
  Automobile: "bg-orange-100 text-orange-800 dark:bg-orange-900/40 dark:text-orange-200",
  EV: "bg-emerald-100 text-emerald-800 dark:bg-emerald-900/40 dark:text-emerald-200",
  Corporate: "bg-slate-100 text-slate-800 dark:bg-slate-800 dark:text-slate-200",
  Finance: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/40 dark:text-yellow-200",
  Tools: "bg-violet-100 text-violet-800 dark:bg-violet-900/40 dark:text-violet-200",
  Travel: "bg-indigo-100 text-indigo-800 dark:bg-indigo-900/40 dark:text-indigo-200",
  SaaS: "bg-blue-100 text-blue-800 dark:bg-blue-900/40 dark:text-blue-200",
  Healthcare: "bg-rose-100 text-rose-800 dark:bg-rose-900/40 dark:text-rose-200",
  Insurance: "bg-cyan-100 text-cyan-800 dark:bg-cyan-900/40 dark:text-cyan-200",
  Enterprise: "bg-fuchsia-100 text-fuchsia-800 dark:bg-fuchsia-900/40 dark:text-fuchsia-200",
};

export const WORK_GRADIENT_PALETTE = [
  "from-purple-500 via-fuchsia-500 to-pink-500",
  "from-blue-500 via-cyan-500 to-teal-500",
  "from-emerald-500 via-green-500 to-lime-500",
  "from-orange-500 via-red-500 to-pink-500",
  "from-indigo-500 via-purple-500 to-pink-500",
  "from-yellow-500 via-orange-500 to-red-500",
];

export function buildScreenshotSources(url: string): string[] {
  const encoded = encodeURIComponent(url);
  return [
    `https://s.wordpress.com/mshots/v1/${encoded}?w=1280&h=800`,
    `https://image.thum.io/get/width/1280/noanimate/https://${url.replace(/^https?:\/\//, "")}`,
  ];
}
