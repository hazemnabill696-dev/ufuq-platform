"use client";

import { useCallback, useMemo, useState } from "react";
import { GameWrapper, useFinishGame } from "@/components/games/GameWrapper";

type Q = {
  q: string;
  options: string[];
  answer: number;
  fact: string;
};

const BANK: Q[] = [
  {
    q: "ما الذي يحتاجه النبات لصنع غذائه؟",
    options: ["الماء والضوء فقط", "الهواء فقط", "الماء والضوء والهواء", "التربة فقط"],
    answer: 2,
    fact: "النباتات تستخدم ضوء الشمس في عملية البناء الضوئي.",
  },
  {
    q: "أيّ كوكب يُعرف بالكوكب الأحمر؟",
    options: ["الزهرة", "المريخ", "المشتري", "زحل"],
    answer: 1,
    fact: "سطح المريخ غني بأكسيد الحديد فيبدو مائلاً للحمرة.",
  },
  {
    q: "أين يحدث معظم هضم الطعام؟",
    options: ["الفم", "المعدة", "الأمعاء الدقيقة", "القلب"],
    answer: 2,
    fact: "الأمعاء الدقيقة تمتص معظم العناصر الغذائية.",
  },
  {
    q: "ما مصدر الطاقة الرئيس للأرض؟",
    options: ["القمر", "الشمس", "البرق", "الرياح فقط"],
    answer: 1,
    fact: "الشمس تمدنا بالضوء والحرارة وتدعم الحياة.",
  },
  {
    q: "الحيوانات التي تلد وتُرضع صغارها تسمى…",
    options: ["زواحف", "ثديات", "برمائيات", "أسماك"],
    answer: 1,
    fact: "الثديات تُرضع صغارها بالحليب.",
  },
  {
    q: "ما حالة الماء في الغيوم الباردة عالياً؟",
    options: ["سائل دائماً", "صلب دائماً", "غالباً بخار وتكاثف", "نار"],
    answer: 2,
    fact: "بخار الماء يتكاثف ليكوّن قطرات السحب.",
  },
  {
    q: "كم عدد أرجل العنكبوت؟",
    options: ["٦", "٨", "١٠", "١٢"],
    answer: 1,
    fact: "العناكب من المفصليات ولها ثمانية أرجل.",
  },
  {
    q: "القمر يُضيء ليلاً لأنه…",
    options: ["ينتج ضوءه", "يعكس ضوء الشمس", "له نار داخلية", "مصباح طبيعي"],
    answer: 1,
    fact: "القمر لا يضيء ذاتياً بل يعكس ضوء الشمس.",
  },
];

function Inner() {
  const questions = useMemo(() => [...BANK].sort(() => Math.random() - 0.5).slice(0, 8), []);
  const finishGame = useFinishGame();
  const [i, setI] = useState(0);
  const [correct, setCorrect] = useState(0);
  const [emoji, setEmoji] = useState<string | null>(null);
  const [fact, setFact] = useState<string | null>(null);

  const q = questions[i];

  const pick = useCallback(
    (idx: number) => {
      if (emoji !== null) return;
      const ok = idx === q.answer;
      setEmoji(ok ? "🌟" : "💫");
      setFact(q.fact);
      setCorrect((prev) => {
        const nextC = prev + (ok ? 1 : 0);
        const nextI = i + 1;
        setTimeout(() => {
          setEmoji(null);
          setFact(null);
          if (nextI >= questions.length) {
            finishGame({ correct: nextC, total: questions.length, rawPoints: nextC * 10 });
          } else {
            setI(nextI);
          }
        }, 2200);
        return nextC;
      });
    },
    [emoji, finishGame, i, q.answer, q.fact, questions.length]
  );

  return (
    <div className="space-y-6">
      <p className="text-right text-2xl font-bold">
        السؤال {i + 1} من {questions.length}
      </p>
      <p className="text-right text-2xl font-bold leading-relaxed text-ufuq-text">{q.q}</p>
      {emoji ? <p className="text-center text-6xl">{emoji}</p> : null}
      {fact ? <p className="rounded-button bg-purple-50 p-4 text-right text-lg font-medium text-ufuq-text">{fact}</p> : null}
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        {q.options.map((opt, idx) => (
          <button
            key={idx}
            type="button"
            disabled={emoji !== null}
            className="min-h-14 rounded-button border-2 border-purple-300/60 bg-white px-4 py-4 text-right text-lg font-bold hover:border-primary/50 disabled:opacity-60"
            onClick={() => pick(idx)}
            data-interactive="true"
          >
            {opt}
          </button>
        ))}
      </div>
    </div>
  );
}

export function ScienceQuizGame({ subjectId, onBack }: { subjectId: string; onBack: () => void }) {
  return (
    <GameWrapper
      subjectId={subjectId}
      gameId="science-quiz"
      title="اختبار سريع - العلوم"
      hint="اقرأ السؤال بتمعن. بعد كل إجابة ستظهر معلومة ممتعة."
      onBack={onBack}
    >
      <Inner />
    </GameWrapper>
  );
}
