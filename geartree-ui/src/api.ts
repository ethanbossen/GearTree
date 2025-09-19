// src/api.ts
const HOSTNAME = "http://localhost:5262";
import type {
  Artist,
  ArtistDetail,
  Guitar,
  GuitarDetail,
  Amplifier,
  AmplifierDetail,
} from "./types";

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
// Upload
// -------------------------
export const Upload = {
  uploadFile: async (
    file: File,
    entityType: string,
    fieldKey: string,
    artistName?: string // only used for artist hero photos
  ): Promise<{ url: string }> => {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("entityType", entityType);
    formData.append("fieldKey", fieldKey);

    if (entityType === "artists" && artistName) {
      formData.append("artistName", artistName);
    }

    const res = await fetch(`${HOSTNAME}/upload`, {
      method: "POST",
      body: formData,
    });

    if (!res.ok) {
      throw new Error(`Upload failed: ${res.statusText}`);
    }

    return res.json();
  },
};


