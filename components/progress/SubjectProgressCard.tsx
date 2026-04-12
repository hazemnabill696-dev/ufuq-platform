"use client";

import { memo, useMemo } from "react";
import type { SubjectDefinition } from "@/types";
import { ProgressBar } from "@/components/gamification/ProgressBar";
import {
  computeLessonsPlaceholder,
  subjectActivityProgress,
  subjectLevelFromPoints,
} from "@/lib/progress-subject-model";
import { cn } from "@/lib/utils";

type SubjectProgressCardProps = {
  subject: SubjectDefinition;
  activitiesCompleted: number;
  points: number;
};

export const SubjectProgressCard = memo(function SubjectProgressCard({
  subject,
  activitiesCompleted,
  points,
}: SubjectProgressCardProps) {
  const act = useMemo(() => subjectActivityProgress(activitiesCompleted), [activitiesCompleted]);
  const levels = useMemo(() => subjectLevelFromPoints(points), [points]);
  const lessons = useMemo(() => computeLessonsPlaceholder(activitiesCompleted), [activitiesCompleted]);

  return (
    <article
      className="flex flex-col gap-4 rounded-card border border-border/60 bg-white p-5 shadow-sm transition-shadow hover:shadow-md"
    >
      <div className="flex items-center gap-3">
        <span
          className={cn(
            "flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl text-3xl shadow-inner",
            subject.bgLight
          )}
          aria-hidden
        >
          {subject.icon}
        </span>
        <div className="min-w-0 flex-1">
          <h3 className="text-lg font-extrabold text-ufuq-text">{subject.nameAr}</h3>
          <p className="text-sm text-ufuq-muted">{subject.description}</p>
        </div>
        <span className="shrink-0 text-lg font-black tabular-nums text-primary">{act.pct}%</span>
      </div>

      <div className="space-y-1.5">
        <div className="flex flex-wrap items-center justify-between gap-2 text-xs font-semibold text-ufuq-muted">
          <span>تقدّم الأنشطة في المادة</span>
          <span className="tabular-nums text-ufuq-text">
            {act.completed} / {act.target}
          </span>
        </div>
        <ProgressBar value={act.completed} max={act.target} />
      </div>

      <dl className="grid grid-cols-1 gap-3 border-t border-border/50 pt-4 text-sm sm:grid-cols-2">
        <div className="rounded-lg bg-ufuq-bg/80 px-3 py-2.5">
          <dt className="text-xs font-bold text-ufuq-muted">أنشطة</dt>
          <dd className="font-semibold text-ufuq-text">
            مكتمل: {act.completed} · متبقٍّ: {act.remaining}
          </dd>
        </div>
        <div className="rounded-lg bg-ufuq-bg/80 px-3 py-2.5">
          <dt className="text-xs font-bold text-ufuq-muted">دروس (تقدير)</dt>
          <dd className="font-semibold text-ufuq-text">
            مكتمل: {lessons.completed} / {lessons.total} · متبقٍّ: {lessons.remaining}
          </dd>
        </div>
        <div className="rounded-lg bg-ufuq-bg/80 px-3 py-2.5 sm:col-span-2">
          <dt className="text-xs font-bold text-ufuq-muted">مستوى داخل المادة (تقدير)</dt>
          <dd className="font-semibold text-ufuq-text">
            {levels.current} / {levels.total} — يعتمد على نقاط المادة حتى ربط الدروس الفعلية.
          </dd>
        </div>
      </dl>
    </article>
  );
});
