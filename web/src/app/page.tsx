import Link from "next/link";
import {
  getAllArtists,
  getAllConcerts,
  getAllGenres,
  getNetwork,
} from "@/lib/data";

export default function Home() {
  const artists = getAllArtists();
  const concerts = getAllConcerts();
  const genres = getAllGenres();
  const network = getNetwork();

  const stats = [
    { label: "Artists catalogued", value: artists.length },
    { label: "Concerts documented", value: concerts.length },
    { label: "Genres tracked", value: genres.length },
    { label: "Network nodes", value: network?.node_count ?? 0 },
  ];

  const featured = artists.filter((a) => a.tags.includes("priority")).slice(0, 6);
  const spotlight = featured.length > 0 ? featured : artists.slice(0, 6);

  return (
    <div>
      <section className="mx-auto max-w-6xl px-4 sm:px-6 pt-16 pb-12">
        <p className="text-sm uppercase tracking-widest text-emerald-400 font-medium mb-3">
          From Folk Roots to Digital Streams
        </p>
        <h1 className="text-4xl sm:text-5xl font-bold tracking-tight max-w-3xl">
          The Evolution of Contemporary Bangladeshi Music Culture
        </h1>
        <p className="mt-5 max-w-2xl text-neutral-400 text-lg">
          A computational analysis of genre development, global influences,
          listener communities, and musical ecosystems in Bangladesh, from
          the late 1970s to the present.
        </p>
        <div className="mt-8 flex flex-wrap gap-3">
          <Link
            href="/artists"
            className="px-5 py-2.5 rounded-md bg-emerald-500 text-neutral-950 font-medium hover:bg-emerald-400 transition-colors"
          >
            Explore Artists
          </Link>
          <Link
            href="/network"
            className="px-5 py-2.5 rounded-md border border-neutral-700 hover:border-neutral-500 transition-colors"
          >
            View Preference Network
          </Link>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 sm:px-6 py-8">
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {stats.map((s) => (
            <div
              key={s.label}
              className="rounded-lg border border-neutral-800 p-5 bg-neutral-900/50"
            >
              <div className="text-3xl font-bold text-emerald-400">
                {s.value}
              </div>
              <div className="text-sm text-neutral-400 mt-1">{s.label}</div>
            </div>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 sm:px-6 py-8">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold">Genres under study</h2>
          <Link href="/genres" className="text-sm text-emerald-400 hover:underline">
            View all
          </Link>
        </div>
        <div className="flex flex-wrap gap-2">
          {genres.map((g) => (
            <Link
              key={g.genre}
              href={`/genres/${encodeURIComponent(g.genre)}`}
              className="px-3 py-1.5 rounded-full border border-neutral-800 text-sm text-neutral-300 hover:border-emerald-500 hover:text-emerald-400 transition-colors"
            >
              {g.genre}
              <span className="text-neutral-500 ml-1.5">{g.artists.length}</span>
            </Link>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 sm:px-6 py-8 pb-20">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold">Spotlight artists</h2>
          <Link href="/artists" className="text-sm text-emerald-400 hover:underline">
            View all
          </Link>
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {spotlight.map((a) => (
            <Link
              key={a.id}
              href={`/artists/${a.id}`}
              className="rounded-lg border border-neutral-800 p-5 bg-neutral-900/50 hover:border-emerald-500/60 transition-colors"
            >
              <div className="font-medium">{a.name}</div>
              <div className="text-sm text-neutral-500 mt-1">
                {a.origin_city}
                {a.formed_year ? ` · formed ${a.formed_year}` : ""}
              </div>
              <div className="flex flex-wrap gap-1.5 mt-3">
                {a.genres.slice(0, 3).map((g) => (
                  <span
                    key={g}
                    className="text-xs px-2 py-0.5 rounded-full bg-neutral-800 text-neutral-300"
                  >
                    {g}
                  </span>
                ))}
              </div>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}
