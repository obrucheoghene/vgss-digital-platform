// src/components/dashboard/header.tsx
"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import {
  Bell,
  Search,
  Menu,
  User,
  Settings,
  LogOut,
  Moon,
  Sun,
  Shield,
} from "lucide-react";
import { useSession, signOut } from "next-auth/react";
import { useTheme } from "next-themes";
import { useState, useEffect } from "react";

interface DashboardHeaderProps {
  onMenuClick?: () => void;
  title?: string;
}

export function DashboardHeader({ onMenuClick, title }: DashboardHeaderProps) {
  const { data: session } = useSession();
  const { setTheme, theme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const getUserTypeColor = (type: string) => {
    switch (type) {
      case "VGSS_OFFICE":
        return "bg-purple-100 text-purple-800 border-purple-200";
      case "BLW_ZONE":
        return "bg-blue-100 text-blue-800 border-blue-200";
      case "MINISTRY_OFFICE":
        return "bg-green-100 text-green-800 border-green-200";
      case "GRADUATE":
        return "bg-orange-100 text-orange-800 border-orange-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const getWelcomeMessage = (type: string) => {
    const now = new Date();
    const hour = now.getHours();
    let greeting = "Good morning";
    if (hour >= 12) greeting = "Good afternoon";
    if (hour >= 17) greeting = "Good evening";

    switch (type) {
      case "VGSS_OFFICE":
        return `${greeting}, Administrator`;
      case "BLW_ZONE":
        return `${greeting}, Zone Leader`;
      case "MINISTRY_OFFICE":
        return `${greeting}, Office Manager`;
      case "GRADUATE":
        return `${greeting}, Graduate`;
      default:
        return `${greeting}`;
    }
  };

  if (!session?.user) return null;

  return (
    <header className="sticky top-0 z-40 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="flex h-16 items-center justify-between px-4 md:px-6">
        {/* Left Section */}
        <div className="flex items-center space-x-4">
          {/* Mobile Menu Button */}
          <Button
            variant="ghost"
            size="sm"
            className="md:hidden"
            onClick={onMenuClick}
          >
            <Menu className="h-5 w-5" />
          </Button>

          {/* Title */}
          <div>
            <h1 className="text-lg font-semibold text-foreground">
              {title || "Dashboard"}
            </h1>
            <p className="text-sm text-muted-foreground">
              {getWelcomeMessage(session.user.type)}
            </p>
          </div>
        </div>

        {/* Center Section - Search (hidden on mobile) */}
        <div className="hidden md:flex flex-1 max-w-md mx-8">
          <div className="relative w-full">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Search..."
              className="pl-10 bg-muted/50 border-0 focus-visible:ring-1 focus-visible:ring-ring"
            />
          </div>
        </div>

        {/* Right Section */}
        <div className="flex items-center space-x-4">
          {/* Account Status Badge */}
          <Badge className={getUserTypeColor(session.user.type)}>
            <Shield className="w-3 h-3 mr-1" />
            {session.user.type.replace("_", " ")}
          </Badge>

          {/* Notifications */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="sm" className="relative">
                <Bell className="h-5 w-5" />
                <span className="absolute -top-1 -right-1 h-4 w-4 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
                  3
                </span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-80">
              <DropdownMenuLabel>Notifications</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <div className="space-y-2 p-2">
                <div className="p-3 bg-muted/50 rounded-lg">
                  <p className="text-sm font-medium">
                    New graduate registration
                  </p>
                  <p className="text-xs text-muted-foreground">
                    John Doe has completed registration
                  </p>
                </div>
                <div className="p-3 bg-muted/50 rounded-lg">
                  <p className="text-sm font-medium">Interview pending</p>
                  <p className="text-xs text-muted-foreground">
                    2 graduates awaiting interview
                  </p>
                </div>
                <div className="p-3 bg-muted/50 rounded-lg">
                  <p className="text-sm font-medium">System update</p>
                  <p className="text-xs text-muted-foreground">
                    New features available
                  </p>
                </div>
              </div>
            </DropdownMenuContent>
          </DropdownMenu>

          {/* Theme Toggle */}
          {mounted && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setTheme(theme === "light" ? "dark" : "light")}
            >
              {theme === "light" ? (
                <Moon className="h-5 w-5" />
              ) : (
                <Sun className="h-5 w-5" />
              )}
            </Button>
          )}

          {/* User Menu */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="relative h-9 w-9 rounded-full">
                <div className="h-8 w-8 bg-primary rounded-full flex items-center justify-center">
                  <span className="text-primary-foreground text-sm font-medium">
                    {session.user.name?.charAt(0).toUpperCase()}
                  </span>
                </div>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <DropdownMenuLabel className="font-normal">
                <div className="flex flex-col space-y-1">
                  <p className="text-sm font-medium">{session.user.name}</p>
                  <p className="text-xs text-muted-foreground">
                    {session.user.email}
                  </p>
                  <Badge variant="outline" className="w-fit text-xs">
                    {session.user.accountStatus === "active"
                      ? "✓ Active"
                      : "Pending"}
                  </Badge>
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem>
                <User className="mr-2 h-4 w-4" />
                Profile
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Settings className="mr-2 h-4 w-4" />
                Settings
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                className="text-red-600 focus:text-red-600"
                onClick={() => signOut({ callbackUrl: "/auth/login" })}
              >
                <LogOut className="mr-2 h-4 w-4" />
                Sign Out
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
}
