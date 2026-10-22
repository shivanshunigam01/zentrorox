import { useEffect, useState } from "react";
import { Link, NavLink, Outlet, useNavigate } from "react-router-dom";
import {
  Building2,
  CalendarDays,
  ClipboardList,
  LayoutDashboard,
  LogOut,
  Menu,
  UserRound,
  Users,
  X,
} from "lucide-react";
import { getHrOrg, getHrUser, hrLogout, isHrAuthed } from "@/lib/hr/auth";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { SeoHead } from "@/components/seo/SeoHead";
import logo from "@/assets/zentroverse-logo.jpg";

const nav = [
  { to: "/hr", label: "Dashboard", icon: LayoutDashboard, end: true },
  { to: "/hr/employees", label: "Employees", icon: Users },
  { to: "/hr/attendance", label: "Attendance", icon: ClipboardList },
  { to: "/hr/leave", label: "Leave", icon: CalendarDays },
  { to: "/hr/organization", label: "Organization", icon: Building2 },
  { to: "/hr/profile", label: "My Profile", icon: UserRound },
];

export default function HrLayout() {
  const navigate = useNavigate();
  const [mobileOpen, setMobileOpen] = useState(false);
  const user = getHrUser();
  const org = getHrOrg();

  useEffect(() => {
    if (!isHrAuthed()) navigate("/hr/login", { replace: true });
  }, [navigate]);

  const logout = () => {
    hrLogout();
    navigate("/hr/login", { replace: true });
  };

  const Sidebar = (
    <div className="flex flex-col h-full bg-secondary text-secondary-foreground">
      <Link to="/hr" className="flex items-center gap-2 px-5 h-16 border-b border-white/10">
        <img src={logo} alt="Zentroverse" className="h-8 w-8 rounded object-cover bg-white" />
        <div>
          <div className="brand-wordmark text-[0.65rem] text-foreground leading-none">Zentroverse</div>
          <div className="text-[10px] uppercase tracking-widest text-white/60">HR Module</div>
        </div>
      </Link>
      <nav className="flex-1 p-3 space-y-1 overflow-y-auto">
        {nav.map((n) => (
          <NavLink
            key={n.to}
            to={n.to}
            end={n.end}
            onClick={() => setMobileOpen(false)}
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
        <div className="px-2 text-[10px] text-white/40 truncate">{org?.name || "—"}</div>
        <Button
          onClick={logout}
          variant="outline"
          className="w-full bg-transparent border-white/20 text-white hover:bg-white/10 hover:text-white"
        >
          <LogOut className="h-4 w-4" /> Log out
        </Button>
      </div>
    </div>
  );

  return (
    <>
      <SeoHead title="HR Module | Zentroverse" description="People & attendance" path="/hr" noindex />
      <div className="min-h-screen flex bg-muted/30">
        <aside className="hidden md:block w-64 shrink-0">{Sidebar}</aside>
        {mobileOpen && (
          <div className="fixed inset-0 z-50 md:hidden">
            <div className="absolute inset-0 bg-black/50" onClick={() => setMobileOpen(false)} />
            <div className="absolute left-0 top-0 bottom-0 w-72 shadow-xl">{Sidebar}</div>
          </div>
        )}
        <div className="flex-1 flex flex-col min-w-0">
          <header className="h-14 bg-background border-b flex items-center px-4 gap-3 sticky top-0 z-40">
            <button type="button" className="md:hidden" onClick={() => setMobileOpen(true)}>
              <Menu className="h-5 w-5" />
            </button>
            <div className="text-sm font-medium text-foreground">HR Portal</div>
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
