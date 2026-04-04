"use client";

import { memo, useCallback, useMemo } from "react";
import { useRouter } from "next/navigation";
import { motion, useReducedMotion } from "framer-motion";
import { BookOpenCheck } from "lucide-react";
import type { SubjectDefinition } from "@/types";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ProgressBar } from "@/components/gamification/ProgressBar";
import { LevelBadge } from "@/components/gamification/LevelBadge";
import { InfoTooltip } from "@/components/subjects/InfoTooltip";
import { useGameStore } from "@/store/useGameStore";
import { computeLevelInfo } from "@/lib/gamification-engine";
import { cn } from "@/lib/utils";
import { useMotionSafe } from "@/hooks/useMotionSafe";

function nextSubjectTarget(points: number): number {
  if (points <= 0) return 50;
  return Math.ceil(points / 50) * 50;
}

type SubjectCardProps = {
  subject: SubjectDefinition;
};

export const SubjectCard = memo(function SubjectCard({ subject }: SubjectCardProps) {
  const router = useRouter();
  const points = useGameStore((s) => s.subjectPoints[subject.id] ?? 0);
  const activities = useGameStore((s) => s.subjectActivities[subject.id] ?? 0);
  const totalPoints = useGameStore((s) =>
    Object.values(s.subjectPoints).reduce((a, b) => a + b, 0)
  );

  const { reduced, sec } = useMotionSafe();
  const systemReduced = useReducedMotion();
  const motionOff = reduced || systemReduced;

  const target = useMemo(() => nextSubjectTarget(points), [points]);
  const level = useMemo(() => computeLevelInfo(totalPoints), [totalPoints]);

  const onStart = useCallback(() => {
    router.push(`/student/play/${subject.id}`);
  }, [router, subject.id]);

  return (
    <motion.div
      whileHover={
        motionOff
          ? undefined
          : { y: -8, transition: { duration: sec(200), ease: "easeOut" } }
      }
      whileTap={motionOff ? undefined : { scale: 0.98 }}
      style={{ willChange: "transform" }}
      className="h-full"
    >
      <Card
        className={cn(
          "flex h-full flex-col overflow-hidden rounded-card border border-border/60 bg-ufuq-card shadow-md transition-shadow duration-200 hover:shadow-xl"
        )}
      >
        <div
          className={cn(
            "flex min-h-[7rem] items-center justify-center bg-gradient-to-br px-6 py-6 text-6xl",
            subject.color
          )}
          aria-hidden
        >
          <span className="drop-shadow-sm select-none" style={{ fontSize: "4rem", lineHeight: 1 }}>
            {subject.icon}
          </span>
        </div>
        <CardContent className="flex flex-1 flex-col gap-4 p-6">
          <div className="space-y-2">
            <h2 className="text-[1.375rem] font-extrabold leading-snug text-ufuq-text md:text-2xl">
              {subject.nameAr}
            </h2>
            <p className="text-sm font-medium text-ufuq-muted">{subject.description}</p>
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between gap-2 text-sm font-bold text-ufuq-text">
              <span>
                {points} / {target}
              </span>
              <span className="text-ufuq-muted">نقاط المادة</span>
            </div>
            <ProgressBar value={points} max={target} />
          </div>

          <div className="flex flex-wrap items-center justify-between gap-3">
            <LevelBadge level={level.current} title={level.title} />
            <span
              className={cn(
                "inline-flex items-center gap-2 rounded-full px-3 py-1 text-xs font-bold",
                subject.bgLight,
                "text-ufuq-text"
              )}
            >
              <BookOpenCheck className="h-4 w-4 shrink-0" aria-hidden />
              <span className="sr-only">عدد الأنشطة المكتملة</span>
              <span>{activities}</span>
              <span>نشاط</span>
            </span>
          </div>

          <div className="mt-auto flex flex-wrap items-center justify-between gap-3 border-t border-border/60 pt-4">
            <InfoTooltip label={subject.educationalGoal} />
            <Button
              type="button"
              className="min-h-12 min-w-[8.5rem] font-bold"
              onClick={onStart}
              data-interactive="true"
            >
              ابدأ الآن
            </Button>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
});
