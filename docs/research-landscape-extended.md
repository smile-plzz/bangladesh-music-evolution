# Research Landscape: Extended Analysis and Recommendations (2026)

This document extends the project's literature review and methodology beyond
the sources already cited in `docs/literature-review.md` and
`docs/annotated-bibliography.md`. It surveys the wider scholarly, technical and
industry landscape as of August 2026, evaluates it critically against what this
project has built, and converts the findings into concrete, prioritised
recommendations. It is a companion to `docs/roadmap.md`, not a replacement:
the roadmap says what to do next in sequence; this document says why, with the
evidence.

**Scope note.** Search access in this environment returns result summaries and
occasional fetched pages, not universal full-text retrieval — several
publisher domains (Spotify's developer blog, SAGE, ResearchGate, RSIS
International) returned `EGRESS_BLOCKED` when fetched directly. Claims below
are sourced from search-result summaries unless a direct quote or fetch is
noted, and every specific claim below should be read with that caveat — the
same discipline the project already applies to its `snippet-sourced` data tag
(§5.1 of the research paper). Where a claim matters enough to appear in the
paper, it should be verified against full text first.

---

## 1. What this project has already established (baseline)

Before extending outward, the baseline this document builds on:

- 63 artists, 23 events, 179 network edges, 169 normalised influence citations,
  seven analysis scripts, seven figures, a tested and revised conceptual
  framework (BMEM/BMEF), a paper at second draft with twelve numbered results.
- The project's own strongest methodological move is the **bill-size
  correction** on concert hypergraph projection (1/(n−1) weighting per Newman's
  scientific-collaboration-network convention) and the **three-pass reporting**
  (`observed`/`full`/`co_billing`) that makes the correction's effect visible
  rather than asserted.
- The project's own strongest epistemic move is naming what it cannot do
  (audience data, audio features) and retracting first-draft claims that
  outran the evidence — most visibly, renaming Dimension 4 from "preference
  network" to "co-appearance network" once the edge provenance was examined.

This is a genuinely unusual level of rigour for a project at this stage, and
the sections below are written to sharpen it, not to relitigate it.

---

## 2. Scholarly literature: what's new since the last pass, and what was missed

### 2.1 A new primary source on the July 2024 uprising and hip-hop

**Hossain, Tareq (2026). "Voice for justice: Hybrid cultural resistance of
hip-hop songs and memes in July mass uprising, Bangladesh."** (SAGE journal;
DOI `10.1177/13678779261452687`.) This was flagged in the literature review as
"not yet reviewed in depth" — it should now be treated as core, not peripheral,
reading. Per search summaries, the study examines **10 hip-hop songs and 77
memes across five meme groups** shared on Facebook and YouTube during the
uprising, arguing these functioned as tools of "hybrid cultural resistance"
merging digital creativity with street activism. It names two anthem tracks —
**"Kotha Ko" (Speak Up)** and **"Awaz Utha" (Raise Your Voice)** — with the
latter's performer, Hannan Hossain Shimul, reportedly arrested on 25 July 2024
shortly after release.

**Direct relevance to this project.** The catalogue already has a `hannan`
artist record and cites a "2024 breakthrough tied to the mass uprising" — the
paper's §7.3 flags this as contradicting the project's own thin
`political_or_social` marker count for hip-hop. Hossain (2026) is the exact
academic source that would let the project correct that documentation
artefact with a citable authority, rather than only asserting it introspectively.
This is the single highest-value literature addition available: verify the
full text, then re-research the `hannan` record (and any other 2024-adjacent
hip-hop acts) against it, and cite it directly in §7.3 and in
`analysis/case-studies/hip-hop-lineage.md`.

*The Daily Star* also ran a piece, "Sound of the July uprising," profiling
protest rap songs — a secondary/journalistic source worth checking as
corroboration and for additional song titles/artist names not yet catalogued.

### 2.2 Coke Studio Bangla now has a dedicated academic literature

The project's framework document (`frameworks/bmem-validation.md`, Dimension 5
and 6 discussion) already identifies Coke Studio Bangla as institutionally
significant but had no academic citation for it. That gap is now closed:

**"Beyond Appropriation and Commodification: The Making of Coke Studio
Bangla's Complex Subjects"** (ResearchGate record 388400913; author identifies
as a "trained feminist anthropologist" per search summary — the exact author
name needs full-text confirmation). The paper's stated argument, per its own
framing, is that treating Coke Studio Bangla purely through an
appropriation/commodification lens is inadequate, and that the platform should
instead be read through the lens of "supply chain capitalism" — the scale and
diversity of capital, labour, bodies and resources it mobilises.

This is directly usable in the project's Dimension 6 discussion, which
currently treats Coke Studio Bangla only descriptively ("a beverage brand's
cultural-prestige project"). The supply-chain-capitalism framing gives the
project's "non-commercial funders" argument (BMEM revision #9) a sharper edge:
Coke Studio Bangla is not non-commercial at all — it is commercial in a
different register (brand equity, not direct song sales), and conflating that
with the state-adjacent Joy Bangla Concert's genuinely non-commercial funding
model understates a real difference the project's own data could measure (are
Coke Studio pairings cross-strand at the same 1.00 rate as Joy Bangla bills?
The catalogue does not yet have Coke Studio episode data to test this).

There is also a broader comparative literature on Coke Studio Pakistan (e.g.
work reading it as a "soundtrack for reimagining Pakistan," and studies on its
role during periods of instability) which supplies useful comparative
theoretical framing for how brand-sponsored music platforms function as
national-identity infrastructure across South Asia — worth a paragraph in the
literature review's "Broader Theoretical Lenses" section, since the project
currently treats this as a purely Bangladesh-local phenomenon.

### 2.3 Bangla-language music consumption and industry studies (2025)

Two 2025 studies close gaps the project's methodology document gestures at but
never cites:

- **"Music Industry on Digital Platform: A Study on Five Major Music Labels of
  Bangladesh"** (Rajshahi University Journal of Social Science and Business
  Studies, June 2025). Studies five labels — **Chena Sur, Soundtek, Anupam
  Music, Laser Vision, G Series** — across Facebook, YouTube, Instagram,
  TikTok and Twitter, reportedly finding YouTube is now these labels' sole
  meaningful income channel. This is a direct, citable source for the
  project's Dimension 6 (Industry Transformation) — currently the project's
  weakest-evidenced dimension by its own admission ("largely untested").
  G Series already appears informally in industry background; this paper
  would let the project cite label-level digital-transition evidence directly
  rather than relying on Wikipedia label pages.

- **"Music Consumption on Digital Platforms: A Study on Bangladeshi University
  Students"** (International Journal of Research and Innovation in Social
  Science). Reportedly finds Rajshahi University students have largely
  abandoned traditional formats for Facebook/YouTube/Spotify, prefer legal
  free sources over piracy. This is the closest thing found to primary
  audience-side survey data for Bangladesh specifically — not a substitute for
  the streaming API data the project is blocked on, but a citable secondary
  source that could support (or complicate) any inference the project draws
  about audience platform behaviour once it does get API access. It is also a
  **methodological template**: the project could commission or run an
  equivalent lightweight primary survey (a Google Form, distributed through
  university music societies) as a low-cost partial substitute for the blocked
  API data — this is the single most actionable idea in this section (see
  §7.2 below).

### 2.4 The pop strand remains the least-served in the literature — confirmed, not closed

The project's own paper (§3) states "no academic literature at all on the pop
strand." This extended search did not find a dedicated academic treatment of
Bangladeshi pop either — the closest adjacent material is comparative Coke
Studio scholarship (which crosses into pop/fusion) and industry-side pieces
(labels, digital consumption) that touch pop only incidentally. **This gap is
real and confirmed, not a retrieval artefact of the earlier pass.** The
project's own framing of this as a genuine research gap, rather than a
project failure, holds up.

### 2.5 Computational precedent beyond Autul et al. (2024)

The project names Autul et al. (2024) as its sole computational precedent.
Wider computational-musicology literature supplies methodological models the
project should be aware of even though none targets Bangladesh directly:

- **Mauch, MacCallum, Levy & Leroi (2015), "The evolution of popular music:
  USA 1960–2010,"** *Royal Society Open Science* 2(5), arXiv:1502.05417. Uses
  MIR and text-mining on ~17,000 Billboard Hot 100 recordings to build an
  audio-based style classification and track harmonic/timbral diversity over
  time, explicitly framed as replacing anecdotal pop-history claims with
  measured ones. This is the closest large-scale precedent for exactly the
  "sound evolution" work this project currently cannot do (blocked on audio
  data) — and its method (MIR feature extraction + unsupervised style
  clustering + diversity/disparity metrics over time) is a concrete target
  architecture for the project's audio-feature phase once source audio or
  embeddings are obtainable.

- **CompMusic project (Xavier Serra et al., Universitat Pompeu Fabra,
  2011–2017)** and its **Dunya** corpora — a sustained programme building
  culturally-specific computational-musicology corpora for five non-Western
  traditions (Hindustani, Carnatic, Turkish-makam, Arab-Andalusian, Beijing
  Opera), explicitly rejecting the assumption that Western MIR features
  transfer cleanly to other traditions. This is the strongest available model
  for how a Bangladesh-specific computational musicology *should* be built if
  it ever moves beyond metadata-network analysis into audio: not "run Western
  MIR tools on Bangladeshi audio" but "identify what Baul/Bhatiali/Bhawaiya
  melodic and rhythmic structures actually are, and build description tools
  fitted to them." The project's dataset currently has no place to record this
  kind of tradition-specific musical information (see §6.2 recommendation on
  schema).

- **Decolonising-MIR literature.** A 2026 ISMIR bibliometric study, "Beyond a
  Western Center of Music Information Retrieval," documents systematic
  underrepresentation of Global South scholarship and traditions in MIR
  research; a related 2024 paper, "Missing Melodies: AI Music Generation and
  its 'Nearly' Complete Omission of the Global South," reports that
  roughly 86% of dataset-hours and over 93% of researchers in AI music
  generation work focus on Global North music, and roughly half of surveyed
  papers use symbolic-generation methods that don't capture South Asian
  musical structure well. **This literature reframes the project's own
  data gaps as a documented instance of a known, named, studied structural
  problem in the field** — not simply "this project hasn't gotten to it yet."
  Citing this literature strengthens §10 of the paper (Limitations) by
  situating the project's audio-data blockage inside a recognised field-wide
  pattern, and gives the project grounds to argue (in any future funding or
  collaboration pitch) that filling it is a contribution of general interest
  to MIR, not just to Bangladesh studies.

---

## 3. Network methodology: what the wider literature says about this project's central technique

This is the area with the highest-leverage, lowest-cost improvements available,
because the project's BMPN pipeline (`analysis/scripts/build_bmpn.py`,
`analyze_bmpn.py`) is exactly the kind of construction the network-science
literature has spent two decades refining.

### 3.1 The bill-size correction is right, and has a name

The project's 1/(n−1) per-event edge weighting is methodologically identical to
**Newman's (2001) collaboration-network weighting** for multi-author papers —
the same logic (more co-participants dilutes the strength of any one pairwise
tie) applied to concert bills instead of papers. This is good company to be
in, and the project should cite Newman (2001) directly next to its own
description of the correction in `docs/methodology.md` and the paper's §5 —
right now the correction is described but not attributed to prior art, which
makes it look like an ad hoc fix rather than an application of an established
technique. **Low-cost fix: add the citation.**

### 3.2 But the correction alone doesn't answer the harder question the literature has moved to

Bill-size weighting controls for *how much* an event contributes, but not for
*whether an edge is more than what raw co-occurrence would produce by chance*.
This is exactly the problem the bipartite-network-projection literature has
spent the last 15 years on:

- **Tumminello, Miccichè, Lillo, Piilo & Mantegna (2011), "Statistically
  Validated Networks in Bipartite Complex Systems,"** *PLOS ONE* — introduces
  a hypergeometric-distribution test to assign each projected edge a p-value
  against a null model that accounts for each node's degree in the bipartite
  graph (i.e., how many events an artist appears at, and how large each event
  is), retaining only edges more frequent than chance would predict.
- **Neal, Domagalski & Sagan et al. and follow-on work on "the backbone of
  bipartite projections"** (fixed degree sequence models, Stochastic Degree
  Sequence Model with Edge Constraints) — a family of null models purpose-built
  for exactly the co-authorship/co-sponsorship/co-attendance case the
  project's concert-bill network is an instance of.
- A 2025/2026 arXiv paper, "How null-model constraints affect statistical
  validation in projected bipartite networks," shows the *choice* of null
  model (configuration model vs. hypergeometric approximation vs. partial
  configuration model) materially changes which edges survive validation —
  there is no single "correct" null model, only better- and worse-justified
  ones for a given system.

**What this means concretely for the BMPN.** The project's `co_billing` edge
layer currently treats every shared bill as evidence at a weight set purely by
bill size. It does not ask "is this pair co-billed *more than* two artists of
their respective overall event-frequencies would co-occur by chance?" Lalon
Band and Chirkutt's degree-18 hub status (flagged in the paper's own Result 7
as "programming policy, not audience overlap") is exactly the kind of
high-frequency, low-information hub that statistical backbone extraction is
designed to downweight or flag. Running a Tumminello-style hypergeometric test
(or the simpler fixed-degree-sequence backbone method) over the current
`co_billing` layer, even on today's 23-event dataset, would let the project
report a **second methodological result**, comparable in kind to its
already-published bill-size-correction finding: which co-billing edges survive
statistical validation against a null model, and whether the "national
festival circuit" community (currently the network's largest, per §7.4) is
mostly validated structure or mostly artefact of a few artists appearing at
many undifferentiated festivals. Given the project's demonstrated appetite for
exactly this kind of self-critical methodological result, this is a natural
next analytical script (`analysis/scripts/validate_bmpn_backbone.py`) rather
than new data collection — it can run on the existing 23 events today.

### 3.3 Louvain's known defect, and what to do about it

**Traag, Waltman & van Eck (2019), "From Louvain to Leiden: guaranteeing
well-connected communities,"** *Scientific Reports* 9, arXiv:1810.08473 —
demonstrates that Louvain (the algorithm `analyze_bmpn.py` currently uses,
per the project's stated pipeline) can produce **badly connected or even
internally disconnected communities**, empirically up to 25% badly connected
and 16% disconnected in their benchmarks, especially under iterative
refinement. The Leiden algorithm (same paper) is a drop-in, faster replacement
with an explicit guarantee against this failure mode, implemented in the
widely-used `leidenalg` Python package (which also works directly with
`networkx`/`igraph` graphs, so this is a low-effort swap in
`analyze_bmpn.py`).

**Recommendation, low cost, moderate value:** switch from Louvain to Leiden
(or run both and report whether the six communities are stable across the
swap) — cheap to do, and forecloses a specific, citable objection a reviewer
familiar with the network-science literature would raise against the paper's
central network result.

### 3.4 A sharper critique: is modularity the right question at all?

**Peixoto (2023), *Descriptive vs. Inferential Community Detection in
Networks: Pitfalls, Myths and Half-Truths*** (Cambridge University Press; also
arXiv:2112.00183) makes a stronger claim than the Leiden paper: modularity
maximisation (Louvain or Leiden alike) is a **descriptive** method that
systematically overfits — it finds "significant" community structure even in
random graphs with no real structure, and Peixoto's benchmarks show
**inferential** methods based on the stochastic block model (SBM) provide
better statistical compression on 96%+ of tested empirical networks. This is a
genuinely different and more serious challenge than the Leiden fix: the
project's headline modularity figure of 0.428, reported as evidence the
network is "genuinely structured," is exactly the kind of number this
literature says should not be trusted at face value without a comparison
against degree-preserving random graphs of the same size.

**The project's `data-quality-report.json` and pipeline already compute an
`observed_uncorrected` comparison pass — the infrastructure for a rigour step
like this already exists.** The concrete, cheap addition: generate ~100–1000
configuration-model random graphs preserving each node's degree from the
observed 63-node, 153-edge network, run modularity maximisation on each, and
report the observed 0.428 against that null distribution (a z-score or
percentile). If 0.428 sits far above the random-graph distribution (plausible,
given the paper's own qualitative account of *why* communities form — shared
membership, cited influence — these are not random processes), this becomes a
**stronger, more defensible result**, not a weaker one: "modularity 0.428,
z = X against 500 degree-preserving null graphs" is a claim no reviewer
familiar with Peixoto's critique can wave away, whereas the current
unqualified 0.428 invites exactly that objection. This is the single most
important methodological upgrade available to the project's central network
finding, and it is entirely computable from data already in hand — no new
collection required.

### 3.5 Comparative context: festival-lineup network studies elsewhere

Analyses of major Western festival lineups (e.g. BBC Data Unit's Glastonbury
gender-representation network work, and independent lineup-uniqueness studies
reporting festivals sharing artists with an average of ~7 other festivals in a
dataset) confirm co-billing networks are a live, recognised genre of music
network analysis outside academia too — but none found apply a rigorous null
model either; most report raw overlap counts. This suggests the project, if it
implements §3.2–3.4, would be doing more careful work than the informal
industry-data-journalism baseline, which is a genuine differentiator worth
stating explicitly in the paper's discussion of related work.

---

## 4. Audio and audience data: the landscape has changed since the roadmap was written, and not in the project's favour

The roadmap treats Spotify/YouTube API credentials as *the* blocker, to be
resolved once the project owner registers for access. This needs revision: the
landscape shifted materially on **27 November 2024**, and the shift is a
structural one, not a credentialing delay.

### 4.1 Spotify closed the exact endpoints this project needs — for new applications

On 27 November 2024, Spotify restricted its Web API, and — per multiple
industry-press summaries (Music Ally, Digital Music News; direct fetch of
Spotify's own developer blog post was blocked by this session's network
policy and should be verified independently) — the specific casualties are
**Related Artists, Recommendations, Audio Features, and Audio Analysis**,
along with 30-second preview URLs and several playlist/editorial endpoints.
Crucially: **existing applications already in "extended quota mode" before
that date keep access; new applications cannot get it.** Spotify does not
onboard new extended-mode apps below a 250,000-monthly-active-user threshold.
This project, registering fresh, would very likely be a new application and
would **not** be able to obtain audio features, related-artist adjacency, or
recommendation data at all, regardless of how the credentials are registered.
This is the single biggest correction this research pass makes to the
project's own stated plan.

**What this means for the roadmap's item #1 ("Register Spotify Web API and
YouTube Data API v3 credentials — the one blocker holding back the preference
network").** It is likely no longer true that registering credentials solves
this. The Spotify half of that plan needs to be re-scoped:

- **Audio features are not coming back from Spotify for a new project.**
  Search-industry commentary as of mid-2026 confirms there is still no
  official Spotify replacement 18 months on.
- **What Spotify *does* still give new apps**: basic catalog search, track/
  album/artist metadata (name, popularity score, release dates, genres where
  tagged), and playlist data reachable through non-deprecated endpoints. This
  is enough for some of what the project wants (a popularity proxy, genre
  tags, release timelines that corroborate the discography data already
  collected) but **not** enough for the preference-network construction the
  framework specifies (related-artist adjacency, playlist co-occurrence).

**Recommended replacement path for audio features specifically:**
**AcousticBrainz's final data dump.** AcousticBrainz shut down in February
2022 but published its full ~7.5-million-track dataset (submissions ~29.4
million; dumps of low-level features — BPM, key, MFCCs, ~120 descriptors — and
high-level features — mood, genre, instrument tags) under a **CC0 licence**
before going dark, and the dumps remain downloadable from
`acousticbrainz.org/download`. Coverage of Bangladeshi acts in that corpus is
unknown and needs a direct check (search the dump for the project's 63
MusicBrainz-linkable artist names) — if coverage is thin or absent, the
practical alternative the field has converged on is **self-extracting
features from source audio using open-source libraries (Essentia, from the
same MTG/UPF group behind CompMusic and originally behind AcousticBrainz, or
librosa)** against YouTube-hosted official audio, which sidesteps Spotify
entirely and is exactly the tool used to build the AcousticBrainz corpus in
the first place. This is a real project (weeks of engineering, not a
credential form), but it is the field's actual current path, and it produces
features that are licence-clean and don't depend on any platform's continued
goodwill.

### 4.2 YouTube Data API v3 is comparatively viable, with real constraints stated plainly

Unlike Spotify, YouTube's API was not deprecated in the same way. As of 2026,
the free tier gives 10,000 quota units/day per Google Cloud project; a single
`search` call costs 100 units (≈100 searches/day free), while reading a
video's statistics costs 1 unit. For this project's actual need — pulling
view/like/comment counts for a known, bounded list of official videos per
catalogued artist, rather than open-ended searching — the quota is workable
without a paid tier: video-statistics reads are cheap, and the expensive
operation (search) can be minimised by resolving video IDs once and caching
them. **This is the more realistic near-term audience-side data source**, and
the roadmap should distinguish it from Spotify rather than bundling both under
one "credentials" blocker. Recommendation: pursue YouTube Data API access
first and independently of Spotify; it is both more likely to succeed and
sufficient for a first-pass engagement-metric layer (views/likes/comments over
time per official upload) that the current BMPN has no equivalent of at all.

### 4.3 A genuinely new, low-cost audience-data option the roadmap has not considered

Neither the roadmap nor the methodology document considers running a **direct,
small-scale primary survey** — despite this being exactly the method the newly
found "Music Consumption on Digital Platforms: A Study on Bangladeshi
University Students" paper (§2.3 above) used, cheaply, to produce real
audience-side findings for a comparable population. A short structured survey
distributed through university music societies, Facebook fan groups for
catalogued artists, or in partnership with a journalism contact would not
scale to a full preference network, but it would produce the project's
**first primary audience-side data point of any kind** — something no amount
of API access substitutes for, because APIs give behavioural proxies, not
stated preferences or identity narratives. This is cheap, ethically
straightforward under the project's own stated ethics section (public,
aggregate, consenting respondents), and directly answerable to the BMEM's
"Listener Preference Networks" dimension in a way the co-appearance network
structurally cannot be. **This is the single highest-value new idea in this
document for closing the project's most-repeated limitation** (see roadmap
item #2 discussion in §7 below).

### 4.4 Concert data: a real API exists and the roadmap hasn't named it

The roadmap's #2 and #3 priorities (hip-hop/urban events, university festival
lineups) are framed purely as manual research tasks. **setlist.fm's REST API**
is free for non-commercial use with a registered API key, indexes concerts by
artist/venue/city/country, and uses MusicBrainz IDs for artist identity — which
matters because MusicBrainz-artist-linking is a natural companion improvement
(§6.3 below). Coverage of small/regional Bangladeshi acts on setlist.fm is
almost certainly thin (it is crowd-contributed, and skews toward
internationally-touring acts), so this will not solve the hip-hop/university
gap outright, but it costs nothing to query against the current 63-artist
catalogue and may surface diaspora-tour dates (a category the project already
tracks, e.g. Artcell's Canada/Australia tours) that manual search missed.
Bandsintown and Songkick have comparable but commercially-licensed data;
lower priority given cost.

---

## 5. Industry and economic context: filling BMEM Dimension 6

The project's own validation document rates Dimension 6 (Industry
Transformation) as "largely untested." This search closes part of that gap
with citable, if still needing full-text verification, sources:

- **Ringback/caller tunes as an industry-defining revenue mechanism.**
  Background research confirms that in the 2000s Bangladeshi mobile operators
  monetised ringback/caller tunes from label catalogues, initially without
  rights-holder consent, before an accommodation emerged; ringback tones were
  a very large (hundreds-of-millions-of-dollars-scale, in comparable South
  Asian/African markets) revenue category before streaming. **The project's
  current industry narrative jumps from "cassette era" to "streaming"
  (frameworks/bmem.md Dimension 6) and has no place for this intermediate,
  telecom-mediated monetisation era**, which by several regional accounts was
  the dominant Bangladeshi music-industry revenue model through roughly the
  2000s–early 2010s, arguably more consequential than CD sales. This is a
  structural gap in the framework, not just a missing citation — recommend
  adding a "telecom/ringback era" phase between CD and streaming in BMEF's
  temporal-phases table (§3 of `frameworks/bmef.md`).
- **Labels (G Series, CD Choice, Soundtek, Anupam Music, Laser Vision, Chena
  Sur, Ektaar Music) and their digital pivot** are now documented in the 2025
  Rajshahi University study (§2.3) and in scattered label-history sources
  (Wikipedia label pages, Business Standard coverage of labels moving into
  drama/web-series production as music revenue thinned). Ektaar Music is
  specifically flagged in background sources as a royalty-payment pioneer —
  worth its own citation given the project's stated interest in monetisation
  as an untested BMEM claim.
- **Bangladesh-specific music-market sizing reports exist commercially** (e.g.
  a "Bangladesh Music Market (2025–2031)" industry report was surfaced) but
  are paywalled market-research products, not academic sources — flag as a
  possible paid-access source to check if the project's owner has any
  institutional access, but do not rely on it uncited.

---

## 6. Concrete, prioritised recommendations for the project

Ranked by (evidence strength this document found) × (cost to implement) ×
(how directly it fixes something the project has already flagged as a
weakness). "No new data" items are the highest-leverage because they act on
data already in the repository.

### 6.1 No new data required — pure methodology, do these first

1. **Null-model significance test for modularity** (§3.4). Generate
   degree-preserving random graphs, report observed modularity as a z-score
   against them. Directly answers the Peixoto critique before a reviewer
   raises it. New script, ~half a day.
2. **Swap Louvain for Leiden** (or run both) in `analyze_bmpn.py` (§3.3).
   Cheap, forecloses a specific known defect.
3. **Statistical backbone extraction on the co_billing layer** (§3.2) — a
   Tumminello-style hypergeometric validation pass, reported as a fourth
   analytical pass alongside `observed`/`full`/`co_billing`. This would let
   the paper report, for the first time, which specific co-billing edges are
   statistically distinguishable from what artist/event degree alone would
   predict — directly relevant to the paper's own doubt about whether Lalon
   Band/Chirkutt's centrality is "programming policy" (their words) or real
   structure.
4. **Cite Newman (2001)** next to the bill-size correction in
   `docs/methodology.md` and the paper. One sentence.
5. **Add the telecom/ringback era to BMEF's temporal phases** (§5 above).
   Framework text edit, no data collection.

### 6.2 Literature and framework edits — verify then write

6. **Verify and integrate Hossain (2026)** on hip-hop and the July 2024
   uprising (§2.1) — the highest-value literature addition found. Use it to
   correct the hip-hop `political_or_social` documentation artefact the
   paper's §7.3 already flags, with a citable source rather than an assertion.
7. **Add a Coke Studio Bangla academic citation and the "supply-chain
   capitalism" framing** (§2.2) to Dimension 5/6 discussion in
   `frameworks/bmem-validation.md`.
8. **Cite the two 2025 Bangladeshi digital-consumption/industry studies**
   (§2.3) in the methodology and Dimension 6 discussion.
9. **Add a short "Decolonising MIR" paragraph to Limitations** (§10 of the
   paper), citing the ISMIR bibliometric study and the "Missing Melodies"
   paper (§2.5), reframing the project's audio-data gap as a documented,
   field-wide structural problem rather than only a local blocker — this
   strengthens rather than weakens the project's credibility.

### 6.3 Schema and data-collection changes

10. **Add `music_brainz_id` (and optionally `wikidata_id`) as optional artist
    schema fields.** Enables querying setlist.fm and AcousticBrainz
    programmatically against the existing catalogue with no manual relinking
    later, and is a near-zero-cost schema addition (`data/schemas/artist.schema.json`).
11. **Query setlist.fm's free API against the current 63-artist catalogue**
    (§4.4) before doing more manual event research — may surface diaspora-tour
    dates cheaply.
12. **Design and run a short primary audience survey** (§4.3) through
    university music societies / artist fan groups — the project's first
    primary audience-side data point, addressing the single most-repeated
    limitation in the paper (no audience data of any kind) at a cost the
    blocked APIs cannot match. This should be scoped modestly: a validated
    instrument on genre identification and listening-community questions, not
    an attempt to reconstruct the full preference network from survey data
    alone.
13. **Re-scope the roadmap's API-credentials item.** Split "register Spotify
    Web API and YouTube Data API v3 credentials" into two separate,
    differently-prioritised items: YouTube (workable now, pursue first) and
    Spotify audio-features (very likely unobtainable for a new registrant;
    replace with the AcousticBrainz-dump-plus-Essentia-extraction path
    instead of waiting on credentials that a new application will not
    receive).

### 6.4 Longer-horizon, higher-cost

14. Explore MERT or comparable self-supervised audio-representation models
    (§2.5) as a lower-effort alternative to full Essentia feature engineering,
    once any source audio is obtainable — MERT operates at a fraction of
    prior large audio models' parameter count and is open-source, making it
    plausible for a project at this resourcing level, in a way a
    from-scratch deep-learning pipeline would not be.
15. If the project ever moves toward tradition-specific musical description
    (Baul, Bhatiali, Bhawaiya melodic/rhythmic structure — currently absent
    from the schema entirely), the CompMusic/Dunya model (§2.5) is the right
    template: build description tools fitted to the tradition rather than
    assuming Western MIR features transfer. This is explicitly a "next
    iteration" item, not near-term.

---

## 7. What this changes about the roadmap, stated plainly

The existing `docs/roadmap.md` "Immediate next actions" list treats API
credentials as the single blocker unlocking almost everything audience-side.
This document's central correction: **that is no longer accurate for
Spotify specifically**, and conflating Spotify and YouTube under one
"credentials" blocker obscures that YouTube is tractable now while Spotify's
most valuable endpoints (audio features, related artists, recommendations)
are closed to new applications regardless of credentials. The roadmap should
be updated to reflect this — YouTube pursued directly, Spotify's audio-feature
ambition redirected to AcousticBrainz + open-source extraction, and a cheap
primary survey added as a genuinely new option the original plan did not
consider. None of the network-methodology recommendations (§6.1) require
touching this blocker at all and can proceed immediately on the existing
dataset.

---

## Sources consulted in this pass

Full bibliographic entries should be added to `docs/annotated-bibliography.md`
after full-text verification; informal citations here, in order of
appearance:

- Hossain, T. (2026). Voice for justice: Hybrid cultural resistance of hip-hop
  songs and memes in July mass uprising, Bangladesh. SAGE. DOI:
  10.1177/13678779261452687. *(Full text not retrieved this pass — journal
  domain blocked; verify before citing in the paper.)*
- "Beyond Appropriation and Commodification: The Making of Coke Studio
  Bangla's Complex Subjects." ResearchGate record 388400913. *(Author name
  and venue need full-text confirmation.)*
- "Music Industry on Digital Platform: A Study on Five Major Music Labels of
  Bangladesh." Rajshahi University Journal of Social Science and Business
  Studies (June 2025). ResearchGate record 392904977.
- "Music Consumption on Digital Platforms: A Study on Bangladeshi University
  Students." International Journal of Research and Innovation in Social
  Science (RSIS International). *(Author names not retrieved; domain
  blocked.)*
- Mauch, M., MacCallum, R. M., Levy, M., & Leroi, A. M. (2015). The evolution
  of popular music: USA 1960–2010. Royal Society Open Science, 2(5), 150081.
  arXiv:1502.05417.
- CompMusic project (Serra, X. et al., 2011–2017), Universitat Pompeu Fabra;
  Dunya corpora.
- "Beyond a Western Center of Music Information Retrieval: A Bibliometric
  Analysis of the First 25 Years of ISMIR Authorship." Transactions of the
  International Society for Music Information Retrieval (2026).
- "Missing Melodies: AI Music Generation and its 'Nearly' Complete Omission of
  the Global South." arXiv:2412.04100 (2024).
- Newman, M. E. J. (2001). The structure of scientific collaboration networks.
  PNAS.
- Tumminello, M., Miccichè, S., Lillo, F., Piilo, J., & Mantegna, R. N.
  (2011). Statistically validated networks in bipartite complex systems. PLOS
  ONE, 6(3), e17994.
- Traag, V. A., Waltman, L., & van Eck, N. J. (2019). From Louvain to Leiden:
  guaranteeing well-connected communities. Scientific Reports, 9, 5233.
  arXiv:1810.08473.
- Peixoto, T. P. (2023). Descriptive vs. inferential community detection in
  networks: pitfalls, myths and half-truths. Cambridge University Press.
  arXiv:2112.00183.
- Spotify for Developers blog, "Introducing some changes to our Web API" (27
  Nov 2024). *(Direct fetch blocked by session network policy; corroborated
  via Music Ally and Digital Music News summaries — verify against the
  primary post before citing.)*
- AcousticBrainz project data dumps (acousticbrainz.org/download); MetaBrainz
  blog, "AcousticBrainz: Making a hard decision to end the project" (Feb
  2022).
- YouTube Data API v3 documentation and third-party 2026 quota guides
  (elfsight.com, getphyllo.com, socialcrawl.dev) — verify current quota
  figures against Google's own documentation before relying on them
  operationally.
- setlist.fm API documentation (api-evangelist.com mirror).
- Background industry sources on Bangladeshi ringback-tone monetisation and
  record labels (G Series, CD Choice, Ektaar Music) — Wikipedia label pages
  and Business Standard coverage; treat as secondary/background, not
  citable-grade.

**Last updated**: 2026-08-27.
