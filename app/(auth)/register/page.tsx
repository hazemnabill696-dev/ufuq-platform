"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { UserPlus, Mail, Lock, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { supabase } from "@/lib/supabase";

const schema = z
  .object({
    fullName: z.string().min(2, { message: "الاسم مطلوب" }),
    email: z.string().email({ message: "البريد غير صالح" }),
    password: z.string().min(8, { message: "كلمة المرور يجب أن تكون 8 أحرف على الأقل" }),
    confirm: z.string().min(8, { message: "أكد كلمة المرور" }),
    role: z.enum(["student", "parent", "teacher"]),
  })
  .refine((data) => data.password === data.confirm, {
    message: "كلمتا المرور غير متطابقتين",
    path: ["confirm"],
  });

type FormValues = z.infer<typeof schema>;

export default function RegisterPage() {
  const router = useRouter();
  const [formError, setFormError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      fullName: "",
      email: "",
      password: "",
      confirm: "",
      role: "student",
    },
  });

  const onSubmit = async (values: FormValues) => {
    setFormError(null);
    if (!supabase) {
      router.push("/student");
      return;
    }
    const { data, error } = await supabase.auth.signUp({
      email: values.email,
      password: values.password,
      options: {
        data: {
          full_name: values.fullName,
          role: values.role,
        },
      },
    });
    if (error) {
      setFormError("تعذر إنشاء الحساب. جرّب بريداً آخر أو تحقق من الاتصال.");
      return;
    }
    if (data.user && data.session) {
      await supabase.from("profiles").upsert({
        id: data.user.id,
        full_name: values.fullName,
        role: values.role,
      });
    }
    router.push("/student");
  };

  return (
    <Card className="rounded-card border-border/60 bg-white shadow-lg">
      <CardHeader className="space-y-2 text-center">
        <CardTitle className="text-3xl font-extrabold text-ufuq-text">إنشاء حساب</CardTitle>
        <p className="text-sm text-ufuq-muted">انضم إلى أُفُق</p>
      </CardHeader>
      <CardContent>
        <form className="space-y-4" onSubmit={handleSubmit(onSubmit)} noValidate>
          <div className="space-y-2">
            <label className="flex items-center gap-2 text-sm font-semibold text-ufuq-text" htmlFor="fullName">
              <User className="h-4 w-4 shrink-0 text-primary" aria-hidden />
              الاسم الكامل
            </label>
            <input
              id="fullName"
              type="text"
              autoComplete="name"
              className="h-12 w-full rounded-button border border-input bg-white px-4 text-ufuq-text outline-none ring-offset-background focus-visible:ring-2 focus-visible:ring-ring"
              data-interactive="true"
              {...register("fullName")}
            />
            {errors.fullName && (
              <p className="text-sm font-semibold text-secondary">{errors.fullName.message}</p>
            )}
          </div>
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
            <span className="flex items-center gap-2 text-sm font-semibold text-ufuq-text">نوع الحساب</span>
            <select
              id="role"
              className="h-12 w-full rounded-button border border-input bg-white px-4 text-ufuq-text outline-none ring-offset-background focus-visible:ring-2 focus-visible:ring-ring"
              data-interactive="true"
              {...register("role")}
            >
              <option value="student">طالب</option>
              <option value="parent">ولي أمر</option>
              <option value="teacher">معلم</option>
            </select>
            {errors.role && <p className="text-sm font-semibold text-secondary">{errors.role.message}</p>}
          </div>
          <div className="space-y-2">
            <label className="flex items-center gap-2 text-sm font-semibold text-ufuq-text" htmlFor="password">
              <Lock className="h-4 w-4 shrink-0 text-primary" aria-hidden />
              كلمة المرور
            </label>
            <input
              id="password"
              type="password"
              autoComplete="new-password"
              className="h-12 w-full rounded-button border border-input bg-white px-4 text-ufuq-text outline-none ring-offset-background focus-visible:ring-2 focus-visible:ring-ring"
              data-interactive="true"
              {...register("password")}
            />
            {errors.password && (
              <p className="text-sm font-semibold text-secondary">{errors.password.message}</p>
            )}
          </div>
          <div className="space-y-2">
            <label className="flex items-center gap-2 text-sm font-semibold text-ufuq-text" htmlFor="confirm">
              <Lock className="h-4 w-4 shrink-0 text-primary" aria-hidden />
              تأكيد كلمة المرور
            </label>
            <input
              id="confirm"
              type="password"
              autoComplete="new-password"
              className="h-12 w-full rounded-button border border-input bg-white px-4 text-ufuq-text outline-none ring-offset-background focus-visible:ring-2 focus-visible:ring-ring"
              data-interactive="true"
              {...register("confirm")}
            />
            {errors.confirm && (
              <p className="text-sm font-semibold text-secondary">{errors.confirm.message}</p>
            )}
          </div>
          {formError && <p className="text-sm font-semibold text-secondary">{formError}</p>}
          <Button type="submit" className="w-full gap-2" disabled={isSubmitting} data-interactive="true">
            <UserPlus className="h-5 w-5 shrink-0" aria-hidden />
            تسجيل
          </Button>
          <p className="text-center text-sm text-ufuq-muted">
            لديك حساب بالفعل؟{" "}
            <Link href="/login" className="font-bold text-primary hover:underline">
              سجّل الدخول
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
