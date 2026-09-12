import { prisma, withDatabase } from "@/lib/prisma";
import { locales, type Locale } from "@/i18n/config";

export const SITE_CONTENT_KEYS = [
  "home.heroTitle",
  "home.heroSubtitle",
  "home.aboutBody",
  "about.whatWeDoTitle",
  "about.whatWeDo",
  "about.whereTitle",
  "about.whereBody",
] as const;

export type SiteContentKey = (typeof SITE_CONTENT_KEYS)[number];

export type SiteContentField = {
  key: SiteContentKey;
  group: string;
  label: string;
  hint: string;
  rows: number;
};

export const SITE_CONTENT_FIELDS: SiteContentField[] = [
  {
    key: "home.heroTitle",
    group: "Homepage",
    label: "Hero title",
    hint: "Main headline on the homepage.",
    rows: 2,
  },
  {
    key: "home.heroSubtitle",
    group: "Homepage",
    label: "Hero subtitle",
    hint: "Text under the headline.",
    rows: 3,
  },
  {
    key: "home.aboutBody",
    group: "Homepage",
    label: "About paragraph",
    hint: "The paragraph in the dark section at the bottom of the homepage.",
    rows: 5,
  },
  {
    key: "about.whatWeDoTitle",
    group: "About page",
    label: "What we do — title",
    hint: "Heading for the first section, e.g. Çfarë bëjmë.",
    rows: 1,
  },
  {
    key: "about.whatWeDo",
    group: "About page",
    label: "What we do — text",
    hint: "One point per line.",
    rows: 6,
  },
  {
    key: "about.whereTitle",
    group: "About page",
    label: "Where we work — title",
    hint: "Heading for the second section, e.g. Ku punojmë.",
    rows: 1,
  },
  {
    key: "about.whereBody",
    group: "About page",
    label: "Where we work — text",
    hint: "Body text under the heading.",
    rows: 5,
  },
];

export const SITE_CONTENT_DEFAULTS: Record<SiteContentKey, Record<Locale, string>> = {
  "home.heroTitle": {
    sq: "Makineri profesionale. Çmime të qarta. Direkt nga oborri.",
    en: "Professional machinery. Clear prices. Direct from the yard.",
    de: "Professionelle Maschinen. Klare Preise. Direkt vom Hof.",
  },
  "home.heroSubtitle": {
    sq: "Lendriti Group SHPK tregton ekskavatorë, kamionë dhe pajisje të rënda të përdorura.",
    en: "Lendriti Group SHPK trades used excavators, trucks and heavy equipment for contractors across Europe.",
    de: "Lendriti Group SHPK handelt mit gebrauchten Baggern, Lkw und schwerer Technik.",
  },
  "home.aboutBody": {
    sq: "Ne blejmë makina, i përgatisim dhe i shesim me specifikime të plota. Nëse makina që ju duhet nuk është në shitje, ne e gjejmë për ty.",
    en: "We buy machines, prepare them and sell them with complete specifications. If the machine you need is not for sale, we find it for you.",
    de: "Wir kaufen Maschinen, bereiten sie auf und verkaufen sie mit vollständigen Angaben. Ist die gesuchte Maschine nicht im Verkauf, finden wir sie für Sie.",
  },
  "about.whatWeDoTitle": {
    sq: "Çfarë bëjmë",
    en: "What we do",
    de: "Was wir tun",
  },
  "about.whatWeDo": {
    sq: "Blejmë ekskavatorë, kamionë dhe pajisje të tjera në Evropë.\nShesim makina të kontrolluara me specifikime të plota.\nNëse ju duhet një makinë e caktuar, e gjejmë përmes rrjetit tonë.",
    en: "We buy excavators, trucks and other plant from fleets and private sellers in Europe.\nWe sell inspected machines from our yard with full specifications and honest condition reports.\nIf you need a specific machine, we source it through our network.",
    de: "Wir kaufen Bagger, Lkw und weitere Geräte in Europa.\nWir verkaufen geprüfte Maschinen mit vollständigen Angaben.\nFehlt eine bestimmte Maschine, beschaffen wir sie über unser Netzwerk.",
  },
  "about.whereTitle": {
    sq: "Ku punojmë",
    en: "Where we work",
    de: "Wo wir arbeiten",
  },
  "about.whereBody": {
    sq: "Oborri ynë është në Mitrovicë, Kosovë. Lëvizim rregullisht makina drejt BE-së, vendeve nordike dhe Ballkanit Perëndimor.",
    en: "Our yard is in Mitrovicë, Kosovo. We regularly move machines to and from the EU, the Nordics and the Western Balkans.",
    de: "Unser Hof liegt in Mitrovica, Kosovo. Wir bewegen regelmäßig Maschinen in die EU, nach Nordeuropa und auf den Westbalkan.",
  },
};

function localeField(locale: string) {
  if (locale === "en") return "contentEn" as const;
  if (locale === "de") return "contentDe" as const;
  return "contentSq" as const;
}

export function defaultSiteText(key: SiteContentKey, locale: string) {
  const loc = locales.includes(locale as Locale) ? (locale as Locale) : "sq";
  return SITE_CONTENT_DEFAULTS[key][loc];
}

export async function getSiteText(key: SiteContentKey, locale: string) {
  return withDatabase(async () => {
    const row = await prisma.pageContent.findUnique({ where: { key } });
    const value = row?.[localeField(locale)]?.trim();
    return value || defaultSiteText(key, locale);
  }, defaultSiteText(key, locale));
}

export async function getSiteTexts(locale: string) {
  const fallback = Object.fromEntries(
    SITE_CONTENT_KEYS.map((key) => [key, defaultSiteText(key, locale)])
  ) as Record<SiteContentKey, string>;

  return withDatabase(async () => {
    const rows = await prisma.pageContent.findMany({
      where: { key: { in: [...SITE_CONTENT_KEYS] } },
    });
    const byKey = Object.fromEntries(rows.map((row) => [row.key, row]));
    const field = localeField(locale);

    return Object.fromEntries(
      SITE_CONTENT_KEYS.map((key) => {
        const value = byKey[key]?.[field]?.trim();
        return [key, value || defaultSiteText(key, locale)];
      })
    ) as Record<SiteContentKey, string>;
  }, fallback);
}

export type SiteContentDraft = Record<SiteContentKey, Record<Locale, string>>;

export async function getSiteContentDraft(): Promise<SiteContentDraft> {
  const rows = await prisma.pageContent.findMany({
    where: { key: { in: [...SITE_CONTENT_KEYS] } },
  });
  const byKey = Object.fromEntries(rows.map((row) => [row.key, row]));

  return Object.fromEntries(
    SITE_CONTENT_KEYS.map((key) => [
      key,
      {
        sq: byKey[key]?.contentSq?.trim() || defaultSiteText(key, "sq"),
        en: byKey[key]?.contentEn?.trim() || defaultSiteText(key, "en"),
        de: byKey[key]?.contentDe?.trim() || defaultSiteText(key, "de"),
      },
    ])
  ) as SiteContentDraft;
}

export async function saveSiteContentDraft(draft: SiteContentDraft) {
  await prisma.$transaction(
    SITE_CONTENT_KEYS.map((key) =>
      prisma.pageContent.upsert({
        where: { key },
        create: {
          key,
          contentSq: draft[key].sq,
          contentEn: draft[key].en,
          contentDe: draft[key].de,
        },
        update: {
          contentSq: draft[key].sq,
          contentEn: draft[key].en,
          contentDe: draft[key].de,
        },
      })
    )
  );
}
