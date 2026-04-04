import { GameDndProvider } from "@/components/games/GameDndProvider";
import { SubjectPlayFlow } from "@/components/games/SubjectPlayFlow";

type PageProps = { params: { subjectId: string } };

export default function PlaySubjectPage({ params }: PageProps) {
  return (
    <GameDndProvider>
      <SubjectPlayFlow subjectId={params.subjectId} />
    </GameDndProvider>
  );
}
