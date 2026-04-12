import Link from "next/link";
import { AppHeader } from "@/components/layout/AppHeader";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col bg-[#F8F9FF]">
      <AppHeader />
      <main className="mx-auto flex max-w-6xl flex-1 flex-col items-center justify-center gap-4 px-4 py-16 text-center">
        <h1 className="text-3xl font-extrabold text-ufuq-text">الصفحة غير موجودة</h1>
        <p className="max-w-md text-ufuq-muted">تعذّر العثور على الرابط المطلوب.</p>
        <Button asChild data-interactive="true">
          <Link href="/student">العودة إلى المواد الدراسية</Link>
        </Button>
      </main>
    </div>
  );
}
