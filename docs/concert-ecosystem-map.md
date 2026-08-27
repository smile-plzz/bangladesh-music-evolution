# Concert Ecosystem Map

The BMEM's fifth dimension treats live performance as the primary site where
listener communities are made rather than merely reached. This document maps
the catalogued events against that framework, using the classification produced
by `analysis/scripts/concert_ecosystem.py`
(`analysis/outputs/concert-ecosystem.json`, `concert-classification.csv`).

**Sample:** 23 events, against a target of 500. Every share below is a share of
the documented sample, and that sample is biased toward events that news
outlets covered — which means festivals and landmark shows, not the weekly gig
economy that actually sustains a scene.

---

## 1. The classification rules

Applied in order; the first rule that fires wins, and every event records which
one did.

1. `diaspora-tour` — event type is diaspora-tour, or the venue is outside Bangladesh
2. `corporate-branded-platform` — Coke Studio Bangla or a declared corporate-branded format
3. `university-festival` — university-organised, or a campus venue
4. `metal-rock-festival` — a multi-act festival whose bill includes a rock/metal strand
5. `urban-hiphop-event` — every billed act is hip-hop/rap
6. `large-open-air-headliner` — stadium/open-air/park venue, or reported attendance ≥ 5,000
7. `album-launch` — release-centred show
8. `independent-indoor-gig` — default

## 2. What the catalogue contains

| Class | Events | Mean bill | Cross-strand rate |
|---|---:|---:|---:|
| metal-rock-festival | 14 | 5.50 | 1.00 |
| independent-indoor-gig | 3 | 1.67 | 1.00 |
| diaspora-tour | 2 | 1.00 | n/a |
| large-open-air-headliner | 2 | 0.50 | n/a |
| university-festival | 1 | 3.00 | 1.00 |
| corporate-branded-platform | 1 | 1.00 | n/a |
| **urban-hiphop-event** | **0** | – | – |

Venue types: stadium 9, other 6, convention centre 3, theatre 2, university
campus 1, outdoor park 1, open-air 1. Cities: Dhaka 19, and one each for
Chattogram, Sylhet, New York and London.

## 3. Four things the classification shows

### 3.1 Every multi-act bill in the catalogue mixes genre strands

The cross-strand rate is 1.00 in every class where it can be computed. Not one
documented multi-act event in this dataset is single-strand. The 2020 Joy Bangla
Concert put indigenous folk (F Minor), pop (Minar), hard rock (AvoidRafa,
Vikings), alternative (Shunno, Arbovirus, Conclusion, Arekta Rock Band) and
metal (Cryptic Fate) on one stage.

This directly contradicts the typology inherited from the methodology, which
predicted that metal and rock festivals would function as *subcultural
gatherings* with low genre diversity while university festivals would be the
*discovery spaces*. In this catalogue the large festivals are the discovery
spaces. The BMEM should be corrected on this point rather than the data
explained away — see `frameworks/bmem-validation.md`.

One qualification: the catalogue's festivals are disproportionately Joy Bangla
Concert editions, which were programmed by a youth organisation for
broad-audience national commemoration. A dataset of promoter-run metal shows
would very likely look different. The corrected claim is narrower and safer:
*the large commemorative festival is a discovery space; whether the commercial
metal festival is one remains untested.*

### 3.2 The hip-hop class is empty

The typology defines `urban-hiphop-event` and no event in the catalogue
qualifies. Eight hip-hop acts, one documented event between them. This is a
sourcing failure, not a fact about Bangladeshi hip-hop — see
`analysis/case-studies/hip-hop-lineage.md`.

### 3.3 The live circuit is a Dhaka circuit, and it moved

19 of 23 events are in Dhaka. The exceptions are informative: a 2016 RockNation
tour date in Sylhet, Bay of Bengal (a Chattogram band) opening the 2019 Joy
Bangla Concert in Dhaka, and the 2024 Joy Bangla Concert itself relocating to
Chattogram's MA Aziz Stadium — the first edition held outside the capital.
Three data points is not a trend, but they run in one direction.

### 3.4 The largest documented demand figure is for a free event

More than 32,000 online registrations for the 2018 Joy Bangla Concert, which
charged no admission. The only other quantified events in the catalogue are
diaspora shows. The catalogue therefore contains no reliable evidence about
what Bangladeshi audiences *pay* for live music — a gap that ticketing-platform
data would close and news coverage will not.

## 4. Live-space profiles

`artist_live_profiles` in the JSON records which class each act's documented
events fall into. In the current sample almost every profile resolves to
`metal-rock-festival`, because that is what the catalogue mostly contains. This
measure will only become informative once the other classes are populated; it
is built and reported now so the shape is in place, not because the present
values mean much.

The acts with the widest live footprint are Artcell (10 events across four
classes), Cryptic Fate (9), Nemesis (8) and Warfaze (8).

## 5. Priorities for closing the map

1. **Hip-hop and urban events** — an entire defined class with zero entries.
2. **University festivals** — one entry, against a circuit that the literature
   and the artist records both describe as formative. BUET, IUT, NSU, BRAC and
   Dhaka University fest lineups are the target.
3. **Independent indoor gigs** — three entries. This is the class where the
   alternative and indie strands actually live, and it is nearly invisible.
4. **Ticketed commercial festivals** — needed to test whether the cross-strand
   finding in 3.1 holds outside state-adjacent programming.
5. **Attendance and pricing** — from ticketing platforms rather than press.
