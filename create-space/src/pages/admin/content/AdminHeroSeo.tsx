import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { CmsModuleHeader } from "@/components/admin/cms/CmsModuleHeader";
import { fetchCmsSection, saveCmsHeroSeo } from "@/lib/cms/cmsApi";
import { DEFAULT_CMS } from "@/lib/cms/defaults";
import { useCmsAdminSave } from "@/hooks/useCmsAdminSave";

const AdminHeroSeo = () => {
  const { publishResult } = useCmsAdminSave();
  const [hero, setHero] = useState(DEFAULT_CMS.hero);
  const [meta, setMeta] = useState(DEFAULT_CMS.meta);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetchCmsSection("hero-seo").then((d) => {
      if (d?.hero) setHero(d.hero);
      if (d?.meta) setMeta(d.meta);
    });
  }, []);

  const handleSave = async () => {
    setSaving(true);
    const result = await saveCmsHeroSeo(hero, meta);
    setSaving(false);
    await publishResult(result, "Hero & SEO published", "Homepage hero and page meta are updated.");
  };

  return (
    <div className="space-y-6">
      <CmsModuleHeader
        title="Hero & SEO"
        description="Homepage hero banner copy and page meta title/description."
        onSave={handleSave}
        saving={saving}
      />

      <Card>
        <CardHeader><CardTitle>Homepage hero & meta</CardTitle></CardHeader>
        <CardContent className="grid gap-4 max-w-2xl">
          <div className="space-y-1.5"><Label>Headline</Label><Input value={hero.headline} onChange={(e) => setHero((h) => ({ ...h, headline: e.target.value }))} /></div>
          <div className="space-y-1.5"><Label>Tagline</Label><Input value={hero.tagline} onChange={(e) => setHero((h) => ({ ...h, tagline: e.target.value }))} /></div>
          <div className="space-y-1.5"><Label>Subheadline</Label><Textarea rows={3} value={hero.subheadline} onChange={(e) => setHero((h) => ({ ...h, subheadline: e.target.value }))} /></div>
          <div className="space-y-1.5"><Label>Meta title</Label><Input value={meta.title} onChange={(e) => setMeta((m) => ({ ...m, title: e.target.value }))} /></div>
          <div className="space-y-1.5"><Label>Meta description</Label><Textarea rows={2} value={meta.description} onChange={(e) => setMeta((m) => ({ ...m, description: e.target.value }))} /></div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminHeroSeo;
