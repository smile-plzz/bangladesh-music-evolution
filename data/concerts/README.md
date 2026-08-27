# Concert & Event Catalog

Structured event data supporting the BMEM's "Music Experience Culture"
dimension, and the source of the strongest edge layer in the BMPN.

## Status: 23 of a 500 target

| Series / type | Entries |
|---|---:|
| Joy Bangla Concert (2015–2024, 8 editions) | 8 |
| RockNation (2013–2016) | 7 |
| Standalone concerts, anniversaries, album shows | 4 |
| Diaspora tours | 2 |
| Branded platform (Coke Studio Bangla) | 1 |
| Other festival | 1 |

19 of 23 events are in Dhaka. 35 of 63 catalogued artists still have no
documented event.

## Schema

One JSON file per event, validated against `data/schemas/concert.schema.json`.
Filename convention `<year>-<short-descriptor>.json`; use a non-year prefix only
when the date is genuinely unresolved and `date_precision` says so.

`artists[].artist_id` must match an `id` in `data/artists/<id>/metadata.json` —
`analysis/scripts/validate_data.py` fails on a dangling reference. **Acts named
in a source but not catalogued go in `notes`, not in `artists`.** Several
records do this (Tirondaz, Introit, Adverb, Sin, Fuad and Friends on the Joy
Bangla bills); it keeps the information without inventing a profile or breaking
referential integrity.

## Conventions worth following

- **Record an event with no recoverable lineup rather than inferring one.** The
  2016 Joy Bangla Concert has an empty `artists` array and a note saying why.
  Inferring its bill from adjacent years would have produced clean-looking data
  and a false network.
- **Tag honestly.** `needs-verification` for approximate dates or partial bills;
  `snippet-sourced` where the record came from a search summary rather than full
  article text.
- **Registrations are not attendance.** The 2018 edition's 32,000 online
  registrations are recorded as reported demand, not a headcount.

## Collection priorities

Set by where the gaps distort results, not by ease (see
`docs/concert-ecosystem-map.md` §5):

1. **Hip-hop and urban events.** The typology defines an `urban-hiphop-event`
   class and zero events fall into it, across eight catalogued rappers.
2. **University festivals.** One entry, against a circuit the literature and the
   artist records both describe as formative.
3. **Independent indoor gigs.** Three entries; this is where the alternative and
   indie strands actually live.
4. **Ticketed commercial festivals.** Needed to test whether the finding that
   every multi-act bill mixes genre strands holds outside state-adjacent
   programming.
5. **Attendance and pricing**, from ticketing platforms rather than press.
