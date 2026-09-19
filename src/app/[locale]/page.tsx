import Image from "next/image";
import Link from "next/link";
import { setRequestLocale } from "next-intl/server";
import { getTranslations } from "next-intl/server";
import { ArrowRight, Mail } from "lucide-react";
import { COMPANY } from "@/lib/company";
import { GermanyFlag, KosovoFlag } from "@/components/layout/GermanyMark";
import { getRecentMachines, listPublicMachines } from "@/lib/machines";
import { CATEGORY_CARDS, getCategoryImages } from "@/lib/category-images";
import { getSiteTexts } from "@/lib/site-content";
import { localePath } from "@/lib/paths";
import { MachineCard } from "@/components/catalog/MachineCard";
import { CroppedPhoto } from "@/components/media/CroppedPhoto";

type Props = { params: Promise<{ locale: string }> };

export default async function HomePage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("home");
  const tn = await getTranslations("nav");

  const [recent, excavators, trucks, other, content, categoryImages] = await Promise.all([
    getRecentMachines(6),
    listPublicMachines({ category: "excavators" }),
    listPublicMachines({ category: "trucks" }),
    listPublicMachines({ category: "other-machinery" }),
    getSiteTexts(locale),
    getCategoryImages(),
  ]);

  const counts = {
    excavators: excavators.length,
    trucks: trucks.length,
    other: other.length,
  };
  const titles = {
    excavators: tn("excavators"),
    trucks: tn("trucks"),
    other: tn("other"),
  };
  const leads = {
    excavators: t("excavatorsLead"),
    trucks: t("trucksLead"),
    other: t("otherLead"),
  };
  const categories = CATEGORY_CARDS.map((card) => ({
    href: card.href,
    title: titles[card.id],
    lead: leads[card.id],
    count: counts[card.id],
    image: categoryImages[card.id],
  }));

  return (
    <div>
      <section className="relative isolate min-h-[70vh] overflow-hidden bg-navy text-white">
        <Image
          src="/images/hero-machinery-yard.png"
          alt="Lendriti Group heavy machinery yard"
          fill
          className="object-cover opacity-45"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-r from-navy-deep via-navy/85 to-navy/40" />
        <div className="container-lg relative z-10 flex min-h-[70vh] flex-col justify-center py-16">
          <p className="text-xs font-semibold uppercase tracking-[0.28em] text-brass">{t("heroEyebrow")}</p>
          <h1 className="mt-4 max-w-3xl text-4xl leading-tight md:text-6xl">{content["home.heroTitle"]}</h1>
          <p className="mt-5 max-w-2xl text-base text-white/80 md:text-lg">{content["home.heroSubtitle"]}</p>
          <form action={localePath(locale, "/marketplace")} className="mt-8 flex max-w-2xl flex-col gap-2 sm:flex-row">
            <input
              name="q"
              placeholder={t("searchPlaceholder")}
              className="h-12 flex-1 border-0 bg-white px-4 text-navy outline-none"
            />
            <button type="submit" className="h-12 bg-brass px-6 text-sm font-semibold uppercase tracking-wider text-navy">
              {t("search")}
            </button>
          </form>
          <div className="mt-6 flex flex-wrap gap-3">
            <a href={COMPANY.phoneHref} className="inline-flex h-11 items-center gap-2 bg-white px-5 text-xs font-semibold uppercase tracking-wider text-navy">
              <KosovoFlag /> {t("call")} {COMPANY.phone}
            </a>
          </div>
        </div>
      </section>

      <section className="container-lg py-16">
        <h2 className="text-2xl">{t("categoriesTitle")}</h2>
        <div className="mt-8 grid gap-5 md:grid-cols-3">
          {categories.map((c) => (
            <Link key={c.href} href={localePath(locale, c.href)} className="group overflow-hidden border border-border bg-card">
              <div className="relative aspect-[16/10] bg-muted">
                <CroppedPhoto
                  src={c.image.url}
                  alt={c.title}
                  focusX={c.image.focusX}
                  focusY={c.image.focusY}
                  zoom={c.image.zoom}
                />
              </div>
              <div className="p-5">
                <h3 className="text-xl">{c.title}</h3>
                <p className="mt-2 text-sm text-muted-foreground">{c.lead}</p>
                <p className="mt-3 text-xs uppercase tracking-wider text-navy">{c.count} · {t("viewCategory")}</p>
              </div>
            </Link>
          ))}
        </div>
      </section>

      <section className="bg-white py-10">
        <div className="container-lg">
          <Link
            href={localePath(locale, "/marketplace")}
            className="flex items-center justify-center border border-navy bg-white px-6 py-5 text-xl font-semibold tracking-wide text-navy hover:bg-navy hover:text-white"
          >
            {t("browseStock")}
          </Link>
        </div>
      </section>

      <section className="container-lg py-16">
        <h2 className="mb-8 text-2xl">{t("recent")}</h2>
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {recent.map((m) => (
            <MachineCard key={m.id} machine={m} locale={locale} />
          ))}
        </div>
      </section>

      <section className="bg-navy py-16 text-white">
        <div className="container-lg grid gap-10 md:grid-cols-2">
          <div>
            <h2 className="text-3xl">{t("aboutTitle")}</h2>
            <p className="mt-4 max-w-xl text-white/80">{content["home.aboutBody"]}</p>
            <Link href={localePath(locale, "/about")} className="mt-6 inline-flex items-center gap-2 text-sm font-semibold uppercase tracking-wider text-brass">
              {tn("about")} <ArrowRight className="size-4" />
            </Link>
          </div>
          <div>
            <h2 className="text-3xl">{t("contactTitle")}</h2>
            <p className="mt-4 text-white/80">{t("contactBody")}</p>
            <div className="mt-6 flex flex-wrap gap-3">
              <a href={COMPANY.phoneHref} className="inline-flex h-11 items-center gap-2 bg-white px-4 text-xs font-semibold uppercase tracking-wider text-navy">
                <KosovoFlag /> {t("call")}
              </a>
              <a href={COMPANY.whatsappHref} target="_blank" rel="noreferrer" className="inline-flex h-11 items-center gap-2 bg-[#1f7a4d] px-4 text-xs font-semibold uppercase tracking-wider text-white">
                <KosovoFlag /> {t("whatsapp")}
              </a>
              <a href={COMPANY.germany.whatsappHref} target="_blank" rel="noreferrer" className="inline-flex h-11 items-center gap-2 bg-[#1f7a4d] px-4 text-xs font-semibold uppercase tracking-wider text-white">
                <GermanyFlag /> {t("whatsapp")}
              </a>
              <a href={COMPANY.emailHref} className="inline-flex h-11 items-center gap-2 border border-white/30 px-4 text-xs font-semibold uppercase tracking-wider">
                <Mail className="size-4" /> {t("email")}
              </a>
            </div>
            <p className="mt-6 space-y-1 text-sm text-white/60">
              <span className="flex items-center gap-1.5"><KosovoFlag /> {COMPANY.phone}</span>
              {COMPANY.email}<br />
              {COMPANY.addressOneLine}
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
