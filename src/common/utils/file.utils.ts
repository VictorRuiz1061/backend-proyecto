import * as fs from 'fs';
import * as path from 'path';

export function ensureDirectory(dir: string) {
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
}

export function getExtension(filename: string) {
  return filename.split('.').pop();
}

export function generateUniqueName(originalName: string) {
  const ext = getExtension(originalName);
  const unique = Date.now() + '-' + Math.round(Math.random() * 1e9);
  return `${unique}.${ext}`;
}

export function moveFile(oldPath: string, newPath: string) {
  ensureDirectory(path.dirname(newPath));
  fs.renameSync(oldPath, newPath);
}
