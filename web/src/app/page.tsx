import Link from "next/link";
import { getAllArtists, getAllConcerts } from "@/lib/data";
import {
  getDataQuality,
  getInfluenceAnalysis,
  getNetworkMetrics,
} from "@/lib/analysis";
import { STRANDS, strandColor } from "@/lib/strands";
import { getStrandMap } from "@/lib/analysis";

const ENTRY_POINTS = [
  {
    href: "/artists",
    title: "Artists",
    body: "Every catalogued act, filterable by genre strand, decade, city and how well documented it is.",
  },
  {
    href: "/network",
    title: "The network",
    body: "Who shared a stage, who shared a member, who named whom. Switch each kind of evidence on and off.",
  },
  {
    href: "/influences",
    title: "Influences",
    body: "Which global acts and traditions Bangladeshi musicians cite — with the evidence and stated confidence behind each claim.",
  },
  {
    href: "/timeline",
    title: "Timeline",
    body: "Fifty years by decade: formations, releases and documented shows, with the acts behind each bar.",
  },
  {
    href: "/concerts",
    title: "Concerts",
    body: "Documented events classified against the concert-ecosystem framework by an explicit rule.",
  },
  {
    href: "/findings",
    title: "Findings",
    body: "What the data supports, stated with the qualification each result needs.",
  },
];

export default function Home() {
  const artists = getAllArtists();
  const concerts = getAllConcerts();
  const quality = getDataQuality();
  const metrics = getNetworkMetrics();
  const influence = getInfluenceAnalysis();
  const strandMap = getStrandMap();

  const observed = metrics?.passes.observed;

  const strandCounts = STRANDS.map((s) => ({
    strand: s as string,
    count: artists.filter((a) => strandMap[a.id] === s).length,
  })).filter((s) => s.count > 0);
  const maxStrand = Math.max(...strandCounts.map((s) => s.count), 1);

  const stats = [
    { label: "Artists catalogued", value: artists.length, sub: "of a 300 target" },
    { label: "Events documented", value: concerts.length, sub: "of a 500 target" },
    {
      label: "Network edges",
      value: observed?.edge_count ?? 0,
      sub: "observational layers",
    },
    {
      label: "Influence citations",
      value: influence?.normalised_citations ?? 0,
      sub: "all with a named source",
    },
  ];

  return (
    <div>
      <section className="mx-auto max-w-6xl px-4 sm:px-6 pt-16 pb-10">
        <p className="text-sm uppercase tracking-widest text-emerald-400 font-medium mb-3">
          From Folk Roots to Digital Streams
        </p>
        <h1 className="text-4xl sm:text-5xl font-bold tracking-tight max-w-3xl">
          The evolution of Bangladeshi music culture
        </h1>
        <p className="mt-5 max-w-2xl text-neutral-400 text-lg leading-relaxed">
          An open dataset and a computational study of how Bangladesh&rsquo;s
          popular music changed between 1972 and today — genres, global
          influences, live culture and the industry around them. Every number
          here is generated from the data, and where the data can&rsquo;t support
          a claim, the site says so.
        </p>
        <div className="mt-8 flex flex-wrap gap-3">
          <Link
            href="/findings"
            className="px-5 py-2.5 rounded-md bg-emerald-500 text-neutral-950 font-medium hover:bg-emerald-400 transition-colors"
          >
            See the findings
          </Link>
          <Link
            href="/network"
            className="px-5 py-2.5 rounded-md border border-neutral-700 hover:border-neutral-500 transition-colors"
          >
            Explore the network
          </Link>
          <Link
            href="/data"
            className="px-5 py-2.5 rounded-md border border-neutral-800 text-neutral-400 hover:border-neutral-600 hover:text-neutral-200 transition-colors"
          >
            Download the data
          </Link>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 sm:px-6 py-6">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {stats.map((s) => (
            <div
              key={s.label}
              className="rounded-lg border border-neutral-800 p-5 bg-neutral-900/50"
            >
              <div className="text-3xl font-bold text-emerald-400 tabular-nums">
                {s.value}
              </div>
              <div className="text-sm text-neutral-300 mt-1">{s.label}</div>
              <div className="text-xs text-neutral-500 mt-1">{s.sub}</div>
            </div>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 sm:px-6 py-10">
        <h2 className="text-xl font-semibold">Start anywhere</h2>
        <div className="mt-5 grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {ENTRY_POINTS.map((e) => (
            <Link
              key={e.href}
              href={e.href}
              className="group rounded-lg border border-neutral-800 p-5 bg-neutral-900/50 hover:border-emerald-500/60 transition-colors"
            >
              <div className="font-medium group-hover:text-emerald-300 transition-colors">
                {e.title}
              </div>
              <p className="mt-2 text-sm text-neutral-400 leading-relaxed">
                {e.body}
              </p>
            </Link>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 sm:px-6 py-10">
        <div className="flex items-baseline justify-between gap-4 mb-5">
          <h2 className="text-xl font-semibold">The seven genre strands</h2>
          <Link href="/artists" className="text-sm text-emerald-400 hover:underline">
            Browse artists
          </Link>
        </div>
        <ul className="space-y-2">
          {strandCounts.map((s) => (
            <li key={s.strand}>
              <Link
                href="/artists"
                className="group flex items-center gap-3 text-sm"
              >
                <span className="w-48 shrink-0 text-neutral-300 group-hover:text-emerald-300 transition-colors">
                  {s.strand}
                </span>
                <span className="flex-1 h-2.5 rounded-full bg-neutral-800/70 overflow-hidden">
                  <span
                    className="block h-full rounded-full"
                    style={{
                      width: `${(s.count / maxStrand) * 100}%`,
                      backgroundColor: strandColor(s.strand),
                    }}
                  />
                </span>
                <span className="w-6 text-right tabular-nums text-neutral-500">
                  {s.count}
                </span>
              </Link>
            </li>
          ))}
        </ul>
        <p className="mt-4 max-w-3xl text-xs text-neutral-500 leading-relaxed">
          Folk motifs are documented in 20 of {artists.length} acts across every
          strand — folk functions as a resource the other genres draw on rather
          than as one genre among seven.
        </p>
      </section>

      <section className="mx-auto max-w-6xl px-4 sm:px-6 py-10 pb-20">
        <div className="rounded-lg border border-neutral-800 bg-neutral-900/40 p-6">
          <h2 className="text-lg font-semibold">Before you cite anything here</h2>
          <p className="mt-3 max-w-3xl text-sm text-neutral-400 leading-relaxed">
            The catalogue is a curated sample, not a census —{" "}
            {quality ? quality.artist_count : artists.length} acts against a
            target of 300, {concerts.length} events against 500, and{" "}
            {quality?.artists_without_concert_data ?? 0} acts with no documented
            event at all. There is no streaming, playlist or audience data in
            this project, so the network is a{" "}
            <strong className="text-neutral-200">co-appearance</strong> network
            rather than the preference network the study set out to build.
          </p>
          <div className="mt-4 flex flex-wrap gap-4 text-sm">
            <Link href="/data" className="text-emerald-400 hover:underline">
              What the data covers →
            </Link>
            <Link
              href="/research/frameworks--bmem-validation"
              className="text-emerald-400 hover:underline"
            >
              Where the framework was wrong →
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
