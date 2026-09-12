"use client";

import { useTranslations } from "next-intl";
import { useRouter, usePathname } from "next/navigation";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";

const categories = [
  { value: "all", labelKey: "all" },
  { value: "kamionetat", labelKey: "trucks" },
  { value: "bagerat", labelKey: "excavators" },
  { value: "pjes-kembimi", labelKey: "parts" },
  { value: "pajisje", labelKey: "attachments" },
  { value: "sherbime", labelKey: "services" },
];

export function HeroSearch() {
  const t = useTranslations("home");
  const router = useRouter();
  const pathname = usePathname();
  const locale = pathname.split("/")[1] || "sq";
  const [category, setCategory] = useState("all");
  const [keyword, setKeyword] = useState("");
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");

  const handleSearch = () => {
    const params = new URLSearchParams();
    if (category && category !== "all") params.set("category", category);
    if (keyword) params.set("q", keyword);
    if (minPrice) params.set("minPrice", minPrice);
    if (maxPrice) params.set("maxPrice", maxPrice);
    router.push(`/${locale}/katalogu?${params.toString()}`);
  };

  return (
    <div className="flex flex-col gap-4 rounded-xl border border-border bg-card p-4 shadow-sm md:flex-row md:items-end md:gap-2">
      <div className="flex-1">
        <label className="text-xs font-medium text-muted-foreground mb-1 block">{t("category")}</label>
        <Select value={category} onValueChange={setCategory}>
          <SelectTrigger>
            <SelectValue placeholder={t("category")} />
          </SelectTrigger>
          <SelectContent>
            {categories.map((c) => (
              <SelectItem key={c.value} value={c.value}>
                {c.labelKey === "all" ? "—" : t(`categories.${c.labelKey}`)}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      <div className="flex-[2]">
        <label className="text-xs font-medium text-muted-foreground mb-1 block">{t("searchPlaceholder")}</label>
        <Input
          placeholder={t("searchPlaceholder")}
          value={keyword}
          onChange={(e) => setKeyword(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleSearch()}
        />
      </div>
      <div className="flex gap-2">
        <div className="flex-1">
          <label className="text-xs font-medium text-muted-foreground mb-1 block">{t("priceRange")}</label>
          <div className="flex gap-1">
            <Input
              type="number"
              placeholder="Min"
              value={minPrice}
              onChange={(e) => setMinPrice(e.target.value)}
              className="w-24"
            />
            <Input
              type="number"
              placeholder="Max"
              value={maxPrice}
              onChange={(e) => setMaxPrice(e.target.value)}
              className="w-24"
            />
          </div>
        </div>
        <Button onClick={handleSearch} className="shrink-0 self-end" aria-label={t("search")}>
          <Search className="size-4 mr-2" />
          {t("search")}
        </Button>
      </div>
    </div>
  );
}
