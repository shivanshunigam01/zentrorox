import { useEffect, useState } from "react";
import { Plus, Trash2 } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { MediaUploadField } from "@/components/admin/MediaUploadField";
import { CmsModuleHeader } from "@/components/admin/cms/CmsModuleHeader";
import { cloudinaryConfigured, fetchCmsSection, saveCmsSection } from "@/lib/cms/cmsApi";
import { DEFAULT_CMS } from "@/lib/cms/defaults";
import { uid } from "@/lib/cms/sections";
import { useCmsAdminSave } from "@/hooks/useCmsAdminSave";
import type { GalleryItem } from "@/lib/cms/types";

const AdminGallery = () => {
  const { publishResult } = useCmsAdminSave();
  const [items, setItems] = useState<GalleryItem[]>(DEFAULT_CMS.gallery);
  const [categories, setCategories] = useState<string[]>(DEFAULT_CMS.galleryCategories);
  const [saving, setSaving] = useState(false);
  const [cloudOk, setCloudOk] = useState<boolean | null>(null);

  useEffect(() => {
    fetchCmsSection("gallery").then((d) => {
      if (d?.items) setItems(d.items as GalleryItem[]);
      if (d?.categories) setCategories(d.categories);
    });
    cloudinaryConfigured().then(setCloudOk);
  }, []);

  const updateItem = (id: string, patch: Partial<GalleryItem>) =>
    setItems((list) => list.map((x) => (x.id === id ? { ...x, ...patch } : x)));

  const handleSave = async () => {
    setSaving(true);
    const result = await saveCmsSection("gallery", items, categories);
    setSaving(false);
    await publishResult(result);
  };

  return (
    <div className="space-y-6">
      <CmsModuleHeader
        title="Gallery"
        description="Photos and videos by category — homepage Gallery section (#gallery)."
        onSave={handleSave}
        saving={saving}
        cloudOk={cloudOk}
      />

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Categories</CardTitle>
          <CardDescription>One category per line — used as filter tabs on the site.</CardDescription>
        </CardHeader>
        <CardContent>
          <Textarea
            rows={4}
            className="font-mono text-xs"
            value={categories.join("\n")}
            onChange={(e) => setCategories(e.target.value.split("\n").map((x) => x.trim()).filter(Boolean))}
          />
        </CardContent>
      </Card>

      <Button
        variant="outline"
        size="sm"
        onClick={() =>
          setItems((list) => [
            ...list,
            { id: uid(), category: categories[0] ?? "General", mediaType: "image", url: "", caption: "" },
          ])
        }
      >
        <Plus className="h-4 w-4" /> Add gallery item
      </Button>

      {items.map((g) => (
        <Card key={g.id}>
          <CardContent className="pt-6 grid gap-4 sm:grid-cols-2">
            <div className="sm:col-span-2 flex justify-between">
              <span className="font-bold text-sm">{g.caption || g.category || "Gallery item"}</span>
              <Button variant="ghost" size="sm" onClick={() => setItems((list) => list.filter((x) => x.id !== g.id))}>
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
            <div className="space-y-1.5">
              <Label>Category</Label>
              <Input list="gallery-cats" value={g.category} onChange={(e) => updateItem(g.id, { category: e.target.value })} />
              <datalist id="gallery-cats">{categories.map((c) => <option key={c} value={c} />)}</datalist>
            </div>
            <div className="space-y-1.5">
              <Label>Type</Label>
              <select
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 text-sm"
                value={g.mediaType}
                onChange={(e) => updateItem(g.id, { mediaType: e.target.value as "image" | "video" })}
              >
                <option value="image">Image</option>
                <option value="video">Video</option>
              </select>
            </div>
            <div className="sm:col-span-2">
              <MediaUploadField
                label="Photo or video"
                value={g.url}
                folder="zentroverse/gallery"
                resourceType={g.mediaType === "video" ? "video" : "image"}
                accept={g.mediaType === "video" ? "video/*,image/*" : "image/*,video/*"}
                onChange={(url, publicId, rt) =>
                  updateItem(g.id, { url, publicId, mediaType: rt === "video" ? "video" : g.mediaType })
                }
              />
            </div>
            <Input className="sm:col-span-2" placeholder="Caption" value={g.caption ?? ""} onChange={(e) => updateItem(g.id, { caption: e.target.value })} />
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default AdminGallery;
