import { NextRequest, NextResponse } from "next/server";
import { getLearners } from "@/lib/api/numu";
import { groupCount, parseFilters } from "../_helpers";

export async function GET(req: NextRequest) {
  const { learners, source } = await getLearners(parseFilters(req.nextUrl.searchParams));
  return NextResponse.json({
    source,
    demandByTrack: groupCount(learners, (l) => l.track),
    motivations: groupCount(learners, (l) => l.motivation),
    challenges: groupCount(learners, (l) => l.challenge)
  });
}
