import Link from "next/link";
import { getAllGenres } from "@/lib/data";

export const metadata = { title: "Genres · Bangladesh Music Evolution" };

export default function GenresPage() {
  const genres = getAllGenres();

  return (
    <div className="mx-auto max-w-6xl px-4 sm:px-6 py-12">
      <h1 className="text-3xl font-bold tracking-tight">Genres</h1>
      <p className="text-neutral-400 mt-2">
        Genre communities represented across catalogued artists.
      </p>

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 mt-8">
        {genres.map((g) => (
          <Link
            key={g.genre}
            href={`/genres/${encodeURIComponent(g.genre)}`}
            className="rounded-lg border border-neutral-800 p-5 bg-neutral-900/50 hover:border-emerald-500/60 transition-colors"
          >
            <div className="font-medium">{g.genre}</div>
            <div className="text-sm text-neutral-500 mt-1">
              {g.artists.length} artist{g.artists.length === 1 ? "" : "s"}
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
