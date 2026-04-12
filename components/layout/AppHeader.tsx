import type { ReactNode } from "react";
import { BrandLogoLink } from "@/components/layout/BrandLogoLink";
import { cn } from "@/lib/utils";

type AppHeaderProps = {
  end?: ReactNode;
  className?: string;
};

export function AppHeader({ end, className }: AppHeaderProps) {
  return (
    <header className="border-b border-border/60 bg-white/90 backdrop-blur">
      <div
        className={cn(
          "mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-3 px-4 py-3 sm:gap-4 sm:py-4",
          className
        )}
      >
        <BrandLogoLink />
        {end}
      </div>
    </header>
  );
}
