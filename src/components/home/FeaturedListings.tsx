import Link from "next/link";
import { ProductImage } from "@/components/ui/ProductImage";
import { getProducts } from "@/lib/supabase/queries";
import { Badge } from "@/components/ui/badge";
import { Truck, MapPin, Calendar } from "lucide-react";
import type { Product } from "@/types/database";

function ProductCard({
  product,
  locale,
  titleKey,
}: {
  product: Product & { product_photos?: { url: string; is_main: boolean; order_index: number }[] };
  locale: string;
  titleKey: "title_sq" | "title_en" | "title_de" | "title_sr" | "title_mk";
}) {
  const title = product[titleKey] || product.title_sq;
  const mainPhoto = product.product_photos?.find((p) => p.is_main)?.url ||
    product.product_photos?.[0]?.url ||
    "/placeholder.svg";

  const formatPrice = () => {
    if (product.price_on_request) return "—";
    if (product.price == null) return "—";
    return new Intl.NumberFormat("de-DE", {
      style: "currency",
      currency: "EUR",
      maximumFractionDigits: 0,
    }).format(Number(product.price));
  };

  return (
    <Link
      href={`/${locale}/produkt/${product.slug}`}
      className="group block rounded-xl border border-border bg-card overflow-hidden transition-all hover:border-primary/50 hover:shadow-lg"
    >
      <div className="relative aspect-[4/3] bg-muted">
        <ProductImage
          src={mainPhoto || "/placeholder.svg"}
          alt={title}
          className="object-cover group-hover:scale-105 transition-transform"
          sizes="(max-width: 768px) 50vw, 33vw"
        />
        <Badge
          className="absolute top-2 right-2"
          variant={product.status === "SOLD" ? "destructive" : "default"}
        >
          {product.status === "SOLD" ? "SOLD" : "AVAILABLE"}
        </Badge>
      </div>
      <div className="p-4">
        <h3 className="font-semibold line-clamp-2 group-hover:text-primary transition-colors">
          {title}
        </h3>
        <div className="mt-2 flex flex-wrap gap-2 text-xs text-muted-foreground">
          {product.year && (
            <span className="flex items-center gap-1">
              <Calendar className="size-3" />
              {product.year}
            </span>
          )}
          {product.hours != null && (
            <span>{product.hours.toLocaleString()}h</span>
          )}
          {product.km != null && (
            <span>{product.km.toLocaleString()} km</span>
          )}
          {product.location && (
            <span className="flex items-center gap-1">
              <MapPin className="size-3" />
              {product.location}
            </span>
          )}
        </div>
        <p className="mt-2 text-lg font-semibold text-primary">{formatPrice()}</p>
      </div>
    </Link>
  );
}

export async function FeaturedListings({ locale }: { locale: string }) {
  const { products } = await getProducts({ limit: 6, sort: "newest" });
  const titleKey = `title_${locale}` as "title_sq" | "title_en" | "title_de" | "title_sr" | "title_mk";

  if (products.length === 0) {
    return (
      <p className="text-muted-foreground text-center py-12">
        No products yet. Check back soon!
      </p>
    );
  }

  return (
    <div className="grid grid-cols-2 gap-4 sm:gap-6 lg:grid-cols-3">
      {products.map((product) => (
        <ProductCard
          key={product.id}
          product={product as Product & { product_photos?: { url: string; is_main: boolean; order_index: number }[] }}
          locale={locale}
          titleKey={titleKey}
        />
      ))}
    </div>
  );
}
