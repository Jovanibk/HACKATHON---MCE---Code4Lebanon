import { NextRequest, NextResponse } from "next/server";
import { getLearners } from "@/lib/api/numu";
import { optionsFromLearners } from "../_helpers";

export async function GET(req: NextRequest) {
  const { learners, source } = await getLearners();
  return NextResponse.json({
    source,
    totals: {
      learners: learners.length,
      regions: new Set(learners.map((l) => l.region)).size,
      channels: new Set(learners.map((l) => l.channel)).size,
      tracks: new Set(learners.map((l) => l.track)).size
    },
    options: optionsFromLearners(learners)
  });
}
