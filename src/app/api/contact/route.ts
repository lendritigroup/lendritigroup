import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(request: NextRequest) {
  const body = await request.json();
  const name = String(body.name || "").trim() || "—";
  const email = String(body.email || "").trim() || "—";
  const phone = body.phone ? String(body.phone).trim() : null;
  const details = String(body.message || "").trim();
  const machineName = body.machineName ? String(body.machineName).trim() : "";
  const kind = body.kind === "sell" ? "sell" : "contact";

  let machineId: string | null = null;
  if (body.machineSlug) {
    const machine = await prisma.machine.findUnique({
      where: { slug: String(body.machineSlug) },
      select: { id: true },
    });
    machineId = machine?.id ?? null;
  }

  const parts = [];
  if (kind === "sell") {
    parts.push("Shit makinën tuaj");
    if (machineName) parts.push(`Cila makinë: ${machineName}`);
  }
  if (details) parts.push(details);
  const message = parts.join("\n\n") || "—";

  await prisma.inquiry.create({
    data: { name, email, phone, message, machineId },
  });

  return Response.json({ ok: true });
}
