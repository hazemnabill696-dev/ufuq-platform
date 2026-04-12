import { SUBJECTS } from "@/lib/subjects";

/** Placeholder target until per-subject curriculum is wired — used for % and «متبقي». */
export const SUBJECT_ACTIVITY_TARGET = 10;

/** Placeholder «مستوى داخل المادة» scale (1..SUBJECT_LEVEL_TOTAL). */
export const SUBJECT_LEVEL_TOTAL = 5;

export function subjectActivityProgress(activitiesCompleted: number) {
  const completed = Math.max(0, Math.floor(activitiesCompleted));
  const remaining = Math.max(0, SUBJECT_ACTIVITY_TARGET - completed);
  const pct =
    SUBJECT_ACTIVITY_TARGET <= 0
      ? 0
      : Math.min(100, Math.round((completed / SUBJECT_ACTIVITY_TARGET) * 100));
  return { completed, remaining, pct, target: SUBJECT_ACTIVITY_TARGET };
}

/** Rough in-subject level from points (placeholder until real lesson data exists). */
export function subjectLevelFromPoints(points: number): { current: number; total: number } {
  const p = Math.max(0, Math.floor(points));
  const step = 12;
  const raw = 1 + Math.floor(p / step);
  const current = Math.min(SUBJECT_LEVEL_TOTAL, Math.max(1, raw));
  return { current, total: SUBJECT_LEVEL_TOTAL };
}

export function computeLessonsPlaceholder(activitiesCompleted: number): {
  completed: number;
  remaining: number;
  total: number;
} {
  const total = 4;
  const completed = Math.min(total, Math.floor(Math.max(0, activitiesCompleted) / 3));
  const remaining = Math.max(0, total - completed);
  return { completed, remaining, total };
}

type NextStepInput = {
  subjectActivities: Record<string, number>;
  subjectPoints: Record<string, number>;
  totalPoints: number;
  streakCount: number;
};

export function computeNextStepMessage({
  subjectActivities,
  subjectPoints,
  totalPoints,
  streakCount,
}: NextStepInput): { headline: string; detail: string; hint?: string } {
  const firstNeedingActivities = SUBJECTS.find((s) => {
    const { remaining } = subjectActivityProgress(subjectActivities[s.id] ?? 0);
    return remaining > 0;
  });

  if (firstNeedingActivities) {
    const { remaining, completed, target } = subjectActivityProgress(
      subjectActivities[firstNeedingActivities.id] ?? 0
    );
    const pts = subjectPoints[firstNeedingActivities.id] ?? 0;
    const { current, total } = subjectLevelFromPoints(pts);
    return {
      headline: "واصل التعلّم في مادة واحدة على الأقل",
      detail: `في «${firstNeedingActivities.nameAr}» أُنجز ${completed} من ${target} أنشطة (${remaining} متبقية). مستواك التقديري داخل المادة: ${current} من ${total}.`,
      hint: "من الصفحة الرئيسية اضغط «ابدأ الآن» على المادة لإضافة أنشطة.",
    };
  }

  const lowPointSubject = SUBJECTS.map((s) => ({
    id: s.id,
    nameAr: s.nameAr,
    pts: subjectPoints[s.id] ?? 0,
  })).sort((a, b) => a.pts - b.pts)[0];

  if (lowPointSubject && lowPointSubject.pts < 50) {
    return {
      headline: "وسّع تقدّمك عبر المواد",
      detail: `تقدّمك في «${lowPointSubject.nameAr}» لا يزال منخفضاً نسبياً — جرّب المزيد من الأنشطة هناك لرفع النقاط وفتح إنجازات مثل «متكامل».`,
      hint: "راجع صفحة الإنجازات لمعرفة الشروط.",
    };
  }

  if (streakCount < 3) {
    return {
      headline: "حافظ على سلسلة الأيام",
      detail: `سلسلتك الحالية: ${streakCount} أيام. وصولك إلى 3 أيام متتالية يفتح إنجاز «متحمس».`,
      hint: "زر المنصة يومياً حتى لو لبضع دقائق.",
    };
  }

  if (totalPoints < 1000) {
    return {
      headline: "اقترب من إنجاز «ماسي»",
      detail: `مجموع نقاطك ${totalPoints} — الإنجاز يفتح عند 1000 نقطة إجمالية.`,
      hint: "نوّع بين المواد لرفع الإجمالي أسرع.",
    };
  }

  return {
    headline: "أحسنت! واصل الاستكشاف",
    detail: "أكملتَ أهداف الأنشطة الأساسية في جميع المواد. استمر في اللعب والمراجعة لترسيخ ما تعلّمته.",
    hint: "شارك تقدّمك مع ولي الأمر من لوحة المتابعة.",
  };
}
