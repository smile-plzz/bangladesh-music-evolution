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

_GENERIC_MARKERS = (
    "general", "tradition", "unspecified", "circuit", "scene", "production",
    "instrumentation", "repertoire", "education", "comic book", "literary",
    "contemporaneous", "multi-subgenre",
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
    lowered = raw.lower()
    generic = any(m in lowered for m in _GENERIC_MARKERS)
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
        elif generic or any(m in plow for m in _GENERIC_MARKERS):
            out.append((part.title() if part.islower() else part, "tradition"))
        else:
            out.append((part, "global_artist"))
    return out


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
