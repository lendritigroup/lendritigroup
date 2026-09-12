import { defineRouting } from "next-intl/routing";

export const routing = defineRouting({
  locales: ["sq", "en", "de"],
  defaultLocale: "sq",
  localePrefix: "as-needed",
  localeDetection: false,
});
