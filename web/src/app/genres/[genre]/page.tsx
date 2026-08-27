import Link from "next/link";
import { notFound } from "next/navigation";
import { getAllArtists } from "@/lib/data";
import { getStrandMap, getStrandProfile } from "@/lib/analysis";
import { STRANDS, strandColor, strandSlug, strandFromSlug } from "@/lib/strands";
import { Panel, Caveat, CrossLink } from "@/components/ui";

export function generateStaticParams() {
  return STRANDS.map((s) => ({ genre: strandSlug(s) }));
}

export async function generateMetadata({ params }: PageProps<"/genres/[genre]">) {
  const { genre } = await params;
  const strand = strandFromSlug(genre);
  if (!strand) return { title: "Not found · Bangladesh Music Evolution" };
  return {
    title: `${strand} · Bangladesh Music Evolution`,
    description: `Catalogued ${strand} acts, their formation span, cited influences and documented localisation mechanisms.`,
  };
}

const MECHANISM_LABEL: Record<string, string> = {
  bangla_language_choice: "Bangla language choice",
  folk_or_baul_motif: "Folk or Baul motif",
  political_or_social: "Political or social content",
  literary_or_poetic: "Literary or poetic sourcing",
  religious_or_spiritual: "Religious or spiritual",
  urban_vernacular: "Urban vernacular",
};

export default async function GenrePage({ params }: PageProps<"/genres/[genre]">) {
  const { genre } = await params;
  const strand = strandFromSlug(genre);
  if (!strand) notFound();

  const strandMap = getStrandMap();
  const members = getAllArtists()
    .filter((a) => strandMap[a.id] === strand)
    .sort(
      (a, b) =>
        (a.formed_year ?? 9999) - (b.formed_year ?? 9999) ||
        a.name.localeCompare(b.name),
    );

  const { lifecycle, topInfluences, localisation } = getStrandProfile(strand);
  const influences = Object.entries(topInfluences);
  const mechanisms = Object.entries(localisation).sort((a, b) => b[1] - a[1]);
  const maxMech = Math.max(...mechanisms.map(([, n]) => n), 1);

  // The raw genre tags that resolved into this strand, so the computed
  // grouping stays auditable from the page itself.
  const rawTags = [...new Set(members.flatMap((a) => a.genres))].sort();

  const colour = strandColor(strand);

  return (
    <div className="pb-20">
      <header className="mx-auto max-w-5xl px-4 sm:px-6 pt-12">
        <Link
          href="/genres"
          className="text-sm text-neutral-500 hover:text-neutral-300 transition-colors"
        >
          ← All strands
        </Link>
        <h1 className="text-3xl sm:text-4xl font-bold tracking-tight mt-5 flex items-center gap-3">
          <span
            className="w-4 h-4 rounded-full shrink-0"
            style={{ backgroundColor: colour }}
            aria-hidden
          />
          {strand}
        </h1>
        <p className="mt-3 text-neutral-400">
          {members.length} catalogued act{members.length === 1 ? "" : "s"}
          {lifecycle?.first_formation ? (
            <>
              , formed between {lifecycle.first_formation} and{" "}
              {lifecycle.latest_formation}
            </>
          ) : null}
          .
        </p>
      </header>

      <div className="mx-auto max-w-5xl px-4 sm:px-6 mt-8 space-y-10">
        {lifecycle?.first_formation ? (
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              { v: lifecycle.first_formation, l: "First formed" },
              { v: lifecycle.median_formation, l: "Median formation" },
              { v: lifecycle.latest_formation, l: "Latest formed" },
              {
                v:
                  lifecycle.still_active_share !== undefined
                    ? `${Math.round(lifecycle.still_active_share * 100)}%`
                    : "—",
                l: "Still active",
              },
            ].map((s) => (
              <Panel key={s.l} className="p-4">
                <div className="text-2xl font-bold tabular-nums" style={{ color: colour }}>
                  {s.v}
                </div>
                <div className="text-xs text-neutral-500 mt-1">{s.l}</div>
              </Panel>
            ))}
          </div>
        ) : null}

        <div className="grid lg:grid-cols-2 gap-6">
          <section>
            <h2 className="text-lg font-semibold">Cited global influences</h2>
            {influences.length === 0 ? (
              <p className="mt-3 text-sm text-amber-500/80 leading-relaxed">
                No named global act is cited anywhere in this strand — every
                citation here is a tradition label. That absence is itself a
                finding: metal and progressive acts name specific bands while
                pop and folk acts name conventions, and that partly reflects who
                gets interviewed.
              </p>
            ) : (
              <>
                <ul className="mt-4 space-y-2">
                  {influences.map(([name, n]) => (
                    <li key={name} className="flex items-center gap-3 text-sm">
                      <span className="w-40 shrink-0 text-neutral-300">{name}</span>
                      <span className="flex-1 h-2 rounded-full bg-neutral-800 overflow-hidden">
                        <span
                          className="block h-full"
                          style={{
                            width: `${(n / influences[0][1]) * 100}%`,
                            backgroundColor: colour,
                          }}
                        />
                      </span>
                      <span className="w-5 text-right tabular-nums text-neutral-500">
                        {n}
                      </span>
                    </li>
                  ))}
                </ul>
                <p className="mt-3 text-xs text-neutral-500">
                  Counted by distinct citing acts.{" "}
                  <CrossLink href="/influences">
                    Explore the evidence behind each claim
                  </CrossLink>
                  .
                </p>
              </>
            )}
          </section>

          <section>
            <h2 className="text-lg font-semibold">Documented localisation</h2>
            {mechanisms.length === 0 ? (
              <p className="mt-3 text-sm text-neutral-500">
                No adaptation mechanisms documented for this strand yet.
              </p>
            ) : (
              <>
                <ul className="mt-4 space-y-2">
                  {mechanisms.map(([key, n]) => (
                    <li key={key} className="flex items-center gap-3 text-sm">
                      <span className="w-44 shrink-0 text-neutral-300">
                        {MECHANISM_LABEL[key] ?? key.replace(/_/g, " ")}
                      </span>
                      <span className="flex-1 h-2 rounded-full bg-neutral-800 overflow-hidden">
                        <span
                          className="block h-full bg-sky-500/80"
                          style={{ width: `${(n / maxMech) * 100}%` }}
                        />
                      </span>
                      <span className="w-5 text-right tabular-nums text-neutral-500">
                        {n}
                      </span>
                    </li>
                  ))}
                </ul>
                <p className="mt-3 text-xs text-neutral-500">
                  Counts of acts whose records document each mechanism — a
                  measure of how the records were written, not of what the music
                  does.
                </p>
              </>
            )}
          </section>
        </div>

        <section>
          <h2 className="text-lg font-semibold">
            Acts <span className="text-neutral-500 font-normal">· {members.length}</span>
          </h2>
          <div className="mt-4 grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {members.map((a) => (
              <Link
                key={a.id}
                href={`/artists/${a.id}`}
                className="group rounded-lg border border-neutral-800 bg-neutral-900/50 p-4 hover:border-emerald-500/60 transition-colors"
              >
                <div className="font-medium group-hover:text-emerald-300 transition-colors">
                  {a.name}
                </div>
                <div className="text-sm text-neutral-500 mt-1">
                  {a.origin_city || "origin unrecorded"}
                  {a.formed_year ? ` · ${a.formed_year}` : ""}
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
        </section>

        <section>
          <h2 className="text-lg font-semibold">Raw genre tags in this strand</h2>
          <p className="mt-2 text-sm text-neutral-400">
            The tags on these acts&rsquo; records that resolve into {strand}. The
            strand is the analytical unit; these are what the underlying data
            actually says.
          </p>
          <div className="mt-4 flex flex-wrap gap-1.5">
            {rawTags.map((t) => (
              <span
                key={t}
                className="text-xs px-2 py-0.5 rounded-full border border-neutral-800 text-neutral-400"
              >
                {t}
              </span>
            ))}
          </div>
        </section>

        <Caveat>
          {members.length < 5 ? (
            <>
              With only {members.length} catalogued act
              {members.length === 1 ? "" : "s"}, any statement about “this
              strand” is a statement about {members.length === 1 ? "one act" : `those ${members.length} acts`}. Treat
              the figures above as descriptive of the sample, not the country.{" "}
            </>
          ) : null}
          The catalogue was assembled outward from a well-documented metal core,
          which plausibly biases every strand comparison drawn from it. See{" "}
          <CrossLink href="/data">data and methods</CrossLink>.
        </Caveat>
      </div>
    </div>
  );
}
