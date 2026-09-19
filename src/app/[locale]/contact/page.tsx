import { setRequestLocale, getTranslations } from "next-intl/server";
import { Mail, MapPin } from "lucide-react";
import { COMPANY } from "@/lib/company";
import { ContactForm } from "@/components/contact/ContactForm";
import { GermanyFlag, KosovoFlag } from "@/components/layout/GermanyMark";

type Props = {
  params: Promise<{ locale: string }>;
};

export default async function ContactPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("contact");

  return (
    <div className="container-lg grid gap-10 py-12 lg:grid-cols-2">
      <div>
        <h1 className="text-4xl">{t("title")}</h1>
        <p className="mt-4 max-w-xl text-muted-foreground">{t("subtitle")}</p>
        <div className="mt-8 space-y-4 text-sm">
          <p className="flex gap-3"><KosovoFlag className="mt-0.5" /><a href={COMPANY.phoneHref} className="hover:underline">{COMPANY.phone}</a></p>
          <p className="flex gap-3"><KosovoFlag className="mt-0.5" /><a href={COMPANY.whatsappHref} className="hover:underline">WhatsApp {COMPANY.whatsapp}</a></p>
          <p className="flex gap-3"><GermanyFlag className="mt-0.5" /><a href={COMPANY.germany.whatsappHref} className="hover:underline">WhatsApp {COMPANY.germany.whatsapp}</a></p>
          <p className="flex gap-3"><Mail className="size-4 mt-0.5" /><a href={COMPANY.emailHref} className="hover:underline">{COMPANY.email}</a></p>
          <p className="flex gap-3"><MapPin className="size-4 mt-0.5" /><span>{COMPANY.addressLines.join(", ")}</span></p>
        </div>
      </div>
      <ContactForm />
    </div>
  );
}
