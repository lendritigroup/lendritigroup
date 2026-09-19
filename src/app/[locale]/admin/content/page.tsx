import { setRequestLocale } from "next-intl/server";
import { getCategoryImages } from "@/lib/category-images";
import { getSiteContentDraft } from "@/lib/site-content";
import { CategoryImagesEditor } from "@/components/admin/CategoryImagesEditor";
import { SiteContentEditor } from "@/components/admin/SiteContentEditor";

type Props = { params: Promise<{ locale: string }> };

export default async function AdminContentPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);
  const [initial, categoryImages] = await Promise.all([getSiteContentDraft(), getCategoryImages()]);

  return (
    <div>
      <h1 className="mb-2 text-3xl">Website texts</h1>
      <p className="mb-8 max-w-2xl text-sm text-muted-foreground">
        Edit homepage category photos, the homepage headline and the About page sections. Changes appear immediately on the public site.
      </p>
      <div className="space-y-8">
        <CategoryImagesEditor initial={categoryImages} />
        <SiteContentEditor initial={initial} />
      </div>
    </div>
  );
}
