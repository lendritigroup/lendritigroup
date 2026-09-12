import { setRequestLocale, getTranslations } from "next-intl/server";
import { redirect } from "next/navigation";
import { getSession } from "@/lib/auth";
import { localePath } from "@/lib/paths";
import { LoginForm } from "@/components/admin/LoginForm";
import { BrandLogo } from "@/components/layout/BrandLogo";

type Props = {
  params: Promise<{ locale: string }>;
  searchParams: Promise<{ next?: string }>;
};

export default async function LoginPage({ params, searchParams }: Props) {
  const { locale } = await params;
  const { next } = await searchParams;
  setRequestLocale(locale);
  const session = await getSession();
  if (session) redirect(next || localePath(locale, "/admin"));
  const t = await getTranslations("login");

  return (
    <div className="container-lg flex min-h-[70vh] items-center justify-center py-16">
      <div className="w-full max-w-md border border-border bg-card p-8">
        <BrandLogo className="mb-4" width={160} height={80} imgClassName="h-20" />
        <h1 className="text-2xl">{t("title")}</h1>
        <p className="mt-2 text-sm text-muted-foreground">{t("subtitle")}</p>
        <LoginForm locale={locale} next={next} />
      </div>
    </div>
  );
}
