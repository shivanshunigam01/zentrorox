import { ExternalLink, Save } from "lucide-react";
import { Button } from "@/components/ui/button";

type CmsModuleHeaderProps = {
  title: string;
  description: string;
  onSave: () => void;
  saving: boolean;
  cloudOk?: boolean | null;
};

export function CmsModuleHeader({ title, description, onSave, saving, cloudOk }: CmsModuleHeaderProps) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
      <div>
        <h1 className="text-2xl md:text-3xl font-extrabold">{title}</h1>
        <p className="text-sm text-muted-foreground">
          {description}
          {cloudOk === true ? " Cloudinary ✓" : cloudOk === false ? " — add Cloudinary keys to backend .env" : ""}
        </p>
      </div>
      <div className="flex gap-2">
        <Button variant="outline" asChild>
          <a href="/" target="_blank" rel="noreferrer">
            <ExternalLink className="h-4 w-4" /> View site
          </a>
        </Button>
        <Button onClick={onSave} disabled={saving}>
          <Save className="h-4 w-4" /> {saving ? "Saving…" : "Save & publish"}
        </Button>
      </div>
    </div>
  );
}
