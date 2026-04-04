"use client";

import { memo, useMemo } from "react";
import { cn } from "@/lib/utils";

type ProgressBarProps = {
  value: number;
  max: number;
  className?: string;
  trackClassName?: string;
  barClassName?: string;
};

export const ProgressBar = memo(function ProgressBar({
  value,
  max,
  className,
  trackClassName,
  barClassName,
}: ProgressBarProps) {
  const pct = useMemo(() => {
    if (max <= 0) return 0;
    return Math.min(100, Math.round((value / max) * 100));
  }, [value, max]);

  return (
    <div
      className={cn("relative h-3 w-full overflow-hidden rounded-full bg-muted", className)}
      role="progressbar"
      aria-valuenow={value}
      aria-valuemin={0}
      aria-valuemax={max}
    >
      <div className="progress-rtl absolute inset-0" aria-hidden>
        <div
          className={cn(
            "h-full rounded-full bg-gradient-to-l from-primary to-secondary transition-[width] duration-500 ease-out will-change-transform",
            barClassName
          )}
          style={{ width: `${pct}%` }}
        />
      </div>
    </div>
  );
});
