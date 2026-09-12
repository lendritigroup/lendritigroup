import { prisma } from "@/lib/prisma";

export async function GET() {
  const machines = await prisma.machine.count();
  return Response.json({ ok: true, machines });
}
