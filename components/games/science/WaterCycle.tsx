"use client";

import { useCallback, useMemo, useRef, useState } from "react";
import { useDrag, useDrop } from "react-dnd";
import { GameWrapper, useFinishGame } from "@/components/games/GameWrapper";

const LTYPE = "water-label";

type Lab = { id: string; text: string; slot: number };

const LABELS: Lab[] = [
  { id: "a", text: "تبخر", slot: 0 },
  { id: "b", text: "تكاثف", slot: 1 },
  { id: "c", text: "هطول", slot: 2 },
  { id: "d", text: "تجمع", slot: 3 },
];

const SLOT_HINTS = ["من الماء والحرارة", "في الغيوم", "من السحب", "في الأرض والبحار"];

function LabelChip({ lab, used }: { lab: Lab; used: boolean }) {
  const ref = useRef<HTMLButtonElement>(null);
  const [{ isDragging }, drag] = useDrag({
    type: LTYPE,
    item: { id: lab.id, slot: lab.slot, text: lab.text },
    canDrag: !used,
    collect: (m) => ({ isDragging: m.isDragging() }),
  });
  drag(ref);
  if (used) return null;
  return (
    <button
      ref={ref}
      type="button"
      className={`min-h-14 rounded-button border-2 border-sky-500/50 bg-sky-50 px-4 py-3 text-lg font-extrabold ${
        isDragging ? "opacity-50" : ""
      }`}
      data-interactive="true"
    >
      {lab.text}
    </button>
  );
}

function Slot({
  slotIndex,
  filled,
  onCorrect,
  onWrong,
}: {
  slotIndex: number;
  filled: string | null;
  onCorrect: (slot: number, text: string) => void;
  onWrong: () => void;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [{ isOver }, drop] = useDrop({
    accept: LTYPE,
    drop: (it: { id: string; slot: number; text: string }) => {
      if (it.slot === slotIndex) onCorrect(slotIndex, it.text);
      else onWrong();
    },
    collect: (m) => ({ isOver: m.isOver() }),
  });
  drop(ref);
  return (
    <div
      ref={ref}
      className={`flex min-h-20 items-center justify-center rounded-button border-4 border-dashed px-3 text-center text-lg font-bold ${
        isOver ? "border-primary bg-primary/10" : "border-sky-300 bg-white"
      }`}
      data-interactive="true"
    >
      {filled ?? SLOT_HINTS[slotIndex]}
    </div>
  );
}

function Inner() {
  const finishGame = useFinishGame();
  const labels = useMemo(() => [...LABELS].sort(() => Math.random() - 0.5), []);
  const [placed, setPlaced] = useState<Record<number, string>>({});
  const [correct, setCorrect] = useState(0);
  const [shake, setShake] = useState(false);

  const onWrong = useCallback(() => {
    setShake(true);
    setTimeout(() => setShake(false), 400);
  }, []);

  const onCorrect = useCallback(
    (slot: number, text: string) => {
      if (placed[slot]) return;
      setPlaced((p) => ({ ...p, [slot]: text }));
      setCorrect((c) => {
        const n = c + 1;
        if (n >= 4) {
          finishGame({ correct: 4, total: 4, rawPoints: 15 });
        }
        return n;
      });
    },
    [finishGame, placed]
  );

  const usedIds = useMemo(
    () => new Set(LABELS.filter((L) => placed[L.slot] === L.text).map((L) => L.id)),
    [placed]
  );

  return (
    <div className={`space-y-6 ${shake ? "ufuq-shake" : ""}`}>
      <p className="text-right text-2xl font-bold">اسحب كل تسمية إلى مكانها في دورة الماء</p>
      <div className="flex flex-wrap justify-center gap-3 rounded-button border border-dashed border-sky-300 p-4" dir="rtl">
        {labels.map((lab) => (
          <LabelChip key={lab.id} lab={lab} used={usedIds.has(lab.id)} />
        ))}
      </div>
      <div className="mx-auto flex max-w-md flex-col gap-3 rounded-card border border-sky-200 bg-sky-50/40 p-4" dir="rtl">
        <p className="text-center text-sm font-bold text-ufuq-muted">من الأعلى إلى الأسفل</p>
        {[0, 1, 2, 3].map((i) => (
          <Slot
            key={i}
            slotIndex={i}
            filled={placed[i] ?? null}
            onCorrect={onCorrect}
            onWrong={onWrong}
          />
        ))}
      </div>
    </div>
  );
}

export function WaterCycleGame({ subjectId, onBack }: { subjectId: string; onBack: () => void }) {
  return (
    <GameWrapper
      subjectId={subjectId}
      gameId="science-water-cycle"
      title="أكمل دورة الماء"
      hint="تبخر من الماء، ثم تكاثف في السحب، ثم هطول، ثم تجمع في الأرض."
      onBack={onBack}
    >
      <Inner />
    </GameWrapper>
  );
}
