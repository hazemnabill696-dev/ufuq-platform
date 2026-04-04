"use client";

import { useCallback, useMemo, useState } from "react";
import { GameWrapper, useFinishGame } from "@/components/games/GameWrapper";

type Pair = { id: string; expr: string; value: number };

const BANK: Pair[] = [
  { id: "1", expr: "3 + 4", value: 7 },
  { id: "2", expr: "8 − 2", value: 6 },
  { id: "3", expr: "5 × 3", value: 15 },
];

function Inner() {
  const finishGame = useFinishGame();
  const { left, right } = useMemo(() => {
    const shuffledVals = [...BANK.map((b) => b.value)].sort(() => Math.random() - 0.5);
    return { left: BANK, right: shuffledVals };
  }, []);

  const [pickL, setPickL] = useState<Pair | null>(null);
  const [matched, setMatched] = useState<Set<string>>(new Set());
  const [shake, setShake] = useState(false);

  const onLeft = useCallback((p: Pair) => {
    if (matched.has(p.id)) return;
    setPickL(p);
  }, [matched]);

  const onRight = useCallback(
    (val: number) => {
      if (!pickL) return;
      if (matched.has(pickL.id)) return;
      if (pickL.value === val) {
        setMatched((m) => new Set([...m, pickL.id]));
        setPickL(null);
        const next = new Set([...matched, pickL.id]);
        if (next.size >= 3) {
          finishGame({ correct: 3, total: 3, rawPoints: 20 });
        }
      } else {
        setShake(true);
        setTimeout(() => setShake(false), 400);
        setPickL(null);
      }
    },
    [finishGame, matched, pickL]
  );

  return (
    <div className={`space-y-8 ${shake ? "ufuq-shake" : ""}`}>
      <p className="text-right text-xl font-bold text-ufuq-muted">اضغط معادلة ثم اضغط الناتج الصحيح.</p>
      <div className="grid gap-6 md:grid-cols-2">
        <div className="space-y-3">
          <p className="text-lg font-bold text-primary">المعادلات</p>
          {left.map((p) => (
            <button
              key={p.id}
              type="button"
              disabled={matched.has(p.id)}
              onClick={() => onLeft(p)}
              className={`flex min-h-14 w-full items-center justify-center rounded-button border-2 px-4 text-2xl font-extrabold ${
                matched.has(p.id)
                  ? "border-success bg-success/15 text-success"
                  : pickL?.id === p.id
                    ? "border-primary bg-primary/15"
                    : "border-border bg-white"
              }`}
              data-interactive="true"
            >
              <span dir="ltr">{p.expr}</span>
            </button>
          ))}
        </div>
        <div className="space-y-3">
          <p className="text-lg font-bold text-primary">النتائج</p>
          {right.map((v, idx) => (
            <button
              key={`${v}-${idx}`}
              type="button"
              onClick={() => onRight(v)}
              className="min-h-14 w-full rounded-button border-2 border-border bg-white text-2xl font-extrabold hover:border-primary/40"
              data-interactive="true"
            >
              {v}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

export function OperationsMatchGame({
  subjectId,
  onBack,
}: {
  subjectId: string;
  onBack: () => void;
}) {
  return (
    <GameWrapper
      subjectId={subjectId}
      gameId="math-ops-match"
      title="مطابقة العمليات"
      hint="كل معادلة لها ناتج واحد في العمود الثاني."
      onBack={onBack}
    >
      <Inner />
    </GameWrapper>
  );
}
