#!/usr/bin/env python3
"""Temporal and genre-evolution analysis over the artist and concert records.

Produces the quantitative backbone for the BMEM's Historical Evolution
dimension:

  * formations per decade, overall and per BMEM strand;
  * strand lifecycle markers -- first formation, median formation, latest
    formation, share of acts still active;
  * releases per decade from the discography summaries, with a release-gap
    measure that shows the cassette-era peak and the digital-era shift from
    albums to singles;
  * concert activity per decade and per venue type.

The catalogue is a curated sample, not a census, so every count here describes
the catalogued sample and is labelled as such in the output.

Outputs:
  analysis/outputs/temporal-summary.json
  analysis/outputs/formations-by-decade.csv
  analysis/outputs/releases-by-decade.csv
"""
import sys
import statistics
from collections import Counter, defaultdict
from datetime import date
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parents[1] / "lib"))
import common  # noqa: E402

STRANDS = common.GENRE_STRANDS
CURRENT_YEAR = date.today().year


def main():
    artists = common.load_artists()
    concerts = common.load_concerts()

    strand_of = {aid: common.genre_strand(a.get("genres"), aid)
                 for aid, a in artists.items()}

    # --- formations -------------------------------------------------------
    formations = defaultdict(Counter)      # decade -> strand -> count
    formation_years = defaultdict(list)    # strand -> [years]
    undated = []
    for aid, a in artists.items():
        year = a.get("formed_year")
        strand = strand_of[aid]
        if not year:
            undated.append(aid)
            continue
        formations[common.decade(year)][strand] += 1
        formation_years[strand].append(year)

    decades = sorted(formations)
    formation_rows = []
    for dec in decades:
        row = [dec] + [formations[dec].get(s, 0) for s in STRANDS]
        row.append(sum(formations[dec].values()))
        formation_rows.append(row)
    common.write_csv(
        common.ANALYSIS_OUT / "formations-by-decade.csv",
        ["decade"] + STRANDS + ["total"], formation_rows)

    # --- strand lifecycle -------------------------------------------------
    lifecycle = {}
    for strand in STRANDS:
        years = sorted(formation_years.get(strand, []))
        members = [aid for aid in artists if strand_of[aid] == strand]
        active = [aid for aid in members
                  if not artists[aid].get("disbanded_year")]
        if not years:
            lifecycle[strand] = {"catalogued_acts": len(members)}
            continue
        lifecycle[strand] = {
            "catalogued_acts": len(members),
            "first_formation": years[0],
            "median_formation": int(statistics.median(years)),
            "latest_formation": years[-1],
            "formation_span_years": years[-1] - years[0],
            "still_active_share": round(len(active) / len(members), 2),
        }

    # --- releases ---------------------------------------------------------
    releases = defaultdict(Counter)        # decade -> strand -> count
    release_types = defaultdict(Counter)   # decade -> type -> count
    per_artist_releases = {}
    for aid, a in artists.items():
        strand = strand_of[aid]
        years = []
        for rel in (a.get("discography_summary") or []):
            year = rel.get("year")
            if not year:
                continue
            years.append(year)
            releases[common.decade(year)][strand] += 1
            release_types[common.decade(year)][rel.get("type", "unspecified")] += 1
        if years:
            years.sort()
            gaps = [b - a2 for a2, b in zip(years, years[1:])]
            per_artist_releases[aid] = {
                "releases": len(years),
                "first": years[0],
                "last": years[-1],
                "median_gap_years": (round(statistics.median(gaps), 1)
                                     if gaps else None),
            }

    rel_decades = sorted(releases)
    release_rows = []
    for dec in rel_decades:
        row = [dec] + [releases[dec].get(s, 0) for s in STRANDS]
        row.append(sum(releases[dec].values()))
        release_rows.append(row)
    common.write_csv(
        common.ANALYSIS_OUT / "releases-by-decade.csv",
        ["decade"] + STRANDS + ["total"], release_rows)

    gaps = [v["median_gap_years"] for v in per_artist_releases.values()
            if v["median_gap_years"] is not None]

    # --- concerts ---------------------------------------------------------
    concerts_by_decade = Counter()
    venue_types = Counter()
    cities = Counter()
    event_types = Counter()
    for c in concerts:
        if c.get("date"):
            concerts_by_decade[common.decade(int(c["date"][:4]))] += 1
        venue_types[(c.get("venue") or {}).get("venue_type", "unknown")] += 1
        cities[(c.get("venue") or {}).get("city", "unknown")] += 1
        event_types[c.get("type", "unknown")] += 1

    summary = {
        "generated": date.today().isoformat(),
        "sample_note": (
            "All counts describe the catalogued sample "
            f"({len(artists)} artists, {len(concerts)} events), not the "
            "national population of Bangladeshi acts or events. Decade "
            "figures therefore show the shape of the documented record, and "
            "recent decades are better covered than early ones."
        ),
        "artist_count": len(artists),
        "concert_count": len(concerts),
        "artists_without_formation_year": undated,
        "formations_by_decade": {
            str(d): {"total": sum(formations[d].values()),
                     "by_strand": dict(formations[d].most_common())}
            for d in decades
        },
        "strand_lifecycle": lifecycle,
        "releases_by_decade": {
            str(d): {"total": sum(releases[d].values()),
                     "by_strand": dict(releases[d].most_common()),
                     "by_type": dict(release_types[d].most_common())}
            for d in rel_decades
        },
        "release_cadence": {
            "artists_with_dated_releases": len(per_artist_releases),
            "median_gap_between_releases_years": (
                round(statistics.median(gaps), 1) if gaps else None),
            "total_dated_releases": sum(
                v["releases"] for v in per_artist_releases.values()),
        },
        "concerts_by_decade": {str(d): n for d, n
                               in sorted(concerts_by_decade.items())},
        "concert_venue_types": dict(venue_types.most_common()),
        "concert_cities": dict(cities.most_common()),
        "concert_event_types": dict(event_types.most_common()),
    }

    common.write_json(common.ANALYSIS_OUT / "temporal-summary.json", summary)
    print(f"Formations across {len(decades)} decades; "
          f"{summary['release_cadence']['total_dated_releases']} dated releases; "
          f"{len(concerts)} events")
    for d in decades:
        print(f"  {d}s: {sum(formations[d].values()):2d} formations, "
              f"{sum(releases[d].values()):2d} releases, "
              f"{concerts_by_decade.get(d, 0):2d} events")


if __name__ == "__main__":
    main()
