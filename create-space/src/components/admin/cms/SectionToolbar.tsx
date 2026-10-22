import { Save } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

type SectionToolbarProps = {
  title: string;
  description: string;
  count: number;
  onSave: () => void;
  saving: boolean;
};

export function SectionToolbar({ title, description, count, onSave, saving }: SectionToolbarProps) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-2">
      <div>
        <h2 className="text-lg font-bold flex items-center gap-2">
          {title}
          <Badge variant="secondary">{count}</Badge>
        </h2>
        <p className="text-sm text-muted-foreground">{description}</p>
      </div>
      <Button size="sm" onClick={onSave} disabled={saving}>
        <Save className="h-4 w-4" /> {saving ? "Saving…" : "Save & publish"}
      </Button>
    </div>
  );
}
