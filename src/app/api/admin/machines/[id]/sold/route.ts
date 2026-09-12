import { NextRequest } from "next/server";
import { requireAdmin } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { summarizeFinance } from "@/lib/finance";
import { toAdmin } from "@/lib/machines";

type Ctx = { params: Promise<{ id: string }> };

export async function POST(request: NextRequest, ctx: Ctx) {
  const admin = await requireAdmin();
  if (!admin) return Response.json({ error: "Unauthorized" }, { status: 401 });
  const { id } = await ctx.params;
  const body = await request.json();
  const rawPrice = String(body.actualSellingPrice ?? "").trim().replace(",", ".");
  const parsed = rawPrice === "" ? null : Number(rawPrice);
  const actualSellingPrice = parsed != null && Number.isFinite(parsed) ? parsed : null;

  const updated = await prisma.machine.update({
    where: { id },
    data: {
      status: "sold",
      actualSellingPrice,
      sellingCurrency: String(body.sellingCurrency || "EUR"),
      saleDate: body.saleDate ? new Date(String(body.saleDate)) : new Date(),
      buyer: body.buyer ? String(body.buyer) : null,
      sellingCosts: Number(body.sellingCosts || 0),
      otherSaleCosts: Number(body.otherSaleCosts || 0),
      saleNotes: body.saleNotes ? String(body.saleNotes) : null,
    },
    include: { photos: true, documents: true },
  });

  return Response.json({
    machine: toAdmin(updated),
    finance: summarizeFinance(updated),
  });
}
