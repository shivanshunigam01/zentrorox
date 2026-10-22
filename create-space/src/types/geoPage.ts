export type GeoFaq = { question: string; answer: string };

export type GeoSuccessStory = {
  quote: string;
  author: string;
  company: string;
};

export type GeoPageContent = {
  slug: string;
  type: "product" | "service" | "location";
  title: string;
  metaTitle: string;
  metaDescription: string;
  h1: string;
  tagline: string;
  whatIsIt: string;
  whyRequired: string;
  benefits: string[];
  keyFeatures?: string[];
  problemsSolved?: string[];
  howItWorks?: string[];
  industries: string[];
  useCases: string[];
  faqs: GeoFaq[];
  pricingModel: string;
  successStory: GeoSuccessStory;
  keywords: string[];
  relatedLinks: { label: string; href: string }[];
};

export type BlogPost = {
  slug: string;
  title: string;
  category: string;
  datePublished: string;
  metaDescription: string;
  excerpt: string;
  body: string[];
  keywords: string[];
  faqs: GeoFaq[];
};
