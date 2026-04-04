import { supabase } from "@/lib/supabase";
import type { GameStoreSlice } from "@/lib/gamification-engine";
import {
  isRemoteUserId,
  logActivity,
  syncAchievementsToRemote,
  syncSubjectActivity,
} from "@/lib/sync/supabase-game-sync";

export function scheduleSyncAfterAddPoints(
  userId: string,
  subjectId: string,
  pointsEarned: number,
  state: GameStoreSlice
): void {
  if (!supabase || !isRemoteUserId(userId)) return;

  void (async () => {
    await syncSubjectActivity(supabase, userId, subjectId, state);
    await logActivity(supabase, userId, subjectId, pointsEarned, "lesson_progress");
    await syncAchievementsToRemote(supabase, userId, state.earnedAchievementIds);
  })();
}

export function scheduleSyncAchievements(userId: string, state: GameStoreSlice): void {
  if (!supabase || !isRemoteUserId(userId)) return;
  void syncAchievementsToRemote(supabase, userId, state.earnedAchievementIds);
}
