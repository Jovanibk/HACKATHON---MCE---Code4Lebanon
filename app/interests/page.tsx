"use client";

import { useQuery } from "@tanstack/react-query";
import { DashboardShell } from "@/components/dashboard/dashboard-shell";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getJson } from "@/lib/api/client";
import { BarViz, PieViz } from "@/components/dashboard/charts";
import { EmptyState, ErrorState, LoadingGrid } from "@/components/dashboard/state-blocks";

export default function InterestPage() {
  return <DashboardShell>{({ filters }) => <Body filters={filters} />}</DashboardShell>;
}

function Body({ filters }: { filters: any }) {
  const q = useQuery({ queryKey: ["interests", filters], queryFn: () => getJson<any>("/api/interests", filters) });
  if (q.isLoading) return <LoadingGrid />;
  if (q.isError) return <ErrorState message={q.error.message} />;
  if (!q.data?.demandByTrack?.length) return <EmptyState message="No demand data for selected filters." />;

  return (
    <div className="grid gap-4 md:grid-cols-2">
      <Card><CardHeader><CardTitle>Demand by Track/Topics</CardTitle></CardHeader><CardContent><BarViz data={q.data.demandByTrack} /></CardContent></Card>
      <Card><CardHeader><CardTitle>Motivations</CardTitle></CardHeader><CardContent><PieViz data={q.data.motivations} /></CardContent></Card>
      <Card className="md:col-span-2"><CardHeader><CardTitle>Challenges</CardTitle></CardHeader><CardContent><BarViz data={q.data.challenges} /></CardContent></Card>
    </div>
  );
}
