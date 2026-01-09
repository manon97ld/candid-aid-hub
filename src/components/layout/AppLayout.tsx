import { Outlet } from "react-router-dom";
import { AppSidebar } from "./AppSidebar";
import { WelcomeAgent } from "@/components/WelcomeAgent";
import { Bell, Menu } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { cn } from "@/lib/utils";
import { useAuth } from "@/contexts/AuthContext";

export function AppLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { role } = useAuth();

  return (
    <div className="min-h-screen bg-muted flex">
      {/* Sidebar - Desktop */}
      <div className="hidden lg:block">
        <AppSidebar />
      </div>

      {/* Sidebar - Mobile */}
      <div className={cn(
        "fixed inset-0 z-50 lg:hidden",
        sidebarOpen ? "block" : "hidden"
      )}>
        <div 
          className="absolute inset-0 bg-black/50" 
          onClick={() => setSidebarOpen(false)}
        />
        <div className="relative w-64">
          <AppSidebar />
        </div>
      </div>

      {/* Main content */}
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <header className="bg-white border-b sticky top-0 z-40">
          <div className="flex items-center justify-between px-4 lg:px-6 py-4">
            <div className="flex items-center gap-4">
              <Button
                variant="ghost"
                size="icon"
                className="lg:hidden"
                onClick={() => setSidebarOpen(true)}
              >
                <Menu className="w-5 h-5" />
              </Button>
              <h1 className="text-lg font-semibold text-navy">
                Bienvenue sur Candid'aide
              </h1>
            </div>

            <div className="flex items-center gap-4">
              <Button variant="ghost" size="icon" className="relative">
                <Bell className="w-5 h-5" />
                <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full" />
              </Button>
            </div>
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 p-4 lg:p-6">
          <Outlet />
        </main>
      </div>

      {/* Welcome Agent */}
      <WelcomeAgent variant={role || "default"} />
    </div>
  );
}
