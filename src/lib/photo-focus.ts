export const MIN_ZOOM = 0.25;
export const MAX_ZOOM = 3;
export const DEFAULT_ZOOM = 1;

export type PhotoFocus = {
  url: string;
  focusX: number;
  focusY: number;
  zoom: number;
};

export type CropChange = {
  x: number;
  y: number;
  zoom: number;
};

export function clampFocus(value: unknown, fallback = 50) {
  const n = Number(value);
  if (!Number.isFinite(n)) return fallback;
  return Math.min(100, Math.max(0, n));
}

export function clampZoom(value: unknown, fallback = DEFAULT_ZOOM) {
  const n = Number(value);
  if (!Number.isFinite(n)) return fallback;
  return Math.min(MAX_ZOOM, Math.max(MIN_ZOOM, n));
}

export function parsePhotoInputs(value: unknown): PhotoFocus[] {
  if (!Array.isArray(value)) return [];
  return value.flatMap((item) => {
    if (typeof item === "string" && item.trim()) {
      return [{ url: item.trim(), focusX: 50, focusY: 50, zoom: DEFAULT_ZOOM }];
    }
    if (item && typeof item === "object" && "url" in item && typeof item.url === "string" && item.url.trim()) {
      return [{
        url: item.url.trim(),
        focusX: clampFocus("focusX" in item ? item.focusX : 50),
        focusY: clampFocus("focusY" in item ? item.focusY : 50),
        zoom: clampZoom("zoom" in item ? item.zoom : "focusZoom" in item ? item.focusZoom : DEFAULT_ZOOM),
      }];
    }
    return [];
  });
}
