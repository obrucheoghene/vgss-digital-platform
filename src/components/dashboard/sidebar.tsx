// src/components/dashboard/sidebar.tsx
"use client";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import {
  Shield,
  Users,
  Building,
  GraduationCap,
  Home,
  Settings,
  FileText,
  UserPlus,
  Upload,
  Search,
  Calendar,
  BookOpen,
  BarChart3,
  MessageSquare,
  LogOut,
  UserCog,
  HouseIcon,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useSession, signOut } from "next-auth/react";

const navigationItems = {
  VGSS_OFFICE: [
    {
      title: "Dashboard",
      icon: Home,
      href: "/dashboard/vgss-office",
      badge: null,
    },
    {
      title: "User Management",
      icon: UserCog,
      href: "/dashboard/vgss-office/users",
      badge: null,
    },
    {
      title: "Account Creation",
      icon: UserPlus,
      href: "/dashboard/vgss-office/create-account",
      badge: null,
    },
    {
      title: "Graduates",
      icon: GraduationCap,
      href: "/dashboard/vgss-office/graduates",
      badge: null, // Example count
    },
    {
      title: "BLW Zones",
      icon: Building,
      href: "/dashboard/vgss-office/blw-zones",
      badge: null,
    },
    {
      title: "Service Departments",
      icon: HouseIcon,
      href: "/dashboard/vgss-office/service-department",
      badge: null, // Pending reviews
    },
    {
      title: "Reports & Analytics",
      icon: BarChart3,
      href: "/dashboard/vgss-office/reports",
      badge: null,
    },

    {
      title: "Settings",
      icon: Settings,
      href: "/dashboard/vgss-office/settings",
      badge: null,
    },
  ],
  BLW_ZONE: [
    {
      title: "Dashboard",
      icon: Home,
      href: "/dashboard/blw-zone",
      badge: null,
    },
    {
      title: "Upload Graduates",
      icon: Upload,
      href: "/dashboard/blw-zone/upload",
      badge: null,
    },
    {
      title: "My Graduates",
      icon: Users,
      href: "/dashboard/blw-zone/graduates",
      badge: "45",
    },
    {
      title: "Registration Status",
      icon: FileText,
      href: "/dashboard/blw-zone/status",
      badge: "8", // New registrations
    },
    {
      title: "Reports",
      icon: BarChart3,
      href: "/dashboard/blw-zone/reports",
      badge: null,
    },
    {
      title: "Settings",
      icon: Settings,
      href: "/dashboard/blw-zone/settings",
      badge: null,
    },
  ],
  SERVICE_DEPARTMENT: [
    {
      title: "Dashboard",
      icon: Home,
      href: "/dashboard/service-department",
      badge: null,
    },
    {
      title: "Request Staff",
      icon: UserPlus,
      href: "/dashboard/service-department/request",
      badge: null,
    },
    {
      title: "My VGSS Staff",
      icon: Users,
      href: "/dashboard/service-department/staff",
      badge: "3",
    },
    {
      title: "Salary Management",
      icon: FileText,
      href: "/dashboard/service-department/salary",
      badge: null,
    },
    {
      title: "Staff Feedback",
      icon: MessageSquare,
      href: "/dashboard/service-department/feedback",
      badge: null,
    },
    {
      title: "Reports",
      icon: BarChart3,
      href: "/dashboard/service-department/reports",
      badge: null,
    },
    {
      title: "Settings",
      icon: Settings,
      href: "/dashboard/service-department/settings",
      badge: null,
    },
  ],
  GRADUATE: [
    {
      title: "Dashboard",
      icon: Home,
      href: "/dashboard/graduate",
      badge: null,
    },
    {
      title: "My Profile",
      icon: Users,
      href: "/dashboard/graduate/profile",
      badge: null,
    },
    {
      title: "Interview Questions",
      icon: MessageSquare,
      href: "/dashboard/graduate/interview",
      badge: "New",
    },
    {
      title: "Training Modules",
      icon: BookOpen,
      href: "/dashboard/graduate/training",
      badge: "2",
    },
    {
      title: "Service Assignment",
      icon: Calendar,
      href: "/dashboard/graduate/assignment",
      badge: null,
    },
    {
      title: "KingsChat Integration",
      icon: MessageSquare,
      href: "/dashboard/graduate/kingschat",
      badge: null,
    },
    {
      title: "Settings",
      icon: Settings,
      href: "/dashboard/graduate/settings",
      badge: null,
    },
  ],
};

interface SidebarProps {
  className?: string;
  isCollapsed?: boolean;
}

export function Sidebar({ className, isCollapsed = false }: SidebarProps) {
  const pathname = usePathname();
  const { data: session } = useSession();

  if (!session?.user) return null;

  const userType = session.user.type as keyof typeof navigationItems;
  const navigation = navigationItems[userType] || [];

  const getUserTypeConfig = (type: string) => {
    switch (type) {
      case "VGSS_OFFICE":
        return { icon: Shield, color: "text-purple-600", bg: "bg-purple-100" };
      case "BLW_ZONE":
        return { icon: Building, color: "text-blue-600", bg: "bg-blue-100" };
      case "SERVICE_DEPARTMENT":
        return { icon: Building, color: "text-green-600", bg: "bg-green-100" };
      case "GRADUATE":
        return {
          icon: GraduationCap,
          color: "text-orange-600",
          bg: "bg-orange-100",
        };
      default:
        return { icon: Users, color: "text-gray-600", bg: "bg-gray-100" };
    }
  };

  const userConfig = getUserTypeConfig(session.user.type);
  const UserIcon = userConfig.icon;

  return (
    <div className={cn("pb-12 min-h-screen bg-card border-r", className)}>
      <div className="space-y-4 py-4">
        {/* Header */}
        <div className="px-3 py-2">
          <div className="flex items-center space-x-3 mb-4">
            <div
              className={cn(
                "w-10 h-10 rounded-lg flex items-center justify-center",
                userConfig.bg
              )}
            >
              <UserIcon className={cn("w-5 h-5", userConfig.color)} />
            </div>
            {!isCollapsed && (
              <div className="flex-1 min-w-0">
                <h2 className="text-lg font-semibold text-foreground">VGSS</h2>
                <p className="text-xs text-muted-foreground truncate">
                  {session.user.type.replace("_", " ")}
                </p>
              </div>
            )}
          </div>
        </div>

        {/* || pathname.startsWith(item.href + "/") */}
        {/* Navigation */}
        <div className="px-3">
          <div className="space-y-1">
            {navigation.map((item) => {
              const isActive = pathname === item.href;
              return (
                <Button
                  key={item.href}
                  variant={isActive ? "secondary" : "ghost"}
                  className={cn(
                    "w-full justify-start",
                    isActive &&
                      "bg-primary/10 text-primary hover:bg-primary/20",
                    isCollapsed && "px-2"
                  )}
                  asChild
                >
                  <Link href={item.href}>
                    <item.icon
                      className={cn("h-4 w-4", !isCollapsed && "mr-3")}
                    />
                    {!isCollapsed && (
                      <>
                        <span className="flex-1 text-left">{item.title}</span>
                        {item.badge && (
                          <Badge
                            variant="secondary"
                            className="ml-auto h-5 text-xs"
                          >
                            {item.badge}
                          </Badge>
                        )}
                      </>
                    )}
                  </Link>
                </Button>
              );
            })}
          </div>
        </div>

        {/* User Info & Logout */}
        <div className="px-3 pt-4 mt-auto border-t">
          {!isCollapsed && (
            <div className="mb-4">
              <div className="flex items-center space-x-3 p-2 rounded-lg bg-muted/50">
                <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center">
                  <span className="text-primary-foreground text-sm font-medium">
                    {session.user.name?.charAt(0).toUpperCase()}
                  </span>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-foreground truncate">
                    {session.user.name}
                  </p>
                  <p className="text-xs text-muted-foreground truncate">
                    {session.user.email}
                  </p>
                </div>
              </div>
            </div>
          )}

          <Button
            variant="ghost"
            className={cn(
              "w-full justify-start text-muted-foreground hover:text-foreground",
              isCollapsed && "px-2"
            )}
            onClick={() => signOut({ callbackUrl: "/auth/login" })}
          >
            <LogOut className={cn("h-4 w-4", !isCollapsed && "mr-3")} />
            {!isCollapsed && "Sign Out"}
          </Button>
        </div>
      </div>
    </div>
  );
}
