import { useEffect, useState } from "react";
import { Plus, Trash2 } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { MediaUploadField } from "@/components/admin/MediaUploadField";
import { CmsModuleHeader } from "@/components/admin/cms/CmsModuleHeader";
import { cloudinaryConfigured, fetchCmsSection, saveCmsSection } from "@/lib/cms/cmsApi";
import { DEFAULT_CMS } from "@/lib/cms/defaults";
import { uid } from "@/lib/cms/sections";
import { useCmsAdminSave } from "@/hooks/useCmsAdminSave";
import type { CaseStudy } from "@/lib/cms/types";

const AdminCaseStudies = () => {
  const { publishResult } = useCmsAdminSave();
  const [items, setItems] = useState<CaseStudy[]>(DEFAULT_CMS.caseStudies);
  const [saving, setSaving] = useState(false);
  const [cloudOk, setCloudOk] = useState<boolean | null>(null);

  useEffect(() => {
    fetchCmsSection("case-studies").then((d) => {
      if (d?.items) setItems(d.items as CaseStudy[]);
    });
    cloudinaryConfigured().then(setCloudOk);
  }, []);

  const updateCase = (id: string, patch: Partial<CaseStudy>) =>
    setItems((list) => list.map((x) => (x.id === id ? { ...x, ...patch } : x)));

  const handleSave = async () => {
    setSaving(true);
    const result = await saveCmsSection("case-studies", items);
    setSaving(false);
    await publishResult(result);
  };

  return (
    <div className="space-y-6">
      <CmsModuleHeader
        title="Case Studies"
        description="Manage case studies shown on the homepage (#portfolio)."
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
            { id: uid(), title: "New case study", problem: "", solution: "", outcome: "", tags: [], imageUrl: "" },
          ])
        }
      >
        <Plus className="h-4 w-4" /> Add case study
      </Button>

      {items.map((cs) => (
        <Card key={cs.id}>
          <CardHeader className="pb-2">
            <div className="flex justify-between items-start">
              <CardTitle className="text-base">{cs.title || "Untitled case study"}</CardTitle>
              <Button variant="ghost" size="sm" onClick={() => setItems((list) => list.filter((x) => x.id !== cs.id))}>
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          </CardHeader>
          <CardContent className="grid gap-4">
            <Input placeholder="Title" value={cs.title} onChange={(e) => updateCase(cs.id, { title: e.target.value })} />
            <Textarea placeholder="Problem" value={cs.problem} onChange={(e) => updateCase(cs.id, { problem: e.target.value })} />
            <Textarea placeholder="Solution" value={cs.solution} onChange={(e) => updateCase(cs.id, { solution: e.target.value })} />
            <Textarea placeholder="Outcome" value={cs.outcome} onChange={(e) => updateCase(cs.id, { outcome: e.target.value })} />
            <Input
              placeholder="Tags (comma separated)"
              value={cs.tags.join(", ")}
              onChange={(e) => updateCase(cs.id, { tags: e.target.value.split(",").map((t) => t.trim()).filter(Boolean) })}
            />
            <MediaUploadField
              label="Cover image"
              value={cs.imageUrl}
              folder="zentroverse/case-studies"
              resourceType="image"
              accept="image/*"
              onChange={(url, publicId) => updateCase(cs.id, { imageUrl: url, imagePublicId: publicId })}
            />
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default AdminCaseStudies;
