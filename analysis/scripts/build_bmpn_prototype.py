#!/usr/bin/env python3
"""Prototype builder for the Bangladesh Music Preference Network (BMPN).

Reads artist metadata (data/artists/*/metadata.json) and concert/event
records (data/concerts/*.json), then builds a co-occurrence graph where
nodes are artists and edges represent shared concert bills. This is a
first-pass prototype based on publicly documented co-billing only; it
does not yet incorporate streaming/playlist co-occurrence data (see
roadmap.md next actions).

Output: data/networks/bmpn-prototype.json (nodes + weighted edges).
"""
import json
import glob
from collections import defaultdict
from itertools import combinations
from pathlib import Path

REPO_ROOT = Path(__file__).resolve().parents[2]
ARTISTS_DIR = REPO_ROOT / "data" / "artists"
CONCERTS_DIR = REPO_ROOT / "data" / "concerts"
OUTPUT_PATH = REPO_ROOT / "data" / "networks" / "bmpn-prototype.json"


def load_artists():
    artists = {}
    for path in sorted(ARTISTS_DIR.glob("*/metadata.json")):
        data = json.loads(path.read_text())
        artists[data["id"]] = data
    return artists


def load_concerts():
    concerts = []
    for path in sorted(CONCERTS_DIR.glob("*.json")):
        if path.name == "README.md":
            continue
        concerts.append(json.loads(path.read_text()))
    return concerts


def build_network(artists, concerts):
    edge_weights = defaultdict(int)
    edge_events = defaultdict(list)
    node_genres = {aid: a.get("genres", []) for aid, a in artists.items()}
    node_event_count = defaultdict(int)

    for concert in concerts:
        artist_ids = sorted({
            a["artist_id"] for a in concert.get("artists", [])
            if a["artist_id"] in artists
        })
        for aid in artist_ids:
            node_event_count[aid] += 1
        for a, b in combinations(artist_ids, 2):
            edge_weights[(a, b)] += 1
            edge_events[(a, b)].append(concert["id"])

    nodes = [
        {
            "id": aid,
            "name": artists[aid]["name"],
            "genres": node_genres[aid],
            "event_count": node_event_count.get(aid, 0),
        }
        for aid in artists
    ]

    edges = [
        {
            "source": a,
            "target": b,
            "weight": w,
            "shared_events": edge_events[(a, b)],
        }
        for (a, b), w in sorted(edge_weights.items())
    ]

    return {
        "description": (
            "Prototype Bangladesh Music Preference Network (BMPN) built from "
            "publicly documented concert co-billing only. Nodes = artists in "
            "data/artists/; edges = artists that shared a concert bill in "
            "data/concerts/, weighted by number of shared events. This is an "
            "early proxy for audience/genre-community structure, not a "
            "validated preference network — streaming/playlist co-occurrence "
            "and social-listening data are needed for a fuller model (see "
            "docs/roadmap.md)."
        ),
        "node_count": len(nodes),
        "edge_count": len(edges),
        "isolated_node_count": sum(1 for n in nodes if n["event_count"] == 0),
        "nodes": nodes,
        "edges": edges,
    }


def main():
    artists = load_artists()
    concerts = load_concerts()
    network = build_network(artists, concerts)
    OUTPUT_PATH.parent.mkdir(parents=True, exist_ok=True)
    OUTPUT_PATH.write_text(json.dumps(network, indent=2, ensure_ascii=False) + "\n")
    print(f"Wrote {OUTPUT_PATH} — {network['node_count']} nodes, "
          f"{network['edge_count']} edges "
          f"({network['isolated_node_count']} isolated / no concert data yet)")


if __name__ == "__main__":
    main()
