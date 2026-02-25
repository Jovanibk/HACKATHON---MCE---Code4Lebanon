import { NextRequest, NextResponse } from "next/server";
import { getLearners } from "@/lib/api/numu";
import { groupCount, parseFilters } from "../_helpers";

export async function GET(req: NextRequest) {
  const filters = parseFilters(req.nextUrl.searchParams);
  const { learners, source } = await getLearners(filters);

  const byChannel = groupCount(learners, (l) => l.channel);
  const bySubEntity = groupCount(learners, (l) => `${l.channel || "Unknown"} • ${l.subEntity || "Unknown"}`);
  const overTime = groupCount(learners, (l) => l.createdAt?.slice(0, 7) || "Unknown month");

  return NextResponse.json({ source, byChannel, bySubEntity, overTime });
}
