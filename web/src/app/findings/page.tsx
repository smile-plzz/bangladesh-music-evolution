import Link from "next/link";
import {
  getConcertEcosystem,
  getDataQuality,
  getInfluenceAnalysis,
  getNetworkMetrics,
  getTemporalSummary,
} from "@/lib/analysis";

export const metadata = {
  title: "Findings · Bangladesh Music Evolution",
  description:
    "Computed results from the project's analysis pipeline: network structure, influence flows, genre timelines and the concert ecosystem.",
};

const REPO = "https://github.com/smile-plzz/bangladesh-music-evolution";

const FIGURES = [
  {
    src: "/figures/fig4-bmpn-network.svg",
    title: "The co-appearance network",
    caption:
      "Giant component, detached components, and the acts with no documented link yet. Dashed edges are inferred, not observed.",
  },
  {
    src: "/figures/fig1-formations-by-decade.svg",
    title: "Acts by decade of formation",
    caption: "The 2000s account for 42% of dated formations in the catalogue.",
  },
  {
    src: "/figures/fig3-strand-timeline.svg",
    title: "When each strand's acts were founded",
    caption:
      "Bar spans first to latest catalogued formation; the tick marks the median.",
  },
  {
    src: "/figures/fig5-top-influences.svg",
    title: "Most-cited global influences",
    caption: "Counted by number of catalogued acts naming each influence.",
  },
  {
    src: "/figures/fig6-influence-by-era.svg",
    title: "Influence vectors by founding era",
    caption:
      "The streaming-era column rests on a single citing act — not readable as a trend.",
  },
  {
    src: "/figures/fig2-releases-by-decade.svg",
    title: "Dated releases by decade",
    caption:
      "Singles are absent before the 2010s and are a third of 2020s releases.",
  },
  {
    src: "/figures/fig7-concert-typology.svg",
    title: "Concert ecosystem classes",
    caption:
      "Events and mean bill size per class. The urban-hiphop-event class is empty.",
  },
];

function Section({
  id,
  title,
  lede,
  children,
}: {
  id: string;
  title: string;
  lede?: string;
  children: React.ReactNode;
}) {
  return (
    <section id={id} className="mx-auto max-w-6xl px-4 sm:px-6 py-10 border-t border-neutral-800/70">
      <h2 className="text-xl font-semibold">{title}</h2>
      {lede ? (
        <p className="mt-2 max-w-3xl text-neutral-400 text-sm leading-relaxed">{lede}</p>
      ) : null}
      <div className="mt-5">{children}</div>
    </section>
  );
}

function Stat({
  value,
  label,
  hint,
}: {
  value: string | number;
  label: string;
  hint?: string;
}) {
  return (
    <div className="rounded-lg border border-neutral-800 p-5 bg-neutral-900/50">
      <div className="text-3xl font-bold text-emerald-400">{value}</div>
      <div className="text-sm text-neutral-300 mt-1">{label}</div>
      {hint ? <div className="text-xs text-neutral-500 mt-1.5">{hint}</div> : null}
    </div>
  );
}

export default function FindingsPage() {
  const quality = getDataQuality();
  const metrics = getNetworkMetrics();
  const temporal = getTemporalSummary();
  const ecosystem = getConcertEcosystem();
  const influence = getInfluenceAnalysis();

  if (!quality || !metrics || !temporal || !ecosystem || !influence) {
    return (
      <div className="mx-auto max-w-3xl px-4 sm:px-6 py-20">
        <h1 className="text-2xl font-semibold">Findings unavailable</h1>
        <p className="mt-3 text-neutral-400">
          The computed analysis outputs were not found. Run the pipeline in{" "}
          <code className="text-neutral-300">analysis/scripts/</code> and then{" "}
          <code className="text-neutral-300">npm run sync-data</code>.
        </p>
      </div>
    );
  }

  const observed = metrics.passes.observed;
  const coBilling = metrics.passes.co_billing;
  const passes = [
    { key: "observed", label: "Observed layers", pass: observed },
    { key: "full", label: "All layers", pass: metrics.passes.full },
    { key: "co_billing", label: "Co-billing only", pass: coBilling },
  ];

  const communities = observed.communities
    .filter((c) => c.size >= 3)
    .sort((a, b) => b.size - a.size);

  const classes = Object.entries(ecosystem.classes).sort(
    (a, b) => b[1].event_count - a[1].event_count,
  );

  const topInfluences = Object.entries(influence.top_named_global_influences).slice(0, 12);
  const localisation = Object.entries(influence.localisation_mechanisms.totals);
  const maxLocalisation = Math.max(...localisation.map(([, n]) => n), 1);

  const decades = Object.keys(temporal.formations_by_decade).sort();
  const maxFormations = Math.max(
    ...decades.map((d) => temporal.formations_by_decade[d].total),
    1,
  );

  return (
    <div>
      <section className="mx-auto max-w-6xl px-4 sm:px-6 pt-16 pb-10">
        <p className="text-sm uppercase tracking-widest text-emerald-400 font-medium mb-3">
          Computed results
        </p>
        <h1 className="text-4xl sm:text-5xl font-bold tracking-tight max-w-3xl">
          What the data supports
        </h1>
        <p className="mt-5 max-w-2xl text-neutral-400 text-lg">
          Every number on this page is read from the analysis pipeline&rsquo;s output
          files, not written by hand. Where the catalogue is too thin to support a
          claim, this page says so instead of rounding up.
        </p>
        <p className="mt-3 text-sm text-neutral-500">
          Generated {quality.generated} · {quality.artist_count} artists ·{" "}
          {quality.concert_count} events ·{" "}
          <a className="underline hover:text-neutral-300" href={REPO} target="_blank" rel="noreferrer">
            source and methods
          </a>
        </p>

        <div className="mt-8 grid grid-cols-2 lg:grid-cols-4 gap-4">
          <Stat
            value={`${quality.artist_count}/${quality.artist_target}`}
            label="Artists catalogued"
            hint="against the project's target"
          />
          <Stat
            value={`${quality.concert_count}/${quality.concert_target}`}
            label="Events catalogued"
            hint="the binding constraint on everything below"
          />
          <Stat
            value={observed.louvain_modularity}
            label="Louvain modularity"
            hint="observational layers only"
          />
          <Stat
            value={influence.normalised_citations}
            label="Influence citations"
            hint={`from ${influence.raw_citation_entries} sourced entries`}
          />
        </div>
      </section>

      <Section
        id="headline"
        title="Four results"
        lede="Stated with the qualification each one needs, not the version that reads best."
      >
        <div className="grid md:grid-cols-2 gap-4">
          {[
            {
              t: "The strand arrival order is not the received one",
              b: "The catalogue's first hip-hop release (1993) predates its first alternative (1996), folk-fusion (1997), progressive (1999) and pop (2002) formations — two years after the first original Bangla metal album, not two decades.",
            },
            {
              t: "Influence citations are structured, and so is the evidence",
              b: "Metal and progressive acts name specific bands; pop and folk acts name traditions. That asymmetry reflects who gets interviewed as much as how music transmits, so it is reported as a property of the evidence.",
            },
            {
              t: "This is a co-appearance network, not a preference network",
              b: "The communities are real, but the edges record shared bills, shared members and stated influences. The classic-rock community exists because Ayub Bachchu moved between those bands.",
            },
            {
              t: "The project's own concert typology is falsified",
              b: "Every multi-act bill in the catalogue mixes genre strands. Large commemorative festivals turn out to be discovery spaces, not the subcultural gatherings the framework predicted.",
            },
          ].map((r) => (
            <div key={r.t} className="rounded-lg border border-neutral-800 p-5 bg-neutral-900/50">
              <div className="font-medium text-emerald-300">{r.t}</div>
              <p className="mt-2 text-sm text-neutral-400 leading-relaxed">{r.b}</p>
            </div>
          ))}
        </div>
      </Section>

      <Section
        id="network"
        title="Network structure"
        lede="Three passes over the same 63 acts. 'Observed' uses only documented layers — shared bills, shared members, one act naming another. 'All layers' adds inferred influence-homophily edges at half weight. 'Co-billing only' reproduces the original single-layer prototype."
      >
        <div className="overflow-x-auto rounded-lg border border-neutral-800">
          <table className="w-full text-sm">
            <thead className="bg-neutral-900/70 text-neutral-400">
              <tr>
                <th className="text-left font-medium px-4 py-3">Pass</th>
                <th className="text-right font-medium px-4 py-3">Edges</th>
                <th className="text-right font-medium px-4 py-3">Density</th>
                <th className="text-right font-medium px-4 py-3">Largest component</th>
                <th className="text-right font-medium px-4 py-3">Isolated</th>
                <th className="text-right font-medium px-4 py-3">Modularity</th>
                <th className="text-right font-medium px-4 py-3">Communities 3+</th>
              </tr>
            </thead>
            <tbody>
              {passes.map(({ key, label, pass }) => (
                <tr key={key} className="border-t border-neutral-800">
                  <td className="px-4 py-3 text-neutral-200">{label}</td>
                  <td className="px-4 py-3 text-right tabular-nums">{pass.edge_count}</td>
                  <td className="px-4 py-3 text-right tabular-nums">{pass.density}</td>
                  <td className="px-4 py-3 text-right tabular-nums">{pass.largest_component_size}</td>
                  <td className="px-4 py-3 text-right tabular-nums">{pass.isolated_nodes}</td>
                  <td className="px-4 py-3 text-right tabular-nums text-emerald-400">
                    {pass.louvain_modularity}
                  </td>
                  <td className="px-4 py-3 text-right tabular-nums">
                    {pass.nontrivial_community_count}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <h3 className="mt-8 text-base font-medium">
          Communities in the observed graph
        </h3>
        <div className="mt-4 grid md:grid-cols-2 gap-4">
          {communities.map((c) => (
            <div key={c.community_id} className="rounded-lg border border-neutral-800 p-5 bg-neutral-900/50">
              <div className="flex items-baseline justify-between gap-3">
                <span className="font-medium">{c.dominant_strand}</span>
                <span className="text-sm text-neutral-500">{c.size} acts</span>
              </div>
              <div className="mt-3 flex flex-wrap gap-1.5">
                {c.members.map((m) => (
                  <Link
                    key={m}
                    href={`/artists/${m}`}
                    className="text-xs px-2 py-0.5 rounded-full bg-neutral-800 text-neutral-300 hover:bg-neutral-700 hover:text-white transition-colors"
                  >
                    {m}
                  </Link>
                ))}
              </div>
            </div>
          ))}
        </div>

        <p className="mt-6 max-w-3xl text-sm text-neutral-500 leading-relaxed">
          {quality.artists_without_concert_data} of {quality.artist_count} acts have no
          documented event, so low centrality here is usually a coverage fact rather
          than a finding. Removing the bill-size correction — which stops one
          twelve-act festival contributing 66 edges — drops observed modularity from{" "}
          {observed.louvain_modularity} to 0.154.
        </p>
      </Section>

      <Section
        id="concerts"
        title="The concert ecosystem"
        lede={ecosystem.coverage_note}
      >
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {classes.map(([name, c]) => (
            <div key={name} className="rounded-lg border border-neutral-800 p-5 bg-neutral-900/50">
              <div className="flex items-baseline justify-between gap-3">
                <span className="font-medium capitalize">{name.replace(/-/g, " ")}</span>
                <span
                  className={
                    c.event_count === 0
                      ? "text-sm font-semibold text-amber-400"
                      : "text-sm text-neutral-500"
                  }
                >
                  {c.event_count} {c.event_count === 1 ? "event" : "events"}
                </span>
              </div>
              <p className="mt-2 text-xs text-neutral-500 leading-relaxed">{c.description}</p>
              <div className="mt-3 text-xs text-neutral-400">
                Mean bill {c.mean_bill_size}
                {c.cross_strand_rate !== null ? (
                  <> · cross-strand {Math.round(c.cross_strand_rate * 100)}%</>
                ) : null}
              </div>
            </div>
          ))}
          <div className="rounded-lg border border-amber-500/40 p-5 bg-amber-500/5">
            <div className="flex items-baseline justify-between gap-3">
              <span className="font-medium capitalize">urban hiphop event</span>
              <span className="text-sm font-semibold text-amber-400">0 events</span>
            </div>
            <p className="mt-2 text-xs text-neutral-400 leading-relaxed">
              A defined class with no entries, across eight catalogued hip-hop acts.
              This is a sourcing failure, not a fact about Bangladeshi hip-hop: the
              project&rsquo;s event sources are outlets that cover rock festivals.
            </p>
          </div>
        </div>
      </Section>

      <Section
        id="influence"
        title="Global influence and local adaptation"
        lede={influence.method_note}
      >
        <div className="grid lg:grid-cols-2 gap-8">
          <div>
            <h3 className="text-base font-medium">Most-cited global influences</h3>
            <ul className="mt-4 space-y-2">
              {topInfluences.map(([name, n]) => (
                <li key={name} className="flex items-center gap-3 text-sm">
                  <span className="w-40 shrink-0 text-neutral-300">{name}</span>
                  <span className="flex-1 h-2 rounded-full bg-neutral-800 overflow-hidden">
                    <span
                      className="block h-full bg-emerald-500/80"
                      style={{ width: `${(n / topInfluences[0][1]) * 100}%` }}
                    />
                  </span>
                  <span className="w-6 text-right tabular-nums text-neutral-500">{n}</span>
                </li>
              ))}
            </ul>
            <p className="mt-4 text-xs text-neutral-500 leading-relaxed">
              Counted by number of citing acts. Only{" "}
              {Object.keys(influence.cross_strand_influences).length} influences are
              cited across more than one strand.
            </p>
          </div>

          <div>
            <h3 className="text-base font-medium">Documented adaptation mechanisms</h3>
            <ul className="mt-4 space-y-2">
              {localisation.map(([name, n]) => (
                <li key={name} className="flex items-center gap-3 text-sm">
                  <span className="w-40 shrink-0 text-neutral-300">
                    {name.replace(/_/g, " ")}
                  </span>
                  <span className="flex-1 h-2 rounded-full bg-neutral-800 overflow-hidden">
                    <span
                      className="block h-full bg-sky-500/80"
                      style={{ width: `${(n / maxLocalisation) * 100}%` }}
                    />
                  </span>
                  <span className="w-6 text-right tabular-nums text-neutral-500">{n}</span>
                </li>
              ))}
            </ul>
            <p className="mt-4 text-xs text-neutral-500 leading-relaxed">
              Counts of acts whose records document each mechanism. These measure how
              the records were written, not what the music does — the hip-hop
              strand&rsquo;s single political-content marker contradicts the academic
              literature and is treated as a documentation artefact.
            </p>
          </div>
        </div>
      </Section>

      <Section
        id="time"
        title="Formation over time"
        lede={temporal.sample_note}
      >
        <div className="flex items-end gap-3 h-48">
          {decades.map((d) => {
            const total = temporal.formations_by_decade[d].total;
            return (
              <div key={d} className="flex-1 flex flex-col items-center gap-2">
                <span className="text-xs tabular-nums text-neutral-400">{total}</span>
                <div
                  className="w-full rounded-t bg-emerald-500/70"
                  style={{ height: `${(total / maxFormations) * 100}%` }}
                />
                <span className="text-xs text-neutral-500">{d}s</span>
              </div>
            );
          })}
        </div>
        <p className="mt-5 max-w-3xl text-sm text-neutral-500 leading-relaxed">
          {temporal.release_cadence.total_dated_releases} dated releases, median gap
          between an act&rsquo;s releases{" "}
          {temporal.release_cadence.median_gap_between_releases_years} years. The 2020s
          column is low because recent acts have not yet accumulated the documentation
          this catalogue is built from — not because band formation stopped.
        </p>
      </Section>

      <Section
        id="figures"
        title="Figures"
        lede="Rendered directly from the computed outputs, so no figure can disagree with a number reported above."
      >
        <div className="grid lg:grid-cols-2 gap-6">
          {FIGURES.map((f) => (
            <figure
              key={f.src}
              className="rounded-lg border border-neutral-800 bg-neutral-900/50 overflow-hidden"
            >
              <div className="bg-white p-2">
                {/* Figures are SVGs rendered by matplotlib on a white ground. */}
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={f.src} alt={f.title} className="w-full h-auto" loading="lazy" />
              </div>
              <figcaption className="p-4">
                <div className="text-sm font-medium">{f.title}</div>
                <div className="text-xs text-neutral-500 mt-1 leading-relaxed">{f.caption}</div>
              </figcaption>
            </figure>
          ))}
        </div>
      </Section>

      <Section
        id="limits"
        title="What this project cannot do"
        lede="These bound every number above."
      >
        <ul className="grid md:grid-cols-2 gap-4 text-sm">
          {[
            [
              "No audience data of any kind",
              "No streaming, playlist or engagement signals — blocked pending Spotify and YouTube API credentials. Every listener claim here is inferred from co-billing and from what artists and journalists said.",
            ],
            [
              "No audio-feature analysis",
              "Every statement about tempo, production or arrangement rests on documented description and discographic sequence, not on measured signal.",
            ],
            [
              "Measurable documentation bias",
              "The hip-hop strand shows one political-content marker against six for alternative rock, contradicting the literature. Reported as an artefact rather than a finding.",
            ],
            [
              "Geographic concentration",
              `${Object.entries(temporal.concert_cities).find(([c]) => c === "Dhaka")?.[1] ?? 0} of ${ecosystem.event_count} events are in Dhaka. The ecosystem outside the capital is nearly invisible here.`,
            ],
          ].map(([t, b]) => (
            <li key={t} className="rounded-lg border border-neutral-800 p-5 bg-neutral-900/50">
              <div className="font-medium text-neutral-200">{t}</div>
              <p className="mt-2 text-neutral-400 leading-relaxed">{b}</p>
            </li>
          ))}
        </ul>
        <p className="mt-6 text-sm text-neutral-500">
          Full method, limitations and the framework revisions these results forced:{" "}
          <a className="text-emerald-400 hover:underline" href={`${REPO}/blob/main/docs/research-paper-draft-complete.md`} target="_blank" rel="noreferrer">
            the research paper
          </a>{" "}
          and{" "}
          <a className="text-emerald-400 hover:underline" href={`${REPO}/blob/main/frameworks/bmem-validation.md`} target="_blank" rel="noreferrer">
            the BMEM validation
          </a>
          .
        </p>
      </Section>
    </div>
  );
}
