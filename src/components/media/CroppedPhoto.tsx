"use client";

import { useEffect, useRef, useState } from "react";
import { clampFocus, clampZoom } from "@/lib/photo-focus";
import { cn } from "@/lib/utils";

export function CroppedPhoto({
  src,
  alt,
  focusX = 50,
  focusY = 50,
  zoom = 1,
  className,
  imgClassName,
}: {
  src: string;
  alt: string;
  focusX?: number;
  focusY?: number;
  zoom?: number;
  className?: string;
  imgClassName?: string;
}) {
  const frameRef = useRef<HTMLDivElement>(null);
  const imgRef = useRef<HTMLImageElement>(null);
  const [frame, setFrame] = useState({ w: 0, h: 0 });
  const [natural, setNatural] = useState({ w: 0, h: 0 });

  useEffect(() => {
    setNatural({ w: 0, h: 0 });
    if (imgRef.current) applyNatural(imgRef.current);
  }, [src]);

  useEffect(() => {
    const el = frameRef.current;
    if (!el) return;
    const sync = () => {
      const box = el.getBoundingClientRect();
      setFrame((prev) => (prev.w === box.width && prev.h === box.height ? prev : { w: box.width, h: box.height }));
    };
    sync();
    const observer = new ResizeObserver(sync);
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  function applyNatural(img: HTMLImageElement) {
    if (!img.naturalWidth || !img.naturalHeight) return;
    setNatural((prev) =>
      prev.w === img.naturalWidth && prev.h === img.naturalHeight
        ? prev
        : { w: img.naturalWidth, h: img.naturalHeight }
    );
  }

  const ready = frame.w > 0 && natural.w > 0 && natural.h > 0;
  const cover = ready ? Math.max(frame.w / natural.w, frame.h / natural.h) : 1;
  const scale = cover * clampZoom(zoom);
  const width = natural.w * scale;
  const height = natural.h * scale;
  const left = ready ? (frame.w - width) * (clampFocus(focusX) / 100) : 0;
  const top = ready ? (frame.h - height) * (clampFocus(focusY) / 100) : 0;

  return (
    <div ref={frameRef} className={cn("absolute inset-0 overflow-hidden", className)}>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        ref={imgRef}
        src={src}
        alt={alt}
        draggable={false}
        onLoad={(e) => applyNatural(e.currentTarget)}
        className={cn("max-w-none", imgClassName)}
        style={
          ready
            ? { position: "absolute", width, height, left, top }
            : {
                position: "absolute",
                inset: 0,
                width: "100%",
                height: "100%",
                objectFit: "cover",
                objectPosition: `${clampFocus(focusX)}% ${clampFocus(focusY)}%`,
              }
        }
      />
    </div>
  );
}
