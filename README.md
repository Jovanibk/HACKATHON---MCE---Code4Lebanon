# NUMU National Monitoring & Analytics Dashboard

Demo-ready Next.js frontend for survey analytics with local aggregated API routes.

## Tech
- Next.js App Router + TypeScript
- Tailwind CSS + shadcn-style UI components
- `next-themes` with persisted theme toggle
- React Query for data fetching and caching
- Recharts for visualizations

## Setup
```bash
npm install
cp .env.example .env.local
npm run dev
```

Open `http://localhost:3000`.

## Environment variables
Set in `.env.local`:

- `NUMU_API_KEY`: API key for NUMU API (**required in production**)
- `NUMU_API_BASE_URL`: defaults to `https://numu-survey.codeforlebanon.com`
- `NUMU_API_AUTH_HEADER`: defaults to `x-api-key` (override if API docs specify a different auth header)

## Local API architecture
Browser calls only local aggregated endpoints:
- `GET /api/summary`
- `GET /api/dissemination`
- `GET /api/interests`
- `GET /api/geography`
- `GET /api/learners`
- `GET /api/learner/[id]`

These handlers fetch NUMU API data, normalize/aggregate into chart-ready shape, and automatically fall back to deterministic mock data if API fields/endpoints are unavailable so the demo never breaks.

## Pages
- Dissemination Performance
- Interest & Strategy
- Geographic Insights
- Unified Learner Profiles

All pages share global filters: channel/sub-entity, region, track, age range, employment status, and job level.
