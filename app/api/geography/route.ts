import { NextRequest, NextResponse } from "next/server";
import { getLearners } from "@/lib/api/numu";
import { groupCount, parseFilters } from "../_helpers";

export async function GET(req: NextRequest) {
  const { learners, source } = await getLearners(parseFilters(req.nextUrl.searchParams));
  const byRegion = groupCount(learners, (l) => l.region);
  const avg = learners.length / Math.max(byRegion.length, 1);
  const underrepresented = byRegion.filter((x) => x.value < avg).map((x) => ({ ...x, gap: Math.round(avg - x.value) }));

  const channelByRegion = Object.entries(learners.reduce<Record<string, Record<string, number>>>((acc, l) => {
    const r = l.region || "Unknown";
    const c = l.channel || "Unknown";
    acc[r] ||= {};
    acc[r][c] = (acc[r][c] || 0) + 1;
    return acc;
  }, {})).map(([region, channels]) => ({ region, ...channels }));

  return NextResponse.json({ source, byRegion, underrepresented, channelByRegion });
}
