"use client";

import dynamic from "next/dynamic";
import { useMemo } from "react";
import { useGameStore } from "@/store/useGameStore";
import { computeLevelInfo } from "@/lib/gamification-engine";
import { ProgressBar } from "@/components/gamification/ProgressBar";
import { Button } from "@/components/ui/button";
import { SUBJECTS } from "@/lib/subjects";

const PointsCounter = dynamic(() =>
  import("@/components/gamification/PointsCounter").then((m) => ({ default: m.PointsCounter }))
);

const LevelBadge = dynamic(() =>
  import("@/components/gamification/LevelBadge").then((m) => ({ default: m.LevelBadge }))
);

export default function ProgressPage() {
  const recordCorrectAnswer = useGameStore((s) => s.recordCorrectAnswer);
  const subjectPoints = useGameStore((s) => s.subjectPoints);
  const streakCount = useGameStore((s) => s.streakCount);
  const correctAnswersTotal = useGameStore((s) => s.correctAnswersTotal);
  const totalPoints = useMemo(
    () => Object.values(subjectPoints).reduce((a, b) => a + b, 0),
    [subjectPoints]
  );
  const level = useMemo(() => computeLevelInfo(totalPoints), [totalPoints]);

  return (
    <div className="space-y-8">
      <header className="space-y-2">
        <h1 className="text-4xl font-extrabold text-ufuq-text">لوحة التقدم</h1>
        <p className="text-lg text-ufuq-muted">تابع نقاطك، مستواك، وسلسلة الأيام النشطة.</p>
      </header>

      <section className="grid gap-6 rounded-card border border-border/60 bg-white p-6 shadow-sm md:grid-cols-3">
        <div className="space-y-2">
          <p className="text-sm font-semibold text-ufuq-muted">إجمالي النقاط</p>
          <PointsCounter points={totalPoints} className="text-2xl" />
        </div>
        <div className="space-y-2">
          <p className="text-sm font-semibold text-ufuq-muted">المستوى الحالي</p>
          <LevelBadge level={level.current} title={level.title} className="text-base" />
        </div>
        <div className="space-y-2">
          <p className="text-sm font-semibold text-ufuq-muted">سلسلة الأيام</p>
          <p className="text-3xl font-extrabold text-secondary">{streakCount}</p>
          <p className="text-sm text-ufuq-muted">أيام نشاط متتالية</p>
        </div>
      </section>

      <section className="rounded-card border border-border/60 bg-white p-6 shadow-sm">
        <h2 className="text-2xl font-bold text-ufuq-text">التقدم نحو المستوى التالي</h2>
        <p className="mt-1 text-sm text-ufuq-muted">{level.progressPercent}% مكتمل</p>
        <div className="mt-4">
          <ProgressBar value={level.progressPercent} max={100} />
        </div>
      </section>

      <section className="rounded-card border border-border/60 bg-white p-6 shadow-sm">
        <h2 className="text-2xl font-bold text-ufuq-text">نقاط المواد</h2>
        <ul className="mt-4 space-y-3">
          {SUBJECTS.map((sub) => {
            const pts = subjectPoints[sub.id] ?? 0;
            return (
              <li key={sub.id} className="flex items-center justify-between gap-4 text-sm font-semibold">
                <span>
                  {sub.icon} {sub.nameAr}
                </span>
                <span className="text-primary">{pts} نقطة</span>
              </li>
            );
          })}
        </ul>
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
