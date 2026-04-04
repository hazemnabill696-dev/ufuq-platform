"use client";

import { memo, useMemo } from "react";
import { SUBJECTS } from "@/lib/subjects";
import { SubjectCard } from "@/components/subjects/SubjectCard";

export const SubjectGrid = memo(function SubjectGrid() {
  const items = useMemo(() => SUBJECTS, []);

  return (
    <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-3">
      {items.map((subject) => (
        <SubjectCard key={subject.id} subject={subject} />
      ))}
    </div>
  );
});
