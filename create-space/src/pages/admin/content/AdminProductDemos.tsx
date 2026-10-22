import { useEffect, useState } from "react";
import { Plus, Trash2 } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { MediaUploadField } from "@/components/admin/MediaUploadField";
import { CmsModuleHeader } from "@/components/admin/cms/CmsModuleHeader";
import { cloudinaryConfigured, fetchCmsSection, saveCmsSection } from "@/lib/cms/cmsApi";
import { DEFAULT_CMS } from "@/lib/cms/defaults";
import { uid } from "@/lib/cms/sections";
import { useCmsAdminSave } from "@/hooks/useCmsAdminSave";
import type { ProductDemo } from "@/lib/cms/types";

const AdminProductDemos = () => {
  const { publishResult } = useCmsAdminSave();
  const [items, setItems] = useState<ProductDemo[]>(DEFAULT_CMS.productDemos);
  const [saving, setSaving] = useState(false);
  const [cloudOk, setCloudOk] = useState<boolean | null>(null);

  useEffect(() => {
    fetchCmsSection("product-demos").then((d) => {
      if (d?.items) setItems(d.items as ProductDemo[]);
    });
    cloudinaryConfigured().then(setCloudOk);
  }, []);

  const updateItem = (id: string, patch: Partial<ProductDemo>) =>
    setItems((list) => list.map((x) => (x.id === id ? { ...x, ...patch } : x)));

  const handleSave = async () => {
    setSaving(true);
    const result = await saveCmsSection("product-demos", items);
    setSaving(false);
    await publishResult(result);
  };

  return (
    <div className="space-y-6">
      <CmsModuleHeader
        title="Product Demos"
        description="Product walkthrough videos or screenshots — homepage Product Demos (#demos)."
        onSave={handleSave}
        saving={saving}
        cloudOk={cloudOk}
      />

      <Button
        variant="outline"
        size="sm"
        onClick={() =>
          setItems((list) => [
            ...list,
            { id: uid(), title: "New demo", product: "", mediaType: "video", url: "", caption: "" },
          ])
        }
      >
        <Plus className="h-4 w-4" /> Add product demo
      </Button>

      {items.map((d) => (
        <Card key={d.id}>
          <CardContent className="pt-6 grid gap-4 sm:grid-cols-2">
            <div className="sm:col-span-2 flex justify-between">
              <span className="font-bold text-sm">{d.title || "Product demo"}</span>
              <Button variant="ghost" size="sm" onClick={() => setItems((list) => list.filter((x) => x.id !== d.id))}>
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
            <Input placeholder="Title" value={d.title} onChange={(e) => updateItem(d.id, { title: e.target.value })} />
            <Input placeholder="Product (e.g. ZentroBOT)" value={d.product ?? ""} onChange={(e) => updateItem(d.id, { product: e.target.value })} />
            <div className="space-y-1.5">
              <Label>Media type</Label>
              <select
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 text-sm"
                value={d.mediaType}
                onChange={(e) => updateItem(d.id, { mediaType: e.target.value as "image" | "video" })}
              >
                <option value="video">Video</option>
                <option value="image">Screenshot / image</option>
              </select>
            </div>
            <div className="sm:col-span-2">
              <MediaUploadField
                label="Demo media"
                value={d.url}
                folder="zentroverse/demos"
                resourceType={d.mediaType === "video" ? "video" : "image"}
                accept="video/*,image/*"
                onChange={(url, publicId, rt) =>
                  updateItem(d.id, { url, publicId, mediaType: rt === "video" ? "video" : d.mediaType })
                }
              />
            </div>
            <Input className="sm:col-span-2" placeholder="Caption" value={d.caption ?? ""} onChange={(e) => updateItem(d.id, { caption: e.target.value })} />
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default AdminProductDemos;
