"use client";

import dynamic from "next/dynamic";
import { useMemo, useEffect } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { Award, Sparkles } from "lucide-react";
import { deriveAchievementList } from "@/lib/gamification-engine";
import { useGameStore } from "@/store/useGameStore";
import { useMotionSafe } from "@/hooks/useMotionSafe";

const AchievementCard = dynamic(() =>
  import("@/components/gamification/AchievementCard").then((m) => ({ default: m.AchievementCard }))
);

export default function BadgesPage() {
  const { reduced, sec } = useMotionSafe();
  const systemReduced = useReducedMotion();
  const motionOff = reduced || systemReduced;
  const syncAchievements = useGameStore((s) => s.syncAchievements);
  const earnedAchievementIds = useGameStore((s) => s.earnedAchievementIds);
  const achievementEarnedAt = useGameStore((s) => s.achievementEarnedAt);
  const recentlyEarnedIds = useGameStore((s) => s.recentlyEarnedIds);

  const achievements = useMemo(
    () =>
      deriveAchievementList({
        earnedAchievementIds,
        achievementEarnedAt,
        recentlyEarnedIds,
      }),
    [earnedAchievementIds, achievementEarnedAt, recentlyEarnedIds]
  );

  const sorted = useMemo(() => {
    return [...achievements].sort((a, b) => {
      if (a.unlocked !== b.unlocked) return a.unlocked ? -1 : 1;
      if (a.unlocked && b.unlocked && a.recentlyEarned !== b.recentlyEarned) {
        return a.recentlyEarned ? -1 : b.recentlyEarned ? 1 : 0;
      }
      return 0;
    });
  }, [achievements]);

  const unlockedCount = useMemo(() => achievements.filter((a) => a.unlocked).length, [achievements]);

  useEffect(() => {
    syncAchievements();
  }, [syncAchievements]);

  return (
    <div className="space-y-8">
      <header className="overflow-hidden rounded-2xl border border-amber-200/80 bg-gradient-to-br from-amber-50 via-white to-orange-50/60 px-5 py-7 shadow-sm sm:px-8">
        <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex flex-wrap items-start gap-4">
            <span className="flex h-16 w-16 items-center justify-center rounded-2xl bg-amber-400/25 text-amber-700 shadow-inner">
              <Award className="h-9 w-9" aria-hidden />
            </span>
            <div className="space-y-2">
              <p className="text-sm font-bold text-amber-800/90">مكافآت وشهادات</p>
              <h1 className="text-4xl font-extrabold text-ufuq-text">معرض الإنجازات</h1>
              <p className="max-w-xl text-lg text-ufuq-muted">
                ركّز على ما كسبته: شارات مفتوحة بتاريخ، وشارات مقفلة بانتظارك — مع لمسة احتفال خفيفة عند الفتح.
              </p>
            </div>
          </div>
          <div className="flex shrink-0 flex-col items-stretch gap-2 rounded-xl border border-amber-200/60 bg-white/90 px-5 py-4 text-center shadow-sm sm:min-w-[11rem]">
            <span className="flex items-center justify-center gap-2 text-sm font-bold text-ufuq-muted">
              <Sparkles className="h-4 w-4 text-amber-500" aria-hidden />
              الشارات المفتوحة
            </span>
            <p className="text-3xl font-black tabular-nums text-amber-700">
              {unlockedCount}
              <span className="text-lg font-bold text-ufuq-muted"> / {achievements.length}</span>
            </p>
          </div>
        </div>
      </header>

      <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
        <AnimatePresence mode="popLayout">
          {sorted.map((a) => (
            <motion.div
              key={a.id}
              layout
              initial={motionOff ? false : { y: 10 }}
              animate={motionOff ? undefined : { y: 0 }}
              exit={motionOff ? undefined : { y: 8 }}
              transition={{ duration: sec(260), ease: "easeOut" }}
              style={{ willChange: "transform" }}
            >
              <AchievementCard achievement={a} />
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </div>
  );
}
