import { SITE_URL } from "@/data/seoContent";
import type { BlogPost, GeoPageContent } from "@/types/geoPage";

export const ORG_ID = `${SITE_URL}/#organization`;

export const orgRef = { "@id": ORG_ID };

export function breadcrumbSchema(items: { name: string; path: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: item.name,
      item: `${SITE_URL}${item.path}`,
    })),
  };
}

export function faqSchema(faqs: { question: string; answer: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((f) => ({
      "@type": "Question",
      name: f.question,
      acceptedAnswer: { "@type": "Answer", text: f.answer },
    })),
  };
}

export function serviceSchema(page: GeoPageContent) {
  return {
    "@context": "https://schema.org",
    "@type": "Service",
    name: page.title,
    description: page.metaDescription,
    provider: orgRef,
    areaServed: "India",
    serviceType: page.tagline,
    url: `${SITE_URL}/services/${page.slug}`,
    keywords: page.keywords.join(", "),
  };
}

export function productSchema(page: GeoPageContent) {
  return {
    "@context": "https://schema.org",
    "@type": "Product",
    name: page.title,
    description: page.metaDescription,
    brand: { "@type": "Brand", name: "Zentroverse" },
    category: page.tagline,
    keywords: page.keywords.join(", "),
    offers: {
      "@type": "Offer",
      availability: "https://schema.org/InStock",
      priceCurrency: "INR",
      url: `${SITE_URL}/products/${page.slug}`,
    },
  };
}

export function articleSchema(post: BlogPost) {
  return {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: post.title,
    description: post.metaDescription,
    articleSection: post.category,
    datePublished: post.datePublished,
    dateModified: post.datePublished,
    author: orgRef,
    publisher: {
      "@type": "Organization",
      "@id": ORG_ID,
      name: "Zentroverse Global Private Limited",
      logo: { "@type": "ImageObject", url: `${SITE_URL}/favicon.jpg` },
    },
    mainEntityOfPage: `${SITE_URL}/blogs/${post.slug}`,
    url: `${SITE_URL}/blogs/${post.slug}`,
    keywords: post.keywords.join(", "),
  };
}

export function videoSchema(opts: {
  name: string;
  description: string;
  thumbnailUrl: string;
  uploadDate: string;
  contentUrl?: string;
}) {
  return {
    "@context": "https://schema.org",
    "@type": "VideoObject",
    name: opts.name,
    description: opts.description,
    thumbnailUrl: opts.thumbnailUrl,
    uploadDate: opts.uploadDate,
    ...(opts.contentUrl ? { contentUrl: opts.contentUrl, embedUrl: opts.contentUrl } : {}),
    publisher: orgRef,
  };
}

export function geoPageSchemas(page: GeoPageContent, breadcrumbs: { name: string; path: string }[]) {
  const mainSchema =
    page.type === "product"
      ? productSchema(page)
      : page.type === "location"
        ? {
            "@context": "https://schema.org",
            "@type": "Service",
            name: page.title,
            description: page.metaDescription,
            provider: orgRef,
            areaServed: page.slug === "bihar" || page.slug === "patna" ? "Bihar" : page.slug === "jharkhand" ? "Jharkhand" : "India",
            url: `${SITE_URL}/locations/${page.slug}`,
          }
        : serviceSchema(page);

  const base: Record<string, unknown>[] = [
    breadcrumbSchema(breadcrumbs),
    faqSchema(page.faqs),
    mainSchema,
  ];
  if (page.successStory) {
    base.push({
      "@context": "https://schema.org",
      "@type": "Review",
      reviewBody: page.successStory.quote,
      author: { "@type": "Person", name: page.successStory.author },
      itemReviewed: { "@type": "Thing", name: page.title },
      reviewRating: { "@type": "Rating", ratingValue: 5, bestRating: 5 },
    });
  }
  return base;
}
