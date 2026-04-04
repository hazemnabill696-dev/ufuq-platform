"use client";

import { useReducedMotion } from "framer-motion";
import { useUserStore } from "@/store/useUserStore";

export function useMotionSafe() {
  const prefersReduced = useReducedMotion();
  const learningSupport = useUserStore((s) => s.learningSupport);

  const reduced = Boolean(prefersReduced);
  const slowFactor = learningSupport ? 2 : 1;

  const ms = (base: number) => {
    if (reduced) return 0;
    return Math.min(300, Math.round(base * slowFactor));
  };

  const sec = (base: number) => ms(base) / 1000;

  return { reduced, learningSupport, ms, sec };
}
