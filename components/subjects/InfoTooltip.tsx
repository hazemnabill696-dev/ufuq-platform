"use client";

import { memo } from "react";
import { Info } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";

type InfoTooltipProps = {
  label: string;
  className?: string;
};

export const InfoTooltip = memo(function InfoTooltip({ label, className }: InfoTooltipProps) {
  return (
    <TooltipProvider delayDuration={200}>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            type="button"
            variant="ghost"
            size="sm"
            className={cn("h-10 gap-2 px-3 text-ufuq-muted hover:text-primary", className)}
            data-interactive="true"
            aria-label={`معلومات: ${label}`}
          >
            <Info className="h-5 w-5 shrink-0" aria-hidden />
            <span className="text-sm font-semibold">ⓘ معلومات</span>
          </Button>
        </TooltipTrigger>
        <TooltipContent side="top" className="text-right font-cairo leading-relaxed">
          {label}
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
});
