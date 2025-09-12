// src/api.ts
const HOSTNAME = "http://localhost:5262";

// -------------------------
// Artists
// -------------------------

export async function fetchArtists() {
  const res = await fetch(`${HOSTNAME}/artists`);
  if (!res.ok) throw new Error("Failed to fetch artists");
  return res.json() as Promise<Artist[]>; // list view
}

export async function fetchArtistById(id: number) {
  const res = await fetch(`http://localhost:5262/artists/${id}`);
  if (!res.ok) {
    if (res.status === 404) {
      throw new Error("404: Artist not found");
    }
    throw new Error(`Failed to fetch artist: ${res.status}`);
  }
  return res.json() as Promise<ArtistDetail>;
}

// -------------------------
// Guitars
// -------------------------

export async function fetchGuitars() {
  const res = await fetch(`${HOSTNAME}/guitars`);
  if (!res.ok) throw new Error("Failed to fetch guitars");
  return res.json() as Promise<Guitar[]>;
}

// -------------------------
// Amplifiers
// -------------------------

export async function fetchAmps() {
  const res = await fetch(`${HOSTNAME}/amps`);
  if (!res.ok) throw new Error("Failed to fetch amps");
  return res.json() as Promise<Amplifier[]>;
}

// -------------------------
// Interfaces
// -------------------------

// List view (lightweight)
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
  amplifiers: Amplifier[];
  guitars: Guitar[];
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
  relatedAmps: Amplifier[];
}


// Detail view (richer)
export interface ArtistDetail extends Artist {
  heroPhotoUrl: string;
  otherPhotos: string[];
  tagline: string;
  description: string;
  bands: string[];
  amplifiers: Amplifier[];
  guitars: Guitar[];
}

// Amplifiers
export async function fetchAmpById(id: number) {
  const res = await fetch(`${HOSTNAME}/amps/${id}`);
  if (!res.ok) {
    if (res.status === 404) throw new Error("404: Amp not found");
    throw new Error(`Failed to fetch amp: ${res.status}`);
  }
  return res.json() as Promise<AmplifierDetail>;
}

// Guitars
export async function fetchGuitarById(id: number) {
  const res = await fetch(`${HOSTNAME}/guitars/${id}`);
  if (!res.ok) {
    if (res.status === 404) throw new Error("404: Guitar not found");
    throw new Error(`Failed to fetch guitar: ${res.status}`);
  }
  return res.json() as Promise<GuitarDetail>;
}

// Amp detail view (enriched)
export interface AmplifierDetail extends Amplifier {
  artists: Artist[];       // who uses this amp
  relatedAmpsDetailed: Amplifier[]; // richer than just string[]
}

// Guitar detail view (enriched)
export interface GuitarDetail extends Guitar {
  artists: Artist[];
  relatedGuitars: Guitar[];
}
