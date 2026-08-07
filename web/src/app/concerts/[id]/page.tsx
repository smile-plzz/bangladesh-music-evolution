import Link from "next/link";
import { notFound } from "next/navigation";
import { getAllArtists, getAllConcerts, getConcert } from "@/lib/data";

export async function generateStaticParams() {
  return getAllConcerts().map((c) => ({ id: c.id }));
}

export default async function ConcertPage(props: PageProps<"/concerts/[id]">) {
  const { id } = await props.params;
  const concert = getConcert(id);
  if (!concert) notFound();

  const artistNames = new Map(getAllArtists().map((a) => [a.id, a.name]));

  return (
    <div className="mx-auto max-w-3xl px-4 sm:px-6 py-12">
      <Link href="/concerts" className="text-sm text-emerald-400 hover:underline">
        &larr; All concerts
      </Link>

      <h1 className="text-3xl font-bold tracking-tight mt-4">{concert.name}</h1>
      <div className="text-neutral-400 mt-2">
        {concert.date}
        {concert.date_precision !== "day" ? ` (${concert.date_precision})` : ""}
        {" · "}
        {concert.venue.name}, {concert.venue.city}, {concert.venue.country}
      </div>

      <div className="flex flex-wrap gap-1.5 mt-4">
        {concert.genres_represented.map((g) => (
          <Link
            key={g}
            href={`/genres/${encodeURIComponent(g)}`}
            className="text-xs px-2 py-0.5 rounded-full bg-neutral-800 text-neutral-300 hover:bg-neutral-700"
          >
            {g}
          </Link>
        ))}
      </div>

      <section className="mt-8">
        <h2 className="text-lg font-semibold mb-3">Lineup</h2>
        <ul className="space-y-1.5">
          {concert.artists.map((a) => (
            <li key={a.artist_id} className="text-sm">
              {artistNames.has(a.artist_id) ? (
                <Link
                  href={`/artists/${a.artist_id}`}
                  className="text-neutral-200 hover:text-emerald-400"
                >
                  {artistNames.get(a.artist_id)}
                </Link>
              ) : (
                <span className="text-neutral-200">{a.artist_id}</span>
              )}
              <span className="text-neutral-500"> — {a.billing}</span>
            </li>
          ))}
        </ul>
      </section>

      {concert.notes && (
        <section className="mt-8">
          <h2 className="text-lg font-semibold mb-3">Notes</h2>
          <p className="text-sm text-neutral-300 leading-relaxed">
            {concert.notes}
          </p>
        </section>
      )}

      {concert.sources.length > 0 && (
        <section className="mt-8">
          <h2 className="text-lg font-semibold mb-3">Sources</h2>
          <ul className="space-y-1">
            {concert.sources.map((s) => (
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
        </section>
      )}

      <p className="text-xs text-neutral-600 mt-12">
        Last updated {concert.last_updated}
      </p>
    </div>
  );
}
