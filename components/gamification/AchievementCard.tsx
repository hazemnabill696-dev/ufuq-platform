"use client";

import { memo, useMemo } from "react";
import { useReducedMotion } from "framer-motion";
import { Lock, Medal, Trophy } from "lucide-react";
import type { Achievement } from "@/types";
import { AchievementConfetti } from "@/components/gamification/AchievementConfetti";
import { Card, CardContent } from "@/components/ui/card";
import { formatArabicDate } from "@/lib/format-ar";
import { cn } from "@/lib/utils";
import { useMotionSafe } from "@/hooks/useMotionSafe";

type AchievementCardProps = {
  achievement: Achievement;
};

export const AchievementCard = memo(function AchievementCard({ achievement }: AchievementCardProps) {
  const { reduced } = useMotionSafe();
  const systemReduced = useReducedMotion();

  const locked = !achievement.unlocked;
  const motionOff = reduced || systemReduced;
  const celebrate = achievement.unlocked && !motionOff;

  const borderClass = useMemo(() => {
    if (locked) return "border-border/80 border-2";
    if (achievement.recentlyEarned) return "border-amber-400/90 border-2 shadow-[0_0_0_1px_rgba(251,191,36,0.35)]";
    return "border-emerald-400/55 border-2";
  }, [achievement.recentlyEarned, locked]);

  const earnedLabel = useMemo(() => {
    if (locked) return null;
    const d = formatArabicDate(achievement.earnedAt, "");
    return d || null;
  }, [achievement.earnedAt, locked]);

  return (
    <Card
      className={cn(
        "relative overflow-hidden rounded-card bg-ufuq-card p-0 transition-shadow duration-200",
        borderClass,
        locked && "opacity-[0.92] grayscale",
        achievement.unlocked && achievement.recentlyEarned && !motionOff && "animate-glow"
      )}
    >
      {celebrate && <AchievementConfetti active />}
      {achievement.unlocked && (
        <div
          className="pointer-events-none absolute inset-0 overflow-hidden rounded-[inherit] opacity-40"
          aria-hidden
        >
          <div
            className={cn(
              "absolute -left-1/2 top-0 h-full w-1/2 bg-gradient-to-r from-transparent via-white to-transparent",
              !motionOff && "ufuq-achievement-shine"
            )}
          />
        </div>
      )}

      <CardContent className="relative flex flex-col gap-4 p-6">
        <div className="flex items-start justify-between gap-3">
          <div className="flex min-w-0 flex-1 items-start gap-3">
            <span
              className={cn(
                "relative flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl text-3xl shadow-inner",
                locked ? "bg-muted text-ufuq-muted" : "bg-gradient-to-br from-amber-100 to-amber-50 text-3xl",
                achievement.unlocked && !motionOff && "animate-sparkle"
              )}
              aria-hidden
            >
              {achievement.unlocked ? (
                <>
                  <Trophy className="absolute -right-1 -top-1 h-6 w-6 text-amber-500 drop-shadow" aria-hidden />
                  <span>{achievement.icon}</span>
                </>
              ) : (
                <>
                  <Medal className="absolute inset-0 m-auto h-10 w-10 text-muted-foreground/25" aria-hidden />
                  <span className="relative opacity-40">{achievement.icon}</span>
                </>
              )}
            </span>
            <div className="min-w-0 space-y-1">
              <h3 className={cn("text-lg font-bold", locked ? "text-ufuq-muted" : "text-ufuq-text")}>
                {achievement.titleAr}
              </h3>
              <p className="text-sm text-ufuq-muted">{achievement.descriptionAr}</p>
            </div>
          </div>

          {locked ? (
            <span className="flex shrink-0 flex-col items-center gap-1 rounded-xl bg-black/50 px-2 py-1.5 text-white">
              <Lock className="h-5 w-5" aria-hidden />
              <span className="text-[10px] font-bold">مقفل</span>
            </span>
          ) : (
            <span className="flex shrink-0 items-center gap-1 rounded-full bg-emerald-500/15 px-3 py-1 text-xs font-bold text-emerald-800">
              مفتوح
            </span>
          )}
        </div>

        <div
          className={cn(
            "flex flex-wrap items-center justify-between gap-2 border-t border-border/50 pt-3 text-sm",
            locked ? "text-ufuq-muted" : "text-ufuq-text"
          )}
        >
          <span className="font-semibold">تاريخ الإنجاز</span>
          {locked ? (
            <span className="rounded-md bg-muted px-2 py-1 text-xs font-medium">غير متاح حتى الفتح</span>
          ) : earnedLabel ? (
            <time className="font-bold tabular-nums text-primary" dateTime={achievement.earnedAt}>
              {earnedLabel}
            </time>
          ) : (
            <span className="rounded-md bg-muted/80 px-2 py-1 text-xs font-medium text-ufuq-muted">
              سيُعرض التاريخ عند توفره
            </span>
          )}
        </div>
      </CardContent>
    </Card>
  );
});
