#!/usr/bin/env python3
"""Concert ecosystem typology and mapping (BMEM Dimension 5).

Classifies every catalogued event into the concert typology set out in
docs/methodology.md and frameworks/bmem.md, using the event's declared type,
venue type, organiser and the BMEM strands of the acts billed on it. The rules
are explicit and ordered so that a classification can be argued with rather
than merely accepted, and every event carries the rule that fired.

Also computes, per typology class: genre mix, mean bill size, cross-strand
billing rate (how often a bill mixes BMEM strands -- the measure of whether a
concert type works as a discovery space or as a subcultural gathering), and
the artists whose live profile is concentrated in that class.

Outputs:
  analysis/outputs/concert-ecosystem.json
  analysis/outputs/concert-classification.csv
"""
import sys
from collections import Counter, defaultdict
from datetime import date
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parents[1] / "lib"))
import common  # noqa: E402

TYPOLOGY_NOTES = {
    "diaspora-tour": "Overseas show for the Bangladeshi diaspora; audience is expatriate and multi-generational.",
    "corporate-branded-platform": "Brand-funded studio or showcase format; high production values, cross-genre pairing by design.",
    "university-festival": "Campus-organised event; student audience, eclectic bill, functions as a discovery space.",
    "metal-rock-festival": "Multi-band rock/metal festival; high-commitment subcultural audience, repeat attendance.",
    "large-open-air-headliner": "Open-air or stadium-scale headline show; broad multi-generational audience, communal/nostalgic.",
    "urban-hiphop-event": "Hip-hop or urban-music event; younger audience, digital-first promotion.",
    "album-launch": "Release-centred show; core fanbase, album performed as an event.",
    "independent-indoor-gig": "Smaller indoor show; dedicated attentive audience, alternative/artistic identity.",
}


def classify(concert, strands):
    """Return (typology class, rule that fired). Rules are ordered."""
    ctype = (concert.get("type") or "").lower()
    venue = concert.get("venue") or {}
    vtype = (venue.get("venue_type") or "").lower()
    country = (venue.get("country") or "Bangladesh")
    organizer = (concert.get("organizer") or "").lower()
    name = (concert.get("name") or "").lower()
    attendance = concert.get("estimated_attendance") or 0

    if ctype == "diaspora-tour" or country not in ("Bangladesh", ""):
        return "diaspora-tour", "event type or venue country is outside Bangladesh"
    if "coke studio" in name or ctype == "corporate-branded":
        return ("corporate-branded-platform",
                "branded studio/showcase format rather than a ticketed concert")
    if ctype == "university-fest" or vtype == "university-campus":
        return "university-festival", "university-organised or campus venue"
    rock_metal = {"Heavy Metal", "Progressive Rock/Metal", "Alternative/Indie",
                  "Mainstream Rock"}
    if ctype == "festival" and strands & rock_metal:
        return ("metal-rock-festival",
                "multi-act festival with a rock/metal bill")
    if strands and strands <= {"Hip-Hop/Rap"}:
        return "urban-hiphop-event", "bill is entirely hip-hop/rap acts"
    if vtype in ("stadium", "open-air", "outdoor-park") or attendance >= 5000:
        return ("large-open-air-headliner",
                "open-air/stadium venue or reported attendance >= 5,000")
    if ctype == "album-launch":
        return "album-launch", "release-centred show"
    return ("independent-indoor-gig",
            "default: indoor/other venue, single or small bill")


def main():
    artists = common.load_artists()
    concerts = common.load_concerts()
    strand_of = {aid: common.genre_strand(a.get("genres"), aid)
                 for aid, a in artists.items()}

    rows = []
    by_class = defaultdict(list)
    artist_class_counts = defaultdict(Counter)

    for c in concerts:
        billed = [e.get("artist_id") for e in (c.get("artists") or [])]
        known = [a for a in billed if a in artists]
        strands = {strand_of[a] for a in known}
        klass, rule = classify(c, strands)
        by_class[klass].append({
            "id": c["id"], "name": c.get("name"), "date": c.get("date"),
            "bill_size": len(billed), "strands": sorted(strands),
            "rule": rule,
        })
        for a in known:
            artist_class_counts[a][klass] += 1
        rows.append([
            c["id"], c.get("name", ""), c.get("date", ""),
            c.get("type", ""), (c.get("venue") or {}).get("venue_type", ""),
            (c.get("venue") or {}).get("city", ""),
            klass, len(billed), len(strands), "|".join(sorted(strands)), rule,
        ])

    common.write_csv(
        common.ANALYSIS_OUT / "concert-classification.csv",
        ["concert_id", "name", "date", "declared_type", "venue_type", "city",
         "typology_class", "bill_size", "strand_count", "strands", "rule"],
        rows)

    classes = {}
    for klass, events in sorted(by_class.items(),
                                key=lambda kv: -len(kv[1])):
        bills = [e["bill_size"] for e in events]
        multi = [e for e in events if e["bill_size"] > 1]
        cross = [e for e in multi if len(e["strands"]) > 1]
        strand_mix = Counter(s for e in events for s in e["strands"])
        classes[klass] = {
            "event_count": len(events),
            "share_of_catalogue": round(len(events) / len(concerts), 3),
            "mean_bill_size": round(sum(bills) / len(bills), 2) if bills else 0,
            "max_bill_size": max(bills) if bills else 0,
            "multi_act_events": len(multi),
            "cross_strand_events": len(cross),
            "cross_strand_rate": (round(len(cross) / len(multi), 2)
                                  if multi else None),
            "strand_mix": dict(strand_mix.most_common()),
            "description": TYPOLOGY_NOTES.get(klass, ""),
            "events": sorted(events, key=lambda e: e["date"] or ""),
        }

    # Which live space does each artist's documented profile sit in?
    artist_profiles = {}
    for aid, counts in sorted(artist_class_counts.items()):
        total = sum(counts.values())
        top, top_n = counts.most_common(1)[0]
        artist_profiles[aid] = {
            "name": artists[aid]["name"],
            "strand": strand_of[aid],
            "documented_events": total,
            "primary_space": top,
            "concentration": round(top_n / total, 2),
            "by_class": dict(counts.most_common()),
        }

    summary = {
        "generated": date.today().isoformat(),
        "description": (
            "Typology classification of every catalogued event against the "
            "concert ecosystem framework in frameworks/bmem.md. Each event "
            "records the rule that classified it. 'cross_strand_rate' is the "
            "share of multi-act bills in a class that mix BMEM genre strands, "
            "and is the operational measure of whether a concert type acts as "
            "a discovery space (high) or a subcultural gathering (low)."
        ),
        "classification_rules_in_order": [
            "diaspora-tour: event type is diaspora-tour, or the venue is outside Bangladesh",
            "corporate-branded-platform: name contains 'Coke Studio' or type is corporate-branded",
            "university-festival: type is university-fest or venue type is university-campus",
            "metal-rock-festival: type is festival and the bill includes a rock/metal strand",
            "urban-hiphop-event: every billed act is hip-hop/rap",
            "large-open-air-headliner: stadium/open-air/park venue, or reported attendance >= 5,000",
            "album-launch: type is album-launch",
            "independent-indoor-gig: default",
        ],
        "event_count": len(concerts),
        "class_count": len(classes),
        "classes": classes,
        "artist_live_profiles": artist_profiles,
        "coverage_note": (
            f"{len(artist_profiles)} of {len(artists)} catalogued artists have "
            "at least one documented event. Typology shares are therefore "
            "shares of the documented sample, which over-represents festivals "
            "and landmark shows because those are the events that get written "
            "about."
        ),
    }
    common.write_json(common.ANALYSIS_OUT / "concert-ecosystem.json", summary)

    print(f"Classified {len(concerts)} events into {len(classes)} typology classes")
    for k, v in classes.items():
        print(f"  {k:28s} {v['event_count']:3d} events  "
              f"mean bill {v['mean_bill_size']:5.2f}  "
              f"cross-strand {v['cross_strand_rate']}")


if __name__ == "__main__":
    main()
