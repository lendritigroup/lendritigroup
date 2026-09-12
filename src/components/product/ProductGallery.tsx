"use client";

import Image from "next/image";
import { useState } from "react";

export function ProductGallery({
  photos,
  title,
}: {
  photos: { url: string; alt?: string | null }[];
  title: string;
}) {
  const list = photos.length ? photos : [{ url: "/images/placeholder-machine.svg", alt: title }];
  const [active, setActive] = useState(0);

  return (
    <div>
      <div className="relative aspect-[4/3] overflow-hidden border border-border bg-muted">
        <Image src={list[active].url} alt={list[active].alt || title} fill className="object-cover" priority />
      </div>
      {list.length > 1 && (
        <div className="mt-3 grid grid-cols-5 gap-2">
          {list.map((p, i) => (
            <button
              key={`${p.url}-${i}`}
              type="button"
              onClick={() => setActive(i)}
              className={`relative aspect-[4/3] overflow-hidden border ${i === active ? "border-navy" : "border-border"}`}
            >
              <Image src={p.url} alt={p.alt || `${title} ${i + 1}`} fill className="object-cover" />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
