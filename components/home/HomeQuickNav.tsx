"use client";

import Link from "next/link";
import type { LucideIcon } from "lucide-react";
import {
  Award,
  GraduationCap,
  HeartHandshake,
  LogIn,
  Presentation,
  TrendingUp,
} from "lucide-react";
import { Card } from "@/components/ui/card";
import { DASHBOARD_NAV_LINKS } from "@/lib/dashboard-nav";
import { cn } from "@/lib/utils";

type Accent = "primary" | "secondary" | "success";

const QUICK_META: { description: string; Icon: LucideIcon; accent: Accent }[] = [
  {
    description: "ابدأ من هنا: موادك وأنشطتك اليومية في مكان واحد.",
    Icon: GraduationCap,
    accent: "primary",
  },
  {
    description: "شاهد نقاطك، مستواك، وسلسلة أيام التعلم.",
    Icon: TrendingUp,
    accent: "secondary",
  },
  {
    description: "اكتشف الشارات والإنجازات التي جمعتها.",
    Icon: Award,
    accent: "success",
  },
  {
    description: "ملخص بسيط لتقدم الطفل على هذا الجهاز.",
    Icon: HeartHandshake,
    accent: "primary",
  },
  {
    description: "تذكيرات واختصارات لعرض الحصة على الشاشة الكبيرة.",
    Icon: Presentation,
    accent: "secondary",
  },
  {
    description: "ادخل إلى حسابك عندما تكون جاهزاً.",
    Icon: LogIn,
    accent: "primary",
  },
];

if (QUICK_META.length !== DASHBOARD_NAV_LINKS.length) {
  throw new Error("HomeQuickNav: meta length must match DASHBOARD_NAV_LINKS");
}

const accentRing: Record<Accent, string> = {
  primary: "group-hover:border-primary/45 group-hover:bg-primary/[0.06]",
  secondary: "group-hover:border-secondary/45 group-hover:bg-secondary/[0.08]",
  success: "group-hover:border-success/45 group-hover:bg-success/[0.08]",
};

const accentIconBg: Record<Accent, string> = {
  primary: "bg-primary/15 text-primary",
  secondary: "bg-secondary/15 text-secondary",
  success: "bg-success/15 text-success",
};

export function HomeQuickNav() {
  return (
    <section className="space-y-4" aria-labelledby="quick-nav-heading">
      <div className="space-y-2">
        <h2 id="quick-nav-heading" className="text-3xl font-extrabold text-ufuq-text">
          انتقل بسرعة
        </h2>
        <p className="text-ufuq-muted">نفس روابط القائمة العلوية — بطاقات كبيرة وسهلة للأطفال.</p>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {DASHBOARD_NAV_LINKS.map((link, i) => {
          const { description, Icon, accent } = QUICK_META[i]!;
          return (
            <Link
              key={link.href}
              href={link.href}
              className={cn(
                "group block min-h-[7.5rem] rounded-card outline-none ring-offset-background focus-visible:ring-2 focus-visible:ring-ring",
                "max-w-full"
              )}
              data-interactive="true"
            >
              <Card
                className={cn(
                  "flex h-full min-h-[7.5rem] flex-col justify-center gap-3 rounded-card border border-border/60 bg-white p-5 shadow-sm transition-colors duration-200",
                  accentRing[accent]
                )}
              >
                <div className="flex items-start gap-4">
                  <span
                    className={cn(
                      "flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl [&>svg]:h-8 [&>svg]:w-8",
                      accentIconBg[accent]
                    )}
                    aria-hidden
                  >
                    <Icon strokeWidth={2.25} />
                  </span>
                  <div className="min-w-0 flex-1 space-y-1.5">
                    <h3 className="text-xl font-extrabold leading-tight text-ufuq-text">{link.label}</h3>
                    <p className="text-sm font-medium leading-snug text-ufuq-muted">{description}</p>
                  </div>
                </div>
              </Card>
            </Link>
          );
        })}
      </div>
    </section>
  );
}
