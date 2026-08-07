"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import {
  forceSimulation,
  forceLink,
  forceManyBody,
  forceCenter,
  forceCollide,
  type Simulation,
  type SimulationNodeDatum,
  type SimulationLinkDatum,
} from "d3-force";
import { select } from "d3-selection";
import "d3-transition";
import { zoom, zoomIdentity, type D3ZoomEvent } from "d3-zoom";
import { drag, type D3DragEvent } from "d3-drag";
import Link from "next/link";
import type { Network } from "@/lib/data";

type GraphNode = SimulationNodeDatum & {
  id: string;
  name: string;
  genres: string[];
  event_count: number;
};

type GraphLink = SimulationLinkDatum<GraphNode> & {
  weight: number;
};

const GENRE_COLORS: Record<string, string> = {
  "Progressive Metal": "#f472b6",
  "Progressive Rock": "#f472b6",
  "Heavy Metal": "#ef4444",
  "Mainstream Rock": "#f59e0b",
  "Hard Rock": "#f59e0b",
  "Alternative Rock": "#38bdf8",
  "Folk Rock": "#a3e635",
  "Folk Fusion": "#a3e635",
  Pop: "#e879f9",
  "Pop Rock": "#e879f9",
  "Hip-Hop": "#22d3ee",
  Rap: "#22d3ee",
  "Nu Metal": "#fb7185",
  Grunge: "#fb7185",
};
const FALLBACK_COLOR = "#94a3b8";

function primaryGenre(genres: string[]): string | null {
  for (const g of genres) {
    if (GENRE_COLORS[g]) return g;
  }
  return null;
}

function colorForGenres(genres: string[]): string {
  const g = primaryGenre(genres);
  return g ? GENRE_COLORS[g] : FALLBACK_COLOR;
}

const WIDTH = 900;
const HEIGHT = 640;

export default function NetworkGraph({ network }: { network: Network }) {
  const { nodes, links } = useMemo(() => {
    const nodes: GraphNode[] = network.nodes.map((n) => ({ ...n }));
    const links: GraphLink[] = network.edges.map((e) => ({
      source: e.source,
      target: e.target,
      weight: e.weight,
    }));
    return { nodes, links };
  }, [network]);

  const legendGenres = useMemo(() => {
    const present = new Set<string>();
    for (const n of nodes) {
      const g = primaryGenre(n.genres);
      if (g) present.add(g);
    }
    return Object.keys(GENRE_COLORS).filter((g) => present.has(g));
  }, [nodes]);

  const svgRef = useRef<SVGSVGElement | null>(null);
  const viewportRef = useRef<SVGGElement | null>(null);
  const simRef = useRef<Simulation<GraphNode, GraphLink> | null>(null);

  const [selected, setSelected] = useState<string | null>(null);
  const [hovered, setHovered] = useState<string | null>(null);
  const [query, setQuery] = useState("");
  const [activeGenre, setActiveGenre] = useState<string | null>(null);
  const [, setTick] = useState(0);

  const active = hovered ?? selected;

  useEffect(() => {
    const sim = forceSimulation<GraphNode>(nodes)
      .force(
        "link",
        forceLink<GraphNode, GraphLink>(links)
          .id((d) => d.id)
          .distance((d) => 140 - Math.min(d.weight, 6) * 10)
          .strength(0.4)
      )
      .force("charge", forceManyBody().strength(-180))
      .force("center", forceCenter(WIDTH / 2, HEIGHT / 2))
      .force("collide", forceCollide(28))
      .on("tick", () => setTick((t) => t + 1));

    simRef.current = sim;
    return () => {
      sim.stop();
    };
  }, [nodes, links]);

  // Pan & zoom
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
    const dragBehavior = drag<SVGGElement, GraphNode>()
      .on("start", (event: D3DragEvent<SVGGElement, GraphNode, GraphNode>) => {
        const sim = simRef.current;
        if (!event.active && sim) sim.alphaTarget(0.2).restart();
        d.fx = d.x;
        d.fy = d.y;
      })
      .on("drag", (event: D3DragEvent<SVGGElement, GraphNode, GraphNode>) => {
        d.fx = event.x;
        d.fy = event.y;
      })
      .on("end", (event: D3DragEvent<SVGGElement, GraphNode, GraphNode>) => {
        const sim = simRef.current;
        if (!event.active && sim) sim.alphaTarget(0);
        d.fx = null;
        d.fy = null;
      });
    select<SVGGElement, GraphNode>(el).datum(d).call(dragBehavior);
  }

  const connectedIds = useMemo(() => {
    if (!active) return null;
    const set = new Set<string>([active]);
    for (const l of links) {
      const s = l.source as unknown as GraphNode;
      const t = l.target as unknown as GraphNode;
      const sid = typeof s === "string" ? s : s.id;
      const tid = typeof t === "string" ? t : t.id;
      if (sid === active) set.add(tid);
      if (tid === active) set.add(sid);
    }
    return set;
  }, [active, links]);

  const matchesQuery = useMemo(() => {
    if (!query.trim()) return null;
    const q = query.trim().toLowerCase();
    return new Set(
      nodes.filter((n) => n.name.toLowerCase().includes(q)).map((n) => n.id)
    );
  }, [query, nodes]);

  function resetView() {
    if (!svgRef.current) return;
    const svgSel = select(svgRef.current);
    const zoomBehavior = zoom<SVGSVGElement, unknown>();
    svgSel.transition().duration(300).call(zoomBehavior.transform, zoomIdentity);
  }

  const selectedNode = nodes.find((n) => n.id === selected);

  return (
    <div className="rounded-lg border border-neutral-800 bg-neutral-900/30">
      <div className="flex flex-wrap items-center gap-3 px-4 py-3 border-b border-neutral-800">
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search artists…"
          className="flex-1 min-w-[160px] bg-neutral-950 border border-neutral-700 rounded-md px-3 py-1.5 text-sm placeholder:text-neutral-600 focus:outline-none focus:border-emerald-500"
        />
        <button
          onClick={resetView}
          className="px-3 py-1.5 rounded-md border border-neutral-700 text-xs text-neutral-300 hover:border-neutral-500 transition-colors"
        >
          Reset view
        </button>
      </div>

      <div className="flex flex-wrap gap-2 px-4 py-3 border-b border-neutral-800">
        {legendGenres.map((g) => (
          <button
            key={g}
            onClick={() => setActiveGenre(activeGenre === g ? null : g)}
            className="flex items-center gap-1.5 text-xs px-2 py-1 rounded-full border transition-colors"
            style={{
              borderColor: activeGenre === g ? GENRE_COLORS[g] : "#3f3f46",
              color: activeGenre && activeGenre !== g ? "#737373" : "#e5e5e5",
              backgroundColor: activeGenre === g ? `${GENRE_COLORS[g]}22` : "transparent",
            }}
          >
            <span
              className="inline-block w-2.5 h-2.5 rounded-full"
              style={{ backgroundColor: GENRE_COLORS[g] }}
            />
            {g}
          </button>
        ))}
        {activeGenre && (
          <button
            onClick={() => setActiveGenre(null)}
            className="text-xs px-2 py-1 rounded-full text-neutral-500 hover:text-neutral-300"
          >
            Clear filter
          </button>
        )}
      </div>

      <svg
        ref={svgRef}
        viewBox={`0 0 ${WIDTH} ${HEIGHT}`}
        className="w-full h-auto min-w-[600px] touch-none cursor-grab active:cursor-grabbing"
        onClick={(e) => {
          if (e.target === svgRef.current) setSelected(null);
        }}
      >
        <g ref={viewportRef}>
          <g>
            {links.map((l, i) => {
              const s = l.source as unknown as GraphNode;
              const t = l.target as unknown as GraphNode;
              const sid = typeof s === "string" ? s : s.id;
              const tid = typeof t === "string" ? t : t.id;
              const highlighted =
                connectedIds && connectedIds.has(sid) && connectedIds.has(tid);
              return (
                <line
                  key={i}
                  x1={typeof s === "string" ? 0 : s.x ?? 0}
                  y1={typeof s === "string" ? 0 : s.y ?? 0}
                  x2={typeof t === "string" ? 0 : t.x ?? 0}
                  y2={typeof t === "string" ? 0 : t.y ?? 0}
                  stroke={highlighted && active ? "#34d399" : "#3f3f46"}
                  strokeWidth={Math.min(1 + l.weight, 5)}
                  strokeOpacity={connectedIds ? (highlighted ? 0.9 : 0.08) : 0.5}
                />
              );
            })}
          </g>
          <g>
            {nodes.map((n) => {
              const genreDimmed = activeGenre ? primaryGenre(n.genres) !== activeGenre : false;
              const relationDimmed = connectedIds ? !connectedIds.has(n.id) : false;
              const searchDimmed = matchesQuery ? !matchesQuery.has(n.id) : false;
              const dimmed = genreDimmed || relationDimmed || searchDimmed;
              const r = 5 + Math.min(n.event_count, 6) * 2;
              const isSelected = selected === n.id;
              return (
                <g
                  key={n.id}
                  ref={(el) => attachDrag(el, n)}
                  className="node cursor-pointer"
                  transform={`translate(${n.x ?? WIDTH / 2}, ${n.y ?? HEIGHT / 2})`}
                  onMouseEnter={() => setHovered(n.id)}
                  onMouseLeave={() => setHovered(null)}
                  onClick={(e) => {
                    e.stopPropagation();
                    setSelected(selected === n.id ? null : n.id);
                  }}
                  opacity={dimmed ? 0.2 : 1}
                >
                  <circle
                    r={r}
                    fill={colorForGenres(n.genres)}
                    stroke={isSelected ? "#34d399" : "#0a0a0a"}
                    strokeWidth={isSelected ? 3 : 1.5}
                  />
                  {(active === n.id || matchesQuery?.has(n.id) || n.event_count > 0) && (
                    <text
                      x={r + 4}
                      y={4}
                      fontSize={11}
                      fill="#e5e5e5"
                      className="select-none pointer-events-none"
                    >
                      {n.name}
                    </text>
                  )}
                </g>
              );
            })}
          </g>
        </g>
      </svg>

      {selectedNode && (
        <div className="border-t border-neutral-800 px-4 py-3 text-sm flex items-center justify-between gap-3">
          <div>
            <Link
              href={`/artists/${selectedNode.id}`}
              className="text-emerald-400 hover:underline font-medium"
            >
              {selectedNode.name}
            </Link>
            <span className="text-neutral-500"> — {selectedNode.genres.join(", ")}</span>
            {selectedNode.event_count > 0 && (
              <span className="text-neutral-600">
                {" "}
                · {selectedNode.event_count} documented event
                {selectedNode.event_count === 1 ? "" : "s"}
              </span>
            )}
          </div>
          <button
            onClick={() => setSelected(null)}
            className="text-neutral-500 hover:text-neutral-300 text-xs shrink-0"
          >
            Clear
          </button>
        </div>
      )}
      {!selectedNode && hovered && (
        <div className="border-t border-neutral-800 px-4 py-3 text-sm text-neutral-500">
          {nodes.find((n) => n.id === hovered)?.name} — click to pin selection
        </div>
      )}
    </div>
  );
}
