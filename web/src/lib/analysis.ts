import fs from "node:fs";
import path from "node:path";

// Computed outputs are copied here from ../analysis/outputs by
// scripts/sync-data.mjs on every dev/build run, so the site never reports a
// number that disagrees with the pipeline.
const ANALYSIS_ROOT = path.join(process.cwd(), "analysis-outputs");

export type StrandCoverage = {
  artists: number;
  with_concert_data: number;
};

export type DataQualityReport = {
  generated: string;
  artist_count: number;
  concert_count: number;
  artist_target: number;
  concert_target: number;
  artists_with_concert_data: number;
  artists_without_concert_data: number;
  error_count: number;
  warning_count: number;
  strand_coverage: Record<string, StrandCoverage>;
};

export type Community = {
  community_id: number;
  size: number;
  members: string[];
  dominant_strand: string;
  strand_mix: Record<string, number>;
  internal_edges: number;
};

export type NetworkPass = {
  pass: string;
  layers: string[];
  node_count: number;
  edge_count: number;
  density: number;
  isolated_nodes: number;
  component_count: number;
  largest_component_size: number;
  average_degree: number;
  louvain_modularity: number;
  nontrivial_community_count: number;
  strand_assortativity: number | null;
  communities: Community[];
  top_degree: { id: string; name: string; degree: number }[];
  top_eigenvector: { id: string; name: string; eigenvector: number }[];
  bridge_artists: { id: string; name: string; bridge_score: number }[];
};

export type NetworkMetrics = {
  generated: string;
  note: string;
  passes: Record<"observed" | "full" | "co_billing", NetworkPass>;
};

export type TemporalSummary = {
  sample_note: string;
  formations_by_decade: Record<string, { total: number; by_strand: Record<string, number> }>;
  releases_by_decade: Record<
    string,
    { total: number; by_strand: Record<string, number>; by_type: Record<string, number> }
  >;
  strand_lifecycle: Record<
    string,
    {
      catalogued_acts: number;
      first_formation?: number;
      median_formation?: number;
      latest_formation?: number;
      still_active_share?: number;
    }
  >;
  release_cadence: {
    total_dated_releases: number;
    median_gap_between_releases_years: number | null;
  };
  concert_venue_types: Record<string, number>;
  concert_cities: Record<string, number>;
};

export type ConcertEcosystem = {
  description: string;
  event_count: number;
  coverage_note: string;
  classification_rules_in_order: string[];
  classes: Record<
    string,
    {
      event_count: number;
      mean_bill_size: number;
      cross_strand_rate: number | null;
      description: string;
      strand_mix: Record<string, number>;
      events: { id: string; name: string; date: string; rule: string }[];
    }
  >;
};

export type InfluenceAnalysis = {
  method_note: string;
  raw_citation_entries: number;
  normalised_citations: number;
  distinct_named_global_influences: number;
  evidence_quality: {
    source_rate: number | null;
    confidence_distribution: Record<string, number>;
  };
  top_named_global_influences: Record<string, number>;
  named_influences_by_strand: Record<string, Record<string, number>>;
  cross_strand_influences: Record<
    string,
    { citing_acts: number; strands: Record<string, number> }
  >;
  localisation_mechanisms: {
    totals: Record<string, number>;
    by_strand: Record<string, Record<string, number>>;
  };
  domestic_transmission: {
    edge_count: number;
    links: { from: string; to: string }[];
  };
};

function readAnalysis<T>(file: string): T | null {
  const full = path.join(ANALYSIS_ROOT, file);
  if (!fs.existsSync(full)) return null;
  return JSON.parse(fs.readFileSync(full, "utf-8")) as T;
}

export const getDataQuality = () =>
  readAnalysis<DataQualityReport>("data-quality-report.json");
export const getNetworkMetrics = () =>
  readAnalysis<NetworkMetrics>("bmpn-metrics.json");
export const getTemporalSummary = () =>
  readAnalysis<TemporalSummary>("temporal-summary.json");
export const getConcertEcosystem = () =>
  readAnalysis<ConcertEcosystem>("concert-ecosystem.json");
export const getInfluenceAnalysis = () =>
  readAnalysis<InfluenceAnalysis>("influence-analysis.json");

// --- network + influence graph loaders -----------------------------------
//
// These read the pipeline's own output rather than recomputing anything in the
// app: strand assignment in particular is decided once, in
// analysis/lib/common.py, and stamped onto every network node. The site reads
// it from there so a page can never disagree with a figure.

export type MultiLayerNode = {
  id: string;
  name: string;
  genres: string[];
  strand: string;
  formed_year: number | null;
  origin_city: string;
  event_count: number;
  global_influence_tokens: string[];
};

export type EdgeLayer = {
  weight: number;
  observed: boolean;
  normalised_weight?: number;
  shared_events?: string[];
  shared_members?: string[];
  citations?: string[];
  shared_influences?: string[];
};

export type MultiLayerEdge = {
  source: string;
  target: string;
  combined_weight: number;
  observed: boolean;
  layers: Record<string, EdgeLayer>;
};

export type MultiLayerNetwork = {
  description: string;
  layer_weights: Record<string, number>;
  observed_layers: string[];
  node_count: number;
  edge_count: number;
  edges_per_layer: Record<string, number>;
  observed_edge_count: number;
  isolated_node_count: number;
  nodes: MultiLayerNode[];
  edges: MultiLayerEdge[];
};

export type CommunitySet = {
  modularity: number;
  communities: Community[];
};

export type Communities = {
  description: string;
  method: string;
  observed: CommunitySet;
  full: CommunitySet;
};

export type InfluenceNode = {
  id: string;
  label: string;
  kind: "artist" | "global_artist" | "tradition" | "domestic_artist";
  strand?: string;
  formed_year?: number | null;
  citing_acts?: number;
};

export type InfluenceEdge = {
  source: string;
  target: string;
  confidence: string;
  sourced?: boolean;
  kind?: string;
  evidence?: string;
  citation_source?: string;
  raw_citation?: string;
};

export type InfluenceNetwork = {
  description: string;
  node_count: number;
  edge_count: number;
  nodes: InfluenceNode[];
  edges: InfluenceEdge[];
};

const NETWORK_ROOT = path.join(process.cwd(), "data", "networks");

function readNetwork<T>(file: string): T | null {
  const full = path.join(NETWORK_ROOT, file);
  if (!fs.existsSync(full)) return null;
  return JSON.parse(fs.readFileSync(full, "utf-8")) as T;
}

export const getMultiLayerNetwork = () =>
  readNetwork<MultiLayerNetwork>("bmpn-multilayer.json");
export const getCommunities = () =>
  readNetwork<Communities>("bmpn-communities.json");
export const getInfluenceNetwork = () =>
  readNetwork<InfluenceNetwork>("influence-network.json");

/** artist id -> BMEM strand, taken from the network nodes the pipeline wrote. */
export function getStrandMap(): Record<string, string> {
  const net = getMultiLayerNetwork();
  if (!net) return {};
  return Object.fromEntries(net.nodes.map((n) => [n.id, n.strand]));
}

/** concert id -> typology class, from the pipeline's classification. */
export function getConcertClassMap(): Record<string, string> {
  const eco = getConcertEcosystem();
  if (!eco) return {};
  const map: Record<string, string> = {};
  for (const [klass, data] of Object.entries(eco.classes)) {
    for (const ev of data.events ?? []) map[ev.id] = klass;
  }
  return map;
}

/** What an act is connected to in the network, and on what evidence.
 *
 *  Used by the artist pages so a profile can say "connected to X because they
 *  shared these bills" rather than just showing a number. Reads the same
 *  multi-layer graph the /network view does.
 */
export type Neighbour = {
  id: string;
  layers: string[];
  evidence: string;
  observed: boolean;
};

export type NetworkPosition = {
  strand: string;
  eventCount: number;
  degree: number;
  observedDegree: number;
  neighbours: Neighbour[];
  community: Community | null;
};

const LAYER_EVIDENCE: Record<string, (d: EdgeLayer) => string> = {
  co_billing: (d) =>
    `${d.weight} shared bill${d.weight === 1 ? "" : "s"}`,
  personnel: (d) => `shared member: ${(d.shared_members ?? []).join(", ")}`,
  domestic_influence: (d) => (d.citations ?? []).join("; "),
  influence_homophily: (d) =>
    `both cite ${(d.shared_influences ?? []).join(", ")}`,
};

const OBSERVED = new Set(["co_billing", "personnel", "domestic_influence"]);

export function getNetworkPosition(artistId: string): NetworkPosition | null {
  const net = getMultiLayerNetwork();
  if (!net) return null;
  const node = net.nodes.find((n) => n.id === artistId);
  if (!node) return null;

  const neighbours: Neighbour[] = [];
  for (const e of net.edges) {
    const other =
      e.source === artistId ? e.target : e.target === artistId ? e.source : null;
    if (!other) continue;
    const layers = Object.keys(e.layers);
    neighbours.push({
      id: other,
      layers,
      evidence: layers
        .map((l) => LAYER_EVIDENCE[l]?.(e.layers[l]) ?? l)
        .join(" · "),
      observed: layers.some((l) => OBSERVED.has(l)),
    });
  }
  neighbours.sort(
    (a, b) => Number(b.observed) - Number(a.observed) || a.id.localeCompare(b.id),
  );

  const communities = getCommunities();
  const community =
    communities?.observed.communities.find(
      (c) => c.size >= 3 && c.members.includes(artistId),
    ) ?? null;

  return {
    strand: node.strand,
    eventCount: node.event_count,
    degree: neighbours.length,
    observedDegree: neighbours.filter((n) => n.observed).length,
    neighbours,
    community,
  };
}

/** Per-strand facts for the genre pages, straight from the pipeline outputs. */
export function getStrandProfile(strand: string) {
  const temporal = getTemporalSummary();
  const influence = getInfluenceAnalysis();
  return {
    lifecycle: temporal?.strand_lifecycle?.[strand] ?? null,
    topInfluences: influence?.named_influences_by_strand?.[strand] ?? {},
    localisation: influence?.localisation_mechanisms?.by_strand?.[strand] ?? {},
  };
}
