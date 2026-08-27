"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { ChipGroup, ResultCount, SearchInput, SortSelect } from "@/components/FilterBar";
import { STRANDS, strandColor, decadeOf } from "@/lib/strands";

export type ArtistRow = {
  id: string;
  name: string;
  strand: string;
  genres: string[];
  formed_year: number | null;
  disbanded_year: number | null;
  origin_city: string;
  event_count: number;
  influence_count: number;
  tags: string[];
};

const SORTS = [
  { value: "name", label: "Name" },
  { value: "formed-asc", label: "Formed, oldest first" },
  { value: "formed-desc", label: "Formed, newest first" },
  { value: "events", label: "Documented events" },
  { value: "influences", label: "Influence citations" },
];

export default function ArtistExplorer({ artists }: { artists: ArtistRow[] }) {
  const [query, setQuery] = useState("");
  const [strands, setStrands] = useState<string[]>([]);
  const [decades, setDecades] = useState<string[]>([]);
  const [cities, setCities] = useState<string[]>([]);
  const [coverage, setCoverage] = useState<string[]>([]);
  const [sort, setSort] = useState("name");

  const facets = useMemo(() => {
    const count = (get: (a: ArtistRow) => string | null) => {
      const m = new Map<string, number>();
      for (const a of artists) {
        const v = get(a);
        if (v) m.set(v, (m.get(v) ?? 0) + 1);
      }
      return m;
    };
    const strandCounts = count((a) => a.strand);
    const decadeCounts = count((a) => decadeOf(a.formed_year));
    const cityCounts = count((a) => a.origin_city || null);
    return {
      strands: STRANDS.filter((s) => strandCounts.has(s)).map((s) => ({
        value: s as string,
        count: strandCounts.get(s),
      })),
      decades: [...decadeCounts.entries()]
        .sort((a, b) => a[0].localeCompare(b[0]))
        .map(([value, count]) => ({ value, count })),
      cities: [...cityCounts.entries()]
        .sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0]))
        .map(([value, count]) => ({ value, count })),
    };
  }, [artists]);

  const toggle = (
    list: string[],
    setList: (v: string[]) => void,
    value: string,
  ) =>
    setList(
      list.includes(value) ? list.filter((v) => v !== value) : [...list, value],
    );

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    const rows = artists.filter((a) => {
      if (strands.length && !strands.includes(a.strand)) return false;
      const dec = decadeOf(a.formed_year);
      if (decades.length && (!dec || !decades.includes(dec))) return false;
      if (cities.length && !cities.includes(a.origin_city)) return false;
      if (coverage.includes("Has events") && a.event_count === 0) return false;
      if (coverage.includes("No events yet") && a.event_count > 0) return false;
      if (coverage.includes("Still active") && a.disbanded_year) return false;
      if (coverage.includes("Needs verification") &&
          !a.tags.includes("needs-verification")) return false;
      if (!q) return true;
      return (
        a.name.toLowerCase().includes(q) ||
        a.id.includes(q) ||
        a.origin_city.toLowerCase().includes(q) ||
        a.genres.some((g) => g.toLowerCase().includes(q))
      );
    });

    const byName = (a: ArtistRow, b: ArtistRow) => a.name.localeCompare(b.name);
    switch (sort) {
      case "formed-asc":
        return [...rows].sort(
          (a, b) => (a.formed_year ?? 9999) - (b.formed_year ?? 9999) || byName(a, b),
        );
      case "formed-desc":
        return [...rows].sort(
          (a, b) => (b.formed_year ?? -1) - (a.formed_year ?? -1) || byName(a, b),
        );
      case "events":
        return [...rows].sort((a, b) => b.event_count - a.event_count || byName(a, b));
      case "influences":
        return [...rows].sort(
          (a, b) => b.influence_count - a.influence_count || byName(a, b),
        );
      default:
        return [...rows].sort(byName);
    }
  }, [artists, query, strands, decades, cities, coverage, sort]);

  const filtering =
    query !== "" ||
    strands.length > 0 ||
    decades.length > 0 ||
    cities.length > 0 ||
    coverage.length > 0;

  const reset = () => {
    setQuery("");
    setStrands([]);
    setDecades([]);
    setCities([]);
    setCoverage([]);
  };

  return (
    <div className="grid lg:grid-cols-[260px_1fr] gap-8">
      <aside className="space-y-6 lg:sticky lg:top-20 lg:self-start">
        <SearchInput
          value={query}
          onChange={setQuery}
          placeholder="Search name, city, genre…"
        />
        <ChipGroup
          label="Genre strand"
          options={facets.strands}
          active={strands}
          onToggle={(v) => toggle(strands, setStrands, v)}
          colorFor={strandColor}
        />
        <ChipGroup
          label="Formed"
          options={facets.decades}
          active={decades}
          onToggle={(v) => toggle(decades, setDecades, v)}
        />
        <ChipGroup
          label="Origin"
          options={facets.cities}
          active={cities}
          onToggle={(v) => toggle(cities, setCities, v)}
        />
        <ChipGroup
          label="Coverage"
          options={[
            { value: "Has events" },
            { value: "No events yet" },
            { value: "Still active" },
            { value: "Needs verification" },
          ]}
          active={coverage}
          onToggle={(v) => toggle(coverage, setCoverage, v)}
        />
      </aside>

      <div>
        <div className="flex flex-wrap items-center justify-between gap-4 mb-5">
          <ResultCount
            shown={filtered.length}
            total={artists.length}
            noun="artists"
            onReset={reset}
            filtered={filtering}
          />
          <SortSelect value={sort} onChange={setSort} options={SORTS} />
        </div>

        {filtered.length === 0 ? (
          <div className="rounded-lg border border-dashed border-neutral-800 p-10 text-center text-sm text-neutral-500">
            No artists match these filters.
          </div>
        ) : (
          <div className="grid sm:grid-cols-2 xl:grid-cols-3 gap-4">
            {filtered.map((a) => (
              <Link
                key={a.id}
                href={`/artists/${a.id}`}
                className="group rounded-lg border border-neutral-800 p-4 bg-neutral-900/50 hover:border-emerald-500/60 transition-colors"
              >
                <div className="flex items-start gap-2">
                  <span
                    className="mt-1.5 w-2 h-2 rounded-full shrink-0"
                    style={{ backgroundColor: strandColor(a.strand) }}
                    aria-hidden
                  />
                  <div className="min-w-0">
                    <div className="font-medium group-hover:text-emerald-300 transition-colors">
                      {a.name}
                    </div>
                    <div className="text-xs text-neutral-500 mt-0.5">
                      {a.strand}
                    </div>
                  </div>
                </div>
                <div className="text-sm text-neutral-500 mt-3">
                  {a.origin_city || "Origin unrecorded"}
                  {a.formed_year ? ` · ${a.formed_year}` : " · year unrecorded"}
                  {a.disbanded_year ? `–${a.disbanded_year}` : ""}
                </div>
                <div className="flex flex-wrap gap-x-3 gap-y-1 mt-3 text-xs text-neutral-500">
                  <span>
                    {a.event_count === 0 ? (
                      <span className="text-amber-500/80">no events yet</span>
                    ) : (
                      `${a.event_count} event${a.event_count === 1 ? "" : "s"}`
                    )}
                  </span>
                  <span>
                    {a.influence_count} influence
                    {a.influence_count === 1 ? "" : "s"}
                  </span>
                  {a.tags.includes("needs-verification") ? (
                    <span className="text-amber-500/80">needs verification</span>
                  ) : null}
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
