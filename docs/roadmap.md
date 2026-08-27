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

1. **Re-scoped, 2026-08-27: pursue YouTube Data API v3 access; redirect the
   Spotify plan.** A wider search (`docs/research-landscape-extended.md` §4)
   found that Spotify restricted its Web API on 27 November 2024 and closed
   exactly the endpoints this project needs — Related Artists,
   Recommendations, Audio Features, Audio Analysis — to **new** applications;
   only apps already in extended quota mode before that date keep access.
   Registering fresh credentials will very likely not restore them. YouTube's
   API was not deprecated the same way (10,000 free quota units/day; reading
   a video's statistics costs 1 unit) and is genuinely workable now for a
   bounded, known list of official artist uploads — pursue it first and
   independently. For audio features specifically, redirect to
   AcousticBrainz's archived CC0 dataset (7.5M tracks, shut down Feb 2022 but
   still downloadable) plus open-source feature extraction (Essentia,
   librosa) against source audio if AcousticBrainz coverage of Bangladeshi
   acts proves thin — this is real engineering work, not a credential form,
   and should be scoped as such. See the landscape doc for the full argument
   and a primary-survey alternative for audience-side data that needs no API
   at all.
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

## Added 2026-08-27, from the extended landscape scan

Full argument and sourcing for each in `docs/research-landscape-extended.md`.
Ranked highest-leverage first; items 8–10 need no new data collection.

8. **Add a null-model significance test for the network's headline modularity
   figure.** Modularity maximisation (Louvain or Leiden alike) is known to
   overfit and find "significant" structure even in random graphs (Peixoto,
   2023). Generate degree-preserving random graphs from the observed 63-node
   network and report 0.428 as a z-score or percentile against that
   distribution. Computable today from data already in hand; the single
   highest-value methodological upgrade available to the paper's central
   result.
9. **Switch `analyze_bmpn.py` from Louvain to Leiden** (or run both and
   compare). Louvain can produce badly-connected or disconnected communities
   (Traag et al., 2019); Leiden is a drop-in fix via `leidenalg`.
10. **Add a statistically-validated backbone pass on the `co_billing` layer**
    (Tumminello et al., 2011) — report which co-billing edges survive a
    hypergeometric test against artist/event degree, as a fourth analytical
    pass alongside `observed`/`full`/`co_billing`. Directly tests the paper's
    own suspicion that Lalon Band/Chirkutt's centrality is programming policy
    rather than structure.
11. **Verify and integrate Hossain (2026)** on hip-hop songs/memes in the July
    2024 uprising — the single highest-value literature addition found. Use
    it to fix the hip-hop `political_or_social` documentation artefact
    (paper §7.3) with a citable source.
12. **Add `musicbrainz_id`/`wikidata_id` to artist records** (schema already
    updated; fields are optional and unpopulated) and query setlist.fm's free
    API against the catalogue — may surface diaspora-tour dates manual search
    missed, at no cost.
13. **Design and run a short primary audience survey** (university music
    societies, artist fan groups) as the project's first primary audience-side
    data point — addresses the paper's most-repeated limitation at a cost the
    blocked Spotify APIs cannot match, and needs no institutional API access.
14. **Add a telecom/ringback-tone era to BMEF's temporal-phases table**
    (`frameworks/bmef.md` §3). The current cassette → CD → streaming
    industry narrative skips an intermediate, telecom-mediated monetisation
    era that by regional accounts was Bangladesh's dominant music-revenue
    model through roughly the 2000s–early 2010s.

---

*Last updated: 2026-08-27.*
