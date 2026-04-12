"use client";

import { Sparkles } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";

type NextStepPanelProps = {
  headline: string;
  detail: string;
  hint?: string;
  className?: string;
};

export function NextStepPanel({ headline, detail, hint, className }: NextStepPanelProps) {
  return (
    <Card
      className={cn(
        "relative overflow-hidden rounded-card border-2 border-primary/35 bg-gradient-to-br from-primary/[0.07] via-white to-secondary/[0.06] shadow-md",
        className
      )}
    >
      <div
        className="pointer-events-none absolute -left-8 -top-8 h-32 w-32 rounded-full bg-primary/15 blur-2xl"
        aria-hidden
      />
      <div
        className="pointer-events-none absolute -bottom-10 -right-6 h-28 w-28 rounded-full bg-secondary/15 blur-2xl"
        aria-hidden
      />
      <CardContent className="relative space-y-3 p-6 sm:p-7">
        <div className="flex flex-wrap items-center gap-2">
          <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-primary/15 text-primary">
            <Sparkles className="h-6 w-6" aria-hidden />
          </span>
          <div>
            <p className="text-xs font-bold uppercase tracking-wide text-primary/90">الخطوة التالية</p>
            <h2 className="text-xl font-extrabold text-ufuq-text sm:text-2xl">{headline}</h2>
          </div>
        </div>
        <p className="text-base leading-relaxed text-ufuq-text">{detail}</p>
        {hint && (
          <p className="rounded-button border border-border/60 bg-white/80 px-4 py-3 text-sm font-medium text-ufuq-muted">
            {hint}
          </p>
        )}
      </CardContent>
    </Card>
  );
}
