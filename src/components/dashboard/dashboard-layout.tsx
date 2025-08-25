// src/components/dashboard/dashboard-layout.tsx
"use client";

import { useState } from "react";
import { Sidebar } from "./sidebar";
import { DashboardHeader } from "./header";
import { cn } from "@/lib/utils";

interface DashboardLayoutProps {
  children: React.ReactNode;
  title?: string;
}

export function DashboardLayout({ children, title }: DashboardLayoutProps) {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen bg-background">
      {/* Mobile Sidebar Overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-background/80 backdrop-blur-sm md:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div
        className={cn(
          "fixed inset-y-0 left-0 z-50 transition-all duration-300",
          sidebarCollapsed ? "w-16" : "w-64",
          sidebarOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"
        )}
      >
        <Sidebar isCollapsed={sidebarCollapsed} className="h-full" />
      </div>

      {/* Main Content */}
      <div
        className={cn(
          "transition-all duration-300",
          sidebarCollapsed ? "md:ml-16" : "md:ml-64"
        )}
      >
        <DashboardHeader
          onMenuClick={() => setSidebarOpen(!sidebarOpen)}
          title={title}
        />

        {/* Page Content */}
        <main className="flex-1 p-4 md:p-6">
          <div className="mx-auto max-w-7xl">{children}</div>
        </main>
      </div>

      {/* Sidebar Toggle Button (Desktop) */}
      <button
        onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
        className={cn(
          "fixed top-1/2 -translate-y-1/2 z-30 hidden md:flex items-center justify-center",
          "w-6 h-12 bg-background border border-l-0 rounded-r-md shadow-sm",
          "hover:bg-muted transition-colors duration-200",
          sidebarCollapsed ? "left-16" : "left-64"
        )}
      >
        <div
          className={cn(
            "w-3 h-3 border-r-2 border-b-2 border-foreground transform transition-transform duration-200",
            sidebarCollapsed ? "rotate-135" : "-rotate-45"
          )}
        />
      </button>
    </div>
  );
}
