"use client";

import { useCallback, useMemo, useState } from "react";
import { GameWrapper, useFinishGame } from "@/components/games/GameWrapper";

const WORDS = ["شمس", "قمر", "بحر", "كتاب", "مدرسة", "نجمة"];

function speak(word: string) {
  if (typeof window === "undefined" || !window.speechSynthesis) return;
  window.speechSynthesis.cancel();
  const u = new SpeechSynthesisUtterance(word);
  u.lang = "ar-SA";
  u.rate = 0.85;
  window.speechSynthesis.speak(u);
}

function Inner() {
  const order = useMemo(() => [...WORDS].sort(() => Math.random() - 0.5).slice(0, 5), []);
  const finishGame = useFinishGame();
  const [idx, setIdx] = useState(0);
  const [input, setInput] = useState("");
  const [correctCount, setCorrectCount] = useState(0);
  const [bad, setBad] = useState(false);

  const word = order[idx];

  const check = useCallback(() => {
    if (input.trim() !== word) {
      setBad(true);
      setTimeout(() => setBad(false), 400);
      return;
    }
    const next = correctCount + 1;
    setCorrectCount(next);
    setInput("");
    if (idx >= order.length - 1) {
      finishGame({ correct: next, total: order.length, rawPoints: next * 20 });
    } else {
      setIdx((i) => i + 1);
    }
  }, [correctCount, finishGame, idx, input, order.length, word]);

  const chars = useMemo(() => {
    const t = input.normalize("NFC");
    const w = word.normalize("NFC");
    const out: { ch: string; ok: boolean | null }[] = [];
    const max = Math.max(t.length, w.length);
    for (let i = 0; i < max; i++) {
      const tc = t[i] ?? "";
      const wc = w[i] ?? "";
      if (!tc && !wc) continue;
      if (!tc) out.push({ ch: "_", ok: null });
      else out.push({ ch: tc, ok: tc === wc });
    }
    return out;
  }, [input, word]);

  return (
    <div className={`space-y-6 ${bad ? "ufuq-shake" : ""}`}>
      <p className="text-right text-2xl font-bold">
        الكلمة {idx + 1} من {order.length}
      </p>
      <div className="flex flex-wrap items-center gap-3">
        <button
          type="button"
          className="min-h-14 rounded-button bg-secondary px-6 text-lg font-bold text-white"
          onClick={() => speak(word)}
          data-interactive="true"
        >
          ▶ تشغيل الصوت
        </button>
        <span className="text-lg text-ufuq-muted">استمع ثم اكتب الكلمة بالعربية</span>
      </div>
      <input
        type="text"
        dir="rtl"
        value={input}
        onChange={(e) => setInput(e.target.value)}
        className="min-h-14 w-full rounded-button border-2 border-input px-4 text-2xl font-bold"
        placeholder="اكتب هنا"
        data-interactive="true"
        autoComplete="off"
      />
      <div className="flex min-h-12 flex-wrap gap-2 rounded-button bg-muted/40 p-3" dir="rtl">
        {chars.length === 0 ? (
          <span className="text-ufuq-muted">ستظهر مقارنة الحروف هنا</span>
        ) : (
          chars.map((c, i) => (
            <span
              key={i}
              className={`text-2xl font-bold ${
                c.ok === null ? "text-ufuq-muted" : c.ok ? "text-success" : "text-secondary"
              }`}
            >
              {c.ch}
            </span>
          ))
        )}
      </div>
      <div className="flex justify-center">
        <button
          type="button"
          className="min-h-14 min-w-[10rem] rounded-button bg-primary px-6 text-xl font-extrabold text-white"
          onClick={check}
          data-interactive="true"
        >
          تحقق
        </button>
      </div>
    </div>
  );
}

export function SmartDictationGame({ subjectId, onBack }: { subjectId: string; onBack: () => void }) {
  return (
    <GameWrapper
      subjectId={subjectId}
      gameId="arabic-smart-dictation"
      title="الإملاء الذكي"
      hint="اضغط تشغيل الصوت، استمع، ثم اكتب الكلمة. يمكنك إعادة التشغيل عدة مرات."
      onBack={onBack}
    >
      <Inner />
    </GameWrapper>
  );
}
