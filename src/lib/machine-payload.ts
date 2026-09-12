import { machineSlug } from "./slug";

export function parseMachinePayload(body: Record<string, unknown>, existingSlug?: string) {
  const num = (v: unknown) => {
    if (v === "" || v == null) return null;
    if (typeof v === "string") {
      const raw = v.trim().replace(",", ".");
      if (raw === "") return null;
      const n = Number(raw);
      return Number.isFinite(n) ? n : null;
    }
    const n = Number(v);
    return Number.isFinite(n) ? n : null;
  };
  const category = String(body.category || "excavator");
  const manufacturer = String(body.manufacturer || "").trim();
  const model = String(body.model || "").trim();
  const year = num(body.year);
  const requestedSlug = typeof body.slug === "string" ? body.slug.trim() : "";
  const slug = requestedSlug || existingSlug || machineSlug(manufacturer, model, year);
  const num0 = (v: unknown) => num(v) ?? 0;

  return {
    slug,
    category,
    manufacturer,
    model,
    year,
    askingPrice: num(body.askingPrice),
    currency: String(body.currency || "EUR"),
    vatIncluded: Boolean(body.vatIncluded),
    priceOnRequest: Boolean(body.priceOnRequest) || num(body.askingPrice) == null,
    location: body.location ? String(body.location) : null,
    country: body.country ? String(body.country) : null,
    condition: body.condition ? String(body.condition) : null,
    availability: body.availability ? String(body.availability) : null,
    stockNumber: body.stockNumber ? String(body.stockNumber) : null,
    serialNumber: body.serialNumber ? String(body.serialNumber) : null,
    description: body.description ? String(body.description) : null,
    sellerInfo: body.sellerInfo ? String(body.sellerInfo) : null,
    additionalInfo: body.additionalInfo ? String(body.additionalInfo) : null,
    status: String(body.status || "draft"),
    featured: Boolean(body.featured),
    hours: num(body.hours),
    kilometres: num(body.kilometres),
    fuelType: body.fuelType ? String(body.fuelType) : null,
    transmission: body.transmission ? String(body.transmission) : null,
    enginePower: body.enginePower ? String(body.enginePower) : null,
    excavatorSpecs: (body.excavatorSpecs as object) || {},
    truckSpecs: (body.truckSpecs as object) || {},
    otherSpecs: (body.otherSpecs as object) || {},
    videoUrl: body.videoUrl ? String(body.videoUrl) : null,
    youtubeUrl: body.youtubeUrl ? String(body.youtubeUrl) : null,
    vimeoUrl: body.vimeoUrl ? String(body.vimeoUrl) : null,
    purchasePrice: num(body.purchasePrice),
    purchaseCurrency: String(body.purchaseCurrency || "EUR"),
    purchaseDate: body.purchaseDate ? new Date(String(body.purchaseDate)) : null,
    supplier: body.supplier ? String(body.supplier) : null,
    purchaseLocation: body.purchaseLocation ? String(body.purchaseLocation) : null,
    transportCost: num0(body.transportCost),
    repairCost: num0(body.repairCost),
    otherPurchaseCosts: num0(body.otherPurchaseCosts),
    seoTitle: body.seoTitle ? String(body.seoTitle) : null,
    seoDescription: body.seoDescription ? String(body.seoDescription) : null,
  };
}
