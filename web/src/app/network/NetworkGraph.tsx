"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import {
  forceSimulation,
  forceLink,
  forceManyBody,
  forceCenter,
  forceCollide,
  forceX,
  forceY,
  type Simulation,
  type SimulationNodeDatum,
  type SimulationLinkDatum,
} from "d3-force";
import { select } from "d3-selection";
import { zoom, zoomIdentity, type D3ZoomEvent } from "d3-zoom";
import { drag, type D3DragEvent } from "d3-drag";
import Link from "next/link";
import { STRANDS, strandColor } from "@/lib/strands";
import type { Community, MultiLayerNetwork } from "@/lib/analysis";

type GraphNode = SimulationNodeDatum & {
  id: string;
  name: string;
  strand: string;
  formed_year: number | null;
  origin_city: string;
  event_count: number;
  community: number | null;
};

type GraphLink = SimulationLinkDatum<GraphNode> & {
  weight: number;
  observed: boolean;
  layers: string[];
  detail: string;
};

const LAYERS: { key: string; label: string; hint: string; observed: boolean }[] = [
  {
    key: "co_billing",
    label: "Shared bill",
    hint: "Both acts appeared on the same documented concert bill. Weighted by 1/(n−1) so a twelve-act festival counts for less per neighbour than a two-act gig.",
    observed: true,
  },
  {
    key: "personnel",
    label: "Shared member",
    hint: "A named musician appears in both acts' member lists — the scene's documented genealogy.",
    observed: true,
  },
  {
    key: "domestic_influence",
    label: "Cites the other",
    hint: "One catalogued act names the other as an influence.",
    observed: true,
  },
  {
    key: "influence_homophily",
    label: "Shared global influence",
    hint: "Both acts cite the same global influence. INFERRED: this proxies aesthetic proximity and is not evidence of a shared audience.",
    observed: false,
  },
];

const COMMUNITY_COLORS = [
  "#34d399", "#f472b6", "#60a5fa", "#fbbf24", "#a78bfa",
  "#fb7185", "#2dd4bf", "#facc15", "#c084fc", "#4ade80",
];

const WIDTH = 900;
const HEIGHT = 660;

export default function NetworkGraph({
  network,
  communities,
}: {
  network: MultiLayerNetwork;
  communities: Community[];
}) {
  const [activeLayers, setActiveLayers] = useState<string[]>([
    "co_billing",
    "personnel",
    "domestic_influence",
  ]);
  const [colorMode, setColorMode] = useState<"strand" | "community">("strand");
  const [hideIsolated, setHideIsolated] = useState(true);
  const [query, setQuery] = useState("");
  const [selected, setSelected] = useState<string | null>(null);
  const [hovered, setHovered] = useState<string | null>(null);
  const [, setTick] = useState(0);

  const communityOf = useMemo(() => {
    const m = new Map<string, number>();
    communities.forEach((c) => c.members.forEach((id) => m.set(id, c.community_id)));
    return m;
  }, [communities]);

  const { nodes, links, hiddenCount } = useMemo(() => {
    const linkRows: GraphLink[] = [];
    for (const e of network.edges) {
      const on = Object.keys(e.layers).filter((l) => activeLayers.includes(l));
      if (on.length === 0) continue;
      const weight = on.reduce((sum, l) => {
        const layer = e.layers[l];
        return sum + (layer.normalised_weight ?? layer.weight);
      }, 0);
      const detail = on
        .map((l) => {
          const d = e.layers[l];
          if (l === "co_billing")
            return `${d.weight} shared bill${d.weight === 1 ? "" : "s"}`;
          if (l === "personnel")
            return `shared member: ${(d.shared_members ?? []).join(", ")}`;
          if (l === "domestic_influence")
            return (d.citations ?? []).join("; ");
          return `both cite ${(d.shared_influences ?? []).join(", ")}`;
        })
        .join(" · ");
      linkRows.push({
        source: e.source,
        target: e.target,
        weight,
        observed: on.some((l) => LAYERS.find((x) => x.key === l)?.observed),
        layers: on,
        detail,
      });
    }

    const degree = new Map<string, number>();
    for (const l of linkRows) {
      degree.set(l.source as string, (degree.get(l.source as string) ?? 0) + 1);
      degree.set(l.target as string, (degree.get(l.target as string) ?? 0) + 1);
    }

    const all = network.nodes.map((n) => ({
      ...n,
      community: communityOf.get(n.id) ?? null,
    }));
    const kept = hideIsolated ? all.filter((n) => degree.has(n.id)) : all;
    const keptIds = new Set(kept.map((n) => n.id));

    return {
      nodes: kept as GraphNode[],
      links: linkRows.filter(
        (l) => keptIds.has(l.source as string) && keptIds.has(l.target as string),
      ),
      hiddenCount: all.length - kept.length,
    };
  }, [network, activeLayers, hideIsolated, communityOf]);

  const svgRef = useRef<SVGSVGElement | null>(null);
  const viewportRef = useRef<SVGGElement | null>(null);
  const simRef = useRef<Simulation<GraphNode, GraphLink> | null>(null);

  useEffect(() => {
    const sim = forceSimulation<GraphNode>(nodes)
      .force(
        "link",
        forceLink<GraphNode, GraphLink>(links)
          .id((d) => d.id)
          .distance((d) => 150 - Math.min(d.weight, 5) * 12)
          .strength(0.35),
      )
      .force("charge", forceManyBody().strength(-230))
      .force("center", forceCenter(WIDTH / 2, HEIGHT / 2))
      // Weak pull toward the centre on both axes. Without it, chains of
      // sparsely connected acts drift past the viewBox and the graph reads as
      // broken until the visitor zooms out.
      .force("x", forceX(WIDTH / 2).strength(0.05))
      .force("y", forceY(HEIGHT / 2).strength(0.07))
      .force("collide", forceCollide(26))
      .on("tick", () => setTick((t) => t + 1));
    simRef.current = sim;
    return () => {
      sim.stop();
    };
  }, [nodes, links]);

  useEffect(() => {
    if (!svgRef.current || !viewportRef.current) return;
    const svgSel = select(svgRef.current);
    const viewportSel = select(viewportRef.current);
    const zoomBehavior = zoom<SVGSVGElement, unknown>()
      .scaleExtent([0.3, 4])
      .on("zoom", (event: D3ZoomEvent<SVGSVGElement, unknown>) => {
        viewportSel.attr("transform", event.transform.toString());
      });
    svgSel.call(zoomBehavior);
    svgSel.on("dblclick.zoom", null);
    return () => {
      svgSel.on(".zoom", null);
    };
  }, []);

  function attachDrag(el: SVGGElement | null, d: GraphNode) {
    if (!el) return;
    const behavior = drag<SVGGElement, GraphNode>()
      .on("start", (event: D3DragEvent<SVGGElement, GraphNode, GraphNode>) => {
        if (!event.active) simRef.current?.alphaTarget(0.25).restart();
        d.fx = d.x;
        d.fy = d.y;
      })
      .on("drag", (event: D3DragEvent<SVGGElement, GraphNode, GraphNode>) => {
        d.fx = event.x;
        d.fy = event.y;
      })
      .on("end", (event: D3DragEvent<SVGGElement, GraphNode, GraphNode>) => {
        if (!event.active) simRef.current?.alphaTarget(0);
        d.fx = null;
        d.fy = null;
      });
    select<SVGGElement, GraphNode>(el).datum(d).call(behavior);
  }

  const active = hovered ?? selected;

  const neighbours = useMemo(() => {
    if (!active) return new Map<string, GraphLink>();
    const m = new Map<string, GraphLink>();
    for (const l of links) {
      const s = typeof l.source === "object" ? (l.source as GraphNode).id : l.source;
      const t = typeof l.target === "object" ? (l.target as GraphNode).id : l.target;
      if (s === active) m.set(t as string, l);
      else if (t === active) m.set(s as string, l);
    }
    return m;
  }, [active, links]);

  const matches = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return null;
    return new Set(
      nodes.filter((n) => n.name.toLowerCase().includes(q) || n.id.includes(q)).map((n) => n.id),
    );
  }, [query, nodes]);

  const selectedNode = nodes.find((n) => n.id === selected) ?? null;
  const nodeById = useMemo(
    () => Object.fromEntries(nodes.map((n) => [n.id, n])),
    [nodes],
  );

  function nodeColor(n: GraphNode) {
    if (colorMode === "community") {
      return n.community === null
        ? "#525252"
        : COMMUNITY_COLORS[n.community % COMMUNITY_COLORS.length];
    }
    return strandColor(n.strand);
  }

  function resetView() {
    if (!svgRef.current) return;
    select(svgRef.current)
      .transition()
      .duration(400)
      .call(zoom<SVGSVGElement, unknown>().transform, zoomIdentity);
  }

  const toggleLayer = (key: string) =>
    setActiveLayers((prev) =>
      prev.includes(key) ? prev.filter((k) => k !== key) : [...prev, key],
    );

  return (
    <div className="grid xl:grid-cols-[minmax(0,1fr)_300px] gap-6">
      <div>
        <div className="flex flex-wrap items-center gap-x-6 gap-y-3 mb-4">
          <fieldset>
            <legend className="text-xs uppercase tracking-wider text-neutral-500 mb-1.5">
              Edge layers
            </legend>
            <div className="flex flex-wrap gap-1.5">
              {LAYERS.map((l) => {
                const on = activeLayers.includes(l.key);
                return (
                  <button
                    key={l.key}
                    onClick={() => toggleLayer(l.key)}
                    aria-pressed={on}
                    title={l.hint}
                    className={`rounded-full border px-2.5 py-1 text-xs transition-colors ${
                      on
                        ? l.observed
                          ? "border-emerald-500 bg-emerald-500/10 text-emerald-300"
                          : "border-amber-500 bg-amber-500/10 text-amber-300"
                        : "border-neutral-800 text-neutral-500 hover:border-neutral-600"
                    }`}
                  >
                    {l.label}
                    {!l.observed ? " ·  inferred" : ""}
                    <span className="ml-1.5 text-neutral-500 tabular-nums">
                      {network.edges_per_layer[l.key] ?? 0}
                    </span>
                  </button>
                );
              })}
            </div>
          </fieldset>

          <fieldset>
            <legend className="text-xs uppercase tracking-wider text-neutral-500 mb-1.5">
              Colour by
            </legend>
            <div className="inline-flex rounded-md border border-neutral-800 p-0.5">
              {(["strand", "community"] as const).map((m) => (
                <button
                  key={m}
                  onClick={() => setColorMode(m)}
                  aria-pressed={colorMode === m}
                  className={`px-2.5 py-1 text-xs rounded capitalize transition-colors ${
                    colorMode === m
                      ? "bg-neutral-800 text-neutral-100"
                      : "text-neutral-400 hover:text-neutral-200"
                  }`}
                >
                  {m}
                </button>
              ))}
            </div>
          </fieldset>
        </div>

        <div className="flex flex-wrap items-center gap-3 mb-3">
          <input
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Find an act…"
            className="rounded-md border border-neutral-800 bg-neutral-900 px-3 py-1.5 text-sm text-neutral-100 placeholder:text-neutral-600 focus:border-emerald-500 focus:outline-none"
          />
          <label className="flex items-center gap-2 text-xs text-neutral-400">
            <input
              type="checkbox"
              checked={hideIsolated}
              onChange={(e) => setHideIsolated(e.target.checked)}
              className="accent-emerald-500"
            />
            Hide unconnected acts
            {hiddenCount ? (
              <span className="text-neutral-600">({hiddenCount})</span>
            ) : null}
          </label>
          <button
            onClick={resetView}
            className="text-xs text-neutral-400 hover:text-neutral-200"
          >
            Reset view
          </button>
          <span className="text-xs text-neutral-600 tabular-nums ml-auto">
            {nodes.length} acts · {links.length} edges
          </span>
        </div>

        <div className="rounded-lg border border-neutral-800 bg-neutral-950 overflow-hidden">
          <svg
            ref={svgRef}
            viewBox={`0 0 ${WIDTH} ${HEIGHT}`}
            className="w-full h-auto touch-none"
            role="img"
            aria-label="Bangladesh Music Preference Network graph"
          >
            <g ref={viewportRef}>
              {links.map((l, i) => {
                const s = l.source as GraphNode;
                const t = l.target as GraphNode;
                if (typeof s !== "object" || typeof t !== "object") return null;
                const touched =
                  active && (s.id === active || t.id === active);
                return (
                  <line
                    key={i}
                    x1={s.x}
                    y1={s.y}
                    x2={t.x}
                    y2={t.y}
                    stroke={
                      touched ? "#34d399" : l.observed ? "#4b5563" : "#3f3f46"
                    }
                    strokeWidth={0.6 + Math.min(l.weight, 4) * 0.5}
                    strokeDasharray={l.observed ? undefined : "4 3"}
                    opacity={active && !touched ? 0.15 : 0.7}
                  />
                );
              })}

              {nodes.map((n) => {
                const isActive = active === n.id;
                const isNeighbour = neighbours.has(n.id);
                const dimmed =
                  (active && !isActive && !isNeighbour) ||
                  (matches !== null && !matches.has(n.id));
                const r = 6 + Math.min(n.event_count, 8) * 1.3;
                return (
                  <g
                    key={n.id}
                    ref={(el) => attachDrag(el, n)}
                    transform={`translate(${n.x ?? 0},${n.y ?? 0})`}
                    onMouseEnter={() => setHovered(n.id)}
                    onMouseLeave={() => setHovered(null)}
                    onClick={() => setSelected(selected === n.id ? null : n.id)}
                    className="cursor-pointer"
                    opacity={dimmed ? 0.25 : 1}
                  >
                    <circle
                      r={r}
                      fill={nodeColor(n)}
                      stroke={isActive ? "#fff" : "#0a0a0a"}
                      strokeWidth={isActive ? 2 : 1}
                    />
                    <text
                      y={-r - 5}
                      textAnchor="middle"
                      className="pointer-events-none select-none"
                      fontSize={9}
                      fill={isActive || isNeighbour ? "#f5f5f5" : "#a3a3a3"}
                    >
                      {n.name}
                    </text>
                  </g>
                );
              })}
            </g>
          </svg>
        </div>

        <div className="mt-4 flex flex-wrap gap-x-4 gap-y-1.5">
          {colorMode === "strand"
            ? STRANDS.map((s) => (
                <span
                  key={s}
                  className="inline-flex items-center gap-1.5 text-xs text-neutral-400"
                >
                  <span
                    className="w-2 h-2 rounded-full"
                    style={{ backgroundColor: strandColor(s) }}
                    aria-hidden
                  />
                  {s}
                </span>
              ))
            : communities.map((c) => (
                <span
                  key={c.community_id}
                  className="inline-flex items-center gap-1.5 text-xs text-neutral-400"
                >
                  <span
                    className="w-2 h-2 rounded-full"
                    style={{
                      backgroundColor:
                        COMMUNITY_COLORS[c.community_id % COMMUNITY_COLORS.length],
                    }}
                    aria-hidden
                  />
                  {c.dominant_strand} ({c.size})
                </span>
              ))}
        </div>
      </div>

      <aside className="xl:sticky xl:top-20 xl:self-start">
        {selectedNode ? (
          <div className="rounded-lg border border-neutral-800 bg-neutral-900/60 p-5">
            <h3 className="font-medium text-lg">{selectedNode.name}</h3>
            <div className="mt-1 flex items-center gap-2 text-xs text-neutral-400">
              <span
                className="w-2 h-2 rounded-full"
                style={{ backgroundColor: strandColor(selectedNode.strand) }}
                aria-hidden
              />
              {selectedNode.strand}
            </div>
            <dl className="mt-4 space-y-1.5 text-sm">
              <div className="flex justify-between gap-3">
                <dt className="text-neutral-500">Formed</dt>
                <dd>{selectedNode.formed_year ?? "unrecorded"}</dd>
              </div>
              <div className="flex justify-between gap-3">
                <dt className="text-neutral-500">Origin</dt>
                <dd>{selectedNode.origin_city || "unrecorded"}</dd>
              </div>
              <div className="flex justify-between gap-3">
                <dt className="text-neutral-500">Documented events</dt>
                <dd className="tabular-nums">{selectedNode.event_count}</dd>
              </div>
              <div className="flex justify-between gap-3">
                <dt className="text-neutral-500">Connections shown</dt>
                <dd className="tabular-nums">{neighbours.size}</dd>
              </div>
            </dl>

            <Link
              href={`/artists/${selectedNode.id}`}
              className="mt-4 inline-block text-sm text-emerald-400 hover:underline"
            >
              Full profile →
            </Link>

            {neighbours.size > 0 ? (
              <div className="mt-5 border-t border-neutral-800 pt-4">
                <h4 className="text-xs uppercase tracking-wider text-neutral-500 mb-2">
                  Connected to
                </h4>
                <ul className="space-y-2.5 max-h-72 overflow-y-auto pr-1">
                  {[...neighbours.entries()].map(([id, link]) => (
                    <li key={id} className="text-sm">
                      <button
                        onClick={() => setSelected(id)}
                        className="text-neutral-200 hover:text-emerald-300 transition-colors text-left"
                      >
                        {nodeById[id]?.name ?? id}
                      </button>
                      <div className="text-xs text-neutral-500 leading-snug">
                        {link.detail}
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            ) : null}
          </div>
        ) : (
          <div className="rounded-lg border border-dashed border-neutral-800 p-5 text-sm text-neutral-500">
            <p>
              Click an act to inspect it: what it is connected to, and on what
              evidence.
            </p>
            <p className="mt-3">
              Node size is the number of documented events. Dashed edges are the
              inferred layer — shared taste in global influences, not observed
              shared audience.
            </p>
          </div>
        )}
      </aside>
    </div>
  );
}
