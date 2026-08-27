#!/usr/bin/env python3
"""Connected-component clustering over the co-billing layer of the BMPN.

SUPERSEDED for community detection by analysis/scripts/analyze_bmpn.py, which
runs Louvain over the multi-layer graph and writes bmpn-communities.json. That
became possible once the graph was dense enough (152 observed edges, modularity
0.414) for modularity-based detection to be meaningful; it was not when this
script was written against a 38-edge graph.

Kept because "who is reachable from whom through shared bills alone" is a
different and still-useful question from "which acts cluster": components are a
coverage diagnostic, communities are a structural claim.

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
            "Connected components over the co-billing layer only: which acts "
            "are reachable from which through shared bills. This is a coverage "
            "diagnostic, not a community-detection result -- for communities "
            "see bmpn-communities.json, produced by Louvain over the "
            "multi-layer graph in analysis/scripts/analyze_bmpn.py."
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
