"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import {
  forceSimulation,
  forceLink,
  forceManyBody,
  forceCenter,
  forceCollide,
  type SimulationNodeDatum,
  type SimulationLinkDatum,
} from "d3-force";
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

function colorForGenres(genres: string[]): string {
  for (const g of genres) {
    if (GENRE_COLORS[g]) return GENRE_COLORS[g];
  }
  return "#94a3b8";
}

export default function NetworkGraph({ network }: { network: Network }) {
  const width = 900;
  const height = 640;

  const { nodes, links } = useMemo(() => {
    const nodes: GraphNode[] = network.nodes.map((n) => ({ ...n }));
    const links: GraphLink[] = network.edges.map((e) => ({
      source: e.source,
      target: e.target,
      weight: e.weight,
    }));
    return { nodes, links };
  }, [network]);

  const [positions, setPositions] = useState<
    Record<string, { x: number; y: number }>
  >({});
  const [linkPositions, setLinkPositions] = useState<
    { source: string; target: string; weight: number; x1: number; y1: number; x2: number; y2: number }[]
  >([]);
  const [hovered, setHovered] = useState<string | null>(null);
  const simRef = useRef<ReturnType<typeof forceSimulation> | null>(null);

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
      .force("center", forceCenter(width / 2, height / 2))
      .force("collide", forceCollide(28))
      .stop();

    simRef.current = sim;
    sim.tick(300);

    const posMap: Record<string, { x: number; y: number }> = {};
    for (const n of nodes) {
      posMap[n.id] = { x: n.x ?? width / 2, y: n.y ?? height / 2 };
    }
    setPositions(posMap);

    setLinkPositions(
      links.map((l) => {
        const s = l.source as unknown as GraphNode;
        const t = l.target as unknown as GraphNode;
        return {
          source: s.id,
          target: t.id,
          weight: l.weight,
          x1: s.x ?? 0,
          y1: s.y ?? 0,
          x2: t.x ?? 0,
          y2: t.y ?? 0,
        };
      })
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [nodes, links]);

  const connectedIds = useMemo(() => {
    if (!hovered) return null;
    const set = new Set<string>([hovered]);
    for (const l of linkPositions) {
      if (l.source === hovered) set.add(l.target);
      if (l.target === hovered) set.add(l.source);
    }
    return set;
  }, [hovered, linkPositions]);

  return (
    <div className="rounded-lg border border-neutral-800 bg-neutral-900/30 overflow-x-auto">
      <svg
        viewBox={`0 0 ${width} ${height}`}
        className="w-full h-auto min-w-[600px]"
      >
        <g>
          {linkPositions.map((l, i) => (
            <line
              key={i}
              x1={l.x1}
              y1={l.y1}
              x2={l.x2}
              y2={l.y2}
              stroke={
                connectedIds && (connectedIds.has(l.source) || connectedIds.has(l.target)) && hovered
                  ? "#34d399"
                  : "#3f3f46"
              }
              strokeWidth={Math.min(1 + l.weight, 5)}
              strokeOpacity={
                connectedIds
                  ? connectedIds.has(l.source) && connectedIds.has(l.target)
                    ? 0.9
                    : 0.08
                  : 0.5
              }
            />
          ))}
        </g>
        <g>
          {nodes.map((n) => {
            const pos = positions[n.id];
            if (!pos) return null;
            const dimmed = connectedIds ? !connectedIds.has(n.id) : false;
            const r = 5 + Math.min(n.event_count, 6) * 2;
            return (
              <g
                key={n.id}
                transform={`translate(${pos.x}, ${pos.y})`}
                onMouseEnter={() => setHovered(n.id)}
                onMouseLeave={() => setHovered(null)}
                className="cursor-pointer"
                opacity={dimmed ? 0.25 : 1}
              >
                <circle
                  r={r}
                  fill={colorForGenres(n.genres)}
                  stroke="#0a0a0a"
                  strokeWidth={1.5}
                />
                {(hovered === n.id || n.event_count > 0) && (
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
      </svg>
      {hovered && (
        <div className="border-t border-neutral-800 px-4 py-3 text-sm">
          <Link
            href={`/artists/${hovered}`}
            className="text-emerald-400 hover:underline font-medium"
          >
            {nodes.find((n) => n.id === hovered)?.name}
          </Link>
          <span className="text-neutral-500">
            {" "}
            — {nodes.find((n) => n.id === hovered)?.genres.join(", ")}
          </span>
        </div>
      )}
    </div>
  );
}
