"use client";

import { useRouter } from "next/navigation";
import { LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import { supabase } from "@/lib/supabase";

export function SignOutButton() {
  const router = useRouter();
  const client = supabase;

  if (!client) return null;

  return (
    <Button
      type="button"
      variant="outline"
      className="gap-2 border-secondary/40 text-secondary hover:bg-secondary/10"
      data-interactive="true"
      onClick={async () => {
        await client.auth.signOut();
        router.push("/login");
      }}
    >
      <LogOut className="h-4 w-4 shrink-0" aria-hidden />
      خروج
    </Button>
  );
}
