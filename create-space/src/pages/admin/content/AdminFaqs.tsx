import { useEffect, useState } from "react";
import { Plus, Trash2 } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { CmsModuleHeader } from "@/components/admin/cms/CmsModuleHeader";
import { fetchCmsSection, saveCmsSection } from "@/lib/cms/cmsApi";
import { DEFAULT_CMS } from "@/lib/cms/defaults";
import { useCmsAdminSave } from "@/hooks/useCmsAdminSave";
import type { FaqItem } from "@/lib/cms/types";

const AdminFaqs = () => {
  const { publishResult } = useCmsAdminSave();
  const [items, setItems] = useState<FaqItem[]>(DEFAULT_CMS.faqs);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetchCmsSection("faqs").then((d) => {
      if (d?.items) setItems(d.items as FaqItem[]);
    });
  }, []);

  const handleSave = async () => {
    setSaving(true);
    const result = await saveCmsSection("faqs", items);
    setSaving(false);
    await publishResult(result);
  };

  return (
    <div className="space-y-6">
      <CmsModuleHeader
        title="FAQs"
        description="Frequently asked questions — homepage FAQ section (#faq)."
        onSave={handleSave}
        saving={saving}
      />

      <Button variant="outline" size="sm" onClick={() => setItems((list) => [...list, { question: "", answer: "" }])}>
        <Plus className="h-4 w-4" /> Add FAQ
      </Button>

      {items.map((f, i) => (
        <Card key={i}>
          <CardContent className="pt-6 grid gap-4">
            <div className="flex justify-end">
              <Button variant="ghost" size="sm" onClick={() => setItems((list) => list.filter((_, j) => j !== i))}>
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
            <Input
              placeholder="Question"
              value={f.question}
              onChange={(e) => {
                const next = [...items];
                next[i] = { ...f, question: e.target.value };
                setItems(next);
              }}
            />
            <Textarea
              placeholder="Answer"
              value={f.answer}
              onChange={(e) => {
                const next = [...items];
                next[i] = { ...f, answer: e.target.value };
                setItems(next);
              }}
            />
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default AdminFaqs;
