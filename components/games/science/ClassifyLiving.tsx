"use client";

import { useCallback, useMemo, useRef, useState } from "react";
import { useDrag, useDrop } from "react-dnd";
import { GameWrapper, useFinishGame } from "@/components/games/GameWrapper";

const ITEM = "sci-classify-item";

type Item = { id: string; emoji: string; label: string; living: boolean };

const POOL: Item[] = [
  { id: "1", emoji: "🐱", label: "قطة", living: true },
  { id: "2", emoji: "🌳", label: "شجرة", living: true },
  { id: "3", emoji: "🪨", label: "صخرة", living: false },
  { id: "4", emoji: "🐟", label: "سمكة", living: true },
  { id: "5", emoji: "🪑", label: "كرسي", living: false },
  { id: "6", emoji: "🌸", label: "زهرة", living: true },
];

function DraggableItem({
  item,
  hidden,
}: {
  item: Item;
  hidden: boolean;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [{ isDragging }, drag] = useDrag({
    type: ITEM,
    item: { ...item },
    canDrag: !hidden,
    collect: (m) => ({ isDragging: m.isDragging() }),
  });
  drag(ref);
  if (hidden) return null;
  return (
    <div
      ref={ref}
      className={`flex min-h-16 min-w-[5.5rem] cursor-grab flex-col items-center justify-center rounded-button border-2 border-purple-400/50 bg-white p-3 text-center ${
        isDragging ? "opacity-50" : ""
      }`}
      data-interactive="true"
    >
      <span className="text-4xl">{item.emoji}</span>
      <span className="text-lg font-bold">{item.label}</span>
    </div>
  );
}

function DropZone({
  title,
  acceptLiving,
  onDropItem,
  onWrong,
}: {
  title: string;
  acceptLiving: boolean;
  onDropItem: (it: Item) => void;
  onWrong: () => void;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [{ isOver }, drop] = useDrop({
    accept: ITEM,
    drop: (it: Item) => {
      if (it.living === acceptLiving) onDropItem(it);
      else onWrong();
    },
    collect: (m) => ({ isOver: m.isOver() }),
  });
  drop(ref);
  return (
    <div
      ref={ref}
      className={`flex min-h-48 flex-1 flex-col items-center justify-start rounded-card border-4 border-dashed p-4 text-center text-xl font-extrabold ${
        isOver ? "border-primary bg-primary/10" : "border-purple-300 bg-purple-50/50"
      }`}
      data-interactive="true"
    >
      {title}
    </div>
  );
}

function Inner() {
  const items = useMemo(() => [...POOL].sort(() => Math.random() - 0.5), []);
  const finishGame = useFinishGame();
  const [solved, setSolved] = useState<Set<string>>(new Set());
  const [correct, setCorrect] = useState(0);
  const [shake, setShake] = useState(false);

  const onWrong = useCallback(() => {
    setShake(true);
    setTimeout(() => setShake(false), 400);
  }, []);

  const handleRight = useCallback(
    (it: Item) => {
      if (solved.has(it.id)) return;
      setSolved((s) => new Set([...s, it.id]));
      setCorrect((c) => {
        const n = c + 1;
        if (n >= items.length) {
          finishGame({ correct: n, total: items.length, rawPoints: n * 10 });
        }
        return n;
      });
    },
    [finishGame, items.length, solved]
  );

  return (
    <div className={`space-y-6 ${shake ? "ufuq-shake" : ""}`}>
      <p className="text-right text-2xl font-bold">اسحب كل عنصر إلى المنطقة الصحيحة</p>
      <div className="flex flex-wrap justify-center gap-3 rounded-button border border-dashed border-purple-300 p-4" dir="rtl">
        {items.map((it) => (
          <DraggableItem key={it.id} item={it} hidden={solved.has(it.id)} />
        ))}
      </div>
      <div className="grid gap-4 md:grid-cols-2" dir="rtl">
        <DropZone title="كائن حي" acceptLiving onDropItem={handleRight} onWrong={onWrong} />
        <DropZone title="جماد" acceptLiving={false} onDropItem={handleRight} onWrong={onWrong} />
      </div>
    </div>
  );
}

export function ClassifyLivingGame({ subjectId, onBack }: { subjectId: string; onBack: () => void }) {
  return (
    <GameWrapper
      subjectId={subjectId}
      gameId="science-classify"
      title="صنّف الكائنات"
      hint="الكائن الحي ينمو ويتغذّى. الجماد لا يحيا مثل الحيوانات والنباتات."
      onBack={onBack}
    >
      <Inner />
    </GameWrapper>
  );
}
