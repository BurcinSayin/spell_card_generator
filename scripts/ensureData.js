/**
 * Ensure per-system spell data exists before a build.
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
 * Runs automatically via the `prebuild` npm hook.
 */
import { existsSync, mkdirSync, copyFileSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
const SYSTEMS = [
    { id: 'pf1e', dest: 'public/data/pf1e/spells.json', env: 'SPELLS_PF1E_PATH' },
    { id: 'pf2e', dest: 'public/data/pf2e/spells.json', env: 'SPELLS_PF2E_PATH' },
];
const problems = [];
for (const { id, dest, env } of SYSTEMS) {
    if (existsSync(dest)) {
        console.log(`ensureData: ${id} present, skipping`);
        continue;
    }
    const src = process.env[env];
    if (!src) {
        problems.push(`  ${id}: ${dest} missing and ${env} is not set`);
        continue;
    }
    const resolved = resolve(src);
    if (!existsSync(resolved)) {
        problems.push(`  ${id}: source ${env}="${resolved}" does not exist`);
        continue;
    }
    mkdirSync(dirname(dest), { recursive: true });
    copyFileSync(resolved, dest);
    console.log(`ensureData: ${id} copied from ${resolved} -> ${dest}`);
}
if (problems.length) {
    console.error('ensureData: cannot populate required spell data:');
    console.error(problems.join('\n'));
    console.error('Set the env var(s) to the absolute path of the upstream JSON, e.g.');
    console.error('  $env:SPELLS_PF1E_PATH = "D:\\Work\\Personal\\rpg_parser\\pf1_spells.json"  # PowerShell');
    console.error('  export SPELLS_PF1E_PATH=/path/to/pf1_spells.json                          # bash');
    process.exit(1);
}
