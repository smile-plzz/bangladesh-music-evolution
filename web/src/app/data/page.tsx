import fs from "node:fs";
import path from "node:path";
import { getDataQuality, getMultiLayerNetwork } from "@/lib/analysis";
import { PageHeader, Caveat, CrossLink, Panel } from "@/components/ui";
import { STRANDS, strandColor } from "@/lib/strands";

export const metadata = {
  title: "Data & methods · Bangladesh Music Evolution",
  description:
    "Download the dataset, read the schemas, and see exactly what the catalogue covers and what it does not.",
};

const REPO = "https://github.com/smile-plzz/bangladesh-music-evolution";

const FILES: { path: string; label: string; note: string }[] = [
  {
    path: "/downloads/networks/bmpn-multilayer.json",
    label: "bmpn-multilayer.json",
    note: "The full network: every act, every edge, the layer each edge came from and the evidence behind it.",
  },
  {
    path: "/downloads/networks/bmpn-communities.json",
    label: "bmpn-communities.json",
    note: "Louvain communities for the observed and full passes, with modularity.",
  },
  {
    path: "/downloads/networks/influence-network.json",
    label: "influence-network.json",
    note: "Bipartite influence graph: acts, the influences they cite, the evidence and stated confidence.",
  },
  {
    path: "/downloads/outputs/bmpn-metrics.json",
    label: "bmpn-metrics.json",
    note: "Centralities, density, modularity and community structure across all three analytical passes.",
  },
  {
    path: "/downloads/outputs/bmpn-centrality.csv",
    label: "bmpn-centrality.csv",
    note: "Per-act degree, weighted degree, betweenness, eigenvector and community.",
  },
  {
    path: "/downloads/outputs/influence-citations.csv",
    label: "influence-citations.csv",
    note: "One row per normalised citation, with kind, confidence and whether a source was named.",
  },
  {
    path: "/downloads/outputs/concert-classification.csv",
    label: "concert-classification.csv",
    note: "Every event, its typology class, and the rule that classified it.",
  },
  {
    path: "/downloads/outputs/temporal-summary.json",
    label: "temporal-summary.json",
    note: "Formations and releases by decade, strand lifecycles, release cadence.",
  },
  {
    path: "/downloads/outputs/data-quality-report.json",
    label: "data-quality-report.json",
    note: "Schema validation, referential integrity and every open hygiene warning.",
  },
  {
    path: "/downloads/schemas/artist.schema.json",
    label: "artist.schema.json",
    note: "JSON Schema every artist record validates against.",
  },
  {
    path: "/downloads/schemas/concert.schema.json",
    label: "concert.schema.json",
    note: "JSON Schema every event record validates against.",
  },
];

function fileSize(rel: string): string | null {
  const full = path.join(process.cwd(), "public", rel.replace(/^\//, ""));
  if (!fs.existsSync(full)) return null;
  const bytes = fs.statSync(full).size;
  return bytes > 1024 * 1024
    ? `${(bytes / 1024 / 1024).toFixed(1)} MB`
    : `${Math.max(1, Math.round(bytes / 1024))} KB`;
}

export default function DataPage() {
  const quality = getDataQuality();
  const network = getMultiLayerNetwork();

  return (
    <div className="pb-20">
      <PageHeader
        eyebrow="Data &amp; methods"
        title="The dataset"
        lede="Everything behind this site is open, schema-validated JSON, and every figure and number is generated from it by a re-runnable pipeline. Take the files and check the work."
        meta={
          quality ? (
            <>
              Generated {quality.generated} · {quality.artist_count} artists ·{" "}
              {quality.concert_count} events ·{" "}
              <span className={quality.error_count ? "text-amber-400" : "text-emerald-400"}>
                {quality.error_count} schema errors
              </span>
            </>
          ) : null
        }
      />

      <div className="mx-auto max-w-6xl px-4 sm:px-6 space-y-14">
        <section>
          <h2 className="text-xl font-semibold">Coverage, honestly</h2>
          <p className="mt-2 max-w-3xl text-sm text-neutral-400 leading-relaxed">
            The catalogue is a curated sample, not a census, and it was assembled
            outward from a well-documented metal core. That construction
            plausibly biases every strand comparison drawn from it, so the
            numbers below are worth reading before the findings are.
          </p>

          {quality ? (
            <>
              <div className="mt-6 grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {[
                  {
                    v: `${quality.artist_count}/${quality.artist_target}`,
                    l: "Artists catalogued",
                    h: "against the project target",
                  },
                  {
                    v: `${quality.concert_count}/${quality.concert_target}`,
                    l: "Events catalogued",
                    h: "the binding constraint on the network",
                  },
                  {
                    v: quality.artists_without_concert_data,
                    l: "Acts with no event",
                    h: "a gap in the concert record, not a fact about them",
                  },
                  {
                    v: quality.warning_count,
                    l: "Open data warnings",
                    h: "the research backlog, not bugs",
                  },
                ].map((s) => (
                  <Panel key={s.l} className="p-5">
                    <div className="text-3xl font-bold text-emerald-400">{s.v}</div>
                    <div className="text-sm text-neutral-300 mt-1">{s.l}</div>
                    <div className="text-xs text-neutral-500 mt-1.5">{s.h}</div>
                  </Panel>
                ))}
              </div>

              <div className="mt-6 overflow-x-auto rounded-lg border border-neutral-800">
                <table className="w-full text-sm">
                  <thead className="bg-neutral-900/70 text-neutral-400">
                    <tr>
                      <th className="text-left font-medium px-4 py-3">Genre strand</th>
                      <th className="text-right font-medium px-4 py-3">Artists</th>
                      <th className="text-right font-medium px-4 py-3">
                        With event data
                      </th>
                      <th className="text-right font-medium px-4 py-3">Coverage</th>
                    </tr>
                  </thead>
                  <tbody>
                    {STRANDS.filter((s) => quality.strand_coverage[s]).map((s) => {
                      const row = quality.strand_coverage[s];
                      const pct = Math.round(
                        (row.with_concert_data / row.artists) * 100,
                      );
                      return (
                        <tr key={s} className="border-t border-neutral-800">
                          <td className="px-4 py-3">
                            <span className="inline-flex items-center gap-2">
                              <span
                                className="w-2 h-2 rounded-full"
                                style={{ backgroundColor: strandColor(s) }}
                                aria-hidden
                              />
                              {s}
                            </span>
                          </td>
                          <td className="px-4 py-3 text-right tabular-nums">
                            {row.artists}
                          </td>
                          <td className="px-4 py-3 text-right tabular-nums">
                            {row.with_concert_data}
                          </td>
                          <td className="px-4 py-3 text-right tabular-nums">
                            <span
                              className={
                                pct === 0
                                  ? "text-amber-400"
                                  : pct < 40
                                    ? "text-neutral-400"
                                    : "text-emerald-400"
                              }
                            >
                              {pct}%
                            </span>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </>
          ) : null}
        </section>

        <section>
          <h2 className="text-xl font-semibold">Download the data</h2>
          <p className="mt-2 max-w-3xl text-sm text-neutral-400 leading-relaxed">
            The generated outputs are below. The source records — one JSON file
            per artist and per event — live in{" "}
            <a
              href={`${REPO}/tree/main/data`}
              target="_blank"
              rel="noreferrer"
              className="text-emerald-400 hover:underline"
            >
              the repository
            </a>
            .
          </p>
          <ul className="mt-5 grid md:grid-cols-2 gap-3">
            {FILES.map((f) => {
              const size = fileSize(f.path);
              return (
                <li key={f.path}>
                  <a
                    href={f.path}
                    className="block rounded-lg border border-neutral-800 bg-neutral-900/50 p-4 hover:border-emerald-500/60 transition-colors"
                  >
                    <div className="flex items-baseline justify-between gap-3">
                      <span className="font-mono text-sm text-emerald-300">
                        {f.label}
                      </span>
                      {size ? (
                        <span className="text-xs text-neutral-500 tabular-nums shrink-0">
                          {size}
                        </span>
                      ) : null}
                    </div>
                    <p className="mt-1.5 text-xs text-neutral-500 leading-relaxed">
                      {f.note}
                    </p>
                  </a>
                </li>
              );
            })}
          </ul>
        </section>

        <section>
          <h2 className="text-xl font-semibold">How the numbers are made</h2>
          <p className="mt-2 max-w-3xl text-sm text-neutral-400 leading-relaxed">
            Seven Python scripts, run in order. Every figure reads from the
            computed outputs rather than recomputing its own statistics, so a
            chart can never disagree with a number in the paper. Two consecutive
            runs leave the tree byte-identical.
          </p>
          <pre className="mt-4 overflow-x-auto rounded-lg border border-neutral-800 bg-neutral-950 p-4 text-xs text-neutral-300 leading-relaxed">
{`pip install networkx matplotlib jsonschema scipy

python3 analysis/scripts/validate_data.py        # schema + referential integrity
python3 analysis/scripts/build_bmpn.py           # network layers
python3 analysis/scripts/analyze_bmpn.py         # communities + centrality
python3 analysis/scripts/temporal_analysis.py    # decade curves
python3 analysis/scripts/concert_ecosystem.py    # typology
python3 analysis/scripts/influence_analysis.py   # citations
python3 analysis/scripts/make_visualizations.py  # figures`}
          </pre>
        </section>

        <section>
          <h2 className="text-xl font-semibold">Two conventions the data follows</h2>
          <div className="mt-5 grid md:grid-cols-2 gap-4">
            <Panel className="p-5">
              <h3 className="font-medium">Null over invention</h3>
              <p className="mt-2 text-sm text-neutral-400 leading-relaxed">
                Where a value is genuinely undocumented the field is null and the
                record is tagged <code className="text-neutral-300">needs-verification</code>.
                The schema permits null on formation years and on discography
                years and labels for exactly this reason. A plausible guess is
                worse than an admitted gap.
              </p>
            </Panel>
            <Panel className="p-5">
              <h3 className="font-medium">Record the gap, don&rsquo;t fill it</h3>
              <p className="mt-2 text-sm text-neutral-400 leading-relaxed">
                The 2016 Joy Bangla Concert is catalogued with an empty lineup
                and a note explaining why. Inferring its bill from adjacent years
                would have produced clean-looking data and a false network.
              </p>
            </Panel>
          </div>
        </section>

        <section>
          <h2 className="text-xl font-semibold">What this project cannot do</h2>
          <ul className="mt-5 space-y-3 text-sm">
            {[
              [
                "No audience data of any kind",
                "No streaming, playlist or engagement signals — blocked pending Spotify Web API and YouTube Data API v3 credentials, which the project owner must register. Every listener claim on this site is inferred from co-billing and from what artists and journalists said.",
              ],
              [
                "No audio-feature analysis",
                "Every statement about tempo, production or arrangement rests on documented description and discographic sequence, not on measured signal.",
              ],
              [
                "Measurable documentation bias",
                "The hip-hop strand shows one political-content marker against six for alternative rock, which contradicts the academic literature. That is an artefact of how the records were written, and it is reported as one rather than as a finding.",
              ],
              [
                "Geographic concentration",
                "19 of 23 events are in Dhaka. The ecosystem outside the capital is nearly invisible in this data.",
              ],
            ].map(([t, b]) => (
              <li
                key={t}
                className="rounded-lg border border-neutral-800 bg-neutral-900/50 p-4"
              >
                <div className="font-medium text-neutral-200">{t}</div>
                <p className="mt-1.5 text-neutral-400 leading-relaxed">{b}</p>
              </li>
            ))}
          </ul>
          <Caveat>
            {network
              ? `The network currently carries ${network.edge_count} edges over ${network.node_count} acts, ${network.observed_edge_count} of them observational. `
              : ""}
            The single change that would unblock the most is streaming API
            credentials — they gate the preference network, sound-evolution
            measurement and the whole audience side of the study. See{" "}
            <CrossLink href="/research/docs--roadmap">the roadmap</CrossLink>.
          </Caveat>
        </section>
      </div>
    </div>
  );
}
