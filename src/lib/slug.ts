export function slugify(value: string) {
  return value
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 80);
}

export function machineSlug(manufacturer: string, model: string, year?: number | null) {
  const base = slugify([manufacturer, model, year].filter(Boolean).join(" "));
  return base || `listing-${Date.now().toString(36)}`;
}
