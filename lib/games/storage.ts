const todayKey = () => new Date().toISOString().slice(0, 10);

export function getPlayedTodayIds(subjectId: string): string[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(`ufuq-games-${subjectId}-${todayKey()}`);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as unknown;
    return Array.isArray(parsed) ? (parsed as string[]) : [];
  } catch {
    return [];
  }
}

export function markGamePlayedToday(subjectId: string, gameId: string): void {
  if (typeof window === "undefined") return;
  const key = `ufuq-games-${subjectId}-${todayKey()}`;
  const prev = new Set(getPlayedTodayIds(subjectId));
  prev.add(gameId);
  localStorage.setItem(key, JSON.stringify([...prev]));
}
