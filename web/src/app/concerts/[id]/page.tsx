import Link from "next/link";
import { notFound } from "next/navigation";
import { getAllArtists, getAllConcerts, getConcert } from "@/lib/data";
import {
  getConcertClassMap,
  getConcertEcosystem,
  getStrandMap,
} from "@/lib/analysis";
import { strandColor, strandSlug } from "@/lib/strands";
import { Panel, CrossLink } from "@/components/ui";

export function generateStaticParams() {
  return getAllConcerts().map((c) => ({ id: c.id }));
}

export async function generateMetadata({ params }: PageProps<"/concerts/[id]">) {
  const { id } = await params;
  const concert = getConcert(id);
  if (!concert) return { title: "Not found · Bangladesh Music Evolution" };
  return {
    title: `${concert.name} · Bangladesh Music Evolution`,
    description: `${concert.name}, ${concert.date}: lineup, venue, ecosystem classification and sources.`,
  };
}

export default async function ConcertPage({
  params,
}: PageProps<"/concerts/[id]">) {
  const { id } = await params;
  const concert = getConcert(id);
  if (!concert) notFound();

  const artists = getAllArtists();
  const names = Object.fromEntries(artists.map((a) => [a.id, a.name]));
  const strandMap = getStrandMap();
  const klass = getConcertClassMap()[concert.id];
  const eco = getConcertEcosystem();
  const classInfo = klass ? eco?.classes[klass] : undefined;
  const classEvent = classInfo?.events.find((e) => e.id === concert.id);

  const billed = (concert.artists ?? []).map((a) => ({
    ...a,
    name: names[a.artist_id],
    strand: strandMap[a.artist_id] ?? "Unclassified",
    known: Boolean(names[a.artist_id]),
  }));
  const strands = [...new Set(billed.filter((b) => b.known).map((b) => b.strand))];

  const tags = concert.tags ?? [];
  const needsVerification = tags.includes("needs-verification");
  const snippetSourced = tags.includes("snippet-sourced");
  const lineupUnknown = tags.includes("lineup-unknown") || billed.length === 0;

  return (
    <div className="pb-20">
      <header className="mx-auto max-w-3xl px-4 sm:px-6 pt-12">
        <Link
          href="/concerts"
          className="text-sm text-neutral-500 hover:text-neutral-300 transition-colors"
        >
          ← All concerts
        </Link>

        <h1 className="text-3xl sm:text-4xl font-bold tracking-tight mt-5">
          {concert.name}
        </h1>

        <div className="mt-3 flex flex-wrap items-center gap-x-3 gap-y-1.5 text-neutral-400">
          <span className="tabular-nums">{concert.date}</span>
          {concert.date_precision && concert.date_precision !== "day" ? (
            <span className="text-amber-500/80 text-sm">
              ({concert.date_precision} precision)
            </span>
          ) : null}
          <span className="text-neutral-700">·</span>
          <span>
            {concert.venue?.name}
            {concert.venue?.city ? `, ${concert.venue.city}` : ""}
            {concert.venue?.country && concert.venue.country !== "Bangladesh"
              ? `, ${concert.venue.country}`
              : ""}
          </span>
        </div>

        {concert.organizer ? (
          <p className="mt-1 text-sm text-neutral-500">
            Organised by {concert.organizer}
          </p>
        ) : null}

        {needsVerification || snippetSourced ? (
          <p className="mt-4 rounded-md border border-amber-500/30 bg-amber-500/5 px-3 py-2 text-xs text-amber-200/80 leading-relaxed">
            {needsVerification
              ? "Approximate date, partial lineup or unconfirmed venue — flagged for verification against primary sources. "
              : ""}
            {snippetSourced
              ? "Compiled from search-result summaries rather than full article text."
              : ""}
          </p>
        ) : null}
      </header>

      <div className="mx-auto max-w-3xl px-4 sm:px-6 mt-8 space-y-10">
        {klass ? (
          <section>
            <h2 className="text-lg font-semibold">Ecosystem classification</h2>
            <Panel className="mt-3 p-4">
              <div className="font-medium capitalize">
                {klass.replace(/-/g, " ")}
              </div>
              {classInfo?.description ? (
                <p className="mt-2 text-sm text-neutral-400 leading-relaxed">
                  {classInfo.description}
                </p>
              ) : null}
              {classEvent?.rule ? (
                <p className="mt-3 text-xs text-neutral-500 leading-relaxed">
                  <span className="text-neutral-400">Classified by rule:</span>{" "}
                  {classEvent.rule}
                </p>
              ) : null}
            </Panel>
            <p className="mt-3 text-xs text-neutral-500">
              Every event is classified by an explicit ordered rule, and the rule
              that fired is recorded.{" "}
              <CrossLink href="/research/docs--concert-ecosystem-map">
                See the full typology
              </CrossLink>
              .
            </p>
          </section>
        ) : null}

        <section>
          <div className="flex items-baseline justify-between gap-4">
            <h2 className="text-lg font-semibold">
              Lineup
              {billed.length ? (
                <span className="text-neutral-500 font-normal">
                  {" "}
                  · {billed.length}
                </span>
              ) : null}
            </h2>
            {strands.length > 1 ? (
              <span className="text-xs text-neutral-500">
                {strands.length} strands on one bill
              </span>
            ) : null}
          </div>

          {lineupUnknown ? (
            <p className="mt-3 text-sm text-amber-500/80 leading-relaxed">
              No lineup was recoverable from accessible sources. This record is
              deliberately empty rather than populated by inference from
              adjacent years — inferring the bill would have produced
              clean-looking data and a false network.
            </p>
          ) : (
            <ul className="mt-4 space-y-2">
              {billed.map((b) => (
                <li key={b.artist_id} className="flex flex-wrap items-baseline gap-2 text-sm">
                  <span
                    className="w-2 h-2 rounded-full shrink-0"
                    style={{ backgroundColor: strandColor(b.strand) }}
                    aria-hidden
                  />
                  {b.known ? (
                    <Link
                      href={`/artists/${b.artist_id}`}
                      className="text-neutral-200 hover:text-emerald-300 transition-colors"
                    >
                      {b.name}
                    </Link>
                  ) : (
                    <span className="text-neutral-400">{b.artist_id}</span>
                  )}
                  {b.known ? (
                    <Link
                      href={`/genres/${strandSlug(b.strand)}`}
                      className="text-xs text-neutral-500 hover:text-neutral-300 transition-colors"
                    >
                      {b.strand}
                    </Link>
                  ) : null}
                  {b.billing ? (
                    <span className="text-xs text-neutral-600">{b.billing}</span>
                  ) : null}
                </li>
              ))}
            </ul>
          )}
        </section>

        {concert.estimated_attendance ? (
          <section>
            <h2 className="text-lg font-semibold">Attendance</h2>
            <p className="mt-2 text-sm text-neutral-300">
              {concert.estimated_attendance.toLocaleString()}
              <span className="text-neutral-500">
                {" "}
                · {concert.attendance_confidence ?? "unknown"} confidence
              </span>
            </p>
          </section>
        ) : null}

        {concert.notes ? (
          <section>
            <h2 className="text-lg font-semibold">Notes</h2>
            <p className="mt-2 text-sm text-neutral-300 leading-relaxed">
              {concert.notes}
            </p>
          </section>
        ) : null}

        {concert.sources?.length ? (
          <section>
            <h2 className="text-lg font-semibold">Sources</h2>
            <ul className="mt-3 space-y-1.5">
              {concert.sources.map((s, i) => (
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
          </section>
        ) : null}

        <p className="text-xs text-neutral-600">
          Record last updated {concert.last_updated || "unrecorded"} ·{" "}
          <a
            href={`https://github.com/smile-plzz/bangladesh-music-evolution/blob/main/data/concerts/${concert.id}.json`}
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
