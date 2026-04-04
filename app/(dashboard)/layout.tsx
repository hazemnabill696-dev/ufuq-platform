import Link from "next/link";
import { SignOutButton } from "@/components/auth/SignOutButton";

const links = [
  { href: "/student", label: "الطالب" },
  { href: "/student/progress", label: "التقدم" },
  { href: "/student/badges", label: "الإنجازات" },
  { href: "/parent", label: "ولي الأمر" },
  { href: "/teacher", label: "المعلم" },
  { href: "/login", label: "دخول" },
];

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-[#F8F9FF]">
      <header className="border-b border-border/60 bg-white/90 backdrop-blur">
        <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-4 px-4 py-4">
          <Link href="/student" className="text-xl font-extrabold text-primary">
            أُفُق
          </Link>
          <nav className="flex flex-wrap items-center gap-3 text-sm font-semibold text-ufuq-muted">
            {links.map((l) => (
              <Link key={l.href} href={l.href} className="hover:text-primary">
                {l.label}
              </Link>
            ))}
            <SignOutButton />
          </nav>
        </div>
      </header>
      <main className="mx-auto max-w-6xl px-4 py-8">{children}</main>
    </div>
  );
}
