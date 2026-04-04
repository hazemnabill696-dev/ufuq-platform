"use client";

import dynamic from "next/dynamic";
import { useMemo, useEffect } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
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

  useEffect(() => {
    syncAchievements();
  }, [syncAchievements]);

  return (
    <div className="space-y-6">
      <header className="space-y-2">
        <h1 className="text-4xl font-extrabold text-ufuq-text">معرض الإنجازات</h1>
        <p className="text-lg text-ufuq-muted">
          اجمع الشارات بالتعلم اليومي، وحافظ على سلسلة أيامك، وتفوق في المواد المختلفة.
        </p>
      </header>
      <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
        <AnimatePresence mode="popLayout">
          {achievements.map((a) => (
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
