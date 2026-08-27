import Link from "next/link";
import { getAllArtists } from "@/lib/data";
import { getStrandMap, getStrandProfile } from "@/lib/analysis";
import { STRANDS, strandColor, strandSlug } from "@/lib/strands";
import { PageHeader, Caveat, CrossLink } from "@/components/ui";

export const metadata = {
  title: "Genres · Bangladesh Music Evolution",
  description:
    "The seven BMEM genre strands: when each formed, what it cites as influence, and how it localises.",
};

export default function GenresPage() {
  const artists = getAllArtists();
  const strandMap = getStrandMap();

  const rows = STRANDS.map((strand) => {
    const members = artists.filter((a) => strandMap[a.id] === strand);
    const profile = getStrandProfile(strand);
    const topInfluences = Object.entries(profile.topInfluences).slice(0, 4);
    return { strand: strand as string, members, profile, topInfluences };
  }).filter((r) => r.members.length > 0);

  const max = Math.max(...rows.map((r) => r.members.length), 1);

  return (
    <div className="pb-20">
      <PageHeader
        eyebrow="Explore"
        title="Genre strands"
        lede="The study works with seven strands rather than raw genre tags. Each act's strand is computed from its genre list by positional weighting, in the analysis pipeline — so a strand means the same thing here, on a chart, and in the network graph."
      />

      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <div className="space-y-4">
          {rows.map((r) => {
            const life = r.profile.lifecycle;
            return (
              <Link
                key={r.strand}
                href={`/genres/${strandSlug(r.strand)}`}
                className="group block rounded-lg border border-neutral-800 bg-neutral-900/50 p-5 hover:border-emerald-500/60 transition-colors"
              >
                <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1">
                  <h2 className="font-medium text-lg flex items-center gap-2 group-hover:text-emerald-300 transition-colors">
                    <span
                      className="w-2.5 h-2.5 rounded-full shrink-0"
                      style={{ backgroundColor: strandColor(r.strand) }}
                      aria-hidden
                    />
                    {r.strand}
                  </h2>
                  <span className="text-sm text-neutral-500 tabular-nums">
                    {r.members.length} act{r.members.length === 1 ? "" : "s"}
                    {life?.first_formation
                      ? ` · ${life.first_formation}–${life.latest_formation}`
                      : ""}
                  </span>
                </div>

                <div className="mt-3 h-1.5 rounded-full bg-neutral-800/70 overflow-hidden">
                  <div
                    className="h-full rounded-full"
                    style={{
                      width: `${(r.members.length / max) * 100}%`,
                      backgroundColor: strandColor(r.strand),
                    }}
                  />
                </div>

                <div className="mt-3 text-sm text-neutral-400">
                  {r.topInfluences.length > 0 ? (
                    <>
                      Cites{" "}
                      {r.topInfluences.map(([name], i) => (
                        <span key={name}>
                          {i > 0 ? ", " : ""}
                          <span className="text-neutral-300">{name}</span>
                        </span>
                      ))}
                    </>
                  ) : (
                    <span className="text-amber-500/80">
                      No named global act cited anywhere in this strand — only
                      tradition labels.
                    </span>
                  )}
                </div>
              </Link>
            );
          })}
        </div>

        <Caveat>
          Strand assignment is computed, not hand-curated: each raw genre token
          resolves to one strand, and an act&rsquo;s strand is whichever scores
          highest with its first-listed genre weighted most. Two acts carry a
          documented override where the project&rsquo;s own curated groupings
          disagreed — kept visible rather than tuned away. See{" "}
          <CrossLink href="/research/docs--genre-evolution-map">
            the genre evolution map
          </CrossLink>{" "}
          for how the strands emerged and transmitted to each other.
        </Caveat>
      </div>
    </div>
  );
}
