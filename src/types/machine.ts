import type { ListingStatus, MachineCategory } from "@/lib/company";

export type PublicPhoto = {
  id: string;
  url: string;
  alt: string | null;
  orderIndex: number;
  isMain: boolean;
};

export type PublicDocument = {
  id: string;
  url: string;
  title: string;
  type: string;
};

export type PublicMachine = {
  id: string;
  slug: string;
  category: MachineCategory;
  manufacturer: string;
  model: string;
  year: number | null;
  askingPrice: number | null;
  currency: string;
  vatIncluded: boolean;
  priceOnRequest: boolean;
  location: string | null;
  country: string | null;
  condition: string | null;
  availability: string | null;
  stockNumber: string | null;
  serialNumber: string | null;
  description: string | null;
  sellerInfo: string | null;
  additionalInfo: string | null;
  status: ListingStatus;
  featured: boolean;
  hours: number | null;
  kilometres: number | null;
  fuelType: string | null;
  transmission: string | null;
  enginePower: string | null;
  excavatorSpecs: Record<string, string>;
  truckSpecs: Record<string, string>;
  otherSpecs: Record<string, string>;
  videoUrl: string | null;
  youtubeUrl: string | null;
  vimeoUrl: string | null;
  seoTitle: string | null;
  seoDescription: string | null;
  createdAt: string;
  photos: PublicPhoto[];
  documents: PublicDocument[];
};

export type AdminMachine = PublicMachine & {
  purchasePrice: number | null;
  purchaseCurrency: string;
  purchaseDate: string | null;
  supplier: string | null;
  purchaseLocation: string | null;
  transportCost: number;
  repairCost: number;
  otherPurchaseCosts: number;
  actualSellingPrice: number | null;
  sellingCurrency: string;
  saleDate: string | null;
  buyer: string | null;
  sellingCosts: number;
  otherSaleCosts: number;
  saleNotes: string | null;
  updatedAt: string;
};

export type MachineFilters = {
  q?: string;
  category?: string;
  manufacturer?: string;
  model?: string;
  yearMin?: number;
  yearMax?: number;
  priceMin?: number;
  priceMax?: number;
  location?: string;
  country?: string;
  hoursMax?: number;
  kmMax?: number;
  fuelType?: string;
  transmission?: string;
  enginePower?: string;
  condition?: string;
  availability?: string;
  status?: string;
  sort?: string;
};

export type ReportFilters = {
  preset?: string;
  from?: string;
  to?: string;
  category?: string;
  manufacturer?: string;
  machineId?: string;
  sold?: string;
  result?: string;
};
