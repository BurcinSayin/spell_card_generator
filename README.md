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

```bash
export S3_BUCKET=your-bucket
export CF_DISTRIBUTION_ID=optional-cloudfront-id
npm run deploy
```

`deploy.sh` syncs `dist/` to S3 with appropriate cache headers, then invalidates CloudFront if configured.
