import { useEffect, useRef, useState } from "react";
import { ImagePlus, Loader2, Upload, Video } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { fileToDataUrl, uploadMedia } from "@/lib/cms/cmsApi";

type Props = {
  label?: string;
  value?: string;
  folder?: string;
  resourceType?: "auto" | "image" | "video";
  accept?: string;
  onChange: (url: string, publicId?: string, uploadedResourceType?: string) => void;
  previewClassName?: string;
};

export const MediaUploadField = ({
  label = "Media",
  value = "",
  folder = "zentroverse",
  resourceType = "auto",
  accept = "image/*,video/*",
  onChange,
  previewClassName = "h-32 w-full object-cover rounded-lg border",
}: Props) => {
  const inputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [manualUrl, setManualUrl] = useState(value);
  const [error, setError] = useState("");

  useEffect(() => {
    setManualUrl(value);
  }, [value]);

  const handleFile = async (file: File) => {
    setUploading(true);
    setError("");
    try {
      const dataUrl = await fileToDataUrl(file);
      const rt = file.type.startsWith("video/") ? "video" : file.type.startsWith("image/") ? "image" : resourceType;
      const result = await uploadMedia(dataUrl, folder, rt === "video" ? "video" : rt === "image" ? "image" : "auto");
      onChange(result.url, result.publicId, result.resourceType);
      setManualUrl(result.url);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Upload failed");
    } finally {
      setUploading(false);
    }
  };

  const isVideo =
    value.includes("/video/upload/") || value.endsWith(".mp4") || value.endsWith(".webm") || value.endsWith(".mov");

  return (
    <div className="space-y-2">
      <Label>{label}</Label>
      {value ? (
        isVideo ? (
          <video src={value} controls className={previewClassName} />
        ) : (
          <img src={value} alt="" className={previewClassName} />
        )
      ) : (
        <div className="h-32 rounded-lg border border-dashed flex flex-col items-center justify-center text-muted-foreground text-xs gap-1">
          {resourceType === "video" ? <Video className="h-6 w-6" /> : <ImagePlus className="h-6 w-6" />}
          Click Upload to add image or video
        </div>
      )}
      <div className="flex flex-wrap gap-2">
        <input
          ref={inputRef}
          type="file"
          accept={accept}
          className="hidden"
          onChange={(e) => {
            const f = e.target.files?.[0];
            if (f) handleFile(f);
            e.target.value = "";
          }}
        />
        <Button type="button" variant="outline" size="sm" disabled={uploading} onClick={() => inputRef.current?.click()}>
          {uploading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Upload className="h-4 w-4" />}
          {uploading ? "Uploading…" : "Upload file"}
        </Button>
        {value && (
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={() => {
              onChange("");
              setManualUrl("");
            }}
          >
            Remove
          </Button>
        )}
      </div>
      <div className="flex gap-2">
        <Input
          placeholder="Or paste image/video URL"
          value={manualUrl}
          onChange={(e) => setManualUrl(e.target.value)}
          className="text-xs"
        />
        <Button
          type="button"
          variant="secondary"
          size="sm"
          onClick={() => {
            const url = manualUrl.trim();
            if (url) onChange(url);
          }}
        >
          Use URL
        </Button>
      </div>
      {error && <p className="text-xs text-destructive">{error}</p>}
      <p className="text-[10px] text-muted-foreground">Uploads go to Cloudinary via the backend API (Admin → Content CMS).</p>
    </div>
  );
};
