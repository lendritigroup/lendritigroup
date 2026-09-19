"use client";

import { useRef } from "react";
import { coverStyle, clampZoom, MIN_ZOOM, MAX_ZOOM, type CropChange } from "@/lib/photo-focus";

export function PhotoCropFrame({
  url,
  focusX,
  focusY,
  zoom,
  onChange,
  className = "aspect-[4/3]",
}: {
  url: string;
  focusX: number;
  focusY: number;
  zoom: number;
  onChange: (next: CropChange) => void;
  className?: string;
}) {
  const frameRef = useRef<HTMLDivElement>(null);
  const dragRef = useRef<{
    pointerId: number;
    startX: number;
    startY: number;
    originX: number;
    originY: number;
  } | null>(null);

  function clamp(value: number) {
    return Math.min(100, Math.max(0, value));
  }

  function emit(next: Partial<CropChange>) {
    onChange({
      x: next.x ?? focusX,
      y: next.y ?? focusY,
      zoom: clampZoom(next.zoom ?? zoom),
    });
  }

  function onPointerDown(e: React.PointerEvent<HTMLDivElement>) {
    if (e.button !== 0) return;
    e.preventDefault();
    e.currentTarget.setPointerCapture(e.pointerId);
    dragRef.current = {
      pointerId: e.pointerId,
      startX: e.clientX,
      startY: e.clientY,
      originX: focusX,
      originY: focusY,
    };
  }

  function onPointerMove(e: React.PointerEvent<HTMLDivElement>) {
    const drag = dragRef.current;
    if (!drag || drag.pointerId !== e.pointerId) return;
    const box = frameRef.current?.getBoundingClientRect();
    if (!box) return;
    emit({
      x: clamp(drag.originX - ((e.clientX - drag.startX) / box.width) * 100),
      y: clamp(drag.originY - ((e.clientY - drag.startY) / box.height) * 100),
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
    <div>
      <div
        ref={frameRef}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={endDrag}
        onPointerCancel={endDrag}
        onWheel={(e) => {
          e.preventDefault();
          emit({ zoom: zoom + (e.deltaY > 0 ? -0.08 : 0.08) });
        }}
        className={`relative w-full touch-none overflow-hidden bg-muted ${className}`}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={url}
          alt=""
          draggable={false}
          className="absolute inset-0 h-full w-full cursor-grab object-cover active:cursor-grabbing"
          style={coverStyle({ focusX, focusY, zoom })}
        />
      </div>
      <div className="mt-2 flex items-center gap-2">
        <button
          type="button"
          onClick={() => emit({ zoom: zoom - 0.1 })}
          className="h-7 w-7 border border-border text-sm leading-none"
          aria-label="Zoom out"
        >
          −
        </button>
        <input
          type="range"
          min={MIN_ZOOM}
          max={MAX_ZOOM}
          step={0.05}
          value={zoom}
          onChange={(e) => emit({ zoom: Number(e.target.value) })}
          className="h-7 w-full accent-navy"
          aria-label="Zoom"
        />
        <button
          type="button"
          onClick={() => emit({ zoom: zoom + 0.1 })}
          className="h-7 w-7 border border-border text-sm leading-none"
          aria-label="Zoom in"
        >
          +
        </button>
      </div>
    </div>
  );
}
