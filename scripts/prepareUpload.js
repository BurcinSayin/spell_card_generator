import { rmSync, cpSync } from 'node:fs';
rmSync('upload', { recursive: true, force: true });
cpSync('dist', 'upload', { recursive: true });
console.log('upload/ ready');
