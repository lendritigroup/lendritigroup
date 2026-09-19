import { NextRequest } from "next/server";
import { requireAdmin } from "@/lib/auth";
import {
  CATEGORY_CARDS,
  parseCategoryImage,
  saveCategoryImages,
  type CategoryImageMap,
} from "@/lib/category-images";

export async function PUT(request: NextRequest) {
  const admin = await requireAdmin();
  if (!admin) return Response.json({ error: "Unauthorized" }, { status: 401 });

  const body = await request.json();
  const images = {} as CategoryImageMap;
  for (const card of CATEGORY_CARDS) {
    images[card.id] = parseCategoryImage(body?.[card.id], card.id);
  }

  await saveCategoryImages(images);
  return Response.json({ ok: true, images });
}
