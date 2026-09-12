"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { Category } from "@/types/database";
import type { Product } from "@/types/database";

const schema = z.object({
  slug: z.string().min(2),
  category_id: z.string().uuid(),
  title_sq: z.string().min(2),
  title_en: z.string().min(2),
  title_de: z.string().min(2),
  title_sr: z.string().min(2),
  title_mk: z.string().min(2),
  description_sq: z.string().optional(),
  description_en: z.string().optional(),
  description_de: z.string().optional(),
  description_sr: z.string().optional(),
  description_mk: z.string().optional(),
  price: z.number().optional().nullable(),
  price_negotiable: z.boolean(),
  price_on_request: z.boolean(),
  status: z.enum(["AVAILABLE", "SOLD"]),
  year: z.number().optional().nullable(),
  brand: z.string().optional(),
  model: z.string().optional(),
  hours: z.number().optional().nullable(),
  km: z.number().optional().nullable(),
  condition: z.enum(["new", "used"]).optional().nullable(),
  location: z.string().optional(),
  whatsapp: z.string().optional(),
});

type FormData = z.infer<typeof schema>;

export function ProductForm({
  locale,
  categories,
  product,
}: {
  locale: string;
  categories: { id: string; slug: string; name_sq: string }[];
  product?: Product & { product_photos?: { url: string }[] };
}) {
  const router = useRouter();
  const [saving, setSaving] = useState(false);

  const { register, handleSubmit, formState: { errors }, setValue, watch } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: product
      ? {
          slug: product.slug,
          category_id: product.category_id,
          title_sq: product.title_sq,
          title_en: product.title_en,
          title_de: product.title_de,
          title_sr: product.title_sr,
          title_mk: product.title_mk,
          description_sq: product.description_sq ?? "",
          description_en: product.description_en ?? "",
          description_de: product.description_de ?? "",
          description_sr: product.description_sr ?? "",
          description_mk: product.description_mk ?? "",
          price: product.price ? Number(product.price) : null,
          price_negotiable: product.price_negotiable,
          price_on_request: product.price_on_request,
          status: product.status,
          year: product.year,
          brand: product.brand ?? "",
          model: product.model ?? "",
          hours: product.hours,
          km: product.km,
          condition: product.condition,
          location: product.location ?? "",
          whatsapp: product.whatsapp ?? "",
        }
      : {
          category_id: categories[0]?.id ?? "",
          status: "AVAILABLE",
          price_negotiable: false,
          price_on_request: false,
        },
  });

  const [submitError, setSubmitError] = useState<string | null>(null);

  const onSubmit = async (data: FormData) => {
    setSaving(true);
    setSubmitError(null);
    const payload = {
      ...data,
      price: data.price ?? null,
      year: data.year ?? null,
      hours: data.hours ?? null,
      km: data.km ?? null,
      condition: data.condition ?? null,
      description_sq: data.description_sq || null,
      description_en: data.description_en || null,
      description_de: data.description_de || null,
      description_sr: data.description_sr || null,
      description_mk: data.description_mk || null,
      brand: data.brand || null,
      model: data.model || null,
      location: data.location || null,
      whatsapp: data.whatsapp || null,
    };

    try {
      const url = "/api/admin/products";
      if (product) {
        const res = await fetch(url, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          credentials: "same-origin",
          body: JSON.stringify({ ...payload, id: product.id }),
        });
        const json = await res.json();
        if (!res.ok) {
          throw new Error(json.error || "Update failed");
        }
      } else {
        const res = await fetch(url, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          credentials: "same-origin",
          body: JSON.stringify(payload),
        });
        const json = await res.json();
        if (!res.ok) {
          throw new Error(json.error || "Create failed");
        }
      }
      router.push(`/${locale}/admin/products`);
      router.refresh();
    } catch (err) {
      setSubmitError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setSaving(false);
    }
  };

  const locales = ["sq", "en", "de", "sr", "mk"] as const;

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-8 max-w-2xl">
      <div>
        <Label>Slug</Label>
        <Input {...register("slug")} className="mt-1" />
        {errors.slug && <p className="text-sm text-destructive">{errors.slug.message}</p>}
      </div>
      <div>
        <Label>Category</Label>
        <Select
          value={watch("category_id") || ""}
          onValueChange={(v) => setValue("category_id", v)}
        >
          <SelectTrigger className="mt-1">
            <SelectValue placeholder="Select category" />
          </SelectTrigger>
          <SelectContent>
            {categories.map((c) => (
              <SelectItem key={c.id} value={c.id}>
                {c.name_sq}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      {locales.map((loc) => (
        <div key={loc}>
          <Label>Title ({loc})</Label>
          <Input
            {...register(`title_${loc}` as const)}
            className="mt-1"
          />
        </div>
      ))}
      {locales.map((loc) => (
        <div key={loc}>
          <Label>Description ({loc})</Label>
          <Textarea
            {...register(`description_${loc}` as const)}
            rows={3}
            className="mt-1"
          />
        </div>
      ))}
      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <Label>Price (EUR)</Label>
          <Input
            type="number"
            {...register("price", { valueAsNumber: true })}
            className="mt-1"
          />
        </div>
        <div>
          <Label>Status</Label>
          <Select
            value={watch("status")}
            onValueChange={(v) => setValue("status", v as "AVAILABLE" | "SOLD")}
          >
            <SelectTrigger className="mt-1">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="AVAILABLE">Available</SelectItem>
              <SelectItem value="SOLD">Sold</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
      <div className="flex gap-4">
        <label className="flex items-center gap-2">
          <input type="checkbox" {...register("price_negotiable")} />
          Price negotiable
        </label>
        <label className="flex items-center gap-2">
          <input type="checkbox" {...register("price_on_request")} />
          Price on request
        </label>
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <Label>Year</Label>
          <Input
            type="number"
            {...register("year", { valueAsNumber: true })}
            className="mt-1"
          />
        </div>
        <div>
          <Label>Brand</Label>
          <Input {...register("brand")} className="mt-1" />
        </div>
        <div>
          <Label>Model</Label>
          <Input {...register("model")} className="mt-1" />
        </div>
        <div>
          <Label>Hours</Label>
          <Input
            type="number"
            {...register("hours", { valueAsNumber: true })}
            className="mt-1"
          />
        </div>
        <div>
          <Label>KM</Label>
          <Input
            type="number"
            {...register("km", { valueAsNumber: true })}
            className="mt-1"
          />
        </div>
        <div>
          <Label>Condition</Label>
          <Select
            value={watch("condition") ?? ""}
            onValueChange={(v) => setValue("condition", v as "new" | "used" | null)}
          >
            <SelectTrigger className="mt-1">
              <SelectValue placeholder="—" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="new">New</SelectItem>
              <SelectItem value="used">Used</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div>
          <Label>Location</Label>
          <Input {...register("location")} className="mt-1" />
        </div>
        <div>
          <Label>WhatsApp</Label>
          <Input {...register("whatsapp")} placeholder="+355..." className="mt-1" />
        </div>
      </div>
      {submitError && (
        <p className="text-sm text-destructive">{submitError}</p>
      )}
      <Button type="submit" disabled={saving}>
        {saving ? "Saving..." : product ? "Update" : "Create"}
      </Button>
    </form>
  );
}
