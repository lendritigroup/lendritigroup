"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import { localePath } from "@/lib/paths";

export function LoginForm({ locale, next }: { locale: string; next?: string }) {
  const t = useTranslations("login");
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [pending, setPending] = useState(false);

  return (
    <form
      className="mt-6 space-y-4"
      onSubmit={async (e) => {
        e.preventDefault();
        setPending(true);
        setError(null);
        const form = new FormData(e.currentTarget);
        const res = await fetch("/api/auth/login", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            username: form.get("username"),
            password: form.get("password"),
          }),
        });
        setPending(false);
        if (!res.ok) {
          setError(t("error"));
          return;
        }
        router.push(next || localePath(locale, "/admin"));
        router.refresh();
      }}
    >
      <label className="block text-sm">
        {t("username")}
        <input name="username" type="text" required autoComplete="username" className="mt-1 h-10 w-full border border-border px-3" />
      </label>
      <label className="block text-sm">
        {t("password")}
        <input name="password" type="password" required autoComplete="current-password" className="mt-1 h-10 w-full border border-border px-3" />
      </label>
      {error && <p className="text-sm text-destructive">{error}</p>}
      <button disabled={pending} className="h-11 w-full bg-navy text-xs font-semibold uppercase tracking-wider text-white">
        {pending ? "..." : t("submit")}
      </button>
    </form>
  );
}
