/** Shared with dashboard header and home quick navigation — keep routes in sync. */
export const DASHBOARD_NAV_LINKS = [
  { href: "/student", label: "المواد الدراسية" },
  { href: "/student/progress", label: "التقدم" },
  { href: "/student/badges", label: "الإنجازات" },
  { href: "/parent", label: "متابعة ولي الأمر" },
  { href: "/teacher", label: "ملاحظات المعلم" },
  { href: "/login", label: "دخول" },
] as const;

export type DashboardNavLink = (typeof DASHBOARD_NAV_LINKS)[number];

export type DashboardNavHref = (typeof DASHBOARD_NAV_LINKS)[number]["href"];

export function dashboardNavLabel(href: DashboardNavHref): string {
  const item = DASHBOARD_NAV_LINKS.find((l) => l.href === href);
  if (!item) throw new Error(`Unknown nav href: ${href}`);
  return item.label;
}

/** Heading for the subject grid on `/student` (distinct from the nav label for the same route). */
export const STUDENT_SUBJECT_GRID_SECTION_TITLE = "استكشف المواد والأنشطة";
