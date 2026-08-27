# Research Roadmap

## Phase 1 — Foundation ✅ complete
- [x] Repository setup and structure
- [x] Full research proposal
- [x] Conceptual frameworks: BMEM (`frameworks/bmem.md`), BMEF (`frameworks/bmef.md`)
- [x] Methodology specified
- [x] Core genres and priority artists listed
- [x] Literature review with verified citations
- [x] Artist and concert metadata schemas
- [x] Draft master historical timeline (1971–present)

## Phase 2 — Data Collection (in progress)
- [x] Historical timeline construction
- [x] **63 artists catalogued**, all schema-validated with zero errors. Spans
      founding-era pioneers, the full metal genealogy, alternative rock, the
      hip-hop lineage from its 1993 origin point, pop, and folk fusion including
      the indigenous all-female band F Minor.
- [x] Concert / event schema
- [x] **23 events catalogued**, including the complete Joy Bangla Concert series
      (2015–2024, 8 editions) and the RockNation series (2013–2016, 7 editions)
- [ ] **Expand the artist catalogue toward 300.** 63/300. Highest-value
      uncollected source: *Banglar Rock Metal* (Haque & Aman), which profiles
      roughly 100 bands chronologically.
- [ ] **Expand the event catalogue toward 500.** 23/500. Priority order, set by
      where the gaps actually distort results (see
      `docs/concert-ecosystem-map.md` §5):
      1. Hip-hop and urban events — the typology defines an
         `urban-hiphop-event` class and **zero** events fall into it, across
         eight catalogued rappers.
      2. University festivals — one entry, against a circuit the literature and
         the artist records both call formative (BUET, IUT, NSU, BRAC, DU).
      3. Independent indoor gigs — three entries; this is where the alternative
         and indie strands actually live.
      4. Ticketed commercial festivals — needed to test whether the
         cross-strand finding holds outside state-adjacent programming.
      5. Attendance and pricing, from ticketing platforms rather than press.
- [ ] Expand discography and release metadata for priority artists
- [ ] **Streaming and YouTube metrics — blocked.** Needs Spotify Web API and
      YouTube Data API v3 credentials, which must be registered by the project
      owner. Not obtainable by search or scraping at the scale required. This
      blocks the preference network, sound-evolution measurement, and the whole
      audience side of the study.
- [ ] Social media and community discussion sampling
- [ ] Artist interview / documentary corpus for influence claims — the single
      best fix for the strand asymmetry documented in the paper §7.2

## Phase 3 — Analysis ✅ pipeline complete, results provisional on data
- [x] **Analysis pipeline built** — seven re-runnable scripts, shared library,
      all figures rendered from computed outputs (`analysis/`)
- [x] **Multi-layer BMPN** — co-billing (bill-size normalised), personnel,
      domestic influence, and inferred influence homophily; 179 edges over 63
      nodes with per-edge provenance
- [x] **Louvain community detection** — modularity 0.428 on observational
      layers, six communities of 3+; supersedes the connected-components
      placeholder
- [x] **Temporal and genre evolution analysis** — formations and releases by
      decade, strand lifecycles, release-format shift
- [x] **Concert ecosystem typology** — rule-based classification with the rule
      recorded per event
- [x] **Influence-flow analysis** — 169 normalised citations, cross-tabs by
      strand and era, localisation-mechanism markers
- [x] **Sound evolution case studies** — five, in `analysis/case-studies/`
- [x] **Visualisations** — seven figures in `analysis/visualizations/`
- [ ] Sentiment / thematic analysis of public discourse — blocked with the
      streaming and social data above
- [ ] Audio-feature extraction for sound evolution — blocked likewise. Every
      current claim about sound rests on documented description, not measurement.

## Phase 4 — Synthesis & Outputs
- [x] **BMEM validation and refinement** (`frameworks/bmem-validation.md`) —
      all six dimensions tested, ten revisions proposed, two dimensions
      corrected outright
- [x] **Genre Evolution Map** (`docs/genre-evolution-map.md`)
- [x] **Concert Ecosystem Map** (`docs/concert-ecosystem-map.md`)
- [x] **Future Trend Forecast** (`docs/future-trends-forecast.md`) — graded by
      evidence, with falsification conditions
- [x] **Annotated bibliography** (`docs/annotated-bibliography.md`)
- [x] **Research paper second draft** carrying computed results
      (`docs/research-paper-draft-complete.md`)
- [x] Open dataset and analysis scripts
- [ ] Convert to thesis chapters or journal format
- [ ] Revision and dissemination

---

## Success criteria: current standing

| Criterion | Target | Now |
|---|---|---|
| Timeline covering 50+ years | ✅ | 1972–2026 |
| Artists catalogued | ≥300 | **63** |
| Concerts analysed | ≥500 | **23** |
| Preference network connecting artists | ✅ built | but it is a *co-appearance* network — see below |
| Statistically meaningful listener ecosystems | — | communities detected at Q = 0.428, but they are co-appearance communities, not listener ones |
| Visual genre evolution map | ✅ | `docs/genre-evolution-map.md` + 7 figures |
| Findings consistent across independent sources | partly | cross-checking network results against the typology and influence analysis is what caught two errors |
| Open dataset, framework, visualisations, thesis | ✅ / draft | thesis at second draft |

**The honest headline:** the framework, pipeline and analytical outputs are
complete and reusable. The dataset is at roughly a fifth of its artist target
and a twentieth of its event target, and the audience-side data the central
construct requires does not exist in this project at all.

## Immediate next actions

1. **Register Spotify Web API and YouTube Data API v3 credentials.** This is the
   one blocker holding back the preference network, sound-evolution measurement,
   sentiment analysis and every audience claim. Nothing else in the plan
   unblocks as much.
2. **Collect hip-hop and urban event data.** An entire typology class is empty
   and eight catalogued acts are effectively invisible to the network. Requires
   no credentials — only sources the press does not cover.
3. **Collect university-festival lineups.** One entry against a formative circuit.
4. **Re-research the hip-hop artist records against lyric and interview
   sources.** The single political-content marker across eight rappers
   contradicts the literature and is a documentation artefact (paper §7.3).
5. **Add `domestic_influences` as a first-class schema field.** Only six
   domestic transmission links exist across 63 acts, and one of those six was
   found only because a missing `also_known_as` alias was noticed — the lookup
   matches on name, so an act filed under a different name than the one
   citations use silently drops out. A structured field would remove the
   failure mode as well as the thinness.
6. **Verify the `snippet-sourced` records against full text.** The eight Joy
   Bangla Concert records and five artist records added in the 2026-08-27 pass
   were sourced from search summaries because the environment blocked page
   retrieval.
7. **Test the metal-recruitment question deliberately.** Heavy metal's latest
   catalogued formation is 2007. Search specifically for post-2007 metal
   formations; if few exist, the closure is real rather than a catalogue artefact.

---

*Last updated: 2026-08-27*
