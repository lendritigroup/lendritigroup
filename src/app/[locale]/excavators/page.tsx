import { setRequestLocale, getTranslations } from "next-intl/server";
import { MarketplacePage } from "@/components/catalog/MarketplacePage";

type Props = {
  params: Promise<{ locale: string }>;
  searchParams: Promise<Record<string, string | string[] | undefined>>;
};

export default async function Page({ params, searchParams }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("marketplace");
  return (
    <MarketplacePage
      locale={locale}
      title={t("excavatorsTitle")}
      basePath="/excavators"
      category="excavators"
      searchParams={await searchParams}
    />
  );
}
