"use client";

import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import { localePath } from "@/lib/paths";

type Options = {
  manufacturers: string[];
  models: string[];
  locations: string[];
  countries: string[];
  fuelTypes: string[];
  transmissions: string[];
};

const SORTS = [
  "newest",
  "oldest",
  "price_asc",
  "price_desc",
  "year_desc",
  "year_asc",
  "hours_asc",
  "km_asc",
] as const;

export function CatalogFilters({
  locale,
  basePath,
  options,
  values,
  showCategory,
}: {
  locale: string;
  basePath: string;
  options: Options;
  values: Record<string, string | undefined>;
  showCategory?: boolean;
}) {
  const t = useTranslations("marketplace");
  const router = useRouter();

  function submit(form: HTMLFormElement) {
    const data = new FormData(form);
    const params = new URLSearchParams();
    data.forEach((value, key) => {
      if (typeof value === "string" && value.trim()) params.set(key, value.trim());
    });
    const qs = params.toString();
    router.push(`${localePath(locale, basePath)}${qs ? `?${qs}` : ""}`);
  }

  return (
    <form
      className="space-y-4 border border-border bg-card p-4"
      onSubmit={(e) => {
        e.preventDefault();
        submit(e.currentTarget);
      }}
    >
      <div className="flex items-center justify-between">
        <h2 className="text-sm normal-case tracking-normal">{t("filters")}</h2>
        <button
          type="button"
          className="text-xs text-muted-foreground underline"
          onClick={() => router.push(localePath(locale, basePath))}
        >
          {t("reset")}
        </button>
      </div>

      <Field label={t("sortBy")}>
        <select name="sort" defaultValue={values.sort ?? "newest"} className="h-9 w-full border border-border bg-white px-2 text-sm">
          {SORTS.map((s) => (
            <option key={s} value={s}>
              {t(`sort.${s}`)}
            </option>
          ))}
        </select>
      </Field>

      {showCategory && (
        <Field label={t("filter.category")}>
          <select name="category" defaultValue={values.category ?? ""} className="h-9 w-full border border-border bg-white px-2 text-sm">
            <option value="">{t("filter.all")}</option>
            <option value="excavators">Excavators</option>
            <option value="trucks">Trucks</option>
            <option value="other-machinery">Other</option>
          </select>
        </Field>
      )}

      <Field label={t("filter.manufacturer")}>
        <select name="manufacturer" defaultValue={values.manufacturer ?? ""} className="h-9 w-full border border-border bg-white px-2 text-sm">
          <option value="">{t("filter.all")}</option>
          {options.manufacturers.map((v) => (
            <option key={v}>{v}</option>
          ))}
        </select>
      </Field>

      <Field label={t("filter.model")}>
        <input name="model" defaultValue={values.model ?? ""} className="h-9 w-full border border-border bg-white px-2 text-sm" />
      </Field>

      <div className="grid grid-cols-2 gap-2">
        <Field label={`${t("filter.year")} min`}>
          <input name="yearMin" type="number" defaultValue={values.yearMin ?? ""} className="h-9 w-full border border-border bg-white px-2 text-sm" />
        </Field>
        <Field label={`${t("filter.year")} max`}>
          <input name="yearMax" type="number" defaultValue={values.yearMax ?? ""} className="h-9 w-full border border-border bg-white px-2 text-sm" />
        </Field>
      </div>

      <div className="grid grid-cols-2 gap-2">
        <Field label={`${t("filter.price")} min`}>
          <input name="priceMin" type="number" defaultValue={values.priceMin ?? ""} className="h-9 w-full border border-border bg-white px-2 text-sm" />
        </Field>
        <Field label={`${t("filter.price")} max`}>
          <input name="priceMax" type="number" defaultValue={values.priceMax ?? ""} className="h-9 w-full border border-border bg-white px-2 text-sm" />
        </Field>
      </div>

      <Field label={t("filter.location")}>
        <select name="location" defaultValue={values.location ?? ""} className="h-9 w-full border border-border bg-white px-2 text-sm">
          <option value="">{t("filter.all")}</option>
          {options.locations.map((v) => (
            <option key={v}>{v}</option>
          ))}
        </select>
      </Field>

      <Field label={t("filter.country")}>
        <select name="country" defaultValue={values.country ?? ""} className="h-9 w-full border border-border bg-white px-2 text-sm">
          <option value="">{t("filter.all")}</option>
          {options.countries.map((v) => (
            <option key={v}>{v}</option>
          ))}
        </select>
      </Field>

      <Field label={`${t("filter.hours")} max`}>
        <input name="hoursMax" type="number" defaultValue={values.hoursMax ?? ""} className="h-9 w-full border border-border bg-white px-2 text-sm" />
      </Field>
      <Field label={`${t("filter.km")} max`}>
        <input name="kmMax" type="number" defaultValue={values.kmMax ?? ""} className="h-9 w-full border border-border bg-white px-2 text-sm" />
      </Field>

      <Field label={t("filter.fuel")}>
        <select name="fuelType" defaultValue={values.fuelType ?? ""} className="h-9 w-full border border-border bg-white px-2 text-sm">
          <option value="">{t("filter.all")}</option>
          {options.fuelTypes.map((v) => (
            <option key={v}>{v}</option>
          ))}
        </select>
      </Field>

      <Field label={t("filter.transmission")}>
        <select name="transmission" defaultValue={values.transmission ?? ""} className="h-9 w-full border border-border bg-white px-2 text-sm">
          <option value="">{t("filter.all")}</option>
          {options.transmissions.map((v) => (
            <option key={v}>{v}</option>
          ))}
        </select>
      </Field>

      <Field label={t("filter.power")}>
        <input name="enginePower" defaultValue={values.enginePower ?? ""} className="h-9 w-full border border-border bg-white px-2 text-sm" />
      </Field>

      <Field label={t("filter.condition")}>
        <select name="condition" defaultValue={values.condition ?? ""} className="h-9 w-full border border-border bg-white px-2 text-sm">
          <option value="">{t("filter.all")}</option>
          <option value="new">{t("condition.new")}</option>
          <option value="used">{t("condition.used")}</option>
          <option value="refurbished">{t("condition.refurbished")}</option>
        </select>
      </Field>

      <Field label={t("filter.availability")}>
        <select name="availability" defaultValue={values.availability ?? ""} className="h-9 w-full border border-border bg-white px-2 text-sm">
          <option value="">{t("filter.all")}</option>
          <option value="immediately">Immediately</option>
          <option value="short">Short notice</option>
          <option value="on_order">On order</option>
        </select>
      </Field>

      <button type="submit" className="h-10 w-full bg-navy text-xs font-semibold uppercase tracking-wider text-white">
        {t("apply")}
      </button>
    </form>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block space-y-1 text-xs font-medium text-muted-foreground">
      <span>{label}</span>
      {children}
    </label>
  );
}
