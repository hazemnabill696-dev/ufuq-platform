"use client";

import { memo, useCallback } from "react";
import { Accessibility, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useUserStore } from "@/store/useUserStore";
import { cn } from "@/lib/utils";

export const LearningSupportToggle = memo(function LearningSupportToggle() {
  const learningSupport = useUserStore((s) => s.learningSupport);
  const toggle = useUserStore((s) => s.toggleLearningSupport);

  const onToggle = useCallback(() => {
    toggle();
  }, [toggle]);

  return (
    <Button
      type="button"
      variant={learningSupport ? "default" : "outline"}
      className={cn("gap-2", learningSupport && "bg-success text-white border-success hover:bg-success/90")}
      onClick={onToggle}
      data-interactive="true"
      aria-pressed={learningSupport}
    >
      <span className="inline-flex items-center gap-2" aria-hidden>
        <Accessibility className="h-5 w-5 shrink-0" />
        <Sparkles className="h-5 w-5 shrink-0" />
      </span>
      <span>وضع الدعم</span>
    </Button>
  );
});
