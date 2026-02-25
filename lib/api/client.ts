import { Filters } from "@/lib/types/dashboard";

function qs(filters: Filters = {}) {
  const params = new URLSearchParams();
  Object.entries(filters).forEach(([k, v]) => {
    if (v !== undefined && v !== "") params.set(k, String(v));
  });
  return params.toString();
}

export async function getJson<T>(path: string, filters?: Filters): Promise<T> {
  const suffix = filters ? `?${qs(filters)}` : "";
  const res = await fetch(`${path}${suffix}`);
  if (!res.ok) throw new Error(`Failed ${path}`);
  return res.json();
}
