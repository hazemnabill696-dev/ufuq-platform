"use client";

import { useCallback, useMemo, useState } from "react";
import { GameWrapper, useFinishGame } from "@/components/games/GameWrapper";

const ROUNDS: { word: string; hint: string; blankIndex: number; choices: string[] }[] = [
  { word: "كتاب", hint: "أداة للقراءة", blankIndex: 2, choices: ["ب", "ت", "ث", "ن"] },
  { word: "مدرسة", hint: "مكان التعلم", blankIndex: 1, choices: ["د", "ذ", "ض", "ز"] },
  { word: "قلم", hint: "للكتابة", blankIndex: 1, choices: ["ل", "م", "ن", "ر"] },
  { word: "شمس", hint: "في السماء نهاراً", blankIndex: 2, choices: ["س", "ص", "ز", "ط"] },
  { word: "بحر", hint: "ماء مالح", blankIndex: 0, choices: ["ب", "ت", "ث", "ج"] },
  { word: "طائر", hint: "يطير في السماء", blankIndex: 3, choices: ["ر", "ز", "ل", "ن"] },
  { word: "وردة", hint: "زهرة جميلة", blankIndex: 2, choices: ["د", "ذ", "ظ", "ط"] },
  { word: "سفينة", hint: "تبحر في البحر", blankIndex: 1, choices: ["ف", "ق", "ب", "م"] },
  { word: "نجمة", hint: "تلمع ليلاً", blankIndex: 2, choices: ["م", "ن", "ل", "ك"] },
  { word: "حديقة", hint: "مكان للأشجار", blankIndex: 3, choices: ["ق", "ك", "غ", "ف"] },
];

function maskWord(word: string, idx: number) {
  const arr = [...word];
  arr[idx] = "_";
  return arr.join("");
}

function Inner() {
  const rounds = useMemo(() => [...ROUNDS].sort(() => Math.random() - 0.5).slice(0, 10), []);
  const finishGame = useFinishGame();
  const [idx, setIdx] = useState(0);
  const [correct, setCorrect] = useState(0);
  const [wrongFlash, setWrongFlash] = useState(false);

  const r = rounds[idx];
  const display = maskWord(r.word, r.blankIndex);
  const rightLetter = r.word[r.blankIndex];

  const choices = useMemo(() => [...r.choices].sort(() => Math.random() - 0.5), [r]);

  const pick = useCallback(
    (ch: string) => {
      if (ch !== rightLetter) {
        setWrongFlash(true);
        setTimeout(() => setWrongFlash(false), 350);
        return;
      }
      const nextC = correct + 1;
      setCorrect(nextC);
      if (idx >= 9) {
        finishGame({ correct: nextC, total: 10, rawPoints: nextC * 10 });
      } else {
        setIdx((i) => i + 1);
      }
    },
    [correct, finishGame, idx, rightLetter]
  );

  return (
    <div className={`space-y-6 ${wrongFlash ? "ufuq-shake" : ""}`}>
      <p className="text-right text-2xl font-bold">السؤال {idx + 1} من 10</p>
      <p className="text-right text-lg text-ufuq-muted">تلميح: {r.hint}</p>
      <p className="text-center text-5xl font-extrabold tracking-widest text-primary">{display}</p>
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
        {choices.map((c, i) => (
          <button
            key={`${idx}-${i}-${c}`}
            type="button"
            className="min-h-14 rounded-button border-2 border-primary/30 py-4 text-3xl font-extrabold"
            onClick={() => pick(c)}
            data-interactive="true"
          >
            {c}
          </button>
        ))}
      </div>
    </div>
  );
}

export function CompleteWordGame({ subjectId, onBack }: { subjectId: string; onBack: () => void }) {
  return (
    <GameWrapper
      subjectId={subjectId}
      gameId="arabic-complete-word"
      title="أكمل الكلمة"
      hint="اقرأ التلميح واختر الحرف الذي يكمل الكلمة بشكل صحيح. يمكنك المحاولة أكثر من مرة."
      onBack={onBack}
    >
      <Inner />
    </GameWrapper>
  );
}
