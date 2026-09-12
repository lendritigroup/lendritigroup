import { NextRequest } from "next/server";
import { requireAdmin } from "@/lib/auth";
import { deleteDemoMachines, deleteMachinesByIds } from "@/lib/delete-machine";

export async function POST(request: NextRequest) {
  const admin = await requireAdmin();
  if (!admin) return Response.json({ error: "Unauthorized" }, { status: 401 });

  const body = await request.json().catch(() => ({}));
  if (body.demo === true) {
    const deleted = await deleteDemoMachines();
    return Response.json({ ok: true, deleted });
  }

  const ids = Array.isArray(body.ids) ? body.ids.filter((id: unknown) => typeof id === "string") : [];
  if (!ids.length) {
    return Response.json({ error: "No machines selected" }, { status: 400 });
  }
  const deleted = await deleteMachinesByIds(ids);
  return Response.json({ ok: true, deleted });
}
