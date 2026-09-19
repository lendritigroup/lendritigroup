"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useTranslations } from "next-intl";
import { Mail, Menu, Phone } from "lucide-react";
import { useState } from "react";
import { COMPANY } from "@/lib/company";
import { localePath } from "@/lib/paths";
import { defaultLocale, locales, type Locale } from "@/i18n/config";
import { LanguageSwitcher } from "./LanguageSwitcher";
import { BrandLogo } from "./BrandLogo";
import { GermanyMark } from "./GermanyMark";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { cn } from "@/lib/utils";

function currentLocale(pathname: string) {
  const first = pathname.split("/").filter(Boolean)[0];
  return locales.includes(first as Locale) ? (first as Locale) : defaultLocale;
}

export function Header() {
  const t = useTranslations("nav");
  const pathname = usePathname();
  const locale = currentLocale(pathname);
  const [open, setOpen] = useState(false);

  const links = [
    { href: "/", key: "home" },
    { href: "/marketplace", key: "marketplace" },
    { href: "/excavators", key: "excavators" },
    { href: "/trucks", key: "trucks" },
    { href: "/other-machinery", key: "other" },
    { href: "/about", key: "about" },
    { href: "/contact", key: "contact" },
  ] as const;

  return (
    <header className="sticky top-0 z-50">
      <div className="bg-navy-deep text-white/80">
        <div className="container-lg flex flex-wrap items-center justify-between gap-2 py-1.5 text-xs">
          <div className="flex flex-wrap items-center gap-x-4 gap-y-1">
            <a href={COMPANY.phoneHref} className="inline-flex items-center gap-1.5 hover:text-white">
              <Phone className="size-3.5" />
              {COMPANY.phone}
            </a>
            <a href={COMPANY.whatsappHref} className="hover:text-white" target="_blank" rel="noreferrer">
              WhatsApp {COMPANY.whatsapp}
            </a>
            <a href={COMPANY.germany.whatsappHref} className="inline-flex items-center gap-1.5 hover:text-white" target="_blank" rel="noreferrer">
              <GermanyMark />
              WhatsApp {COMPANY.germany.whatsapp}
            </a>
            <a href={COMPANY.emailHref} className="inline-flex items-center gap-1.5 hover:text-white">
              <Mail className="size-3.5" />
              {COMPANY.email}
            </a>
          </div>
          <p className="hidden lg:block">{COMPANY.addressOneLine}</p>
        </div>
      </div>
      <div className="border-b border-white/10 bg-navy text-white">
        <div className="container-lg flex h-[76px] items-center gap-4 md:h-20">
          <Link href={localePath(locale, "/")} className="shrink-0">
            <BrandLogo
              onDark
              priority
              width={180}
              height={180}
              imgClassName="h-14 w-auto md:h-16"
            />
          </Link>

          <nav className="hidden items-center gap-5 lg:flex">
            {links.map(({ href, key }) => {
              const full = localePath(locale, href);
              const active = pathname === full || (href !== "/" && pathname.startsWith(full));
              return (
                <Link
                  key={key}
                  href={full}
                  className={cn(
                    "text-[13px] font-semibold uppercase tracking-[0.12em] transition-colors hover:text-brass",
                    active ? "text-brass" : "text-white/85"
                  )}
                >
                  {t(key)}
                </Link>
              );
            })}
          </nav>

          <div className="ml-auto flex items-center gap-2">
            <LanguageSwitcher />
            <Button asChild size="sm" className="hidden bg-brass text-navy hover:bg-brass/90 md:inline-flex">
              <Link href={localePath(locale, "/sell")}>{t("sell")}</Link>
            </Button>
            <Sheet open={open} onOpenChange={setOpen}>
              <SheetTrigger asChild className="lg:hidden">
                <Button variant="ghost" size="icon" className="text-white hover:bg-white/10">
                  <Menu className="size-5" />
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-[300px] bg-navy text-white border-navy">
                <nav className="mt-10 flex flex-col gap-1">
                  {links.map(({ href, key }) => (
                    <Link
                      key={key}
                      href={localePath(locale, href)}
                      onClick={() => setOpen(false)}
                      className="px-2 py-3 text-lg font-semibold uppercase tracking-wide"
                    >
                      {t(key)}
                    </Link>
                  ))}
                  <Link href={localePath(locale, "/sell")} onClick={() => setOpen(false)} className="px-2 py-3 text-lg font-semibold uppercase">
                    {t("sell")}
                  </Link>
                  <div className="mt-4 px-2">
                    <LanguageSwitcher />
                  </div>
                </nav>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </header>
  );
}
