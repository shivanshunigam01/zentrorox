import { ExternalLink } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ProjectPreview } from "@/components/works/ProjectPreview";
import type { WorkItem } from "@/lib/cms/types";
import { WORK_CATEGORY_STYLES, WORK_GRADIENT_PALETTE } from "@/lib/works/constants";

type WorkCardProps = {
  work: WorkItem;
  index?: number;
  compact?: boolean;
};

function PreviewBadges({ category }: { category: string }) {
  const categoryClass = WORK_CATEGORY_STYLES[category] ?? "bg-white/90 text-slate-800";
  return (
    <>
      <div className="absolute top-4 left-4 z-10 pointer-events-none">
        <Badge className={`${categoryClass} border-0 font-semibold shadow-sm`}>{category}</Badge>
      </div>
      <div className="absolute top-4 right-4 z-10 pointer-events-none">
        <Badge className="bg-green-500 hover:bg-green-500 text-white border-0 font-semibold shadow-sm gap-1.5">
          <span className="h-2 w-2 rounded-full bg-white animate-pulse" />
          Live
        </Badge>
      </div>
    </>
  );
}

export function WorkCard({ work, index = 0, compact = false }: WorkCardProps) {
  const gradient = WORK_GRADIENT_PALETTE[index % WORK_GRADIENT_PALETTE.length];
  const hasImage = Boolean(work.imageUrl?.trim());

  return (
    <Card className="group overflow-hidden rounded-2xl border border-border/60 bg-card shadow-md hover:shadow-2xl hover:-translate-y-1 transition-all duration-300 flex flex-col h-full">
      {hasImage ? (
        <a
          href={work.url}
          target="_blank"
          rel="noopener noreferrer"
          className={`relative block aspect-[16/10] min-h-[200px] overflow-hidden rounded-t-2xl bg-gradient-to-br ${gradient}`}
        >
          <img
            src={work.imageUrl}
            alt={`${work.title} preview`}
            loading="lazy"
            decoding="async"
            className="absolute inset-0 h-full w-full object-cover object-top transition-transform duration-700 group-hover:scale-[1.02]"
            onError={(e) => {
              (e.currentTarget as HTMLImageElement).style.display = "none";
            }}
          />
          <div className="pointer-events-none absolute inset-0 rounded-t-2xl ring-1 ring-inset ring-black/5 dark:ring-white/10" />
          <PreviewBadges category={work.category} />
        </a>
      ) : (
        <div className="relative rounded-t-2xl overflow-hidden">
          <ProjectPreview url={work.url} title={work.title} gradient={gradient} />
          <PreviewBadges category={work.category} />
        </div>
      )}

      <div className="p-6 flex flex-col flex-1">
        <h3 className="text-xl font-bold mb-3 group-hover:text-primary transition-colors">{work.title}</h3>
        <p className={`text-sm text-muted-foreground leading-relaxed ${compact ? "mb-4 line-clamp-3" : "mb-5"}`}>
          {work.description}
        </p>

        {!compact && work.features.length > 0 && (
          <div className="mb-5">
            <h4 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-2">Key Features</h4>
            <ul className="space-y-1.5">
              {work.features.slice(0, 4).map((f) => (
                <li key={f} className="text-sm text-foreground/80 flex items-start gap-2">
                  <span className="mt-1.5 h-1.5 w-1.5 rounded-full bg-primary shrink-0" />
                  <span>{f}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        <div className="flex flex-wrap gap-2 mb-6">
          {(compact ? work.tech.slice(0, 5) : work.tech).map((t) => (
            <span
              key={t}
              className="px-2.5 py-1 text-xs font-medium rounded-full bg-muted text-foreground/80 border border-border/50"
            >
              {t}
            </span>
          ))}
        </div>

        <div className="mt-auto">
          <Button
            asChild
            className="w-full bg-gradient-to-r from-primary to-brand-blue hover:opacity-90 text-white border-0 shadow-md hover:shadow-lg transition-all"
          >
            <a href={work.url} target="_blank" rel="noopener noreferrer">
              Live Demo
              <ExternalLink className="ml-2 h-4 w-4" />
            </a>
          </Button>
        </div>
      </div>
    </Card>
  );
}
