import { FAQ_ITEMS, META, SITE_URL, PRODUCT_SEO } from "@/data/seoContent";
import { SOLUTION_BRANDS, TESTIMONIALS } from "@/data/homeContent";
import { BLOG_POSTS } from "@/data/blogPosts";

const ORG = {
  name: "Zentroverse Global Private Limited",
  legalName: "Zentroverse Global Pvt. Ltd.",
  url: SITE_URL,
  email: "digital@zentroverse.com",
  phone: "+919973045587",
  gstin: "10AACCZ7470L1Z3",
  logo: `${SITE_URL}/favicon.jpg`,
  foundingDate: "2025-09-12",
  address: {
    streetAddress: "2nd Floor, Bihar State Financial Corporation, Fraser Rd, Old Jakkanpur, Indira Nagar",
    addressLocality: "Patna",
    addressRegion: "Bihar",
    postalCode: "800001",
    addressCountry: "IN",
  },
};

export function buildHomepageSchemas() {
  const organization = {
    "@context": "https://schema.org",
    "@type": "Organization",
    "@id": `${SITE_URL}/#organization`,
    name: ORG.name,
    legalName: ORG.legalName,
    url: ORG.url,
    logo: ORG.logo,
    email: ORG.email,
    telephone: ORG.phone,
    taxID: ORG.gstin,
    foundingDate: ORG.foundingDate,
    founder: { "@type": "Person", name: "Manmohan Jha" },
    address: { "@type": "PostalAddress", ...ORG.address },
    sameAs: [
      "https://www.linkedin.com/company/zentroverse",
      "https://www.instagram.com/zentroverse",
      "https://www.youtube.com/@zentroverse",
    ],
    description: META.description,
    areaServed: ["IN", "Bihar", "Jharkhand"],
    knowsAbout: [
      "Digital Marketing",
      "CRM Development",
      "ERP Development",
      "WhatsApp API",
      "Lead Management",
      "Dealer Network Expansion",
      "Business Consultancy",
    ],
  };

  const localBusiness = {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    "@id": `${SITE_URL}/#localbusiness`,
    name: ORG.legalName,
    image: `${SITE_URL}/og-image.jpg`,
    url: ORG.url,
    telephone: ORG.phone,
    email: ORG.email,
    priceRange: "₹₹",
    address: { "@type": "PostalAddress", ...ORG.address },
    geo: {
      "@type": "GeoCoordinates",
      latitude: 25.5941,
      longitude: 85.1376,
    },
    openingHoursSpecification: {
      "@type": "OpeningHoursSpecification",
      dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"],
      opens: "10:00",
      closes: "19:00",
    },
    parentOrganization: { "@id": `${SITE_URL}/#organization` },
  };

  const website = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "@id": `${SITE_URL}/#website`,
    url: SITE_URL,
    name: "Zentroverse Global",
    description: META.description,
    publisher: { "@id": `${SITE_URL}/#organization` },
  };

  const breadcrumb = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: SITE_URL },
    ],
  };

  const faqPage = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: FAQ_ITEMS.map((item) => ({
      "@type": "Question",
      name: item.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: item.answer,
      },
    })),
  };

  const services = [
    { name: "Digital Marketing Services", slug: "digital-marketing" },
    { name: "Business Automation Solutions", slug: "business-automation" },
    { name: "Lead Management & CRM", slug: "lead-management" },
    { name: "WhatsApp API & AI Chatbots", slug: "whatsapp-ai" },
    { name: "Business Consultancy Services", slug: "business-consultancy" },
    { name: "Dealer & Network Expansion", slug: "network-expansion" },
  ].map((s) => ({
    "@context": "https://schema.org",
    "@type": "Service",
    name: s.name,
    provider: { "@id": `${SITE_URL}/#organization` },
    areaServed: "India",
    serviceType: s.name,
    url: `${SITE_URL}/services/${s.slug}`,
  }));

  const products = SOLUTION_BRANDS.map((brand) => {
    const seo = PRODUCT_SEO[brand.key];
    return {
      "@context": "https://schema.org",
      "@type": "Product",
      name: brand.name.replace("™️", ""),
      description: seo?.description ?? brand.tagline,
      brand: { "@type": "Brand", name: "Zentroverse" },
      category: brand.tagline,
      keywords: seo?.keywords.join(", "),
      offers: {
        "@type": "Offer",
        availability: "https://schema.org/InStock",
        priceCurrency: "INR",
        url: `${SITE_URL}/products/${brand.key}`,
      },
    };
  });

  const reviews = TESTIMONIALS.map((t) => ({
    "@context": "https://schema.org",
    "@type": "Review",
    author: { "@type": "Person", name: t.name },
    reviewBody: t.quote,
    reviewRating: {
      "@type": "Rating",
      ratingValue: t.rating,
      bestRating: 5,
    },
    itemReviewed: { "@id": `${SITE_URL}/#organization` },
  }));

  const aggregateRating = {
    "@context": "https://schema.org",
    "@type": "AggregateRating",
    itemReviewed: { "@id": `${SITE_URL}/#organization` },
    ratingValue: "5",
    reviewCount: String(TESTIMONIALS.length),
    bestRating: "5",
  };

  const articles = BLOG_POSTS.slice(0, 6).map((post) => ({
    "@context": "https://schema.org",
    "@type": "Article",
    headline: post.title,
    articleSection: post.category,
    datePublished: post.datePublished,
    author: { "@id": `${SITE_URL}/#organization` },
    publisher: { "@id": `${SITE_URL}/#organization` },
    url: `${SITE_URL}/blogs/${post.slug}`,
  }));

  const videoTestimonials = TESTIMONIALS.filter((t) => t.videoUrl).map((t) => ({
    "@context": "https://schema.org",
    "@type": "VideoObject",
    name: `Customer testimonial — ${t.name}`,
    description: t.quote,
    thumbnailUrl: `${SITE_URL}/og-image.jpg`,
    uploadDate: "2026-01-15",
    contentUrl: t.videoUrl,
    embedUrl: t.videoUrl,
    publisher: { "@id": `${SITE_URL}/#organization` },
  }));

  return [
    organization,
    localBusiness,
    website,
    breadcrumb,
    faqPage,
    ...services,
    ...products,
    ...reviews,
    aggregateRating,
    ...articles,
    ...videoTestimonials,
  ];
}
