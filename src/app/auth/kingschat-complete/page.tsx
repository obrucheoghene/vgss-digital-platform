"use client";

import { Suspense, useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { signIn, getSession } from "next-auth/react";
import { Loader2 } from "lucide-react";

function KingsChatCompleteContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [error, setError] = useState("");

  useEffect(() => {
    const token = searchParams.get("kc_token");

    if (!token) {
      router.replace("/auth/login?error=kingschat_missing_token");
      return;
    }

    async function complete() {
      const result = await signIn("credentials", {
        kc_token: token,
        redirect: false,
      });

      if (result?.error) {
        setError("KingsChat sign-in failed. Please try again.");
        setTimeout(() => router.replace("/auth/login?error=kingschat_error"), 2000);
        return;
      }

      const session = await getSession();
      if (!session?.user) {
        router.replace("/auth/login?error=kingschat_no_session");
        return;
      }

      if (session.user.accountStatus === "pending_activation") {
        router.replace("/auth/activate-account");
        return;
      }

      switch (session.user.type) {
        case "VGSS_OFFICE":
          router.replace("/dashboard/vgss-office");
          break;
        case "BLW_ZONE":
          router.replace("/dashboard/blw-zone");
          break;
        case "SERVICE_DEPARTMENT":
          router.replace("/dashboard/service-department");
          break;
        case "GRADUATE":
          router.replace("/dashboard/graduate");
          break;
        default:
          router.replace("/dashboard");
      }
    }

    complete();
  }, [searchParams, router]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary via-primary/90 to-primary/80 flex items-center justify-center">
      <div className="flex flex-col items-center space-y-4 text-white">
        {error ? (
          <p className="text-red-300">{error}</p>
        ) : (
          <>
            <Loader2 className="h-8 w-8 animate-spin" />
            <p className="text-white/80">Completing KingsChat sign-in...</p>
          </>
        )}
      </div>
    </div>
  );
}

export default function KingsChatCompletePage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-gradient-to-br from-primary via-primary/90 to-primary/80 flex items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-white" />
        </div>
      }
    >
      <KingsChatCompleteContent />
    </Suspense>
  );
}
