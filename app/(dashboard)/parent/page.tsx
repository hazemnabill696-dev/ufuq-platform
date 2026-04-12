"use client";

import { useMemo } from "react";
import { TrendingUp, Flame, Award } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useGameStore } from "@/store/useGameStore";
import { computeLevelInfo, deriveAchievementList } from "@/lib/gamification-engine";
import { SUBJECTS } from "@/lib/subjects";
import { dashboardNavLabel } from "@/lib/dashboard-nav";

export default function ParentDashboardPage() {
  const subjectPoints = useGameStore((s) => s.subjectPoints);
  const streakCount = useGameStore((s) => s.streakCount);
  const earnedAchievementIds = useGameStore((s) => s.earnedAchievementIds);
  const achievementEarnedAt = useGameStore((s) => s.achievementEarnedAt);
  const recentlyEarnedIds = useGameStore((s) => s.recentlyEarnedIds);
  const totalActivities = useGameStore((s) => s.totalActivitiesCompleted);

  const totalPoints = useMemo(
    () => Object.values(subjectPoints).reduce((a, b) => a + b, 0),
    [subjectPoints]
  );
  const level = useMemo(() => computeLevelInfo(totalPoints), [totalPoints]);
  const achievements = useMemo(
    () => deriveAchievementList({ earnedAchievementIds, achievementEarnedAt, recentlyEarnedIds }),
    [earnedAchievementIds, achievementEarnedAt, recentlyEarnedIds]
  );
  const unlockedCount = achievements.filter((a) => a.unlocked).length;

  return (
    <div className="space-y-6">
      <header className="space-y-2">
        <h1 className="text-4xl font-extrabold text-ufuq-text">{dashboardNavLabel("/parent")}</h1>
        <p className="text-lg text-ufuq-muted">ملخص التقدم على هذا الجهاز (بيانات التعلم المحفوظة محلياً).</p>
      </header>

      <div className="grid gap-4 md:grid-cols-3">
        <Card className="rounded-card border-border/60 bg-white shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-semibold text-ufuq-muted">إجمالي النقاط</CardTitle>
            <TrendingUp className="h-5 w-5 text-primary" aria-hidden />
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-extrabold text-ufuq-text">{totalPoints}</p>
            <p className="text-xs text-ufuq-muted">المستوى: {level.title}</p>
          </CardContent>
        </Card>
        <Card className="rounded-card border-border/60 bg-white shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-semibold text-ufuq-muted">سلسلة الأيام</CardTitle>
            <Flame className="h-5 w-5 text-secondary" aria-hidden />
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-extrabold text-ufuq-text">{streakCount}</p>
            <p className="text-xs text-ufuq-muted">أيام نشاط متتالية</p>
          </CardContent>
        </Card>
        <Card className="rounded-card border-border/60 bg-white shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-semibold text-ufuq-muted">الإنجازات</CardTitle>
            <Award className="h-5 w-5 text-success" aria-hidden />
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-extrabold text-ufuq-text">
              {unlockedCount}/{achievements.length}
            </p>
            <p className="text-xs text-ufuq-muted">أنشطة مكتملة: {totalActivities}</p>
          </CardContent>
        </Card>
      </div>

      <Card className="rounded-card border-border/60 bg-white shadow-sm">
        <CardHeader>
          <CardTitle className="text-2xl">التوزيع حسب المادة</CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="space-y-3">
            {SUBJECTS.map((sub) => {
              const pts = subjectPoints[sub.id] ?? 0;
              return (
                <li
                  key={sub.id}
                  className="flex items-center justify-between rounded-button border border-border/60 px-4 py-3 text-sm font-semibold"
                >
                  <span>
                    {sub.icon} {sub.nameAr}
                  </span>
                  <span className="text-primary">{pts} نقطة</span>
                </li>
              );
            })}
          </ul>
        </CardContent>
      </Card>
    </div>
  );
}
