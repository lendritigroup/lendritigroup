import { setRequestLocale, getTranslations } from "next-intl/server";
import { ContactForm } from "@/components/contact/ContactForm";

type Props = { params: Promise<{ locale: string }> };

export default async function SellPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("sell");

  return (
    <div className="container-lg grid gap-10 py-12 lg:grid-cols-2">
      <div>
        <h1 className="text-4xl">{t("title")}</h1>
        <p className="mt-4 max-w-xl text-muted-foreground">{t("subtitle")}</p>
        <p className="mt-6 text-sm text-muted-foreground">{t("detailsHint")}</p>
      </div>
      <ContactForm variant="sell" />
    </div>
  );
}
