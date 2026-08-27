# Artists Catalog

This directory will hold structured metadata and notes on Bangladeshi artists included in the study.

## Target

≥ 300 Bangladeshi artists catalogued (as per success criteria). Current progress: **63 artists** catalogued with full `metadata.json` profiles, all validated against `data/schemas/artist.schema.json` with zero errors (`analysis/scripts/validate_data.py`).

Strand distribution: Alternative/Indie 16, Mainstream Rock 13, Heavy Metal 12, Hip-Hop/Rap 8, Pop 7, Folk & Folk Fusion 5, Progressive Rock/Metal 2. The catalogue was assembled outward from a well-documented metal core, and that construction plausibly biases every strand comparison drawn from it — see `docs/research-paper-draft-complete.md` §6.

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

Status: all originally listed priority artists are catalogued (✅), plus 35 additional artists surfaced during concert and cross-reference research. "Ashestoangels" was investigated and ruled out — it is a UK (Bristol) band, not Bangladeshi, and is not included.

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
- [x] Vikings (`vikings`) — late-1990s Dhaka rock cohort; thinly documented, flagged `needs-verification`
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
- [x] Owned (`owned`) — Dhaka nu-metal/alt-rock act, formed 2007, two self-titled EPs (2014, 2017)
- [x] Bay of Bengal (`bay-of-bengal`) — Chattogram experimental rock/metal (2010), flute- and keyboard-driven; one of the few non-Dhaka acts to reach a national festival bill

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
- [x] Shohojia (`shohojia`) — Dhaka five-piece, second album 'Ghora' (2018); formation year and genre still thinly sourced, flagged `needs-verification`
- [x] AvoidRafa (`avoidrafa`) — formed 2014 at the RockNation: Revolution of Rock bill when Aurthohin could not perform; founder Raef Al Hasan Rafa spent ~15 years in Aurthohin
- [x] Arekta Rock Band (`arekta-rock-band`) — formed 2018 out of the band Hash; singles-first, album released at its own headline show

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
- [x] F Minor (`f-minor`) — launched October 2016; all-female Garo/Marma indigenous folk band. The catalogue's clearest case of *internal* adaptation: a marginal-to-the-mainstream repertoire arranged for a band format, with no global influence vector in its record at all.
- Coke Studio Bangla documented as a platform note in `data/genres/genre-overview.md` rather than an artist entry (not a single artist/band)

Additional artists will be added iteratively based on network analysis, streaming visibility, and historical significance.

### Investigated and deliberately not catalogued

Names that appear in sources but lack enough substantiated detail for an honest profile. Recorded here, and in the relevant concert `notes`, rather than given invented entries:

- **Tirondaz** — Chattogram band named on the 2024 Joy Bangla Concert bill; no locatable formation year, members or discography.
- **Introit, Adverb, Sin, Fuad and Friends** — named on the 2020 Joy Bangla Concert afternoon and main slates; not yet researched.
- **Kronic and Reborn** — both turn up only as names in list-form band-scene round-ups (e.g. a blogspot history piece grouping them with Black, Artcell, Poizon Green, Scarecrow, Dolchhut, Obscure, Chime, Beduin) with no locatable formation year, members, or discography; do not fabricate profiles until better sources surface. Nigar Sumi was investigated and found to already be documented — she is the founder-vocalist of Lalon Band (`lalon-band`), not a separate artist. Uptown Lokolz and Theology of Rap have since been catalogued (see Hip-Hop section above). Vikings and AvoidRafa, surfaced via the 2014-2016 RockNation editions, have since been catalogued (above). Echoes, Nongar, Psychotron and Rim remain uncatalogued — next candidates for research. No API access is available for Spotify/YouTube streaming-metrics collection — blocked pending the project owner registering developer credentials (`docs/roadmap.md`).

## Two conventions this catalogue follows

**Null over invention.** Where a value is genuinely undocumented, the field is
null and the artist is tagged `needs-verification` — Shohojia's formation year,
for instance. The schema permits null on `formed_year` and on discography years
and labels for exactly this reason. Do not fill a gap with a plausible guess.

**Influence citations carry their evidence.** Each `global_influences` entry
records the evidence, a named source, and a stated confidence level. All 83
current citations have a source. This is what allows the influence analysis to
report *how well evidenced* an influence claim is, not just how often it appears
— and it is why the strand asymmetry in the paper (§7.2) can be read as a
property of the evidence rather than of the music.
