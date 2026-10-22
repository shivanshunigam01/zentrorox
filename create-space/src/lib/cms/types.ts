export type SocialPlatform = "linkedin" | "instagram" | "twitter" | "facebook" | "youtube";

export type SocialLink = {
  platform: SocialPlatform;
  url: string;
};

export type CompanyProfile = {
  legalName: string;
  tagline: string;
  address: string;
  gstin: string;
  email: string;
  website: string;
  phone: string;
  whatsappNumber: string;
  whatsappMessage: string;
  hours: string;
  bankName: string;
  accountName: string;
  accountNumber: string;
  ifsc: string;
  upi: string;
  social: SocialLink[];
};

export type WorkItem = {
  id: string;
  title: string;
  category: string;
  url: string;
  tech: string[];
  description: string;
  features: string[];
  imageUrl?: string;
  imagePublicId?: string;
};

export type CaseStudy = {
  id: string;
  title: string;
  problem: string;
  solution: string;
  outcome: string;
  tags: string[];
  imageUrl?: string;
  imagePublicId?: string;
};

export type Testimonial = {
  id: string;
  quote: string;
  name: string;
  company: string;
  designation: string;
  rating: number;
  mediaType: "video" | "image";
  videoUrl?: string;
  thumbnailUrl?: string;
};

export type GalleryItem = {
  id: string;
  category: string;
  mediaType: "image" | "video";
  url: string;
  publicId?: string;
  caption?: string;
  alt?: string;
};

export type ProductDemo = {
  id: string;
  title: string;
  product?: string;
  mediaType: "image" | "video";
  url: string;
  publicId?: string;
  caption?: string;
};

export type FaqItem = {
  question: string;
  answer: string;
};

export type CmsContent = {
  hero: {
    headline: string;
    tagline: string;
    subheadline: string;
  };
  meta: {
    title: string;
    description: string;
  };
  company: CompanyProfile;
  galleryCategories: string[];
  works: WorkItem[];
  caseStudies: CaseStudy[];
  testimonials: Testimonial[];
  gallery: GalleryItem[];
  productDemos: ProductDemo[];
  faqs: FaqItem[];
  updatedAt?: string | null;
};

export type MediaUploadResult = {
  ok: boolean;
  url: string;
  publicId: string;
  resourceType: string;
};
