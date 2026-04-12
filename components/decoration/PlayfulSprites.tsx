import { cn } from "@/lib/utils";

type SpriteProps = { className?: string };

export function SpriteStar({ className }: SpriteProps) {
  return (
    <svg viewBox="0 0 40 40" className={cn("text-primary", className)} fill="currentColor" aria-hidden>
      <path d="M20 2l4.6 12.2L37 15l-9.5 7.4L31 36l-11-7-11 7 3.5-13.6L3 15l12.4-.8L20 2z" opacity="0.85" />
    </svg>
  );
}

export function SpriteCloud({ className }: SpriteProps) {
  return (
    <svg viewBox="0 0 48 32" className={cn("text-sky-400", className)} fill="currentColor" aria-hidden>
      <path
        d="M38 22h2a8 8 0 10-7.4-11 10 10 0 10-17.2 0A8 8 0 108 22h30z"
        opacity="0.55"
      />
    </svg>
  );
}

export function SpriteBalloon({ className }: SpriteProps) {
  return (
    <svg viewBox="0 0 36 48" className={cn("text-secondary", className)} fill="none" aria-hidden>
      <ellipse cx="18" cy="16" rx="14" ry="16" fill="currentColor" opacity="0.45" />
      <path d="M18 32v10" stroke="currentColor" strokeWidth="2" opacity="0.5" strokeLinecap="round" />
      <path d="M12 42h12" stroke="currentColor" strokeWidth="2" opacity="0.45" strokeLinecap="round" />
    </svg>
  );
}

export function SpriteCrayon({ className }: SpriteProps) {
  return (
    <svg viewBox="0 0 40 48" className={cn("text-amber-400", className)} fill="none" aria-hidden>
      <path d="M8 38l18-28 8 6-18 28-8-6z" fill="currentColor" opacity="0.5" />
      <path d="M8 38l-2 6h10l2-6" fill="currentColor" opacity="0.65" />
      <path d="M26 10l8 6" stroke="currentColor" strokeWidth="1.5" opacity="0.35" />
    </svg>
  );
}

export function SpriteSparkBlob({ className }: SpriteProps) {
  return (
    <svg viewBox="0 0 44 44" className={cn("text-success", className)} fill="currentColor" aria-hidden>
      <path
        d="M22 2c4 6 10 4 12 10s8 6 8 12-4 10-2 14-8 6-14 4-8 8-14 6-10-6-14-10-2-12 4-14 2-10 10-12 14-8z"
        opacity="0.35"
      />
    </svg>
  );
}

export function SpriteHeart({ className }: SpriteProps) {
  return (
    <svg viewBox="0 0 40 36" className={cn("text-secondary", className)} fill="currentColor" aria-hidden>
      <path
        d="M20 32S4 20 4 12a8 8 0 0116 0 8 8 0 0116 0c0 8-16 20-16 20z"
        opacity="0.4"
      />
    </svg>
  );
}
