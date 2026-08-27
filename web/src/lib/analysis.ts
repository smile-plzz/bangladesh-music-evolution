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
  classes: Record<
    string,
    {
      event_count: number;
      mean_bill_size: number;
      cross_strand_rate: number | null;
      description: string;
      strand_mix: Record<string, number>;
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
