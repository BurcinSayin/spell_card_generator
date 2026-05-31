# Pathfinder 1e Spell Card Generator

Static, client-side web app for browsing the Pathfinder 1st Edition spell list and exporting a print-ready A4 PDF of spell cards (4-up portrait or 6-up landscape). See `project_plan.md` for the full spec.

## Develop

```bash
npm install
cp .env.example .env   # then point SPELLS_PF1E_PATH / SPELLS_PF2E_PATH at the upstream JSON
npm run dev            # http://127.0.0.1:3500  (predev bootstraps public/data/<id>/spells.json)
```

## Build

```bash
npm run build         # tsc -b && vite build → dist/
npm run preview       # serve dist/ locally
```

## Deploy (AWS S3)

Put your AWS config in `.env` (see `.env.example`):

```
S3_BUCKET=your-bucket
AWS_REGION=us-east-1
AWS_ACCESS_KEY_ID=...
AWS_SECRET_ACCESS_KEY=...
```

```bash
npm run deploy        # build, then push dist/ to S3
```

`scripts/deploy.ts` is a cross-platform Node script (AWS SDK v3 — no AWS CLI needed). It builds, then uploads `dist/` to S3 with per-tier cache headers (`index.html` no-cache, `data/**` 1h, hashed assets immutable) and removes stale hashed assets.
