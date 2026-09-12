"use client";

import { usePathname, useRouter } from "next/navigation";
import { locales, localeNames, defaultLocale, type Locale } from "@/i18n/config";

export function LanguageSwitcher() {
  const pathname = usePathname();
  const router = useRouter();

  const parts = pathname.split("/").filter(Boolean);
  const current = locales.includes(parts[0] as Locale) ? (parts[0] as Locale) : defaultLocale;
  const rest = locales.includes(parts[0] as Locale) ? parts.slice(1) : parts;

  return (
    <label className="sr-only">
      Language
      <select
        aria-label="Language"
        className="not-sr-only h-8 rounded-sm border border-white/20 bg-transparent px-2 text-xs tracking-wide text-white"
        value={current}
        onChange={(e) => {
          const next = e.target.value;
          const suffix = rest.length ? `/${rest.join("/")}` : "/";
          router.push(next === defaultLocale ? suffix : `/${next}${suffix === "/" ? "" : suffix}`);
        }}
      >
        {locales.map((loc) => (
          <option key={loc} value={loc} className="text-navy">
            {localeNames[loc]}
          </option>
        ))}
      </select>
    </label>
  );
}
