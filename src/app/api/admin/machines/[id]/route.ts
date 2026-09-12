import { NextRequest } from "next/server";
import { requireAdmin } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { parseMachinePayload } from "@/lib/machine-payload";
import { getAdminMachine, toAdmin } from "@/lib/machines";

type Ctx = { params: Promise<{ id: string }> };

export async function GET(_req: NextRequest, ctx: Ctx) {
  const admin = await requireAdmin();
  if (!admin) return Response.json({ error: "Unauthorized" }, { status: 401 });
  const { id } = await ctx.params;
  const machine = await getAdminMachine(id);
  if (!machine) return Response.json({ error: "Not found" }, { status: 404 });
  return Response.json({ machine });
}

export async function PATCH(request: NextRequest, ctx: Ctx) {
  const admin = await requireAdmin();
  if (!admin) return Response.json({ error: "Unauthorized" }, { status: 401 });
  const { id } = await ctx.params;
  const existing = await prisma.machine.findUnique({ where: { id } });
  if (!existing) return Response.json({ error: "Not found" }, { status: 404 });

  const body = await request.json();
  const data = parseMachinePayload(body, existing.slug);

  const updated = await prisma.machine.update({
    where: { id },
    data,
    include: { photos: true, documents: true },
  });

  if (Array.isArray(body.photos)) {
    await prisma.photo.deleteMany({ where: { machineId: id } });
    if (body.photos.length) {
      await prisma.photo.createMany({
        data: body.photos.map((url: string, i: number) => ({
          machineId: id,
          url,
          orderIndex: i,
          isMain: i === (body.mainPhotoIndex ?? 0),
          alt: `${data.manufacturer} ${data.model}`,
        })),
      });
    }
  }

  const machine = await prisma.machine.findUnique({
    where: { id: updated.id },
    include: { photos: true, documents: true },
  });
  return Response.json({ machine: machine ? toAdmin(machine) : null });
}

export async function DELETE(_req: NextRequest, ctx: Ctx) {
  const admin = await requireAdmin();
  if (!admin) return Response.json({ error: "Unauthorized" }, { status: 401 });
  const { id } = await ctx.params;
  const exists = await prisma.machine.findUnique({ where: { id }, select: { id: true } });
  if (!exists) return Response.json({ error: "Not found" }, { status: 404 });
  const { deleteMachineById } = await import("@/lib/delete-machine");
  await deleteMachineById(id);
  return Response.json({ ok: true });
}
