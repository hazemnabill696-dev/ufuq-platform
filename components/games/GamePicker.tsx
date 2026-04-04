"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { getPlayedTodayIds } from "@/lib/games/storage";

export type GameMeta = { id: string; title: string; description: string };

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

type GamePickerProps = {
  subjectId: string;
  subjectTitle: string;
  games: GameMeta[];
  onSelect: (gameId: string) => void;
};

export function GamePicker({ subjectId, subjectTitle, games, onSelect }: GamePickerProps) {
  const [played, setPlayed] = useState<string[]>([]);

  const orderedGames = useMemo(() => shuffle(games), [games]);

  const refreshPlayed = useCallback(() => {
    setPlayed(getPlayedTodayIds(subjectId));
  }, [subjectId]);

  useEffect(() => {
    refreshPlayed();
  }, [refreshPlayed]);

  return (
    <div className="space-y-6" dir="rtl">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-extrabold text-ufuq-text md:text-4xl">{subjectTitle}</h1>
          <p className="mt-1 text-lg text-ufuq-muted">اختر لعبة للعب — بلا وقت محدد، ومساعدة متاحة دائماً.</p>
        </div>
        <Button variant="outline" className="min-h-12 font-bold" asChild data-interactive="true">
          <Link href="/student">العودة للمواد</Link>
        </Button>
      </div>
      <div className="grid grid-cols-1 gap-5 md:grid-cols-3">
        {orderedGames.map((g) => {
          const done = played.includes(g.id);
          return (
            <button
              key={g.id}
              type="button"
              onClick={() => onSelect(g.id)}
              className="flex min-h-[12rem] flex-col rounded-card border-2 border-border/60 bg-white p-6 text-right shadow-sm transition-shadow hover:border-primary/40 hover:shadow-md"
              data-interactive="true"
            >
              <span className="text-xl font-extrabold text-ufuq-text">{g.title}</span>
              <span className="mt-2 flex-1 text-lg text-ufuq-muted">{g.description}</span>
              {done ? (
                <span className="mt-4 inline-flex min-h-12 items-center justify-center rounded-button bg-success/15 text-base font-bold text-success">
                  تم اليوم ✓
                </span>
              ) : (
                <span className="mt-4 text-base font-semibold text-primary">ابدأ اللعب ←</span>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}
