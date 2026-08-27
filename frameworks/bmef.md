# Bangladesh Music Evolution Framework (BMEF)

BMEM describes the ecosystem as a structure. BMEF is its process companion: it
describes how that structure *changes*, and it specifies what has to be measured
to say that a change happened rather than merely asserting one.

The two are not alternatives. BMEM answers "what is connected to what"; BMEF
answers "what moved, when, and by what mechanism".

---

## 1. Four change mechanisms

The catalogue supports four distinguishable ways the ecosystem changes. Each has
an observable signature, and each is separated here because they are commonly
collapsed into a single vague notion of "evolution".

### M1 · Repertoire substitution
An act keeps its technique and changes what it plays. **Signature:** technical
continuity across a discography break with a change of language, subject or
source material.
**Type case:** Warfaze 1984–1990 (covers of Iron Maiden, Deep Purple) → 1991
(original Bangla material). The riff vocabulary carries over; the repertoire
does not.

### M2 · Personnel transmission
Technique and audience move between acts inside a musician's career.
**Signature:** a shared member name across two artist records.
**Type case:** Ayub Bachchu across Souls, LRB and Nagar Baul — which is the
entire reason the classic mainstream-rock community exists in the network.
15 such edges in the current graph.

### M3 · Programmatic exposure
An audience meets a strand it did not seek out, because a programmer put them on
the same bill or the same platform.
**Signature:** cross-strand co-billing; measured as the cross-strand rate in
`analysis/outputs/concert-ecosystem.json`, currently 1.00.
**Type case:** F Minor's indigenous folk on the 2020 Joy Bangla Concert bill
between a pop act and a metal act.

### M4 · Format adaptation
The unit of release or consumption changes, and composition follows it.
**Signature:** shifts in release-type distribution and in the gap between
releases.
**Type case:** singles absent from the catalogue before the 2010s, 40% of 2020s
releases; Arekta Rock Band building an audience on singles and releasing its
album at its own show.

## 2. What each mechanism requires as evidence

BMEF's practical purpose is to stop change-claims outrunning their evidence.

| Mechanism | Minimum evidence | Available now? |
|---|---|---|
| M1 Repertoire substitution | Dated discography + documented earlier repertoire | Yes for metal and rock; thin elsewhere |
| M2 Personnel transmission | Member lists with years, across acts | Yes (15 edges), under-recorded |
| M3 Programmatic exposure | Dated bills with full lineups | Yes for festivals; absent for club and hip-hop events |
| M4 Format adaptation | Release types with dates | Yes, with a recency bias |
| — Sonic change | Audio features across releases | **No** — blocked, no streaming credentials |
| — Audience change | Playlist, related-artist or comment data | **No** — blocked, no streaming credentials |

The last two rows are the framework's honest boundary. Any claim in this project
about how a band's *sound* changed, or about how its *audience* changed, rests
on documented description rather than measurement, and is marked as such
wherever it appears.

## 3. Temporal phases

Derived from the catalogue's own formation and release distributions rather than
imposed from the political periodisation.

| Phase | Years | Marker | Dominant mechanism |
|---|---|---|---|
| Foundation | 1972–1983 | 5 catalogued formations; no catalogued releases | M2 |
| Cover-to-original pivot | 1984–1995 | Metal and hip-hop both pivot to original Bangla material (1991, 1993) | M1 |
| Diversification | 1996–2009 | 41 of 62 dated formations; strand count reaches seven | M1 + M2 |
| Platformisation | 2010–2019 | Singles appear; festival circuit peaks (14 catalogued events) | M3 + M4 |
| Institutionalisation | 2020– | Coke Studio Bangla (2022); Warfaze Ekushey Padak (2026); festival decentralises to Chattogram (2024) | M3 + M4 |

The phase boundaries are drawn from the data, so they will move as the
catalogue grows. The 2020– phase in particular rests on a handful of events.

## 4. Using BMEF

For any claim of the form "X changed":

1. Name the mechanism (M1–M4). If none fits, the claim is probably about
   sound or audience, and neither is measurable in this project.
2. Give the signature evidence from the table in §2.
3. State the phase, and check that the claim is not an artefact of the
   catalogue's recency bias — recent decades have better coverage of live
   events and worse coverage of formations.

## 5. Relation to the other constructs

- **BMEM** (`frameworks/bmem.md`) — the structural model BMEF describes change within.
- **BMEM validation** (`frameworks/bmem-validation.md`) — where the structural
  model was tested and, in two dimensions, corrected.
- **BMPN** (`data/networks/`) — the co-appearance network; supplies M2 and M3
  evidence directly.
