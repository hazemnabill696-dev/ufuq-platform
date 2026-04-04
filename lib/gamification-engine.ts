import type {
  Achievement,
  AchievementDefinition,
  GamificationEngine,
  LevelInfo,
} from "@/types";

const LEVEL_BANDS: {
  level: number;
  min: number;
  max: number;
  title: string;
  nextThreshold: number;
}[] = [
  { level: 1, min: 0, max: 100, title: "مبتدئ", nextThreshold: 101 },
  { level: 2, min: 101, max: 300, title: "مستكشف", nextThreshold: 301 },
  { level: 3, min: 301, max: 600, title: "متعلم", nextThreshold: 601 },
  { level: 4, min: 601, max: 1000, title: "نجم", nextThreshold: 1001 },
  { level: 5, min: 1001, max: Number.POSITIVE_INFINITY, title: "عبقري", nextThreshold: 1001 },
];

export const ACHIEVEMENT_DEFINITIONS: AchievementDefinition[] = [
  { id: "first_step", icon: "🌟", titleAr: "أول خطوة", descriptionAr: "أكمل أول نشاط" },
  { id: "motivated", icon: "🔥", titleAr: "متحمس", descriptionAr: "3 أيام متتالية" },
  { id: "diamond", icon: "💎", titleAr: "ماسي", descriptionAr: "1000 نقطة إجمالية" },
  { id: "math_hero", icon: "🏆", titleAr: "بطل الرياضيات", descriptionAr: "50 نقطة في الرياضيات" },
  { id: "avid_reader", icon: "📚", titleAr: "قارئ نهم", descriptionAr: "50 نقطة في اللغة العربية" },
  { id: "little_scientist", icon: "🔭", titleAr: "عالم صغير", descriptionAr: "50 نقطة في العلوم" },
  { id: "quick_wit", icon: "⚡", titleAr: "سريع البديهة", descriptionAr: "أجب على 10 أسئلة صحيحة" },
  { id: "well_rounded", icon: "🌈", titleAr: "متكامل", descriptionAr: "نقاط في جميع المواد" },
];

const ALL_SUBJECT_IDS = ["math", "arabic", "science", "english", "art", "quran"] as const;

export function computeLevelInfo(points: number): LevelInfo {
  const p = Math.max(0, Math.floor(points));
  let band = LEVEL_BANDS[0];
  for (const b of LEVEL_BANDS) {
    if (p >= b.min && p <= b.max) {
      band = b;
      break;
    }
    if (p > b.max) band = b;
  }

  if (band.level === 5) {
    return {
      current: 5,
      title: band.title,
      nextLevelPoints: band.nextThreshold,
      progressPercent: 100,
    };
  }

  const span = band.nextThreshold - band.min;
  const progress = span <= 0 ? 100 : Math.min(100, Math.round(((p - band.min) / span) * 100));
  return {
    current: band.level,
    title: band.title,
    nextLevelPoints: band.nextThreshold,
    progressPercent: progress,
  };
}

function todayLocalISO(): string {
  const d = new Date();
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

function isConsecutiveDay(prev: string | null, current: string): boolean {
  if (!prev) return false;
  const a = new Date(prev + "T12:00:00");
  const b = new Date(current + "T12:00:00");
  const diff = (b.getTime() - a.getTime()) / (1000 * 60 * 60 * 24);
  return diff === 1;
}

export type GameStoreSlice = {
  userId: string;
  subjectPoints: Record<string, number>;
  subjectActivities: Record<string, number>;
  totalActivitiesCompleted: number;
  correctAnswersTotal: number;
  earnedAchievementIds: string[];
  streakCount: number;
  lastStreakDate: string | null;
  achievementEarnedAt: Record<string, string>;
  recentlyEarnedIds: Record<string, number>;
};

export function deriveAchievementList(
  s: Pick<GameStoreSlice, "earnedAchievementIds" | "achievementEarnedAt" | "recentlyEarnedIds">
): Achievement[] {
  const recentCutoff = Date.now() - 48 * 60 * 60 * 1000;
  return ACHIEVEMENT_DEFINITIONS.map((def) => {
    const earned = s.earnedAchievementIds.includes(def.id);
    const earnedAt = s.achievementEarnedAt[def.id];
    const ts = s.recentlyEarnedIds[def.id];
    const recentlyEarned = earned && ts != null && ts >= recentCutoff;
    return {
      ...def,
      unlocked: earned,
      earnedAt,
      recentlyEarned,
    };
  });
}

export function createGamificationEngine(store: {
  getState: () => GameStoreSlice;
  setState: (fn: (s: GameStoreSlice) => Partial<GameStoreSlice> | void) => void;
}): GamificationEngine {
  return {
    addPoints(userId: string, subject: string, amount: number): void {
      const state = store.getState();
      if (state.userId !== userId) return;
      const pts = Math.max(0, Math.floor(amount));
      const prevPoints = state.subjectPoints[subject] ?? 0;
      const prevActs = state.subjectActivities[subject] ?? 0;
      store.setState((s) => ({
        subjectPoints: { ...s.subjectPoints, [subject]: prevPoints + pts },
        subjectActivities: { ...s.subjectActivities, [subject]: prevActs + 1 },
        totalActivitiesCompleted: s.totalActivitiesCompleted + 1,
      }));
    },

    getPoints(userId: string): number {
      const state = store.getState();
      if (state.userId !== userId) return 0;
      return Object.values(state.subjectPoints).reduce((a, b) => a + b, 0);
    },

    calculateLevel(points: number): LevelInfo {
      return computeLevelInfo(points);
    },

    checkAchievements(userId: string): Achievement[] {
      const s = store.getState();
      if (s.userId !== userId) return [];

      const totalPoints = Object.values(s.subjectPoints).reduce((a, b) => a + b, 0);
      const mathPts = s.subjectPoints.math ?? 0;
      const arabicPts = s.subjectPoints.arabic ?? 0;
      const sciencePts = s.subjectPoints.science ?? 0;
      const allSubjectsHavePoints = ALL_SUBJECT_IDS.every((id) => (s.subjectPoints[id] ?? 0) > 0);

      const unlocked = new Set(s.earnedAchievementIds);
      const now = new Date().toISOString();

      const shouldUnlock: Record<string, boolean> = {
        first_step: s.totalActivitiesCompleted >= 1,
        motivated: s.streakCount >= 3,
        diamond: totalPoints >= 1000,
        math_hero: mathPts >= 50,
        avid_reader: arabicPts >= 50,
        little_scientist: sciencePts >= 50,
        quick_wit: s.correctAnswersTotal >= 10,
        well_rounded: allSubjectsHavePoints,
      };

      const newEarned: string[] = [];
      for (const def of ACHIEVEMENT_DEFINITIONS) {
        if (!unlocked.has(def.id) && shouldUnlock[def.id]) {
          newEarned.push(def.id);
        }
      }

      if (newEarned.length > 0) {
        store.setState((st) => {
          const earnedAchievementIds = Array.from(new Set([...st.earnedAchievementIds, ...newEarned]));
          const achievementEarnedAt = { ...st.achievementEarnedAt };
          const recentlyEarnedIds = { ...st.recentlyEarnedIds };
          const ts = Date.now();
          for (const id of newEarned) {
            achievementEarnedAt[id] = now;
            recentlyEarnedIds[id] = ts;
          }
          return { earnedAchievementIds, achievementEarnedAt, recentlyEarnedIds };
        });
      }

      return deriveAchievementList(store.getState());
    },

    updateStreak(userId: string): number {
      const state = store.getState();
      if (state.userId !== userId) return 0;
      const today = todayLocalISO();
      const last = state.lastStreakDate;

      if (last === today) {
        return state.streakCount;
      }

      let nextCount: number;
      if (last == null) {
        nextCount = 1;
      } else if (isConsecutiveDay(last, today)) {
        nextCount = state.streakCount + 1;
      } else {
        nextCount = 1;
      }

      store.setState(() => ({
        lastStreakDate: today,
        streakCount: nextCount,
      }));

      return nextCount;
    },
  };
}
