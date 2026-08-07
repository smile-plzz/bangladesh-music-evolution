# Artists Catalog

This directory will hold structured metadata and notes on Bangladeshi artists included in the study.

## Target

≥ 300 Bangladeshi artists catalogued (as per success criteria). Current progress: **56 artists** catalogued with full `metadata.json` profiles, all validated against `data/schemas/artist.schema.json`.

## Planned Structure (per artist or group)

```
artist-slug/
├── metadata.json       # name, genres, active years, key members, labels, etc.
├── discography.md     # albums, singles, notable releases with years
├── influences.md      # documented or hypothesized global/local influences (with sources)
├── sound-evolution.md # notes on sonic changes across eras
└── sources.md         # interviews, reviews, Wikipedia, official pages, etc.
```

## Priority Artists for Initial Deep Dives

Status: all originally listed priority artists are catalogued (✅), plus 28 additional artists surfaced during concert/cross-reference research. Two artists — Shohojia and Owned — could not be substantiated from available public sources and remain flagged for further research rather than documented with fabricated data. "Ashestoangels" was investigated and ruled out — it is a UK (Bristol) band, not Bangladeshi, and is not included.

### Mainstream Rock
- [x] James / Nagar Baul (`james-nagar-baul`)
- [x] Miles (`miles`)
- [x] LRB (`lrb`)
- [x] Souls (`souls`)
- [x] Feedback (`feedback`)
- [x] Ark (`ark`)
- [x] Azam Khan & Uchcharon (`azam-khan-uchcharon`) — founding "Pop Guru" figure, predates Souls/Feedback
- [x] Maqsood O' Dhaka (`maqsood-o-dhaka`) — Feedback alumnus, jazz-rock/Baul fusion
- [x] Renaissance (`renaissance`) — Souls alumni, reggae/jazz/soft rock
- [x] Nova (`nova`) — psychedelic/progressive/hard rock
- [x] Winning (`winning`) — notable diaspora (Canada) reformation arc
- [x] Prometheus (`prometheus`) — longest continuously-led band under founder Biplob

### Progressive / Metal
- [x] Artcell (`artcell`)
- [x] Warfaze (`warfaze`)
- [x] Powersurge (`powersurge`)
- [x] Mechanix (`mechanix`)
- [x] Cryptic Fate (`cryptic-fate`)
- [x] Karnival (`karnival`)
- [x] Rockstrata (`rockstrata`) — "big four founder" of Bangladeshi heavy metal
- [x] Stentorian (`stentorian`)
- [x] Vibe (`vibe`) — inactive since 2007
- [x] Arbovirus (`arbovirus`) — nu-metal pioneer, influenced Nemesis and Black
- [x] Metal Maze (`metal-maze`)
- [x] Poizon Green (`poizon-green`) — cites Rockstrata as direct domestic influence
- [x] Severe Dementia (`severe-dementia`) — first death metal record in Bangladesh
- [x] De-illumination (`de-illumination`) — first symphonic rock/metal act in Bangladesh
- [x] Trainwreck (`trainwreck`) — English-language groove metal, Wacken Open Air 2019
- [ ] Owned — not yet substantiated from available public sources

### Alternative / Indie
- [x] Meghdol (`meghdol`)
- [x] Ashes (`ashes`)
- [x] Conclusion (`conclusion`)
- [x] Shironamhin (`shironamhin`) — 25+ years active, philosophical progressive/psychedelic rock
- [x] Aurthohin (`aurthohin`) — funk/jazz-fusion, led by Warfaze alumnus Bassbaba Sumon
- [x] Black (`black`) — introduced grunge to Bangladesh; Tahsan's former band
- [x] Shunno (`shunno`) — "Shono Mohajon" became 2024 uprising anthem
- [x] Chirkutt (`chirkutt`) — female-fronted folk-rock, international touring
- [x] Nemesis (`nemesis`)
- [x] Indalo (`indalo`) — "supergroup" from Black/Aashor/Nemesis alumni
- [x] Shonar Bangla Circus (`shonar-bangla-circus`) — newest act (2018), conceptual psychedelic rock
- [x] Yaatri (`yaatri`) — university-formed, mellow rock
- [ ] Shohojia — not yet substantiated from available public sources

### Pop
- [x] Habib Wahid (`habib-wahid`)
- [x] Tahsan (`tahsan`)
- [x] Minar Rahman (`minar-rahman`)
- [x] Imran Mahmudul (`imran-mahmudul`)
- [x] Nancy (`nancy`)
- [x] Kona (`kona`)

### Hip-Hop
- [x] Stoic Bliss (`stoic-bliss`)
- [x] Muza (`muza`)
- [x] Hannan (`hannan`) — profile concentrated on 2024 breakthrough; earlier career history unverified
- [x] Jalali Set (`jalali-set`)
- [x] Deshi MCs (`deshi-mcs`) — pioneers of Bangla gangsta rap; MC Mugz later co-founded Jalali Set
- [x] Ashraf Babu & Charu (`ashraf-babu-charu`) — released *Tri-Rotner Khepa* (1993), the first Bengali-language rap album, a full decade before the 2000s hip-hop wave; sourcing thin beyond the two 1993 releases, flagged `needs-verification`
- [x] Shezan (`shezan`) — contemporary rapper/producer (Narayanganj), Killaz Kulture/Wrong Side collectives, collaborates with Hannan
- [x] Uptown Lokolz (`uptown-lokolz`) — 2005-formed, colloquial-Bangla street rap; debut *Kahini Scene Paat* (2008) and "Ai Mama Ai"
- [x] Theology of Rap / T.O.R. (`theology-of-rap`) — 2005-formed; *Hip-Hop Jati* (2010); also functioned as scene organisers hosting concerts for upcoming rappers; member Grand T credited as first Bangladeshi rapper to pursue international collaboration (2009)

### Folk / Fusion
- [x] Arnob (`arnob`)
- [x] Lalon Band (`lalon-band`) — explicitly mission-driven Baul/Lalon Shah reinterpretation, UN Headquarters performance
- Coke Studio Bangla documented as a platform note in `data/genres/genre-overview.md` rather than an artist entry (not a single artist/band)

Additional artists will be added iteratively based on network analysis, streaming visibility, and historical significance. Next candidates surfaced but not yet catalogued (insufficient sourcing so far): Kronic and Reborn — both turn up only as names in list-form band-scene round-ups (e.g. a blogspot history piece grouping them with Black, Artcell, Poizon Green, Scarecrow, Dolchhut, Obscure, Chime, Beduin) with no locatable formation year, members, or discography; do not fabricate profiles until better sources surface. Nigar Sumi was investigated and found to already be documented — she is the founder-vocalist of Lalon Band (`lalon-band`), not a separate artist. Uptown Lokolz and Theology of Rap have since been catalogued (see Hip-Hop section above). No API access is available for Spotify/YouTube streaming-metrics collection (roadmap item 2) — that item is blocked pending the user setting up developer credentials.
