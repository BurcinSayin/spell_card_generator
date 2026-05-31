/**
 * Ensure per-system spell data exists before dev or a build.
 *
 * Both PF1e and PF2e load verbatim upstream JSON and normalize at runtime, so the
 * files under public/data/<id>/spells.json are derived artifacts copied from an
 * external source. They are git-ignored; this script repopulates any that are
 * missing by copying from a source path given by an environment variable.
 *
 * Env vars (absolute path to the upstream JSON):
 *   SPELLS_PF1E_PATH  -> public/data/pf1e/spells.json
 *   SPELLS_PF2E_PATH  -> public/data/pf2e/spells.json
 *
 * Existing files are never overwritten. If a file is missing and its source env
 * var is unset (or points at a nonexistent file), the build fails (exit 1).
 *
 * Runs automatically via the `predev` and `prebuild` npm hooks.
 */
export {};
