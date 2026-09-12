export type VehicleType = "TRUCK" | "EXCAVATOR" | "PART" | "ATTACHMENT" | "SERVICE";
export type ProductStatus = "AVAILABLE" | "SOLD";
export type Condition = "new" | "used";

export interface Category {
  id: string;
  parent_id: string | null;
  slug: string;
  name_sq: string;
  name_en: string;
  name_de: string;
  name_sr: string;
  name_mk: string;
  created_at: string;
}

export interface Product {
  id: string;
  slug: string;
  category_id: string;
  subcategory_id: string | null;
  vehicle_type: VehicleType | null;
  title_sq: string;
  title_en: string;
  title_de: string;
  title_sr: string;
  title_mk: string;
  description_sq: string | null;
  description_en: string | null;
  description_de: string | null;
  description_sr: string | null;
  description_mk: string | null;
  price: number | null;
  price_negotiable: boolean;
  price_on_request: boolean;
  status: ProductStatus;
  sold_at: string | null;
  year: number | null;
  brand: string | null;
  model: string | null;
  hours: number | null;
  km: number | null;
  condition: Condition | null;
  location: string | null;
  whatsapp: string | null;
  specs: Record<string, unknown>;
  soft_deleted: boolean;
  created_at: string;
  updated_at: string;
}

export interface ProductPhoto {
  id: string;
  product_id: string;
  url: string;
  order_index: number;
  is_main: boolean;
  created_at: string;
}

export interface Page {
  id: string;
  key: string;
  content_sq: string | null;
  content_en: string | null;
  content_de: string | null;
  content_sr: string | null;
  content_mk: string | null;
  updated_at: string;
}

export interface ContactMessage {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  message: string;
  product_id: string | null;
  status: "new" | "read";
  created_at: string;
}
