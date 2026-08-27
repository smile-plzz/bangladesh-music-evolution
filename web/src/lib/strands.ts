// The seven BMEM genre strands and one colour each, shared by every view.
//
// These are the same Okabe-Ito colour-blind-safe values the Python figures use
// (analysis/scripts/make_visualizations.py), so a strand reads the same colour
// on a chart, in the network graph and on a filter chip.

export const STRANDS = [
  "Mainstream Rock",
  "Progressive Rock/Metal",
  "Heavy Metal",
  "Alternative/Indie",
  "Pop",
  "Hip-Hop/Rap",
  "Folk & Folk Fusion",
] as const;

export type Strand = (typeof STRANDS)[number] | "Unclassified";

export const STRAND_COLOR: Record<string, string> = {
  "Mainstream Rock": "#0072B2",
  "Progressive Rock/Metal": "#009E73",
  "Heavy Metal": "#D55E00",
  "Alternative/Indie": "#CC79A7",
  Pop: "#E69F00",
  "Hip-Hop/Rap": "#56B4E9",
  "Folk & Folk Fusion": "#8C6D31",
  Unclassified: "#999999",
};

export function strandColor(strand: string | undefined): string {
  return STRAND_COLOR[strand ?? "Unclassified"] ?? STRAND_COLOR.Unclassified;
}

/** Decade label for a year, e.g. 1994 -> "1990s". Null years sort last. */
export function decadeOf(year: number | null | undefined): string | null {
  if (!year) return null;
  return `${Math.floor(year / 10) * 10}s`;
}
