"use client";

import { memo, useMemo } from "react";
import { useReducedMotion } from "framer-motion";
import { Lock } from "lucide-react";
import type { Achievement } from "@/types";
import { Card, CardContent } from "@/components/ui/card";
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

  const borderClass = useMemo(() => {
    if (locked) return "border-border/80";
    if (achievement.recentlyEarned) return "border-primary shadow-[0_0_0_2px_rgba(108,99,255,0.35)]";
    return "border-success/40";
  }, [achievement.recentlyEarned, locked]);

  return (
    <Card
      className={cn(
        "relative overflow-hidden rounded-card border-2 bg-ufuq-card p-0 transition-shadow duration-200",
        borderClass,
        locked && "grayscale",
        achievement.unlocked && achievement.recentlyEarned && !motionOff && "animate-glow"
      )}
    >
      <CardContent className="flex flex-col gap-3 p-6">
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-center gap-3">
            <span
              className={cn(
                "flex h-14 w-14 items-center justify-center rounded-2xl text-3xl",
                locked ? "bg-muted" : "bg-primary/10",
                achievement.unlocked && !motionOff && "animate-sparkle"
              )}
              aria-hidden
            >
              {achievement.icon}
            </span>
            <div>
              <h3 className="text-lg font-bold text-ufuq-text">{achievement.titleAr}</h3>
              <p className="text-sm text-ufuq-muted">{achievement.descriptionAr}</p>
            </div>
          </div>
          {locked ? (
            <span className="relative flex h-10 w-10 items-center justify-center rounded-full bg-black/40 text-white">
              <Lock className="h-5 w-5" aria-label="شارة مقفلة" />
            </span>
          ) : (
            <span className="text-xs font-semibold text-success">مفتوح</span>
          )}
        </div>
      </CardContent>
    </Card>
  );
});
