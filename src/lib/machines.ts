import type { Machine, Photo, Document } from "@prisma/client";
import { prisma, withDatabase } from "./prisma";
import { CATEGORY_FROM_SLUG, type ListingStatus, type MachineCategory } from "./company";
import { specsRecord } from "./specs";
import type { AdminMachine, MachineFilters, PublicMachine } from "@/types/machine";

type MachineWithMedia = Machine & { photos: Photo[]; documents: Document[] };

const PUBLIC_STATUSES: ListingStatus[] = ["active", "reserved", "sold"];

function toPublic(m: MachineWithMedia): PublicMachine {
  return {
    id: m.id,
    slug: m.slug,
    category: m.category as MachineCategory,
    manufacturer: m.manufacturer,
    model: m.model,
    year: m.year,
    askingPrice: m.askingPrice,
    currency: m.currency,
    vatIncluded: m.vatIncluded,
    priceOnRequest: m.priceOnRequest,
    location: m.location,
    country: m.country,
    condition: m.condition,
    availability: m.availability,
    stockNumber: m.stockNumber,
    serialNumber: m.serialNumber,
    description: m.description,
    sellerInfo: m.sellerInfo,
    additionalInfo: m.additionalInfo,
    status: m.status as ListingStatus,
    featured: m.featured,
    hours: m.hours,
    kilometres: m.kilometres,
    fuelType: m.fuelType,
    transmission: m.transmission,
    enginePower: m.enginePower,
    excavatorSpecs: specsRecord(m.excavatorSpecs),
    truckSpecs: specsRecord(m.truckSpecs),
    otherSpecs: specsRecord(m.otherSpecs),
    videoUrl: m.videoUrl,
    youtubeUrl: m.youtubeUrl,
    vimeoUrl: m.vimeoUrl,
    seoTitle: m.seoTitle,
    seoDescription: m.seoDescription,
    createdAt: m.createdAt.toISOString(),
    photos: m.photos
      .slice()
      .sort((a, b) => a.orderIndex - b.orderIndex)
      .map((p) => ({
        id: p.id,
        url: p.url,
        alt: p.alt,
        orderIndex: p.orderIndex,
        isMain: p.isMain,
      })),
    documents: m.documents.map((d) => ({
      id: d.id,
      url: d.url,
      title: d.title,
      type: d.type,
    })),
  };
}

export function toAdmin(m: MachineWithMedia): AdminMachine {
  return {
    ...toPublic(m),
    purchasePrice: m.purchasePrice,
    purchaseCurrency: m.purchaseCurrency,
    purchaseDate: m.purchaseDate?.toISOString() ?? null,
    supplier: m.supplier,
    purchaseLocation: m.purchaseLocation,
    transportCost: m.transportCost,
    repairCost: m.repairCost,
    otherPurchaseCosts: m.otherPurchaseCosts,
    actualSellingPrice: m.actualSellingPrice,
    sellingCurrency: m.sellingCurrency,
    saleDate: m.saleDate?.toISOString() ?? null,
    buyer: m.buyer,
    sellingCosts: m.sellingCosts,
    otherSaleCosts: m.otherSaleCosts,
    saleNotes: m.saleNotes,
    updatedAt: m.updatedAt.toISOString(),
  };
}

function applyFilters(params: MachineFilters, publicOnly: boolean) {
  const and: Record<string, unknown>[] = [];

  if (publicOnly) {
    and.push({ status: { in: params.status ? [params.status] : PUBLIC_STATUSES } });
  } else if (params.status) {
    and.push({ status: params.status });
  }

  if (params.category) {
    const cat = CATEGORY_FROM_SLUG[params.category] ?? params.category;
    and.push({ category: cat });
  }
  if (params.manufacturer) and.push({ manufacturer: { contains: params.manufacturer } });
  if (params.model) and.push({ model: { contains: params.model } });
  if (params.location) and.push({ location: { contains: params.location } });
  if (params.country) and.push({ country: { contains: params.country } });
  if (params.fuelType) and.push({ fuelType: params.fuelType });
  if (params.transmission) and.push({ transmission: params.transmission });
  if (params.enginePower) and.push({ enginePower: { contains: params.enginePower } });
  if (params.condition) and.push({ condition: params.condition });
  if (params.availability) and.push({ availability: params.availability });
  if (params.yearMin) and.push({ year: { gte: params.yearMin } });
  if (params.yearMax) and.push({ year: { lte: params.yearMax } });
  if (params.priceMin) and.push({ askingPrice: { gte: params.priceMin } });
  if (params.priceMax) and.push({ askingPrice: { lte: params.priceMax } });
  if (params.hoursMax) and.push({ hours: { lte: params.hoursMax } });
  if (params.kmMax) and.push({ kilometres: { lte: params.kmMax } });
  if (params.q) {
    and.push({
      OR: [
        { manufacturer: { contains: params.q } },
        { model: { contains: params.q } },
        { description: { contains: params.q } },
        { stockNumber: { contains: params.q } },
        { location: { contains: params.q } },
      ],
    });
  }

  return and.length ? { AND: and } : {};
}

function orderBy(sort?: string) {
  switch (sort) {
    case "oldest":
      return { createdAt: "asc" as const };
    case "price_asc":
      return { askingPrice: "asc" as const };
    case "price_desc":
      return { askingPrice: "desc" as const };
    case "year_desc":
      return { year: "desc" as const };
    case "year_asc":
      return { year: "asc" as const };
    case "hours_asc":
      return { hours: "asc" as const };
    case "km_asc":
      return { kilometres: "asc" as const };
    default:
      return { createdAt: "desc" as const };
  }
}

/** Keep for-sale listings first; sold items always follow, in the same secondary order. */
function availableFirst<T extends { status: string }>(machines: T[]): T[] {
  return machines.slice().sort((a, b) => Number(a.status === "sold") - Number(b.status === "sold"));
}

const include = { photos: true, documents: true };

export async function listPublicMachines(params: MachineFilters = {}) {
  return withDatabase(async () => {
    const machines = await prisma.machine.findMany({
      where: applyFilters({ ...params, status: params.status }, true),
      include,
      orderBy: orderBy(params.sort),
    });
    return availableFirst(machines.map(toPublic));
  }, []);
}

export async function listPublicByCategory(categorySlug: string, params: MachineFilters = {}) {
  return listPublicMachines({ ...params, category: categorySlug });
}

export async function getFeaturedMachines(limit = 4) {
  return withDatabase(async () => {
    const machines = await prisma.machine.findMany({
      where: { status: "active", featured: true },
      include,
      orderBy: { createdAt: "desc" },
      take: limit,
    });
    return machines.map(toPublic);
  }, []);
}

export async function getRecentMachines(limit = 6) {
  return withDatabase(async () => {
    const machines = await prisma.machine.findMany({
      where: { status: "active" },
      include,
      orderBy: { createdAt: "desc" },
      take: limit,
    });
    return machines.map(toPublic);
  }, []);
}

export async function getPublicMachine(categorySlug: string, slug: string) {
  const category = CATEGORY_FROM_SLUG[categorySlug];
  if (!category) return null;
  return withDatabase(async () => {
    const machine = await prisma.machine.findFirst({
      where: {
        slug,
        category,
        status: { in: ["active", "reserved", "sold"] },
      },
      include,
    });
    return machine ? toPublic(machine) : null;
  }, null);
}

export async function getFilterOptions() {
  return withDatabase(async () => {
    const machines = await prisma.machine.findMany({
      where: { status: { in: PUBLIC_STATUSES } },
      select: {
        manufacturer: true,
        model: true,
        location: true,
        country: true,
        fuelType: true,
        transmission: true,
      },
    });
    const uniq = (key: keyof (typeof machines)[number]) =>
      [...new Set(machines.map((m) => m[key]).filter(Boolean) as string[])].sort();
    return {
      manufacturers: uniq("manufacturer"),
      models: uniq("model"),
      locations: uniq("location"),
      countries: uniq("country"),
      fuelTypes: uniq("fuelType"),
      transmissions: uniq("transmission"),
    };
  }, {
    manufacturers: [],
    models: [],
    locations: [],
    countries: [],
    fuelTypes: [],
    transmissions: [],
  });
}

export async function listAdminMachines() {
  const machines = await prisma.machine.findMany({
    include,
    orderBy: { createdAt: "desc" },
  });
  return machines.map(toAdmin);
}

export async function getAdminMachine(id: string) {
  const machine = await prisma.machine.findUnique({ where: { id }, include });
  return machine ? toAdmin(machine) : null;
}

export async function getAdminMachineBySlug(slug: string) {
  const machine = await prisma.machine.findUnique({ where: { slug }, include });
  return machine ? toAdmin(machine) : null;
}

export function publicPath(machine: { category: string; slug: string }) {
  const slug =
    machine.category === "excavator"
      ? "excavators"
      : machine.category === "truck"
        ? "trucks"
        : "other-machinery";
  return `/${slug}/${machine.slug}`;
}

export function mainPhoto(machine: { photos: PublicPhotoLike[] }) {
  return (
    machine.photos.find((p) => p.isMain)?.url ||
    machine.photos[0]?.url ||
    "/images/placeholder-machine.svg"
  );
}

type PublicPhotoLike = { url: string; isMain: boolean };
