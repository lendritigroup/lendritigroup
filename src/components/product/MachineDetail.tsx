import Image from "next/image";
import Link from "next/link";
import { getTranslations } from "next-intl/server";
import { Mail, Phone } from "lucide-react";
import { COMPANY } from "@/lib/company";
import { formatMoney } from "@/lib/finance";
import { localePath } from "@/lib/paths";
import { fieldsForCategory } from "@/lib/specs";
import type { PublicMachine } from "@/types/machine";
import { ProductGallery } from "./ProductGallery";

export async function MachineDetail({
  machine,
  locale,
}: {
  machine: PublicMachine;
  locale: string;
}) {
  const t = await getTranslations({ locale, namespace: "product" });
  const tm = await getTranslations({ locale, namespace: "marketplace" });
  const title = `${machine.manufacturer} ${machine.model}${machine.year ? ` ${machine.year}` : ""}`;
  const specs =
    machine.category === "excavator"
      ? machine.excavatorSpecs
      : machine.category === "truck"
        ? machine.truckSpecs
        : machine.otherSpecs;
  const fields = fieldsForCategory(machine.category);
  const specRows = fields
    .map((f) => ({ label: f.label, value: specs[f.key], unit: f.unit }))
    .filter((r) => r.value);

  const price =
    machine.priceOnRequest || machine.askingPrice == null
      ? t("priceOnRequest")
      : formatMoney(machine.askingPrice, machine.currency);

  const wa = `${COMPANY.whatsappHref}?text=${encodeURIComponent(`Inquiry: ${title} (${machine.stockNumber ?? machine.slug})`)}`;

  return (
    <div className="container-lg py-10">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Product",
            name: title,
            description: machine.seoDescription || machine.description,
            brand: machine.manufacturer,
            sku: machine.stockNumber,
            image: machine.photos.map((p) => p.url),
            offers: machine.askingPrice
              ? {
                  "@type": "Offer",
                  price: machine.askingPrice,
                  priceCurrency: machine.currency,
                  availability:
                    machine.status === "sold"
                      ? "https://schema.org/SoldOut"
                      : "https://schema.org/InStock",
                  seller: { "@type": "Organization", name: COMPANY.name },
                }
              : undefined,
          }),
        }}
      />
      <p className="text-xs uppercase tracking-[0.18em] text-muted-foreground">
        {machine.category} · {machine.stockNumber ?? machine.slug}
      </p>
      <div className="mt-2 flex flex-wrap items-end justify-between gap-4">
        <h1 className="text-3xl md:text-4xl">{title}</h1>
        <p className="price text-3xl">{price}</p>
      </div>
      <p className="mt-1 text-sm text-muted-foreground">
        {machine.vatIncluded ? tm("vatIncluded") : tm("vatExcluded")}
      </p>

      <div className="mt-8 grid gap-10 lg:grid-cols-[1.4fr_0.8fr]">
        <div>
          <div className="relative">
            <ProductGallery photos={machine.photos} title={title} />
            {machine.status === "sold" && (
              <span className="status-sold absolute left-4 top-4 z-10 px-3 py-1 text-sm font-bold tracking-[0.2em]">
                {t("soldBadge")}
              </span>
            )}
            {machine.status === "reserved" && (
              <span className="status-reserved absolute left-4 top-4 z-10 px-3 py-1 text-sm font-bold tracking-[0.2em]">
                {t("reservedBadge")}
              </span>
            )}
          </div>

          {machine.description && (
            <section className="mt-10">
              <h2 className="mb-3 text-xl">{t("description")}</h2>
              <p className="whitespace-pre-wrap text-muted-foreground">{machine.description}</p>
            </section>
          )}

          {specRows.length > 0 && (
            <section className="mt-10">
              <h2 className="mb-4 text-xl">{t("specifications")}</h2>
              <dl className="grid gap-0 border border-border bg-card sm:grid-cols-2">
                {specRows.map((row) => (
                  <div key={row.label} className="flex justify-between gap-4 border-b border-border px-4 py-3 text-sm">
                    <dt className="text-muted-foreground">{row.label}</dt>
                    <dd className="font-medium">
                      {row.value}
                      {row.unit ? ` ${row.unit}` : ""}
                    </dd>
                  </div>
                ))}
              </dl>
            </section>
          )}

          {machine.additionalInfo && (
            <section className="mt-10">
              <h2 className="mb-3 text-xl">{t("additional")}</h2>
              <p className="whitespace-pre-wrap text-muted-foreground">{machine.additionalInfo}</p>
            </section>
          )}

          {machine.documents.length > 0 && (
            <section className="mt-10">
              <h2 className="mb-3 text-xl">{t("documents")}</h2>
              <ul className="space-y-2 text-sm">
                {machine.documents.map((d) => (
                  <li key={d.id}>
                    <a href={d.url} className="text-navy underline" target="_blank" rel="noreferrer">
                      {d.title}
                    </a>
                  </li>
                ))}
              </ul>
            </section>
          )}

          {(machine.youtubeUrl || machine.vimeoUrl || machine.videoUrl) && (
            <section className="mt-10">
              <h2 className="mb-3 text-xl">{t("video")}</h2>
              {machine.youtubeUrl && (
                <iframe
                  className="aspect-video w-full border border-border"
                  src={embedYoutube(machine.youtubeUrl)}
                  title={`${title} video`}
                  allowFullScreen
                />
              )}
              {machine.vimeoUrl && (
                <iframe
                  className="aspect-video w-full border border-border"
                  src={embedVimeo(machine.vimeoUrl)}
                  title={`${title} video`}
                  allowFullScreen
                />
              )}
              {machine.videoUrl && (
                <video className="w-full border border-border" controls src={machine.videoUrl} />
              )}
            </section>
          )}
        </div>

        <aside className="space-y-5 lg:sticky lg:top-28 lg:self-start">
          <div className="border border-border bg-card p-5">
            <div className="mb-4 flex items-center gap-3">
              <Image src="/images/logo.png" alt={COMPANY.name} width={72} height={72} className="h-14 w-14 object-contain" />
              <div>
                <p className="font-semibold">{COMPANY.name}</p>
                <p className="text-xs text-muted-foreground">{COMPANY.city}, {COMPANY.country}</p>
              </div>
            </div>
            <dl className="space-y-2 text-sm">
              <Row label={t("year")} value={machine.year} />
              <Row label={t("hours")} value={machine.hours?.toLocaleString("de-DE")} />
              <Row label={t("km")} value={machine.kilometres?.toLocaleString("de-DE")} />
              <Row label={t("location")} value={[machine.location, machine.country].filter(Boolean).join(", ")} />
              <Row label={t("condition")} value={machine.condition} />
              <Row label={t("availability")} value={machine.availability} />
              <Row label={t("stock")} value={machine.stockNumber} />
              <Row label={t("serial")} value={machine.serialNumber} />
            </dl>
          </div>

          <div className="border border-border bg-card p-5">
            <h2 className="mb-3 text-lg normal-case tracking-normal">{t("contactTitle")}</h2>
            <div className="flex flex-col gap-2">
              <Link
                href={localePath(locale, "/contact")}
                className="inline-flex h-11 items-center justify-center bg-navy text-xs font-semibold uppercase tracking-wider text-white"
              >
                {t("contact")}
              </Link>
              <a href={wa} target="_blank" rel="noreferrer" className="inline-flex h-11 items-center justify-center bg-[#1f7a4d] text-xs font-semibold uppercase tracking-wider text-white">
                {t("whatsapp")}
              </a>
              <a href={COMPANY.phoneHref} className="inline-flex h-11 items-center justify-center border border-navy text-xs font-semibold uppercase tracking-wider text-navy">
                <Phone className="mr-2 size-4" /> {t("call")}
              </a>
              <a href={COMPANY.emailHref} className="inline-flex h-10 items-center justify-center text-sm text-navy underline">
                <Mail className="mr-2 size-4" /> {COMPANY.email}
              </a>
            </div>
            <p className="mt-4 text-xs text-muted-foreground">
              {COMPANY.phone}<br />
              WhatsApp {COMPANY.whatsapp}<br />
              DE {COMPANY.germany.phone}<br />
              WhatsApp DE {COMPANY.germany.whatsapp}<br />
              {COMPANY.addressOneLine}
            </p>
          </div>
        </aside>
      </div>
    </div>
  );
}

function Row({ label, value }: { label: string; value?: string | number | null }) {
  if (value == null || value === "") return null;
  return (
    <div className="flex justify-between gap-3 border-b border-border/70 py-1.5">
      <dt className="text-muted-foreground">{label}</dt>
      <dd className="capitalize">{value}</dd>
    </div>
  );
}

function embedYoutube(url: string) {
  const id = url.includes("watch?v=") ? url.split("watch?v=")[1]?.split("&")[0] : url.split("/").pop();
  return `https://www.youtube.com/embed/${id}`;
}

function embedVimeo(url: string) {
  const id = url.split("/").pop();
  return `https://player.vimeo.com/video/${id}`;
}
