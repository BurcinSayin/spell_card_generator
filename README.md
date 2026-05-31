# Pathfinder 1e/2e Spell Card Generator

A static, client-side web app for browsing the Pathfinder 1st Edition and 2nd Edition (Remaster) spell lists and exporting a print-ready A4 PDF of spell cards — 4-up portrait or 6-up landscape.

**Live demo:** <https://spellcard.burcinsayin.xyz>

## Features

- Browse PF1e or PF2e spells side-by-side filters: class/level, school, traits, components, range, duration, save, fuzzy text search.
- Build a selection tray, then export to a print-ready A4 PDF laid out as 4-up portrait or 6-up landscape cards.
- 100% client-side — no backend, no analytics; spell JSON is fetched once at load and everything else runs in the browser.

## Quick start

The repo ships with truncated sample data so it runs immediately after clone:

```bash
npm install
cp .env.example .env
npm run dev          # http://127.0.0.1:3500
```

`npm run dev` runs against the bundled `sample_data/pf1_spells.json` and `sample_data/pf2_spells.json` (handful of spells each, ~16 KB) — enough to see the UI work end-to-end, including PDF export.

## Using the full spell list

The complete PF1e/PF2e datasets are not redistributed in this repository. To run against the full lists, generate JSON with the upstream parser at <https://github.com/burcinsayin/rpg_parser> and point the env vars at the produced files:

```bash
SPELLS_PF1E_PATH=/abs/path/to/pf1_spells.json
SPELLS_PF2E_PATH=/abs/path/to/pf2_spells.json
```

`scripts/ensureData.ts` runs as a `predev` / `prebuild` hook: if `public/data/<system>/spells.json` is missing, it copies from the path in the env var. Existing files are never overwritten — delete them to re-pull.

**JSON shape:** an array of spell records with system-specific fields (`id`, `Name`, `Level`, `School`/`Traits`, `Components`/`Cast`, `Range`, etc.). The exact contracts live in [`src/systems/pf1e/normalize.ts`](src/systems/pf1e/normalize.ts) and [`src/systems/pf2e/normalize.ts`](src/systems/pf2e/normalize.ts) — match the shape there if supplying your own JSON from a different source.

## Build

```bash
npm run build        # tsc -b && vite build  →  dist/
npm run preview      # serve dist/ locally
```

## Deploy

The maintainer deploys to S3 with `npm run deploy` — see [DEPLOY.md](DEPLOY.md). Forks targeting a different host can ignore the script and serve `dist/` from any static host (Netlify, Cloudflare Pages, GitHub Pages, etc.).

## Tech stack

Vite · React 18 · TypeScript · Tailwind CSS · Zustand · Fuse.js · `react-window` for virtualized lists.

## License & credits

- **Code:** MIT — see [LICENSE](LICENSE).
- **Pathfinder spell content** (in `sample_data/` and any user-supplied JSON) is the property of Paizo Inc., redistributed under the Open Game License v1.0a (PF1e) and the ORC License (PF2e Remaster). Full attribution and Section 15 notices: [NOTICES.md](NOTICES.md).
- This project is an independent fan tool and is **not affiliated with or endorsed by Paizo Inc.**
