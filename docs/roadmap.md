# Research Roadmap

## Phase 1 — Foundation (Current)
- [x] Repository setup and structure
- [x] Full research proposal finalized
- [x] Conceptual frameworks (BMEM / BMEF) documented
- [x] Methodology specified
- [x] Core genres and priority artists listed
- [x] Literature review working draft (key academic + secondary sources)
- [x] Artist metadata schema designed
- [x] Initial artist metadata for Artcell and Warfaze
- [x] Draft master historical timeline (1971–present)

## Phase 2 — Data Collection
- [x] Historical timeline construction (first draft complete)
- [ ] Expand discography and release metadata for priority artists
- [x] Priority artist profiles complete and substantially expanded — **52 artists** catalogued in `data/artists/` (see `data/artists/README.md` for full checklist), spanning founding-era pioneers (Azam Khan, Souls, Feedback, Renaissance, Nova, Winning, Prometheus), the full metal-scene genealogy (Rockstrata → Poizon Green/Stentorian/Vibe/Metal Maze → Artcell/Karnival/De-illumination → Severe Dementia/Trainwreck), alternative rock (Shironamhin, Aurthohin, Black, Shunno, Chirkutt, Indalo, Shonar Bangla Circus, Yaatri), hip-hop origins (Deshi MCs, Stoic Bliss, Muza, Hannan, Jalali Set), and folk fusion (Arnob, Lalon Band, Maqsood O' Dhaka). Shohojia and Owned could not be substantiated from available sources and remain open research items; "Ashestoangels" was investigated and ruled out as a UK band.
- [ ] Public streaming and YouTube metrics collection
- [x] Concert / event schema design (`data/schemas/concert.schema.json`)
- [ ] Concert and festival event database (≥500 target) — 8 seed entries added (`data/concerts/`); large-scale collection still pending
- [ ] Social media and community discussion sampling
- [ ] Artist interview / documentary / review corpus for influence claims

## Phase 3 — Analysis
- [x] Build Bangladesh Music Preference Network (BMPN) — prototype only (`data/networks/bmpn-prototype.json`, generated via `analysis/scripts/build_bmpn_prototype.py`); needs streaming/social data to move beyond concert co-billing
- [ ] Community detection and listener ecosystem mapping
- [ ] Sound evolution case studies (Artcell, Meghdol, Warfaze, selected others)
- [ ] Concert ecosystem typology and mapping
- [ ] Temporal and genre evolution visualizations
- [ ] Sentiment / thematic analysis of public discourse

## Phase 4 — Synthesis & Outputs
- [ ] Bangladesh Musical Ecosystem Model (BMEM) validation and refinement
- [ ] Genre Evolution Map
- [ ] Future Trend Forecast
- [ ] Open datasets and notebooks (where permissible)
- [ ] Full thesis / research paper writing
- [ ] Revision and dissemination

## Immediate Next Actions
1. Expand the concert/event database beyond the 8 seed entries — target BAMBA/university-fest lineups and landmark diaspora tours, and specifically source concert data for the ~28 newly catalogued artists (currently 42 of 52 nodes are isolated in the BMPN prototype for lack of concert co-billing data). Verify approximate dates flagged `needs-verification`.
2. Collect public Spotify/YouTube signals for core artists and integrate as a second edge type in the BMPN (currently concert-co-billing only).
3. Continue cataloguing artists referenced but not yet substantiated: Kronic, Nigar Sumi (Coke Studio Bangla vocalist), Reborn, and additional contemporary pop/hip-hop acts.
4. Revisit Shohojia and Owned once better sources are found; do not fabricate profiles in the meantime.
5. Once the graph has more edges, run community detection (e.g. Louvain) to identify listener-ecosystem clusters.
6. Deepen literature review (full texts of Quader & Redden 2014, Mitra thesis, theoretical sources).

---

*Last updated: 2026-08-06*
