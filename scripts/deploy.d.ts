/**
 * Cross-platform deploy: push the Vite build in dist/ to S3 with per-tier cache
 * headers. Pure Node + AWS SDK v3 — no AWS CLI required. Replaces the old
 * deploy.sh.
 *
 * Run via `npm run deploy`, which builds first then invokes this with
 * `tsx --env-file-if-exists=.env`, so all AWS config + credentials come from .env:
 *
 *   Required: S3_BUCKET, AWS_REGION (or AWS_DEFAULT_REGION),
 *             AWS_ACCESS_KEY_ID, AWS_SECRET_ACCESS_KEY
 *   Optional: AWS_SESSION_TOKEN  (temporary/STS credentials)
 *
 * Cache tiers (matching the old deploy.sh), keyed by S3 object key:
 *   index.html  -> no-cache                                (always overwritten, never deleted)
 *   data/**     -> public, max-age=3600                    (never deleted)
 *   everything  -> public, max-age=31536000, immutable     (stale objects deleted)
 *   else
 *
 * Stale-delete replicates `aws s3 sync --delete --exclude index.html --exclude data/*`:
 * remote objects absent locally are removed, except index.html and anything under data/.
 */
export {};
