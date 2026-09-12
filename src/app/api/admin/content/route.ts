import { NextRequest } from "next/server";
import { requireAdmin } from "@/lib/auth";
import {
  SITE_CONTENT_KEYS,
  saveSiteContentDraft,
  type SiteContentDraft,
  type SiteContentKey,
} from "@/lib/site-content";
import { locales, type Locale } from "@/i18n/config";

export async function PUT(request: NextRequest) {
  const admin = await requireAdmin();
  if (!admin) return Response.json({ error: "Unauthorized" }, { status: 401 });

  const body = await request.json();
  const draft = {} as SiteContentDraft;

  for (const key of SITE_CONTENT_KEYS) {
    const item = body?.[key];
    if (!item || typeof item !== "object") {
      return Response.json({ error: `Missing ${key}` }, { status: 400 });
    }
    draft[key as SiteContentKey] = {
      sq: String(item.sq ?? ""),
      en: String(item.en ?? ""),
      de: String(item.de ?? ""),
    };
    for (const locale of locales) {
      if (typeof draft[key][locale as Locale] !== "string") {
        return Response.json({ error: `Invalid ${key}.${locale}` }, { status: 400 });
      }
    }
  }

  await saveSiteContentDraft(draft);
  return Response.json({ ok: true });
}
