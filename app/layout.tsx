import type { Metadata } from "next";
import { Cairo } from "next/font/google";
import "./globals.css";
import { LearningSupportProvider } from "@/components/providers/LearningSupportProvider";
import { SupabaseAuthProvider } from "@/components/providers/SupabaseAuthProvider";

const cairo = Cairo({
  subsets: ["arabic", "latin"],
  weight: ["400", "600", "700", "800"],
  variable: "--font-cairo",
  display: "swap",
});

export const metadata: Metadata = {
  title: "أُفُق | منصة تعليمية للأطفال",
  description: "تعلم، العب، وتقدم عبر مواد دراسية ممتعة للأطفال والمعلمين والأهل.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ar" dir="rtl" className={cairo.variable}>
      <body className="min-h-screen font-cairo antialiased">
        <LearningSupportProvider>
          <SupabaseAuthProvider>{children}</SupabaseAuthProvider>
        </LearningSupportProvider>
      </body>
    </html>
  );
}
