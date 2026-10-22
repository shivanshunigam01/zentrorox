import { useEffect, useRef, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown, Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import logo from "@/assets/zentroverse-logo.jpg";
import {
  MAIN_NAV,
  DROPDOWN_MENUS,
  resolveNavHref,
  isRouterLink,
  isNavActive,
  type NavDropdown,
  type NavLinkItem,
} from "@/data/navConfig";
import { HeaderContactButtons } from "@/components/HeaderContactButtons";
import { cn } from "@/lib/utils";

const COL_CLASS = {
  1: "grid-cols-1",
  3: "grid-cols-1 sm:grid-cols-3",
  4: "grid-cols-1 sm:grid-cols-2 lg:grid-cols-4",
} as const;

function NavAnchor({
  href,
  className,
  onClick,
  children,
}: {
  href: string;
  className?: string;
  onClick?: () => void;
  children: React.ReactNode;
}) {
  const { pathname } = useLocation();
  const resolved = resolveNavHref(href, pathname);

  if (isRouterLink(href)) {
    return (
      <Link to={resolved} className={className} onClick={onClick}>
        {children}
      </Link>
    );
  }

  return (
    <a href={href} className={className} onClick={onClick}>
      {children}
    </a>
  );
}

function DropdownLink({ item, onClick }: { item: NavLinkItem; onClick?: () => void }) {
  return (
    <NavAnchor
      href={item.href}
      onClick={onClick}
      className="group block rounded-xl px-3 py-2 transition-all duration-200 hover:bg-primary/5 hover:translate-x-0.5"
    >
      <div className="text-sm font-semibold text-foreground group-hover:text-primary transition-colors">
        {item.label}
      </div>
      {item.desc && (
        <div className="text-xs text-muted-foreground mt-0.5 leading-snug">{item.desc}</div>
      )}
    </NavAnchor>
  );
}

export const Navbar = () => {
  const location = useLocation();
  const onAutomation = location.pathname.startsWith("/automation");
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const [dropdown, setDropdown] = useState<NavDropdown | null>(null);
  const [mobileExpand, setMobileExpand] = useState<string | null>(null);
  const closeTimer = useRef<number | null>(null);

  const openDropdown = (kind: NavDropdown) => {
    if (closeTimer.current) window.clearTimeout(closeTimer.current);
    setDropdown(kind);
  };

  const scheduleClose = () => {
    if (closeTimer.current) window.clearTimeout(closeTimer.current);
    closeTimer.current = window.setTimeout(() => setDropdown(null), 140);
  };

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    setOpen(false);
    setDropdown(null);
    setMobileExpand(null);
  }, [location.pathname, location.hash]);

  useEffect(() => {
    return () => {
      if (closeTimer.current) window.clearTimeout(closeTimer.current);
    };
  }, []);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key !== "Escape") return;
      setOpen(false);
      setDropdown(null);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, [open]);

  const frosted = scrolled || open;

  const renderDropdown = (kind: NavDropdown) => {
    const menu = DROPDOWN_MENUS[kind];

    return (
      <div
        className="absolute inset-x-0 top-full z-50 hidden lg:block"
        onMouseEnter={() => openDropdown(kind)}
        onMouseLeave={scheduleClose}
      >
        <div className="flex justify-center px-4 pt-2">
          <motion.div
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 6 }}
            transition={{ duration: 0.16, ease: "easeOut" }}
            className={cn(
              "rounded-2xl border border-border/80 bg-background/90 backdrop-blur-2xl shadow-elegant p-3 max-h-[70vh] overflow-y-auto pointer-events-auto",
              menu.width,
            )}
          >
            <div className={cn("grid gap-3", COL_CLASS[menu.columns])}>
              {menu.groups.map((group) => (
                <div key={group.heading} className="min-w-0">
                  <div className="px-3 pb-1.5 text-[11px] font-bold uppercase tracking-wider text-muted-foreground">
                    {group.heading}
                  </div>
                  <div className="space-y-0.5">
                    {group.items.map((item) => (
                      <DropdownLink key={`${item.href}-${item.label}`} item={item} />
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    );
  };

  return (
    <motion.header
      initial={{ y: -16, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      className={cn(
        "fixed top-0 left-0 right-0 z-50 transition-all duration-300",
        frosted
          ? "bg-background/72 backdrop-blur-2xl border-b border-border/60 shadow-soft supports-[backdrop-filter]:bg-background/58"
          : "bg-transparent border-b border-transparent",
      )}
    >
      <nav className="relative">
        <div className="container grid grid-cols-[auto_1fr_auto] h-[4.25rem] md:h-[4.75rem] items-center gap-3 md:gap-5">
        <Link
          to="/"
          className="flex items-center gap-2.5 shrink-0 group rounded-xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/60"
        >
          <span className="relative">
            <img
              src={logo}
              alt="Zentroverse logo"
              className="h-9 w-9 md:h-10 md:w-10 rounded-xl object-cover ring-1 ring-border/70 shadow-soft transition-transform duration-300 group-hover:scale-[1.04]"
            />
          </span>
          <span className="brand-wordmark text-[0.62rem] sm:text-[0.7rem] tracking-[0.16em] text-foreground hidden sm:inline">
            Zentroverse
          </span>
        </Link>

        <div className="hidden lg:flex items-center justify-center gap-0.5 min-w-0">
          {MAIN_NAV.map((item) => {
            const active = isNavActive(item.href, location.pathname, location.hash);
            const linkClass = cn(
              "relative inline-flex items-center gap-1 rounded-lg px-2.5 py-1.5 text-[13px] font-medium tracking-tight transition-all duration-200",
              active
                ? "text-foreground bg-primary/8"
                : "text-muted-foreground hover:text-foreground hover:bg-muted/70",
            );

            if (item.dropdown) {
              const kind = item.dropdown;
              return (
                <div
                  key={item.label}
                  className="relative"
                  onMouseEnter={() => openDropdown(kind)}
                  onMouseLeave={scheduleClose}
                >
                  <NavAnchor href={item.href} className={linkClass}>
                    {item.label}
                    <ChevronDown
                      className={cn(
                        "h-3.5 w-3.5 opacity-70 transition-transform duration-200",
                        dropdown === kind && "rotate-180 opacity-100",
                      )}
                    />
                    {active && (
                      <span className="absolute inset-x-2.5 -bottom-px h-px bg-gradient-to-r from-transparent via-primary/70 to-transparent" />
                    )}
                  </NavAnchor>
                </div>
              );
            }

            return (
              <NavAnchor key={item.label} href={item.href} className={linkClass}>
                {item.label}
                {active && (
                  <span className="absolute inset-x-2.5 -bottom-px h-px bg-gradient-to-r from-transparent via-primary/70 to-transparent" />
                )}
              </NavAnchor>
            );
          })}
        </div>

        <div className="flex items-center justify-end gap-2 shrink-0">
          {!onAutomation && (
            <div className="hidden lg:flex">
              <HeaderContactButtons />
            </div>
          )}
          {onAutomation && (
            <div className="hidden lg:flex">
              <Button variant="outline" size="sm" asChild>
                <Link to="/">Back to home</Link>
              </Button>
            </div>
          )}

          <button
            type="button"
            className="lg:hidden inline-flex h-10 w-10 items-center justify-center rounded-xl border border-border/70 bg-background/50 text-foreground transition-all duration-200 hover:border-primary/30 hover:bg-primary/8"
            onClick={() => setOpen((v) => !v)}
            aria-label={open ? "Close menu" : "Open menu"}
            aria-expanded={open}
            aria-controls="mobile-nav"
          >
            {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
        </div>

        <AnimatePresence>
          {dropdown && renderDropdown(dropdown)}
        </AnimatePresence>
      </nav>

      <AnimatePresence>
        {open && (
          <motion.div
            id="mobile-nav"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.22, ease: "easeOut" }}
            className="lg:hidden overflow-hidden border-t border-border/60 bg-background/92 backdrop-blur-2xl"
          >
            <div className="container py-4 pb-6 flex flex-col gap-0.5 max-h-[min(85vh,calc(100dvh-4.75rem))] overflow-y-auto">
              {MAIN_NAV.map((item) => {
                const active = isNavActive(item.href, location.pathname, location.hash);

                if (item.dropdown) {
                  const kind = item.dropdown;
                  const expanded = mobileExpand === kind;
                  const groups = DROPDOWN_MENUS[kind].groups;
                  return (
                    <div key={item.label} className="rounded-xl">
                      <div className="flex items-center">
                        <NavAnchor
                          href={item.href}
                          onClick={() => setOpen(false)}
                          className={cn(
                            "py-2.5 px-3 text-sm font-medium flex-1 rounded-lg transition-colors",
                            active ? "text-primary" : "text-foreground hover:bg-muted/60",
                          )}
                        >
                          {item.label}
                        </NavAnchor>
                        <button
                          type="button"
                          className="p-2.5 mr-0.5 rounded-lg hover:bg-muted/70 transition-colors"
                          aria-label={`${expanded ? "Collapse" : "Expand"} ${item.label}`}
                          aria-expanded={expanded}
                          onClick={() => setMobileExpand(expanded ? null : kind)}
                        >
                          <ChevronDown
                            className={cn("h-4 w-4 transition-transform duration-200", expanded && "rotate-180")}
                          />
                        </button>
                      </div>
                      <AnimatePresence>
                        {expanded && (
                          <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: "auto", opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            className="overflow-hidden"
                          >
                            <div className="ml-3 mb-2 pl-3 border-l border-primary/20 space-y-2">
                              {groups.map((group) => (
                                <div key={group.heading}>
                                  {groups.length > 1 && (
                                    <div className="px-2 pt-1.5 pb-1 text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
                                      {group.heading}
                                    </div>
                                  )}
                                  <div className="space-y-0.5">
                                    {group.items.map((sub) => (
                                      <NavAnchor
                                        key={`${sub.href}-${sub.label}`}
                                        href={sub.href}
                                        onClick={() => setOpen(false)}
                                        className="block rounded-lg px-2 py-2 text-sm text-muted-foreground hover:text-foreground hover:bg-muted/60 transition-colors"
                                      >
                                        {sub.label}
                                      </NavAnchor>
                                    ))}
                                  </div>
                                </div>
                              ))}
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  );
                }

                return (
                  <NavAnchor
                    key={item.label}
                    href={item.href}
                    onClick={() => setOpen(false)}
                    className={cn(
                      "py-2.5 px-3 text-sm font-medium rounded-lg transition-colors",
                      active ? "text-primary bg-primary/8" : "text-foreground hover:bg-muted/60",
                    )}
                  >
                    {item.label}
                  </NavAnchor>
                );
              })}
              {!onAutomation && (
                <div className="pt-4 mt-2 border-t border-border/70">
                  <HeaderContactButtons stack size="default" />
                </div>
              )}
              {onAutomation && (
                <div className="pt-4 mt-2 border-t border-border/70 lg:hidden">
                  <Button variant="outline" className="w-full" asChild>
                    <Link to="/" onClick={() => setOpen(false)}>
                      Back to home
                    </Link>
                  </Button>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.header>
  );
};
