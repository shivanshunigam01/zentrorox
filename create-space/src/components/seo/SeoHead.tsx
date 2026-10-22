import { useEffect } from "react";
import { SITE_URL } from "@/data/seoContent";

type Props = {
  title: string;
  description: string;
  path?: string;
  ogType?: string;
  keywords?: string[];
  noindex?: boolean;
};

const setMeta = (name: string, content: string, property = false) => {
  const attr = property ? "property" : "name";
  let el = document.querySelector(`meta[${attr}="${name}"]`) as HTMLMetaElement | null;
  if (!el) {
    el = document.createElement("meta");
    el.setAttribute(attr, name);
    document.head.appendChild(el);
  }
  el.content = content;
};

const setCanonical = (href: string) => {
  let el = document.querySelector('link[rel="canonical"]') as HTMLLinkElement | null;
  if (!el) {
    el = document.createElement("link");
    el.rel = "canonical";
    document.head.appendChild(el);
  }
  el.href = href;
};

export const SeoHead = ({
  title,
  description,
  path = "",
  ogType = "website",
  keywords = [],
  noindex = false,
}: Props) => {
  const url = `${SITE_URL}${path}`;
  const kw = keywords.join(", ");

  useEffect(() => {
    document.title = title;
    setMeta("description", description);
    if (kw) setMeta("keywords", kw);
    setMeta("robots", noindex ? "noindex, nofollow" : "index, follow");
    setCanonical(url);
    setMeta("og:title", title, true);
    setMeta("og:description", description, true);
    setMeta("og:type", ogType, true);
    setMeta("og:url", url, true);
    setMeta("og:image", `${SITE_URL}/og-image.jpg`, true);
    setMeta("twitter:card", "summary_large_image");
    setMeta("twitter:title", title);
    setMeta("twitter:description", description);
    setMeta("twitter:image", `${SITE_URL}/og-image.jpg`);
  }, [title, description, url, ogType, kw, noindex]);

  return null;
};
