import Image from "next/image";
import Link from "next/link";
import { getTranslations } from "next-intl/server";
import { formatMoney, machineTitle } from "@/lib/finance";
import { localePath } from "@/lib/paths";
import { mainPhoto, publicPath } from "@/lib/machines";
import type { PublicMachine } from "@/types/machine";

export async function MachineCard({
  machine,
  locale,
}: {
  machine: PublicMachine;
  locale: string;
}) {
  const t = await getTranslations({ locale, namespace: "marketplace" });
  const href = localePath(locale, publicPath(machine));
  const photo = mainPhoto(machine);
  const usage =
    machine.category === "truck" && machine.kilometres != null
      ? `${machine.kilometres.toLocaleString("de-DE")} ${t("km")}`
      : machine.hours != null
        ? `${machine.hours.toLocaleString("de-DE")} ${t("hours")}`
        : null;

  return (
    <article className="group flex flex-col overflow-hidden border border-border bg-card shadow-sm">
      <Link href={href} className="relative block aspect-[4/3] overflow-hidden bg-muted">
        <Image
          src={photo}
          alt={machineTitle(machine.manufacturer, machine.model, machine.year)}
          fill
          className="object-cover transition-transform duration-300 group-hover:scale-[1.03]"
          sizes="(max-width: 768px) 100vw, 33vw"
        />
        {machine.status === "sold" && (
          <span className="status-sold absolute left-3 top-3 px-2.5 py-1 text-xs font-bold tracking-widest">
            {t("status.sold")}
          </span>
        )}
        {machine.status === "reserved" && (
          <span className="status-reserved absolute left-3 top-3 px-2.5 py-1 text-xs font-bold tracking-widest">
            {t("status.reserved")}
          </span>
        )}
        {machine.status === "active" && (
          <span className="status-active absolute left-3 top-3 px-2.5 py-1 text-xs font-bold tracking-widest">
            {t("status.active")}
          </span>
        )}
      </Link>
      <div className="flex flex-1 flex-col p-4">
        <p className="text-xs uppercase tracking-[0.14em] text-muted-foreground">
          {machine.category} · {machine.year ?? "—"}
        </p>
        <h3 className="mt-1 text-lg normal-case tracking-normal">
          <Link href={href} className="hover:text-navy">
            {machineTitle(machine.manufacturer, machine.model, machine.year)}
          </Link>
        </h3>
        <p className="price mt-2 text-xl">
          {machine.priceOnRequest || machine.askingPrice == null
            ? t("priceOnRequest")
            : formatMoney(machine.askingPrice, machine.currency)}
        </p>
        {machine.askingPrice != null && !machine.priceOnRequest && (
          <p className="mt-1 text-xs text-muted-foreground">
            {machine.vatIncluded ? t("vatIncluded") : t("vatExcluded")}
          </p>
        )}
        <dl className="mt-3 grid grid-cols-2 gap-x-3 gap-y-1 text-sm text-muted-foreground">
          {usage && (
            <div>
              <dt className="sr-only">Usage</dt>
              <dd>{usage}</dd>
            </div>
          )}
          {machine.location && (
            <div>
              <dt className="sr-only">Location</dt>
              <dd>{machine.location}{machine.country ? `, ${machine.country}` : ""}</dd>
            </div>
          )}
          {machine.condition && (
            <div>
              <dt className="sr-only">Condition</dt>
              <dd className="capitalize">{machine.condition}</dd>
            </div>
          )}
        </dl>
        {machine.description && (
          <p className="mt-3 line-clamp-2 text-sm text-muted-foreground">{machine.description}</p>
        )}
        <Link
          href={href}
          className="mt-4 inline-flex h-9 items-center justify-center border border-navy bg-navy px-3 text-xs font-semibold uppercase tracking-wider text-white hover:bg-navy-deep"
        >
          {t("viewDetails")}
        </Link>
      </div>
    </article>
  );
}
