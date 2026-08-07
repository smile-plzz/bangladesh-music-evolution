// Copies the repo-level /data directory into web/data so the Next.js app
// is self-contained (works regardless of Vercel's "Root Directory" setting).
import { cp, rm, mkdir } from "node:fs/promises";
import { existsSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const src = path.resolve(__dirname, "../../data");
const dest = path.resolve(__dirname, "../data");

if (!existsSync(src)) {
  console.log(`[sync-data] source ${src} not found, skipping (using existing web/data)`);
  process.exit(0);
}

await rm(dest, { recursive: true, force: true });
await mkdir(dest, { recursive: true });
await cp(src, dest, { recursive: true });
console.log(`[sync-data] copied ${src} -> ${dest}`);
