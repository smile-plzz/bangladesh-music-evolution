import Link from "next/link";
import { notFound } from "next/navigation";
import { getAllGenres } from "@/lib/data";

export async function generateStaticParams() {
  return getAllGenres().map((g) => ({ genre: g.genre }));
}

export default async function GenrePage(props: PageProps<"/genres/[genre]">) {
  const { genre } = await props.params;
  const decoded = decodeURIComponent(genre);
  const all = getAllGenres();
  const entry = all.find((g) => g.genre === decoded);
  if (!entry) notFound();

  return (
    <div className="mx-auto max-w-4xl px-4 sm:px-6 py-12">
      <Link href="/genres" className="text-sm text-emerald-400 hover:underline">
        &larr; All genres
      </Link>
      <h1 className="text-3xl font-bold tracking-tight mt-4">{entry.genre}</h1>
      <p className="text-neutral-400 mt-2">
        {entry.artists.length} artist{entry.artists.length === 1 ? "" : "s"} in
        this genre.
      </p>

      <div className="grid sm:grid-cols-2 gap-4 mt-8">
        {entry.artists.map((a) => (
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
              {a.genres.map((g) => (
                <span
                  key={g}
                  className={`text-xs px-2 py-0.5 rounded-full ${
                    g === entry.genre
                      ? "bg-emerald-500/20 text-emerald-400"
                      : "bg-neutral-800 text-neutral-300"
                  }`}
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
