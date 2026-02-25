"use client";

import { useQuery } from "@tanstack/react-query";
import { DashboardShell } from "@/components/dashboard/dashboard-shell";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getJson } from "@/lib/api/client";
import { BarViz } from "@/components/dashboard/charts";
import { EmptyState, ErrorState, LoadingGrid } from "@/components/dashboard/state-blocks";

export default function GeographyPage() {
  return <DashboardShell>{({ filters }) => <Body filters={filters} />}</DashboardShell>;
}

function Body({ filters }: { filters: any }) {
  const q = useQuery({ queryKey: ["geography", filters], queryFn: () => getJson<any>("/api/geography", filters) });
  if (q.isLoading) return <LoadingGrid />;
  if (q.isError) return <ErrorState message={q.error.message} />;
  if (!q.data?.byRegion?.length) return <EmptyState message="No geography data for selected filters." />;

  return (
    <div className="grid gap-4 md:grid-cols-2">
      <Card><CardHeader><CardTitle>Registrations by Region</CardTitle></CardHeader><CardContent><BarViz data={q.data.byRegion} /></CardContent></Card>
      <Card><CardHeader><CardTitle>Underrepresented Regions (Gap)</CardTitle></CardHeader><CardContent><BarViz data={q.data.underrepresented.map((i:any)=>({name:i.name,value:i.gap}))} /></CardContent></Card>
      <Card className="md:col-span-2"><CardHeader><CardTitle>Channel Effectiveness by Region</CardTitle></CardHeader><CardContent><pre className="overflow-auto rounded bg-muted p-3 text-xs">{JSON.stringify(q.data.channelByRegion, null, 2)}</pre></CardContent></Card>
    </div>
  );
}
