// Copies the repo-level /data and the computed analysis outputs into web/ so
// the Next.js app is self-contained (works regardless of Vercel's "Root
// Directory" setting). Both trees are gitignored inside web/ and regenerated
// on every dev/build run.
import { cp, rm, mkdir } from "node:fs/promises";
import { existsSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const repoRoot = path.resolve(__dirname, "../..");

const trees = [
  { src: path.join(repoRoot, "data"), dest: path.resolve(__dirname, "../data") },
  {
    src: path.join(repoRoot, "analysis", "outputs"),
    dest: path.resolve(__dirname, "../analysis-outputs"),
  },
  {
    src: path.join(repoRoot, "analysis", "visualizations"),
    dest: path.resolve(__dirname, "../public/figures"),
  },
];

for (const { src, dest } of trees) {
  if (!existsSync(src)) {
    console.log(`[sync-data] source ${src} not found, skipping (using existing ${dest})`);
    continue;
  }
  await rm(dest, { recursive: true, force: true });
  await mkdir(dest, { recursive: true });
  await cp(src, dest, { recursive: true });
  console.log(`[sync-data] copied ${src} -> ${dest}`);
}
