#!/usr/bin/env python3
"""Build the Bangladesh Music Preference Network (BMPN).

The earlier prototype used a single edge type -- shared concert bills -- which
left 39 of 58 artists isolated and the graph far too sparse for modularity-based
community detection. This builder keeps that layer and adds three more, each
derived from evidence already present in the artist records:

  co_billing          two acts appear on the same documented concert bill
                      (observed; strongest evidence of shared live audience)
  personnel           two acts share a named member (observed; the scene's
                      documented genealogy, e.g. Ayub Bachchu across Souls,
                      LRB and Nagar Baul)
  domestic_influence  one act names another catalogued Bangladeshi act as an
                      influence (observed statement; internal transmission)
  influence_homophily two acts cite the same named *global* influence
                      (inferred aesthetic proximity, NOT observed audience
                      overlap -- weakest layer, reported separately)

Only the first three are observational. ``influence_homophily`` is an inferred
proxy and is flagged as such on every edge it produces, so any downstream
analysis can include or exclude it explicitly.

Outputs:
  data/networks/bmpn-prototype.json   co-billing layer only (unchanged format,
                                      consumed by the web frontend)
  data/networks/bmpn-multilayer.json  all four layers with per-edge provenance
"""
import sys
from collections import defaultdict
from datetime import date
from itertools import combinations
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parents[1] / "lib"))
import common  # noqa: E402

# Relative contribution of each layer to the combined analytic weight.
LAYER_WEIGHTS = {
    "co_billing": 1.0,
    "personnel": 1.0,
    "domestic_influence": 1.0,
    "influence_homophily": 0.5,
}
OBSERVED_LAYERS = ("co_billing", "personnel", "domestic_influence")


def key(a, b):
    return tuple(sorted((a, b)))


def co_billing_edges(artists, concerts):
    weights = defaultdict(int)
    evidence = defaultdict(list)
    events_per_artist = defaultdict(int)
    for concert in concerts:
        ids = sorted({e["artist_id"] for e in (concert.get("artists") or [])
                      if e.get("artist_id") in artists})
        for aid in ids:
            events_per_artist[aid] += 1
        for a, b in combinations(ids, 2):
            weights[key(a, b)] += 1
            evidence[key(a, b)].append(concert["id"])
    return weights, evidence, events_per_artist


def personnel_edges(artists):
    """Acts linked by a shared named member (documented scene genealogy)."""
    by_member = defaultdict(set)
    for aid, a in artists.items():
        for m in (a.get("members") or []):
            name = (m.get("name") or "").strip()
            # Single-word stage names ("Sunny", "Sabbir") are ambiguous across
            # bands; keep them but record the name so the claim is auditable.
            if name:
                by_member[name].add(aid)
    weights = defaultdict(int)
    evidence = defaultdict(list)
    for name, ids in by_member.items():
        if len(ids) < 2:
            continue
        for a, b in combinations(sorted(ids), 2):
            weights[key(a, b)] += 1
            evidence[key(a, b)].append(name)
    return weights, evidence


def influence_edges(artists):
    """Split influence citations into domestic links and global homophily."""
    name_to_id = {}
    for aid, a in artists.items():
        name_to_id[a["name"].strip().lower()] = aid
        for alias in (a.get("also_known_as") or []):
            name_to_id[alias.strip().lower()] = aid

    global_tokens = defaultdict(set)   # canonical global act -> {artist ids}
    dom_weights = defaultdict(int)
    dom_evidence = defaultdict(list)
    per_artist_tokens = defaultdict(set)

    for aid, a in artists.items():
        for infl in (a.get("global_influences") or []):
            for tok, kind in common.split_influence(infl.get("artist_or_genre")):
                canon = common.canonical_influence(tok)
                low = canon.lower()
                target = name_to_id.get(low)
                if target and target != aid:
                    dom_weights[key(aid, target)] += 1
                    dom_evidence[key(aid, target)].append(
                        f"{a['name']} cites {canon}")
                elif kind == "global_artist":
                    global_tokens[canon].add(aid)
                    per_artist_tokens[aid].add(canon)

    hom_weights = defaultdict(int)
    hom_evidence = defaultdict(list)
    for canon, ids in global_tokens.items():
        if len(ids) < 2:
            continue
        for a, b in combinations(sorted(ids), 2):
            hom_weights[key(a, b)] += 1
            hom_evidence[key(a, b)].append(canon)

    return (dom_weights, dom_evidence, hom_weights, hom_evidence,
            global_tokens, per_artist_tokens)


def build():
    artists = common.load_artists()
    concerts = common.load_concerts()

    cb_w, cb_e, events_per_artist = co_billing_edges(artists, concerts)
    pe_w, pe_e = personnel_edges(artists)
    dom_w, dom_e, hom_w, hom_e, global_tokens, per_artist_tokens = \
        influence_edges(artists)

    layers = {
        "co_billing": (cb_w, cb_e, "shared_events"),
        "personnel": (pe_w, pe_e, "shared_members"),
        "domestic_influence": (dom_w, dom_e, "citations"),
        "influence_homophily": (hom_w, hom_e, "shared_influences"),
    }

    merged = defaultdict(lambda: {"layers": {}, "combined_weight": 0.0})
    for layer, (weights, evidence, ev_field) in layers.items():
        for pair, w in weights.items():
            entry = merged[pair]
            entry["layers"][layer] = {
                "weight": w,
                ev_field: sorted(set(evidence[pair])),
                "observed": layer in OBSERVED_LAYERS,
            }
            entry["combined_weight"] += LAYER_WEIGHTS[layer] * w

    edges = []
    for (a, b), entry in sorted(merged.items()):
        edges.append({
            "source": a,
            "target": b,
            "combined_weight": round(entry["combined_weight"], 3),
            "observed": any(l in OBSERVED_LAYERS for l in entry["layers"]),
            "layers": entry["layers"],
        })

    nodes = []
    for aid, a in sorted(artists.items()):
        nodes.append({
            "id": aid,
            "name": a["name"],
            "genres": a.get("genres", []),
            "strand": common.genre_strand(a.get("genres"), aid),
            "formed_year": a.get("formed_year"),
            "origin_city": a.get("origin_city"),
            "event_count": events_per_artist.get(aid, 0),
            "global_influence_tokens": sorted(per_artist_tokens.get(aid, [])),
        })

    layer_counts = {l: len(layers[l][0]) for l in layers}
    observed_pairs = {p for l in OBSERVED_LAYERS for p in layers[l][0]}
    degree = defaultdict(int)
    for e in edges:
        degree[e["source"]] += 1
        degree[e["target"]] += 1
    observed_degree = defaultdict(int)
    for p in observed_pairs:
        observed_degree[p[0]] += 1
        observed_degree[p[1]] += 1

    multilayer = {
        "generated": date.today().isoformat(),
        "description": (
            "Bangladesh Music Preference Network (BMPN), multi-layer build. "
            "Nodes are catalogued artists; edges carry one or more layers. "
            "co_billing, personnel and domestic_influence are observational "
            "(documented shared bills, shared members, and one act naming "
            "another as an influence). influence_homophily is INFERRED -- two "
            "acts citing the same global influence are aesthetically adjacent, "
            "which proxies for but does not demonstrate shared audience. "
            "Combined weight = sum over layers of layer_weight x layer_weight_count."
        ),
        "layer_weights": LAYER_WEIGHTS,
        "observed_layers": list(OBSERVED_LAYERS),
        "node_count": len(nodes),
        "edge_count": len(edges),
        "edges_per_layer": layer_counts,
        "observed_edge_count": len(observed_pairs),
        "isolated_node_count": sum(1 for n in nodes if degree[n["id"]] == 0),
        "isolated_under_observed_layers_only": sum(
            1 for n in nodes if observed_degree[n["id"]] == 0),
        "nodes": nodes,
        "edges": edges,
    }
    common.write_json(common.NETWORKS_DIR / "bmpn-multilayer.json", multilayer)

    # Backwards-compatible single-layer file consumed by the web frontend.
    proto_edges = [
        {
            "source": a, "target": b, "weight": w,
            "shared_events": sorted(set(cb_e[(a, b)])),
        }
        for (a, b), w in sorted(cb_w.items())
    ]
    prototype = {
        "description": (
            "Concert co-billing layer of the BMPN. Nodes = artists in "
            "data/artists/; edges = artists that shared a documented concert "
            "bill in data/concerts/, weighted by number of shared events. This "
            "is the strongest observational layer; see bmpn-multilayer.json "
            "for the personnel, domestic-influence and influence-homophily "
            "layers and analysis/outputs/ for the network metrics."
        ),
        "node_count": len(nodes),
        "edge_count": len(proto_edges),
        "isolated_node_count": sum(1 for n in nodes if n["event_count"] == 0),
        "nodes": [
            {"id": n["id"], "name": n["name"], "genres": n["genres"],
             "event_count": n["event_count"]}
            for n in nodes
        ],
        "edges": proto_edges,
    }
    common.write_json(common.NETWORKS_DIR / "bmpn-prototype.json", prototype)

    print(f"BMPN multilayer: {len(nodes)} nodes, {len(edges)} edges")
    for layer, count in layer_counts.items():
        print(f"  {layer:22s} {count:4d} edges")
    print(f"  observed-only edges    {len(observed_pairs):4d}")
    print(f"  isolated (all layers)  {multilayer['isolated_node_count']:4d}")
    print(f"  isolated (observed)    "
          f"{multilayer['isolated_under_observed_layers_only']:4d}")
    print(f"BMPN co-billing layer: {len(proto_edges)} edges")


if __name__ == "__main__":
    build()
