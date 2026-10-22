import { useEffect } from "react";
import { Outlet } from "react-router-dom";
import { AutomationNavbar } from "@/components/automation/AutomationNavbar";
import { Footer } from "@/components/Footer";

const AutomationLayout = () => {
  useEffect(() => {
    document.documentElement.classList.add("theme-automation");
    return () => document.documentElement.classList.remove("theme-automation");
  }, []);

  return (
    <div className="min-h-screen bg-background text-foreground antialiased">
      <AutomationNavbar />
      <Outlet />
      <Footer />
    </div>
  );
};

export default AutomationLayout;
