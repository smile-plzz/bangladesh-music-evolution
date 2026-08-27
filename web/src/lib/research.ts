import fs from "node:fs";
import path from "node:path";

// Markdown copied from the repo by scripts/sync-data.mjs. Grouped so the
// reading section can present the paper, the frameworks and the case studies
// as distinct kinds of document rather than one flat file list.

const ROOT = path.join(process.cwd(), "research-content");

export type ResearchDoc = {
  slug: string;
  group: "docs" | "frameworks" | "case-studies";
  file: string;
  title: string;
  summary: string;
  order: number;
};

/** Curated titles, summaries and reading order. Anything not listed here is
 *  still published, titled from its first heading, and sorted to the end. */
const CATALOG: Record<string, { title: string; summary: string; order: number }> = {
  "docs/research-paper-draft-complete": {
    title: "The research paper",
    summary:
      "The full second draft, carrying the computed results: what the data supports, what it does not, and which parts of the framework it falsified.",
    order: 1,
  },
  "docs/genre-evolution-map": {
    title: "Genre evolution map",
    summary:
      "Strand lifecycles, the transmission diagram, the five documented domestic-influence links, and how release formats shifted from albums to singles.",
    order: 2,
  },
  "docs/concert-ecosystem-map": {
    title: "Concert ecosystem map",
    summary:
      "The typology classification and what it shows — including a defined class with zero entries across eight catalogued rappers.",
    order: 3,
  },
  "docs/future-trends-forecast": {
    title: "Future trends forecast",
    summary:
      "Seven forecasts graded grounded, indicated or speculative, each with the condition that would falsify it — plus what this project cannot forecast at all.",
    order: 4,
  },
  "docs/methodology": {
    title: "Methodology",
    summary: "Data sources, analytical techniques, validation strategy and ethics.",
    order: 5,
  },
  "docs/research-proposal": {
    title: "Original proposal",
    summary:
      "The study as specified before it had data — useful as the baseline the results are measured against.",
    order: 6,
  },
  "docs/literature-review": {
    title: "Literature review",
    summary:
      "The working review, with retrieval status and open citation problems kept visible.",
    order: 7,
  },
  "docs/annotated-bibliography": {
    title: "Annotated bibliography",
    summary:
      "APA entries for every scholarly source, with what each contributes and how it is used.",
    order: 8,
  },
  "docs/roadmap": {
    title: "Roadmap",
    summary:
      "Where the project stands against its targets, what is blocked, and what to do next.",
    order: 9,
  },
  "frameworks/bmem": {
    title: "BMEM — the ecosystem model",
    summary:
      "The six interacting dimensions the study models Bangladeshi music through.",
    order: 1,
  },
  "frameworks/bmem-validation": {
    title: "BMEM validated against the data",
    summary:
      "All six dimensions tested, ten revisions proposed, two dimensions corrected outright.",
    order: 2,
  },
  "frameworks/bmef": {
    title: "BMEF — the process companion",
    summary:
      "Four change mechanisms, the evidence each requires, and the boundary marking what cannot be measured here.",
    order: 3,
  },
  "case-studies/warfaze": {
    title: "Warfaze",
    summary:
      "The legitimation arc: cover repertoire, then original Bangla metal, then a state honour.",
    order: 1,
  },
  "case-studies/artcell": {
    title: "Artcell",
    summary:
      "An imported technical apparatus filled with entirely local semantic content.",
    order: 2,
  },
  "case-studies/meghdol": {
    title: "Meghdol",
    summary:
      "Literary indie, a nine-year hiatus, and what a betweenness of zero actually measures.",
    order: 3,
  },
  "case-studies/hip-hop-lineage": {
    title: "The hip-hop lineage",
    summary:
      "A thirty-year documented lineage with almost no presence in any measurement the project can make.",
    order: 4,
  },
  "case-studies/folk-fusion-platforms": {
    title: "Folk fusion and platforms",
    summary:
      "Folk as a cross-strand resource, carried into the mainstream by a branded platform and a commemorative festival.",
    order: 5,
  },
};

// Working documents that duplicate the reading section's own navigation.
const EXCLUDE = new Set(["case-studies/README"]);

function titleFromMarkdown(body: string, fallback: string): string {
  const m = body.match(/^#\s+(.+)$/m);
  return m ? m[1].trim() : fallback;
}

export function getResearchDocs(): ResearchDoc[] {
  if (!fs.existsSync(ROOT)) return [];
  const docs: ResearchDoc[] = [];
  for (const group of ["docs", "frameworks", "case-studies"] as const) {
    const dir = path.join(ROOT, group);
    if (!fs.existsSync(dir)) continue;
    for (const file of fs.readdirSync(dir)) {
      if (!file.endsWith(".md")) continue;
      const base = file.replace(/\.md$/, "");
      const key = `${group}/${base}`;
      if (EXCLUDE.has(key)) continue;
      const meta = CATALOG[key];
      const body = fs.readFileSync(path.join(dir, file), "utf-8");
      docs.push({
        slug: `${group}--${base}`,
        group,
        file: key,
        title: meta?.title ?? titleFromMarkdown(body, base),
        summary: meta?.summary ?? "",
        order: meta?.order ?? 99,
      });
    }
  }
  return docs.sort(
    (a, b) => a.order - b.order || a.title.localeCompare(b.title),
  );
}

export function getResearchDoc(slug: string): { doc: ResearchDoc; body: string } | null {
  const doc = getResearchDocs().find((d) => d.slug === slug);
  if (!doc) return null;
  const full = path.join(ROOT, `${doc.file}.md`);
  if (!fs.existsSync(full)) return null;
  return { doc, body: fs.readFileSync(full, "utf-8") };
}
