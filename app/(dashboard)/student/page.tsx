"use client";

import dynamic from "next/dynamic";
import { useEffect, useMemo } from "react";
import { useGameStore } from "@/store/useGameStore";
import { computeLevelInfo } from "@/lib/gamification-engine";
import { ProgressBar } from "@/components/gamification/ProgressBar";
import { LevelBadge } from "@/components/gamification/LevelBadge";

const SubjectGrid = dynamic(
  () => import("@/components/subjects/SubjectGrid").then((m) => ({ default: m.SubjectGrid })),
  { loading: () => <div className="h-[28rem] animate-pulse rounded-card bg-muted/50" aria-hidden /> }
);

const LearningSupportToggle = dynamic(() =>
  import("@/components/accessibility/LearningSupportToggle").then((m) => ({ default: m.LearningSupportToggle }))
);

const PointsCounter = dynamic(() =>
  import("@/components/gamification/PointsCounter").then((m) => ({ default: m.PointsCounter }))
);

export default function StudentHomePage() {
  const touchStreak = useGameStore((s) => s.touchStreak);
  const syncAchievements = useGameStore((s) => s.syncAchievements);
  const totalPoints = useGameStore((s) =>
    Object.values(s.subjectPoints).reduce((a, b) => a + b, 0)
  );
  const level = useMemo(() => computeLevelInfo(totalPoints), [totalPoints]);

  useEffect(() => {
    touchStreak();
    syncAchievements();
  }, [touchStreak, syncAchievements]);

  return (
    <div className="space-y-8">
      <section className="rounded-card border border-border/60 bg-white p-6 shadow-sm">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
          <div className="space-y-3">
            <p className="text-sm font-semibold text-primary">مرحباً بك في</p>
            <h1 className="text-4xl font-extrabold text-ufuq-text md:text-5xl">أُفُق</h1>
            <p className="max-w-xl text-lg text-ufuq-muted">
              اختر مادتك المفضلة وابدأ رحلتك التعليمية الممتعة مع أنشطة تفاعلية ونقاط وإنجازات.
            </p>
          </div>
          <div className="flex flex-col items-stretch gap-4 sm:flex-row sm:items-center">
            <PointsCounter points={totalPoints} />
            <LearningSupportToggle />
          </div>
        </div>
        <div className="mt-6 space-y-2">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <LevelBadge level={level.current} title={level.title} />
            <span className="text-sm font-semibold text-ufuq-muted">
              التقدم نحو المستوى التالي ({level.progressPercent}%)
            </span>
          </div>
          <ProgressBar value={level.progressPercent} max={100} />
        </div>
      </section>

      <section className="space-y-4">
        <div className="flex flex-col gap-2 md:flex-row md:items-end md:justify-between">
          <div>
            <h2 className="text-3xl font-extrabold text-ufuq-text">المواد الدراسية</h2>
            <p className="text-ufuq-muted">اضغط على «ابدأ الآن» لتسجيل تقدمك وكسب النقاط.</p>
          </div>
        </div>
        <SubjectGrid />
      </section>
    </div>
  );
}
