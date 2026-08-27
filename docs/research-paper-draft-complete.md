# From Folk Roots to Digital Streams: The Evolution of Bangladeshi Music Genres, Listener Cultures, and Global Musical Influences

**A Computational Analysis of Genre Development, Global Influences, Listener Communities, and Musical Ecosystems**

**Author**: Ismail Hossain
**Affiliation**: Independent research project (github.com/smile-plzz/bangladesh-music-evolution)
**Version**: Second draft — first version carrying computed empirical results (2026-08-27)
**Keywords**: Bangladesh music, genre evolution, cultural hybridity, co-appearance networks, sound evolution, concert culture, computational social science, digital humanities, global influence, local adaptation

---

## Abstract

Bangladesh's popular music has been transformed since the early 1970s, from folk
traditions and Adhunik Bangla through a band and metal explosion to a pluralistic
digital-era ecosystem. This study builds an open, structured dataset of that
ecosystem — 63 artists, 23 documented events, 169 normalised influence citations
— and analyses it computationally through the **Bangladesh Musical Ecosystem
Model (BMEM)** and its process companion, the **Bangladesh Music Evolution
Framework (BMEF)**.

Four results are reported. First, the arrival order of genre strands differs
from the standard account: the catalogue's first hip-hop release (1993) predates
its first alternative, folk-fusion, progressive and pop formations, placing
Bengali-language rap two years after the first original Bangla metal album
rather than two decades later. Second, influence citations are structured but
unevenly evidenced — metal and progressive acts name specific bands (Metallica,
6 citing acts; Megadeth, 5; Pink Floyd, 4, the only vector reaching three
strands), while pop and folk acts name traditions, an asymmetry that reflects
who gets interviewed as much as how music transmits. Third, a multi-layer
co-appearance network over the catalogue is genuinely structured (Louvain
modularity 0.428 on observational layers; six communities of three or more
acts) and its communities are interpretable — a mixed-strand national festival
circuit, a metal genealogy joined by stated influence, a classic
mainstream-rock cluster joined by shared personnel, and a founding-era cohort
held together by acts citing each other. Fourth, the concert typology
inherited from the project's own methodology is **falsified by its data**: every
multi-act bill in the catalogue mixes genre strands, so large commemorative
festivals function as discovery spaces rather than as the subcultural gatherings
the framework predicted.

A methodological result is reported alongside these: projecting a concert
hypergraph onto artist pairs without correcting for bill size lets a single
twelve-act festival contribute 66 edges and depresses observed modularity from
0.428 to 0.159. Any scene network built from festival lineups needs this
correction.

The study also states its boundary plainly. No streaming, audio-feature or
audience-side data was obtainable, so the network reported here is a
**co-appearance** network, not the preference network the framework specified,
and every claim about sound or audience rests on documented description rather
than measurement. Ten specific revisions to the BMEM are proposed on that basis.

---

## 1. Introduction

Music encodes social, technological and political change, and Bangladesh's case
is unusually legible: a fifty-year span in which folk and patriotic traditions
met Western rock, metal, hip-hop and electronic forms, while the means of
distribution moved from cassette stalls to algorithmic streaming.

Existing scholarship on this transformation is thin and unevenly distributed.
The Dhaka metal scene has an ethnographic literature (Quader & Redden, 2015;
Quader, 2016); Bangladeshi rap acquired one only in 2021 (Hasan & Kundu, 2021,
2022); the pop strand has essentially none. Almost all of it is single-scene and
qualitative. One computational precedent exists (Autul et al., 2024), comparing
Bangladeshi and West Bengal rock via Spotify audio features, and it is
comparative rather than ecosystem-level.

This project addresses that gap by building the dataset first and reporting what
it supports. Its primary question is unchanged from the proposal:

> **How has Bangladesh's music culture evolved, and what factors — including
> global influences and local adaptation — are shaping its future?**

What has changed is the standard of proof. This draft distinguishes throughout
between what the data shows, what it suggests, and what the project simply
cannot see. Several claims carried in the first draft are retracted here on that
basis, and two dimensions of the study's own framework are corrected against its
own evidence.

## 2. Background and scope

Bangladesh's musical substrate is deep: Baul, Bhatiali, Bhawaiya, Nazrul Geeti,
Rabindra Sangeet, Adhunik Bangla. From the early 1970s, Azam Khan and Uccharon
and a first wave of bands — Souls (c. 1972), Feedback (1976), Miles (1978–79),
Feelings/Nagar Baul — established commercial band culture. The mid-1980s brought
heavy metal (Warfaze 1984, Rockstrata 1985) and the 1990s the classic rock era
(LRB and Ark, both 1991). The 2000s produced progressive metal (Artcell 1999,
first album 2002), an indie expansion, and the beginnings of digital
distribution. The 2010s and 2020s added streaming, hip-hop's growth in
visibility, and folk-fusion platform projects.

The study works with seven genre strands: Mainstream Rock, Progressive
Rock/Metal, Heavy Metal, Alternative/Indie, Pop, Hip-Hop/Rap, and Folk & Folk
Fusion. Strand assignment is computed from each artist's genre list by positional
weighting (`analysis/lib/common.py`), with two documented overrides where the
project's own curated groupings disagree — the disagreements are kept visible
rather than tuned away.

Five analytical dimensions are applied to each strand: musical evolution,
cultural evolution, listener evolution, concert culture, and industry position.

## 3. Literature

The full annotated bibliography is `docs/annotated-bibliography.md`; the working
review with retrieval status is `docs/literature-review.md`. In summary:

**On the Bangladeshi scene.** Quader & Redden (2015, *Cultural Studies* 29(3))
read Dhaka's metal underground as an alternative cultural space built by urban
youth out of frustration with national conditions, using "scene" rather than
"subculture" as the frame. Quader (2016, *Metal Music Studies* 2(1)) applies
Bourdieu's forms of capital to the same scene. Hasan & Kundu (2021, 2022)
provide the only substantial academic treatment of Bangladeshi rap, finding a
generational split between politically explicit younger artists and more
conformist established ones, and framing the strand as continuous with a
national protest-music tradition. Mridha & Begum (2023) trace band music as a
recent development inside a much longer folk continuum. Pervez (2012) applies
frame analysis and Hall's theory of representation. Yoon (2019) analyses the
fusion band BANGLA's reworking of Lalon repertoire as glocal cultural content.
Mukherjee (2017) and Mitra (2008, 2014) supply West Bengal comparanda. Hasan
(2015) is a widely cited LSE blog essay, not a peer-reviewed article — an error
in this project's own earlier citation, corrected here.

**Methodological precedent.** Autul et al. (2024) is the sole computational
study of Bangladeshi popular music located, and it is the benchmark any future
audio-feature work here should be measured against.

**Gaps this project addresses.** No prior multi-genre, data-driven mapping of the
ecosystem; no prior work linking repertoire change to concert co-appearance
structure; and no academic literature at all on the pop strand, which remains
the least theorised part of the ecosystem.

## 4. Conceptual framework

**BMEM** (`frameworks/bmem.md`) models the ecosystem as six interacting
dimensions: Historical Evolution, Global Influence, Local Adaptation, Listener
Preference Networks, Music Experience Culture, and Industry Transformation.

**BMEF** (`frameworks/bmef.md`), developed in this pass, is its process
companion. It names four change mechanisms with distinct observable signatures —
**repertoire substitution** (technique retained, repertoire replaced: Warfaze's
1991 pivot), **personnel transmission** (technique and audience carried by
musicians between acts: Ayub Bachchu across Souls, LRB and Nagar Baul),
**programmatic exposure** (audiences meeting strands they did not seek, via
festival or platform programming), and **format adaptation** (the release unit
changing, and composition following). Crucially it also states what evidence
each mechanism requires, and marks sonic change and audience change as
unmeasurable in this project.

The results in §7 test BMEM against data for the first time; §9 summarises the
resulting corrections, set out fully in `frameworks/bmem-validation.md`.

## 5. Methodology

**Design.** Secondary data analysis in a computational social science / digital
humanities mode. No primary surveys or interviews.

**Data model.** Two JSON Schemas govern the dataset
(`data/schemas/`). Artist records carry formation and disbanding years, members
with roles and years, discography summaries, and — the field that carries most
of the analytical load — `global_influences` entries, each with the influence
named, the evidence for it, a source, and a stated confidence level. Concert
records carry date and date precision, venue and venue type, organiser, the
billed artists with billing roles, and sources.

**Pipeline.** Seven scripts in `analysis/scripts/`, all re-runnable and
deterministic:

| Script | Produces |
|---|---|
| `validate_data.py` | Schema validation, referential integrity, hygiene warnings |
| `build_bmpn.py` | Multi-layer network with per-edge provenance |
| `analyze_bmpn.py` | Centralities, Louvain communities, modularity, assortativity |
| `temporal_analysis.py` | Formation and release distributions, strand lifecycles |
| `concert_ecosystem.py` | Typology classification with the rule that fired |
| `influence_analysis.py` | Citation normalisation, cross-tabs, localisation markers |
| `make_visualizations.py` | Seven figures, rendered from the computed outputs only |

Figures read exclusively from `analysis/outputs/`, so no figure can disagree
with a reported number.

**Network construction.** Four edge layers, three observational and one
inferred:

- `co_billing` — a documented shared concert bill;
- `personnel` — a shared named member;
- `domestic_influence` — one catalogued act naming another as an influence;
- `influence_homophily` — two acts citing the same named global influence.
  **Inferred**, flagged on every edge it produces, weighted at half, and
  excluded from the headline "observed" pass.

Co-billing edges carry a bill-size correction. Each event contributes 1/(n−1) to
every pair on its bill, so an act's total contribution per event is 1 regardless
of bill size. Without it, the 2020 Joy Bangla Concert's twelve-act bill alone
contributes 66 edges and swamps every other signal. The weighting follows
Newman's (2001) treatment of multi-author scientific papers in collaboration
networks — the same dilution logic applied to concert bills instead of
co-authorship.

**Three analytical passes** are reported for every network result: `observed`
(the three documentary layers — the evidential result), `full` (all four — the
exploratory result), and `co_billing` (the original single-layer prototype, for
comparison).

**Validation.** Findings are treated as robust where they survive across
independent evidence types. In practice this meant checking network results
against the concert typology and the influence analysis, which is how the
festival/discovery-space correction in §7.5 and the hip-hop documentation
artefact in §7.4 were both caught.

**Ethics.** Public sources only; artist- and event-level records, not
individual listeners.

### 5.1 A constraint on this pass, stated up front

The environment in which this analysis was run blocks direct page retrieval, so
records added in this pass are sourced from search-result summaries of the cited
articles rather than from their full text. Those records are tagged
`snippet-sourced` in the data and should be verified against full text before
publication. This affects the eight Joy Bangla Concert records and five artist
records added here; it does not affect the analysis pipeline or any record
predating this pass.

## 6. The dataset

| Measure | Value | Target |
|---|---:|---:|
| Artists catalogued | 63 | 300 |
| Events catalogued | 23 | 500 |
| Schema / referential errors | 0 | 0 |
| Hygiene warnings | 35 | — |
| Artists with ≥1 documented event | 28 | — |
| Artists with no documented event | 35 | — |
| Raw influence citations | 83 | — |
| Normalised citations | 169 | — |
| Citations with a named source | 83 (100%) | — |

Strand distribution: Alternative/Indie 16, Mainstream Rock 13, Heavy Metal 12,
Hip-Hop/Rap 8, Pop 7, Folk & Folk Fusion 5, Progressive Rock/Metal 2.

**The sample is not a census and the analysis treats it as a sample throughout.**
It is 21% of its artist target and 5% of its event target; it over-represents
Dhaka (19 of 23 events) and rock/metal; and it was assembled outward from a
well-documented metal core, which plausibly biases every strand-comparison in
this paper. Where a result could be an artefact of that construction, this is
stated at the point the result is given rather than deferred to §10.

## 7. Results

### 7.1 Temporal structure and strand lifecycles

*(Figures 1–3; `analysis/outputs/temporal-summary.json`)*

Catalogued formations by decade: 5 (1970s), 5 (1980s), 15 (1990s), 26 (2000s),
10 (2010s), 1 (2020s). The 2000s alone account for 42% of dated formations. The
2020s figure reflects documentation lag, not a halt in band formation.

| Strand | Acts | First | Median | Latest | Still active |
|---|---:|---:|---:|---:|---:|
| Mainstream Rock | 13 | 1972 | 1985 | 2014 | 92% |
| Heavy Metal | 12 | 1984 | 2001 | 2007 | 92% |
| Hip-Hop/Rap | 8 | 1993 | 2005 | 2024 | 100% |
| Alternative/Indie | 16 | 1996 | 2006 | 2018 | 100% |
| Folk & Folk Fusion | 5 | 1997 | 2001 | 2016 | 100% |
| Progressive Rock/Metal | 2 | 1999 | 2002 | 2006 | 100% |
| Pop | 7 | 2002 | 2006 | 2013 | 100% |

**Result 1 — the strand arrival order is not the received one.** Hip-hop's first
catalogued act (Ashraf Babu & Charu, *Tri-Rotner Khepa*, 1993, the first
Bengali-language rap album) predates the catalogue's first alternative (1996),
folk-fusion (1997), progressive (1999) and pop (2002) formations. It sits two
years after Warfaze's 1991 original-Bangla-metal debut, not two decades. The
common framing of hip-hop as Bangladeshi music's late arrival describes when the
strand became *visible to the press*, not when it began.

**Result 2 — release formats shift from albums to singles.** Singles are absent
from the catalogue before the 2010s and are 4 of 12 dated 2020s releases;
studio albums fall from 100% of 1980s releases to 50% in the 2020s. Median gap
between an act's dated releases is 5 years. Two cautions: the 2020s are
incomplete, and older singles are systematically less likely to have been
catalogued than older albums. The direction is well supported; the magnitude is
not.

**An unresolved observation.** Heavy metal's latest catalogued formation is
2007, while alternative continues to 2018 and hip-hop to 2024. This may be real
generational closure or an artefact of how the catalogue was assembled. The
project cannot separate the two, and the observation is reported as open rather
than as a finding.

### 7.2 Influence structure

*(Figures 5–6; `analysis/outputs/influence-analysis.json`)*

83 raw citations across 63 acts normalise to 169 citation tokens, resolving to
46 distinct named global acts and 73 tradition labels. Every raw citation
carries a named source; stated confidence is medium 34, high 31, low 16,
hypothesised 2.

Each canonical token's kind is resolved once across the whole corpus rather than
from the string it appears in, so an influence cannot count as a named act in
one cross-tab and as a tradition in another; ranks count distinct citing acts,
not citation rows. Most-cited named influences: Metallica 6, Megadeth 5, Pink
Floyd 4, then Sepultura, Pantera, Alice in Chains, Motörhead, Deep Purple and
Iron Maiden at 3 each. Ten influences are cited across more than one strand, and
**Pink Floyd is the only one reaching three** (progressive, mainstream rock,
heavy metal).

**Result 3 — influence citations are structured by strand, but so is the
evidence for them.**

| Strand | Top citations |
|---|---|
| Heavy Metal | Metallica (5), Megadeth (4), Iron Maiden (3), Pantera, Black Sabbath, Sepultura, Motörhead, Lamb of God (2 each) |
| Progressive Rock/Metal | Pink Floyd (2), Dream Theater, Opeth, Radiohead, The Beatles, Metallica, Sepultura, Pantera |
| Alternative/Indie | Alice in Chains (2), Soundgarden (2), Nirvana, Pearl Jam, Stone Temple Pilots, Deftones, Slipknot, Queens of the Stone Age |
| Mainstream Rock | The Doors (2), Led Zeppelin, Deep Purple, Queen, Clapton, Knopfler, Pink Floyd |
| Hip-Hop/Rap | Tupac, Biggie, Eminem, Big L (1 each), plus American hip-hop as a tradition (3 acts) |
| Pop | Karsh Kale — one named act in the whole strand; otherwise traditions (contemporary Asian, Indian, South Asian pop) |
| Folk & Folk Fusion | **none** — every citation in the strand is a tradition label (jazz, blues, Western rock, world music) |

Metal and progressive acts name specific bands; pop names one act across seven
bands and folk names none at all. Two explanations are compatible with this and the catalogue cannot
separate them: technical genres may transmit through identifiable models while
pop and folk transmit through diffuse convention, **or** metal and progressive
musicians are simply interviewed about influences more often — which is
demonstrably true, since the metal scene has an academic literature and the pop
strand has none. The asymmetry is reported here as a property of the evidence,
not as a property of the music.

Citations grouped by the citing act's founding era show the expected vector
shift — Clapton, Led Zeppelin, The Doors and Knopfler from founding-era acts;
Metallica, Pantera, Sepultura from the metal and cassette era; Megadeth, Pink
Floyd and Lamb of God from the digital transition. The counts behind that shift
are small: 2, 6, 7 and 1 citing acts respectively. The streaming-era column
rests on a single act and should not be interpreted at all.

### 7.3 Localisation mechanisms

Documented adaptation mechanisms across the catalogue: Bangla language choice
36 acts, folk or Baul motif 20, political or social content 20, literary or
poetic sourcing 8, religious or spiritual 4, urban vernacular 4.

**Result 4 — folk is a cross-strand resource, not a genre.** Folk motifs are
documented in 20 of 63 acts while only 5 sit in the folk strand by primary
genre: in progressive rock (Shironamhin's *Shironamhin Rabindranath* engaging
Tagore's repertoire), mainstream rock (Nagar Baul's folk-rock tag), pop (Habib
Wahid, Minar, Nancy) and hip-hop (Jalali Set's folk-hip-hop fusion). This is
the quantitative counterpart to Mridha & Begum's (2023) claim that band music is
a recent development inside a longer folk continuum.

**Result 5 — strands localise on different registers.** Progressive on the
literary register; folk fusion on the motif register; hip-hop on the vernacular
register (3 of the catalogue's 4 `urban_vernacular` markers); heavy metal, at
its 1991 pivot, on the linguistic register alone — the riffs did not change, the
language did.

**A negative result worth publishing.** Hip-hop shows only **one**
`political_or_social` marker, against 6 for alternative/indie and 5 for
mainstream rock. This flatly contradicts Hasan & Kundu (2021, 2022) and the
catalogue's own Hannan record, which ties a 2024 breakthrough to the mass
uprising. The marker counts are measuring how the records were written — the
rock profiles researched with political framing in view, the hip-hop profiles
from thinner biographical sources — not what the music does. Reported as a data
artefact, with re-researching the strand's records as the fix rather than
adjusting the marker list.

### 7.4 The co-appearance network

*(Figure 4; `data/networks/bmpn-multilayer.json`, `analysis/outputs/bmpn-metrics.json`)*

| Pass | Edges | Density | Components | Largest | Isolated | Modularity | Communities ≥3 | Strand assortativity |
|---|---:|---:|---:|---:|---:|---:|---:|---:|
| `observed` | 153 | 0.078 | 24 | 36 | 20 | **0.428** | 6 | +0.058 |
| `full` | 179 | 0.092 | 21 | 41 | 18 | 0.425 | 5 | +0.112 |
| `co_billing` | 133 | 0.068 | 40 | 24 | 39 | 0.182 | 3 | −0.040 |
| `observed_uncorrected` | 153 | 0.078 | 24 | 36 | 20 | 0.159 | 6 | +0.058 |

**Result 6 — the network is genuinely structured, and its communities are
interpretable.** Louvain modularity of 0.428 on observational layers alone is
comfortably above the level at which community structure is considered
meaningful. The six communities of three or more acts:

| Community | Size | What holds it together |
|---|---:|---|
| National festival circuit | 16 | Shared bills at Joy Bangla Concert and RockNation — mixed strands throughout |
| Alternative–metal cluster | 7 | Black, Indalo, Powersurge, Severe Dementia, De-illumination, Arekta Rock Band, Tahsan |
| Metal genealogy | 5 | Rockstrata, Poizon Green, Karnival, Aurthohin, AvoidRafa — personnel and stated influence |
| Classic mainstream rock | 4 | Souls, LRB, Nagar Baul, Renaissance — Ayub Bachchu and Pilu Khan |
| Detached alternative | 4 | Conclusion, Owned, Vikings, Winning |
| Founding-era cohort | 3 | Azam Khan &amp; Uchcharon, Feedback, Nova — held together by acts citing each other, not by shared bills |

Highest eigenvector centrality on the observed largest component: Cryptic Fate
(0.409), Artcell (0.388), Nemesis (0.364), Warfaze (0.349), Chirkutt (0.314).
Highest betweenness: Karnival (0.080), Nova (0.069), Nemesis (0.068),
Powersurge (0.065), Warfaze (0.033).

**Result 7 — this is a co-appearance network, and calling it a preference
network would be false.** Its edges record shared bills, shared members and
stated influences. The classic mainstream-rock community exists because two
musicians moved between those bands. Lalon Band and Chirkutt reach degree 18
because festival programmers put a folk act on nearly every bill — programming
policy, not audience overlap, and the co-billing layer cannot distinguish them.
Strand assortativity of +0.05 (observed) says almost nothing: acts are barely
more likely to share a bill with their own strand than with another, which is
consistent with §7.5 and inconsistent with reading these communities as taste
communities.

**Result 8 — a methodological finding.** Uncorrected hypergraph projection
depresses observed modularity from 0.428 to 0.159, because a single twelve-act
bill contributes 66 undifferentiated edges. Both figures come from the same
pipeline run (the `observed` and `observed_uncorrected` passes), so the
comparison is reproducible rather than asserted. Any study building a scene network
from festival lineups needs a bill-size correction or it will primarily measure
festival size.

**Coverage caveat, applying to every number above.** 35 of 63 acts have no
documented event. Meghdol holds degree 8 and betweenness exactly 0 — not because
its audience is isolated but because its live history before 2023 is not in the
dataset. Centrality here is substantially a measure of festival participation,
which is itself a measure of what got written about. No hip-hop act's centrality
in this dataset is interpretable.

### 7.5 The concert ecosystem

*(Figure 7; `analysis/outputs/concert-ecosystem.json`)*

| Class | Events | Mean bill | Cross-strand rate |
|---|---:|---:|---:|
| metal-rock-festival | 14 | 5.50 | 1.00 |
| independent-indoor-gig | 3 | 1.67 | 1.00 |
| diaspora-tour | 2 | 1.00 | n/a |
| large-open-air-headliner | 2 | 0.50 | n/a |
| university-festival | 1 | 3.00 | 1.00 |
| corporate-branded-platform | 1 | 1.00 | n/a |
| **urban-hiphop-event** | **0** | – | – |

**Result 9 — the study's own typology is falsified.** The methodology predicted
that metal and rock festivals would be low-diversity subcultural gatherings and
university festivals the eclectic discovery spaces. In the catalogue, **every
multi-act bill mixes BMEM strands** — cross-strand rate 1.00 in every measurable
class. The 2020 Joy Bangla Concert placed indigenous folk (F Minor), pop
(Minar), hard rock (AvoidRafa, Vikings), alternative (Shunno, Arbovirus,
Conclusion, Arekta Rock Band) and metal (Cryptic Fate) on one stage.

The necessary qualification: the catalogue's festivals are disproportionately
Joy Bangla Concert editions, programmed by a youth organisation for national
commemoration. The corrected claim is therefore narrower than the raw number
suggests — *the large commemorative festival is a discovery space; the
commercial metal festival remains untested*.

**Result 10 — an entire defined class is empty.** Zero `urban-hiphop-event`
entries across eight catalogued hip-hop acts. This is a sourcing failure: the
project's event sources are news outlets that cover rock festivals, and
Bangladeshi hip-hop events are promoted on platforms those outlets do not
follow.

**Result 11 — the live circuit is a Dhaka circuit that has begun to move.** 19
of 23 events are in Dhaka. The exceptions run one way: a 2016 RockNation Sylhet
date, Chattogram's Bay of Bengal opening the 2019 Joy Bangla Concert, and the
2024 edition relocating to Chattogram's MA Aziz Stadium — the first held outside
the capital. Three data points, one direction.

**Result 12 — the largest documented demand figure is for a free event.** More
than 32,000 online registrations for the 2018 Joy Bangla Concert, which charged
no admission. The catalogue contains no reliable evidence about what audiences
*pay* for live music.

## 8. Case studies

Developed in full in `analysis/case-studies/`:

- **Warfaze** — the legitimation arc: cover repertoire (1984–90) → original
  Bangla metal (1991) → Ekushey Padak (2026). Localisation here is *linguistic
  before it is musical*; the riffs did not have to change for the music to
  become Bangladeshi.
- **Artcell** — the clearest documented instance of an imported technical
  apparatus filled with entirely local semantic content. Highest weighted degree
  in the network; 10 documented events across four typology classes; a
  seventeen-year album gap against a catalogue median of five.
- **Meghdol** — literary indie arriving at the festival circuit in 2023, twenty
  years after forming. Degree 8, betweenness 0: the clearest illustration of
  what the network measures and what it does not.
- **The hip-hop lineage** — a thirty-year documented lineage with near-zero
  presence in every measurement the project can make.
- **Folk fusion and platforms** — folk as a cross-strand resource, carried into
  the mainstream by a branded studio platform and a commemorative festival
  rather than by labels.

## 9. Discussion: the framework against the data

`frameworks/bmem-validation.md` tests all six BMEM dimensions and proposes ten
revisions. The substantive ones:

**Two dimensions are corrected outright.** Dimension 4's operationalisation is a
co-appearance network, not a preference network, and should be renamed until
audience-side evidence exists. Dimension 5's typology has the diversity
prediction backwards.

**Local adaptation needs sub-structure.** A single "Global → Local" arrow hides
four different registers of adaptation (literary, motif, vernacular,
linguistic), two directions of travel (Artcell imports the form and supplies
local content; Meghdol starts local and reaches for an imported idiom), and a
pathway the model has no arrow for at all — **internal adaptation**, from
marginal or classical repertoires toward the popular mainstream. F Minor
arranging Garo and Marma community material and Shironamhin engaging Tagore are
both this, and neither is a global-to-local movement.

**Global influence needs a distinction.** Named-model influence (a specific act,
usually with an interview behind it) and ambient-tradition influence (a genre
convention absorbed without a stated model) are documented by different means
and carry different evidential weight. Treating them as one quantity produces
the strand asymmetry in §7.2 and invites reading it as a fact about music.

**Industry transformation needs non-commercial funders.** The catalogue's most
consequential recent events are funded by a state-adjacent youth platform
(Joy Bangla Concert: free entry, 32,000 registrations) and a beverage brand's
cultural-prestige project (Coke Studio Bangla). A dimension modelled as
cassette → CD → streaming has no place for either, and in this catalogue those
two carry more of the ecosystem than the labels do.

**And most of that dimension is untested.** The model's claims about
monetisation, royalties and algorithmic visibility have no supporting data here.
They are hypotheses, and this draft marks them as such rather than restating
them as findings, which the first draft did.

## 10. Limitations

1. **Sample size and construction.** 63 of a target 300 artists; 23 of 500
   events. The catalogue was built outward from a well-documented metal core,
   which plausibly biases every strand comparison in this paper.
2. **No audience data of any kind.** Every claim about listeners in this study
   is inferred from co-billing and from what artists and journalists said. The
   study's central construct — the preference network — is not yet built.
3. **No audio features.** Every claim about tempo, production or arrangement
   rests on documented description and discographic sequence. Blocked pending
   Spotify and YouTube API credentials.
4. **Documentation bias is measurable and material.** The hip-hop
   political-content result (§7.3) is a demonstrated instance of a marker count
   reflecting how records were written rather than what the music does. The same
   mechanism plausibly affects the strand influence asymmetry (§7.2) and the
   metal-recruitment observation (§7.1).
5. **Geographic bias.** 19 of 23 events in Dhaka. The ecosystem outside the
   capital is nearly invisible here.
6. **Retrieval constraint on this pass.** Records added in this pass are
   snippet-sourced (§5.1) and tagged accordingly.
7. **Two acts in the progressive strand.** Any statement about "the progressive
   strand" is a statement about Artcell and Karnival.
8. **Recency asymmetry.** Recent decades have better event coverage and worse
   formation coverage than older ones. Trends crossing that boundary should be
   read with care.

## 11. Future trends

Set out with evidence grades and falsification conditions in
`docs/future-trends-forecast.md`. In brief: the single becomes the default
release unit (grounded); the festival circuit decentralises out of Dhaka
(indicated); cross-strand billing continues and strand boundaries soften
(grounded); institutional and brand funding grows relative to label funding
(indicated, with a political caveat about the Joy Bangla Concert's own funding
model); hip-hop's documented presence grows sharply from a base the record
understates (indicated); long-lived bands persist through personnel turnover
(grounded); metal's recruitment closure (speculative, and explicitly not to be
relied on).

The forecast also states what this project cannot forecast at all: streaming
economics, audience size or composition, AI's role in production and
recommendation, and the commercial viability of any strand.

## 12. Conclusion

This study set out to model Bangladeshi music as an ecosystem rather than a
chronology, and it now does so on measured rather than asserted foundations. The
ecosystem it describes is structured — communities are detectable at modularity
0.428, influence vectors differ systematically by strand and era, and folk
functions as a resource drawn on across every strand rather than as a genre
among genres. It is also more institutionally arranged than the framework
anticipated: the acts that hold the network together do so through shared bills
programmed by a youth organisation, through musicians moving between bands, and
through a branded platform, more than through anything a label did.

The study's most useful contributions may be its negative results. Its own
concert typology is falsified by its own data. Its central construct, the
preference network, turns out not to be what was built. One of its localisation
findings is a documentation artefact and is reported as one. Establishing those
things required building the pipeline that could detect them, and they
constrain what the next iteration should claim in a way that a more confident
draft would not have.

What remains is largely a data problem with a known shape: audience-side signals
(blocked on API credentials), the hip-hop and university-fest live circuits
(blocked on nothing but collection effort), and the artist catalogue's remaining
four-fifths. The framework, the pipeline and the standard of evidence are now in
place to absorb them.

## 13. Reproducibility

```bash
pip install networkx matplotlib jsonschema scipy

python3 analysis/scripts/validate_data.py        # schema + integrity
python3 analysis/scripts/build_bmpn.py           # network layers
python3 analysis/scripts/analyze_bmpn.py         # communities + centrality
python3 analysis/scripts/temporal_analysis.py    # decade curves
python3 analysis/scripts/concert_ecosystem.py    # typology
python3 analysis/scripts/influence_analysis.py   # citations
python3 analysis/scripts/make_visualizations.py  # figures
```

All scripts are idempotent and overwrite their outputs. Every number in this
paper comes from `analysis/outputs/` or `data/networks/`; every figure is
rendered from those files. The dataset is JSON under `data/`, schema-validated
with zero errors at the time of writing.

**Figures.** Fig. 1 formations by decade; Fig. 2 releases by decade; Fig. 3
strand formation timeline; Fig. 4 the co-appearance network; Fig. 5 most-cited
global influences; Fig. 6 influence vectors by founding era; Fig. 7 concert
typology. All in `analysis/visualizations/`.

## References

Full APA entries with annotations: `docs/annotated-bibliography.md`. A wider
landscape scan — new scholarship (including on hip-hop and the July 2024
uprising), network-methodology literature, and industry sources not yet
integrated into this draft — is in
`docs/research-landscape-extended.md`.

Autul, M. R., et al. (2024). Rocking across borders. *International Journal of Computer and Digital Systems*.
Hasan, M. (2015, December 4). Rock 'n' roll, social change and democratisation in Bangladesh. *South Asia @ LSE*.
Hasan, M., & Kundu, P. (2021). Conformers and rebels. In *Masks of authoritarianism* (pp. 173–183).
Hasan, M., & Kundu, P. (2022). Hip-hop music activism. In *The emergence of Bangladesh* (pp. 405–417). Palgrave Macmillan.
Mitra, U. (2008). Image of urban youth in the lyrics of Bangla bands. *West Bengal Sociological Review, 1*, 112–113.
Mitra, U. (2014). *Exploring youth* [Doctoral dissertation, Jadavpur University].
Mridha, M. A. H., & Begum, M. (2023). Continuum of folk to pop music in Bangladesh. *Issues in Social Science, 11*(2).
Mukherjee, K. (2017). Bangla rock. *International Journal of Pedagogy, Innovation and New Technologies, 4*(2), 35–47.
Newman, M. E. J. (2001). The structure of scientific collaboration networks. *Proceedings of the National Academy of Sciences, 98*(2), 404–409.
Pervez, A. (2012). Music and identity. *Journal of Bangladesh Studies, 137*, 42–55.
Quader, S. B. (2016). Forms of capital in the Dhaka metal scene. *Metal Music Studies, 2*(1), 5–24.
Quader, S. B., & Redden, G. (2015). Approaching the underground. *Cultural Studies, 29*(3), 401–424.
Yoon, J.-S. (2019). Popular music of Bangladesh. *South Asia Studies, 25*(2), 59–116.

---

**Repository**: https://github.com/smile-plzz/bangladesh-music-evolution
**Data**: `data/` · **Analysis**: `analysis/` · **Frameworks**: `frameworks/`
