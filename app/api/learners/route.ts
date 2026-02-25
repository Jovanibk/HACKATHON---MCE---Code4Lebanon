import { NextRequest, NextResponse } from "next/server";
import { getLearners } from "@/lib/api/numu";
import { optionsFromLearners, parseFilters } from "../_helpers";

export async function GET(req: NextRequest) {
  const filters = parseFilters(req.nextUrl.searchParams);
  const { learners, source } = await getLearners(filters);
  return NextResponse.json({ source, learners, options: optionsFromLearners(learners) });
}
