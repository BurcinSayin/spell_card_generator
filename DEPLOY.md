# Deploying

> This is how the maintainer deploys the live demo at <https://spellcard.burcinsayin.xyz>. The script is AWS S3-specific; forks targeting a different host can ignore it and run `npm run build` then point any static host at `dist/`.

## What `npm run deploy` does

`scripts/deploy.ts` is a cross-platform Node script (AWS SDK v3, no AWS CLI required). It runs `npm run build`, then uploads everything under `dist/` to an S3 bucket with per-tier cache headers:

| Path                    | `Cache-Control`                             | Stale-delete? |
| ----------------------- | ------------------------------------------- | ------------- |
| `index.html`            | `no-cache`                                  | No (kept)     |
| `data/**`               | `public, max-age=3600`                      | No (kept)     |
| everything else (hashed assets) | `public, max-age=31536000, immutable` | Yes           |

Stale-delete replicates `aws s3 sync --delete --exclude index.html --exclude 'data/*'`: any remote object that's not in `dist/` is removed, except `index.html` and anything under `data/`.

## Setup

1. Create an S3 bucket configured for static website hosting (or fronted by CloudFront).
2. Create an IAM user with a tightly-scoped policy — minimum permissions on that one bucket only:
   - `s3:PutObject`
   - `s3:DeleteObject`
   - `s3:ListBucket`
   Do not reuse a wide-scope key for this; the script only needs to read/write objects in this bucket.
3. Copy `.env.example` to `.env` and fill in the AWS block:
   ```
   S3_BUCKET=your-bucket-name
   AWS_REGION=us-east-1
   AWS_ACCESS_KEY_ID=...
   AWS_SECRET_ACCESS_KEY=...
   # AWS_SESSION_TOKEN=...   # only if using temporary/STS credentials
   ```
   The bucket name `spellcard.burcinsayin.xyz` you may see in commit history is the maintainer's bucket — not a default.
4. Run:
   ```
   npm run deploy
   ```
