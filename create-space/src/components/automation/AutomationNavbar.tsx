import { Link, useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
import { ChevronDown, Menu } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { ScrollArea } from "@/components/ui/scroll-area";
import logo from "@/assets/zentroverse-logo.jpg";
import { automationProductMenu } from "@/data/automationNav";

const iconWrap =
  "flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary/15 text-primary";

export const AutomationNavbar = () => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const featureLinks = (
    <>
      <Link
        to="/automation#features"
        className="rounded-md px-3 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-muted/60 hover:text-foreground"
        onClick={() => setMobileOpen(false)}
      >
        Features
      </Link>
      {automationProductMenu.map((item) => {
        const Icon = item.Icon;
        return (
          <Link
            key={item.slug}
            to={`/automation/product/${item.slug}`}
            className="flex gap-3 rounded-lg px-2 py-2 hover:bg-muted/70"
            onClick={() => setMobileOpen(false)}
          >
            <div className={iconWrap}>
              <Icon className="h-5 w-5" />
            </div>
            <div>
              <div className="text-sm font-bold text-foreground">{item.title}</div>
              <div className="text-xs text-muted-foreground">{item.subtitle}</div>
            </div>
          </Link>
        );
      })}
    </>
  );

  return (
    <header
      className={`fixed left-0 right-0 top-0 z-[100] transition-all duration-300 ${
        scrolled
          ? "border-b border-border/50 bg-background/80 shadow-soft backdrop-blur-xl"
          : "border-b border-transparent bg-transparent"
      }`}
    >
      <div className="container flex h-14 items-center justify-between gap-4 md:h-16">
        <Link to="/automation" className="flex min-w-0 items-center gap-2">
          <img src={logo} alt="Zentrobot" className="h-8 w-8 shrink-0 rounded-lg object-cover md:h-9 md:w-9" />
          <span className="truncate font-extrabold tracking-tight text-foreground">Zentrobot</span>
        </Link>

        <nav className="hidden items-center gap-0.5 lg:flex">
          <Link
            to="/automation#features"
            className="rounded-md px-3 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-muted/60 hover:text-foreground"
          >
            Features
          </Link>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button
                type="button"
                className="inline-flex h-10 items-center gap-1 rounded-md px-3 text-sm font-medium text-foreground outline-none transition-colors hover:bg-muted/70 data-[state=open]:bg-muted/70"
              >
                Explore
                <ChevronDown className="h-3.5 w-3.5 text-muted-foreground" />
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent
              align="start"
              sideOffset={8}
              className="automation-dropdown-panel z-[200] w-[min(calc(100vw-2rem),22rem)] rounded-xl p-2"
            >
              {automationProductMenu.map((item) => {
                const Icon = item.Icon;
                return (
                  <DropdownMenuItem
                    key={item.slug}
                    className="cursor-pointer rounded-lg p-0 focus:bg-muted/60"
                    asChild
                  >
                    <Link to={`/automation/product/${item.slug}`} className="block outline-none">
                      <span className="flex gap-3 rounded-lg px-2 py-2.5 hover:bg-muted/50">
                        <span className={iconWrap}>
                          <Icon className="h-5 w-5" />
                        </span>
                        <span className="min-w-0 text-left">
                          <span className="block text-sm font-bold text-foreground">{item.title}</span>
                          <span className="block text-xs text-muted-foreground">{item.subtitle}</span>
                        </span>
                      </span>
                    </Link>
                  </DropdownMenuItem>
                );
              })}
            </DropdownMenuContent>
          </DropdownMenu>
          <Link
            to="/automation#pricing"
            className="rounded-md px-3 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-muted/60 hover:text-foreground"
          >
            Pricing
          </Link>
        </nav>

        <div className="hidden shrink-0 items-center gap-2 lg:flex">
          <Button variant="outline" size="sm" asChild>
            <Link to="/login" state={{ backgroundLocation: location }}>
              Login
            </Link>
          </Button>
          <Button variant="outline" size="sm" asChild>
            <Link to="/#contact">Contact</Link>
          </Button>
          <Button variant="hero" size="sm" asChild>
            <Link to="/">Marketing site</Link>
          </Button>
        </div>

        <div className="flex items-center gap-2 lg:hidden">
          <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
            <SheetTrigger asChild>
              <Button variant="outline" size="icon" aria-label="Open menu">
                <Menu className="h-5 w-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-full border-border bg-background p-0 sm:max-w-md">
              <SheetHeader className="border-b border-border px-4 py-4 text-left">
                <SheetTitle className="text-foreground">Zentrobot</SheetTitle>
              </SheetHeader>
              <ScrollArea className="h-[calc(100vh-5rem)] px-2">
                <div className="space-y-1 pb-6 pt-2">
                  <Link
                    to="/login"
                    state={{ backgroundLocation: location }}
                    className="mb-2 block rounded-lg px-3 py-3 font-medium text-foreground hover:bg-muted/70"
                    onClick={() => setMobileOpen(false)}
                  >
                    Login
                  </Link>
                  <Link
                    to="/automation#pricing"
                    className="mb-4 block rounded-lg px-3 py-3 font-medium text-foreground hover:bg-muted/70"
                    onClick={() => setMobileOpen(false)}
                  >
                    Pricing
                  </Link>
                  <p className="mb-2 px-1 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                    Features
                  </p>
                  {featureLinks}
                </div>
              </ScrollArea>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
};
