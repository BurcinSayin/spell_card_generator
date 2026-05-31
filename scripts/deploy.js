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
import { readdirSync, readFileSync } from 'node:fs';
import { join, relative, sep, extname } from 'node:path';
import { S3Client, PutObjectCommand, ListObjectsV2Command, DeleteObjectsCommand, } from '@aws-sdk/client-s3';
const DIST = 'dist';
const CACHE_IMMUTABLE = 'public, max-age=31536000, immutable';
const CACHE_NO = 'no-cache';
const CACHE_DATA = 'public, max-age=3600';
const CONTENT_TYPES = {
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
function required(name, value) {
    if (!value) {
        console.error(`deploy: ${name} is not set. Add it to .env (see .env.example).`);
        process.exit(1);
    }
    return value;
}
const BUCKET = required('S3_BUCKET', process.env.S3_BUCKET);
const REGION = required('AWS_REGION', process.env.AWS_REGION ?? process.env.AWS_DEFAULT_REGION);
const accessKeyId = required('AWS_ACCESS_KEY_ID', process.env.AWS_ACCESS_KEY_ID);
const secretAccessKey = required('AWS_SECRET_ACCESS_KEY', process.env.AWS_SECRET_ACCESS_KEY);
const sessionToken = process.env.AWS_SESSION_TOKEN;
const client = new S3Client({
    region: REGION,
    credentials: { accessKeyId, secretAccessKey, sessionToken },
});
function walk(dir) {
    const out = [];
    for (const entry of readdirSync(dir, { withFileTypes: true })) {
        const full = join(dir, entry.name);
        if (entry.isDirectory())
            out.push(...walk(full));
        else
            out.push(full);
    }
    return out;
}
function toKey(file) {
    return relative(DIST, file).split(sep).join('/');
}
function contentTypeFor(file) {
    return CONTENT_TYPES[extname(file).toLowerCase()] ?? 'application/octet-stream';
}
function cacheControlFor(key) {
    if (key === 'index.html')
        return CACHE_NO;
    if (key.startsWith('data/'))
        return CACHE_DATA;
    return CACHE_IMMUTABLE;
}
async function listRemoteKeys() {
    const keys = [];
    let token;
    do {
        const res = await client.send(new ListObjectsV2Command({ Bucket: BUCKET, ContinuationToken: token }));
        for (const obj of res.Contents ?? []) {
            if (obj.Key)
                keys.push(obj.Key);
        }
        token = res.IsTruncated ? res.NextContinuationToken : undefined;
    } while (token);
    return keys;
}
async function deleteKeys(keys) {
    for (let i = 0; i < keys.length; i += 1000) {
        const batch = keys.slice(i, i + 1000);
        await client.send(new DeleteObjectsCommand({
            Bucket: BUCKET,
            Delete: { Objects: batch.map((Key) => ({ Key })) },
        }));
        for (const k of batch)
            console.log(`✗ ${k}`);
    }
}
async function main() {
    const files = walk(DIST);
    const localKeys = new Set(files.map(toKey));
    console.log(`deploy: uploading ${files.length} files to s3://${BUCKET}`);
    for (const file of files) {
        const key = toKey(file);
        await client.send(new PutObjectCommand({
            Bucket: BUCKET,
            Key: key,
            Body: readFileSync(file),
            ContentType: contentTypeFor(file),
            CacheControl: cacheControlFor(key),
        }));
        console.log(`↑ ${key}`);
    }
    const remote = await listRemoteKeys();
    const stale = remote.filter((k) => !localKeys.has(k) && k !== 'index.html' && !k.startsWith('data/'));
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
