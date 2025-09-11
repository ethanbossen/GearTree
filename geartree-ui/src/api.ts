// src/api.ts
export async function fetchArtists() {
  const res = await fetch("http://localhost:5262/artists");
  if (!res.ok) throw new Error("Failed to fetch artists");
  return res.json() as Promise<Artist[]>;
}

export async function fetchGuitars() {
  const res = await fetch("http://localhost:5262/guitars");
  if (!res.ok) throw new Error("Failed to fetch guitars");
  return res.json() as Promise<Guitar[]>;
}

export async function fetchAmps() {
  const res = await fetch("http://localhost:5262/amps");
  if (!res.ok) throw new Error("Failed to fetch amps");
  return res.json() as Promise<Amplifier[]>;
}

// You can define interfaces for clarity
export interface Artist {
  id: number;
  name: string;
  photoUrl: string;
  description: string;
  summary: string;
}

export interface Guitar {
  id: number;
  name: string;
  photoUrl: string;
  description: string;
  summary: string;
  type: string;
}

export interface Amplifier {
  id: number;
  name: string;
  photoUrl: string;
  description: string;
  summary: string;
}
