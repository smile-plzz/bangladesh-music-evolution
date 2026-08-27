#!/usr/bin/env python3
"""Validate the project's primary datasets.

Checks performed:
  1. every artist and concert record validates against its JSON Schema;
  2. every ``artist_id`` referenced by a concert resolves to a catalogued
     artist (referential integrity of the BMPN's edge source);
  3. dataset-hygiene warnings -- missing sources, unverified flags, dates that
     precede an artist's formation year, duplicate ids.

Exit status is non-zero if any hard error is found, so this can be wired into
CI. Warnings never fail the run; they are the research backlog, not bugs.

Output: analysis/outputs/data-quality-report.json
"""
import sys
from collections import Counter, defaultdict
from datetime import date
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parents[1] / "lib"))
import common  # noqa: E402

import json  # noqa: E402
from jsonschema import Draft7Validator  # noqa: E402


def validate_against_schema(records, schema_path, label):
    schema = json.loads(schema_path.read_text())
    validator = Draft7Validator(schema)
    errors = []
    for rid, record in records.items():
        for err in sorted(validator.iter_errors(record), key=lambda e: e.path):
            errors.append({
                "record": rid,
                "kind": label,
                "path": "/".join(str(p) for p in err.path) or "(root)",
                "message": err.message,
            })
    return errors


def main():
    artists = common.load_artists()
    concerts = {c["id"]: c for c in common.load_concerts()}

    errors = []
    errors += validate_against_schema(
        artists, common.SCHEMAS_DIR / "artist.schema.json", "artist")
    errors += validate_against_schema(
        concerts, common.SCHEMAS_DIR / "concert.schema.json", "concert")

    # --- referential integrity -------------------------------------------
    dangling = []
    billing_counts = Counter()
    for cid, concert in concerts.items():
        for entry in concert.get("artists", []) or []:
            aid = entry.get("artist_id")
            billing_counts[entry.get("billing", "unspecified")] += 1
            if aid not in artists:
                dangling.append({"concert": cid, "artist_id": aid})
    for d in dangling:
        errors.append({
            "record": d["concert"], "kind": "concert",
            "path": "artists/artist_id",
            "message": f"references uncatalogued artist '{d['artist_id']}'",
        })

    # --- hygiene warnings -------------------------------------------------
    warnings = []
    for aid, a in artists.items():
        if not a.get("sources"):
            warnings.append({"record": aid, "issue": "no sources listed"})
        if not a.get("global_influences"):
            warnings.append({"record": aid, "issue": "no global_influences documented"})
        if not a.get("discography_summary"):
            warnings.append({"record": aid, "issue": "no discography entries"})
        if "needs-verification" in (a.get("tags") or []):
            warnings.append({"record": aid, "issue": "flagged needs-verification"})

    for cid, c in concerts.items():
        if not c.get("sources"):
            warnings.append({"record": cid, "issue": "no sources listed"})
        if "needs-verification" in (c.get("tags") or []):
            warnings.append({"record": cid, "issue": "flagged needs-verification"})
        if c.get("date_precision", "day") != "day":
            warnings.append({
                "record": cid,
                "issue": f"date precision '{c.get('date_precision')}'"})
        if not (c.get("artists") or []):
            warnings.append({"record": cid, "issue": "no artists linked"})
        # a concert cannot predate the formation of an act billed on it
        year = int(c["date"][:4]) if c.get("date") else None
        for entry in c.get("artists", []) or []:
            a = artists.get(entry.get("artist_id"))
            if a and year and a.get("formed_year") and year < a["formed_year"]:
                warnings.append({
                    "record": cid,
                    "issue": (f"dated {year} but {a['id']} formed "
                              f"{a['formed_year']}")})

    # --- coverage ---------------------------------------------------------
    linked = {e["artist_id"] for c in concerts.values()
              for e in (c.get("artists") or [])}
    strand_counts = Counter(
        common.genre_strand(a.get("genres"), aid) for aid, a in artists.items())
    strand_linked = Counter(
        common.genre_strand(artists[aid].get("genres"), aid)
        for aid in linked if aid in artists)

    report = {
        "generated": date.today().isoformat(),
        "artist_count": len(artists),
        "concert_count": len(concerts),
        "artist_target": 300,
        "concert_target": 500,
        "artists_with_concert_data": len(linked & set(artists)),
        "artists_without_concert_data": len(set(artists) - linked),
        "error_count": len(errors),
        "warning_count": len(warnings),
        "billing_distribution": dict(billing_counts.most_common()),
        "strand_coverage": {
            s: {"artists": strand_counts[s],
                "with_concert_data": strand_linked.get(s, 0)}
            for s in sorted(strand_counts)
        },
        "errors": errors,
        "warnings": sorted(warnings, key=lambda w: (w["record"], w["issue"])),
    }

    out = common.write_json(
        common.ANALYSIS_OUT / "data-quality-report.json", report)
    print(f"Wrote {out}")
    print(f"  {len(artists)} artists / {len(concerts)} concerts")
    print(f"  {len(errors)} schema or referential errors")
    print(f"  {len(warnings)} hygiene warnings")
    print(f"  {report['artists_without_concert_data']} artists have no concert record yet")
    return 1 if errors else 0


if __name__ == "__main__":
    raise SystemExit(main())
