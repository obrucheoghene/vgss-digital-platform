"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { Link2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useKingsChat } from "./kingschat-context";

export function KingsChatBanner() {
  const { resolved, linked } = useKingsChat();
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  if (!mounted || !resolved || linked) return null;

  return (
    <div className="border-b bg-blue-50 dark:bg-blue-950/30 border-blue-200 dark:border-blue-800">
      <div className="mx-auto max-w-7xl px-4 md:px-6 py-2.5 flex items-center justify-between gap-4">
        <div className="flex items-center gap-3 min-w-0">
          <Image
            src="/kingschat-logo.png"
            alt="KingsChat"
            width={28}
            height={28}
            className="shrink-0"
          />
          <p className="text-sm text-blue-900 dark:text-blue-100 truncate">
            <span className="font-medium">Connect KingsChat</span>
            <span className="hidden sm:inline text-blue-700 dark:text-blue-300">
              {" "}— link your account to sign in faster without a password.
            </span>
          </p>
        </div>

        <Button
          size="sm"
          className="h-7 px-3 text-xs bg-blue-600 hover:bg-blue-700 text-white shrink-0"
          onClick={() => { window.location.href = "/api/auth/kingschat/link"; }}
        >
          <Link2 className="w-3 h-3 mr-1.5" />
          Connect
        </Button>
      </div>
    </div>
  );
}
