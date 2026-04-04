"use client";

import Link from "next/link";
import { Presentation, Users, BookOpen } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { SUBJECTS } from "@/lib/subjects";

export default function TeacherDashboardPage() {
  return (
    <div className="space-y-6">
      <header className="space-y-2">
        <h1 className="text-4xl font-extrabold text-ufuq-text">وضع الفصل</h1>
        <p className="text-lg text-ufuq-muted">اختصارات سريعة لبدء الحصة مع الطلاب.</p>
      </header>

      <div className="grid gap-4 md:grid-cols-2">
        <Card className="rounded-card border-border/60 bg-white shadow-sm">
          <CardHeader className="flex flex-row items-center gap-3 space-y-0">
            <Presentation className="h-8 w-8 text-primary" aria-hidden />
            <CardTitle className="text-2xl">عرض المواد</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <p className="text-sm text-ufuq-muted">
              افتح لوحة الطالب على الشاشة الكبيرة لمشاركة الشبكة والأنشطة.
            </p>
            <Button asChild className="w-full" data-interactive="true">
              <Link href="/student">فتح واجهة الطالب</Link>
            </Button>
          </CardContent>
        </Card>
        <Card className="rounded-card border-border/60 bg-white shadow-sm">
          <CardHeader className="flex flex-row items-center gap-3 space-y-0">
            <Users className="h-8 w-8 text-secondary" aria-hidden />
            <CardTitle className="text-2xl">متابعة التقدم</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <p className="text-sm text-ufuq-muted">راجع الإنجازات والنقاط أثناء الحصة.</p>
            <Button asChild variant="secondary" className="w-full" data-interactive="true">
              <Link href="/student/badges">معرض الإنجازات</Link>
            </Button>
          </CardContent>
        </Card>
      </div>

      <Card className="rounded-card border-border/60 bg-white shadow-sm">
        <CardHeader className="flex flex-row items-center gap-3 space-y-0">
          <BookOpen className="h-8 w-8 text-primary" aria-hidden />
          <CardTitle className="text-2xl">المواد المتاحة</CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="grid gap-2 sm:grid-cols-2">
            {SUBJECTS.map((sub) => (
              <li key={sub.id}>
                <Link
                  href="/student"
                  className="flex items-center justify-between rounded-button border border-border/60 bg-ufuq-bg px-4 py-3 text-sm font-bold text-ufuq-text transition-colors hover:border-primary/40"
                >
                  <span>
                    {sub.icon} {sub.nameAr}
                  </span>
                  <span className="text-xs text-primary">عرض</span>
                </Link>
              </li>
            ))}
          </ul>
        </CardContent>
      </Card>
    </div>
  );
}
