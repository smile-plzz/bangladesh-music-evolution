#!/usr/bin/env python3
"""Global influence -> local adaptation analysis (BMEM Dimensions 2 and 3).

Turns the free-text ``global_influences`` citations in the artist records into
a structured bipartite graph (influence source -> Bangladeshi act) and measures:

  * which global acts and traditions are cited most, and by which strand;
  * how citation patterns shift by the citing act's formation era -- the
    empirical test of the project's claim that influence vectors changed from
    classic rock/blues to metal to alternative to hip-hop/electronic;
  * evidence quality: the share of citations backed by a named source and a
    stated confidence level, so influence claims are not treated as uniform;
  * domestic transmission -- catalogued acts citing other catalogued acts;
  * localisation signals, from the ``local_adaptation_notes`` text, counting
    which adaptation mechanisms (language choice, folk motif, literary source,
    political theme) are documented per strand.

Outputs:
  analysis/outputs/influence-analysis.json
  analysis/outputs/influence-citations.csv
  data/networks/influence-network.json
"""
import re
import sys
from collections import Counter, defaultdict
from datetime import date
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parents[1] / "lib"))
import common  # noqa: E402

ERAS = [
    ("Founding era (pre-1985)", None, 1984),
    ("Metal & cassette era (1985-1999)", 1985, 1999),
    ("Digital transition (2000-2009)", 2000, 2009),
    ("Streaming era (2010-)", 2010, None),
]

# Mechanisms of local adaptation, matched against the free-text notes fields.
LOCALISATION_MARKERS = {
    "bangla_language_choice": ("bangla lyric", "in bangla", "bangla-language",
                               "bengali lyric", "wrote in bangla",
                               "bangla vocal", "colloquial bangla"),
    "folk_or_baul_motif": ("folk", "baul", "lalon", "bhawaiya", "bhatiali",
                           "murshidi", "maizbhandari"),
    "literary_or_poetic": ("poet", "literary", "literature", "rabindra",
                           "nazrul", "poetry", "novel"),
    "political_or_social": ("political", "protest", "social commentary",
                            "uprising", "injustice", "liberation",
                            "social issue", "class"),
    "religious_or_spiritual": ("sufi", "spiritual", "mystic", "devotional"),
    "urban_vernacular": ("slang", "code-switch", "street", "dhakaiya",
                         "colloquial", "vernacular"),
}


def era_of(year):
    if not year:
        return "Undated"
    for label, lo, hi in ERAS:
        if (lo is None or year >= lo) and (hi is None or year <= hi):
            return label
    return "Undated"


def main():
    artists = common.load_artists()
    strand_of = {aid: common.genre_strand(a.get("genres"), aid)
                 for aid, a in artists.items()}
    name_to_id = {}
    for aid, a in artists.items():
        name_to_id[a["name"].strip().lower()] = aid
        for alias in (a.get("also_known_as") or []):
            name_to_id[alias.strip().lower()] = aid

    citations = []          # one row per (artist, normalised token)
    by_token = defaultdict(set)
    token_kind = {}
    confidence_counts = Counter()
    sourced = 0
    raw_citation_count = 0
    domestic_links = []

    for aid, a in sorted(artists.items()):
        era = era_of(a.get("formed_year"))
        for infl in (a.get("global_influences") or []):
            raw_citation_count += 1
            conf = infl.get("confidence") or "unstated"
            confidence_counts[conf] += 1
            has_source = bool((infl.get("source") or "").strip())
            if has_source:
                sourced += 1
            for tok, kind in common.split_influence(infl.get("artist_or_genre")):
                canon = common.canonical_influence(tok)
                target = name_to_id.get(canon.lower())
                if target and target != aid:
                    domestic_links.append({
                        "from": aid, "to": target,
                        "confidence": conf,
                        "evidence": (infl.get("evidence") or "")[:400],
                    })
                    continue
                token_kind.setdefault(canon, kind)
                by_token[canon].add(aid)
                citations.append({
                    "artist_id": aid, "artist": a["name"],
                    "strand": strand_of[aid],
                    "formed_year": a.get("formed_year"),
                    "era": era, "influence": canon, "kind": kind,
                    "confidence": conf, "sourced": has_source,
                })

    common.write_csv(
        common.ANALYSIS_OUT / "influence-citations.csv",
        ["artist_id", "artist", "strand", "formed_year", "era", "influence",
         "kind", "confidence", "sourced"],
        [[c["artist_id"], c["artist"], c["strand"], c["formed_year"] or "",
          c["era"], c["influence"], c["kind"], c["confidence"],
          int(c["sourced"])] for c in citations])

    # --- ranking and cross-tabs ------------------------------------------
    named = [c for c in citations if c["kind"] == "global_artist"]
    traditions = [c for c in citations if c["kind"] == "tradition"]

    top_named = Counter(c["influence"] for c in named)
    top_traditions = Counter(c["influence"] for c in traditions)

    by_strand = defaultdict(Counter)
    for c in named:
        by_strand[c["strand"]][c["influence"]] += 1

    by_era = defaultdict(Counter)
    era_totals = Counter()
    for c in named:
        by_era[c["era"]][c["influence"]] += 1
        era_totals[c["era"]] += 1

    # Which influences reach across more than one strand? Those are the
    # vectors that shaped the scene as a whole rather than one genre.
    cross_strand = {}
    for tok, ids in by_token.items():
        if token_kind.get(tok) != "global_artist":
            continue
        strands = Counter(strand_of[i] for i in ids)
        if len(strands) > 1:
            cross_strand[tok] = {
                "citing_acts": len(ids),
                "strands": dict(strands.most_common()),
            }

    # --- localisation mechanisms -----------------------------------------
    localisation = defaultdict(Counter)
    per_artist_mech = {}
    for aid, a in artists.items():
        blob = " ".join(str(a.get(f) or "") for f in (
            "local_adaptation_notes", "sound_evolution_summary",
            "listener_community_notes", "concert_culture_notes")).lower()
        hits = [m for m, keys in LOCALISATION_MARKERS.items()
                if any(k in blob for k in keys)]
        per_artist_mech[aid] = hits
        for m in hits:
            localisation[strand_of[aid]][m] += 1

    mech_totals = Counter()
    for strand_counts in localisation.values():
        mech_totals.update(strand_counts)

    # --- bipartite network file ------------------------------------------
    nodes = [{"id": f"artist:{aid}", "label": artists[aid]["name"],
              "kind": "artist", "strand": strand_of[aid],
              "formed_year": artists[aid].get("formed_year")}
             for aid in sorted(artists)]
    nodes += [{"id": f"influence:{tok}", "label": tok,
               "kind": token_kind[tok], "citing_acts": len(ids)}
              for tok, ids in sorted(by_token.items())]
    edges = [{"source": f"artist:{c['artist_id']}",
              "target": f"influence:{c['influence']}",
              "confidence": c["confidence"], "sourced": c["sourced"]}
             for c in citations]
    edges += [{"source": f"artist:{d['from']}", "target": f"artist:{d['to']}",
               "confidence": d["confidence"], "kind": "domestic_transmission"}
              for d in domestic_links]
    common.write_json(common.NETWORKS_DIR / "influence-network.json", {
        "generated": date.today().isoformat(),
        "description": (
            "Bipartite influence network: catalogued Bangladeshi acts on one "
            "side, the global acts and traditions they cite on the other, plus "
            "domestic act-to-act transmission edges. Built from the "
            "'global_influences' field of the artist records; each edge keeps "
            "the citation's stated confidence and whether a source was named."
        ),
        "node_count": len(nodes),
        "edge_count": len(edges),
        "nodes": nodes,
        "edges": edges,
    })

    summary = {
        "generated": date.today().isoformat(),
        "method_note": (
            "Free-text influence citations were split on '/' and ',', "
            "stripped of parentheticals, and classified as a named global act, "
            "a generic tradition label, or a domestic (catalogued) act. "
            "Counts are of citations in the catalogue, so an influence's rank "
            "reflects how often acts in this sample name it -- not its "
            "measured effect on the music."
        ),
        "artists_analysed": len(artists),
        "raw_citation_entries": raw_citation_count,
        "normalised_citations": len(citations),
        "distinct_named_global_influences": len(top_named),
        "distinct_tradition_labels": len(top_traditions),
        "evidence_quality": {
            "citations_with_named_source": sourced,
            "source_rate": round(sourced / raw_citation_count, 3)
            if raw_citation_count else None,
            "confidence_distribution": dict(confidence_counts.most_common()),
        },
        "top_named_global_influences": dict(top_named.most_common(25)),
        "top_tradition_labels": dict(top_traditions.most_common(15)),
        "named_influences_by_strand": {
            s: dict(c.most_common(8)) for s, c in sorted(by_strand.items())},
        "named_influences_by_formation_era": {
            era: {"citations": era_totals[era],
                  "top": dict(by_era[era].most_common(8))}
            for era in [e[0] for e in ERAS] + ["Undated"] if era in by_era},
        "cross_strand_influences": dict(sorted(
            cross_strand.items(),
            key=lambda kv: -kv[1]["citing_acts"])),
        "domestic_transmission": {
            "edge_count": len(domestic_links),
            "links": domestic_links,
        },
        "localisation_mechanisms": {
            "totals": dict(mech_totals.most_common()),
            "by_strand": {s: dict(c.most_common())
                          for s, c in sorted(localisation.items())},
            "artists_with_no_documented_mechanism": sorted(
                aid for aid, hits in per_artist_mech.items() if not hits),
            "marker_definitions": {k: list(v)
                                   for k, v in LOCALISATION_MARKERS.items()},
        },
    }
    common.write_json(common.ANALYSIS_OUT / "influence-analysis.json", summary)

    print(f"{raw_citation_count} raw citations -> {len(citations)} normalised")
    print(f"  {len(top_named)} distinct named global influences, "
          f"{len(top_traditions)} tradition labels")
    print(f"  source rate {summary['evidence_quality']['source_rate']}")
    print("  top named:", ", ".join(f"{k} ({v})"
                                    for k, v in top_named.most_common(8)))
    print("  localisation mechanisms:", dict(mech_totals.most_common()))


if __name__ == "__main__":
    main()
