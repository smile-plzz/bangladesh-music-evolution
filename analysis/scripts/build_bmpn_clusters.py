#!/usr/bin/env python3
"""Connected-component clustering over the BMPN prototype.

The current graph (concert co-billing only, 38 edges) is too sparse for
modularity-based community detection (e.g. Louvain) to be meaningful --
most components are small and the result would overfit noise. Connected
components give an honest, minimal first pass at "who has publicly
shared a stage with whom" until streaming/playlist co-occurrence data
(see roadmap.md) can support richer community detection.

Output: data/networks/bmpn-clusters.json
"""
import json
from pathlib import Path
from collections import defaultdict

REPO_ROOT = Path(__file__).resolve().parents[2]
NETWORK_PATH = REPO_ROOT / "data" / "networks" / "bmpn-prototype.json"
OUTPUT_PATH = REPO_ROOT / "data" / "networks" / "bmpn-clusters.json"


def find(parent, x):
    while parent[x] != x:
        parent[x] = parent[parent[x]]
        x = parent[x]
    return x


def union(parent, a, b):
    ra, rb = find(parent, a), find(parent, b)
    if ra != rb:
        parent[ra] = rb


def main():
    net = json.loads(NETWORK_PATH.read_text())
    node_by_id = {n["id"]: n for n in net["nodes"]}
    parent = {n["id"]: n["id"] for n in net["nodes"]}

    for e in net["edges"]:
        union(parent, e["source"], e["target"])

    groups = defaultdict(list)
    for n in net["nodes"]:
        groups[find(parent, n["id"])].append(n["id"])

    clusters = []
    isolated = []
    for members in groups.values():
        if len(members) == 1:
            isolated.append(members[0])
            continue
        genre_counts = defaultdict(int)
        for m in members:
            for g in node_by_id[m].get("genres", []):
                genre_counts[g] += 1
        top_genres = sorted(genre_counts, key=genre_counts.get, reverse=True)[:3]
        clusters.append({
            "members": sorted(members),
            "size": len(members),
            "dominant_genres": top_genres,
        })

    clusters.sort(key=lambda c: c["size"], reverse=True)

    output = {
        "description": (
            "Connected-component clusters over the BMPN prototype "
            "(concert co-billing edges only). This is a minimal, honest "
            "first pass at listener-ecosystem grouping, not a modularity-"
            "based community detection result -- the graph is currently too "
            "sparse (38 edges / 52 nodes) for Louvain/Leiden to be meaningful. "
            "Revisit once streaming/playlist co-occurrence edges are added."
        ),
        "method": "connected_components",
        "cluster_count": len(clusters),
        "isolated_node_count": len(isolated),
        "clusters": clusters,
        "isolated_nodes": sorted(isolated),
    }

    OUTPUT_PATH.write_text(json.dumps(output, indent=2) + "\n")
    print(
        f"Wrote {OUTPUT_PATH} — {len(clusters)} clusters "
        f"(largest: {clusters[0]['size'] if clusters else 0}), "
        f"{len(isolated)} isolated nodes"
    )


if __name__ == "__main__":
    main()
