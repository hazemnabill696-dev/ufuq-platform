"use client";

import { cn } from "@/lib/utils";
import {
  SpriteBalloon,
  SpriteCloud,
  SpriteCrayon,
  SpriteHeart,
  SpriteSparkBlob,
  SpriteStar,
} from "@/components/decoration/PlayfulSprites";

type PlayfulBackdropProps = {
  variant: "home" | "game";
  className?: string;
};

const motionFloat = "playful-float-9";
const motionFloatSlow = "playful-float-12";

/**
 * Decorative SVG layer only — pointer-events none, hidden from AT.
 * Sits behind content (z-0); wrap content in sibling with relative z-[1].
 */
export function PlayfulBackdrop({ variant, className }: PlayfulBackdropProps) {
  if (variant === "game") {
    return (
      <div
        className={cn(
          "pointer-events-none absolute inset-0 z-0 overflow-hidden select-none",
          className
        )}
        aria-hidden
      >
        <div className={cn("absolute -top-1 end-3 h-10 w-10 opacity-[0.28]", motionFloat)}>
          <SpriteStar className="h-full w-full" />
        </div>
        <div className="absolute top-1/3 start-1 h-11 w-11 opacity-[0.22]">
          <SpriteCloud className="h-full w-full" />
        </div>
        <div className={cn("absolute bottom-8 end-6 h-12 w-12 opacity-[0.26]", motionFloatSlow)}>
          <SpriteBalloon className="h-full w-full" />
        </div>
        <div className="absolute bottom-4 start-4 h-9 w-9 rotate-12 opacity-[0.3]">
          <SpriteCrayon className="h-full w-full" />
        </div>
        <div className="absolute top-1/2 end-0 h-8 w-8 translate-x-1/2 opacity-[0.2]">
          <SpriteSparkBlob className="h-full w-full" />
        </div>
      </div>
    );
  }

  return (
    <div
      className={cn("pointer-events-none absolute inset-0 z-0 overflow-hidden select-none", className)}
      aria-hidden
    >
      <div className={cn("absolute -top-2 end-4 h-12 w-12 opacity-[0.26] sm:end-8", motionFloat)}>
        <SpriteStar className="h-full w-full" />
      </div>
      <div className="absolute top-[18%] start-0 h-14 w-14 opacity-[0.2] sm:start-2">
        <SpriteCloud className="h-full w-full" />
      </div>
      <div className={cn("absolute top-[42%] end-1 h-11 w-11 opacity-[0.24] sm:end-4", motionFloatSlow)}>
        <SpriteBalloon className="h-full w-full" />
      </div>
      <div className="absolute top-[55%] start-3 h-10 w-10 -rotate-6 opacity-[0.25]">
        <SpriteCrayon className="h-full w-full" />
      </div>
      <div className="absolute bottom-[30%] end-6 hidden h-9 w-9 opacity-[0.18] sm:block">
        <SpriteHeart className="h-full w-full" />
      </div>
      <div className={cn("absolute bottom-24 start-6 h-10 w-10 opacity-[0.2]", motionFloat)}>
        <SpriteSparkBlob className="h-full w-full" />
      </div>
      <div className="absolute bottom-8 end-10 h-8 w-8 opacity-[0.22]">
        <SpriteStar className="h-full w-full text-warning" />
      </div>
      <div className="absolute top-[65%] start-1/4 h-7 w-7 opacity-[0.15]">
        <SpriteCloud className="h-full w-full scale-75" />
      </div>
    </div>
  );
}
