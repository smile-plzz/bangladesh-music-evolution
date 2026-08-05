# Methodology

## Research Design

This study adopts a **secondary data analysis** and **computational social science / digital humanities** approach. Rather than collecting primary survey data or conducting new interviews as the primary method, it synthesizes publicly available digital footprints, streaming metadata, social media interactions, concert histories, and historical records to reconstruct the evolution of Bangladesh's music culture.

This approach is particularly suitable because:
- Large volumes of music-related digital data already exist in the public domain.
- Online listening behavior, social networks, and digital traces provide observable proxies for preference and community formation.
- Historical and contemporary sources can be triangulated for validation.
- The resulting datasets and frameworks can be openly shared for reproducibility.

---

## Data Sources

### 1. Music Streaming Platforms
- Spotify artist pages and playlists
- YouTube Music
- Apple Music (where publicly accessible)

**Collected variables**: popular tracks, related artists, monthly listeners (where available), playlist co-occurrence, release timelines, genre tags.

### 2. YouTube
- Official artist and label channels
- High-view music videos and live performances

**Variables**: views, likes, comment volume and content, upload frequency, engagement rates, trending status.

### 3. Social Media
- Facebook (pages, events, public groups)
- Instagram
- TikTok
- X (Twitter)

**Variables**: followers, engagement metrics, viral trends, fan interactions, collaboration announcements, event promotion.

### 4. Concert & Live Music Data
One of the novel components of the research.

**Sources**: Facebook Events, ticketing platforms, university festival announcements, concert posters, organizer websites, artist pages, news coverage.

**Variables**: venue type (indoor/outdoor), capacity, ticket price ranges, attendance estimates, headlining and supporting artists, event frequency, geographic location, audience descriptors (where public).

### 5. Music Communities
- Public Facebook fan groups
- Reddit threads (if relevant)
- YouTube comment sections
- Public Discord servers and music forums

**Variables**: frequently mentioned artists, co-occurring recommendations, community language and identity markers, emerging genre discussions.

### 6. Historical & Documentary Sources
- Newspaper and magazine archives
- Music blogs and online magazines
- Wikipedia and discography sites
- Record label archives (public)
- Academic literature
- Artist interviews, documentaries, podcasts

Used primarily for timeline construction and triangulation of influence claims.

### 7. Sound Evolution Materials
- Album discographies and release metadata
- Live performance recordings and YouTube performances
- Album reviews and critical commentary
- Public statements by artists about influences and production

---

## Analytical Techniques

### Temporal Analysis
Track longitudinal changes in:
- Genre popularity and representation
- Artist activity and release patterns
- Concert frequency and scale
- Platform-specific metrics (views, streams, engagement)

### Network Analysis — Bangladesh Music Preference Network (BMPN)

**Nodes**:
- Artists
- Genres
- Concerts / events
- Listener communities / fan groups

**Edges**:
- Shared audiences (inferred from playlist co-occurrence, comment overlap, event co-attendance)
- Playlist co-occurrence
- Concert co-appearance (lineups)
- Recommendation relationships
- Social media associations and collaborations

**Methods**: graph construction, community detection algorithms (e.g., Louvain, Leiden), centrality measures, temporal network snapshots.

### Community Detection
Identify statistically meaningful listener ecosystems such as:
- Mainstream rock / nostalgia audiences
- Progressive & metal dedicated communities
- Indie / alternative / literary audiences
- Folk revival & fusion listeners
- Hip-hop / urban youth clusters
- Experimental / niche scenes

### Concert Ecosystem Analysis
Model concerts not merely as events but as cultural spaces with distinct characteristics:

| Type                        | Audience Profile              | Interaction Style          | Identity Function                  |
|-----------------------------|-------------------------------|----------------------------|------------------------------------|
| Large open-air headliners   | Broad, multi-generational     | Communal, sing-along       | National / nostalgic belonging     |
| University festivals        | Students + mixed              | Eclectic, discovery        | Youth culture & experimentation    |
| Independent indoor gigs     | Smaller, dedicated            | Intimate, attentive        | Alternative / artistic identity    |
| Metal & rock festivals      | High-commitment fans          | High energy, repeat        | Subcultural belonging              |
| Hip-hop / urban events      | Youth-oriented                | Digital-first, participatory | Urban & generational identity    |

### Sentiment & Thematic Analysis (NLP)
Analyze public comments and discussions for recurring themes:
- Emotional attachment and nostalgia
- Authenticity and "real music" discourses
- Musical complexity vs. accessibility
- Community and identity claims
- Critiques of commercialization or "foreign" influence

### Sound Evolution Analysis
For selected key bands/artists, examine change across albums and eras on dimensions such as:
- Tempo and rhythmic complexity
- Instrumentation and arrangement density
- Harmonic language
- Song structure and length
- Lyrical themes and poetic style
- Production, mixing, and mastering aesthetics
- Incorporation of folk or traditional elements
- Use of electronic or experimental textures
- Language choices and vocal delivery

**Example case studies** (to be developed):
- **Artcell**: early raw progressive metal → later atmospheric, refined, conceptual work
- **Meghdol**: psychedelic/alternative foundations → richer textures and literary experimentation
- **Warfaze / Powersurge**: technical and production evolution within the metal tradition
- Selected pop and hip-hop artists: digital production and viral aesthetics

---

## Validation Strategy

Findings will be considered robust when consistent across multiple independent data sources (e.g., streaming patterns + social discussion + concert lineups + historical accounts).

Influence claims will be supported by triangulation of:
- Artist public statements
- Musical analysis
- Contemporary reviews
- Network proximity in preference data

---

## Ethical Considerations

- Only publicly available data is used.
- No private messages or non-public group content is scraped.
- Aggregate and anonymized community-level analysis is prioritized over individual identification where possible.
- Attribution and citation of sources (artists, platforms, publications) is maintained.

---

## Expected Deliverables from Analysis

1. Bangladesh Music Evolution Timeline (1971–Present)
2. Bangladesh Music Preference Network (BMPN) graph and community map
3. Listener Preference Trees for major artists/genres
4. Concert Ecosystem Map
5. Genre Evolution Map
6. Sound Evolution case study reports
7. Future Trend Forecast
8. Open datasets and analysis notebooks (where licensing permits)
