// src/api.ts
const HOSTNAME = "http://localhost:5262";

// -------------------------
// Generic helpers
// -------------------------
async function fetchJson<T>(
  url: string,
  options?: RequestInit,
  notFoundMsg?: string
): Promise<T> {
  const res = await fetch(url, options);
  if (!res.ok) {
    if (res.status === 404 && notFoundMsg) throw new Error(notFoundMsg);
    throw new Error(`${res.status}: ${res.statusText}`);
  }
  return res.json() as Promise<T>;
}

function jsonOptions(method: string, body?: any): RequestInit {
  return {
    method,
    headers: { "Content-Type": "application/json" },
    body: body ? JSON.stringify(body) : undefined,
  };
}

// -------------------------
// Artists
// -------------------------
export const Artists = {
  list: () => fetchJson<Artist[]>(`${HOSTNAME}/artists`),
  get: (id: number) =>
    fetchJson<ArtistDetail>(`${HOSTNAME}/artists/${id}`, undefined, "404: Artist not found"),
  create: (artist: Partial<Artist>) =>
    fetchJson<ArtistDetail>(`${HOSTNAME}/artists`, jsonOptions("POST", artist)),
  patch: (id: number, artist: Partial<Artist>) =>
    fetchJson<ArtistDetail>(`${HOSTNAME}/artists/${id}`, jsonOptions("PATCH", artist)),
  delete: (id: number) =>
    fetchJson<void>(`${HOSTNAME}/artists/${id}`, { method: "DELETE" }),

  // Relations add a guitar to an artist and add an amp to an artist
  addGuitar: (artistId: number, guitarId: number) =>
    fetchJson<ArtistDetail>(`${HOSTNAME}/artists/${artistId}/guitars/${guitarId}`, { method: "POST" }),
  addAmp: (artistId: number, ampId: number) =>
    fetchJson<ArtistDetail>(`${HOSTNAME}/artists/${artistId}/amps/${ampId}`, { method: "POST" }),

};

// -------------------------
// Guitars
// -------------------------
export const Guitars = {
  list: () => fetchJson<Guitar[]>(`${HOSTNAME}/guitars`),
  get: (id: number) =>
    fetchJson<GuitarDetail>(`${HOSTNAME}/guitars/${id}`, undefined, "404: Guitar not found"),
  create: (guitar: Partial<Guitar>) =>
    fetchJson<GuitarDetail>(`${HOSTNAME}/guitars`, jsonOptions("POST", guitar)),
  patch: (id: number, guitar: Partial<Guitar>) =>
    fetchJson<GuitarDetail>(`${HOSTNAME}/guitars/${id}`, jsonOptions("PATCH", guitar)),
  delete: (id: number) =>
    fetchJson<void>(`${HOSTNAME}/guitars/${id}`, { method: "DELETE" }),

  // Relations add a guitar as a related guitar (symetrical) and add a guitar to an artist
  addRelated: (id: number, relatedId: number) =>
    fetchJson<GuitarDetail>(`${HOSTNAME}/guitars/${id}/related/${relatedId}`, { method: "POST" }),
};

// -------------------------
// Amps
// -------------------------
export const Amps = {
  list: () => fetchJson<Amplifier[]>(`${HOSTNAME}/amps`),
  get: (id: number) =>
    fetchJson<AmplifierDetail>(`${HOSTNAME}/amps/${id}`, undefined, "404: Amp not found"),
  create: (amp: Partial<Amplifier>) =>
    fetchJson<AmplifierDetail>(`${HOSTNAME}/amps`, jsonOptions("POST", amp)),
  patch: (id: number, amp: Partial<Amplifier>) =>
    fetchJson<AmplifierDetail>(`${HOSTNAME}/amps/${id}`, jsonOptions("PATCH", amp)),
  delete: (id: number) =>
    fetchJson<void>(`${HOSTNAME}/amps/${id}`, { method: "DELETE" }),

  // Relational - add an amp as a related amp
  addRelated: (id: number, relatedId: number) =>
    fetchJson<AmplifierDetail>(`${HOSTNAME}/amps/${id}/related/${relatedId}`, { method: "POST" }),
};


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
  yearEnd: number | null;
  PriceStart: number | null;
  PriceEnd: number | null;
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
