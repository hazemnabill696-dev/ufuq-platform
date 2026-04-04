"use client";

import { useCallback, useMemo, useRef, useState } from "react";
import { useDrag, useDrop } from "react-dnd";
import { GameWrapper, useFinishGame } from "@/components/games/GameWrapper";

const ITEM = "math-order-num";

function randUnique(count: number, min: number, max: number): number[] {
  const s = new Set<number>();
  while (s.size < count) {
    s.add(Math.floor(Math.random() * (max - min + 1)) + min);
  }
  return [...s];
}

function DraggableNum({
  num,
  index,
  move,
}: {
  num: number;
  index: number;
  move: (from: number, to: number) => void;
}) {
  const ref = useRef<HTMLButtonElement>(null);
  const [{ isDragging }, drag] = useDrag({
    type: ITEM,
    item: { index },
    collect: (m) => ({ isDragging: m.isDragging() }),
  });
  const [, drop] = useDrop({
    accept: ITEM,
    hover(item: { index: number }) {
      if (item.index === index) return;
      move(item.index, index);
      item.index = index;
    },
  });
  drag(drop(ref));
  return (
    <button
      ref={ref}
      type="button"
      className={`min-h-14 min-w-[4.5rem] rounded-button border-2 border-primary/40 bg-white px-4 py-4 text-2xl font-extrabold text-ufuq-text shadow-sm ${
        isDragging ? "opacity-50" : ""
      }`}
      data-interactive="true"
    >
      {num}
    </button>
  );
}

function Inner({ ascending }: { ascending: boolean }) {
  const finishGame = useFinishGame();
  const target = useMemo(() => {
    const nums = randUnique(5, 1, 40);
    const sorted = [...nums].sort((a, b) => (ascending ? a - b : b - a));
    return { start: [...nums].sort(() => Math.random() - 0.5), sorted };
  }, [ascending]);

  const [list, setList] = useState(() => target.start);

  const move = useCallback((from: number, to: number) => {
    setList((prev) => {
      const n = [...prev];
      const [x] = n.splice(from, 1);
      n.splice(to, 0, x);
      return n;
    });
  }, []);

  const check = useCallback(() => {
    const ok = list.every((n, i) => n === target.sorted[i]);
    finishGame({
      correct: ok ? 1 : 0,
      total: 1,
      rawPoints: ok ? 15 : 0,
    });
  }, [finishGame, list, target.sorted]);

  return (
    <div className="space-y-6">
      <p className="text-right text-2xl font-bold">
        رتّب الأرقام {ascending ? "من الأصغر إلى الأكبر" : "من الأكبر إلى الأصغر"}
      </p>
      <div className="flex flex-wrap justify-center gap-3 rounded-button border border-dashed border-primary/30 bg-ufuq-bg p-4" dir="rtl">
        {list.map((n, i) => (
          <DraggableNum key={`${n}-${i}`} num={n} index={i} move={move} />
        ))}
      </div>
      <div className="flex justify-center">
        <button
          type="button"
          className="min-h-14 min-w-[12rem] rounded-button bg-primary px-6 text-xl font-extrabold text-white"
          onClick={check}
          data-interactive="true"
        >
          تحقق من الترتيب
        </button>
      </div>
    </div>
  );
}

export function NumberOrderingGame({
  subjectId,
  onBack,
}: {
  subjectId: string;
  onBack: () => void;
}) {
  const ascending = useMemo(() => Math.random() > 0.5, []);
  return (
    <GameWrapper
      subjectId={subjectId}
      gameId="math-number-order"
      title="ترتيب الأرقام"
      hint="اسحب الأرقام وبدّل أماكنها حتى يصبح الترتيب مطابقاً للمطلوب."
      onBack={onBack}
    >
      <Inner ascending={ascending} />
    </GameWrapper>
  );
}
