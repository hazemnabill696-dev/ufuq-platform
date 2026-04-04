"use client";

import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import { createGamificationEngine, type GameStoreSlice } from "@/lib/gamification-engine";
import { mergeGameState } from "@/lib/sync/supabase-game-sync";
import { scheduleSyncAchievements, scheduleSyncAfterAddPoints } from "@/lib/sync/schedule-game-sync";

const LOCAL_USER_ID = "local-student-1";

type GameState = GameStoreSlice & {
  setUserId: (userId: string) => void;
  mergeFromRemote: (remote: Partial<GameStoreSlice>) => void;
  addPoints: (subject: string, amount: number) => void;
  recordCorrectAnswer: () => void;
  touchStreak: () => void;
  getTotalPoints: () => number;
  getSubjectPoints: (subjectId: string) => number;
  getSubjectActivities: (subjectId: string) => number;
  syncAchievements: () => void;
};

const initialSlice: GameStoreSlice = {
  userId: LOCAL_USER_ID,
  subjectPoints: {},
  subjectActivities: {},
  totalActivitiesCompleted: 0,
  correctAnswersTotal: 0,
  earnedAchievementIds: [],
  streakCount: 0,
  lastStreakDate: null,
  achievementEarnedAt: {},
  recentlyEarnedIds: {},
};

export const useGameStore = create<GameState>()(
  persist(
    (set, get) => {
      const engine = createGamificationEngine({
        getState: () => get() as GameStoreSlice,
        setState: (fn) => set(fn as (s: GameState) => Partial<GameState>),
      });

      return {
        ...initialSlice,

        setUserId: (userId: string) => set({ userId }),

        mergeFromRemote: (remote: Partial<GameStoreSlice>) => {
          set((s) => {
            const base = s as GameStoreSlice;
            const merged = mergeGameState(base, remote);
            return { ...s, ...merged };
          });
        },

        addPoints: (subject: string, amount: number) => {
          const uid = get().userId;
          engine.addPoints(uid, subject, amount);
          engine.updateStreak(uid);
          engine.checkAchievements(uid);
          const st = get() as GameStoreSlice;
          scheduleSyncAfterAddPoints(st.userId, subject, amount, st);
        },

        recordCorrectAnswer: () => {
          const uid = get().userId;
          set((s) => ({
            correctAnswersTotal: s.correctAnswersTotal + 1,
          }));
          engine.updateStreak(uid);
          engine.checkAchievements(uid);
          scheduleSyncAchievements(uid, get() as GameStoreSlice);
        },

        touchStreak: () => {
          engine.updateStreak(get().userId);
        },

        getTotalPoints: () => engine.getPoints(get().userId),

        getSubjectPoints: (subjectId: string) => get().subjectPoints[subjectId] ?? 0,

        getSubjectActivities: (subjectId: string) => get().subjectActivities[subjectId] ?? 0,

        syncAchievements: () => {
          engine.checkAchievements(get().userId);
        },
      };
    },
    {
      name: "ufuq-game-store",
      storage: createJSONStorage(() => localStorage),
      partialize: (s) => ({
        userId: s.userId,
        subjectPoints: s.subjectPoints,
        subjectActivities: s.subjectActivities,
        totalActivitiesCompleted: s.totalActivitiesCompleted,
        correctAnswersTotal: s.correctAnswersTotal,
        earnedAchievementIds: s.earnedAchievementIds,
        streakCount: s.streakCount,
        lastStreakDate: s.lastStreakDate,
        achievementEarnedAt: s.achievementEarnedAt,
        recentlyEarnedIds: s.recentlyEarnedIds,
      }),
    }
  )
);

export { LOCAL_USER_ID };
