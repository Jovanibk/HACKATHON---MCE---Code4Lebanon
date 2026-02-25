import { Learner, Filters } from "@/lib/types/dashboard";
import { mockLearners } from "@/lib/mocks/demo-data";

const API_BASE_URL = process.env.NUMU_API_BASE_URL || "https://numu-survey.codeforlebanon.com";
const API_KEY = process.env.NUMU_API_KEY;
const AUTH_HEADER = process.env.NUMU_API_AUTH_HEADER || "x-api-key";

type AnyRecord = Record<string, unknown>;

function normalizeLearner(raw: AnyRecord, index: number): Learner {
  return {
    id: String(raw.id ?? raw.learnerId ?? raw.userId ?? index + 1),
    fullName: String(raw.fullName ?? raw.name ?? raw.learner_name ?? "Unknown Learner"),
    age: Number(raw.age ?? raw.age_years ?? 0) || undefined,
    region: String(raw.region ?? raw.governorate ?? "Unknown"),
    track: String(raw.track ?? raw.learning_track ?? "Unknown"),
    channel: String(raw.channel ?? raw.registration_channel ?? "Unknown"),
    subEntity: String(raw.subEntity ?? raw.entity ?? raw.partner_entity ?? "Unknown"),
    employmentStatus: String(raw.employmentStatus ?? raw.employment ?? "Unknown"),
    jobLevel: String(raw.jobLevel ?? raw.seniority ?? "Unknown"),
    microsoftStatus: String(raw.microsoftStatus ?? raw.microsoft_status ?? "Unknown"),
    oracleStatus: String(raw.oracleStatus ?? raw.oracle_status ?? "Unknown"),
    motivation: String(raw.motivation ?? raw.main_motivation ?? "Unknown"),
    challenge: String(raw.challenge ?? raw.main_challenge ?? "Unknown"),
    createdAt: String(raw.createdAt ?? raw.created_at ?? "") || undefined
  };
}

function applyFilters(learners: Learner[], filters: Filters): Learner[] {
  return learners.filter((l) => {
    const age = l.age ?? 0;
    return (!filters.channel || l.channel === filters.channel) &&
      (!filters.subEntity || l.subEntity === filters.subEntity) &&
      (!filters.region || l.region === filters.region) &&
      (!filters.track || l.track === filters.track) &&
      (!filters.employmentStatus || l.employmentStatus === filters.employmentStatus) &&
      (!filters.jobLevel || l.jobLevel === filters.jobLevel) &&
      (!filters.ageMin || age >= filters.ageMin) &&
      (!filters.ageMax || age <= filters.ageMax);
  });
}

async function fetchFromCandidates(paths: string[]): Promise<AnyRecord[]> {
  if (!API_KEY) throw new Error("NUMU_API_KEY is not set.");

  for (const path of paths) {
    const res = await fetch(`${API_BASE_URL}${path}`, {
      headers: { [AUTH_HEADER]: API_KEY, Accept: "application/json" },
      next: { revalidate: 60 }
    });
    if (!res.ok) continue;
    const json = await res.json();
    if (Array.isArray(json)) return json as AnyRecord[];
    if (Array.isArray(json?.data)) return json.data as AnyRecord[];
    if (Array.isArray(json?.results)) return json.results as AnyRecord[];
  }
  throw new Error("No compatible NUMU endpoint returned data.");
}

export async function getLearners(filters: Filters = {}): Promise<{ source: "api" | "mock"; learners: Learner[] }> {
  try {
    const rows = await fetchFromCandidates(["/api/learners", "/api/submissions", "/api/responses", "/api/survey-responses"]);
    const learners = rows.map(normalizeLearner);
    return { source: "api", learners: applyFilters(learners, filters) };
  } catch {
    return { source: "mock", learners: applyFilters(mockLearners, filters) };
  }
}

export async function getLearnerById(id: string): Promise<{ source: "api" | "mock"; learner?: Learner }> {
  const { source, learners } = await getLearners();
  return { source, learner: learners.find((l) => l.id === id) };
}
