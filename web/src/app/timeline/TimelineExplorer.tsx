"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { STRANDS, strandColor } from "@/lib/strands";

export type DecadeBucket = {
  decade: string;
  formations: Record<string, number>;
  releases: Record<string, number>;
  events: number;
  formationTotal: number;
  releaseTotal: number;
};

export type TimelineArtist = {
  id: string;
  name: string;
  strand: string;
  formed_year: number;
};

export type TimelineEvent = {
  id: string;
  name: string;
  date: string;
  city: string;
  billSize: number;
};

const METRICS = [
  { key: "formations", label: "Acts formed" },
  { key: "releases", label: "Releases" },
  { key: "events", label: "Documented events" },
] as const;

type MetricKey = (typeof METRICS)[number]["key"];

export default function TimelineExplorer({
  buckets,
  artists,
  events,
}: {
  buckets: DecadeBucket[];
  artists: TimelineArtist[];
  events: TimelineEvent[];
}) {
  const [metric, setMetric] = useState<MetricKey>("formations");
  const [selected, setSelected] = useState<string | null>(null);

  const max = useMemo(() => {
    const values = buckets.map((b) =>
      metric === "formations"
        ? b.formationTotal
        : metric === "releases"
          ? b.releaseTotal
          : b.events,
    );
    return Math.max(...values, 1);
  }, [buckets, metric]);

  const current = buckets.find((b) => b.decade === selected) ?? null;

  const decadeArtists = useMemo(() => {
    if (!current) return [];
    const start = Number(current.decade.slice(0, 4));
    return artists
      .filter((a) => a.formed_year >= start && a.formed_year < start + 10)
      .sort((a, b) => a.formed_year - b.formed_year || a.name.localeCompare(b.name));
  }, [artists, current]);

  const decadeEvents = useMemo(() => {
    if (!current) return [];
    const start = Number(current.decade.slice(0, 4));
    return events
      .filter((e) => {
        const y = Number(e.date.slice(0, 4));
        return y >= start && y < start + 10;
      })
      .sort((a, b) => a.date.localeCompare(b.date));
  }, [events, current]);

  return (
    <div>
      <div className="flex flex-wrap items-center gap-2 mb-6">
        <span className="text-xs uppercase tracking-wider text-neutral-500 mr-1">
          Show
        </span>
        {METRICS.map((m) => (
          <button
            key={m.key}
            onClick={() => setMetric(m.key)}
            aria-pressed={metric === m.key}
            className={`rounded-full border px-3 py-1 text-xs transition-colors ${
              metric === m.key
                ? "border-emerald-500 bg-emerald-500/10 text-emerald-300"
                : "border-neutral-800 text-neutral-400 hover:border-neutral-600 hover:text-neutral-200"
            }`}
          >
            {m.label}
          </button>
        ))}
      </div>

      <div className="rounded-lg border border-neutral-800 bg-neutral-900/40 p-5">
        <div className="flex items-end gap-2 sm:gap-4 h-64">
          {buckets.map((b) => {
            const total =
              metric === "formations"
                ? b.formationTotal
                : metric === "releases"
                  ? b.releaseTotal
                  : b.events;
            const segments =
              metric === "events"
                ? [{ strand: "Unclassified", value: b.events }]
                : STRANDS.map((s) => ({
                    strand: s as string,
                    value:
                      (metric === "formations" ? b.formations : b.releases)[s] ?? 0,
                  })).filter((s) => s.value > 0);
            const on = selected === b.decade;
            return (
              <button
                key={b.decade}
                onClick={() => setSelected(on ? null : b.decade)}
                aria-pressed={on}
                className="group flex-1 flex flex-col items-center gap-2 h-full justify-end"
                title={`${b.decade}: ${total}`}
              >
                <span className="text-xs tabular-nums text-neutral-400">
                  {total}
                </span>
                <span
                  className={`w-full flex flex-col-reverse rounded-t overflow-hidden transition-opacity ${
                    selected && !on ? "opacity-40" : "opacity-100"
                  }`}
                  style={{ height: `${(total / max) * 100}%`, minHeight: total ? 4 : 0 }}
                >
                  {segments.map((s) => (
                    <span
                      key={s.strand}
                      style={{
                        height: `${(s.value / (total || 1)) * 100}%`,
                        backgroundColor:
                          metric === "events" ? "#D55E00" : strandColor(s.strand),
                      }}
                      title={`${s.strand}: ${s.value}`}
                    />
                  ))}
                </span>
                <span
                  className={`text-xs transition-colors ${
                    on ? "text-emerald-300" : "text-neutral-500 group-hover:text-neutral-300"
                  }`}
                >
                  {b.decade}
                </span>
              </button>
            );
          })}
        </div>

        {metric !== "events" ? (
          <div className="mt-5 flex flex-wrap gap-x-4 gap-y-1.5 border-t border-neutral-800 pt-4">
            {STRANDS.map((s) => (
              <span
                key={s}
                className="inline-flex items-center gap-1.5 text-xs text-neutral-400"
              >
                <span
                  className="w-2 h-2 rounded-full"
                  style={{ backgroundColor: strandColor(s) }}
                  aria-hidden
                />
                {s}
              </span>
            ))}
          </div>
        ) : null}
      </div>

      <p className="mt-3 text-xs text-neutral-500">
        {selected
          ? "Click the decade again to clear."
          : "Click a decade to see what happened in it."}
      </p>

      {current ? (
        <div className="mt-8 grid lg:grid-cols-2 gap-6">
          <section className="rounded-lg border border-neutral-800 bg-neutral-900/50 p-5">
            <h3 className="font-medium">
              Acts formed in the {current.decade}
              <span className="text-neutral-500 font-normal">
                {" "}
                · {decadeArtists.length}
              </span>
            </h3>
            {decadeArtists.length === 0 ? (
              <p className="mt-3 text-sm text-neutral-500">
                No catalogued formations in this decade.
              </p>
            ) : (
              <ul className="mt-4 space-y-1.5">
                {decadeArtists.map((a) => (
                  <li key={a.id} className="flex items-center gap-2 text-sm">
                    <span
                      className="w-2 h-2 rounded-full shrink-0"
                      style={{ backgroundColor: strandColor(a.strand) }}
                      aria-hidden
                    />
                    <Link
                      href={`/artists/${a.id}`}
                      className="text-neutral-200 hover:text-emerald-300 transition-colors"
                    >
                      {a.name}
                    </Link>
                    <span className="text-neutral-600 tabular-nums text-xs">
                      {a.formed_year}
                    </span>
                  </li>
                ))}
              </ul>
            )}
          </section>

          <section className="rounded-lg border border-neutral-800 bg-neutral-900/50 p-5">
            <h3 className="font-medium">
              Documented events
              <span className="text-neutral-500 font-normal">
                {" "}
                · {decadeEvents.length}
              </span>
            </h3>
            {decadeEvents.length === 0 ? (
              <p className="mt-3 text-sm text-neutral-500">
                No events documented for this decade. The concert record starts
                in the 2000s — earlier shows happened, they are simply not in the
                catalogue.
              </p>
            ) : (
              <ul className="mt-4 space-y-2">
                {decadeEvents.map((e) => (
                  <li key={e.id} className="text-sm">
                    <Link
                      href={`/concerts/${e.id}`}
                      className="text-neutral-200 hover:text-emerald-300 transition-colors"
                    >
                      {e.name}
                    </Link>
                    <div className="text-xs text-neutral-500">
                      {e.date}
                      {e.city ? ` · ${e.city}` : ""}
                      {e.billSize ? ` · ${e.billSize} acts billed` : ""}
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </section>
        </div>
      ) : null}
    </div>
  );
}
