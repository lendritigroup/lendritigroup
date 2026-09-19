"use client";

import { useRef } from "react";
import { objectPosition } from "@/lib/photo-focus";

type Point = { x: number; y: number };

export function PhotoCropFrame({
  url,
  focusX,
  focusY,
  onChange,
  className = "aspect-[4/3]",
}: {
  url: string;
  focusX: number;
  focusY: number;
  onChange: (next: Point) => void;
  className?: string;
}) {
  const frameRef = useRef<HTMLDivElement>(null);
  const dragRef = useRef<{
    pointerId: number;
    startX: number;
    startY: number;
    origin: Point;
  } | null>(null);

  function clamp(value: number) {
    return Math.min(100, Math.max(0, value));
  }

  function onPointerDown(e: React.PointerEvent<HTMLDivElement>) {
    if (e.button !== 0) return;
    e.preventDefault();
    e.currentTarget.setPointerCapture(e.pointerId);
    dragRef.current = {
      pointerId: e.pointerId,
      startX: e.clientX,
      startY: e.clientY,
      origin: { x: focusX, y: focusY },
    };
  }

  function onPointerMove(e: React.PointerEvent<HTMLDivElement>) {
    const drag = dragRef.current;
    if (!drag || drag.pointerId !== e.pointerId) return;
    const box = frameRef.current?.getBoundingClientRect();
    if (!box) return;
    onChange({
      x: clamp(drag.origin.x - ((e.clientX - drag.startX) / box.width) * 100),
      y: clamp(drag.origin.y - ((e.clientY - drag.startY) / box.height) * 100),
    });
  }

  function endDrag(e: React.PointerEvent<HTMLDivElement>) {
    const drag = dragRef.current;
    if (!drag || drag.pointerId !== e.pointerId) return;
    dragRef.current = null;
    try {
      e.currentTarget.releasePointerCapture(e.pointerId);
    } catch {
      /* already released */
    }
  }

  return (
    <div
      ref={frameRef}
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
      onPointerUp={endDrag}
      onPointerCancel={endDrag}
      className={`relative w-full touch-none overflow-hidden bg-muted ${className}`}
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={url}
        alt=""
        draggable={false}
        className="absolute inset-0 h-full w-full cursor-grab object-cover active:cursor-grabbing"
        style={{ objectPosition: objectPosition({ focusX, focusY }) }}
      />
    </div>
  );
}
