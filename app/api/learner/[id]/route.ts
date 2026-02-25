import { NextResponse } from "next/server";
import { getLearnerById } from "@/lib/api/numu";

export async function GET(_: Request, { params }: { params: { id: string } }) {
  const { learner, source } = await getLearnerById(params.id);
  if (!learner) return NextResponse.json({ source, error: "Learner not found" }, { status: 404 });
  return NextResponse.json({ source, learner });
}
