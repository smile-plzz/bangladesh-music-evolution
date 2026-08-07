import fs from "node:fs";
import path from "node:path";

const DATA_ROOT = path.join(process.cwd(), "data");

export type ArtistInfluence = {
  artist_or_genre: string;
  evidence: string;
  source: string;
  confidence: "high" | "medium" | "low" | string;
};

export type ArtistMember = {
  name: string;
  role: string;
  years_active: string;
  current: boolean;
};

export type DiscographyEntry = {
  title: string;
  year: number;
  type: string;
  notable_tracks: string[];
};

export type Source = {
  title: string;
  url: string;
  type: string;
};

export type Artist = {
  id: string;
  name: string;
  type: string;
  formed_year: number | null;
  disbanded_year: number | null;
  origin_city: string;
  genres: string[];
  languages: string[];
  members: ArtistMember[];
  discography_summary: DiscographyEntry[];
  global_influences: ArtistInfluence[];
  local_adaptation_notes: string;
  sound_evolution_summary: string;
  concert_culture_notes: string;
  listener_community_notes: string;
  sources: Source[];
  tags: string[];
  last_updated: string;
};

export type ConcertArtist = {
  artist_id: string;
  billing: string;
};

export type Concert = {
  id: string;
  name: string;
  date: string;
  date_precision: string;
  type: string;
  venue: {
    name: string;
    city: string;
    country: string;
    venue_type: string;
  };
  organizer: string;
  artists: ConcertArtist[];
  genres_represented: string[];
  attendance_confidence: string;
  notes: string;
  sources: Source[];
  tags: string[];
  last_updated: string;
};

export type NetworkNode = {
  id: string;
  name: string;
  genres: string[];
  event_count: number;
};

export type NetworkEdge = {
  source: string;
  target: string;
  weight: number;
  shared_events?: string[];
};

export type Network = {
  description: string;
  node_count: number;
  edge_count: number;
  isolated_node_count: number;
  nodes: NetworkNode[];
  edges: NetworkEdge[];
};

function readJson<T>(relPath: string): T {
  const full = path.join(DATA_ROOT, relPath);
  return JSON.parse(fs.readFileSync(full, "utf-8")) as T;
}

export function getAllArtists(): Artist[] {
  const artistsDir = path.join(DATA_ROOT, "artists");
  if (!fs.existsSync(artistsDir)) return [];
  const dirs = fs
    .readdirSync(artistsDir, { withFileTypes: true })
    .filter((d) => d.isDirectory())
    .map((d) => d.name);

  const artists: Artist[] = [];
  for (const dir of dirs) {
    const metaPath = path.join("artists", dir, "metadata.json");
    if (fs.existsSync(path.join(DATA_ROOT, metaPath))) {
      artists.push(readJson<Artist>(metaPath));
    }
  }
  return artists.sort((a, b) => a.name.localeCompare(b.name));
}

export function getArtist(id: string): Artist | null {
  const metaPath = path.join("artists", id, "metadata.json");
  if (!fs.existsSync(path.join(DATA_ROOT, metaPath))) return null;
  return readJson<Artist>(metaPath);
}

export function getAllConcerts(): Concert[] {
  const concertsDir = path.join(DATA_ROOT, "concerts");
  if (!fs.existsSync(concertsDir)) return [];
  const files = fs
    .readdirSync(concertsDir)
    .filter((f) => f.endsWith(".json"));

  return files
    .map((f) => readJson<Concert>(path.join("concerts", f)))
    .sort((a, b) => (a.date < b.date ? 1 : -1));
}

export function getConcert(id: string): Concert | null {
  const concerts = getAllConcerts();
  return concerts.find((c) => c.id === id) ?? null;
}

export function getConcertsForArtist(artistId: string): Concert[] {
  return getAllConcerts().filter((c) =>
    c.artists.some((a) => a.artist_id === artistId)
  );
}

export function getNetwork(): Network | null {
  const netPath = path.join("networks", "bmpn-prototype.json");
  if (!fs.existsSync(path.join(DATA_ROOT, netPath))) return null;
  return readJson<Network>(netPath);
}

export function getAllGenres(): { genre: string; artists: Artist[] }[] {
  const artists = getAllArtists();
  const map = new Map<string, Artist[]>();
  for (const artist of artists) {
    for (const genre of artist.genres) {
      if (!map.has(genre)) map.set(genre, []);
      map.get(genre)!.push(artist);
    }
  }
  return Array.from(map.entries())
    .map(([genre, artists]) => ({ genre, artists }))
    .sort((a, b) => b.artists.length - a.artists.length);
}
