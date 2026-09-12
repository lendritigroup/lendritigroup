import { NextRequest } from "next/server";
import { loginAdmin } from "@/lib/auth";

export async function POST(request: NextRequest) {
  const body = await request.json();
  const username = String(body.username || body.email || "");
  const password = String(body.password || "");
  const result = await loginAdmin(username, password);
  if ("error" in result) {
    return Response.json({ error: result.error }, { status: 401 });
  }
  return Response.json({ ok: true });
}
