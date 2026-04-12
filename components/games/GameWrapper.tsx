"use client";

import {
  createContext,
  useCallback,
  useContext,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { useGameStore } from "@/store/useGameStore";
import { markGamePlayedToday } from "@/lib/games/storage";
import { randomRetryPraise, randomSuccessPraise } from "@/lib/game-encouragement";
import { playSessionRetrySound, playSessionSuccessSound } from "@/lib/game-sounds";
import { cn } from "@/lib/utils";

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

function Confetti({ subtle }: { subtle?: boolean }) {
  const count = subtle ? 16 : 24;
  const pieces = useMemo(
    () =>
      Array.from({ length: count }, (_, i) => ({
        id: i,
        left: `${(i * 41) % 100}%`,
        delay: `${(i % 8) * 0.07}s`,
        hue: (i * 47) % 360,
        size: subtle ? "h-2.5 w-2.5" : "h-3 w-3",
      })),
    [count, subtle]
  );
  return (
    <div className="pointer-events-none fixed inset-0 z-[100] overflow-hidden" aria-hidden>
      {pieces.map((p) => (
        <span
          key={p.id}
          className={cn("ufuq-confetti-piece absolute top-0 rounded-sm opacity-75", p.size)}
          style={{
            left: p.left,
            animationDelay: p.delay,
            backgroundColor: `hsl(${p.hue} 80% 58%)`,
          }}
        />
      ))}
    </div>
  );
}

function GameSummaryScreen({
  summary,
  praiseLine,
  onReplay,
  onNext,
}: {
  summary: SummaryState;
  praiseLine: string;
  onReplay: () => void;
  onNext: () => void;
}) {
  const pct = Math.round(summary.rate * 100);
  const showConfetti = summary.passed && summary.awarded > 0;

  return (
    <div
      className="relative min-h-[320px] overflow-hidden rounded-card border border-border/60 bg-white p-5 shadow-sm sm:p-8"
      dir="rtl"
    >
      {showConfetti ? <Confetti subtle /> : null}

      <div
        className="pointer-events-none absolute inset-0 overflow-hidden rounded-[inherit] opacity-30"
        aria-hidden
      >
        <div
          className={cn(
            "absolute -left-1/3 top-0 h-full w-2/3 bg-gradient-to-r from-transparent via-white to-transparent",
            summary.passed && "ufuq-achievement-shine"
          )}
        />
      </div>

      <div
        className={cn(
          "relative z-[101] mx-auto max-w-md space-y-5 text-center",
          "game-result-pop motion-reduce:opacity-100 motion-reduce:scale-100"
        )}
      >
        <div aria-live="polite">
          <p
            className={cn(
              "text-2xl font-extrabold sm:text-3xl",
              summary.passed ? "text-primary" : "text-secondary"
            )}
          >
            {praiseLine}
          </p>
        </div>

        <div
          className={cn(
            "rounded-2xl border-2 px-6 py-6 shadow-inner",
            summary.passed ? "border-primary/30 bg-primary/[0.06]" : "border-border/70 bg-muted/40"
          )}
        >
          <p className="text-sm font-bold text-ufuq-muted">نتيجة الجولة</p>
          <p
            className={cn(
              "mt-1 text-5xl font-black tabular-nums sm:text-6xl",
              summary.passed ? "text-primary" : "text-ufuq-text"
            )}
          >
            {summary.awarded}
          </p>
          <p className="mt-1 text-sm font-semibold text-ufuq-muted">نقطة مكتسبة</p>
          <div className="mt-4 flex flex-wrap items-center justify-center gap-3 text-base font-bold text-ufuq-text">
            <span className="rounded-full bg-white/80 px-3 py-1 shadow-sm">
              صحيح: {summary.correct} / {summary.total}
            </span>
            <span className="rounded-full bg-white/80 px-3 py-1 shadow-sm">الدقة: {pct}%</span>
          </div>
        </div>

        {!summary.passed ? (
          <p className="text-lg font-semibold text-ufuq-muted">حاول مرة أخرى — يمكنك التحسّن دائماً!</p>
        ) : (
          <p className="text-base font-medium text-success">أحسنت! النقاط أُضيفت إلى رصيدك في المادة.</p>
        )}

        <div className="flex flex-col gap-3 pt-2 sm:flex-row sm:justify-center">
          <Button
            type="button"
            className="min-h-12 min-w-[11rem] text-lg font-bold shadow-md transition-transform active:scale-[0.98] motion-safe:hover:scale-[1.02]"
            onClick={onReplay}
            data-interactive="true"
          >
            إعادة اللعب
          </Button>
          <Button
            type="button"
            variant="outline"
            className="min-h-12 min-w-[11rem] text-lg font-bold border-2"
            onClick={onNext}
            data-interactive="true"
          >
            التالي
          </Button>
        </div>

        <p className="text-center text-sm text-ufuq-muted">
          <Link href="/student" className="font-bold text-primary underline-offset-4 hover:underline">
            العودة إلى المواد الدراسية
          </Link>
        </p>
      </div>
    </div>
  );
}

export function GameWrapper({ subjectId, gameId, title, hint, onBack, children }: GameWrapperProps) {
  const addPoints = useGameStore((s) => s.addPoints);
  const [summary, setSummary] = useState<SummaryState | null>(null);
  const [hintOpen, setHintOpen] = useState(false);
  const [playNonce, setPlayNonce] = useState(0);
  const soundPlayedFor = useRef<string | null>(null);

  const praiseLine = useMemo(() => {
    if (!summary) return "";
    return summary.passed ? randomSuccessPraise() : randomRetryPraise();
  }, [summary]);

  const handleReplay = useCallback(() => {
    soundPlayedFor.current = null;
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

  useLayoutEffect(() => {
    if (!summary) return;
    const key = `${summary.correct}-${summary.total}-${summary.passed}-${summary.awarded}`;
    if (soundPlayedFor.current === key) return;
    soundPlayedFor.current = key;
    if (summary.passed) {
      playSessionSuccessSound();
    } else {
      playSessionRetrySound();
    }
  }, [summary]);

  const value = useMemo(() => ({ finishGame }), [finishGame]);

  if (summary) {
    return (
      <GameSummaryScreen summary={summary} praiseLine={praiseLine} onReplay={handleReplay} onNext={onBack} />
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
