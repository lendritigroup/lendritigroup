export const locales = ["sq", "en", "de"] as const;
export type Locale = (typeof locales)[number];

export const defaultLocale: Locale = "sq";

export const localeNames: Record<Locale, string> = {
  sq: "Shqip",
  en: "English",
  de: "Deutsch",
};
