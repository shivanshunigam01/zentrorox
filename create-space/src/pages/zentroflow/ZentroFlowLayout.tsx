import { useEffect, useState } from "react";
import { Link, NavLink, Outlet, useNavigate } from "react-router-dom";
import { LayoutDashboard, LogOut, Users, Inbox, Plug, Workflow, AlertTriangle, Menu, X, Settings } from "lucide-react";
import { getZfUser, isZfAuthed, zfLogout, getActiveTenantId } from "@/lib/zentroflow/auth";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { SeoHead } from "@/components/seo/SeoHead";

const nav = [
  { to: "/zentroflow", label: "Dashboard", icon: LayoutDashboard, end: true },
  { to: "/zentroflow/leads", label: "Leads", icon: Inbox },
  { to: "/zentroflow/verification", label: "Verification", icon: Users },
  { to: "/zentroflow/integrations", label: "Integrations", icon: Plug },
  { to: "/zentroflow/automations", label: "Automations", icon: Workflow },
  { to: "/zentroflow/jobs", label: "Jobs / Failures", icon: AlertTriangle },
  { to: "/zentroflow/settings", label: "Team & Branches", icon: Settings },
];

export default function ZentroFlowLayout() {
  const navigate = useNavigate();
  const [mobileOpen, setMobileOpen] = useState(false);
  const user = getZfUser();

  useEffect(() => {
    if (!isZfAuthed()) navigate("/zentroflow/login", { replace: true });
  }, [navigate]);

  const logout = () => {
    zfLogout();
    navigate("/zentroflow/login", { replace: true });
  };

  const Sidebar = (
    <div className="flex flex-col h-full bg-[#0f1c2e] text-white">
      <Link to="/zentroflow" className="px-5 h-16 flex flex-col justify-center border-b border-white/10">
        <div className="text-sm font-semibold tracking-wide">ZentroFlow</div>
        <div className="text-[10px] uppercase tracking-widest text-white/50">Lead CRM 2.0</div>
      </Link>
      <nav className="flex-1 p-3 space-y-1 overflow-y-auto">
        {nav.map((n) => (
          <NavLink
            key={n.to}
            to={n.to}
            end={n.end}
            className={({ isActive }) =>
              cn(
                "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors",
                isActive ? "bg-white/15 text-white" : "text-white/70 hover:bg-white/10 hover:text-white",
              )
            }
          >
            <n.icon className="h-4 w-4" />
            {n.label}
          </NavLink>
        ))}
      </nav>
      <div className="p-3 border-t border-white/10 space-y-2">
        <div className="px-2 text-xs text-white/60 truncate">{user?.name} · {user?.role}</div>
        <div className="px-2 text-[10px] text-white/40 truncate">Tenant: {getActiveTenantId() || "—"}</div>
        <Button onClick={logout} variant="outline" className="w-full bg-transparent border-white/20 text-white hover:bg-white/10">
          <LogOut className="h-4 w-4" /> Log out
        </Button>
      </div>
    </div>
  );

  return (
    <>
      <SeoHead title="ZentroFlow | Zentroverse" description="Multi-tenant lead CRM" path="/zentroflow" noindex />
      <div className="min-h-screen flex bg-slate-50">
        <aside className="hidden md:block w-64 shrink-0">{Sidebar}</aside>
        {mobileOpen && (
          <div className="fixed inset-0 z-50 md:hidden">
            <div className="absolute inset-0 bg-black/50" onClick={() => setMobileOpen(false)} />
            <div className="absolute left-0 top-0 bottom-0 w-72 shadow-xl">{Sidebar}</div>
          </div>
        )}
        <div className="flex-1 flex flex-col min-w-0">
          <header className="h-14 bg-white border-b flex items-center px-4 gap-3 sticky top-0 z-40">
            <button type="button" className="md:hidden" onClick={() => setMobileOpen(true)}>
              <Menu className="h-5 w-5" />
            </button>
            <div className="text-sm font-medium text-slate-700">ZentroFlow Portal</div>
            {mobileOpen && (
              <button type="button" className="ml-auto md:hidden" onClick={() => setMobileOpen(false)}>
                <X className="h-5 w-5" />
              </button>
            )}
          </header>
          <main className="flex-1 p-4 md:p-6">
            <Outlet />
          </main>
        </div>
      </div>
    </>
  );
}
