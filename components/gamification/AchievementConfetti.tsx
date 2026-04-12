"use client";

import { memo } from "react";

const COLORS = ["#6C63FF", "#FF6B6B", "#4ECDC4", "#FFD93D", "#A78BFA", "#FB923C", "#34D399"];

type AchievementConfettiProps = {
  active: boolean;
};

export const AchievementConfetti = memo(function AchievementConfetti({ active }: AchievementConfettiProps) {
  if (!active) return null;

  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden rounded-[inherit]" aria-hidden>
      {COLORS.map((bg, i) => (
        <span
          key={i}
          className="ufuq-confetti-twinkle absolute h-1.5 w-3 rounded-sm opacity-90"
          style={{
            left: `${8 + (i * 12) % 84}%`,
            top: `${4 + (i % 3) * 8}px`,
            backgroundColor: bg,
            animationDelay: `${i * 0.12}s`,
            transform: `rotate(${-20 + i * 8}deg)`,
          }}
        />
      ))}
      {COLORS.slice(0, 4).map((bg, i) => (
        <span
          key={`f-${i}`}
          className="ufuq-confetti-piece absolute h-2 w-2 rounded-[2px] opacity-70"
          style={{
            left: `${15 + i * 22}%`,
            top: `${-6 + i * 2}px`,
            backgroundColor: bg,
            animationDelay: `${0.15 + i * 0.1}s`,
          }}
        />
      ))}
    </div>
  );
});
