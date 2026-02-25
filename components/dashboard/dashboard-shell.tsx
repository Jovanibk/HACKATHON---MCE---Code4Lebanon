"use client";

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { GlobalFilters } from "@/components/dashboard/global-filters";
import { EmptyState, ErrorState, LoadingGrid } from "@/components/dashboard/state-blocks";
import { getJson } from "@/lib/api/client";
import { Filters } from "@/lib/types/dashboard";

export function useDashboardFilters() {
  const [filters, setFilters] = useState<Filters>({});
  const summary = useQuery({ queryKey: ["summary"], queryFn: () => getJson<{ options: any; totals: any; source: string }>("/api/summary") });
  return { filters, setFilters, summary };
}

export function DashboardShell({ children }: { children: (props: { filters: Filters }) => React.ReactNode }) {
  const { filters, setFilters, summary } = useDashboardFilters();

  if (summary.isLoading) return <LoadingGrid />;
  if (summary.isError) return <ErrorState message={summary.error.message} />;
  if (!summary.data) return <EmptyState message="No summary available." />;

  return (
    <div className="space-y-4">
      <GlobalFilters filters={filters} setFilters={setFilters} options={summary.data.options} />
      <p className="text-xs text-muted-foreground">Data source: {summary.data.source.toUpperCase()}</p>
      {children({ filters })}
    </div>
  );
}
