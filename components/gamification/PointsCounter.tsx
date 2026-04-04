"use client";

import { memo } from "react";
import { Star } from "lucide-react";
import { cn } from "@/lib/utils";

type PointsCounterProps = {
  points: number;
  className?: string;
};

export const PointsCounter = memo(function PointsCounter({ points, className }: PointsCounterProps) {
  return (
    <div className={cn("inline-flex items-center gap-2 font-bold text-ufuq-text", className)}>
      <Star className="h-5 w-5 text-warning shrink-0" aria-hidden />
      <span className="sr-only">إجمالي النقاط</span>
      <span aria-live="polite">{points}</span>
      <span className="text-sm font-semibold text-ufuq-muted">نقطة</span>
    </div>
  );
});
