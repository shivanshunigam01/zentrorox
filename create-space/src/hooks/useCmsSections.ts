import { useCallback, useEffect, useState } from "react";
import { CMS_UPDATED_EVENT } from "@/contexts/CmsContext";
import { fetchCmsSection } from "@/lib/cms/cmsApi";
import { DEFAULT_CMS } from "@/lib/cms/defaults";
import type {
  CaseStudy,
  CompanyProfile,
  FaqItem,
  GalleryItem,
  ProductDemo,
  Testimonial,
  WorkItem,
} from "@/lib/cms/types";

function useSectionRefresh(refresh: () => void) {
  useEffect(() => {
    window.addEventListener(CMS_UPDATED_EVENT, refresh);
    return () => window.removeEventListener(CMS_UPDATED_EVENT, refresh);
  }, [refresh]);
}

export function useWorksSection() {
  const [items, setItems] = useState<WorkItem[]>(DEFAULT_CMS.works);
  const [loading, setLoading] = useState(true);

  const refresh = useCallback(async () => {
    const data = await fetchCmsSection("works");
    if (data?.items) setItems(data.items as WorkItem[]);
    setLoading(false);
  }, []);

  useEffect(() => {
    void refresh();
  }, [refresh]);

  useSectionRefresh(refresh);

  return { items, loading, refresh };
}

export function useCaseStudiesSection() {
  const [items, setItems] = useState<CaseStudy[]>(DEFAULT_CMS.caseStudies);
  const [loading, setLoading] = useState(true);

  const refresh = useCallback(async () => {
    const data = await fetchCmsSection("case-studies");
    if (data?.items) setItems(data.items as CaseStudy[]);
    setLoading(false);
  }, []);

  useEffect(() => {
    void refresh();
  }, [refresh]);

  useSectionRefresh(refresh);

  return { items, loading, refresh };
}

export function useTestimonialsSection() {
  const [items, setItems] = useState<Testimonial[]>(DEFAULT_CMS.testimonials);
  const [loading, setLoading] = useState(true);

  const refresh = useCallback(async () => {
    const data = await fetchCmsSection("testimonials");
    if (data?.items) setItems(data.items as Testimonial[]);
    setLoading(false);
  }, []);

  useEffect(() => {
    void refresh();
  }, [refresh]);

  useSectionRefresh(refresh);

  return { items, loading, refresh };
}

export function useGallerySection() {
  const [items, setItems] = useState<GalleryItem[]>(DEFAULT_CMS.gallery);
  const [categories, setCategories] = useState<string[]>(DEFAULT_CMS.galleryCategories);
  const [loading, setLoading] = useState(true);

  const refresh = useCallback(async () => {
    const data = await fetchCmsSection("gallery");
    if (data?.items) setItems(data.items as GalleryItem[]);
    if (data?.categories) setCategories(data.categories);
    setLoading(false);
  }, []);

  useEffect(() => {
    void refresh();
  }, [refresh]);

  useSectionRefresh(refresh);

  return { items, categories, loading, refresh };
}

export function useProductDemosSection() {
  const [items, setItems] = useState<ProductDemo[]>(DEFAULT_CMS.productDemos);
  const [loading, setLoading] = useState(true);

  const refresh = useCallback(async () => {
    const data = await fetchCmsSection("product-demos");
    if (data?.items) setItems(data.items as ProductDemo[]);
    setLoading(false);
  }, []);

  useEffect(() => {
    void refresh();
  }, [refresh]);

  useSectionRefresh(refresh);

  return { items, loading, refresh };
}

export function useFaqsSection() {
  const [items, setItems] = useState<FaqItem[]>(DEFAULT_CMS.faqs);
  const [loading, setLoading] = useState(true);

  const refresh = useCallback(async () => {
    const data = await fetchCmsSection("faqs");
    if (data?.items) setItems(data.items as FaqItem[]);
    setLoading(false);
  }, []);

  useEffect(() => {
    void refresh();
  }, [refresh]);

  useSectionRefresh(refresh);

  return { items, loading, refresh };
}

export function useCompanySection() {
  const [company, setCompany] = useState<CompanyProfile>(DEFAULT_CMS.company);
  const [loading, setLoading] = useState(true);

  const refresh = useCallback(async () => {
    const data = await fetchCmsSection("company");
    if (data?.company) setCompany(data.company);
    setLoading(false);
  }, []);

  useEffect(() => {
    void refresh();
  }, [refresh]);

  useSectionRefresh(refresh);

  return { company, loading, refresh };
}

export function useHeroSeoSection() {
  const [hero, setHero] = useState(DEFAULT_CMS.hero);
  const [meta, setMeta] = useState(DEFAULT_CMS.meta);
  const [loading, setLoading] = useState(true);

  const refresh = useCallback(async () => {
    const data = await fetchCmsSection("hero-seo");
    if (data?.hero) setHero(data.hero);
    if (data?.meta) setMeta(data.meta);
    setLoading(false);
  }, []);

  useEffect(() => {
    void refresh();
  }, [refresh]);

  useSectionRefresh(refresh);

  return { hero, meta, loading, refresh };
}
