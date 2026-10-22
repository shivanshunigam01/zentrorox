import { useEffect, useState } from "react";
import { Plus, Trash2 } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
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
import type { Testimonial } from "@/lib/cms/types";

const AdminReviews = () => {
  const { publishResult } = useCmsAdminSave();
  const [items, setItems] = useState<Testimonial[]>(DEFAULT_CMS.testimonials);
  const [saving, setSaving] = useState(false);
  const [cloudOk, setCloudOk] = useState<boolean | null>(null);

  useEffect(() => {
    fetchCmsSection("testimonials").then((d) => {
      if (d?.items) setItems(d.items as Testimonial[]);
    });
    cloudinaryConfigured().then(setCloudOk);
  }, []);

  const updateItem = (id: string, patch: Partial<Testimonial>) =>
    setItems((list) => list.map((x) => (x.id === id ? { ...x, ...patch } : x)));

  const handleSave = async () => {
    setSaving(true);
    const result = await saveCmsSection("testimonials", items);
    setSaving(false);
    await publishResult(result);
  };

  return (
    <div className="space-y-6">
      <CmsModuleHeader
        title="Reviews & Testimonials"
        description="Customer success stories with optional video or photo."
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
            {
              id: uid(),
              quote: "",
              name: "",
              company: "",
              designation: "",
              rating: 5,
              mediaType: "image",
              videoUrl: "",
              thumbnailUrl: "",
            },
          ])
        }
      >
        <Plus className="h-4 w-4" /> Add review
      </Button>

      {items.map((t) => (
        <Card key={t.id}>
          <CardContent className="pt-6 grid gap-4 sm:grid-cols-2">
            <div className="sm:col-span-2 flex justify-between">
              <span className="font-bold text-sm">{t.name || "New review"}</span>
              <Button variant="ghost" size="sm" onClick={() => setItems((list) => list.filter((x) => x.id !== t.id))}>
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
            <Textarea className="sm:col-span-2" placeholder="Quote" value={t.quote} onChange={(e) => updateItem(t.id, { quote: e.target.value })} />
            <Input placeholder="Name" value={t.name} onChange={(e) => updateItem(t.id, { name: e.target.value })} />
            <Input placeholder="Designation" value={t.designation} onChange={(e) => updateItem(t.id, { designation: e.target.value })} />
            <Input placeholder="Company" value={t.company} onChange={(e) => updateItem(t.id, { company: e.target.value })} />
            <Input type="number" min={1} max={5} placeholder="Rating" value={t.rating} onChange={(e) => updateItem(t.id, { rating: Number(e.target.value) })} />
            <div className="space-y-1.5">
              <Label>Media type</Label>
              <select
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 text-sm"
                value={t.mediaType}
                onChange={(e) => updateItem(t.id, { mediaType: e.target.value as "image" | "video" })}
              >
                <option value="image">Photo</option>
                <option value="video">Video</option>
              </select>
            </div>
            <div className="sm:col-span-2">
              <MediaUploadField
                label={t.mediaType === "video" ? "Review video" : "Review photo"}
                value={t.videoUrl || t.thumbnailUrl}
                folder="zentroverse/testimonials"
                resourceType={t.mediaType === "video" ? "video" : "image"}
                accept={t.mediaType === "video" ? "video/*" : "image/*"}
                onChange={(url, _publicId, rt) =>
                  updateItem(t.id, {
                    mediaType: rt === "video" || t.mediaType === "video" ? "video" : "image",
                    videoUrl: rt === "video" ? url : t.mediaType === "video" ? url : "",
                    thumbnailUrl: url,
                  })
                }
              />
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default AdminReviews;
