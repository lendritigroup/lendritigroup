import { NextRequest } from "next/server";
import { requireAdmin } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { parseMachinePayload } from "@/lib/machine-payload";
import { listAdminMachines, toAdmin } from "@/lib/machines";

export async function GET() {
  const admin = await requireAdmin();
  if (!admin) return Response.json({ error: "Unauthorized" }, { status: 401 });
  return Response.json({ machines: await listAdminMachines() });
}

export async function POST(request: NextRequest) {
  const admin = await requireAdmin();
  if (!admin) return Response.json({ error: "Unauthorized" }, { status: 401 });

  const body = await request.json();
  const data = parseMachinePayload(body);

  let created;
  try {
    created = await prisma.machine.create({
      data,
      include: { photos: true, documents: true },
    });
  } catch (err) {
    if (String(err).includes("Unique") || String(err).includes("slug")) {
      created = await prisma.machine.create({
        data: { ...data, slug: `${data.slug}-${Date.now().toString(36)}` },
        include: { photos: true, documents: true },
      });
    } else {
      throw err;
    }
  }

  const photos: string[] = Array.isArray(body.photos) ? body.photos : [];
  if (photos.length) {
    await prisma.photo.createMany({
      data: photos.map((url, i) => ({
        machineId: created.id,
        url,
        orderIndex: i,
        isMain: i === 0,
        alt: `${data.manufacturer} ${data.model}`,
      })),
    });
  }
  const documents: { url: string; title?: string }[] = Array.isArray(body.documents) ? body.documents : [];
  if (documents.length) {
    await prisma.document.createMany({
      data: documents.map((d) => ({
        machineId: created.id,
        url: d.url,
        title: d.title || "Document",
        type: d.url.toLowerCase().endsWith(".pdf") ? "pdf" : "file",
      })),
    });
  }

  const machine = await prisma.machine.findUnique({
    where: { id: created.id },
    include: { photos: true, documents: true },
  });
  return Response.json({ machine: machine ? toAdmin(machine) : null });
}
