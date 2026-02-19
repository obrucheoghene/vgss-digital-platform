"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { X, Link2 } from "lucide-react";
import { Button } from "@/components/ui/button";

const DISMISS_KEY = "kc_banner_dismissed";

export function KingsChatBanner() {
  const { data: session } = useSession();
  const [show, setShow] = useState(false);

  useEffect(() => {
    // Skip if already dismissed this session
    if (sessionStorage.getItem(DISMISS_KEY)) return;

    fetch("/api/auth/kingschat/status")
      .then((r) => r.json())
      .then((data) => {
        if (!data.linked) setShow(true);
      })
      .catch(() => {/* silently ignore */});
  }, [session?.user?.id]);

  const dismiss = () => {
    sessionStorage.setItem(DISMISS_KEY, "1");
    setShow(false);
  };

  if (!show) return null;

  return (
    <div className="border-b bg-blue-50 dark:bg-blue-950/30 border-blue-200 dark:border-blue-800">
      <div className="mx-auto max-w-7xl px-4 md:px-6 py-2.5 flex items-center justify-between gap-4">
        <div className="flex items-center gap-3 min-w-0">
          {/* KingsChat icon */}
          <div className="w-7 h-7 rounded-md bg-blue-600 flex items-center justify-center shrink-0">
            <svg
              className="w-3.5 h-3.5 text-white"
              viewBox="0 0 24 24"
              fill="currentColor"
              aria-hidden="true"
            >
              <path d="M12 2C6.477 2 2 6.477 2 12s4.477 10 10 10 10-4.477 10-10S17.523 2 12 2zm4.5 7.5h-2.25v5.25h-1.5V9.5H10.5V8h6v1.5z" />
            </svg>
          </div>
          <p className="text-sm text-blue-900 dark:text-blue-100 truncate">
            <span className="font-medium">Connect KingsChat</span>
            <span className="hidden sm:inline text-blue-700 dark:text-blue-300">
              {" "}— link your account to sign in faster without a password.
            </span>
          </p>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <Button
            size="sm"
            className="h-7 px-3 text-xs bg-blue-600 hover:bg-blue-700 text-white"
            onClick={() => { window.location.href = "/api/auth/kingschat/link"; }}
          >
            <Link2 className="w-3 h-3 mr-1.5" />
            Connect
          </Button>
          <button
            onClick={dismiss}
            className="p-1 rounded hover:bg-blue-100 dark:hover:bg-blue-900 text-blue-600 dark:text-blue-300 transition-colors"
            aria-label="Dismiss"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
