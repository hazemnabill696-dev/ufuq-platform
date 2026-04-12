"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Mail, Lock, LogIn } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { supabase } from "@/lib/supabase";

const schema = z.object({
  email: z.string().email({ message: "البريد غير صالح" }),
  password: z.string().min(8, { message: "كلمة المرور يجب أن تكون 8 أحرف على الأقل" }),
});

type FormValues = z.infer<typeof schema>;

export default function LoginPage() {
  const router = useRouter();
  const [formError, setFormError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: { email: "", password: "" },
  });

  const onSubmit = async (values: FormValues) => {
    setFormError(null);
    if (!supabase) {
      router.push("/student");
      return;
    }
    const { error } = await supabase.auth.signInWithPassword({
      email: values.email,
      password: values.password,
    });
    if (error) {
      setFormError("تعذر تسجيل الدخول. تحقق من البيانات أو اتصالك.");
      return;
    }
    router.push("/student");
  };

  return (
    <Card className="rounded-card border-border/60 bg-white shadow-lg">
      <CardHeader className="space-y-2 text-center">
        <CardTitle className="text-3xl font-extrabold text-ufuq-text">تسجيل الدخول</CardTitle>
        <p className="text-sm text-ufuq-muted">منصة أُفُق التعليمية</p>
      </CardHeader>
      <CardContent>
        <form className="space-y-4" onSubmit={handleSubmit(onSubmit)} noValidate>
          <div className="space-y-2">
            <label className="flex items-center gap-2 text-sm font-semibold text-ufuq-text" htmlFor="email">
              <Mail className="h-4 w-4 shrink-0 text-primary" aria-hidden />
              البريد الإلكتروني
            </label>
            <input
              id="email"
              type="email"
              autoComplete="email"
              className="h-12 w-full rounded-button border border-input bg-white px-4 text-ufuq-text outline-none ring-offset-background focus-visible:ring-2 focus-visible:ring-ring"
              data-interactive="true"
              {...register("email")}
            />
            {errors.email && <p className="text-sm font-semibold text-secondary">{errors.email.message}</p>}
          </div>
          <div className="space-y-2">
            <label className="flex items-center gap-2 text-sm font-semibold text-ufuq-text" htmlFor="password">
              <Lock className="h-4 w-4 shrink-0 text-primary" aria-hidden />
              كلمة المرور
            </label>
            <input
              id="password"
              type="password"
              autoComplete="current-password"
              className="h-12 w-full rounded-button border border-input bg-white px-4 text-ufuq-text outline-none ring-offset-background focus-visible:ring-2 focus-visible:ring-ring"
              data-interactive="true"
              {...register("password")}
            />
            {errors.password && (
              <p className="text-sm font-semibold text-secondary">{errors.password.message}</p>
            )}
          </div>
          {formError && <p className="text-sm font-semibold text-secondary">{formError}</p>}
          <Button type="submit" className="w-full gap-2" disabled={isSubmitting} data-interactive="true">
            <LogIn className="h-5 w-5 shrink-0" aria-hidden />
            دخول
          </Button>
          <p className="text-center text-sm text-ufuq-muted">
            ليس لديك حساب؟{" "}
            <Link href="/register" className="font-bold text-primary hover:underline">
              أنشئ حساباً
            </Link>
          </p>
          {!supabase && (
            <p className="text-center text-xs text-ufuq-muted">
              لم يتم ضبط Supabase؛ سيتم توجيهك مباشرة إلى صفحة المواد الدراسية للتجربة المحلية.
            </p>
          )}
        </form>
      </CardContent>
    </Card>
  );
}
