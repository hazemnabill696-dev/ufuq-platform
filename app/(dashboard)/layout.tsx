import Link from "next/link";
import { SignOutButton } from "@/components/auth/SignOutButton";
import { AppHeader } from "@/components/layout/AppHeader";
import { DASHBOARD_NAV_LINKS } from "@/lib/dashboard-nav";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-[#F8F9FF]">
      <AppHeader
        end={
          <nav className="flex min-w-0 flex-wrap items-center justify-end gap-x-3 gap-y-2 text-sm font-semibold text-ufuq-muted">
            {DASHBOARD_NAV_LINKS.map((l) => (
              <Link key={l.href} href={l.href} className="hover:text-primary">
                {l.label}
              </Link>
            ))}
            <SignOutButton />
          </nav>
        }
      />
      <main className="mx-auto max-w-6xl px-4 py-8">{children}</main>
    </div>
  );
}
