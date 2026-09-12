import { NextRequest } from "next/server";
import { requireAdmin } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { LISTING_STATUSES } from "@/lib/company";
import { toAdmin } from "@/lib/machines";

type Ctx = { params: Promise<{ id: string }> };

export async function POST(request: NextRequest, ctx: Ctx) {
  const admin = await requireAdmin();
  if (!admin) return Response.json({ error: "Unauthorized" }, { status: 401 });
  const { id } = await ctx.params;
  const body = await request.json();
  const status = String(body.status || "");
  if (!LISTING_STATUSES.includes(status as (typeof LISTING_STATUSES)[number])) {
    return Response.json({ error: "Invalid status" }, { status: 400 });
  }
  const updated = await prisma.machine.update({
    where: { id },
    data: { status, featured: body.featured == null ? undefined : Boolean(body.featured) },
    include: { photos: true, documents: true },
  });
  return Response.json({ machine: toAdmin(updated) });
}
