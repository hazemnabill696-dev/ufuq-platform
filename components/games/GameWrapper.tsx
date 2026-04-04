"use client";

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { useGameStore } from "@/store/useGameStore";
import { markGamePlayedToday } from "@/lib/games/storage";

export type FinishPayload = {
  correct: number;
  total: number;
  rawPoints: number;
};

type Ctx = { finishGame: (p: FinishPayload) => void };

const GameSessionContext = createContext<Ctx | null>(null);

export function useFinishGame(): (p: FinishPayload) => void {
  const ctx = useContext(GameSessionContext);
  if (!ctx) throw new Error("useFinishGame must be used inside GameWrapper");
  return ctx.finishGame;
}

type SummaryState = FinishPayload & {
  awarded: number;
  passed: boolean;
  rate: number;
};

type GameWrapperProps = {
  subjectId: string;
  gameId: string;
  title: string;
  hint: string;
  onBack: () => void;
  children: ReactNode;
};

function Confetti() {
  const pieces = useMemo(
    () =>
      Array.from({ length: 24 }, (_, i) => ({
        id: i,
        left: `${(i * 37) % 100}%`,
        delay: `${(i % 8) * 0.08}s`,
        hue: (i * 47) % 360,
      })),
    []
  );
  return (
    <div className="pointer-events-none fixed inset-0 z-[100] overflow-hidden" aria-hidden>
      {pieces.map((p) => (
        <span
          key={p.id}
          className="ufuq-confetti-piece absolute top-0 h-3 w-3 rounded-sm opacity-90"
          style={{
            left: p.left,
            animationDelay: p.delay,
            backgroundColor: `hsl(${p.hue} 85% 55%)`,
          }}
        />
      ))}
    </div>
  );
}

export function GameWrapper({
  subjectId,
  gameId,
  title,
  hint,
  onBack,
  children,
}: GameWrapperProps) {
  const addPoints = useGameStore((s) => s.addPoints);
  const [summary, setSummary] = useState<SummaryState | null>(null);
  const [hintOpen, setHintOpen] = useState(false);
  const [playNonce, setPlayNonce] = useState(0);

  const handleReplay = useCallback(() => {
    setSummary(null);
    setPlayNonce((n) => n + 1);
  }, []);

  const finishGame = useCallback(
    (p: FinishPayload) => {
      const rate = p.total > 0 ? p.correct / p.total : 1;
      const passed = rate >= 0.5;
      const awarded = passed ? p.rawPoints : 0;
      if (awarded > 0) {
        addPoints(subjectId, awarded);
      }
      markGamePlayedToday(subjectId, gameId);
      setSummary({ ...p, awarded, passed, rate });
    },
    [addPoints, subjectId, gameId]
  );

  const value = useMemo(() => ({ finishGame }), [finishGame]);

  if (summary) {
    const encouragement = !summary.passed;
    const showConfetti = summary.passed && summary.awarded > 0;

    return (
      <div className="relative min-h-[320px] rounded-card border border-border/60 bg-white p-6 text-right shadow-sm" dir="rtl">
        {showConfetti ? <Confetti /> : null}
        <div className="relative z-[101] mx-auto max-w-md space-y-4 text-center">
          <p className="text-3xl font-extrabold text-ufuq-text">{encouragement ? "لا بأس!" : "🎉 أحسنت!"}</p>
          <p className="text-xl text-ufuq-text">
            النقاط المكتسبة: <span className="font-bold text-primary">{summary.awarded}</span>
          </p>
          <p className="text-lg text-ufuq-muted">
            الإجابات الصحيحة: {summary.correct}/{summary.total}
          </p>
          {encouragement ? (
            <p className="text-lg font-semibold text-secondary">حاول مرة أخرى — يمكنك التحسن دائماً!</p>
          ) : null}
          <div className="flex flex-col gap-3 sm:flex-row sm:justify-center">
            <Button type="button" className="min-h-12 min-w-[12rem] text-lg font-bold" onClick={handleReplay} data-interactive="true">
              العب مرة أخرى
            </Button>
            <Button type="button" variant="outline" className="min-h-12 min-w-[12rem] text-lg font-bold" asChild data-interactive="true">
              <Link href="/student">العودة للمواد</Link>
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <GameSessionContext.Provider value={value}>
      <div className="space-y-4 rounded-card border border-border/60 bg-white p-4 shadow-sm md:p-6" dir="rtl">
        <div className="flex flex-col gap-3 border-b border-border/50 pb-4 sm:flex-row sm:items-center sm:justify-between">
          <h2 className="text-right text-2xl font-extrabold text-ufuq-text md:text-3xl">{title}</h2>
          <div className="flex flex-wrap gap-2">
            <Button
              type="button"
              variant="outline"
              className="min-h-12 min-w-[7rem] text-base font-bold"
              onClick={() => setHintOpen((v) => !v)}
              data-interactive="true"
            >
              مساعدة؟
            </Button>
            <Button type="button" variant="ghost" className="min-h-12 text-base font-bold" onClick={onBack} data-interactive="true">
              اختيار لعبة
            </Button>
          </div>
        </div>
        {hintOpen ? (
          <div className="rounded-button bg-primary/10 p-4 text-right text-lg font-medium text-ufuq-text">{hint}</div>
        ) : null}
        <div key={playNonce} className="min-h-[200px] text-xl leading-relaxed text-ufuq-text">
          {children}
        </div>
      </div>
    </GameSessionContext.Provider>
  );
}
