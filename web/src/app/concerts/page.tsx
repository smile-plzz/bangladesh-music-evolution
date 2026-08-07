import Link from "next/link";
import { getAllConcerts } from "@/lib/data";

export const metadata = { title: "Concerts · Bangladesh Music Evolution" };

export default function ConcertsPage() {
  const concerts = getAllConcerts();

  return (
    <div className="mx-auto max-w-4xl px-4 sm:px-6 py-12">
      <h1 className="text-3xl font-bold tracking-tight">Concerts</h1>
      <p className="text-neutral-400 mt-2">
        {concerts.length} publicly documented concerts and festivals, newest
        first.
      </p>

      <ul className="mt-8 divide-y divide-neutral-800 border-t border-b border-neutral-800">
        {concerts.map((c) => (
          <li key={c.id}>
            <Link
              href={`/concerts/${c.id}`}
              className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1 py-4 hover:bg-neutral-900/50 px-2 -mx-2 rounded transition-colors"
            >
              <div>
                <div className="font-medium">{c.name}</div>
                <div className="text-sm text-neutral-500">
                  {c.venue.name}, {c.venue.city}
                </div>
              </div>
              <div className="text-sm text-neutral-400 whitespace-nowrap">
                {c.date}
              </div>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
