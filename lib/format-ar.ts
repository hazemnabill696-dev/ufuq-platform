export function formatArabicDate(iso?: string | null, emptyLabel = "—"): string {
  if (!iso) return emptyLabel;
  try {
    const d = new Date(iso);
    if (Number.isNaN(d.getTime())) return emptyLabel;
    return new Intl.DateTimeFormat("ar-EG", { dateStyle: "medium" }).format(d);
  } catch {
    return emptyLabel;
  }
}
