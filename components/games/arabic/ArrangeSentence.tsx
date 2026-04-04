"use client";

import { useCallback, useMemo, useRef, useState } from "react";
import { useDrag, useDrop } from "react-dnd";
import { GameWrapper, useFinishGame } from "@/components/games/GameWrapper";

const TYPE = "ar-sentence-word";

const SENTENCE = ["الطفل", "يقرأ", "الكتاب", "بشغف"];

function WordChip({
  text,
  index,
  move,
}: {
  text: string;
  index: number;
  move: (from: number, to: number) => void;
}) {
  const ref = useRef<HTMLButtonElement>(null);
  const [{ isDragging }, drag] = useDrag({
    type: TYPE,
    item: { index },
    collect: (m) => ({ isDragging: m.isDragging() }),
  });
  const [, drop] = useDrop({
    accept: TYPE,
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
      className={`min-h-14 rounded-button border-2 border-emerald-500/40 bg-emerald-50 px-4 py-3 text-xl font-bold text-ufuq-text ${
        isDragging ? "opacity-50" : ""
      }`}
      data-interactive="true"
    >
      {text}
    </button>
  );
}

function Inner() {
  const finishGame = useFinishGame();
  const target = useMemo(() => [...SENTENCE], []);
  const [words, setWords] = useState(() => [...SENTENCE].sort(() => Math.random() - 0.5));

  const move = useCallback((from: number, to: number) => {
    setWords((prev) => {
      const n = [...prev];
      const [x] = n.splice(from, 1);
      n.splice(to, 0, x);
      return n;
    });
  }, []);

  const check = useCallback(() => {
    const ok = words.every((w, i) => w === target[i]);
    finishGame({ correct: ok ? 1 : 0, total: 1, rawPoints: ok ? 15 : 0 });
  }, [finishGame, target, words]);

  return (
    <div className="space-y-6">
      <p className="text-right text-2xl font-bold">رتّب الكلمات لتكوين جملة مفيدة</p>
      <div
        className="flex min-h-[5rem] flex-wrap content-center justify-center gap-3 rounded-button border border-dashed border-emerald-400/50 bg-ufuq-bg p-4"
        dir="rtl"
      >
        {words.map((w, i) => (
          <WordChip key={`${w}-${i}`} text={w} index={i} move={move} />
        ))}
      </div>
      <div className="flex justify-center">
        <button
          type="button"
          className="min-h-14 min-w-[12rem] rounded-button bg-primary px-6 text-xl font-extrabold text-white"
          onClick={check}
          data-interactive="true"
        >
          تحقق من الجملة
        </button>
      </div>
    </div>
  );
}

export function ArrangeSentenceGame({ subjectId, onBack }: { subjectId: string; onBack: () => void }) {
  return (
    <GameWrapper
      subjectId={subjectId}
      gameId="arabic-arrange-sentence"
      title="رتّب الجملة"
      hint="اسحب الكلمات أفقياً بالترتيب الصحيح من اليمين إلى اليسار كما في العربية."
      onBack={onBack}
    >
      <Inner />
    </GameWrapper>
  );
}
