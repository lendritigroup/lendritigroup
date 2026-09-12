import { createServerSupabaseClient } from "./server";
import type { Product, Category } from "@/types/database";

const titleKey = (locale: string) => `title_${locale}` as "title_sq" | "title_en" | "title_de" | "title_sr" | "title_mk";
const descKey = (locale: string) => `description_${locale}` as "description_sq" | "description_en" | "description_de" | "description_sr" | "description_mk";

export async function getCategories(): Promise<Category[]> {
  const supabase = await createServerSupabaseClient();
  const { data, error } = await supabase
    .from("categories")
    .select("*")
    .is("parent_id", null)
    .order("name_sq");
  if (error) throw error;
  return data ?? [];
}

export async function getProducts(params?: {
  category?: string;
  status?: string;
  search?: string;
  minPrice?: number;
  maxPrice?: number;
  limit?: number;
  offset?: number;
  sort?: string;
}): Promise<{ products: Product[]; count: number }> {
  const supabase = await createServerSupabaseClient();
  let query = supabase
    .from("products")
    .select("*, product_photos(url, is_main, order_index)", { count: "exact" })
    .eq("soft_deleted", false);

  if (params?.category) {
    const { data: cats } = await supabase
      .from("categories")
      .select("id")
      .eq("slug", params.category);
    if (cats?.[0]) query = query.eq("category_id", cats[0].id);
  }
  if (params?.status) query = query.eq("status", params.status);
  if (params?.minPrice != null) query = query.gte("price", params.minPrice);
  if (params?.maxPrice != null) query = query.lte("price", params.maxPrice);
  if (params?.search) {
    query = query.or(
      `title_sq.ilike.%${params.search}%,title_en.ilike.%${params.search}%,brand.ilike.%${params.search}%,model.ilike.%${params.search}%`
    );
  }

  const sortMap: Record<string, string> = {
    newest: "created_at",
    priceAsc: "price",
    priceDesc: "price",
    year: "year",
    hours: "hours",
    km: "km",
  };
  const sortKey = params?.sort ? sortMap[params.sort] || "created_at" : "created_at";
  const ascending = params?.sort === "priceAsc" || params?.sort === "km" || params?.sort === "hours";
  query = query.order(sortKey, { ascending, nullsFirst: false });

  if (params?.limit) query = query.range(params.offset ?? 0, (params.offset ?? 0) + params.limit - 1);

  const { data, error, count } = await query;
  if (error) throw error;
  return { products: (data ?? []) as Product[], count: count ?? 0 };
}

export async function getProductBySlug(slug: string): Promise<(Product & { product_photos?: { url: string; is_main: boolean; order_index: number }[] }) | null> {
  const supabase = await createServerSupabaseClient();
  const { data, error } = await supabase
    .from("products")
    .select("*, product_photos(url, is_main, order_index)")
    .eq("slug", slug)
    .eq("soft_deleted", false)
    .single();
  if (error || !data) return null;
  return data as Product & { product_photos?: { url: string; is_main: boolean; order_index: number }[] };
}

export async function getPageContent(key: string): Promise<Record<string, string | null>> {
  const supabase = await createServerSupabaseClient();
  const { data, error } = await supabase
    .from("pages")
    .select("content_sq, content_en, content_de, content_sr, content_mk")
    .eq("key", key)
    .single();
  if (error || !data) return {};
  return data;
}
