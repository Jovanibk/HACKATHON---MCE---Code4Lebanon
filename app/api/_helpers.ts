import { Filters, Learner } from "@/lib/types/dashboard";

export function parseFilters(searchParams: URLSearchParams): Filters {
  return {
    channel: searchParams.get("channel") || undefined,
    subEntity: searchParams.get("subEntity") || undefined,
    region: searchParams.get("region") || undefined,
    track: searchParams.get("track") || undefined,
    ageMin: searchParams.get("ageMin") ? Number(searchParams.get("ageMin")) : undefined,
    ageMax: searchParams.get("ageMax") ? Number(searchParams.get("ageMax")) : undefined,
    employmentStatus: searchParams.get("employmentStatus") || undefined,
    jobLevel: searchParams.get("jobLevel") || undefined
  };
}

export function groupCount<T extends string>(items: Learner[], getter: (l: Learner) => T | undefined) {
  return Object.entries(items.reduce<Record<string, number>>((acc, item) => {
    const key = getter(item) || "Unknown";
    acc[key] = (acc[key] || 0) + 1;
    return acc;
  }, {})).map(([name, value]) => ({ name, value }));
}

export function optionsFromLearners(learners: Learner[]) {
  const uniq = (v: (string | undefined)[]) => [...new Set(v.filter(Boolean) as string[])].sort();
  return {
    channel: uniq(learners.map((l) => l.channel)),
    subEntity: uniq(learners.map((l) => l.subEntity)),
    region: uniq(learners.map((l) => l.region)),
    track: uniq(learners.map((l) => l.track)),
    employmentStatus: uniq(learners.map((l) => l.employmentStatus)),
    jobLevel: uniq(learners.map((l) => l.jobLevel))
  };
}
