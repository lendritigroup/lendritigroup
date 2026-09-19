import { setRequestLocale, getTranslations } from "next-intl/server";
import Image from "next/image";
import { COMPANY } from "@/lib/company";
import { KosovoFlag } from "@/components/layout/GermanyMark";
import { getSiteTexts } from "@/lib/site-content";

type Props = { params: Promise<{ locale: string }> };

export default async function AboutPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("about");
  const content = await getSiteTexts(locale);
  const whatWeDo = content["about.whatWeDo"]
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean);

  return (
    <div>
      <section className="bg-navy py-16 text-white">
        <div className="container-lg">
          <p className="text-xs uppercase tracking-[0.25em] text-brass">{COMPANY.name}</p>
          <h1 className="mt-3 max-w-3xl text-4xl md:text-5xl">{t("title")}</h1>
          <p className="mt-6 max-w-2xl text-white/80">{t("lead")}</p>
        </div>
      </section>
      <section className="container-lg grid gap-10 py-16 lg:grid-cols-2">
        <div>
          <h2 className="text-2xl">{content["about.whatWeDoTitle"]}</h2>
          <ul className="mt-6 space-y-4 text-muted-foreground">
            {whatWeDo.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
          <h2 className="mt-10 text-2xl">{content["about.whereTitle"]}</h2>
          <p className="mt-4 whitespace-pre-wrap text-muted-foreground">{content["about.whereBody"]}</p>
          <p className="mt-6 text-sm">
            {COMPANY.addressLines.map((l) => (
              <span key={l} className="block">{l}</span>
            ))}
            <a href={COMPANY.phoneHref} className="mt-3 inline-flex items-center gap-1.5 text-navy"><KosovoFlag /> {COMPANY.phone}</a>
            <a href={COMPANY.emailHref} className="block text-navy">{COMPANY.email}</a>
          </p>
        </div>
        <div className="relative min-h-[320px] overflow-hidden border border-border">
          <Image src="/images/hero-machinery-yard.png" alt="Lendriti Group yard" fill className="object-cover" />
        </div>
      </section>
    </div>
  );
}
