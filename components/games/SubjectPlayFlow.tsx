"use client";

import { useCallback, useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { GamePicker, type GameMeta } from "@/components/games/GamePicker";
import { NumberChallengeGame } from "@/components/games/math/NumberChallenge";
import { NumberOrderingGame } from "@/components/games/math/NumberOrdering";
import { OperationsMatchGame } from "@/components/games/math/OperationsMatch";
import { CompleteWordGame } from "@/components/games/arabic/CompleteWord";
import { ArrangeSentenceGame } from "@/components/games/arabic/ArrangeSentence";
import { SmartDictationGame } from "@/components/games/arabic/SmartDictation";
import { ClassifyLivingGame } from "@/components/games/science/ClassifyLiving";
import { WaterCycleGame } from "@/components/games/science/WaterCycle";
import { ScienceQuizGame } from "@/components/games/science/ScienceQuiz";

const CONFIG: Record<string, { title: string; games: GameMeta[] }> = {
  math: {
    title: "الرياضيات",
    games: [
      {
        id: "math-number-challenge",
        title: "تحدي الأرقام",
        description: "عشر أسئلة: أكمل الرقم الناقص في الجمع.",
      },
      {
        id: "math-number-order",
        title: "ترتيب الأرقام",
        description: "رتّب خمسة أرقام بالترتيب المطلوب بالسحب والإفلات.",
      },
      {
        id: "math-ops-match",
        title: "مطابقة العمليات",
        description: "وصّل كل معادلة بناتجها الصحيح.",
      },
    ],
  },
  arabic: {
    title: "اللغة العربية",
    games: [
      {
        id: "arabic-complete-word",
        title: "أكمل الكلمة",
        description: "اختر الحرف الناقص مع تلميح معنوي.",
      },
      {
        id: "arabic-arrange-sentence",
        title: "رتّب الجملة",
        description: "اسحب الكلمات لتكوين جملة صحيحة (RTL).",
      },
      {
        id: "arabic-smart-dictation",
        title: "الإملاء الذكي",
        description: "استمع للكلمة واكتبها مع تمييز الحروف.",
      },
    ],
  },
  science: {
    title: "العلوم",
    games: [
      {
        id: "science-classify",
        title: "صنّف الكائنات",
        description: "اسحب الرموز إلى «كائن حي» أو «جماد».",
      },
      {
        id: "science-water-cycle",
        title: "أكمل دورة الماء",
        description: "ضع التسميات في ترتيب دورة الماء.",
      },
      {
        id: "science-quiz",
        title: "اختبار سريع",
        description: "ثمانية أسئلة مع معلومة بعد كل إجابة.",
      },
    ],
  },
};

function ComingSoon({ name }: { name: string }) {
  return (
    <div className="rounded-card border border-border/60 bg-white p-10 text-center shadow-sm" dir="rtl">
      <h1 className="text-3xl font-extrabold text-ufuq-text">{name}</h1>
      <p className="mt-4 text-xl text-ufuq-muted">الألعاب التفاعلية لهذه المادة قيد الإعداد.</p>
      <Button className="mt-8 min-h-12 font-bold" asChild data-interactive="true">
        <Link href="/student">العودة للمواد</Link>
      </Button>
    </div>
  );
}

const TITLES: Record<string, string> = {
  english: "اللغة الإنجليزية",
  art: "الفنون",
  quran: "التربية الإسلامية",
};

export function SubjectPlayFlow({ subjectId }: { subjectId: string }) {
  const [gameId, setGameId] = useState<string | null>(null);
  const [pickerNonce, setPickerNonce] = useState(0);

  const cfg = CONFIG[subjectId];
  const onBackToPicker = useCallback(() => {
    setGameId(null);
    setPickerNonce((n) => n + 1);
  }, []);

  if (!cfg) {
    return <ComingSoon name={TITLES[subjectId] ?? "المادة"} />;
  }

  if (!gameId) {
    return (
      <GamePicker
        key={pickerNonce}
        subjectId={subjectId}
        subjectTitle={cfg.title}
        games={cfg.games}
        onSelect={setGameId}
      />
    );
  }

  switch (gameId) {
    case "math-number-challenge":
      return <NumberChallengeGame subjectId={subjectId} onBack={onBackToPicker} />;
    case "math-number-order":
      return <NumberOrderingGame subjectId={subjectId} onBack={onBackToPicker} />;
    case "math-ops-match":
      return <OperationsMatchGame subjectId={subjectId} onBack={onBackToPicker} />;
    case "arabic-complete-word":
      return <CompleteWordGame subjectId={subjectId} onBack={onBackToPicker} />;
    case "arabic-arrange-sentence":
      return <ArrangeSentenceGame subjectId={subjectId} onBack={onBackToPicker} />;
    case "arabic-smart-dictation":
      return <SmartDictationGame subjectId={subjectId} onBack={onBackToPicker} />;
    case "science-classify":
      return <ClassifyLivingGame subjectId={subjectId} onBack={onBackToPicker} />;
    case "science-water-cycle":
      return <WaterCycleGame subjectId={subjectId} onBack={onBackToPicker} />;
    case "science-quiz":
      return <ScienceQuizGame subjectId={subjectId} onBack={onBackToPicker} />;
    default:
      return <ComingSoon name={cfg.title} />;
  }
}
