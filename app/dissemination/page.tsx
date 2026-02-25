"use client";

import { useQuery } from "@tanstack/react-query";
import { DashboardShell } from "@/components/dashboard/dashboard-shell";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getJson } from "@/lib/api/client";
import { BarViz, LineViz } from "@/components/dashboard/charts";
import { EmptyState, ErrorState, LoadingGrid } from "@/components/dashboard/state-blocks";

export default function DisseminationPage() {
  return <DashboardShell>{({ filters }) => <Body filters={filters} />}</DashboardShell>;
}

function Body({ filters }: { filters: any }) {
  const q = useQuery({ queryKey: ["dissemination", filters], queryFn: () => getJson<any>("/api/dissemination", filters) });
  if (q.isLoading) return <LoadingGrid />;
  if (q.isError) return <ErrorState message={q.error.message} />;
  if (!q.data?.byChannel?.length) return <EmptyState message="No dissemination data for selected filters." />;

  return (
    <div className="grid gap-4 md:grid-cols-2">
      <Card><CardHeader><CardTitle>Registrations by Channel</CardTitle></CardHeader><CardContent><BarViz data={q.data.byChannel} /></CardContent></Card>
      <Card><CardHeader><CardTitle>Drill-down by Sub-Entity</CardTitle></CardHeader><CardContent><BarViz data={q.data.bySubEntity} /></CardContent></Card>
      <Card className="md:col-span-2"><CardHeader><CardTitle>Registrations Over Time</CardTitle></CardHeader><CardContent><LineViz data={q.data.overTime} /></CardContent></Card>
    </div>
  );
}
