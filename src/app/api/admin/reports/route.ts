import { NextRequest } from "next/server";
import { requireAdmin } from "@/lib/auth";
import { buildReports } from "@/lib/reports";

export async function GET(request: NextRequest) {
  const admin = await requireAdmin();
  if (!admin) return Response.json({ error: "Unauthorized" }, { status: 401 });
  const q = request.nextUrl.searchParams;
  const report = await buildReports({
    preset: q.get("preset") || undefined,
    from: q.get("from") || undefined,
    to: q.get("to") || undefined,
    category: q.get("category") || undefined,
    manufacturer: q.get("manufacturer") || undefined,
    machineId: q.get("machineId") || undefined,
    sold: q.get("sold") || undefined,
    result: q.get("result") || undefined,
  });
  return Response.json(report);
}
