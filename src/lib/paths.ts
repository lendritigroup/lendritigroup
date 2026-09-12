import { defaultLocale } from "@/i18n/config";

export function localePath(locale: string, path: string) {
  const clean = path.startsWith("/") ? path : `/${path}`;
  if (!locale || locale === defaultLocale) return clean;
  return `/${locale}${clean}`;
}

export function parseSearchParams(search: Record<string, string | string[] | undefined>) {
  const get = (key: string) => {
    const v = search[key];
    return typeof v === "string" ? v : undefined;
  };
  const num = (key: string) => {
    const v = get(key);
    return v ? Number(v) : undefined;
  };
  return {
    q: get("q"),
    category: get("category"),
    manufacturer: get("manufacturer"),
    model: get("model"),
    yearMin: num("yearMin"),
    yearMax: num("yearMax"),
    priceMin: num("priceMin"),
    priceMax: num("priceMax"),
    location: get("location"),
    country: get("country"),
    hoursMax: num("hoursMax"),
    kmMax: num("kmMax"),
    fuelType: get("fuelType"),
    transmission: get("transmission"),
    enginePower: get("enginePower"),
    condition: get("condition"),
    availability: get("availability"),
    status: get("status"),
    sort: get("sort"),
  };
}
