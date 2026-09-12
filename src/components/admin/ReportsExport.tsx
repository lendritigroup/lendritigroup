"use client";

import { Button } from "@/components/ui/button";
import { useTranslations } from "next-intl";

export function ReportsExport({
  products,
}: {
  products: { id: string; status: string; price: number | null }[];
}) {
  const t = useTranslations("admin");

  const exportCsv = (filter?: "AVAILABLE" | "SOLD") => {
    const filtered = filter
      ? products.filter((p) => p.status === filter)
      : products;
    const headers = ["id", "status", "price"];
    const rows = filtered.map((p) =>
      [p.id, p.status, p.price ?? ""].join(",")
    );
    const csv = [headers.join(","), ...rows].join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = filter ? `products-${filter.toLowerCase()}.csv` : "products-all.csv";
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="flex gap-2">
      <Button variant="outline" onClick={() => exportCsv()}>
        {t("export")} (all)
      </Button>
      <Button variant="outline" onClick={() => exportCsv("AVAILABLE")}>
        {t("export")} (available)
      </Button>
      <Button variant="outline" onClick={() => exportCsv("SOLD")}>
        {t("export")} (sold)
      </Button>
    </div>
  );
}
