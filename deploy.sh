#!/usr/bin/env bash
set -euo pipefail

BUCKET="${S3_BUCKET:?set S3_BUCKET env var}"

npm run build

# Hashed assets — long cache
aws s3 sync dist/ "s3://$BUCKET" --delete \
  --cache-control "public, max-age=31536000, immutable" \
  --exclude "index.html" \
  --exclude "data/*"

# index.html — no cache so deploys are instant
aws s3 cp dist/index.html "s3://$BUCKET/index.html" \
  --cache-control "no-cache"

# Spell data — medium cache, can change between deploys
aws s3 sync dist/data/ "s3://$BUCKET/data/" \
  --cache-control "public, max-age=3600"
