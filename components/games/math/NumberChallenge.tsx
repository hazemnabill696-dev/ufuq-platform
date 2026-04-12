"use client";

import { useCallback, useMemo, useState } from "react";
import { GameWrapper, useFinishGame } from "@/components/games/GameWrapper";
import { playAnswerCorrectSound, playAnswerWrongSound } from "@/lib/game-sounds";

type Q = {
  a: number;
  b: number;
  sum: number;
  missing: "a" | "b" | "sum";
  answer: number;
  label: string;
};

function randInt(min: number, max: number) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function buildQuestions(): Q[] {
  const out: Q[] = [];
  for (let i = 0; i < 10; i++) {
    const a = randInt(2, 12);
    const b = randInt(2, 12);
    const sum = a + b;
    const missing: Q["missing"] = i % 3 === 0 ? "a" : i % 3 === 1 ? "b" : "sum";
    const answer = missing === "a" ? a : missing === "b" ? b : sum;
    const label =
      missing === "a"
        ? `_ + ${b} = ${sum}`
        : missing === "b"
          ? `${a} + _ = ${sum}`
          : `${a} + ${b} = _`;
    out.push({ a, b, sum, missing, answer, label });
  }
  return out;
}

function choicesFor(q: Q): number[] {
  const set = new Set<number>();
  set.add(q.answer);
  while (set.size < 4) {
    const d = q.answer + randInt(-4, 4);
    if (d >= 0 && d <= 30 && d !== q.answer) set.add(d);
    else set.add(randInt(0, 20));
  }
  const arr = [...set];
  return arr.sort(() => Math.random() - 0.5);
}

function Inner() {
  const questions = useMemo(() => buildQuestions(), []);
  const finishGame = useFinishGame();
  const [i, setI] = useState(0);
  const [correct, setCorrect] = useState(0);
  const [options, setOptions] = useState(() => choicesFor(questions[0]));
  const [shake, setShake] = useState(false);
  const [flashOk, setFlashOk] = useState(false);
  const [showCorrect, setShowCorrect] = useState<number | null>(null);

  const q = questions[i];

  const pick = useCallback(
    (val: number) => {
      if (showCorrect !== null) return;
      if (val === q.answer) {
        playAnswerCorrectSound();
        setFlashOk(true);
        const nextCorrect = correct + 1;
        setCorrect(nextCorrect);
        setTimeout(() => {
          setFlashOk(false);
          if (i >= 9) {
            finishGame({ correct: nextCorrect, total: 10, rawPoints: nextCorrect * 10 });
          } else {
            const ni = i + 1;
            setI(ni);
            setOptions(choicesFor(questions[ni]));
          }
        }, 450);
      } else {
        playAnswerWrongSound();
        setShake(true);
        setShowCorrect(q.answer);
        setTimeout(() => {
          setShake(false);
          if (i >= 9) {
            finishGame({ correct, total: 10, rawPoints: correct * 10 });
          } else {
            const ni = i + 1;
            setI(ni);
            setOptions(choicesFor(questions[ni]));
            setShowCorrect(null);
          }
        }, 1200);
      }
    },
    [correct, finishGame, i, q.answer, questions, showCorrect]
  );

  return (
    <div
      className={`space-y-6 transition-colors duration-300 ${flashOk ? "bg-success/10" : ""} ${shake ? "ufuq-shake" : ""}`}
    >
      <div className="flex flex-col gap-2 sm:flex-row sm:flex-wrap sm:items-center sm:justify-between">
        <p className="text-right text-2xl font-bold md:text-3xl">
          السؤال {i + 1} من 10
        </p>
        <p className="rounded-full border border-primary/25 bg-primary/10 px-4 py-2 text-center text-base font-extrabold text-primary tabular-nums">
          النقاط: {correct * 10} · صحيح {correct}/10
        </p>
      </div>
      <p className="text-center font-mono text-3xl font-extrabold text-primary md:text-4xl" dir="ltr">
        {q.label}
      </p>
      {showCorrect !== null ? (
        <p className="text-center text-xl font-bold text-secondary">الإجابة الصحيحة: {showCorrect}</p>
      ) : null}
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
        {options.map((n) => (
          <button
            key={n}
            type="button"
            className="min-h-14 rounded-button border-2 border-primary/30 bg-primary/5 py-4 text-2xl font-extrabold text-ufuq-text hover:bg-primary/15"
            onClick={() => pick(n)}
            data-interactive="true"
          >
            {n}
          </button>
        ))}
      </div>
    </div>
  );
}

export function NumberChallengeGame({
  subjectId,
  onBack,
}: {
  subjectId: string;
  onBack: () => void;
}) {
  return (
    <GameWrapper
      subjectId={subjectId}
      gameId="math-number-challenge"
      title="تحدي الأرقام"
      hint="اقرأ المعادلة بعناية. الرقم المفقود يجعل المساواة صحيحة."
      onBack={onBack}
    >
      <Inner />
    </GameWrapper>
  );
}
