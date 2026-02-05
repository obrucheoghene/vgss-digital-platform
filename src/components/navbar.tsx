"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";
import { GraduationCap, Shield, Sparkles } from "lucide-react";

const navLinks = [
  { href: "/", label: "Home" },
  { href: "/blog", label: "Blog" },
  { href: "/gallery", label: "Gallery" },
  { href: "/graduate/search", label: "Search Records" },
];

export function Navbar() {
  const pathname = usePathname();

  return (
    <header className="relative z-50 border-b bg-background/80 backdrop-blur-xl supports-[backdrop-filter]:bg-background/60 sticky top-0">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center py-4">
          <Link href="/" className="flex items-center space-x-3">
            <div className="relative">
              <div className="w-12 h-12 bg-gradient-to-br from-primary to-purple-600 rounded-2xl flex items-center justify-center shadow-lg">
                <GraduationCap className="w-6 h-6 text-white" />
              </div>
            </div>
            <div>
              <h1 className="text-2xl font-bold bg-gradient-to-r from-primary to-purple-600 bg-clip-text text-transparent">
                VGSS
              </h1>
              <p className="text-xs text-muted-foreground font-medium">
                LoveWorld Inc.
              </p>
            </div>
          </Link>
          <nav className="hidden md:flex items-center space-x-6">
            {navLinks.map((link) => {
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={
                    isActive
                      ? "text-primary font-semibold"
                      : "text-muted-foreground hover:text-primary transition-colors font-medium"
                  }
                >
                  {link.label}
                </Link>
              );
            })}
          </nav>
          <div className="flex items-center space-x-4">
            <Link href="/auth/login">
              <Button
                variant="outline"
                className="hover:bg-primary/10 transition-all duration-300"
              >
                <Shield className="w-4 h-4 mr-2" />
                Staff Login
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </header>
  );
}
