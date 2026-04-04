"use client";

import { useEffect } from "react";
import { useUserStore } from "@/store/useUserStore";

export function LearningSupportProvider({ children }: { children: React.ReactNode }) {
  const learningSupport = useUserStore((s) => s.learningSupport);

  useEffect(() => {
    const root = document.documentElement;
    if (learningSupport) {
      root.classList.add("learning-support");
    } else {
      root.classList.remove("learning-support");
    }
  }, [learningSupport]);

  return <>{children}</>;
}
