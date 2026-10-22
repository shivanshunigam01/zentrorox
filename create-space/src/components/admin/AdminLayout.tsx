import { useEffect, useState } from "react";
import { Link, NavLink, Outlet, useLocation, useNavigate } from "react-router-dom";
import { LayoutDashboard, LogOut, Menu, Settings, X } from "lucide-react";
import { adminLogout, isAdminAuthed } from "@/lib/admin/auth";
import { ADMIN_MODULES } from "@/lib/admin/modules";
import { Button } from "@/components/ui/button";
import logo from "@/assets/zentroverse-logo.jpg";
import { cn } from "@/lib/utils";
import { SeoHead } from "@/components/seo/SeoHead";
import { CMS_NAV } from "@/lib/cms/sections";

const AdminLayout = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    if (!isAdminAuthed()) navigate("/admin/login", { replace: true });
  }, [navigate, location.pathname]);

  useEffect(() => setMobileOpen(false), [location.pathname]);

  const handleLogout = () => {
    adminLogout();
    navigate("/admin/login", { replace: true });
  };

  const commandNav = ADMIN_MODULES.filter((m) => m.group === "command");
  const submissionNav = ADMIN_MODULES.filter((m) => m.group === "submissions");
  const billingNav = ADMIN_MODULES.filter((m) => m.group === "billing");

  const NavItem = ({ to, label, icon: Icon, end }: { to: string; label: string; icon: React.ComponentType<{ className?: string }>; end?: boolean }) => (
    <NavLink
      to={to}
      end={end}
      className={({ isActive }) =>
        cn(
          "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors",
          isActive ? "bg-white/15 text-white" : "text-white/70 hover:bg-white/10 hover:text-white",
        )
      }
    >
      <Icon className="h-4 w-4" />
      {label}
    </NavLink>
  );

  const SidebarInner = (
    <div className="flex flex-col h-full bg-secondary text-secondary-foreground">
      <Link to="/admin" className="flex items-center gap-2 px-5 h-16 border-b border-white/10">
        <img src={logo} alt="Zentroverse" className="h-8 w-8 rounded object-cover bg-white" />
        <div>
          <div className="brand-wordmark text-[0.65rem] text-foreground leading-none">Zentroverse</div>
          <div className="text-[10px] uppercase tracking-widest text-white/60">Command Center</div>
        </div>
      </Link>
      <nav className="flex-1 p-3 space-y-1 overflow-y-auto">
        {commandNav.map((n) => (
          <NavItem key={n.key} to={n.to} label={n.label} icon={n.icon} end={n.key === "dashboard"} />
        ))}

        <div className="pt-2 pb-1 px-3">
          <div className="text-[10px] uppercase tracking-widest text-white/40 font-semibold">Submissions</div>
        </div>
        {submissionNav.map((n) => (
          <NavItem key={n.key} to={n.to} label={n.label} icon={n.icon} />
        ))}

        <div className="pt-2 pb-1 px-3">
          <div className="text-[10px] uppercase tracking-widest text-white/40 font-semibold">Billing CRM</div>
        </div>
        {billingNav.map((n) => (
          <NavItem key={n.key} to={n.to} label={n.label} icon={n.icon} />
        ))}

        <div className="pt-2 pb-1 px-3">
          <div className="text-[10px] uppercase tracking-widest text-white/40 font-semibold">Content CMS</div>
        </div>
        {CMS_NAV.map((n) => (
          <NavLink
            key={n.to}
            to={n.to}
            className={({ isActive }) =>
              cn(
                "flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors ml-1",
                isActive ? "bg-white/15 text-white" : "text-white/70 hover:bg-white/10 hover:text-white",
              )
            }
          >
            <n.icon className="h-4 w-4 shrink-0" />
            <span className="truncate">{n.label}</span>
          </NavLink>
        ))}

        <div className="pt-2">
          <NavItem to="/admin/settings" label="Settings" icon={Settings} />
        </div>
      </nav>
      <div className="p-3 border-t border-white/10">
        <Button onClick={handleLogout} variant="outline" className="w-full bg-transparent border-white/20 text-white hover:bg-white/10 hover:text-white">
          <LogOut className="h-4 w-4" /> Log out
        </Button>
      </div>
    </div>
  );

  return (
    <>
      <SeoHead title="Admin | Zentroverse" description="Admin panel" path="/admin" noindex />
      <div className="min-h-screen flex bg-muted/30">
        <aside className="hidden md:block w-64 shrink-0">{SidebarInner}</aside>
        {mobileOpen && (
          <div className="fixed inset-0 z-50 md:hidden">
            <div className="absolute inset-0 bg-black/50" onClick={() => setMobileOpen(false)} />
            <div className="absolute left-0 top-0 bottom-0 w-72 shadow-xl">{SidebarInner}</div>
          </div>
        )}
        <div className="flex-1 flex flex-col min-w-0">
          <header className="h-16 bg-background border-b flex items-center justify-between px-4 md:px-6 sticky top-0 z-40">
            <div className="flex items-center gap-3">
              <button onClick={() => setMobileOpen((v) => !v)} className="md:hidden p-2 -ml-2 rounded-lg hover:bg-muted" aria-label="Menu">
                {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
              </button>
              <div className="text-sm text-muted-foreground flex items-center gap-1"><LayoutDashboard className="h-4 w-4" /> Command Center</div>
            </div>
            <Link to="/" className="text-xs text-muted-foreground hover:text-foreground">← Back to site</Link>
          </header>
          <main className="flex-1 p-4 md:p-6 lg:p-8 max-w-full overflow-x-hidden">
            <Outlet />
          </main>
        </div>
      </div>
    </>
  );
};

export default AdminLayout;
