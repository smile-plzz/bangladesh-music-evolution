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
  // The written research, so it can be read on the site rather than only on
  // GitHub. Each tree keeps its own folder so the reading section can group by
  // kind without parsing paths.
  {
    src: path.join(repoRoot, "docs"),
    dest: path.resolve(__dirname, "../research-content/docs"),
  },
  {
    src: path.join(repoRoot, "frameworks"),
    dest: path.resolve(__dirname, "../research-content/frameworks"),
  },
  {
    src: path.join(repoRoot, "analysis", "case-studies"),
    dest: path.resolve(__dirname, "../research-content/case-studies"),
  },
  // Served as real files so the data page can hand visitors the dataset
  // itself, not just a description of it.
  {
    src: path.join(repoRoot, "analysis", "outputs"),
    dest: path.resolve(__dirname, "../public/downloads/outputs"),
  },
  {
    src: path.join(repoRoot, "data", "networks"),
    dest: path.resolve(__dirname, "../public/downloads/networks"),
  },
  {
    src: path.join(repoRoot, "data", "schemas"),
    dest: path.resolve(__dirname, "../public/downloads/schemas"),
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
