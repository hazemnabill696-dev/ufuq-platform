"use client";

import { useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { pullRemoteGameState } from "@/lib/sync/supabase-game-sync";
import { useGameStore, LOCAL_USER_ID } from "@/store/useGameStore";

export function SupabaseAuthProvider({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    const client = supabase;
    if (!client) return;

    const { data } = client.auth.onAuthStateChange(async (event, session) => {
      if (event === "SIGNED_OUT") {
        useGameStore.getState().setUserId(LOCAL_USER_ID);
        return;
      }

      if (!session?.user) return;

      if (event === "INITIAL_SESSION" || event === "SIGNED_IN") {
        const uid = session.user.id;
        useGameStore.getState().setUserId(uid);
        const remote = await pullRemoteGameState(client, uid);
        if (remote) {
          useGameStore.getState().mergeFromRemote(remote);
        }
      }
    });

    return () => {
      data.subscription.unsubscribe();
    };
  }, []);

  return <>{children}</>;
}
