"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { ProductImage } from "@/components/ui/ProductImage";
import { useTranslations } from "next-intl";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import type { Product } from "@/types/database";

export function AdminProductsList({ locale }: { locale: string }) {
  const t = useTranslations("admin");
  const tCatalog = useTranslations("catalog");
  const [products, setProducts] = useState<(Product & { product_photos?: { url: string; is_main: boolean }[] })[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      const supabase = createClient();
      let query = supabase
        .from("products")
        .select("*, product_photos(url, is_main)")
        .eq("soft_deleted", false)
        .order("created_at", { ascending: false });

      if (search) {
        query = query.or(
          `title_sq.ilike.%${search}%,title_en.ilike.%${search}%,brand.ilike.%${search}%`
        );
      }

      const { data } = await query;
      setProducts((data as typeof products) ?? []);
      setLoading(false);
    };
    fetchProducts();
  }, [search]);

  const handleMarkSold = async (productId: string) => {
    const supabase = createClient();
    await supabase
      .from("products")
      .update({ status: "SOLD", sold_at: new Date().toISOString() })
      .eq("id", productId);
    setProducts((prev) =>
      prev.map((p) =>
        p.id === productId ? { ...p, status: "SOLD" as const } : p
      )
    );
  };

  const handleDelete = async (productId: string) => {
    if (!confirm("Soft delete this product?")) return;
    const supabase = createClient();
    await supabase
      .from("products")
      .update({ soft_deleted: true })
      .eq("id", productId);
    setProducts((prev) => prev.filter((p) => p.id !== productId));
  };

  const titleKey = `title_${locale}` as keyof Product;

  return (
    <div className="space-y-6">
      <Input
        placeholder={t("search")}
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="max-w-sm"
      />
      {loading ? (
        <p>Loading...</p>
      ) : (
        <div className="rounded-lg border overflow-hidden">
          <table className="w-full">
            <thead className="bg-muted">
              <tr>
                <th className="text-left p-4">Image</th>
                <th className="text-left p-4">Title</th>
                <th className="text-left p-4">Status</th>
                <th className="text-left p-4">Price</th>
                <th className="text-right p-4">Actions</th>
              </tr>
            </thead>
            <tbody>
              {products.map((product) => {
                const title = (product[titleKey] as string) || product.title_sq;
                const mainPhoto =
                  product.product_photos?.find((p) => p.is_main)?.url ||
                  product.product_photos?.[0]?.url ||
                  "/placeholder.svg";
                return (
                  <tr key={product.id} className="border-t">
                    <td className="p-4">
                      <div className="relative w-16 h-12 rounded overflow-hidden bg-muted">
                        <ProductImage
                          src={mainPhoto}
                          alt=""
                          className="object-cover"
                        />
                      </div>
                    </td>
                    <td className="p-4 font-medium">{title}</td>
                    <td className="p-4">
                      <Badge variant={product.status === "SOLD" ? "destructive" : "default"}>
                        {product.status}
                      </Badge>
                    </td>
                    <td className="p-4">
                      {product.price_on_request
                        ? "On request"
                        : product.price != null
                        ? `€${Number(product.price).toLocaleString()}`
                        : "—"}
                    </td>
                    <td className="p-4 text-right space-x-2">
                      <Button asChild size="sm" variant="outline">
                        <Link href={`/${locale}/admin/products/${product.id}/edit`}>
                          {t("editProduct")}
                        </Link>
                      </Button>
                      {product.status === "AVAILABLE" && (
                        <Button
                          size="sm"
                          variant="secondary"
                          onClick={() => handleMarkSold(product.id)}
                        >
                          {t("markSold")}
                        </Button>
                      )}
                      <Button
                        size="sm"
                        variant="destructive"
                        onClick={() => handleDelete(product.id)}
                      >
                        {t("deleteProduct")}
                      </Button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
