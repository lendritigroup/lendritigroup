import { NextResponse, type NextRequest } from "next/server";
import { prisma, withDatabase } from "./prisma";

const VISIT_ID = "visits";
const VISIT_COOKIE = "lg_visit";
const BOT =
  /bot|crawl|spider|slurp|facebookexternalhit|preview|headless|lighthouse|pingdom|uptime|wget|curl/i;

export async function getVisitCount(): Promise<number> {
  return withDatabase(async () => {
    const row = await prisma.siteStat.findUnique({ where: { id: VISIT_ID } });
    return row?.count ?? 0;
  }, 0);
}

export async function recordVisit(request: NextRequest): Promise<NextResponse> {
  const response = NextResponse.json({ ok: true });
  if (request.cookies.get("lg_admin")?.value) return response;
  if (request.cookies.get(VISIT_COOKIE)?.value) return response;

  const userAgent = request.headers.get("user-agent") ?? "";
  if (!userAgent || BOT.test(userAgent)) return response;

  try {
    await prisma.siteStat.upsert({
      where: { id: VISIT_ID },
      create: { id: VISIT_ID, count: 1 },
      update: { count: { increment: 1 } },
    });
  } catch (error) {
    console.error("Failed to record site visit", error);
    return response;
  }

  response.cookies.set(VISIT_COOKIE, "1", {
    httpOnly: true,
    sameSite: "lax",
    path: "/",
    secure: process.env.NODE_ENV === "production",
  });
  return response;
}
