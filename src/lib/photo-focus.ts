export type PhotoFocus = {
  url: string;
  focusX: number;
  focusY: number;
};

export function clampFocus(value: unknown, fallback = 50) {
  const n = Number(value);
  if (!Number.isFinite(n)) return fallback;
  return Math.min(100, Math.max(0, n));
}

export function objectPosition(photo?: { focusX?: number | null; focusY?: number | null } | null) {
  return `${clampFocus(photo?.focusX)}% ${clampFocus(photo?.focusY)}%`;
}

export function parsePhotoInputs(value: unknown): PhotoFocus[] {
  if (!Array.isArray(value)) return [];
  return value.flatMap((item) => {
    if (typeof item === "string" && item.trim()) {
      return [{ url: item.trim(), focusX: 50, focusY: 50 }];
    }
    if (item && typeof item === "object" && "url" in item && typeof item.url === "string" && item.url.trim()) {
      return [{
        url: item.url.trim(),
        focusX: clampFocus("focusX" in item ? item.focusX : 50),
        focusY: clampFocus("focusY" in item ? item.focusY : 50),
      }];
    }
    return [];
  });
}
