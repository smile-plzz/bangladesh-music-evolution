# Concert & Event Catalog

Structured data on Bangladeshi concerts, festivals, album launches, and diaspora tours, supporting the BMEM's "Music Experience Culture" dimension.

## Target

≥ 500 publicly documented concerts and festivals analyzed (per success criteria).

## Schema

Each event is a single JSON file validated against `data/schemas/concert.schema.json`. File naming convention: `<year-or-slug>-<short-descriptor>.json` (e.g. `2019-artcell-20th-anniversary-iccb.json`). Use a non-year-prefixed slug only when the date is genuinely unresolved and marked `date_precision: "approximate"`.

Each entry links to artists via `artist_id`, which must match the `id` field in the corresponding `data/artists/<id>/metadata.json` file.

## Status

Seeded with 4 illustrative entries (Artcell's 20th-anniversary open-air show, LRB's Madison Square Garden performance, a BAMBA multi-band Eid festival, and a recent Warfaze concert) drawn from priority artists already catalogued. Several entries are flagged `needs-verification` where public sources gave only approximate dates — these should be firmed up against primary sources (event archives, ticketing platforms, contemporaneous press) before being counted toward the ≥500 target.

## Next Steps

1. Expand coverage for each priority artist's major/landmark shows.
2. Add multi-band festival lineups (BAMBA, university fests, corporate-branded festivals) as they surface artists not yet catalogued (e.g. Maqsood O Dhaka, Renaissance, Nemesis, Mechanix, Shironamhin, Jalali Set) — catalogue those artists first via `data/artists/`.
3. Cross-reference ticketing platforms (Shohoz, TicketWala) and Facebook Events for systematic collection once a scraping/collection script is scoped (see `analysis/scripts/`).
4. Feed venue and co-billing data into the Bangladesh Music Preference Network (BMPN) prototype in `data/networks/`.
