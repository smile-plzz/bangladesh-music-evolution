import Link from "next/link";
import { notFound } from "next/navigation";
import { getAllArtists, getArtist, getConcertsForArtist } from "@/lib/data";

export async function generateStaticParams() {
  return getAllArtists().map((a) => ({ id: a.id }));
}

export default async function ArtistPage(props: PageProps<"/artists/[id]">) {
  const { id } = await props.params;
  const artist = getArtist(id);
  if (!artist) notFound();

  const concerts = getConcertsForArtist(artist.id);

  const confidenceColor: Record<string, string> = {
    high: "text-emerald-400",
    medium: "text-amber-400",
    low: "text-neutral-500",
  };

  return (
    <div className="mx-auto max-w-4xl px-4 sm:px-6 py-12">
      <Link href="/artists" className="text-sm text-emerald-400 hover:underline">
        &larr; All artists
      </Link>

      <h1 className="text-4xl font-bold tracking-tight mt-4">{artist.name}</h1>
      <div className="text-neutral-400 mt-2">
        {artist.origin_city}
        {artist.formed_year ? ` · formed ${artist.formed_year}` : ""}
        {artist.disbanded_year ? `–${artist.disbanded_year}` : ""}
        {" · "}
        {artist.type}
      </div>
      <div className="flex flex-wrap gap-1.5 mt-4">
        {artist.genres.map((g) => (
          <Link
            key={g}
            href={`/genres/${encodeURIComponent(g)}`}
            className="text-xs px-2 py-0.5 rounded-full bg-neutral-800 text-neutral-300 hover:bg-neutral-700"
          >
            {g}
          </Link>
        ))}
      </div>

      {artist.members.length > 0 && (
        <Section title="Members">
          <ul className="space-y-1.5">
            {artist.members.map((m) => (
              <li key={m.name} className="text-sm">
                <span className="text-neutral-200">{m.name}</span>
                <span className="text-neutral-500">
                  {" "}
                  — {m.role} ({m.years_active})
                  {m.current ? "" : " · former"}
                </span>
              </li>
            ))}
          </ul>
        </Section>
      )}

      {artist.discography_summary.length > 0 && (
        <Section title="Discography">
          <ul className="space-y-1.5">
            {artist.discography_summary.map((d) => (
              <li key={`${d.title}-${d.year}`} className="text-sm">
                <span className="text-neutral-200">{d.title}</span>
                <span className="text-neutral-500"> ({d.year}, {d.type})</span>
                {d.notable_tracks.length > 0 && (
                  <span className="text-neutral-500">
                    {" "}
                    — {d.notable_tracks.join(", ")}
                  </span>
                )}
              </li>
            ))}
          </ul>
        </Section>
      )}

      {artist.sound_evolution_summary && (
        <Section title="Sound evolution">
          <p className="text-sm text-neutral-300 leading-relaxed">
            {artist.sound_evolution_summary}
          </p>
        </Section>
      )}

      {artist.global_influences.length > 0 && (
        <Section title="Global influences">
          <div className="space-y-4">
            {artist.global_influences.map((inf) => (
              <div
                key={inf.artist_or_genre}
                className="rounded-lg border border-neutral-800 p-4"
              >
                <div className="flex items-center justify-between">
                  <span className="font-medium">{inf.artist_or_genre}</span>
                  <span
                    className={`text-xs uppercase tracking-wide ${
                      confidenceColor[inf.confidence] ?? "text-neutral-500"
                    }`}
                  >
                    {inf.confidence} confidence
                  </span>
                </div>
                <p className="text-sm text-neutral-400 mt-2 leading-relaxed">
                  {inf.evidence}
                </p>
                <p className="text-xs text-neutral-600 mt-2">
                  Source: {inf.source}
                </p>
              </div>
            ))}
          </div>
        </Section>
      )}

      {artist.local_adaptation_notes && (
        <Section title="Local adaptation">
          <p className="text-sm text-neutral-300 leading-relaxed">
            {artist.local_adaptation_notes}
          </p>
        </Section>
      )}

      {artist.concert_culture_notes && (
        <Section title="Concert culture">
          <p className="text-sm text-neutral-300 leading-relaxed">
            {artist.concert_culture_notes}
          </p>
        </Section>
      )}

      {artist.listener_community_notes && (
        <Section title="Listener community">
          <p className="text-sm text-neutral-300 leading-relaxed">
            {artist.listener_community_notes}
          </p>
        </Section>
      )}

      {concerts.length > 0 && (
        <Section title="Documented concerts">
          <ul className="space-y-2">
            {concerts.map((c) => (
              <li key={c.id}>
                <Link
                  href={`/concerts/${c.id}`}
                  className="text-sm text-neutral-200 hover:text-emerald-400"
                >
                  {c.name}
                </Link>
                <span className="text-sm text-neutral-500">
                  {" "}
                  — {c.date} · {c.venue.name}, {c.venue.city}
                </span>
              </li>
            ))}
          </ul>
        </Section>
      )}

      {artist.sources.length > 0 && (
        <Section title="Sources">
          <ul className="space-y-1">
            {artist.sources.map((s) => (
              <li key={s.url} className="text-sm">
                <a
                  href={s.url}
                  target="_blank"
                  rel="noreferrer"
                  className="text-emerald-400 hover:underline"
                >
                  {s.title}
                </a>
                <span className="text-neutral-600"> ({s.type})</span>
              </li>
            ))}
          </ul>
        </Section>
      )}

      <p className="text-xs text-neutral-600 mt-12">
        Last updated {artist.last_updated}
      </p>
    </div>
  );
}

function Section({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section className="mt-10">
      <h2 className="text-lg font-semibold mb-3">{title}</h2>
      {children}
    </section>
  );
}
