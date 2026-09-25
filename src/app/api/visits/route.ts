import { NextRequest } from "next/server";
import { recordVisit } from "@/lib/visits";

export async function POST(request: NextRequest) {
  return recordVisit(request);
}
