import { setRequestLocale } from "next-intl/server";
import { getSiteContentDraft } from "@/lib/site-content";
import { SiteContentEditor } from "@/components/admin/SiteContentEditor";

type Props = { params: Promise<{ locale: string }> };

export default async function AdminContentPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);
  const initial = await getSiteContentDraft();

  return (
    <div>
      <h1 className="mb-2 text-3xl">Website texts</h1>
      <p className="mb-8 max-w-2xl text-sm text-muted-foreground">
        Edit the homepage headline and the About page sections. Changes appear immediately on the public site for each language.
      </p>
      <SiteContentEditor initial={initial} />
    </div>
  );
}
