import { getAllArtists, getAllConcerts } from "@/lib/data";
import { getConcertClassMap, getConcertEcosystem, getStrandMap } from "@/lib/analysis";
import { PageHeader, Caveat, CrossLink } from "@/components/ui";
import ConcertExplorer, { type ConcertRow } from "./ConcertExplorer";

export const metadata = {
  title: "Concerts · Bangladesh Music Evolution",
  description:
    "Filter the catalogued concerts and festivals by ecosystem class, decade, city and the genre strands on the bill.",
};

export default function ConcertsPage() {
  const concerts = getAllConcerts();
  const strandMap = getStrandMap();
  const classMap = getConcertClassMap();
  const eco = getConcertEcosystem();
  const artistNames = Object.fromEntries(
    getAllArtists().map((a) => [a.id, a.name]),
  );

  const rows: ConcertRow[] = concerts.map((c) => {
    const billed = (c.artists ?? [])
      .filter((a) => artistNames[a.artist_id])
      .map((a) => ({
        id: a.artist_id,
        name: artistNames[a.artist_id],
        strand: strandMap[a.artist_id] ?? "Unclassified",
        billing: a.billing ?? "",
      }));
    return {
      id: c.id,
      name: c.name,
      date: c.date,
      year: c.date ? Number(c.date.slice(0, 4)) : null,
      city: c.venue?.city ?? "",
      venue: c.venue?.name ?? "",
      venueType: c.venue?.venue_type ?? "",
      organizer: c.organizer ?? "",
      typology: classMap[c.id] ?? "unclassified",
      strands: [...new Set(billed.map((b) => b.strand))],
      billSize: billed.length,
      billed,
      tags: c.tags ?? [],
    };
  });

  const emptyClasses = eco
    ? Object.entries(eco.classes).filter(([, v]) => v.event_count === 0)
    : [];

  return (
    <div className="pb-20">
      <PageHeader
        eyebrow="Explore"
        title="Concerts &amp; festivals"
        lede={`${rows.length} documented events, each classified against the concert-ecosystem framework by an explicit rule. Filter by that class, by decade, by city, or by which genre strands shared the bill.`}
      />
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <ConcertExplorer concerts={rows} />
        <Caveat>
          23 events against a target of 500, and 19 of them are in Dhaka. The
          sample over-represents festivals and landmark shows, because those are
          the events news outlets cover — the weekly gig economy that actually
          sustains a scene is nearly absent. One defined class,{" "}
          <span className="text-amber-500/80">urban-hiphop-event</span>, has zero
          entries despite eight catalogued hip-hop acts. See{" "}
          <CrossLink href="/findings#concerts">the findings</CrossLink> for what
          that distorts{emptyClasses.length ? "" : ""}.
        </Caveat>
      </div>
    </div>
  );
}
