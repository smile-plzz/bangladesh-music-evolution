"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { ChipGroup, ResultCount, SearchInput, SortSelect } from "@/components/FilterBar";
import { STRANDS, strandColor } from "@/lib/strands";

export type ConcertRow = {
  id: string;
  name: string;
  date: string;
  year: number | null;
  city: string;
  venue: string;
  venueType: string;
  organizer: string;
  typology: string;
  strands: string[];
  billSize: number;
  billed: { id: string; name: string; strand: string; billing: string }[];
  tags: string[];
};

const SORTS = [
  { value: "date-desc", label: "Date, newest first" },
  { value: "date-asc", label: "Date, oldest first" },
  { value: "bill", label: "Bill size" },
  { value: "name", label: "Name" },
];

function label(klass: string) {
  return klass.replace(/-/g, " ");
}

export default function ConcertExplorer({ concerts }: { concerts: ConcertRow[] }) {
  const [query, setQuery] = useState("");
  const [classes, setClasses] = useState<string[]>([]);
  const [cities, setCities] = useState<string[]>([]);
  const [decades, setDecades] = useState<string[]>([]);
  const [strands, setStrands] = useState<string[]>([]);
  const [sort, setSort] = useState("date-desc");

  const facets = useMemo(() => {
    const tally = (values: string[]) => {
      const m = new Map<string, number>();
      for (const v of values) if (v) m.set(v, (m.get(v) ?? 0) + 1);
      return m;
    };
    const classCounts = tally(concerts.map((c) => c.typology));
    const cityCounts = tally(concerts.map((c) => c.city));
    const decadeCounts = tally(
      concerts.map((c) => (c.year ? `${Math.floor(c.year / 10) * 10}s` : "")),
    );
    const strandCounts = tally(concerts.flatMap((c) => c.strands));
    return {
      classes: [...classCounts.entries()]
        .sort((a, b) => b[1] - a[1])
        .map(([value, count]) => ({ value, count })),
      cities: [...cityCounts.entries()]
        .sort((a, b) => b[1] - a[1])
        .map(([value, count]) => ({ value, count })),
      decades: [...decadeCounts.entries()]
        .sort((a, b) => a[0].localeCompare(b[0]))
        .map(([value, count]) => ({ value, count })),
      strands: STRANDS.filter((s) => strandCounts.has(s)).map((s) => ({
        value: s as string,
        count: strandCounts.get(s),
      })),
    };
  }, [concerts]);

  const toggle = (list: string[], set: (v: string[]) => void, v: string) =>
    set(list.includes(v) ? list.filter((x) => x !== v) : [...list, v]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    const rows = concerts.filter((c) => {
      if (classes.length && !classes.includes(c.typology)) return false;
      if (cities.length && !cities.includes(c.city)) return false;
      const dec = c.year ? `${Math.floor(c.year / 10) * 10}s` : "";
      if (decades.length && !decades.includes(dec)) return false;
      if (strands.length && !c.strands.some((s) => strands.includes(s)))
        return false;
      if (!q) return true;
      return (
        c.name.toLowerCase().includes(q) ||
        c.venue.toLowerCase().includes(q) ||
        c.city.toLowerCase().includes(q) ||
        c.organizer.toLowerCase().includes(q) ||
        c.billed.some((b) => b.name.toLowerCase().includes(q))
      );
    });
    switch (sort) {
      case "date-asc":
        return [...rows].sort((a, b) => a.date.localeCompare(b.date));
      case "bill":
        return [...rows].sort((a, b) => b.billSize - a.billSize);
      case "name":
        return [...rows].sort((a, b) => a.name.localeCompare(b.name));
      default:
        return [...rows].sort((a, b) => b.date.localeCompare(a.date));
    }
  }, [concerts, query, classes, cities, decades, strands, sort]);

  const filtering =
    query !== "" ||
    classes.length > 0 ||
    cities.length > 0 ||
    decades.length > 0 ||
    strands.length > 0;

  const reset = () => {
    setQuery("");
    setClasses([]);
    setCities([]);
    setDecades([]);
    setStrands([]);
  };

  return (
    <div className="grid lg:grid-cols-[260px_1fr] gap-8">
      <aside className="space-y-6 lg:sticky lg:top-20 lg:self-start">
        <SearchInput
          value={query}
          onChange={setQuery}
          placeholder="Search event, venue, act…"
        />
        <ChipGroup
          label="Ecosystem class"
          options={facets.classes.map((c) => ({ ...c, value: c.value }))}
          active={classes}
          onToggle={(v) => toggle(classes, setClasses, v)}
        />
        <ChipGroup
          label="Decade"
          options={facets.decades}
          active={decades}
          onToggle={(v) => toggle(decades, setDecades, v)}
        />
        <ChipGroup
          label="City"
          options={facets.cities}
          active={cities}
          onToggle={(v) => toggle(cities, setCities, v)}
        />
        <ChipGroup
          label="Strand on the bill"
          options={facets.strands}
          active={strands}
          onToggle={(v) => toggle(strands, setStrands, v)}
          colorFor={strandColor}
        />
      </aside>

      <div>
        <div className="flex flex-wrap items-center justify-between gap-4 mb-5">
          <ResultCount
            shown={filtered.length}
            total={concerts.length}
            noun="events"
            onReset={reset}
            filtered={filtering}
          />
          <SortSelect value={sort} onChange={setSort} options={SORTS} />
        </div>

        {filtered.length === 0 ? (
          <div className="rounded-lg border border-dashed border-neutral-800 p-10 text-center text-sm text-neutral-500">
            No events match these filters.
          </div>
        ) : (
          <ul className="space-y-3">
            {filtered.map((c) => (
              <li
                key={c.id}
                className="rounded-lg border border-neutral-800 bg-neutral-900/50 p-4 hover:border-emerald-500/50 transition-colors"
              >
                <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1">
                  <Link
                    href={`/concerts/${c.id}`}
                    className="font-medium hover:text-emerald-300 transition-colors"
                  >
                    {c.name}
                  </Link>
                  <span className="text-sm text-neutral-500 tabular-nums">
                    {c.date}
                  </span>
                </div>
                <div className="mt-1 text-sm text-neutral-500">
                  {c.venue}
                  {c.city ? `, ${c.city}` : ""}
                  {c.organizer ? ` · ${c.organizer}` : ""}
                </div>
                <div className="mt-2 flex flex-wrap items-center gap-2 text-xs">
                  <span className="rounded-full border border-neutral-700 px-2 py-0.5 text-neutral-400 capitalize">
                    {label(c.typology)}
                  </span>
                  {c.strands.map((s) => (
                    <span
                      key={s}
                      className="inline-flex items-center gap-1 text-neutral-400"
                    >
                      <span
                        className="w-2 h-2 rounded-full"
                        style={{ backgroundColor: strandColor(s) }}
                        aria-hidden
                      />
                      {s}
                    </span>
                  ))}
                  {c.tags.includes("needs-verification") ? (
                    <span className="text-amber-500/80">needs verification</span>
                  ) : null}
                </div>
                {c.billed.length > 0 ? (
                  <div className="mt-3 flex flex-wrap gap-1.5">
                    {c.billed.map((b) => (
                      <Link
                        key={b.id}
                        href={`/artists/${b.id}`}
                        className="text-xs px-2 py-0.5 rounded-full bg-neutral-800 text-neutral-300 hover:bg-neutral-700 hover:text-white transition-colors"
                        title={b.billing}
                      >
                        {b.name}
                      </Link>
                    ))}
                  </div>
                ) : (
                  <div className="mt-3 text-xs text-amber-500/80">
                    Lineup not recoverable from available sources — recorded as a
                    gap rather than inferred.
                  </div>
                )}
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
