import { getTranslations } from "next-intl/server";
import { getFilterOptions, listPublicMachines } from "@/lib/machines";
import { parseSearchParams } from "@/lib/paths";
import { MachineCard } from "./MachineCard";
import { CatalogFilters } from "./CatalogFilters";

export async function MarketplacePage({
  locale,
  title,
  basePath,
  category,
  searchParams,
  showCategory,
}: {
  locale: string;
  title: string;
  basePath: string;
  category?: string;
  searchParams: Record<string, string | string[] | undefined>;
  showCategory?: boolean;
}) {
  const t = await getTranslations({ locale, namespace: "marketplace" });
  const filters = parseSearchParams(searchParams);
  const [machines, options] = await Promise.all([
    listPublicMachines({ ...filters, category: category ?? filters.category }),
    getFilterOptions(),
  ]);

  const values = Object.fromEntries(
    Object.entries(filters).map(([k, v]) => [k, v == null ? undefined : String(v)])
  );

  return (
    <div className="container-lg py-10">
      <div className="mb-8">
        <p className="text-xs uppercase tracking-[0.2em] text-brass">Lendriti Group SHPK</p>
        <h1 className="mt-2 text-3xl md:text-4xl">{title}</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          {machines.length} {t("results")}
        </p>
      </div>
      <div className="grid gap-8 lg:grid-cols-[280px_1fr]">
        <aside>
          <CatalogFilters
            locale={locale}
            basePath={basePath}
            options={options}
            values={values}
            showCategory={showCategory}
          />
        </aside>
        <div>
          {machines.length === 0 ? (
            <p className="border border-dashed border-border bg-card p-10 text-center text-muted-foreground">
              {t("noResults")}
            </p>
          ) : (
            <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
              {machines.map((machine) => (
                <MachineCard key={machine.id} machine={machine} locale={locale} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
