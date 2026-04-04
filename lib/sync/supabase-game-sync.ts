import type { SupabaseClient } from "@supabase/supabase-js";
import type { GameStoreSlice } from "@/lib/gamification-engine";
import { computeLevelInfo } from "@/lib/gamification-engine";

const UUID_RE =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

export function isRemoteUserId(userId: string): boolean {
  return UUID_RE.test(userId);
}

export async function pullRemoteGameState(
  client: SupabaseClient,
  userId: string
): Promise<Partial<GameStoreSlice> | null> {
  if (!isRemoteUserId(userId)) return null;

  const [progressRes, achievementsRes] = await Promise.all([
    client.from("subject_progress").select("subject_id,points,activities_completed").eq("user_id", userId),
    client.from("achievements").select("achievement_id,earned_at").eq("user_id", userId),
  ]);

  if (progressRes.error || achievementsRes.error) {
    console.error(progressRes.error ?? achievementsRes.error);
    return null;
  }

  const subjectPoints: Record<string, number> = {};
  const subjectActivities: Record<string, number> = {};
  let totalActivitiesCompleted = 0;

  for (const row of progressRes.data ?? []) {
    const sid = row.subject_id as string;
    subjectPoints[sid] = row.points ?? 0;
    const ac = row.activities_completed ?? 0;
    subjectActivities[sid] = ac;
    totalActivitiesCompleted += ac;
  }

  const earnedAchievementIds: string[] = [];
  const achievementEarnedAt: Record<string, string> = {};
  for (const row of achievementsRes.data ?? []) {
    const aid = row.achievement_id as string;
    earnedAchievementIds.push(aid);
    if (row.earned_at) achievementEarnedAt[aid] = row.earned_at as string;
  }

  return {
    userId,
    subjectPoints,
    subjectActivities,
    totalActivitiesCompleted,
    earnedAchievementIds: Array.from(new Set(earnedAchievementIds)),
    achievementEarnedAt,
  };
}

export function mergeGameState(
  local: GameStoreSlice,
  remote: Partial<GameStoreSlice>
): Partial<GameStoreSlice> {
  const subjectPoints = { ...local.subjectPoints };
  const subjectActivities = { ...local.subjectActivities };
  for (const k of Object.keys(remote.subjectPoints ?? {})) {
    const r = remote.subjectPoints![k] ?? 0;
    subjectPoints[k] = Math.max(subjectPoints[k] ?? 0, r);
  }
  for (const k of Object.keys(remote.subjectActivities ?? {})) {
    const r = remote.subjectActivities![k] ?? 0;
    subjectActivities[k] = Math.max(subjectActivities[k] ?? 0, r);
  }

  const earnedSet = new Set([...local.earnedAchievementIds, ...(remote.earnedAchievementIds ?? [])]);
  const achievementEarnedAt = { ...local.achievementEarnedAt, ...(remote.achievementEarnedAt ?? {}) };

  const totalActivitiesCompleted = Math.max(
    local.totalActivitiesCompleted,
    remote.totalActivitiesCompleted ?? 0
  );

  return {
    userId: remote.userId ?? local.userId,
    subjectPoints,
    subjectActivities,
    totalActivitiesCompleted,
    earnedAchievementIds: Array.from(earnedSet),
    achievementEarnedAt,
  };
}

export async function syncSubjectActivity(
  client: SupabaseClient,
  userId: string,
  subjectId: string,
  state: GameStoreSlice
): Promise<void> {
  if (!isRemoteUserId(userId)) return;

  const points = state.subjectPoints[subjectId] ?? 0;
  const activities = state.subjectActivities[subjectId] ?? 0;
  const levelInfo = computeLevelInfo(
    Object.values(state.subjectPoints).reduce((a, b) => a + b, 0)
  );

  const { error: upErr } = await client.from("subject_progress").upsert(
    {
      user_id: userId,
      subject_id: subjectId,
      points,
      level: levelInfo.current,
      activities_completed: activities,
      last_activity: new Date().toISOString(),
    },
    { onConflict: "user_id,subject_id" }
  );

  if (upErr) console.error(upErr);
}

export async function logActivity(
  client: SupabaseClient,
  userId: string,
  subjectId: string,
  pointsEarned: number,
  activityType: string
): Promise<void> {
  if (!isRemoteUserId(userId)) return;

  const { error } = await client.from("activity_log").insert({
    user_id: userId,
    subject_id: subjectId,
    points_earned: pointsEarned,
    activity_type: activityType,
  });

  if (error) console.error(error);
}

export async function syncAchievementsToRemote(
  client: SupabaseClient,
  userId: string,
  earnedIds: string[]
): Promise<void> {
  if (!isRemoteUserId(userId) || earnedIds.length === 0) return;

  const rows = earnedIds.map((achievement_id) => ({
    user_id: userId,
    achievement_id,
  }));

  const { error } = await client.from("achievements").upsert(rows, {
    onConflict: "user_id,achievement_id",
  });

  if (error) console.error(error);
}
