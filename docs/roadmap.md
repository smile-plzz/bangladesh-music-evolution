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
- [x] Priority artist profiles complete and substantially expanded — **58 artists** catalogued in `data/artists/` (see `data/artists/README.md` for full checklist), spanning founding-era pioneers (Azam Khan, Souls, Feedback, Renaissance, Nova, Winning, Prometheus), the full metal-scene genealogy (Rockstrata → Poizon Green/Stentorian/Vibe/Metal Maze → Artcell/Karnival/De-illumination → Severe Dementia/Trainwreck/Owned), alternative rock (Shironamhin, Aurthohin, Black, Shunno, Chirkutt, Indalo, Shonar Bangla Circus, Yaatri, Shohojia), the full hip-hop lineage from its 1993 genre-origin point through the 2000s pioneer wave to a contemporary act (Ashraf Babu & Charu → Deshi MCs/Uptown Lokolz/Theology of Rap → Stoic Bliss, Muza, Hannan, Jalali Set, Shezan), and folk fusion (Arnob, Lalon Band, Maqsood O' Dhaka). Shohojia and Owned (2026-08-13) were re-investigated and catalogued from sourced biographical data (Last.fm, TBS News, Dhaka Tribune, The Daily Star); "Ashestoangels" was investigated and ruled out as a UK band; Kronic and Reborn remain uncatalogued (name-only mentions, no locatable details).
- [ ] Public streaming and YouTube metrics collection — **blocked: no Spotify/YouTube API credentials available.** Requires the user to register a free developer app (Spotify Web API + YouTube Data API v3) before this can proceed; not something obtainable via web search/scraping alone at the scale needed for reliable metrics.
- [x] Concert / event schema design (`data/schemas/concert.schema.json`)
- [ ] Concert and festival event database (≥500 target) — 15 entries added (`data/concerts/`), including the full 2013–2016 RockNation festival series (7 editions, sourced from Wikipedia, spanning the original Dhaka run through the Sylhet I tour date); large-scale collection still pending
- [ ] Social media and community discussion sampling
- [ ] Artist interview / documentary / review corpus for influence claims

## Phase 3 — Analysis
- [x] Build Bangladesh Music Preference Network (BMPN) — prototype only (`data/networks/bmpn-prototype.json`, generated via `analysis/scripts/build_bmpn_prototype.py`); now 40 edges / 58 nodes (up from 38/52) after adding the remaining three RockNation editions (Revolution of Rock, Resurrection, Sylhet I); needs streaming/social data to move beyond concert co-billing
- [x] Community detection and listener ecosystem mapping — connected-components pass only (`data/networks/bmpn-clusters.json`, via `analysis/scripts/build_bmpn_clusters.py`): one 15-artist metal/alt-rock cluster (up from 13), 43 isolated nodes. Graph is still too sparse for modularity-based detection (Louvain/Leiden) to be meaningful — revisit once streaming/social edges are added
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
1. Expand the concert/event database beyond the 15 current entries — target BAMBA/university-fest lineups and landmark diaspora tours. Specifically source concert data for the 43 still-isolated artists. Verify approximate/unconfirmed venues and dates flagged `needs-verification`.
2. Collect public Spotify/YouTube signals for core artists and integrate as a second edge type in the BMPN (currently concert-co-billing only). **Blocked — no API credentials available in this environment.** Next step is for the user to register Spotify Web API + YouTube Data API v3 developer credentials; until then this stays open.
3. ~~Continue cataloguing artists referenced but not yet substantiated: Kronic, Nigar Sumi (Coke Studio Bangla vocalist), Reborn, and additional contemporary pop/hip-hop acts.~~ Investigated (2026-08-07): Nigar Sumi was already documented as Lalon Band's founder-vocalist (no new profile needed). Kronic and Reborn remain unsubstantiated — only appear in list-form scene round-ups with no locatable members/discography; not fabricated. Added four new, well-sourced hip-hop profiles instead: Ashraf Babu & Charu (`ashraf-babu-charu`, 1993 genre-origin duo), Uptown Lokolz (`uptown-lokolz`, 2005/2008), Theology of Rap (`theology-of-rap`, 2005/2010), and Shezan (`shezan`, contemporary rapper/producer) — 56 artists total, and the Hip-Hop/Rap genre strand now has a documented lineage from 1993 to the present.
4. ~~Revisit Shohojia and Owned once better sources are found.~~ Done (2026-08-13): both catalogued from Last.fm, TBS News, Dhaka Tribune and The Daily Star sourcing — 58 artists total. New research targets surfaced by this pass: Vikings, AvoidRafa, Echoes, Nongar, Psychotron, Rim (all named in RockNation 2014-2016 lineups but not yet catalogued).
5. Modularity-based community detection (e.g. Louvain) remains blocked on graph density — the connected-components pass (`bmpn-clusters.json`) is a placeholder; re-run `analysis/scripts/build_bmpn_clusters.py` as more edges are added and revisit Louvain once the graph is denser.
6. ~~Deepen literature review (full texts of Quader & Redden 2014, Mitra thesis, theoretical sources).~~ Done for this pass — see `docs/literature-review.md`: corrected the Quader & Redden citation (2015, *Cultural Studies* 29(3)), added the companion Quader (2016) Bourdieu paper and source PhD thesis, added Pervez (2012) and Mridha & Begum (2023) for theoretical/historical grounding, and closed the previously-empty Hip-Hop/Rap literature gap (Hasan & Kundu 2021, 2022). Still open: Mitra (2014) thesis full text (Shodhganga record didn't resolve), Autul et al. (2024) full-text extraction (PDF located, needs `poppler`/`pdftotext`), Pervez (2012) venue-name reconciliation, and review of two flagged 2025-2026 hip-hop/uprising pieces.
7. Completed 2026-08-13: sourced and catalogued the remaining three RockNation editions (Revolution of Rock 2014, Resurrection 2015, Sylhet I 2016) — 15 concerts total, BMPN largest cluster now 15 artists (up from 13).

---

*Last updated: 2026-08-13*
