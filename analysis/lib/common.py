"""Shared loaders and normalisation helpers for the analysis scripts.

Every script in ``analysis/scripts/`` reads the same three primary sources —
artist metadata, concert records, and the JSON schemas — so the loading and
string-normalisation logic lives here rather than being duplicated.
"""
import json
import re
from pathlib import Path

REPO_ROOT = Path(__file__).resolve().parents[2]
ARTISTS_DIR = REPO_ROOT / "data" / "artists"
CONCERTS_DIR = REPO_ROOT / "data" / "concerts"
NETWORKS_DIR = REPO_ROOT / "data" / "networks"
SCHEMAS_DIR = REPO_ROOT / "data" / "schemas"
ANALYSIS_OUT = REPO_ROOT / "analysis" / "outputs"
VIZ_OUT = REPO_ROOT / "analysis" / "visualizations"


def load_artists():
    """Return {artist_id: metadata dict} for every catalogued artist."""
    artists = {}
    for path in sorted(ARTISTS_DIR.glob("*/metadata.json")):
        data = json.loads(path.read_text())
        artists[data["id"]] = data
    return artists


def load_concerts():
    """Return a list of concert/event records, sorted by date then id."""
    concerts = []
    for path in sorted(CONCERTS_DIR.glob("*.json")):
        concerts.append(json.loads(path.read_text()))
    concerts.sort(key=lambda c: (c.get("date", ""), c.get("id", "")))
    return concerts


def write_json(path, payload):
    path.parent.mkdir(parents=True, exist_ok=True)
    path.write_text(json.dumps(payload, indent=2, ensure_ascii=False) + "\n")
    return path


def write_csv(path, header, rows):
    import csv
    path.parent.mkdir(parents=True, exist_ok=True)
    with path.open("w", newline="") as fh:
        writer = csv.writer(fh)
        writer.writerow(header)
        writer.writerows(rows)
    return path


# --- genre normalisation -------------------------------------------------
#
# Artist records carry free-text genre lists ("Progressive Metal", "Nu Metal",
# "Folk Fusion", ...). The BMEM works with seven top-level strands, so map the
# free text onto those strands while keeping the raw list for detail.
#
# Each raw genre token resolves to exactly one strand (first rule that fires,
# most specific first). An artist's strand is then the strand with the highest
# positional score, where the genre listed first counts 1, the second 1/2, the
# third 1/3 and so on -- artist records list their primary genre first.

GENRE_STRANDS = [
    "Mainstream Rock",
    "Progressive Rock/Metal",
    "Heavy Metal",
    "Alternative/Indie",
    "Pop",
    "Hip-Hop/Rap",
    "Folk & Folk Fusion",
]

_TOKEN_RULES = [
    ("Hip-Hop/Rap", ("hip-hop", "hip hop", "rap", "trap", "drill", "mc")),
    ("Progressive Rock/Metal", ("progressive", "prog ")),
    ("Alternative/Indie", ("nu metal", "nu-metal")),
    ("Folk & Folk Fusion", ("folk", "baul", "fusion", "lalon", "bhawaiya",
                            "bhatiali", "world music")),
    ("Heavy Metal", ("metal", "thrash", "death", "grindcore", "metalcore",
                     "symphonic", "groove", "speed", "power")),
    ("Alternative/Indie", ("alternative", "indie", "grunge", "experimental",
                           "psychedelic", "post-rock", "shoegaze")),
    ("Mainstream Rock", ("pop rock",)),
    ("Pop", ("pop", "r&b", "electronic", "edm", "playback", "adhunik",
             "urban")),
    ("Mainstream Rock", ("rock", "blues", "reggae", "jazz", "funk", "soul",
                         "band music")),
]

# Where the project's own curated groupings (data/genres/genre-overview.md and
# data/artists/README.md) place an artist in a different strand than the
# token-scoring above produces, the curated placement wins. Kept explicit and
# small so the disagreement stays visible rather than being tuned away.
_STRAND_OVERRIDES = {
    "nova": "Mainstream Rock",          # 1970s-80s hard/psych rock, pre-"alternative"
    "nemesis": "Alternative/Indie",     # README groups Nemesis with alternative
    "metal-maze": "Heavy Metal",        # README groups Metal Maze with the metal scene
}


def token_strand(token):
    """Resolve a single raw genre token to one BMEM strand (or None)."""
    t = (token or "").lower()
    for strand, keys in _TOKEN_RULES:
        if any(k in t for k in keys):
            return strand
    return None


def strand_scores(genres):
    """Positional scores per strand for a raw genre list."""
    scores = {}
    for i, g in enumerate(genres or []):
        strand = token_strand(g)
        if strand:
            scores[strand] = scores.get(strand, 0.0) + 1.0 / (i + 1)
    return scores


def genre_strand(genres, artist_id=None):
    """The single BMEM strand an artist belongs to."""
    if artist_id and artist_id in _STRAND_OVERRIDES:
        return _STRAND_OVERRIDES[artist_id]
    scores = strand_scores(genres)
    if not scores:
        return "Unclassified"
    return max(scores.items(), key=lambda kv: kv[1])[0]


def all_strands(genres):
    """Every BMEM strand a raw genre list touches (artists are often plural)."""
    return sorted(strand_scores(genres), key=lambda s: GENRE_STRANDS.index(s))


# --- influence normalisation ---------------------------------------------
#
# ``global_influences[].artist_or_genre`` is free text and often bundles
# several acts into one string ("Sepultura / Pantera / Opeth"). Split those
# into individual tokens, separate named acts from generic tradition labels,
# and separate foreign acts from domestic (Bangladeshi) ones — a domestic
# citation is evidence of internal scene transmission, not global influence.

# Markers tested against the individual split part: they say that part names a
# convention rather than an act.
_PART_GENERIC_MARKERS = (
    "general", "tradition", "unspecified", "circuit", "scene", "production",
    "instrumentation", "repertoire", "contemporaneous", "multi-subgenre",
    "peers", "lineage",
)

# Markers tested against the whole raw citation: they say the citation names a
# convention rather than an act, even where the split parts do not say so
# themselves. "(general)" is the common case -- it annotates the citation, and
# _clean_token strips parentheticals before the per-part test runs.
_RAW_GENERIC_MARKERS = ("general", "unspecified")

# Markers tested against the whole raw citation: they say the source being
# named is not a musical act at all, so no part of it should count as one.
_RAW_NONACT_MARKERS = (
    "comic book", "literary", "literature", "education", "band name origin",
    "video game", "screen",
)

DOMESTIC_ENTITIES = {
    "artcell", "cryptic fate", "rockstrata", "owned", "azam khan", "feedback",
    "black", "bangla", "habib wahid", "warfaze", "souls", "miles", "lrb",
    "nemesis", "aurthohin",
}


def _clean_token(tok):
    tok = re.sub(r"\([^)]*\)", " ", tok)      # drop parentheticals
    tok = re.sub(r"—.*$", " ", tok)            # drop em-dash annotations
    tok = re.sub(r"\bvia\b.*$", " ", tok, flags=re.I)
    tok = re.sub(r"\s+", " ", tok).strip(" .,;-")
    return tok


def split_influence(raw):
    """Split one free-text influence string into normalised tokens.

    Returns a list of ``(token, kind)`` where kind is ``"global_artist"``,
    ``"domestic_artist"`` or ``"tradition"``.
    """
    if not raw:
        return []
    # Genericness is judged per split part, not across the whole string: in
    # "Karsh Kale / British-Asian electronic music scene" the first part names
    # an artist and the second names a convention, and judging the whole string
    # made both tradition. Parentheticals are provenance annotations, not genre
    # labels, so "(via early cover repertoire)" no longer turns the bands it
    # annotates into traditions.
    lowered = raw.lower()
    nonact = (any(m in lowered for m in _RAW_NONACT_MARKERS)
              or any(m in lowered for m in _RAW_GENERIC_MARKERS))
    body = _clean_token(raw)
    if not body:
        return []
    parts = [p.strip() for p in re.split(r"[/,]| and ", body) if p.strip()]
    out = []
    for part in parts:
        part = _clean_token(part)
        if not part or len(part) < 2:
            continue
        plow = part.lower()
        if plow in DOMESTIC_ENTITIES:
            out.append((part, "domestic_artist"))
        elif nonact or any(m in plow for m in _PART_GENERIC_MARKERS):
            out.append((part.title() if part.islower() else part, "tradition"))
        else:
            out.append((part, "global_artist"))
    return out


# Words that make a token a genre label rather than the name of an act. A token
# built only from these (plus qualifiers and stopwords) is a tradition however
# it was written -- "American Hip-Hop" and "Western Rock" are genres, not bands.
_GENRE_WORDS = {
    "rock", "metal", "pop", "jazz", "blues", "folk", "hip-hop", "hip", "hop",
    "rap", "funk", "reggae", "soul", "electronic", "edm", "techno", "grunge",
    "punk", "r&b", "indie", "alternative", "psychedelic", "progressive",
    "thrash", "death", "symphonic", "classical", "world", "drill", "trap",
    "fusion", "ballad", "country", "baul", "sufi", "qawwali",
}
_GENRE_QUALIFIERS = {
    "american", "western", "contemporary", "south", "asian", "indian",
    "british", "uk", "us", "modern", "global", "international", "european",
    "african", "bangla", "bengali", "nu", "hard", "soft", "heavy",
    "mainstream", "acoustic", "urban", "underground", "power", "speed",
    "brutal", "technical", "groove", "melodic", "experimental", "post",
    "traditions", "tradition", "music", "general", "scene", "production",
    "broader", "classic", "mellow", "melody", "influenced", "protest",
    "festival", "circuit", "band", "lineage", "and", "of", "the", "&", "/",
    "-",
}


def _is_genre_label(token):
    words = [w for w in re.split(r"[\s/&-]+", token.lower()) if w]
    if not words:
        return False
    return all(w in _GENRE_WORDS or w in _GENRE_QUALIFIERS for w in words)


def resolve_token_kinds(artists):
    """Decide each canonical influence token's kind once, over the whole corpus.

    ``split_influence`` classifies from the surrounding string, so the same act
    can come out as a named artist in one citation and as a tradition in
    another: "Metallica / Megadeth / Pantera" yields global_artist, while
    "Megadeth / Metallica / Judas Priest (via early cover repertoire)" is marked
    generic by the word "repertoire" and yields tradition for all three. That
    produced two different counts for the same influence depending on which
    cross-tab you read.

    Resolution order: a token that reads as a pure genre label is a tradition
    however it was written; otherwise a token is a named global artist if *any*
    occurrence classifies it as one; otherwise it keeps the kind it was most
    often given. Both consumers of the influence data use this map so the counts
    agree.
    """
    from collections import Counter, defaultdict
    seen = defaultdict(Counter)
    for a in artists.values():
        for infl in (a.get("global_influences") or []):
            for tok, kind in split_influence(infl.get("artist_or_genre")):
                seen[canonical_influence(tok)][kind] += 1
    resolved = {}
    for canon, kinds in seen.items():
        if _is_genre_label(canon):
            resolved[canon] = "tradition"
        elif kinds.get("global_artist"):
            resolved[canon] = "global_artist"
        else:
            resolved[canon] = kinds.most_common(1)[0][0]
    return resolved


def canonical_influence(tok):
    """Fold spelling variants of the same influence onto one label."""
    t = tok.strip().lower()
    fixes = {
        "motorhead": "Motörhead",
        "motörhead": "Motörhead",
        "guns n' roses": "Guns N' Roses",
        "american hip-hop": "American Hip-Hop",
        "american hip hop": "American Hip-Hop",
        "american rap": "American Hip-Hop",
        "african american rap": "American Hip-Hop",
        "queens of the stone age": "Queens of the Stone Age",
        "the beatles": "The Beatles",
        "the doors": "The Doors",
        "nu metal": "Nu Metal",
        "grunge": "Grunge",
    }
    if t in fixes:
        return fixes[t]
    return " ".join(w if w.isupper() else w.capitalize() for w in tok.split())


def decade(year):
    if not year:
        return None
    return (int(year) // 10) * 10
