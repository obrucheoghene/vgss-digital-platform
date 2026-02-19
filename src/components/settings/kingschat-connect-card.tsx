"use client";

import { useEffect, useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Image from "next/image";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Loader2, Link2, Link2Off, CheckCircle2, AlertCircle } from "lucide-react";
import { toast } from "sonner";

type KingsProfile = { name: string; username: string; avatarUrl: string } | null;

// Avatar with fallback initials
function KingsAvatar({ profile }: { profile: NonNullable<KingsProfile> }) {
  const [imgError, setImgError] = useState(false);
  const initials = profile.name?.charAt(0)?.toUpperCase() || "K";

  if (profile.avatarUrl && !imgError) {
    return (
      <Image
        src={profile.avatarUrl}
        alt={profile.name}
        width={44}
        height={44}
        className="rounded-full object-cover shrink-0"
        onError={() => setImgError(true)}
        unoptimized
      />
    );
  }

  return (
    <div className="w-11 h-11 rounded-full bg-blue-600 flex items-center justify-center shrink-0">
      <span className="text-white text-base font-semibold">{initials}</span>
    </div>
  );
}

// Inner component that uses useSearchParams — must be inside <Suspense>
function KingsChatConnectInner() {
  const searchParams = useSearchParams();
  const [linked, setLinked] = useState<boolean | null>(null);
  const [profile, setProfile] = useState<KingsProfile>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isUnlinking, setIsUnlinking] = useState(false);

  // Fetch current link status
  useEffect(() => {
    fetch("/api/auth/kingschat/status")
      .then((r) => r.json())
      .then((data) => {
        setLinked(data.linked);
        setProfile(data.profile ?? null);
      })
      .catch(() => setLinked(false))
      .finally(() => setIsLoading(false));
  }, []);

  // Handle success/error returned via URL params after KingsChat redirect
  useEffect(() => {
    const success = searchParams.get("success");
    const error = searchParams.get("error");

    if (success === "kingschat_linked") {
      toast.success("KingsChat account linked successfully!");
      setLinked(true);
      // Re-fetch to get the saved profile
      fetch("/api/auth/kingschat/status")
        .then((r) => r.json())
        .then((data) => setProfile(data.profile ?? null));
      const url = new URL(window.location.href);
      url.searchParams.delete("success");
      window.history.replaceState({}, "", url.toString());
    }

    if (error === "kingschat_already_linked") {
      toast.error("This KingsChat account is already linked to another user.");
    } else if (error === "kingschat_link_expired") {
      toast.error("Link session expired. Please try again.");
    } else if (error === "kingschat_error") {
      toast.error("Something went wrong. Please try again.");
    }

    if (error) {
      const url = new URL(window.location.href);
      url.searchParams.delete("error");
      window.history.replaceState({}, "", url.toString());
    }
  }, [searchParams]);

  const handleConnect = () => {
    window.location.href = "/api/auth/kingschat/link";
  };

  const handleDisconnect = async () => {
    setIsUnlinking(true);
    try {
      const res = await fetch("/api/auth/kingschat/link", { method: "DELETE" });
      if (!res.ok) throw new Error();
      setLinked(false);
      setProfile(null);
      toast.success("KingsChat account unlinked.");
    } catch {
      toast.error("Failed to unlink KingsChat. Please try again.");
    } finally {
      setIsUnlinking(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center gap-2 text-muted-foreground">
        <Loader2 className="w-4 h-4 animate-spin" />
        <span className="text-sm">Checking connection status...</span>
      </div>
    );
  }

  if (linked) {
    return (
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          {profile ? (
            <KingsAvatar profile={profile} />
          ) : (
            <CheckCircle2 className="w-5 h-5 text-green-500 shrink-0" />
          )}
          <div>
            <div className="flex items-center gap-2">
              <p className="text-sm font-medium">
                {profile?.name || "KingsChat"}
              </p>
              <Badge className="bg-green-100 text-green-800 border-green-200 text-xs">
                Connected
              </Badge>
            </div>
            {profile?.username && (
              <p className="text-xs text-muted-foreground">@{profile.username}</p>
            )}
          </div>
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={handleDisconnect}
          disabled={isUnlinking}
          className="text-destructive border-destructive/30 hover:bg-destructive/10 shrink-0"
        >
          {isUnlinking ? (
            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
          ) : (
            <Link2Off className="w-4 h-4 mr-2" />
          )}
          {isUnlinking ? "Unlinking..." : "Disconnect"}
        </Button>
      </div>
    );
  }

  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
      <div className="flex items-center gap-3">
        <AlertCircle className="w-5 h-5 text-muted-foreground shrink-0" />
        <p className="text-sm text-muted-foreground">
          No KingsChat account connected
        </p>
      </div>
      <Button
        size="sm"
        onClick={handleConnect}
        className="bg-blue-600 hover:bg-blue-700 text-white shrink-0"
      >
        <Link2 className="w-4 h-4 mr-2" />
        Connect KingsChat
      </Button>
    </div>
  );
}

// Exported component — wraps inner in Suspense to satisfy Next.js App Router
export function KingsChatConnectCard() {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center">
            <svg
              className="w-4 h-4 text-white"
              viewBox="0 0 24 24"
              fill="currentColor"
              aria-hidden="true"
            >
              <path d="M12 2C6.477 2 2 6.477 2 12s4.477 10 10 10 10-4.477 10-10S17.523 2 12 2zm4.5 7.5h-2.25v5.25h-1.5V9.5H10.5V8h6v1.5z" />
            </svg>
          </div>
          KingsChat
        </CardTitle>
        <CardDescription>
          Link your KingsChat account to sign in faster — no password needed.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Suspense
          fallback={
            <div className="flex items-center gap-2 text-muted-foreground">
              <Loader2 className="w-4 h-4 animate-spin" />
              <span className="text-sm">Loading...</span>
            </div>
          }
        >
          <KingsChatConnectInner />
        </Suspense>
      </CardContent>
    </Card>
  );
}
