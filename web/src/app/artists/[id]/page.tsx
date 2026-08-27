import Link from "next/link";
import { notFound } from "next/navigation";
import { getAllArtists, getArtist, getConcertsForArtist } from "@/lib/data";
import { getConcertClassMap, getNetworkPosition } from "@/lib/analysis";
import { strandColor, strandSlug } from "@/lib/strands";
import { Panel, CrossLink } from "@/components/ui";

export function generateStaticParams() {
  return getAllArtists().map((a) => ({ id: a.id }));
}

export async function generateMetadata({ params }: PageProps<"/artists/[id]">) {
  const { id } = await params;
  const artist = getArtist(id);
  if (!artist) return { title: "Not found · Bangladesh Music Evolution" };
  return {
    title: `${artist.name} · Bangladesh Music Evolution`,
    description: `${artist.name}: formation, members, discography, documented influences and network position in the Bangladeshi music ecosystem.`,
  };
}

const CONFIDENCE_STYLE: Record<string, string> = {
  high: "text-emerald-400 border-emerald-500/40",
  medium: "text-sky-400 border-sky-500/40",
  low: "text-amber-400 border-amber-500/40",
  hypothesized: "text-neutral-400 border-neutral-600",
};

function Section({
  title,
  children,
  aside,
}: {
  title: string;
  children: React.ReactNode;
  aside?: React.ReactNode;
}) {
  return (
    <section className="mt-10">
      <div className="flex items-baseline justify-between gap-4 mb-3">
        <h2 className="text-lg font-semibold">{title}</h2>
        {aside}
      </div>
      {children}
    </section>
  );
}

export default async function ArtistPage({ params }: PageProps<"/artists/[id]">) {
  const { id } = await params;
  const artist = getArtist(id);
  if (!artist) notFound();

  const concerts = getConcertsForArtist(artist.id);
  const position = getNetworkPosition(artist.id);
  const classMap = getConcertClassMap();
  const names = Object.fromEntries(getAllArtists().map((a) => [a.id, a.name]));

  const strand = position?.strand ?? "Unclassified";
  const colour = strandColor(strand);
  const needsVerification = (artist.tags ?? []).includes("needs-verification");
  const snippetSourced = (artist.tags ?? []).includes("snippet-sourced");

  return (
    <div className="pb-20">
      <header className="mx-auto max-w-4xl px-4 sm:px-6 pt-12">
        <Link
          href="/artists"
          className="text-sm text-neutral-500 hover:text-neutral-300 transition-colors"
        >
          ← All artists
        </Link>

        <h1 className="text-3xl sm:text-4xl font-bold tracking-tight mt-5">
          {artist.name}
        </h1>
        {artist.also_known_as?.length ? (
          <p className="mt-1 text-sm text-neutral-500">
            Also known as {artist.also_known_as.join(", ")}
          </p>
        ) : null}

        <div className="mt-3 flex flex-wrap items-center gap-x-3 gap-y-1.5 text-neutral-400">
          <Link
            href={`/genres/${strandSlug(strand)}`}
            className="inline-flex items-center gap-1.5 hover:text-emerald-300 transition-colors"
          >
            <span
              className="w-2.5 h-2.5 rounded-full shrink-0"
              style={{ backgroundColor: colour }}
              aria-hidden
            />
            {strand}
          </Link>
          <span className="text-neutral-700">·</span>
          <span>{artist.origin_city || "origin unrecorded"}</span>
          <span className="text-neutral-700">·</span>
          <span>
            {artist.formed_year ? `formed ${artist.formed_year}` : "formation year unrecorded"}
            {artist.disbanded_year ? `–${artist.disbanded_year}` : ""}
          </span>
          {artist.type ? (
            <>
              <span className="text-neutral-700">·</span>
              <span>{artist.type}</span>
            </>
          ) : null}
        </div>

        {needsVerification || snippetSourced ? (
          <p className="mt-4 rounded-md border border-amber-500/30 bg-amber-500/5 px-3 py-2 text-xs text-amber-200/80 leading-relaxed">
            {needsVerification
              ? "This record carries gaps or approximations its sources could not settle. "
              : ""}
            {snippetSourced
              ? "It was compiled from search-result summaries rather than full article text, and is pending verification. "
              : ""}
            Undocumented values are left null rather than guessed.
          </p>
        ) : null}

        <div className="mt-4 flex flex-wrap gap-1.5">
          {artist.genres.map((g) => (
            <span
              key={g}
              className="text-xs px-2 py-0.5 rounded-full bg-neutral-800 text-neutral-300"
            >
              {g}
            </span>
          ))}
        </div>
      </header>

      <div className="mx-auto max-w-4xl px-4 sm:px-6">
        {position ? (
          <Section
            title="Position in the network"
            aside={
              <CrossLink href="/network">Open the graph →</CrossLink>
            }
          >
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {[
                { v: position.eventCount, l: "Documented events" },
                { v: position.observedDegree, l: "Observed connections" },
                { v: position.degree, l: "Connections, all layers" },
                {
                  v: position.community ? position.community.size : "—",
                  l: "Community size",
                },
              ].map((s) => (
                <Panel key={s.l} className="p-4">
                  <div
                    className="text-2xl font-bold tabular-nums"
                    style={{ color: colour }}
                  >
                    {s.v}
                  </div>
                  <div className="text-xs text-neutral-500 mt-1">{s.l}</div>
                </Panel>
              ))}
            </div>

            {position.degree === 0 ? (
              <p className="mt-4 text-sm text-amber-500/80 leading-relaxed">
                No documented link to any other act yet. That is a gap in the
                concert record rather than a statement about this
                act&rsquo;s audience — 35 of 63 catalogued acts have no
                documented event.
              </p>
            ) : (
              <>
                {position.community ? (
                  <p className="mt-4 text-sm text-neutral-400 leading-relaxed">
                    Sits in a {position.community.size}-act community whose
                    dominant strand is{" "}
                    <span className="text-neutral-200">
                      {position.community.dominant_strand}
                    </span>
                    , alongside{" "}
                    {position.community.members
                      .filter((m) => m !== artist.id)
                      .slice(0, 6)
                      .map((m, i, arr) => (
                        <span key={m}>
                          <Link
                            href={`/artists/${m}`}
                            className="text-neutral-300 hover:text-emerald-300 transition-colors"
                          >
                            {names[m] ?? m}
                          </Link>
                          {i < arr.length - 1 ? ", " : ""}
                        </span>
                      ))}
                    {position.community.members.length > 7 ? " and others" : ""}.
                  </p>
                ) : null}

                <ul className="mt-5 space-y-2.5">
                  {position.neighbours.map((n) => (
                    <li key={n.id} className="text-sm">
                      <div className="flex flex-wrap items-baseline gap-2">
                        <Link
                          href={`/artists/${n.id}`}
                          className="text-neutral-200 hover:text-emerald-300 transition-colors"
                        >
                          {names[n.id] ?? n.id}
                        </Link>
                        {!n.observed ? (
                          <span className="text-[11px] rounded-full border border-neutral-700 px-1.5 py-0.5 text-neutral-500">
                            inferred
                          </span>
                        ) : null}
                      </div>
                      <div className="text-xs text-neutral-500 leading-snug">
                        {n.evidence}
                      </div>
                    </li>
                  ))}
                </ul>
              </>
            )}
          </Section>
        ) : null}

        {artist.members?.length ? (
          <Section title="Members">
            <ul className="space-y-1.5">
              {artist.members.map((m, i) => (
                <li key={`${m.name}-${i}`} className="text-sm">
                  <span className="text-neutral-200">{m.name}</span>
                  <span className="text-neutral-500">
                    {m.role ? ` — ${m.role}` : ""}
                    {m.years_active ? ` (${m.years_active})` : ""}
                    {m.current === false ? " · former" : ""}
                  </span>
                </li>
              ))}
            </ul>
          </Section>
        ) : null}

        {artist.discography_summary?.length ? (
          <Section title="Discography">
            <ul className="space-y-2">
              {artist.discography_summary.map((d, i) => (
                <li key={`${d.title}-${i}`} className="text-sm">
                  <span className="text-neutral-200">{d.title}</span>
                  <span className="text-neutral-500">
                    {d.year ? ` · ${d.year}` : " · year unrecorded"}
                    {d.type ? ` · ${d.type}` : ""}
                    {d.label ? ` · ${d.label}` : ""}
                  </span>
                  {d.notable_tracks?.length ? (
                    <div className="text-xs text-neutral-500 mt-0.5">
                      {d.notable_tracks.join(" · ")}
                    </div>
                  ) : null}
                </li>
              ))}
            </ul>
          </Section>
        ) : null}

        {artist.global_influences?.length ? (
          <Section
            title="Documented influences"
            aside={<CrossLink href="/influences">Explore influences →</CrossLink>}
          >
            <ul className="space-y-4">
              {artist.global_influences.map((inf, i) => (
                <li
                  key={`${inf.artist_or_genre}-${i}`}
                  className="rounded-lg border border-neutral-800 bg-neutral-900/50 p-4"
                >
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="font-medium">{inf.artist_or_genre}</span>
                    <span
                      className={`rounded-full border px-2 py-0.5 text-[11px] ${
                        CONFIDENCE_STYLE[inf.confidence] ??
                        CONFIDENCE_STYLE.hypothesized
                      }`}
                      title="Confidence stated in the artist record"
                    >
                      {inf.confidence}
                    </span>
                  </div>
                  {inf.evidence ? (
                    <p className="mt-2 text-sm text-neutral-300 leading-relaxed">
                      {inf.evidence}
                    </p>
                  ) : null}
                  {inf.source ? (
                    <p className="mt-2 text-xs text-neutral-500">
                      Source: {inf.source}
                    </p>
                  ) : null}
                </li>
              ))}
            </ul>
          </Section>
        ) : null}

        {artist.local_adaptation_notes ? (
          <Section title="Local adaptation">
            <p className="text-sm text-neutral-300 leading-relaxed">
              {artist.local_adaptation_notes}
            </p>
          </Section>
        ) : null}

        {artist.sound_evolution_summary ? (
          <Section title="Sound evolution">
            <p className="text-sm text-neutral-300 leading-relaxed">
              {artist.sound_evolution_summary}
            </p>
            <p className="mt-3 text-xs text-neutral-500 leading-relaxed">
              Based on documented description and discographic sequence. No
              audio-feature analysis was possible in this project, so nothing
              here rests on measured signal.
            </p>
          </Section>
        ) : null}

        {artist.concert_culture_notes ? (
          <Section title="Concert culture">
            <p className="text-sm text-neutral-300 leading-relaxed">
              {artist.concert_culture_notes}
            </p>
          </Section>
        ) : null}

        {artist.listener_community_notes ? (
          <Section title="Listener community">
            <p className="text-sm text-neutral-300 leading-relaxed">
              {artist.listener_community_notes}
            </p>
            <p className="mt-3 text-xs text-neutral-500 leading-relaxed">
              Inferred from co-billing and from what artists and journalists
              said — this project has no audience-side data.
            </p>
          </Section>
        ) : null}

        <Section
          title="Documented events"
          aside={
            concerts.length ? (
              <CrossLink href="/concerts">All concerts →</CrossLink>
            ) : undefined
          }
        >
          {concerts.length === 0 ? (
            <p className="text-sm text-amber-500/80 leading-relaxed">
              No events documented for this act yet.
            </p>
          ) : (
            <ul className="space-y-2">
              {concerts.map((c) => (
                <li key={c.id} className="text-sm">
                  <Link
                    href={`/concerts/${c.id}`}
                    className="text-neutral-200 hover:text-emerald-300 transition-colors"
                  >
                    {c.name}
                  </Link>
                  <div className="text-xs text-neutral-500">
                    {c.date}
                    {c.venue?.city ? ` · ${c.venue.city}` : ""}
                    {classMap[c.id]
                      ? ` · ${classMap[c.id].replace(/-/g, " ")}`
                      : ""}
                  </div>
                </li>
              ))}
            </ul>
          )}
        </Section>

        {artist.sources?.length ? (
          <Section title="Sources">
            <ul className="space-y-1.5">
              {artist.sources.map((s, i) => (
                <li key={`${s.url}-${i}`} className="text-sm">
                  {s.url ? (
                    <a
                      href={s.url}
                      target="_blank"
                      rel="noreferrer"
                      className="text-emerald-400 hover:underline"
                    >
                      {s.title || s.url}
                    </a>
                  ) : (
                    <span className="text-neutral-300">{s.title}</span>
                  )}
                  <span className="text-neutral-500">
                    {s.type ? ` · ${s.type}` : ""}
                    {s.accessed ? ` · accessed ${s.accessed}` : ""}
                  </span>
                </li>
              ))}
            </ul>
          </Section>
        ) : null}

        <p className="mt-12 text-xs text-neutral-600">
          Record last updated {artist.last_updated || "unrecorded"} ·{" "}
          <a
            href={`https://github.com/smile-plzz/bangladesh-music-evolution/blob/main/data/artists/${artist.id}/metadata.json`}
            target="_blank"
            rel="noreferrer"
            className="hover:text-neutral-400 underline"
          >
            source record
          </a>
        </p>
      </div>
    </div>
  );
}
