"use client";

import Image from "next/image";
import { useCallback, useEffect, useRef, useState } from "react";
import { ChevronLeft, ChevronRight, X } from "lucide-react";

type Point = { x: number; y: number };

export function ProductGallery({
  photos,
  title,
}: {
  photos: { url: string; alt?: string | null }[];
  title: string;
}) {
  const list = photos.length ? photos : [{ url: "/images/placeholder-machine.svg", alt: title }];
  const [active, setActive] = useState(0);
  const [open, setOpen] = useState(false);
  const [positions, setPositions] = useState<Record<number, Point>>({});
  const frameRef = useRef<HTMLDivElement>(null);
  const dragRef = useRef<{
    pointerId: number;
    startX: number;
    startY: number;
    origin: Point;
    moved: boolean;
  } | null>(null);

  const pos = positions[active] ?? { x: 50, y: 50 };

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

  function clamp(value: number) {
    return Math.min(100, Math.max(0, value));
  }

  function onPointerDown(e: React.PointerEvent<HTMLDivElement>) {
    if (e.button !== 0) return;
    e.currentTarget.setPointerCapture(e.pointerId);
    dragRef.current = {
      pointerId: e.pointerId,
      startX: e.clientX,
      startY: e.clientY,
      origin: pos,
      moved: false,
    };
  }

  function onPointerMove(e: React.PointerEvent<HTMLDivElement>) {
    const drag = dragRef.current;
    if (!drag || drag.pointerId !== e.pointerId) return;
    const box = frameRef.current?.getBoundingClientRect();
    if (!box) return;
    const dx = e.clientX - drag.startX;
    const dy = e.clientY - drag.startY;
    if (Math.abs(dx) + Math.abs(dy) > 4) drag.moved = true;
    setPositions((current) => ({
      ...current,
      [active]: {
        x: clamp(drag.origin.x - (dx / box.width) * 100),
        y: clamp(drag.origin.y - (dy / box.height) * 100),
      },
    }));
  }

  function endDrag(e: React.PointerEvent<HTMLDivElement>) {
    const drag = dragRef.current;
    if (!drag || drag.pointerId !== e.pointerId) return;
    const moved = drag.moved;
    dragRef.current = null;
    try {
      e.currentTarget.releasePointerCapture(e.pointerId);
    } catch {
      /* already released */
    }
    if (!moved) setOpen(true);
  }

  return (
    <div>
      <div
        ref={frameRef}
        role="button"
        tabIndex={0}
        onClick={(e) => e.preventDefault()}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            setOpen(true);
          }
        }}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={endDrag}
        onPointerCancel={endDrag}
        className="relative aspect-[4/3] w-full touch-none overflow-hidden border border-border bg-muted"
        aria-label="Drag to reposition crop, click to enlarge"
      >
        <Image
          src={list[active].url}
          alt={list[active].alt || title}
          fill
          className="cursor-grab object-cover active:cursor-grabbing"
          style={{ objectPosition: `${pos.x}% ${pos.y}%` }}
          priority
          draggable={false}
        />
      </div>
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
                style={{ objectPosition: `${(positions[i] ?? { x: 50, y: 50 }).x}% ${(positions[i] ?? { x: 50, y: 50 }).y}%` }}
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
          aria-label={list[active].alt || title}
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
            src={list[active].url}
            alt={list[active].alt || title}
            className="max-h-[92vh] max-w-[94vw] object-contain"
            onClick={(e) => e.stopPropagation()}
          />
        </div>
      )}
    </div>
  );
}
