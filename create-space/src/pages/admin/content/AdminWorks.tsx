import { useEffect, useState } from "react";
import { ArrowDown, ArrowUp, Plus, Trash2 } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { MediaUploadField } from "@/components/admin/MediaUploadField";
import { CmsModuleHeader } from "@/components/admin/cms/CmsModuleHeader";
import { WorkCard } from "@/components/works/WorkCard";
import { cloudinaryConfigured, fetchCmsSection, saveCmsSection } from "@/lib/cms/cmsApi";
import { DEFAULT_CMS } from "@/lib/cms/defaults";
import { uid } from "@/lib/cms/sections";
import { useCmsAdminSave } from "@/hooks/useCmsAdminSave";
import { WORK_CATEGORIES } from "@/lib/works/constants";
import type { WorkItem } from "@/lib/cms/types";

function moveItem<T>(list: T[], from: number, to: number): T[] {
  if (to < 0 || to >= list.length) return list;
  const next = [...list];
  const [item] = next.splice(from, 1);
  next.splice(to, 0, item);
  return next;
}

const emptyWork = (): WorkItem => ({
  id: uid(),
  title: "New project",
  category: "Enterprise",
  url: "https://",
  tech: [],
  description: "",
  features: [],
  imageUrl: "",
});

const AdminWorks = () => {
  const { publishResult } = useCmsAdminSave();
  const [items, setItems] = useState<WorkItem[]>(DEFAULT_CMS.works);
  const [saving, setSaving] = useState(false);
  const [cloudOk, setCloudOk] = useState<boolean | null>(null);
  const [previewId, setPreviewId] = useState<string | null>(null);

  useEffect(() => {
    fetchCmsSection("works").then((d) => {
      if (d?.items) setItems(d.items as WorkItem[]);
    });
    cloudinaryConfigured().then(setCloudOk);
  }, []);

  const updateItem = (id: string, patch: Partial<WorkItem>) =>
    setItems((list) => list.map((x) => (x.id === id ? { ...x, ...patch } : x)));

  const handleSave = async () => {
    setSaving(true);
    const result = await saveCmsSection("works", items);
    setSaving(false);
    await publishResult(result, "Our Work published", "Projects are live on /works and the homepage.");
  };

  const preview = previewId ? items.find((w) => w.id === previewId) : null;

  return (
    <div className="space-y-6">
      <CmsModuleHeader
        title="Our Work — Featured Projects"
        description="Manage portfolio cards exactly like the /works page. Order matters — first items show on the homepage."
        onSave={handleSave}
        saving={saving}
        cloudOk={cloudOk}
      />

      <Card>
        <CardHeader>
          <CardTitle className="text-base">How it works</CardTitle>
          <CardDescription>
            Each project needs a title, category, live URL, description, tech stack, and key features. Upload a preview
            image via Cloudinary, or leave it empty — the site auto-fetches a live screenshot from the project URL.
          </CardDescription>
        </CardHeader>
        <CardContent className="flex flex-wrap gap-2">
          <Badge variant="secondary">{items.length} projects</Badge>
          <Badge variant="outline">API: GET/PUT /api/cms/sections/works</Badge>
        </CardContent>
      </Card>

      <Button variant="outline" size="sm" onClick={() => setItems((list) => [...list, emptyWork()])}>
        <Plus className="h-4 w-4" /> Add project
      </Button>

      {items.map((work, index) => (
        <Card key={work.id}>
          <CardHeader className="pb-2">
            <div className="flex justify-between items-start gap-3">
              <div>
                <CardTitle className="text-base flex items-center gap-2">
                  <span className="text-muted-foreground font-mono text-xs">#{index + 1}</span>
                  {work.title || "Untitled project"}
                </CardTitle>
                <CardDescription>{work.category} · {work.url || "No URL yet"}</CardDescription>
              </div>
              <div className="flex gap-1 shrink-0">
                <Button variant="ghost" size="sm" disabled={index === 0} onClick={() => setItems((list) => moveItem(list, index, index - 1))}>
                  <ArrowUp className="h-4 w-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  disabled={index === items.length - 1}
                  onClick={() => setItems((list) => moveItem(list, index, index + 1))}
                >
                  <ArrowDown className="h-4 w-4" />
                </Button>
                <Button variant="outline" size="sm" onClick={() => setPreviewId(previewId === work.id ? null : work.id)}>
                  Preview
                </Button>
                <Button variant="ghost" size="sm" onClick={() => setItems((list) => list.filter((x) => x.id !== work.id))}>
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-1.5">
              <Label>Title</Label>
              <Input value={work.title} onChange={(e) => updateItem(work.id, { title: e.target.value })} />
            </div>
            <div className="space-y-1.5">
              <Label>Category</Label>
              <select
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 text-sm"
                value={work.category}
                onChange={(e) => updateItem(work.id, { category: e.target.value })}
              >
                {WORK_CATEGORIES.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
            </div>
            <div className="space-y-1.5 sm:col-span-2">
              <Label>Live URL</Label>
              <Input value={work.url} onChange={(e) => updateItem(work.id, { url: e.target.value })} placeholder="https://example.com" />
            </div>
            <div className="space-y-1.5 sm:col-span-2">
              <Label>Description</Label>
              <Textarea rows={4} value={work.description} onChange={(e) => updateItem(work.id, { description: e.target.value })} />
            </div>
            <div className="space-y-1.5 sm:col-span-2">
              <Label>Tech stack (comma separated)</Label>
              <Input
                value={work.tech.join(", ")}
                onChange={(e) =>
                  updateItem(work.id, { tech: e.target.value.split(",").map((t) => t.trim()).filter(Boolean) })
                }
                placeholder="React.js, Node.js, Next.js, AWS"
              />
            </div>
            <div className="space-y-1.5 sm:col-span-2">
              <Label>Key features (one per line, up to 5 shown on card)</Label>
              <Textarea
                rows={5}
                value={work.features.join("\n")}
                onChange={(e) =>
                  updateItem(work.id, { features: e.target.value.split("\n").map((x) => x.trim()).filter(Boolean) })
                }
              />
            </div>
            <div className="sm:col-span-2">
              <MediaUploadField
                label="Preview image (optional — auto screenshot used if empty)"
                value={work.imageUrl}
                folder="zentroverse/works"
                resourceType="image"
                accept="image/*"
                onChange={(url, publicId) => updateItem(work.id, { imageUrl: url, imagePublicId: publicId })}
              />
            </div>
          </CardContent>
        </Card>
      ))}

      {preview && (
        <div className="space-y-3">
          <h3 className="text-sm font-bold uppercase tracking-wider text-muted-foreground">Live card preview</h3>
          <div className="max-w-xl">
            <WorkCard work={preview} index={items.findIndex((w) => w.id === preview.id)} />
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminWorks;
