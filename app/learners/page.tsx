"use client";

import { useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { DashboardShell } from "@/components/dashboard/dashboard-shell";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { getJson } from "@/lib/api/client";
import { EmptyState, ErrorState, LoadingGrid } from "@/components/dashboard/state-blocks";

export default function LearnersPage() {
  return <DashboardShell>{({ filters }) => <Body filters={filters} />}</DashboardShell>;
}

function Body({ filters }: { filters: any }) {
  const [search, setSearch] = useState("");
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const q = useQuery({ queryKey: ["learners", filters], queryFn: () => getJson<any>("/api/learners", filters) });
  const detail = useQuery({ queryKey: ["learner", selectedId], queryFn: () => getJson<any>(`/api/learner/${selectedId}`), enabled: Boolean(selectedId) });

  const filtered = useMemo(() => (q.data?.learners || []).filter((l: any) => l.fullName.toLowerCase().includes(search.toLowerCase()) || l.id.includes(search)), [q.data, search]);

  if (q.isLoading) return <LoadingGrid />;
  if (q.isError) return <ErrorState message={q.error.message} />;
  if (!filtered.length) return <EmptyState message="No learners match current filters/search." />;

  return (
    <Card>
      <CardHeader><CardTitle>Unified Learner Profiles</CardTitle></CardHeader>
      <CardContent className="space-y-3">
        <Input placeholder="Search by learner name or ID" value={search} onChange={(e) => setSearch(e.target.value)} />
        <div className="overflow-auto">
          <table className="w-full text-sm">
            <thead><tr className="border-b text-left"><th>ID</th><th>Name</th><th>Region</th><th>Track</th><th>Channel</th><th>Status</th></tr></thead>
            <tbody>
              {filtered.map((l: any) => (
                <tr key={l.id} className="cursor-pointer border-b hover:bg-accent/50" onClick={() => setSelectedId(l.id)}>
                  <td>{l.id}</td><td>{l.fullName}</td><td>{l.region}</td><td>{l.track}</td><td>{l.channel}</td><td><Badge>{l.microsoftStatus}</Badge></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </CardContent>
      <Dialog open={Boolean(selectedId)} onOpenChange={(o) => !o && setSelectedId(null)}>
        <DialogContent>
          {!selectedId || detail.isLoading ? <p>Loading learner details...</p> : detail.isError ? <p className="text-destructive">{detail.error.message}</p> : (
            <div className="space-y-2 text-sm">
              <h3 className="text-lg font-semibold">{detail.data.learner.fullName}</h3>
              <p>Age: {detail.data.learner.age ?? "N/A"}</p>
              <p>Region: {detail.data.learner.region}</p>
              <p>Track: {detail.data.learner.track}</p>
              <p>Dissemination Entity: {detail.data.learner.channel} • {detail.data.learner.subEntity}</p>
              <p>Employment: {detail.data.learner.employmentStatus} ({detail.data.learner.jobLevel})</p>
              <p>Microsoft status: {detail.data.learner.microsoftStatus}</p>
              <p>Oracle status: {detail.data.learner.oracleStatus}</p>
              <p>Motivation: {detail.data.learner.motivation}</p>
              <p>Challenge: {detail.data.learner.challenge}</p>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </Card>
  );
}
