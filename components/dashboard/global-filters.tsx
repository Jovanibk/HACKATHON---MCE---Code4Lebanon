"use client";

import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Filters } from "@/lib/types/dashboard";

const fields = ["channel", "subEntity", "region", "track", "employmentStatus", "jobLevel"] as const;

type Options = Record<(typeof fields)[number], string[]>;

export function GlobalFilters({ filters, setFilters, options }: { filters: Filters; setFilters: (v: Filters) => void; options: Options }) {
  const update = (key: keyof Filters, value?: string | number) => setFilters({ ...filters, [key]: value || undefined });

  return (
    <div className="grid grid-cols-2 gap-3 rounded-xl border p-4 md:grid-cols-4 xl:grid-cols-8">
      {fields.map((key) => (
        <Select key={key} value={filters[key] as string | undefined} onValueChange={(v) => update(key, v === "all" ? undefined : v)}>
          <SelectTrigger><SelectValue placeholder={key} /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All</SelectItem>
            {(options[key] || []).map((o) => <SelectItem key={o} value={o}>{o}</SelectItem>)}
          </SelectContent>
        </Select>
      ))}
      <Input type="number" placeholder="Age min" value={filters.ageMin ?? ""} onChange={(e) => update("ageMin", Number(e.target.value) || undefined)} />
      <Input type="number" placeholder="Age max" value={filters.ageMax ?? ""} onChange={(e) => update("ageMax", Number(e.target.value) || undefined)} />
    </div>
  );
}
