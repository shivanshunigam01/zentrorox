import { Link, Navigate, useParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Check } from "lucide-react";
import { findMenuItem, getAutomationTopicCopy } from "@/data/automationNav";
import { findZentrobotFeature } from "@/data/zentrobotFeatures";

const AutomationTopicPage = () => {
  const { category, slug } = useParams<{ category: string; slug: string }>();

  if (!category || category !== "product" || !slug) {
    return <Navigate to="/automation" replace />;
  }

  const item = findMenuItem("product", slug);
  const feature = findZentrobotFeature(slug);
  if (!item || !feature) {
    return <Navigate to="/automation" replace />;
  }

  const { title, paragraphs } = getAutomationTopicCopy("product", slug, item.title);
  const Icon = feature.Icon;

  return (
    <main className="border-b border-border/80 pb-20 pt-24 md:pt-28">
      <div className="container max-w-3xl">
        <p className="font-mono text-xs font-semibold uppercase tracking-widest text-primary">Zentrobot</p>
        <div className="mt-4 flex items-start gap-4">
          <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-xl bg-primary/15 text-primary">
            <Icon className="h-7 w-7" />
          </div>
          <div>
            <h1 className="text-3xl font-extrabold tracking-tight text-foreground md:text-4xl">{title}</h1>
            <p className="mt-2 text-sm text-muted-foreground">{item.subtitle}</p>
          </div>
        </div>

        <div className="automation-panel mt-10 space-y-5 p-6 md:p-8">
          {paragraphs.map((p, i) => (
            <p key={i} className="leading-relaxed text-muted-foreground">
              {p}
            </p>
          ))}
          <ul className="mt-4 space-y-2 border-t border-border/60 pt-4">
            {feature.bullets.map((b) => (
              <li key={b} className="flex gap-2 text-sm text-foreground">
                <Check className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                {b}
              </li>
            ))}
          </ul>
        </div>

        <div className="mt-10 flex flex-wrap gap-3">
          <Button variant="hero" asChild>
            <Link to="/#contact">Get started</Link>
          </Button>
          <Button variant="outline" className="border-border/80" asChild>
            <Link to="/automation#pricing">View pricing</Link>
          </Button>
          <Button variant="ghost" asChild>
            <Link to="/automation">← Zentrobot hub</Link>
          </Button>
        </div>
      </div>
    </main>
  );
};

export default AutomationTopicPage;
