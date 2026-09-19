"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { upload } from "@vercel/blob/client";
import { ImagePlus } from "lucide-react";
import { fieldsForCategory } from "@/lib/specs";
import { formatMoney, summarizeFinance } from "@/lib/finance";
import { localePath } from "@/lib/paths";
import { machineSlug } from "@/lib/slug";
import type { MachineCategory } from "@/lib/company";
import type { AdminMachine } from "@/types/machine";
import type { PhotoFocus } from "@/lib/photo-focus";
import { PhotoCropFrame } from "./PhotoCropFrame";

function dateInput(value?: string | null) {
  return value ? value.slice(0, 10) : "";
}

function emptyToNull(value: FormDataEntryValue | null) {
  if (value == null) return null;
  const raw = String(value).trim().replace(",", ".");
  if (raw === "") return null;
  const n = Number(raw);
  return Number.isFinite(n) ? n : null;
}

export function MachineForm({
  locale,
  machine,
}: {
  locale: string;
  machine?: AdminMachine;
}) {
  const router = useRouter();
  const [category, setCategory] = useState<MachineCategory>(machine?.category ?? "excavator");
  const [photos, setPhotos] = useState<PhotoFocus[]>(
    machine?.photos.map((p) => ({ url: p.url, focusX: p.focusX ?? 50, focusY: p.focusY ?? 50, zoom: p.zoom ?? 1 })) ?? []
  );
  const [mainIndex, setMainIndex] = useState(Math.max(0, machine?.photos.findIndex((p) => p.isMain) ?? 0));
  const [docs, setDocs] = useState<{ url: string; title: string }[]>(
    machine?.documents.map((d) => ({ url: d.url, title: d.title })) ?? []
  );
  const [error, setError] = useState<string | null>(null);
  const [pending, setPending] = useState(false);
  const [uploading, setUploading] = useState<"photo" | "doc" | null>(null);
  const specFields = useMemo(() => fieldsForCategory(category), [category]);
  const existingSpecs =
    category === "excavator" ? machine?.excavatorSpecs : category === "truck" ? machine?.truckSpecs : machine?.otherSpecs;

  const [purchasePrice, setPurchasePrice] = useState(machine?.purchasePrice?.toString() ?? "");
  const [transportCost, setTransport] = useState(machine?.transportCost?.toString() ?? "0");
  const [repairCost, setRepair] = useState(machine?.repairCost?.toString() ?? "0");
  const [otherCosts, setOther] = useState(machine?.otherPurchaseCosts?.toString() ?? "0");

  const live = summarizeFinance({
    purchasePrice: Number(purchasePrice) || 0,
    transportCost: Number(transportCost) || 0,
    repairCost: Number(repairCost) || 0,
    otherPurchaseCosts: Number(otherCosts) || 0,
    actualSellingPrice: machine?.actualSellingPrice,
    sellingCosts: machine?.sellingCosts,
    otherSaleCosts: machine?.otherSaleCosts,
    askingPrice: machine?.askingPrice,
  });

  async function uploadFiles(files: FileList | File[] | null, kind: "photo" | "doc") {
    if (!files?.length) return;
    setUploading(kind);
    setError(null);
    try {
      const urls: string[] = [];
      for (const file of Array.from(files)) {
        if (kind === "photo" && !file.type.startsWith("image/")) {
          throw new Error(`${file.name} is not an image. Choose JPG, PNG, WEBP or GIF.`);
        }
        const blob = await upload(file.name, file, {
          access: "public",
          handleUploadUrl: "/api/admin/upload",
        }).catch(async () => {
          const form = new FormData();
          form.append("files", file);
          const res = await fetch("/api/admin/upload", { method: "POST", body: form });
          const json = await res.json();
          if (!res.ok) throw new Error(json.error || "Upload failed");
          return { url: (json.urls ?? [])[0] as string };
        });
        if (blob?.url) urls.push(blob.url);
      }
      if (kind === "photo") {
        setPhotos((p) => [...p, ...urls.map((url) => ({ url, focusX: 50, focusY: 50, zoom: 1 }))]);
      }
      else setDocs((d) => [...d, ...urls.map((url) => ({ url, title: url.split("/").pop() || "Document" }))]);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Upload failed");
    } finally {
      setUploading(null);
    }
  }

  return (
    <form
      className="max-w-5xl space-y-10"
      noValidate
      onSubmit={async (e) => {
        e.preventDefault();
        setPending(true);
        setError(null);
        const form = new FormData(e.currentTarget);
        const specs: Record<string, string> = {};
        for (const field of specFields) {
          const v = form.get(`spec_${field.key}`);
          if (typeof v === "string" && v.trim()) specs[field.key] = v.trim();
        }
        const manufacturer = String(form.get("manufacturer") || "");
        const model = String(form.get("model") || "");
        const year = form.get("year") ? Number(form.get("year")) : null;
        const payload = {
          category,
          manufacturer,
          model,
          year,
          slug: String(form.get("slug") || machineSlug(manufacturer, model, year)),
          askingPrice: emptyToNull(form.get("askingPrice")),
          currency: form.get("currency") || "EUR",
          vatIncluded: form.get("vatIncluded") === "on",
          priceOnRequest: form.get("priceOnRequest") === "on" || emptyToNull(form.get("askingPrice")) == null,
          location: form.get("location"),
          country: form.get("country"),
          condition: form.get("condition"),
          availability: form.get("availability"),
          stockNumber: form.get("stockNumber"),
          serialNumber: form.get("serialNumber"),
          description: form.get("description"),
          sellerInfo: form.get("sellerInfo"),
          additionalInfo: form.get("additionalInfo"),
          status: form.get("status"),
          featured: form.get("featured") === "on",
          hours: form.get("hours"),
          kilometres: form.get("kilometres"),
          fuelType: form.get("fuelType"),
          transmission: form.get("transmission"),
          enginePower: form.get("enginePower"),
          excavatorSpecs: category === "excavator" ? specs : {},
          truckSpecs: category === "truck" ? specs : {},
          otherSpecs: category === "other" ? specs : {},
          videoUrl: form.get("videoUrl"),
          youtubeUrl: form.get("youtubeUrl"),
          vimeoUrl: form.get("vimeoUrl"),
          purchasePrice,
          purchaseCurrency: form.get("purchaseCurrency") || "EUR",
          purchaseDate: form.get("purchaseDate") || null,
          supplier: form.get("supplier"),
          purchaseLocation: form.get("purchaseLocation"),
          transportCost,
          repairCost,
          otherPurchaseCosts: otherCosts,
          seoTitle: form.get("seoTitle"),
          seoDescription: form.get("seoDescription"),
          photos,
          mainPhotoIndex: mainIndex,
          documents: docs,
        };

        const url = machine ? `/api/admin/machines/${machine.id}` : "/api/admin/machines";
        const res = await fetch(url, {
          method: machine ? "PATCH" : "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
        const json = await res.json();
        setPending(false);
        if (!res.ok) {
          setError(json.error || "Save failed");
          return;
        }

        if (docs.length && json.machine?.id) {
          // documents stored only if we add them later via photos-style; keep URLs in additional flow
        }
        router.push(localePath(locale, "/admin/machines"));
        router.refresh();
      }}
    >
      <Section title="General information">
        <div className="grid gap-4 sm:grid-cols-2">
          <Select
            label="Category"
            value={category}
            onChange={(v) => {
              if (v === "excavator" || v === "truck" || v === "other") setCategory(v);
            }}
            options={[["excavator", "Excavator"], ["truck", "Truck"], ["other", "Other machinery"]]}
          />
          <label className="block text-sm">
            Status
            <select name="status" defaultValue={machine?.status ?? "draft"} className="mt-1 h-10 w-full border border-border px-3">
              <option value="draft">Draft</option>
              <option value="active">Active</option>
              <option value="reserved">Reserved</option>
              <option value="sold">Sold</option>
              <option value="archived">Archived</option>
            </select>
          </label>
          <Input name="manufacturer" label="Manufacturer" defaultValue={machine?.manufacturer} />
          <Input name="model" label="Model" defaultValue={machine?.model} />
          <Input name="year" label="Year" type="number" defaultValue={machine?.year ?? ""} />
          <label className="block text-sm">
            Asking price <span className="font-normal text-muted-foreground">(optional)</span>
            <input
              name="askingPrice"
              type="text"
              inputMode="decimal"
              defaultValue={machine?.askingPrice ?? ""}
              placeholder="Leave empty — no public price"
              className="mt-1 h-10 w-full border border-border px-3"
            />
          </label>
          <Input name="currency" label="Currency" defaultValue={machine?.currency ?? "EUR"} />
          <Input name="stockNumber" label="Stock number" defaultValue={machine?.stockNumber ?? ""} />
          <Input name="serialNumber" label="Serial number" defaultValue={machine?.serialNumber ?? ""} />
          <Input name="location" label="Location" defaultValue={machine?.location ?? ""} />
          <Input name="country" label="Country" defaultValue={machine?.country ?? ""} />
          <Input name="condition" label="Condition" defaultValue={machine?.condition ?? ""} />
          <Input name="availability" label="Availability" defaultValue={machine?.availability ?? ""} />
          <Input name="hours" label="Operating hours" type="number" defaultValue={machine?.hours ?? ""} />
          <Input name="kilometres" label="Kilometres" type="number" defaultValue={machine?.kilometres ?? ""} />
          <Input name="fuelType" label="Fuel type" defaultValue={machine?.fuelType ?? ""} />
          <Input name="transmission" label="Transmission" defaultValue={machine?.transmission ?? ""} />
          <Input name="enginePower" label="Engine power" defaultValue={machine?.enginePower ?? ""} />
          <Input name="slug" label="SEO slug" defaultValue={machine?.slug ?? ""} />
        </div>
        <div className="mt-4 flex flex-wrap gap-4 text-sm">
          <label className="flex items-center gap-2"><input type="checkbox" name="vatIncluded" defaultChecked={machine?.vatIncluded} /> VAT included</label>
          <label className="flex items-center gap-2"><input type="checkbox" name="priceOnRequest" defaultChecked={machine?.priceOnRequest || machine?.askingPrice == null} /> Price on request (used if price is empty)</label>
          <label className="flex items-center gap-2"><input type="checkbox" name="featured" defaultChecked={machine?.featured} /> Featured</label>
        </div>
        <Text name="description" label="Description" defaultValue={machine?.description ?? ""} />
        <Text name="sellerInfo" label="Seller information" defaultValue={machine?.sellerInfo ?? ""} />
        <Text name="additionalInfo" label="Additional information" defaultValue={machine?.additionalInfo ?? ""} />
      </Section>

      <Section title={category === "truck" ? "Truck information" : category === "excavator" ? "Excavator information" : "Machine information"}>
        <div className="grid gap-4 sm:grid-cols-2">
          {specFields.map((field) => (
            <label key={field.key} className={`block text-sm ${field.type === "textarea" ? "sm:col-span-2" : ""}`}>
              {field.label}{field.unit ? ` (${field.unit})` : ""}
              {field.type === "textarea" ? (
                <textarea name={`spec_${field.key}`} rows={3} defaultValue={existingSpecs?.[field.key] ?? ""} className="mt-1 w-full border border-border px-3 py-2" />
              ) : field.type === "select" ? (
                <select name={`spec_${field.key}`} defaultValue={existingSpecs?.[field.key] ?? ""} className="mt-1 h-10 w-full border border-border px-3">
                  <option value="">—</option>
                  {field.options?.map((o) => <option key={o}>{o}</option>)}
                </select>
              ) : (
                <input name={`spec_${field.key}`} type={field.type} defaultValue={existingSpecs?.[field.key] ?? ""} className="mt-1 h-10 w-full border border-border px-3" />
              )}
            </label>
          ))}
        </div>
      </Section>

      <Section title="Purchase information (private)">
        <div className="grid gap-4 sm:grid-cols-2">
          <label className="block text-sm">Purchase price <span className="font-normal text-muted-foreground">(optional, private)</span>
            <input name="purchasePrice" type="text" inputMode="decimal" value={purchasePrice} onChange={(e) => setPurchasePrice(e.target.value)} placeholder="Leave empty" className="mt-1 h-10 w-full border px-3" />
          </label>
          <Input name="purchaseCurrency" label="Purchase currency" defaultValue={machine?.purchaseCurrency ?? "EUR"} />
          <Input name="purchaseDate" label="Purchase date" type="date" defaultValue={dateInput(machine?.purchaseDate)} />
          <Input name="supplier" label="Seller / supplier" defaultValue={machine?.supplier ?? ""} />
          <Input name="purchaseLocation" label="Purchase location" defaultValue={machine?.purchaseLocation ?? ""} />
          <label className="block text-sm">Transport cost
            <input type="number" value={transportCost} onChange={(e) => setTransport(e.target.value)} className="mt-1 h-10 w-full border px-3" />
          </label>
          <label className="block text-sm">Repair costs
            <input type="number" value={repairCost} onChange={(e) => setRepair(e.target.value)} className="mt-1 h-10 w-full border px-3" />
          </label>
          <label className="block text-sm">Other costs
            <input type="number" value={otherCosts} onChange={(e) => setOther(e.target.value)} className="mt-1 h-10 w-full border px-3" />
          </label>
        </div>
        <p className="mt-4 border border-border bg-muted/40 p-3 text-sm">
          Total investment: <strong>{formatMoney(live.totalInvestment)}</strong>
        </p>
      </Section>

      <Section title="Photos and media">
        <label
          className="flex cursor-pointer flex-col items-center justify-center gap-2 border-2 border-dashed border-border bg-muted/30 px-4 py-10 text-center hover:border-navy hover:bg-muted/50"
          onDragOver={(e) => e.preventDefault()}
          onDrop={(e) => {
            e.preventDefault();
            uploadFiles(e.dataTransfer.files, "photo");
          }}
        >
          <ImagePlus className="size-8 text-navy" />
          <span className="text-sm font-semibold">
            {uploading === "photo" ? "Uploading images..." : "Click or drop machine photos"}
          </span>
          <span className="text-xs text-muted-foreground">JPG, PNG, WEBP or GIF from your computer. Multiple files allowed.</span>
          <input
            type="file"
            accept="image/jpeg,image/png,image/webp,image/gif,image/avif,.jpg,.jpeg,.png,.webp,.gif"
            multiple
            className="sr-only"
            disabled={uploading !== null}
            onChange={(e) => {
              uploadFiles(e.target.files, "photo");
              e.target.value = "";
            }}
          />
        </label>
        {photos.length > 0 && (
          <p className="mt-3 text-xs text-muted-foreground">
            Drag each photo to move it. Use + / −, the slider or the scroll wheel to zoom. Save the machine to keep the crop.
          </p>
        )}
        <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-4">
          {photos.map((photo, i) => (
            <div key={`${photo.url}-${i}`} className="border border-border p-2">
              <PhotoCropFrame
                url={photo.url}
                focusX={photo.focusX}
                focusY={photo.focusY}
                zoom={photo.zoom}
                onChange={({ x, y, zoom }) =>
                  setPhotos((current) => current.map((item, idx) => (idx === i ? { ...item, focusX: x, focusY: y, zoom } : item)))
                }
              />
              <div className="mt-2 flex flex-wrap gap-2 text-xs">
                <button type="button" onClick={() => setMainIndex(i)} className="underline">{i === mainIndex ? "Main" : "Set main"}</button>
                <button
                  type="button"
                  disabled={i === 0}
                  onClick={() => {
                    setPhotos((current) => {
                      const next = [...current];
                      [next[i - 1], next[i]] = [next[i], next[i - 1]];
                      return next;
                    });
                    setMainIndex((current) => (current === i ? i - 1 : current === i - 1 ? i : current));
                  }}
                >
                  Up
                </button>
                <button
                  type="button"
                  disabled={i === photos.length - 1}
                  onClick={() => {
                    setPhotos((current) => {
                      const next = [...current];
                      [next[i], next[i + 1]] = [next[i + 1], next[i]];
                      return next;
                    });
                    setMainIndex((current) => (current === i ? i + 1 : current === i + 1 ? i : current));
                  }}
                >
                  Down
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setPhotos((current) => current.filter((_, idx) => idx !== i));
                    setMainIndex((current) => {
                      if (current === i) return 0;
                      if (current > i) return current - 1;
                      return current;
                    });
                  }}
                  className="text-destructive"
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
        <div className="mt-4 grid gap-4 sm:grid-cols-3">
          <Input name="youtubeUrl" label="YouTube URL" defaultValue={machine?.youtubeUrl ?? ""} />
          <Input name="vimeoUrl" label="Vimeo URL" defaultValue={machine?.vimeoUrl ?? ""} />
          <Input name="videoUrl" label="Video file URL" defaultValue={machine?.videoUrl ?? ""} />
        </div>
        <div className="mt-4">
          <p className="mb-2 text-sm">PDF / documentation</p>
          <input
            type="file"
            accept=".pdf,application/pdf,image/jpeg,image/png,image/webp"
            multiple
            disabled={uploading !== null}
            onChange={(e) => {
              uploadFiles(e.target.files, "doc");
              e.target.value = "";
            }}
          />
          {uploading === "doc" && <p className="mt-1 text-xs text-muted-foreground">Uploading documents...</p>}
          <ul className="mt-2 text-sm">
            {docs.map((d) => (
              <li key={d.url}><a href={d.url} className="underline" target="_blank" rel="noreferrer">{d.title}</a></li>
            ))}
          </ul>
        </div>
      </Section>

      <Section title="SEO">
        <Input name="seoTitle" label="SEO title" defaultValue={machine?.seoTitle ?? ""} />
        <Text name="seoDescription" label="Meta description" defaultValue={machine?.seoDescription ?? ""} />
      </Section>

      {error && <p className="text-sm text-destructive">{error}</p>}
      <button disabled={pending} className="h-11 bg-navy px-8 text-xs font-semibold uppercase tracking-wider text-white">
        {pending ? "Saving..." : "Save machine"}
      </button>
    </form>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="border border-border bg-card p-5">
      <h2 className="mb-4 text-lg">{title}</h2>
      {children}
    </section>
  );
}

function Input({
  name,
  label,
  type = "text",
  defaultValue,
}: {
  name: string;
  label: string;
  type?: string;
  defaultValue?: string | number;
}) {
  return (
    <label className="block text-sm">
      {label}
      <input name={name} type={type} defaultValue={defaultValue} className="mt-1 h-10 w-full border border-border px-3" />
    </label>
  );
}

function Text({ name, label, defaultValue }: { name: string; label: string; defaultValue?: string }) {
  return (
    <label className="mt-4 block text-sm">
      {label}
      <textarea name={name} rows={4} defaultValue={defaultValue} className="mt-1 w-full border border-border px-3 py-2" />
    </label>
  );
}

function Select({
  label,
  value,
  onChange,
  options,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  options: [string, string][];
}) {
  return (
    <label className="block text-sm">
      {label}
      <select value={value} onChange={(e) => onChange(e.target.value)} className="mt-1 h-10 w-full border border-border px-3">
        {options.map(([v, l]) => (
          <option key={v} value={v}>{l}</option>
        ))}
      </select>
    </label>
  );
}
