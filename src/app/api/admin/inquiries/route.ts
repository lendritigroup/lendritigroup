import { NextRequest } from "next/server";
import { requireAdmin } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const admin = await requireAdmin();
  if (!admin) return Response.json({ error: "Unauthorized" }, { status: 401 });
  const inquiries = await prisma.inquiry.findMany({
    include: { machine: { select: { manufacturer: true, model: true, slug: true } } },
    orderBy: { createdAt: "desc" },
  });
  return Response.json({ inquiries });
}

export async function PATCH(request: NextRequest) {
  const admin = await requireAdmin();
  if (!admin) return Response.json({ error: "Unauthorized" }, { status: 401 });
  const body = await request.json();
  await prisma.inquiry.update({
    where: { id: String(body.id) },
    data: { status: String(body.status || "read") },
  });
  return Response.json({ ok: true });
}
