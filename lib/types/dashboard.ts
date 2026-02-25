export type Learner = {
  id: string;
  fullName: string;
  age?: number;
  region?: string;
  track?: string;
  channel?: string;
  subEntity?: string;
  employmentStatus?: string;
  jobLevel?: string;
  microsoftStatus?: string;
  oracleStatus?: string;
  motivation?: string;
  challenge?: string;
  createdAt?: string;
};

export type Filters = {
  channel?: string;
  subEntity?: string;
  region?: string;
  track?: string;
  ageMin?: number;
  ageMax?: number;
  employmentStatus?: string;
  jobLevel?: string;
};
