"use client";

import { useTranslations } from "next-intl";
import { LanguageSwitcher } from "@/components/layout/LanguageSwitcher";

const LOGO_BLUE = "#1F3C7B";

export function SplashPage({ locale }: { locale: string }) {
  const t = useTranslations("splash");

  return (
    <div
      className="min-h-screen flex flex-col items-center justify-center px-4 relative"
      style={{ backgroundColor: "#ffffff" }}
    >
      <div className="absolute top-4 right-4">
        <LanguageSwitcher variant="light" />
      </div>
      <div className="flex flex-col items-center gap-10">
        <div className="overflow-hidden rounded-sm w-[min(95vw,800px)] aspect-[4/3] shrink-0 flex items-center justify-center">
          <div
            className="w-full h-full"
            style={{
              backgroundImage: "url(/images/logo.png)",
              backgroundSize: "120%",
              backgroundRepeat: "no-repeat",
              backgroundPosition: "center 45%",
              mixBlendMode: "multiply",
            }}
            role="img"
            aria-label="Lendriti Group"
          />
        </div>
        <a
          href={`/${locale}/home`}
          className="text-xl font-bold tracking-widest uppercase transition-opacity hover:opacity-80"
          style={{ color: LOGO_BLUE }}
        >
          {t("enter")}
        </a>
      </div>
    </div>
  );
}
