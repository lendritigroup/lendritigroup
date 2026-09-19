import { prisma, withDatabase } from "@/lib/prisma";
import { clampFocus, clampZoom, DEFAULT_ZOOM, type PhotoFocus } from "@/lib/photo-focus";

export const CATEGORY_CARDS = [
  {
    id: "excavators",
    label: "Ekskavatorë",
    href: "/excavators",
    defaultUrl: "/images/machines/category-excavators.png",
  },
  {
    id: "trucks",
    label: "Kamionë",
    href: "/trucks",
    defaultUrl: "/images/machines/category-trucks.png",
  },
  {
    id: "other",
    label: "Makineri tjetër",
    href: "/other-machinery",
    defaultUrl: "/images/machines/category-other.png",
  },
] as const;

export type CategoryCardId = (typeof CATEGORY_CARDS)[number]["id"];
export type CategoryImage = PhotoFocus;
export type CategoryImageMap = Record<CategoryCardId, CategoryImage>;

function contentKey(id: CategoryCardId) {
  return `home.categoryImage.${id}`;
}

function fallbackImage(id: CategoryCardId): CategoryImage {
  const card = CATEGORY_CARDS.find((item) => item.id === id)!;
  return { url: card.defaultUrl, focusX: 50, focusY: 50, zoom: DEFAULT_ZOOM };
}

export function parseCategoryImage(value: unknown, id: CategoryCardId): CategoryImage {
  const fallback = fallbackImage(id);
  if (!value) return fallback;
  try {
    const parsed = typeof value === "string" ? JSON.parse(value) : value;
    if (!parsed || typeof parsed !== "object" || typeof parsed.url !== "string" || !parsed.url.trim()) {
      return fallback;
    }
    return {
      url: parsed.url.trim(),
      focusX: clampFocus(parsed.focusX),
      focusY: clampFocus(parsed.focusY),
      zoom: clampZoom(parsed.zoom ?? parsed.focusZoom),
    };
  } catch {
    return fallback;
  }
}

export function defaultCategoryImages(): CategoryImageMap {
  return {
    excavators: fallbackImage("excavators"),
    trucks: fallbackImage("trucks"),
    other: fallbackImage("other"),
  };
}

export async function getCategoryImages(): Promise<CategoryImageMap> {
  const fallback = defaultCategoryImages();
  return withDatabase(async () => {
    const keys = CATEGORY_CARDS.map((card) => contentKey(card.id));
    const rows = await prisma.pageContent.findMany({ where: { key: { in: keys } } });
    const byKey = Object.fromEntries(rows.map((row) => [row.key, row.contentEn || row.contentSq]));
    return {
      excavators: parseCategoryImage(byKey[contentKey("excavators")], "excavators"),
      trucks: parseCategoryImage(byKey[contentKey("trucks")], "trucks"),
      other: parseCategoryImage(byKey[contentKey("other")], "other"),
    };
  }, fallback);
}

export async function saveCategoryImages(images: CategoryImageMap) {
  await prisma.$transaction(
    CATEGORY_CARDS.map((card) => {
      const image = parseCategoryImage(images[card.id], card.id);
      const payload = JSON.stringify(image);
      return prisma.pageContent.upsert({
        where: { key: contentKey(card.id) },
        create: {
          key: contentKey(card.id),
          contentEn: payload,
          contentSq: payload,
          contentDe: payload,
        },
        update: {
          contentEn: payload,
          contentSq: payload,
          contentDe: payload,
        },
      });
    })
  );
}
