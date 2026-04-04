"use client";

import { memo } from "react";
import { cn } from "@/lib/utils";

type LevelBadgeProps = {
  title: string;
  level: number;
  className?: string;
};

export const LevelBadge = memo(function LevelBadge({ title, level, className }: LevelBadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 rounded-full bg-primary/10 px-3 py-1 text-sm font-bold text-primary",
        className
      )}
    >
      <span className="text-xs text-ufuq-muted" aria-hidden>
        المستوى {level}
      </span>
      <span>{title}</span>
    </span>
  );
});
