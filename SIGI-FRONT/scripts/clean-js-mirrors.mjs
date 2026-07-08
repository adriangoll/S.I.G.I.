import { readdir, unlink, stat } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const srcDir = path.resolve(__dirname, '../src');

async function fileExists(filePath) {
  try {
    await stat(filePath);
    return true;
  } catch {
    return false;
  }
}

async function walk(dir) {
  const entries = await readdir(dir, { withFileTypes: true });
  const files = [];

  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      files.push(...(await walk(fullPath)));
    } else if (entry.isFile() && entry.name.endsWith('.js')) {
      files.push(fullPath);
    }
  }

  return files;
}

const jsFiles = await walk(srcDir);
let deleted = 0;

for (const jsPath of jsFiles) {
  const base = jsPath.slice(0, -3);
  const hasTsSibling = (await fileExists(`${base}.ts`)) || (await fileExists(`${base}.tsx`));

  if (hasTsSibling) {
    await unlink(jsPath);
    deleted += 1;
    console.log(`Eliminado: ${path.relative(path.resolve(__dirname, '..'), jsPath)}`);
  }
}

console.log(`Limpieza completada: ${deleted} archivo(s) .js espejo eliminado(s).`);
