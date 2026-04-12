import Image from "next/image";
import Link from "next/link";
import { BASE_PATH } from "@/lib/base-path";
import { cn } from "@/lib/utils";

type BrandLogoLinkProps = {
  className?: string;
  showWordmark?: boolean;
};

export function BrandLogoLink({ className, showWordmark = true }: BrandLogoLinkProps) {
  return (
    <Link
      href="/"
      className={cn(
        "group inline-flex min-w-0 max-w-full shrink-0 items-center gap-2 rounded-md py-1 outline-none ring-offset-background focus-visible:ring-2 focus-visible:ring-ring",
        className
      )}
    >
      <span className="relative block h-9 w-9 shrink-0 sm:h-10 sm:w-10" aria-hidden>
        <Image
          src={`${BASE_PATH}/images/logo.svg`}
          alt=""
          fill
          className="object-contain"
          sizes="40px"
          priority
        />
      </span>
      {showWordmark && (
        <span className="truncate text-lg font-extrabold text-primary sm:text-xl">أُفُق</span>
      )}
    </Link>
  );
}
