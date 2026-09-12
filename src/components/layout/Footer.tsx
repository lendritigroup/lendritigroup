"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useTranslations } from "next-intl";
import { Mail, MapPin, Phone } from "lucide-react";
import { COMPANY } from "@/lib/company";
import { localePath } from "@/lib/paths";
import { defaultLocale, locales, type Locale } from "@/i18n/config";
import { BrandLogo } from "./BrandLogo";
import { LanguageSwitcher } from "./LanguageSwitcher";

export function Footer() {
  const t = useTranslations("nav");
  const tf = useTranslations("footer");
  const pathname = usePathname();
  const first = pathname.split("/").filter(Boolean)[0];
  const locale = locales.includes(first as Locale) ? (first as Locale) : defaultLocale;

  return (
    <footer className="mt-auto bg-navy text-white">
      <div className="container-lg grid gap-10 py-14 md:grid-cols-2 lg:grid-cols-4">
        <div>
          <BrandLogo onDark className="mb-4" width={160} height={52} imgClassName="h-12" />
          <p className="text-sm text-white/70">{tf("trading")}</p>
          <p className="mt-3 text-sm leading-relaxed text-white/70">{COMPANY.name}</p>
        </div>
        <div>
          <h3 className="mb-4 text-sm">{t("marketplace")}</h3>
          <nav className="flex flex-col gap-2 text-sm text-white/75">
            <Link href={localePath(locale, "/marketplace")} className="hover:text-brass">{t("marketplace")}</Link>
            <Link href={localePath(locale, "/excavators")} className="hover:text-brass">{t("excavators")}</Link>
            <Link href={localePath(locale, "/trucks")} className="hover:text-brass">{t("trucks")}</Link>
            <Link href={localePath(locale, "/other-machinery")} className="hover:text-brass">{t("other")}</Link>
          </nav>
        </div>
        <div>
          <h3 className="mb-4 text-sm">{t("about")}</h3>
          <nav className="flex flex-col gap-2 text-sm text-white/75">
            <Link href={localePath(locale, "/about")} className="hover:text-brass">{t("about")}</Link>
            <Link href={localePath(locale, "/contact")} className="hover:text-brass">{t("contact")}</Link>
            <Link href={localePath(locale, "/sell")} className="hover:text-brass">{t("sell")}</Link>
            <Link href={localePath(locale, "/login")} className="hover:text-brass">{t("login")}</Link>
          </nav>
        </div>
        <div>
          <h3 className="mb-4 text-sm">{t("contact")}</h3>
          <div className="space-y-3 text-sm text-white/75">
            <a href={COMPANY.phoneHref} className="flex items-start gap-2 hover:text-white">
              <Phone className="mt-0.5 size-4 shrink-0" />
              {COMPANY.phone}
            </a>
            <a href={COMPANY.whatsappHref} className="flex items-start gap-2 hover:text-white" target="_blank" rel="noreferrer">
              <Phone className="mt-0.5 size-4 shrink-0" />
              WhatsApp {COMPANY.whatsapp}
            </a>
            <a href={COMPANY.emailHref} className="flex items-start gap-2 hover:text-white">
              <Mail className="mt-0.5 size-4 shrink-0" />
              {COMPANY.email}
            </a>
            <p className="flex items-start gap-2">
              <MapPin className="mt-0.5 size-4 shrink-0" />
              <span>
                {COMPANY.addressLines.map((line) => (
                  <span key={line} className="block">{line}</span>
                ))}
              </span>
            </p>
          </div>
        </div>
      </div>
      <div className="border-t border-white/10">
        <div className="container-lg flex flex-col items-center justify-between gap-3 py-5 sm:flex-row">
          <p className="text-center text-xs text-white/50">
            © {new Date().getFullYear()} {COMPANY.name}. {tf("rights")}
          </p>
          <LanguageSwitcher />
        </div>
      </div>
    </footer>
  );
}
