"use client";

import dynamic from "next/dynamic";
import { useMemo } from "react";
import { MapPin } from "lucide-react";
import { useGameStore } from "@/store/useGameStore";
import { computeLevelInfo } from "@/lib/gamification-engine";
import { ProgressBar } from "@/components/gamification/ProgressBar";
import { Button } from "@/components/ui/button";
import { SUBJECTS } from "@/lib/subjects";
import { computeNextStepMessage } from "@/lib/progress-subject-model";
import { NextStepPanel } from "@/components/progress/NextStepPanel";
import { SubjectProgressCard } from "@/components/progress/SubjectProgressCard";

const PointsCounter = dynamic(() =>
  import("@/components/gamification/PointsCounter").then((m) => ({ default: m.PointsCounter }))
);

const LevelBadge = dynamic(() =>
  import("@/components/gamification/LevelBadge").then((m) => ({ default: m.LevelBadge }))
);

export default function ProgressPage() {
  const recordCorrectAnswer = useGameStore((s) => s.recordCorrectAnswer);
  const subjectPoints = useGameStore((s) => s.subjectPoints);
  const subjectActivities = useGameStore((s) => s.subjectActivities);
  const streakCount = useGameStore((s) => s.streakCount);
  const correctAnswersTotal = useGameStore((s) => s.correctAnswersTotal);
  const totalPoints = useMemo(
    () => Object.values(subjectPoints).reduce((a, b) => a + b, 0),
    [subjectPoints]
  );
  const level = useMemo(() => computeLevelInfo(totalPoints), [totalPoints]);

  const nextStep = useMemo(
    () =>
      computeNextStepMessage({
        subjectActivities,
        subjectPoints,
        totalPoints,
        streakCount,
      }),
    [subjectActivities, subjectPoints, totalPoints, streakCount]
  );

  return (
    <div className="space-y-8">
      <header className="space-y-2 border-b border-border/50 pb-6">
        <p className="text-sm font-bold text-primary">مسار التعلّم</p>
        <h1 className="text-4xl font-extrabold text-ufuq-text">لوحة التقدم</h1>
        <p className="flex flex-wrap items-center gap-2 text-lg text-ufuq-muted">
          <MapPin className="h-5 w-5 shrink-0 text-secondary" aria-hidden />
          أين أنت الآن، وما الذي يلي في كل مادة.
        </p>
      </header>

      <section className="grid gap-4 rounded-card border border-border/60 bg-white p-5 shadow-sm sm:grid-cols-3 sm:gap-6 sm:p-6">
        <div className="space-y-2">
          <p className="text-sm font-semibold text-ufuq-muted">إجمالي النقاط</p>
          <PointsCounter points={totalPoints} className="text-2xl" />
        </div>
        <div className="space-y-2">
          <p className="text-sm font-semibold text-ufuq-muted">المستوى العام</p>
          <LevelBadge level={level.current} title={level.title} className="text-base" />
        </div>
        <div className="space-y-2">
          <p className="text-sm font-semibold text-ufuq-muted">سلسلة الأيام</p>
          <p className="text-3xl font-extrabold text-secondary">{streakCount}</p>
          <p className="text-sm text-ufuq-muted">أيام نشاط متتالية</p>
        </div>
      </section>

      <NextStepPanel headline={nextStep.headline} detail={nextStep.detail} hint={nextStep.hint} />

      <section className="space-y-4">
        <div className="space-y-1">
          <h2 className="text-2xl font-extrabold text-ufuq-text">التقدّم في كل مادة</h2>
          <p className="text-sm text-ufuq-muted">
            نسبة مئوية وأنشطة مقارنة بهدف مؤقت لكل مادة؛ الدروس والمستوى الداخلي تقدير حتى ربط المنهج الفعلي.
          </p>
        </div>
        <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">
          {SUBJECTS.map((sub) => (
            <SubjectProgressCard
              key={sub.id}
              subject={sub}
              activitiesCompleted={subjectActivities[sub.id] ?? 0}
              points={subjectPoints[sub.id] ?? 0}
            />
          ))}
        </div>
      </section>

      <section className="rounded-card border border-border/60 bg-white p-6 shadow-sm">
        <h2 className="text-2xl font-bold text-ufuq-text">التقدّم نحو المستوى العام التالي</h2>
        <p className="mt-1 text-sm text-ufuq-muted">{level.progressPercent}% مكتمل على مستوى المنصّة</p>
        <div className="mt-4">
          <ProgressBar value={level.progressPercent} max={100} />
        </div>
      </section>

      <section className="rounded-card border border-border/60 bg-white p-6 shadow-sm">
        <h2 className="text-2xl font-bold text-ufuq-text">تسجيل إجابة صحيحة</h2>
        <p className="mt-1 text-ufuq-muted">
          عند إكمال أسئلة تفاعلية في الصف أو المنزل، سجّل إجابة صحيحة واحدة لتحديث إنجاز «سريع البديهة».
        </p>
        <p className="mt-2 text-sm font-semibold text-ufuq-text">
          إجابات صحيحة مسجّلة: {correctAnswersTotal}
        </p>
        <Button type="button" className="mt-4" onClick={() => recordCorrectAnswer()} data-interactive="true">
          تسجيل إجابة صحيحة
        </Button>
      </section>
    </div>
  );
}
