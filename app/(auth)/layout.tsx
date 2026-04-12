import { AppHeader } from "@/components/layout/AppHeader";

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen flex-col bg-[#F8F9FF]">
      <AppHeader />
      <div className="flex flex-1 items-center justify-center px-4 py-10 sm:py-12">
        <div className="w-full max-w-md">{children}</div>
      </div>
    </div>
  );
}
