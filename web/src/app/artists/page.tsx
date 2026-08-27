import { getAllArtists, getConcertsForArtist } from "@/lib/data";
import { getStrandMap } from "@/lib/analysis";
import { PageHeader, Caveat, CrossLink } from "@/components/ui";
import ArtistExplorer, { type ArtistRow } from "./ArtistExplorer";

export const metadata = {
  title: "Artists · Bangladesh Music Evolution",
  description:
    "Search and filter the catalogued Bangladeshi artists by genre strand, decade, city and coverage.",
};

export default function ArtistsPage() {
  const artists = getAllArtists();
  const strandMap = getStrandMap();

  const rows: ArtistRow[] = artists.map((a) => ({
    id: a.id,
    name: a.name,
    strand: strandMap[a.id] ?? "Unclassified",
    genres: a.genres ?? [],
    formed_year: a.formed_year ?? null,
    disbanded_year: a.disbanded_year ?? null,
    origin_city: a.origin_city ?? "",
    event_count: getConcertsForArtist(a.id).length,
    influence_count: (a.global_influences ?? []).length,
    tags: a.tags ?? [],
  }));

  const noEvents = rows.filter((r) => r.event_count === 0).length;

  return (
    <div className="pb-20">
      <PageHeader
        eyebrow="Explore"
        title="Artists"
        lede={`${rows.length} catalogued acts, from the founding band era to acts formed in the last few years. Filter by genre strand, decade of formation, origin city, or by how well documented a record is.`}
      />
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <ArtistExplorer artists={rows} />
        <Caveat>
          The catalogue is a curated sample, not a census — {rows.length} acts
          against a target of 300, assembled outward from a well-documented
          metal core. {noEvents} acts have no documented event yet, which is a
          gap in the concert record rather than a fact about those acts. See{" "}
          <CrossLink href="/data">data and methods</CrossLink> for what that
          bias affects.
        </Caveat>
      </div>
    </div>
  );
}
