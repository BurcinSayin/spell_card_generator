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

import { existsSync, readdirSync, readFileSync } from 'node:fs';
import { join, relative, sep, extname } from 'node:path';
import {
  S3Client,
  PutObjectCommand,
  ListObjectsV2Command,
  DeleteObjectsCommand,
} from '@aws-sdk/client-s3';

const DIST = 'dist';

const CACHE_IMMUTABLE = 'public, max-age=31536000, immutable';
const CACHE_NO = 'no-cache';
const CACHE_DATA = 'public, max-age=3600';

const CONTENT_TYPES: Record<string, string> = {
  '.html': 'text/html; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.mjs': 'text/javascript; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.svg': 'image/svg+xml',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.gif': 'image/gif',
  '.webp': 'image/webp',
  '.ico': 'image/x-icon',
  '.woff': 'font/woff',
  '.woff2': 'font/woff2',
  '.ttf': 'font/ttf',
  '.txt': 'text/plain; charset=utf-8',
  '.map': 'application/json; charset=utf-8',
  '.wasm': 'application/wasm',
};

function required(name: string, value: string | undefined): string {
  if (!value) {
    console.error(`deploy: ${name} is not set. Add it to .env (see .env.example).`);
    process.exit(1);
  }
  return value;
}

/**
 * Load `.env` into process.env with OVERRIDE, so the file wins over any
 * pre-existing OS/shell environment variables. Node's `--env-file` flag does the
 * opposite — existing OS vars win — which silently shadows the `.env` AWS
 * credentials (a 20/40-char `AWS_ACCESS_KEY_ID`/`AWS_SECRET_ACCESS_KEY` left in
 * the OS env would override the file). Returns the parsed key→value map, used to
 * report each value's source. No-op if `.env` is absent (mirrors
 * `--env-file-if-exists`).
 */
function loadEnvOverride(path = '.env'): Record<string, string> {
  const parsed: Record<string, string> = {};
  if (!existsSync(path)) return parsed;
  for (const rawLine of readFileSync(path, 'utf8').split(/\r?\n/)) {
    const line = rawLine.trim();
    if (!line || line.startsWith('#')) continue;
    const eq = line.indexOf('=');
    if (eq === -1) continue;
    const key = line.slice(0, eq).trim();
    if (!key) continue;
    let value = line.slice(eq + 1).trim();
    if (
      value.length >= 2 &&
      ((value.startsWith('"') && value.endsWith('"')) ||
        (value.startsWith("'") && value.endsWith("'")))
    ) {
      value = value.slice(1, -1);
    }
    parsed[key] = value;
    process.env[key] = value; // override OS env
  }
  return parsed;
}

// Snapshot which keys came from the OS env BEFORE the override, so the resolved
// config print can attribute each value to `.env` vs `OS env`. Then let `.env` win.
const osEnvKeys = new Set(Object.keys(process.env));
const fileEnv = loadEnvOverride();

const BUCKET = required('S3_BUCKET', process.env.S3_BUCKET);
const REGION = required('AWS_REGION', process.env.AWS_REGION ?? process.env.AWS_DEFAULT_REGION);
const accessKeyId = required('AWS_ACCESS_KEY_ID', process.env.AWS_ACCESS_KEY_ID);
const secretAccessKey = required('AWS_SECRET_ACCESS_KEY', process.env.AWS_SECRET_ACCESS_KEY);
const sessionToken = process.env.AWS_SESSION_TOKEN;

/** Where a given env var ended up coming from. */
function sourceOf(key: string): string {
  if (key in fileEnv) return '.env';
  if (osEnvKeys.has(key)) return 'OS env';
  return 'unset';
}

/**
 * Mask a secret for display: keep `keepFront` leading + `keepBack` trailing
 * chars, star out the middle. Fully starred if too short to reveal any.
 */
function mask(value: string, keepFront: number, keepBack: number): string {
  if (value.length <= keepFront + keepBack) return '*'.repeat(value.length);
  return value.slice(0, keepFront) + '*'.repeat(value.length - keepFront - keepBack) + value.slice(-keepBack);
}

/** Print the resolved AWS config (credentials masked) and each value's source. */
function printResolvedConfig(): void {
  const regionKey = process.env.AWS_REGION ? 'AWS_REGION' : 'AWS_DEFAULT_REGION';
  const rows: Array<[string, string, string]> = [
    ['S3_BUCKET', BUCKET, sourceOf('S3_BUCKET')],
    ['AWS_REGION', REGION, sourceOf(regionKey)],
    ['AWS_ACCESS_KEY_ID', mask(accessKeyId, 4, 4), sourceOf('AWS_ACCESS_KEY_ID')],
    [
      'AWS_SECRET_ACCESS_KEY',
      `${mask(secretAccessKey, 0, 4)} [len ${secretAccessKey.length}]`,
      sourceOf('AWS_SECRET_ACCESS_KEY'),
    ],
    [
      'AWS_SESSION_TOKEN',
      sessionToken ? mask(sessionToken, 0, 4) : '(unset)',
      sourceOf('AWS_SESSION_TOKEN'),
    ],
  ];
  const width = Math.max(...rows.map(([name]) => name.length));
  console.log('deploy: resolved AWS config');
  for (const [name, value, source] of rows) {
    const src = source === 'unset' ? '' : ` (${source})`;
    console.log(`  ${name.padEnd(width)} = ${value}${src}`);
  }
}

const client = new S3Client({
  region: REGION,
  credentials: { accessKeyId, secretAccessKey, sessionToken },
});

function walk(dir: string): string[] {
  const out: string[] = [];
  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    const full = join(dir, entry.name);
    if (entry.isDirectory()) out.push(...walk(full));
    else out.push(full);
  }
  return out;
}

function toKey(file: string): string {
  return relative(DIST, file).split(sep).join('/');
}

function contentTypeFor(file: string): string {
  return CONTENT_TYPES[extname(file).toLowerCase()] ?? 'application/octet-stream';
}

function cacheControlFor(key: string): string {
  if (key === 'index.html') return CACHE_NO;
  if (key.startsWith('data/')) return CACHE_DATA;
  return CACHE_IMMUTABLE;
}

async function listRemoteKeys(): Promise<string[]> {
  const keys: string[] = [];
  let token: string | undefined;
  do {
    const res = await client.send(
      new ListObjectsV2Command({ Bucket: BUCKET, ContinuationToken: token }),
    );
    for (const obj of res.Contents ?? []) {
      if (obj.Key) keys.push(obj.Key);
    }
    token = res.IsTruncated ? res.NextContinuationToken : undefined;
  } while (token);
  return keys;
}

async function deleteKeys(keys: string[]): Promise<void> {
  for (let i = 0; i < keys.length; i += 1000) {
    const batch = keys.slice(i, i + 1000);
    await client.send(
      new DeleteObjectsCommand({
        Bucket: BUCKET,
        Delete: { Objects: batch.map((Key) => ({ Key })) },
      }),
    );
    for (const k of batch) console.log(`✗ ${k}`);
  }
}

async function main(): Promise<void> {
  printResolvedConfig();

  if (process.argv.includes('--check') || process.env.DEPLOY_CHECK) {
    console.log('deploy: --check mode — no objects listed, uploaded, or deleted');
    return;
  }

  const files = walk(DIST);
  const localKeys = new Set(files.map(toKey));

  console.log(`deploy: uploading ${files.length} files to s3://${BUCKET}`);
  for (const file of files) {
    const key = toKey(file);
    await client.send(
      new PutObjectCommand({
        Bucket: BUCKET,
        Key: key,
        Body: readFileSync(file),
        ContentType: contentTypeFor(file),
        CacheControl: cacheControlFor(key),
      }),
    );
    console.log(`↑ ${key}`);
  }

  const remote = await listRemoteKeys();
  const stale = remote.filter(
    (k) => !localKeys.has(k) && k !== 'index.html' && !k.startsWith('data/'),
  );
  if (stale.length) {
    console.log(`deploy: deleting ${stale.length} stale objects`);
    await deleteKeys(stale);
  }

  console.log('deploy: done');
}

main().catch((err) => {
  console.error('deploy: failed');
  console.error(err);
  process.exit(1);
});
