"use client";

import Image from "next/image";
import { useCallback, useEffect, useState } from "react";
import { ChevronLeft, ChevronRight, X } from "lucide-react";
import { objectPosition } from "@/lib/photo-focus";

export function ProductGallery({
  photos,
  title,
}: {
  photos: { url: string; alt?: string | null; focusX?: number; focusY?: number }[];
  title: string;
}) {
  const list = photos.length
    ? photos
    : [{ url: "/images/placeholder-machine.svg", alt: title, focusX: 50, focusY: 50 }];
  const [active, setActive] = useState(0);
  const [open, setOpen] = useState(false);
  const current = list[active];

  const prev = useCallback(() => {
    setActive((i) => (i === 0 ? list.length - 1 : i - 1));
  }, [list.length]);

  const next = useCallback(() => {
    setActive((i) => (i === list.length - 1 ? 0 : i + 1));
  }, [list.length]);

  useEffect(() => {
    if (!open) return;
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") setOpen(false);
      if (e.key === "ArrowLeft") prev();
      if (e.key === "ArrowRight") next();
    }
    window.addEventListener("keydown", onKey);
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = previous;
    };
  }, [open, next, prev]);

  return (
    <div>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="relative aspect-[4/3] w-full overflow-hidden border border-border bg-muted"
        aria-label="Enlarge photo"
      >
        <Image
          src={current.url}
          alt={current.alt || title}
          fill
          className="object-cover"
          style={{ objectPosition: objectPosition(current) }}
          priority
        />
      </button>
      {list.length > 1 && (
        <div className="mt-3 grid grid-cols-5 gap-2">
          {list.map((p, i) => (
            <button
              key={`${p.url}-${i}`}
              type="button"
              onClick={() => setActive(i)}
              onDoubleClick={() => {
                setActive(i);
                setOpen(true);
              }}
              className={`relative aspect-[4/3] overflow-hidden border ${i === active ? "border-navy" : "border-border"}`}
            >
              <Image
                src={p.url}
                alt={p.alt || `${title} ${i + 1}`}
                fill
                className="object-cover"
                style={{ objectPosition: objectPosition(p) }}
              />
            </button>
          ))}
        </div>
      )}

      {open && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 p-4"
          onClick={() => setOpen(false)}
          role="dialog"
          aria-modal="true"
          aria-label={current.alt || title}
        >
          <button
            type="button"
            onClick={() => setOpen(false)}
            className="absolute right-4 top-4 rounded-full bg-white/10 p-2 text-white hover:bg-white/20"
            aria-label="Close"
          >
            <X className="size-6" />
          </button>
          {list.length > 1 && (
            <>
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  prev();
                }}
                className="absolute left-3 rounded-full bg-white/10 p-2 text-white hover:bg-white/20 md:left-6"
                aria-label="Previous photo"
              >
                <ChevronLeft className="size-7" />
              </button>
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  next();
                }}
                className="absolute right-3 rounded-full bg-white/10 p-2 text-white hover:bg-white/20 md:right-6"
                aria-label="Next photo"
              >
                <ChevronRight className="size-7" />
              </button>
            </>
          )}
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={current.url}
            alt={current.alt || title}
            className="max-h-[92vh] max-w-[94vw] object-contain"
            onClick={(e) => e.stopPropagation()}
          />
        </div>
      )}
    </div>
  );
}
