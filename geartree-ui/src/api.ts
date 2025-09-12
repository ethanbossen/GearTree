// src/api.ts
const HOSTNAME = "http://localhost:5262";

// -------------------------
// Fetchers
// -------------------------

// Artists
export async function fetchArtists() {
  const res = await fetch(`${HOSTNAME}/artists`);
  if (!res.ok) throw new Error("Failed to fetch artists");
  return res.json() as Promise<Artist[]>; // list view
}

export async function fetchArtistById(id: number) {
  const res = await fetch(`${HOSTNAME}/artists/${id}`);
  if (!res.ok) {
    if (res.status === 404) throw new Error("404: Artist not found");
    throw new Error(`Failed to fetch artist: ${res.status}`);
  }
  return res.json() as Promise<ArtistDetail>;
}

// Guitars
export async function fetchGuitars() {
  const res = await fetch(`${HOSTNAME}/guitars`);
  if (!res.ok) throw new Error("Failed to fetch guitars");
  return res.json() as Promise<Guitar[]>; // list view only returns brief
}

export async function fetchGuitarById(id: number) {
  const res = await fetch(`${HOSTNAME}/guitars/${id}`);
  if (!res.ok) {
    if (res.status === 404) throw new Error("404: Guitar not found");
    throw new Error(`Failed to fetch guitar: ${res.status}`);
  }
  return res.json() as Promise<GuitarDetail>;
}

// Amps
export async function fetchAmps() {
  const res = await fetch(`${HOSTNAME}/amps`);
  if (!res.ok) throw new Error("Failed to fetch amps");
  return res.json() as Promise<Amplifier[]>; // list view only returns brief
}

export async function fetchAmpById(id: number) {
  const res = await fetch(`${HOSTNAME}/amps/${id}`);
  if (!res.ok) {
    if (res.status === 404) throw new Error("404: Amp not found");
    throw new Error(`Failed to fetch amp: ${res.status}`);
  }
  return res.json() as Promise<AmplifierDetail>;
}

// -------------------------
// Interfaces
// -------------------------

// ---- Brief DTOs ----
export interface ArtistBrief {
  id: number;
  name: string;
  photoUrl: string | null;
  summary: string | null;
}

export interface GuitarBrief {
  id: number;
  name: string;
  photoUrl: string | null;
  summary: string | null;
  yearStart: number;
  yearEnd: number | null;
}

export interface AmplifierBrief {
  id: number;
  name: string;
  photoUrl: string | null;
  summary: string | null;
  yearStart: number;
  yearEnd: number | null;
}

// ---- Full DTOs ----
export interface Artist {
  id: number;
  name: string;
  photoUrl: string;
  heroPhotoUrl: string;
  otherPhotos: string[];
  tagline: string;
  description: string;
  summary: string;
  bands: string[];
  amplifiers: AmplifierBrief[]; // uses brief
  guitars: GuitarBrief[];       // uses brief
}

export interface Guitar {
  id: number;
  name: string;
  photoUrl: string;
  description: string;
  summary: string;
  type: string;
  genres: string[];
  pickups: string[];
  yearStart: number;
  yearEnd: number | null;
  otherPhotos: string[];
  relatedGuitars: GuitarBrief[];
  artists: ArtistBrief[];
}

export interface Amplifier {
  id: number;
  name: string;
  photoUrl: string;
  description: string;
  summary: string;
  isTube: boolean;
  gainStructure: string;
  yearStart: number;
  yearEnd: number;
  priceStart: number;
  priceEnd: number;
  wattage: number;
  speakerConfiguration: string;
  manufacturer: string;
  otherPhotos: string[];
  relatedAmps: AmplifierBrief[];
  artists: ArtistBrief[];
}

// ---- Detail DTOs ----
export interface ArtistDetail extends Artist {
  amplifiers: AmplifierBrief[];
  guitars: GuitarBrief[];
}

export interface AmplifierDetail extends Amplifier {
  artists: ArtistBrief[];
  relatedAmps: AmplifierBrief[];
}

export interface GuitarDetail extends Guitar {
  artists: ArtistBrief[];
  relatedGuitars: GuitarBrief[];
}
