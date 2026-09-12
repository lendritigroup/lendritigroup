"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ProductImage } from "@/components/ui/ProductImage";
import { useTranslations } from "next-intl";
import { SlidersHorizontal } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Sheet,
  SheetContent,
  SheetTrigger,
} from "@/components/ui/sheet";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { CatalogFilters } from "./CatalogFilters";
import type { Product } from "@/types/database";

export function CatalogClient({
  locale,
  initialCategory,
  initialSearch,
  initialMinPrice,
  initialMaxPrice,
  initialStatus,
  initialSort,
}: {
  locale: string;
  initialCategory?: string;
  initialSearch?: string;
  initialMinPrice?: string;
  initialMaxPrice?: string;
  initialStatus?: string;
  initialSort?: string;
}) {
  const t = useTranslations("catalog");
  const router = useRouter();
  const [products, setProducts] = useState<(Product & { product_photos?: { url: string; is_main: boolean; order_index: number }[] })[]>([]);
  const [count, setCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [filters, setFilters] = useState({
    category: initialCategory || "",
    search: initialSearch || "",
    minPrice: initialMinPrice || "",
    maxPrice: initialMaxPrice || "",
    status: initialStatus || "",
    sort: initialSort || "newest",
  });
  const [page, setPage] = useState(0);
  const limit = 12;

  const titleKey = `title_${locale}` as keyof Product;

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      const params = new URLSearchParams();
      if (filters.category) params.set("category", filters.category);
      if (filters.search) params.set("q", filters.search);
      if (filters.minPrice) params.set("minPrice", filters.minPrice);
      if (filters.maxPrice) params.set("maxPrice", filters.maxPrice);
      if (filters.status) params.set("status", filters.status);
      params.set("sort", filters.sort);
      params.set("limit", String(limit));
      params.set("offset", String(page * limit));

      const res = await fetch(`/api/products?${params.toString()}`);
      const data = await res.json();
      setProducts(data.products ?? []);
      setCount(data.count ?? 0);
      setLoading(false);
    };
    fetchProducts();
  }, [filters, page]);

  const updateFilters = (newFilters: Partial<typeof filters>) => {
    setFilters((prev) => ({ ...prev, ...newFilters }));
    setPage(0);
  };

  const formatPrice = (product: Product) => {
    if (product.price_on_request) return "—";
    if (product.price == null) return "—";
    return new Intl.NumberFormat("de-DE", {
      style: "currency",
      currency: "EUR",
      maximumFractionDigits: 0,
    }).format(Number(product.price));
  };

  return (
    <div className="flex gap-8">
      <aside className="hidden lg:block w-64 shrink-0">
        <CatalogFilters
          filters={filters}
          onFiltersChange={updateFilters}
          locale={locale}
        />
      </aside>

      <div className="flex-1 min-w-0">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
          <p className="text-sm text-muted-foreground">
            {count} {t("results")}
          </p>
          <div className="flex items-center gap-2">
            <Sheet open={filtersOpen} onOpenChange={setFiltersOpen}>
              <SheetTrigger asChild className="lg:hidden">
                <Button variant="outline" size="sm">
                  <SlidersHorizontal className="size-4 mr-2" />
                  {t("filters")}
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="w-[300px]">
                <CatalogFilters
                  filters={filters}
                  onFiltersChange={(f) => {
                    updateFilters(f);
                    setFiltersOpen(false);
                  }}
                  locale={locale}
                />
              </SheetContent>
            </Sheet>
            <Select
              value={filters.sort}
              onValueChange={(v) => updateFilters({ sort: v })}
            >
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder={t("sortBy")} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="newest">{t("sort.newest")}</SelectItem>
                <SelectItem value="priceAsc">{t("sort.priceAsc")}</SelectItem>
                <SelectItem value="priceDesc">{t("sort.priceDesc")}</SelectItem>
                <SelectItem value="year">{t("sort.year")}</SelectItem>
                <SelectItem value="hours">{t("sort.hours")}</SelectItem>
                <SelectItem value="km">{t("sort.km")}</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {loading ? (
          <div className="grid grid-cols-2 gap-4 sm:gap-6 xl:grid-cols-3">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="rounded-xl border bg-card animate-pulse h-80" />
            ))}
          </div>
        ) : products.length === 0 ? (
          <p className="text-center py-16 text-muted-foreground">{t("noResults")}</p>
        ) : (
          <>
            <div className="grid grid-cols-2 gap-4 sm:gap-6 xl:grid-cols-3">
              {products.map((product) => {
                const title = (product[titleKey] as string) || product.title_sq;
                const mainPhoto =
                  product.product_photos?.find((p) => p.is_main)?.url ||
                  product.product_photos?.[0]?.url ||
                  "/placeholder.svg";
                return (
                  <Link
                    key={product.id}
                    href={`/${locale}/produkt/${product.slug}`}
                    className="group block rounded-xl border border-border bg-card overflow-hidden transition-all hover:border-primary/50 hover:shadow-lg"
                  >
                    <div className="relative aspect-[4/3] bg-muted">
                      <ProductImage
                        src={mainPhoto}
                        alt={title}
                        className="object-cover group-hover:scale-105 transition-transform"
                        sizes="(max-width: 768px) 50vw, 33vw"
                      />
                      <Badge
                        className="absolute top-2 right-2"
                        variant={product.status === "SOLD" ? "destructive" : "default"}
                      >
                        {product.status === "SOLD" ? t("status.sold") : t("status.available")}
                      </Badge>
                    </div>
                    <div className="p-4">
                      <h3 className="font-semibold line-clamp-2 group-hover:text-primary transition-colors">
                        {title}
                      </h3>
                      <div className="mt-2 flex flex-wrap gap-2 text-xs text-muted-foreground">
                        {product.year && <span>{product.year}</span>}
                        {product.hours != null && (
                          <span>{product.hours.toLocaleString()}h</span>
                        )}
                        {product.km != null && (
                          <span>{product.km.toLocaleString()} km</span>
                        )}
                        {product.location && <span>{product.location}</span>}
                      </div>
                      <p className="mt-2 text-lg font-semibold text-primary">
                        {formatPrice(product)}
                      </p>
                    </div>
                  </Link>
                );
              })}
            </div>
            {page * limit + products.length < count && (
              <div className="mt-8 text-center">
                <Button
                  variant="outline"
                  onClick={() => setPage((p) => p + 1)}
                >
                  {t("loadMore")}
                </Button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
