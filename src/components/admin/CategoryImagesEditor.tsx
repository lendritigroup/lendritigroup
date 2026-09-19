"use client";

import { useState } from "react";
import { upload } from "@vercel/blob/client";
import { CATEGORY_CARDS, type CategoryImageMap } from "@/lib/category-images";
import { PhotoCropFrame } from "./PhotoCropFrame";

async function uploadImage(file: File) {
  if (!file.type.startsWith("image/")) {
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
  if (!blob?.url) throw new Error("Upload failed");
  return blob.url;
}

export function CategoryImagesEditor({ initial }: { initial: CategoryImageMap }) {
  const [images, setImages] = useState(initial);
  const [busy, setBusy] = useState<string | null>(null);
  const [status, setStatus] = useState<"idle" | "saving" | "ok" | "error">("idle");
  const [error, setError] = useState<string | null>(null);

  async function changeImage(id: keyof CategoryImageMap, file: File | undefined) {
    if (!file) return;
    setBusy(id);
    setError(null);
    setStatus("idle");
    try {
      const url = await uploadImage(file);
      setImages((current) => ({ ...current, [id]: { url, focusX: 50, focusY: 50 } }));
    } catch (err) {
      setError(err instanceof Error ? err.message : "Upload failed");
    } finally {
      setBusy(null);
    }
  }

  return (
    <section className="border border-border bg-card p-6">
      <h2 className="text-xl">Homepage category cards</h2>
      <p className="mt-2 text-sm text-muted-foreground">
        The current Ekskavatorë, Kamionë and Makineri tjetër photos are loaded here. Drag a photo to set the crop, or replace it. Save to show the change on the homepage.
      </p>
      <div className="mt-5 grid gap-4 md:grid-cols-3">
        {CATEGORY_CARDS.map((card) => {
          const image = images[card.id];
          return (
            <div key={card.id} className="border border-border p-3">
              <p className="mb-2 text-sm font-medium">{card.label}</p>
              <PhotoCropFrame
                url={image.url}
                focusX={image.focusX}
                focusY={image.focusY}
                className="aspect-[16/10]"
                onChange={({ x, y }) =>
                  setImages((current) => ({
                    ...current,
                    [card.id]: { ...current[card.id], focusX: x, focusY: y },
                  }))
                }
              />
              <label className="mt-3 block text-xs">
                <span className="underline">{busy === card.id ? "Uploading..." : "Change image"}</span>
                <input
                  type="file"
                  accept="image/jpeg,image/png,image/webp,image/gif,image/avif,.jpg,.jpeg,.png,.webp,.gif"
                  className="sr-only"
                  disabled={busy !== null}
                  onChange={(e) => {
                    changeImage(card.id, e.target.files?.[0]);
                    e.target.value = "";
                  }}
                />
              </label>
            </div>
          );
        })}
      </div>
      {error && <p className="mt-3 text-sm text-destructive">{error}</p>}
      <div className="mt-5 flex items-center gap-4">
        <button
          type="button"
          disabled={busy !== null || status === "saving"}
          onClick={async () => {
            setStatus("saving");
            setError(null);
            const res = await fetch("/api/admin/category-images", {
              method: "PUT",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify(images),
            });
            setStatus(res.ok ? "ok" : "error");
          }}
          className="h-11 bg-navy px-6 text-xs font-semibold uppercase tracking-wider text-white disabled:opacity-60"
        >
          {status === "saving" ? "Saving..." : "Save category images"}
        </button>
        {status === "ok" && <p className="text-sm text-green-800">Saved. The homepage now uses these crops.</p>}
        {status === "error" && <p className="text-sm text-destructive">Could not save. Try again.</p>}
      </div>
    </section>
  );
}
