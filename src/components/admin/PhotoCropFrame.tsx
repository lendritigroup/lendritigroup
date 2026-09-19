"use client";

import { useEffect, useRef } from "react";
import { coverStyle, clampZoom, type CropChange } from "@/lib/photo-focus";

type Point = { x: number; y: number };

function distance(a: Point, b: Point) {
  return Math.hypot(a.x - b.x, a.y - b.y);
}

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
  const overRef = useRef(false);
  const onChangeRef = useRef(onChange);
  const valuesRef = useRef({ x: focusX, y: focusY, zoom });
  const pointersRef = useRef(new Map<number, Point>());
  const dragRef = useRef<{
    pointerId: number;
    startX: number;
    startY: number;
    originX: number;
    originY: number;
  } | null>(null);
  const pinchRef = useRef<{ startDist: number; startZoom: number } | null>(null);

  onChangeRef.current = onChange;
  valuesRef.current = { x: focusX, y: focusY, zoom };

  function clamp(value: number) {
    return Math.min(100, Math.max(0, value));
  }

  function emit(next: Partial<CropChange>) {
    const current = valuesRef.current;
    const value = {
      x: next.x ?? current.x,
      y: next.y ?? current.y,
      zoom: clampZoom(next.zoom ?? current.zoom),
    };
    valuesRef.current = value;
    onChangeRef.current(value);
  }

  function onPointerDown(e: React.PointerEvent<HTMLDivElement>) {
    if (e.button !== 0 && e.pointerType === "mouse") return;
    e.preventDefault();
    overRef.current = true;
    e.currentTarget.setPointerCapture(e.pointerId);
    pointersRef.current.set(e.pointerId, { x: e.clientX, y: e.clientY });

    if (pointersRef.current.size >= 2) {
      const [a, b] = [...pointersRef.current.values()];
      pinchRef.current = {
        startDist: Math.max(1, distance(a, b)),
        startZoom: valuesRef.current.zoom,
      };
      dragRef.current = null;
      return;
    }

    dragRef.current = {
      pointerId: e.pointerId,
      startX: e.clientX,
      startY: e.clientY,
      originX: valuesRef.current.x,
      originY: valuesRef.current.y,
    };
  }

  function onPointerMove(e: React.PointerEvent<HTMLDivElement>) {
    if (!pointersRef.current.has(e.pointerId)) return;
    pointersRef.current.set(e.pointerId, { x: e.clientX, y: e.clientY });

    if (pinchRef.current && pointersRef.current.size >= 2) {
      const [a, b] = [...pointersRef.current.values()];
      const scale = distance(a, b) / pinchRef.current.startDist;
      emit({ zoom: pinchRef.current.startZoom * scale });
      return;
    }

    const drag = dragRef.current;
    if (!drag || drag.pointerId !== e.pointerId) return;
    const box = frameRef.current?.getBoundingClientRect();
    if (!box) return;
    emit({
      x: clamp(drag.originX - ((e.clientX - drag.startX) / box.width) * 100),
      y: clamp(drag.originY - ((e.clientY - drag.startY) / box.height) * 100),
    });
  }

  function endPointer(e: React.PointerEvent<HTMLDivElement>) {
    pointersRef.current.delete(e.pointerId);
    if (pointersRef.current.size < 2) pinchRef.current = null;
    if (dragRef.current?.pointerId === e.pointerId) dragRef.current = null;
    try {
      e.currentTarget.releasePointerCapture(e.pointerId);
    } catch {
      /* already released */
    }
  }

  useEffect(() => {
    const el = frameRef.current;
    if (!el) return;

    function onWheel(e: WheelEvent) {
      if (!e.ctrlKey && !e.metaKey) return;
      e.preventDefault();
      emit({ zoom: valuesRef.current.zoom + (e.deltaY > 0 ? -0.08 : 0.08) });
    }

    function onKeyDown(e: KeyboardEvent) {
      if (!overRef.current || !(e.ctrlKey || e.metaKey)) return;
      if (e.key === "+" || e.key === "=" || e.code === "NumpadAdd") {
        e.preventDefault();
        emit({ zoom: valuesRef.current.zoom + 0.1 });
      }
      if (e.key === "-" || e.key === "_" || e.code === "NumpadSubtract") {
        e.preventDefault();
        emit({ zoom: valuesRef.current.zoom - 0.1 });
      }
    }

    el.addEventListener("wheel", onWheel, { passive: false });
    window.addEventListener("keydown", onKeyDown);
    return () => {
      el.removeEventListener("wheel", onWheel);
      window.removeEventListener("keydown", onKeyDown);
    };
  }, []);

  return (
    <div
      ref={frameRef}
      tabIndex={0}
      onPointerEnter={() => {
        overRef.current = true;
      }}
      onPointerLeave={() => {
        if (pointersRef.current.size === 0) overRef.current = false;
      }}
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
      onPointerUp={endPointer}
      onPointerCancel={endPointer}
      className={`relative w-full touch-none overflow-hidden bg-muted outline-none ${className}`}
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
  );
}
