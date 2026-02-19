"use client";

import { createContext, useContext, useEffect, useState, useCallback, ReactNode } from "react";
import { useSession } from "next-auth/react";

export type KingsProfile = { name: string; username: string; avatarUrl: string } | null;

interface KingsChatContextValue {
  resolved: boolean;
  linked: boolean;
  profile: KingsProfile;
  refresh: () => void;
}

const KingsChatContext = createContext<KingsChatContextValue>({
  resolved: false,
  linked: false,
  profile: null,
  refresh: () => {},
});

export function KingsChatProvider({ children }: { children: ReactNode }) {
  const { status } = useSession();
  const [resolved, setResolved] = useState(false);
  const [linked, setLinked] = useState(false);
  const [profile, setProfile] = useState<KingsProfile>(null);

  const fetchStatus = useCallback(() => {
    fetch("/api/auth/kingschat/status")
      .then((r) => (r.ok ? r.json() : null))
      .then((data) => {
        if (data) {
          setLinked(data.linked);
          setProfile(data.linked ? (data.profile ?? null) : null);
        }
        setResolved(true);
      })
      .catch(() => setResolved(true));
  }, []);

  useEffect(() => {
    if (status === "authenticated") {
      fetchStatus();
    } else if (status === "unauthenticated") {
      setResolved(true);
    }
  }, [status, fetchStatus]);

  return (
    <KingsChatContext.Provider value={{ resolved, linked, profile, refresh: fetchStatus }}>
      {children}
    </KingsChatContext.Provider>
  );
}

export const useKingsChat = () => useContext(KingsChatContext);
