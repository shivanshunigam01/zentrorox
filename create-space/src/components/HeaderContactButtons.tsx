import { Link } from "react-router-dom";
import { ClipboardCheck, MessageCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useSiteContact } from "@/hooks/useSiteContact";
import { whatsAppHref } from "@/lib/siteContact";
import { trackEvent } from "@/lib/analytics";
import { PRIMARY_CTA } from "@/data/navConfig";
import { cn } from "@/lib/utils";

type Props = {
  className?: string;
  size?: "sm" | "default";
  stack?: boolean;
};

export const HeaderContactButtons = ({ className, size = "sm", stack = false }: Props) => {
  const contact = useSiteContact();

  return (
    <div className={cn("flex gap-2", stack ? "flex-col w-full" : "flex-row items-center", className)}>
      <Button
        variant="outline"
        size={stack ? size : "icon"}
        className={cn(
          "border-primary/30 text-primary bg-background/60 hover:bg-primary/10 hover:border-primary/50 transition-all duration-300",
          stack && "w-full justify-center h-10 px-5",
        )}
        asChild
      >
        <a
          href={whatsAppHref(contact)}
          target="_blank"
          rel="noopener noreferrer"
          aria-label="WhatsApp"
          onClick={() => trackEvent("WhatsApp Click", { source: "header" })}
        >
          <MessageCircle className="h-4 w-4" />
          {stack && "WhatsApp"}
        </a>
      </Button>
      <Button
        variant="hero"
        size={size}
        className={cn(
          "shadow-brand hover:shadow-elegant px-3 xl:px-5 font-semibold tracking-tight",
          stack && "w-full justify-center",
        )}
        asChild
      >
        <Link
          to={PRIMARY_CTA.href}
          onClick={() => trackEvent("Audit Requested", { source: "header" })}
        >
          <ClipboardCheck className="h-4 w-4" />
          <span className={cn(!stack && "hidden xl:inline")}>{PRIMARY_CTA.label}</span>
          {!stack && <span className="xl:hidden">Free Audit</span>}
        </Link>
      </Button>
    </div>
  );
};
