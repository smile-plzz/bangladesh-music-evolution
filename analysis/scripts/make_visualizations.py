#!/usr/bin/env python3
"""Render the project's figures from the computed analysis outputs.

Everything here reads from analysis/outputs/ and data/networks/ -- no figure
recomputes its own statistics, so a figure can never disagree with the numbers
reported in the paper.

Figures (SVG, theme-neutral, colour-blind-safe palette):
  fig1-formations-by-decade.svg    catalogued formations per decade by strand
  fig2-releases-by-decade.svg      dated releases per decade by strand
  fig3-strand-timeline.svg         formation span and median per BMEM strand
  fig4-bmpn-network.svg            BMPN, full layer set, coloured by strand
  fig5-top-influences.svg          most-cited named global influences
  fig6-influence-by-era.svg        influence mix by the citing act's era
  fig7-concert-typology.svg        events per typology class and bill size

Outputs: analysis/visualizations/*.svg
"""
import json
import sys
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parents[1] / "lib"))
import common  # noqa: E402

import matplotlib  # noqa: E402
matplotlib.use("Agg")
import matplotlib.pyplot as plt  # noqa: E402
import networkx as nx  # noqa: E402

OUT = common.VIZ_OUT
STRANDS = common.GENRE_STRANDS

# Okabe-Ito colour-blind-safe palette, one colour per BMEM strand.
STRAND_COLOURS = {
    "Mainstream Rock": "#0072B2",
    "Progressive Rock/Metal": "#009E73",
    "Heavy Metal": "#D55E00",
    "Alternative/Indie": "#CC79A7",
    "Pop": "#E69F00",
    "Hip-Hop/Rap": "#56B4E9",
    "Folk & Folk Fusion": "#8C6D31",
    "Unclassified": "#999999",
}

# A fixed hash salt makes matplotlib's generated SVG element ids stable, and
# savefig below writes no Date metadata. Without both, every run produces a
# textually different SVG and the committed figures churn on each rebuild.
matplotlib.rcParams["svg.hashsalt"] = "bmpn"

plt.rcParams.update({
    "figure.dpi": 110,
    "savefig.bbox": "tight",
    "font.size": 9,
    "axes.spines.top": False,
    "axes.spines.right": False,
    "axes.grid": True,
    "grid.alpha": 0.25,
    "grid.linestyle": ":",
})


def load(name):
    return json.loads((common.ANALYSIS_OUT / name).read_text())


def save(fig, name):
    OUT.mkdir(parents=True, exist_ok=True)
    path = OUT / name
    fig.savefig(path, format="svg", transparent=False, facecolor="white",
                metadata={"Date": None})
    plt.close(fig)
    print(f"  {path.relative_to(common.REPO_ROOT)}")


def stacked_by_decade(data_key, title, ylabel, filename, temporal):
    buckets = temporal[data_key]
    decades = sorted(buckets, key=int)
    fig, ax = plt.subplots(figsize=(7.5, 4))
    bottom = [0] * len(decades)
    for strand in STRANDS:
        vals = [buckets[d]["by_strand"].get(strand, 0) for d in decades]
        if not any(vals):
            continue
        ax.bar([f"{d}s" for d in decades], vals, bottom=bottom,
               label=strand, color=STRAND_COLOURS[strand], edgecolor="white",
               linewidth=0.6)
        bottom = [b + v for b, v in zip(bottom, vals)]
    for i, total in enumerate(bottom):
        if total:
            ax.text(i, total + max(bottom) * 0.015, str(int(total)),
                    ha="center", va="bottom", fontsize=8, color="#444")
    ax.set_title(title, fontsize=11, pad=10)
    ax.set_ylabel(ylabel)
    ax.legend(fontsize=7.5, frameon=False, ncol=2, loc="upper left")
    ax.margins(y=0.15)
    save(fig, filename)


def strand_timeline(temporal):
    life = temporal["strand_lifecycle"]
    rows = [(s, life[s]) for s in STRANDS
            if life.get(s, {}).get("first_formation")]
    rows.sort(key=lambda r: r[1]["first_formation"])
    fig, ax = plt.subplots(figsize=(7.5, 3.6))
    for i, (strand, d) in enumerate(rows):
        ax.barh(i, d["latest_formation"] - d["first_formation"] + 1,
                left=d["first_formation"], height=0.55,
                color=STRAND_COLOURS[strand], alpha=0.75)
        ax.plot([d["median_formation"]], [i], marker="|", markersize=16,
                color="#222", markeredgewidth=1.6)
        ax.text(d["latest_formation"] + 1.5, i,
                f"{d['catalogued_acts']} acts", va="center", fontsize=8,
                color="#444")
    ax.set_yticks(range(len(rows)))
    ax.set_yticklabels([r[0] for r in rows], fontsize=8.5)
    ax.set_xlabel("Year an act formed (bar = span of catalogued formations, "
                  "tick = median)")
    ax.set_title("When each BMEM strand's catalogued acts were founded",
                 fontsize=11, pad=10)
    ax.invert_yaxis()
    ax.margins(x=0.08)
    save(fig, "fig3-strand-timeline.svg")


def _stable_edges(graph):
    """Edges with both endpoint order and list order normalised.

    networkx yields an edge as (u, v) or (v, u) depending on iteration order,
    which is not stable across processes. Sorting the list alone does not fix
    that -- the pair itself has to be ordered too, or the same edge writes a
    different SVG path string from one run to the next.
    """
    normalised = [
        (min(u, v), max(u, v), d) for u, v, d in graph.edges(data=True)
    ]
    return sorted(normalised, key=lambda e: (e[0], e[1]))


def network_figure():
    """Draw the BMPN.

    The graph is not one blob: a giant component, a handful of two- and
    three-act components, and a set of acts with no documented link yet.
    Laying all three out in one axes pushes the isolates into a ring and
    crushes the core, so each gets its own panel -- and the unlinked acts then
    read as the coverage gap they are, rather than as decoration.
    """
    net = json.loads(
        (common.NETWORKS_DIR / "bmpn-multilayer.json").read_text())
    metrics = load("bmpn-metrics.json")["passes"]["full"]

    g = nx.Graph()
    strand = {}
    for n in net["nodes"]:
        g.add_node(n["id"])
        strand[n["id"]] = n["strand"]
    for e in net["edges"]:
        g.add_edge(e["source"], e["target"], weight=e["combined_weight"],
                   observed=e["observed"])

    # Sort by size then by first member: size alone leaves equal-sized
    # components in whatever order the graph iteration produced, which moves
    # them around the figure between runs.
    comps = sorted((sorted(c) for c in nx.connected_components(g)),
                   key=lambda c: (-len(c), c[0]))
    giant, smalls = comps[0], [c for c in comps[1:] if len(c) > 1]
    isolates = sorted(c[0] for c in comps if len(c) == 1)
    degrees = dict(g.degree())

    def edge_style(d):
        return dict(
            linewidth=0.55 + 0.4 * d["weight"],
            color="#5b5b5b" if d["observed"] else "#c2c2c2",
            linestyle="-" if d["observed"] else (0, (3, 2.5)),
            alpha=0.8 if d["observed"] else 0.6, zorder=1)

    def draw_node(ax, node, x, y, size, fontsize, dx=0, dy=10, ha="center"):
        ax.scatter(x, y, s=size,
                   color=STRAND_COLOURS.get(strand[node], "#999"),
                   edgecolor="white", linewidth=0.9, zorder=2)
        ax.annotate(node, (x, y), fontsize=fontsize, color="#1a1a1a",
                    xytext=(dx, dy), textcoords="offset points",
                    ha=ha, va="center" if dx else "bottom", zorder=3)

    fig = plt.figure(figsize=(11, 10.6))
    gs = fig.add_gridspec(3, 1, height_ratios=[6.4, 1.25, 1.35], hspace=0.10)
    ax = fig.add_subplot(gs[0])
    ax_small = fig.add_subplot(gs[1])
    ax_iso = fig.add_subplot(gs[2])

    # --- giant component --------------------------------------------------
    sub = g.subgraph(giant)
    pos = nx.spring_layout(sub, seed=11, k=0.95, iterations=1200,
                           weight="weight", scale=1.0)
    for u, v, d in _stable_edges(sub):
        ax.plot([pos[u][0], pos[v][0]], [pos[u][1], pos[v][1]], **edge_style(d))
    for node, (x, y) in pos.items():
        norm = max((x ** 2 + y ** 2) ** 0.5, 1e-6)
        draw_node(ax, node, x, y, 70 + 30 * degrees[node], 6.6,
                  dx=12 * x / norm, dy=12 * y / norm,
                  ha="left" if x >= 0 else "right")

    handles = [plt.Line2D([], [], marker="o", linestyle="", markersize=7,
                          markerfacecolor=STRAND_COLOURS[s],
                          markeredgecolor="white", label=s)
               for s in STRANDS]
    handles += [
        plt.Line2D([], [], color="#5b5b5b", label="observed edge"),
        plt.Line2D([], [], color="#c2c2c2", linestyle=(0, (3, 2.5)),
                   label="inferred (influence homophily)"),
    ]
    ax.legend(handles=handles, fontsize=7.6, frameon=False,
              loc="upper left", ncol=2, bbox_to_anchor=(-0.03, 1.03))
    ax.set_title(
        f"Bangladesh Music Preference Network — {g.number_of_nodes()} acts, "
        f"{g.number_of_edges()} edges\n"
        f"giant component {len(giant)} acts · Louvain Q = "
        f"{metrics['louvain_modularity']} · "
        f"{metrics['nontrivial_community_count']} communities of 3+",
        fontsize=11.5, pad=14)
    ax.set_axis_off()
    ax.margins(0.22)

    # --- small components -------------------------------------------------
    x_cursor = 0.0
    for comp in smalls:
        csub = g.subgraph(comp)
        # These components have two or three nodes, so a force layout buys
        # nothing and its node ordering is not stable across processes, which
        # made the committed figure churn on every rebuild. Place them on a
        # fixed alternating line instead: deterministic, and easier to read.
        cpos = {
            node: (x_cursor + 0.42 * idx, 0.22 if idx % 2 == 0 else -0.22)
            for idx, node in enumerate(comp)
        }
        for u, v, d in _stable_edges(csub):
            ax_small.plot([cpos[u][0], cpos[v][0]], [cpos[u][1], cpos[v][1]],
                          **edge_style(d))
        for node, (x, y) in cpos.items():
            draw_node(ax_small, node, x, y, 58, 6.2,
                      dy=9 if y > 0 else -15)
        x_cursor = max(p[0] for p in cpos.values()) + 0.75
    ax_small.set_xlim(-0.35, x_cursor)
    ax_small.set_ylim(-0.62, 0.72)
    ax_small.set_axis_off()
    ax_small.set_title(
        f"Detached components — {len(smalls)} pairs/triples linked to each "
        "other but not to the main scene", fontsize=8.8, color="#555", pad=2)

    # --- unlinked acts ----------------------------------------------------
    per_row = 7
    for i, node in enumerate(isolates):
        col, row = i % per_row, i // per_row
        draw_node(ax_iso, node, col, -row * 0.9, 52, 6.2, dy=-11)
    ax_iso.set_xlim(-0.8, per_row - 0.2)
    rows = (len(isolates) - 1) // per_row + 1 if isolates else 1
    ax_iso.set_ylim(-(rows - 1) * 0.9 - 0.55, 0.5)
    ax_iso.set_axis_off()
    ax_iso.set_title(
        f"No documented link yet — {len(isolates)} acts "
        "(the concert-coverage gap, not a finding about their audiences)",
        fontsize=8.8, color="#555", pad=2)

    save(fig, "fig4-bmpn-network.svg")


def influence_figures():
    infl = load("influence-analysis.json")
    top = list(infl["top_named_global_influences"].items())[:18][::-1]
    fig, ax = plt.subplots(figsize=(7, 5.2))
    ax.barh([t[0] for t in top], [t[1] for t in top], color="#0072B2",
            alpha=0.85, height=0.68)
    for i, (_, v) in enumerate(top):
        ax.text(v + 0.06, i, str(v), va="center", fontsize=8, color="#444")
    ax.set_xlabel("Catalogued acts citing this influence")
    ax.set_title("Most-cited named global influences", fontsize=11, pad=10)
    ax.grid(axis="y", visible=False)
    save(fig, "fig5-top-influences.svg")

    eras = infl["named_influences_by_formation_era"]
    order = [e for e in ("Founding era (pre-1985)",
                         "Metal & cassette era (1985-1999)",
                         "Digital transition (2000-2009)",
                         "Streaming era (2010-)") if e in eras]
    fig, axes = plt.subplots(1, len(order), figsize=(3.1 * len(order), 3.6),
                             sharex=False)
    if len(order) == 1:
        axes = [axes]
    for ax, era in zip(axes, order):
        items = list(eras[era]["top"].items())[:6][::-1]
        ax.barh([i[0] for i in items], [i[1] for i in items],
                color="#009E73", alpha=0.85, height=0.65)
        ax.set_title(f"{era}\n({eras[era]['citing_acts']} acts citing)",
                     fontsize=8.5)
        ax.tick_params(labelsize=7)
        ax.grid(axis="y", visible=False)
        ax.set_xticks(range(0, max([i[1] for i in items] or [1]) + 1))
    fig.suptitle("Influence vectors shift with the citing act's founding era",
                 fontsize=11, y=1.04)
    save(fig, "fig6-influence-by-era.svg")


def concert_figure():
    eco = load("concert-ecosystem.json")
    classes = list(eco["classes"].items())
    classes.sort(key=lambda kv: kv[1]["event_count"])
    labels = [k.replace("-", " ") for k, _ in classes]
    counts = [v["event_count"] for _, v in classes]
    bills = [v["mean_bill_size"] for _, v in classes]

    fig, (ax1, ax2) = plt.subplots(1, 2, figsize=(9, 3.8))
    ax1.barh(labels, counts, color="#D55E00", alpha=0.85, height=0.65)
    for i, v in enumerate(counts):
        ax1.text(v + 0.08, i, str(v), va="center", fontsize=8, color="#444")
    ax1.set_xlabel("Documented events")
    ax1.set_title("Events per concert-ecosystem class", fontsize=10)
    ax1.grid(axis="y", visible=False)

    ax2.barh(labels, bills, color="#CC79A7", alpha=0.85, height=0.65)
    for i, v in enumerate(bills):
        ax2.text(v + 0.05, i, f"{v:g}", va="center", fontsize=8, color="#444")
    ax2.set_xlabel("Mean acts on the bill")
    ax2.set_title("Bill size by class", fontsize=10)
    ax2.set_yticklabels([])
    ax2.grid(axis="y", visible=False)
    save(fig, "fig7-concert-typology.svg")


def main():
    print("Rendering figures:")
    temporal = load("temporal-summary.json")
    stacked_by_decade(
        "formations_by_decade",
        "Catalogued acts by decade of formation",
        "Acts formed", "fig1-formations-by-decade.svg", temporal)
    stacked_by_decade(
        "releases_by_decade",
        "Dated releases by decade",
        "Releases", "fig2-releases-by-decade.svg", temporal)
    strand_timeline(temporal)
    network_figure()
    influence_figures()
    concert_figure()


if __name__ == "__main__":
    main()
