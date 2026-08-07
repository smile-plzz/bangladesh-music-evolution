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
- [ ] Concert and festival event database (≥500 target) — 12 entries added (`data/concerts/`), including the 2013–14 RockNation festival series (4 editions, sourced from Wikipedia); large-scale collection still pending
- [ ] Social media and community discussion sampling
- [ ] Artist interview / documentary / review corpus for influence claims

## Phase 3 — Analysis
- [x] Build Bangladesh Music Preference Network (BMPN) — prototype only (`data/networks/bmpn-prototype.json`, generated via `analysis/scripts/build_bmpn_prototype.py`); now 38 edges / 52 nodes (up from 15/52) after adding RockNation festival co-billing data; needs streaming/social data to move beyond concert co-billing
- [x] Community detection and listener ecosystem mapping — connected-components pass only (`data/networks/bmpn-clusters.json`, via `analysis/scripts/build_bmpn_clusters.py`): one 13-artist metal/alt-rock cluster, one 2-artist cluster, 37 isolated nodes. Graph is still too sparse for modularity-based detection (Louvain/Leiden) to be meaningful — revisit once streaming/social edges are added
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
1. Expand the concert/event database beyond the 12 current entries — target BAMBA/university-fest lineups, remaining RockNation editions (5+ more editions ran 2014-2016, including a Sylhet show, not yet individually sourced), and landmark diaspora tours. Specifically source concert data for the 34 still-isolated artists. Verify approximate/unconfirmed venues and dates flagged `needs-verification` (the four new RockNation entries have unconfirmed venues and partial lineups pending fuller sourcing).
2. Collect public Spotify/YouTube signals for core artists and integrate as a second edge type in the BMPN (currently concert-co-billing only).
3. Continue cataloguing artists referenced but not yet substantiated: Kronic, Nigar Sumi (Coke Studio Bangla vocalist), Reborn, and additional contemporary pop/hip-hop acts.
4. Revisit Shohojia and Owned once better sources are found; do not fabricate profiles in the meantime.
5. Modularity-based community detection (e.g. Louvain) remains blocked on graph density — the connected-components pass (`bmpn-clusters.json`) is a placeholder; re-run `analysis/scripts/build_bmpn_clusters.py` as more edges are added and revisit Louvain once the graph is denser.
6. ~~Deepen literature review (full texts of Quader & Redden 2014, Mitra thesis, theoretical sources).~~ Done for this pass — see `docs/literature-review.md`: corrected the Quader & Redden citation (2015, *Cultural Studies* 29(3)), added the companion Quader (2016) Bourdieu paper and source PhD thesis, added Pervez (2012) and Mridha & Begum (2023) for theoretical/historical grounding, and closed the previously-empty Hip-Hop/Rap literature gap (Hasan & Kundu 2021, 2022). Still open: Mitra (2014) thesis full text (Shodhganga record didn't resolve), Autul et al. (2024) full-text extraction (PDF located, needs `poppler`/`pdftotext`), Pervez (2012) venue-name reconciliation, and review of two flagged 2025-2026 hip-hop/uprising pieces.

---

*Last updated: 2026-08-07*
