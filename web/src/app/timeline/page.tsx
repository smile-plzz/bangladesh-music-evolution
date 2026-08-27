import { getAllArtists, getAllConcerts } from "@/lib/data";
import { getStrandMap, getTemporalSummary } from "@/lib/analysis";
import { PageHeader, Caveat, CrossLink, Empty } from "@/components/ui";
import TimelineExplorer, {
  type DecadeBucket,
  type TimelineArtist,
  type TimelineEvent,
} from "./TimelineExplorer";

export const metadata = {
  title: "Timeline · Bangladesh Music Evolution",
  description:
    "Decade by decade: when acts formed, when they released, and when the documented concerts happened.",
};

export default function TimelinePage() {
  const temporal = getTemporalSummary();
  const strandMap = getStrandMap();
  const concerts = getAllConcerts();

  if (!temporal) {
    return (
      <div className="mx-auto max-w-3xl px-4 sm:px-6 py-20">
        <Empty>
          Temporal analysis output not found. Run{" "}
          <code>analysis/scripts/temporal_analysis.py</code>.
        </Empty>
      </div>
    );
  }

  const eventsByDecade = new Map<string, number>();
  for (const c of concerts) {
    if (!c.date) continue;
    const d = `${Math.floor(Number(c.date.slice(0, 4)) / 10) * 10}s`;
    eventsByDecade.set(d, (eventsByDecade.get(d) ?? 0) + 1);
  }

  const decades = [
    ...new Set([
      ...Object.keys(temporal.formations_by_decade),
      ...Object.keys(temporal.releases_by_decade),
    ]),
  ].sort();

  const buckets: DecadeBucket[] = decades.map((d) => {
    const label = `${d}s`;
    const formations = temporal.formations_by_decade[d]?.by_strand ?? {};
    const releases = temporal.releases_by_decade[d]?.by_strand ?? {};
    return {
      decade: label,
      formations,
      releases,
      events: eventsByDecade.get(label) ?? 0,
      formationTotal: temporal.formations_by_decade[d]?.total ?? 0,
      releaseTotal: temporal.releases_by_decade[d]?.total ?? 0,
    };
  });

  const artists: TimelineArtist[] = getAllArtists()
    .filter((a) => a.formed_year)
    .map((a) => ({
      id: a.id,
      name: a.name,
      strand: strandMap[a.id] ?? "Unclassified",
      formed_year: a.formed_year as number,
    }));

  const events: TimelineEvent[] = concerts.map((c) => ({
    id: c.id,
    name: c.name,
    date: c.date,
    city: c.venue?.city ?? "",
    billSize: (c.artists ?? []).length,
  }));

  const undated = temporal.strand_lifecycle
    ? getAllArtists().filter((a) => !a.formed_year).length
    : 0;

  return (
    <div className="pb-20">
      <PageHeader
        eyebrow="Explore"
        title="Timeline"
        lede="Fifty years of the catalogued record, by decade. Switch between formations, releases and documented events, then open a decade to see the acts and shows behind the bar."
        meta={
          <>
            {temporal.release_cadence.total_dated_releases} dated releases ·
            median gap between an act&rsquo;s releases{" "}
            {temporal.release_cadence.median_gap_between_releases_years} years
            {undated ? ` · ${undated} act with no recorded formation year` : ""}
          </>
        }
      />
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <TimelineExplorer buckets={buckets} artists={artists} events={events} />
        <Caveat>
          These are counts of the catalogued sample, not of the country. Recent
          decades have better event coverage and worse formation coverage than
          older ones — the 2020s bar is low because recent acts have not yet
          accumulated the documentation this catalogue is built from, not because
          band formation stopped. Read trends that cross that boundary with care;{" "}
          <CrossLink href="/findings#time">the findings</CrossLink> set out which
          ones survive it.
        </Caveat>
      </div>
    </div>
  );
}
