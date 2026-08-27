"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { ChipGroup, SearchInput } from "@/components/FilterBar";
import { strandColor } from "@/lib/strands";

export type Citation = {
  artistId: string;
  artistName: string;
  strand: string;
  confidence: string;
  evidence: string;
  source: string;
  rawCitation: string;
};

export type InfluenceItem = {
  label: string;
  kind: "global_artist" | "tradition";
  citations: Citation[];
  strands: string[];
};

export type ArtistItem = {
  id: string;
  name: string;
  strand: string;
  cites: { label: string; kind: string; confidence: string; evidence: string; source: string }[];
};

const KIND_LABEL: Record<string, string> = {
  global_artist: "Named act",
  tradition: "Tradition",
};

const CONFIDENCE_STYLE: Record<string, string> = {
  high: "text-emerald-400 border-emerald-500/40",
  medium: "text-sky-400 border-sky-500/40",
  low: "text-amber-400 border-amber-500/40",
  hypothesized: "text-neutral-400 border-neutral-600",
};

function ConfidenceTag({ value }: { value: string }) {
  return (
    <span
      className={`rounded-full border px-2 py-0.5 text-[11px] ${
        CONFIDENCE_STYLE[value] ?? CONFIDENCE_STYLE.hypothesized
      }`}
      title="Confidence stated in the artist record"
    >
      {value}
    </span>
  );
}

export default function InfluenceExplorer({
  influences,
  artists,
}: {
  influences: InfluenceItem[];
  artists: ArtistItem[];
}) {
  const [mode, setMode] = useState<"influence" | "artist">("influence");
  const [query, setQuery] = useState("");
  const [kinds, setKinds] = useState<string[]>([]);
  const [selected, setSelected] = useState<string>(
    influences[0]?.label ?? "",
  );
  const [selectedArtist, setSelectedArtist] = useState<string>(
    artists[0]?.id ?? "",
  );

  const filteredInfluences = useMemo(() => {
    const q = query.trim().toLowerCase();
    return influences.filter((i) => {
      if (kinds.length && !kinds.includes(KIND_LABEL[i.kind])) return false;
      if (!q) return true;
      return (
        i.label.toLowerCase().includes(q) ||
        i.citations.some((c) => c.artistName.toLowerCase().includes(q))
      );
    });
  }, [influences, query, kinds]);

  const filteredArtists = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return artists;
    return artists.filter(
      (a) =>
        a.name.toLowerCase().includes(q) ||
        a.cites.some((c) => c.label.toLowerCase().includes(q)),
    );
  }, [artists, query]);

  const current = influences.find((i) => i.label === selected) ?? null;
  const currentArtist = artists.find((a) => a.id === selectedArtist) ?? null;

  return (
    <div>
      <div
        role="tablist"
        aria-label="Direction of exploration"
        className="inline-flex rounded-md border border-neutral-800 p-0.5 mb-6"
      >
        {[
          { key: "influence", label: "By influence" },
          { key: "artist", label: "By artist" },
        ].map((t) => (
          <button
            key={t.key}
            role="tab"
            aria-selected={mode === t.key}
            onClick={() => setMode(t.key as "influence" | "artist")}
            className={`px-3 py-1.5 text-sm rounded transition-colors ${
              mode === t.key
                ? "bg-neutral-800 text-neutral-100"
                : "text-neutral-400 hover:text-neutral-200"
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      <div className="grid lg:grid-cols-[300px_minmax(0,1fr)] gap-8">
        <aside className="min-w-0 space-y-4 lg:sticky lg:top-20 lg:self-start">
          <SearchInput
            value={query}
            onChange={setQuery}
            placeholder={
              mode === "influence" ? "Search influences…" : "Search artists…"
            }
          />
          {mode === "influence" ? (
            <ChipGroup
              label="Kind"
              options={[{ value: "Named act" }, { value: "Tradition" }]}
              active={kinds}
              onToggle={(v) =>
                setKinds(
                  kinds.includes(v) ? kinds.filter((k) => k !== v) : [...kinds, v],
                )
              }
            />
          ) : null}

          <div className="rounded-lg border border-neutral-800 max-h-[26rem] overflow-y-auto">
            {mode === "influence" ? (
              <ul>
                {filteredInfluences.map((i) => (
                  <li key={i.label}>
                    <button
                      onClick={() => setSelected(i.label)}
                      className={`w-full text-left px-3 py-2 text-sm flex items-center justify-between gap-2 border-b border-neutral-800/70 last:border-0 transition-colors ${
                        selected === i.label
                          ? "bg-emerald-500/10 text-emerald-300"
                          : "text-neutral-300 hover:bg-neutral-800/60"
                      }`}
                    >
                      <span className="truncate">{i.label}</span>
                      <span className="text-xs text-neutral-500 tabular-nums shrink-0">
                        {i.citations.length}
                      </span>
                    </button>
                  </li>
                ))}
                {filteredInfluences.length === 0 ? (
                  <li className="px-3 py-4 text-sm text-neutral-500">
                    No influences match.
                  </li>
                ) : null}
              </ul>
            ) : (
              <ul>
                {filteredArtists.map((a) => (
                  <li key={a.id}>
                    <button
                      onClick={() => setSelectedArtist(a.id)}
                      className={`w-full text-left px-3 py-2 text-sm flex items-center gap-2 border-b border-neutral-800/70 last:border-0 transition-colors ${
                        selectedArtist === a.id
                          ? "bg-emerald-500/10 text-emerald-300"
                          : "text-neutral-300 hover:bg-neutral-800/60"
                      }`}
                    >
                      <span
                        className="w-2 h-2 rounded-full shrink-0"
                        style={{ backgroundColor: strandColor(a.strand) }}
                        aria-hidden
                      />
                      <span className="truncate flex-1">{a.name}</span>
                      <span className="text-xs text-neutral-500 tabular-nums">
                        {a.cites.length}
                      </span>
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </aside>

        <section aria-live="polite" className="min-w-0">
          {mode === "influence" && current ? (
            <div>
              <div className="flex flex-wrap items-baseline gap-3">
                <h2 className="text-2xl font-semibold">{current.label}</h2>
                <span className="rounded-full border border-neutral-700 px-2 py-0.5 text-xs text-neutral-400">
                  {KIND_LABEL[current.kind]}
                </span>
              </div>
              <p className="mt-2 text-sm text-neutral-400">
                Cited by {current.citations.length} catalogued{" "}
                {current.citations.length === 1 ? "act" : "acts"} across{" "}
                {current.strands.length}{" "}
                {current.strands.length === 1 ? "strand" : "strands"}:{" "}
                {current.strands.join(", ")}.
              </p>

              <ul className="mt-6 space-y-4">
                {current.citations.map((c) => (
                  <li
                    key={`${c.artistId}-${c.rawCitation}`}
                    className="rounded-lg border border-neutral-800 bg-neutral-900/50 p-4"
                  >
                    <div className="flex flex-wrap items-center gap-2">
                      <span
                        className="w-2 h-2 rounded-full"
                        style={{ backgroundColor: strandColor(c.strand) }}
                        aria-hidden
                      />
                      <Link
                        href={`/artists/${c.artistId}`}
                        className="font-medium hover:text-emerald-300 transition-colors"
                      >
                        {c.artistName}
                      </Link>
                      <span className="text-xs text-neutral-500">{c.strand}</span>
                      <ConfidenceTag value={c.confidence} />
                    </div>
                    {c.rawCitation && c.rawCitation !== current.label ? (
                      <div className="mt-2 text-xs text-neutral-500">
                        Cited as “{c.rawCitation}”
                      </div>
                    ) : null}
                    {c.evidence ? (
                      <p className="mt-2 text-sm text-neutral-300 leading-relaxed">
                        {c.evidence}
                      </p>
                    ) : null}
                    {c.source ? (
                      <p className="mt-2 text-xs text-neutral-500">
                        Source: {c.source}
                      </p>
                    ) : null}
                  </li>
                ))}
              </ul>
            </div>
          ) : null}

          {mode === "artist" && currentArtist ? (
            <div>
              <div className="flex flex-wrap items-baseline gap-3">
                <h2 className="text-2xl font-semibold">{currentArtist.name}</h2>
                <span className="text-sm text-neutral-500">
                  {currentArtist.strand}
                </span>
                <Link
                  href={`/artists/${currentArtist.id}`}
                  className="text-sm text-emerald-400 hover:underline"
                >
                  Full profile →
                </Link>
              </div>
              <p className="mt-2 text-sm text-neutral-400">
                {currentArtist.cites.length} normalised influence{" "}
                {currentArtist.cites.length === 1 ? "citation" : "citations"}.
              </p>
              {currentArtist.cites.length === 0 ? (
                <p className="mt-6 text-sm text-amber-500/80">
                  No influences documented for this act yet.
                </p>
              ) : (
                <ul className="mt-6 space-y-4">
                  {currentArtist.cites.map((c, idx) => (
                    <li
                      key={`${c.label}-${idx}`}
                      className="rounded-lg border border-neutral-800 bg-neutral-900/50 p-4"
                    >
                      <div className="flex flex-wrap items-center gap-2">
                        <button
                          onClick={() => {
                            setMode("influence");
                            setSelected(c.label);
                            setQuery("");
                          }}
                          className="font-medium hover:text-emerald-300 transition-colors"
                        >
                          {c.label}
                        </button>
                        <span className="rounded-full border border-neutral-700 px-2 py-0.5 text-[11px] text-neutral-400">
                          {KIND_LABEL[c.kind] ?? c.kind}
                        </span>
                        <ConfidenceTag value={c.confidence} />
                      </div>
                      {c.evidence ? (
                        <p className="mt-2 text-sm text-neutral-300 leading-relaxed">
                          {c.evidence}
                        </p>
                      ) : null}
                      {c.source ? (
                        <p className="mt-2 text-xs text-neutral-500">
                          Source: {c.source}
                        </p>
                      ) : null}
                    </li>
                  ))}
                </ul>
              )}
            </div>
          ) : null}
        </section>
      </div>
    </div>
  );
}
