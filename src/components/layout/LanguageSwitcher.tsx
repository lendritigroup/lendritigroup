"use client";

import { usePathname, useRouter } from "next/navigation";
import { locales, defaultLocale, type Locale } from "@/i18n/config";

const SHORT: Record<Locale, string> = { sq: "SQ", en: "EN", de: "DE" };
import { cn } from "@/lib/utils";

export function LanguageSwitcher({
  variant = "dark",
}: {
  variant?: "dark" | "light";
}) {
  const pathname = usePathname();
  const router = useRouter();

  const parts = pathname.split("/").filter(Boolean);
  const current = locales.includes(parts[0] as Locale) ? (parts[0] as Locale) : defaultLocale;
  const rest = locales.includes(parts[0] as Locale) ? parts.slice(1) : parts;

  function go(next: Locale) {
    const suffix = rest.length ? `/${rest.join("/")}` : "/";
    router.push(next === defaultLocale ? suffix : `/${next}${suffix === "/" ? "" : suffix}`);
  }

  return (
    <div
      role="group"
      aria-label="Language"
      className={cn(
        "inline-flex overflow-hidden rounded-sm border text-[11px] font-semibold uppercase tracking-[0.14em]",
        variant === "dark" ? "border-white/25" : "border-[#1F3C7B]/25"
      )}
    >
      {locales.map((loc) => {
        const active = loc === current;
        return (
          <button
            key={loc}
            type="button"
            onClick={() => go(loc)}
            className={cn(
              "px-2.5 py-1.5 transition-colors",
              variant === "dark"
                ? active
                  ? "bg-brass text-navy"
                  : "text-white/85 hover:bg-white/10"
                : active
                  ? "bg-[#1F3C7B] text-white"
                  : "text-[#1F3C7B] hover:bg-[#1F3C7B]/10"
            )}
            aria-pressed={active}
          >
            {SHORT[loc]}
          </button>
        );
      })}
    </div>
  );
}
