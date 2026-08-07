import Link from "next/link";
import { getAllArtists } from "@/lib/data";

export const metadata = { title: "Artists · Bangladesh Music Evolution" };

export default function ArtistsPage() {
  const artists = getAllArtists();

  return (
    <div className="mx-auto max-w-6xl px-4 sm:px-6 py-12">
      <h1 className="text-3xl font-bold tracking-tight">Artists</h1>
      <p className="text-neutral-400 mt-2">
        {artists.length} artists catalogued across the Bangladeshi music
        ecosystem.
      </p>

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 mt-8">
        {artists.map((a) => (
          <Link
            key={a.id}
            href={`/artists/${a.id}`}
            className="rounded-lg border border-neutral-800 p-5 bg-neutral-900/50 hover:border-emerald-500/60 transition-colors"
          >
            <div className="font-medium">{a.name}</div>
            <div className="text-sm text-neutral-500 mt-1">
              {a.origin_city}
              {a.formed_year ? ` · formed ${a.formed_year}` : ""}
              {a.disbanded_year ? `–${a.disbanded_year}` : ""}
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
    </div>
  );
}
