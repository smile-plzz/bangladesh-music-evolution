import { getAllArtists } from "@/lib/data";
import {
  getInfluenceAnalysis,
  getInfluenceNetwork,
  getStrandMap,
} from "@/lib/analysis";
import { PageHeader, Caveat, CrossLink, Empty } from "@/components/ui";
import InfluenceExplorer, {
  type ArtistItem,
  type Citation,
  type InfluenceItem,
} from "./InfluenceExplorer";

export const metadata = {
  title: "Influences · Bangladesh Music Evolution",
  description:
    "Explore which global acts and traditions Bangladeshi artists cite as influences, with the evidence and stated confidence behind each claim.",
};

export default function InfluencesPage() {
  const net = getInfluenceNetwork();
  const analysis = getInfluenceAnalysis();
  const strandMap = getStrandMap();
  const names = Object.fromEntries(getAllArtists().map((a) => [a.id, a.name]));

  if (!net) {
    return (
      <div className="mx-auto max-w-3xl px-4 sm:px-6 py-20">
        <Empty>
          The influence network has not been generated. Run{" "}
          <code>analysis/scripts/influence_analysis.py</code>.
        </Empty>
      </div>
    );
  }

  const kindOf = Object.fromEntries(net.nodes.map((n) => [n.id, n.kind]));

  // Group citation edges both ways: influence -> citing acts, and act -> what
  // it cites. Domestic transmission edges (one catalogued act naming another)
  // are handled separately below, since they are scene-internal rather than
  // global influence.
  const byInfluence = new Map<string, InfluenceItem>();
  const byArtist = new Map<string, ArtistItem>();

  for (const id of Object.keys(names)) {
    byArtist.set(id, {
      id,
      name: names[id],
      strand: strandMap[id] ?? "Unclassified",
      cites: [],
    });
  }

  for (const edge of net.edges) {
    if (edge.kind === "domestic_transmission") continue;
    if (!edge.source.startsWith("artist:")) continue;
    if (!edge.target.startsWith("influence:")) continue;

    const artistId = edge.source.slice("artist:".length);
    const label = edge.target.slice("influence:".length);
    // Only an explicit global_artist counts as a named act. Anything else —
    // a tradition label, or a domestic act whose name did not resolve to a
    // catalogued id — is presented as a tradition rather than inflating the
    // named-act count.
    const kind =
      kindOf[edge.target] === "global_artist" ? "global_artist" : "tradition";

    const citation: Citation = {
      artistId,
      artistName: names[artistId] ?? artistId,
      strand: strandMap[artistId] ?? "Unclassified",
      confidence: edge.confidence ?? "unstated",
      evidence: edge.evidence ?? "",
      source: edge.citation_source ?? "",
      rawCitation: edge.raw_citation ?? "",
    };

    const existing = byInfluence.get(label);
    if (existing) {
      existing.citations.push(citation);
    } else {
      byInfluence.set(label, {
        label,
        kind,
        citations: [citation],
        strands: [],
      });
    }

    byArtist.get(artistId)?.cites.push({
      label,
      kind,
      confidence: citation.confidence,
      evidence: citation.evidence,
      source: citation.source,
    });
  }

  const influences = [...byInfluence.values()]
    .map((i) => ({
      ...i,
      strands: [...new Set(i.citations.map((c) => c.strand))].sort(),
      citations: i.citations.sort((a, b) =>
        a.artistName.localeCompare(b.artistName),
      ),
    }))
    .sort(
      (a, b) =>
        b.citations.length - a.citations.length || a.label.localeCompare(b.label),
    );

  const artists = [...byArtist.values()]
    .map((a) => ({ ...a, cites: a.cites.sort((x, y) => x.label.localeCompare(y.label)) }))
    .sort((a, b) => b.cites.length - a.cites.length || a.name.localeCompare(b.name));

  const domestic = net.edges.filter((e) => e.kind === "domestic_transmission");
  const namedCount = influences.filter((i) => i.kind === "global_artist").length;

  return (
    <div className="pb-20">
      <PageHeader
        eyebrow="Explore"
        title="Influences"
        lede="Every influence claim in the catalogue carries the evidence for it, a named source and a stated confidence level. Explore from either end: pick a global act or tradition to see who cites it, or pick a Bangladeshi act to see what it names."
        meta={
          analysis ? (
            <>
              {analysis.normalised_citations} normalised citations from{" "}
              {analysis.raw_citation_entries} sourced entries · {namedCount} named
              global acts · {influences.length - namedCount} tradition labels
            </>
          ) : null
        }
      />

      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <InfluenceExplorer influences={influences} artists={artists} />

        {domestic.length > 0 ? (
          <section className="mt-14">
            <h2 className="text-xl font-semibold">Domestic transmission</h2>
            <p className="mt-2 max-w-3xl text-sm text-neutral-400 leading-relaxed">
              Only {domestic.length} catalogued acts name another catalogued
              Bangladeshi act as an influence. That is thin, and it reflects how
              the records were written — global influences were researched
              systematically, domestic ones only where a source happened to state
              one — rather than how much the scene borrows internally.
            </p>
            <ul className="mt-5 grid sm:grid-cols-2 gap-3">
              {domestic.map((d) => {
                const from = d.source.slice("artist:".length);
                const to = d.target.slice("artist:".length);
                return (
                  <li
                    key={`${from}-${to}`}
                    className="rounded-lg border border-neutral-800 bg-neutral-900/50 p-4 text-sm"
                  >
                    <span className="text-neutral-200">{names[from] ?? from}</span>
                    <span className="text-neutral-600"> cites </span>
                    <span className="text-neutral-200">{names[to] ?? to}</span>
                    {d.evidence ? (
                      <p className="mt-2 text-xs text-neutral-500 leading-relaxed">
                        {d.evidence}
                      </p>
                    ) : null}
                  </li>
                );
              })}
            </ul>
          </section>
        ) : null}

        <Caveat>
          An influence&rsquo;s rank counts how many catalogued acts name it — not
          its measured effect on the music. Metal and progressive acts name
          specific bands while pop and folk acts name traditions, and that
          asymmetry partly reflects who gets interviewed: the metal scene has an
          academic literature and the pop strand has none. See{" "}
          <CrossLink href="/findings#influence">the findings</CrossLink>.
        </Caveat>
      </div>
    </div>
  );
}
