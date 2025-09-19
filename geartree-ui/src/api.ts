// src/api.ts
const HOSTNAME = "http://localhost:5262";
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import type {
  Artist,
  ArtistDetail,
  Guitar,
  GuitarDetail,
  Amplifier,
  AmplifierDetail,
} from "./types";

// -------------------------
// Query Keys (centralized for consistency)
// -------------------------
export const queryKeys = {
  // Artists
  artists: ['artists'] as const,
  artistsList: () => [...queryKeys.artists, 'list'] as const,
  artistDetail: (id: number) => [...queryKeys.artists, 'detail', id] as const,
  
  // Guitars
  guitars: ['guitars'] as const,
  guitarsList: () => [...queryKeys.guitars, 'list'] as const,
  guitarDetail: (id: number) => [...queryKeys.guitars, 'detail', id] as const,
  
  // Amps
  amps: ['amps'] as const,
  ampsList: () => [...queryKeys.amps, 'list'] as const,
  ampDetail: (id: number) => [...queryKeys.amps, 'detail', id] as const,
} as const;

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
// Base API functions (no caching logic - React Query handles that)
// -------------------------
const baseAPI = {
  // Artists
  getArtists: () => fetchJson<Artist[]>(`${HOSTNAME}/artists`),
  getArtist: (id: number) => 
    fetchJson<ArtistDetail>(`${HOSTNAME}/artists/${id}`, undefined, "404: Artist not found"),
  createArtist: (artist: Partial<Artist>) =>
    fetchJson<ArtistDetail>(`${HOSTNAME}/artists`, jsonOptions("POST", artist)),
  updateArtist: (id: number, artist: Partial<Artist>) =>
    fetchJson<ArtistDetail>(`${HOSTNAME}/artists/${id}`, jsonOptions("PATCH", artist)),
  deleteArtist: (id: number) =>
    fetchJson<void>(`${HOSTNAME}/artists/${id}`, { method: "DELETE" }),
  addGuitarToArtist: (artistId: number, guitarId: number) =>
    fetchJson<ArtistDetail>(`${HOSTNAME}/artists/${artistId}/guitars/${guitarId}`, { method: "POST" }),
  addAmpToArtist: (artistId: number, ampId: number) =>
    fetchJson<ArtistDetail>(`${HOSTNAME}/artists/${artistId}/amps/${ampId}`, { method: "POST" }),

  // Guitars  
  getGuitars: () => fetchJson<Guitar[]>(`${HOSTNAME}/guitars`),
  getGuitar: (id: number) =>
    fetchJson<GuitarDetail>(`${HOSTNAME}/guitars/${id}`, undefined, "404: Guitar not found"),
  createGuitar: (guitar: Partial<Guitar>) =>
    fetchJson<GuitarDetail>(`${HOSTNAME}/guitars`, jsonOptions("POST", guitar)),
  updateGuitar: (id: number, guitar: Partial<Guitar>) =>
    fetchJson<GuitarDetail>(`${HOSTNAME}/guitars/${id}`, jsonOptions("PATCH", guitar)),
  deleteGuitar: (id: number) =>
    fetchJson<void>(`${HOSTNAME}/guitars/${id}`, { method: "DELETE" }),
  addRelatedGuitar: (id: number, relatedId: number) =>
    fetchJson<GuitarDetail>(`${HOSTNAME}/guitars/${id}/related/${relatedId}`, { method: "POST" }),

  // Amps
  getAmps: () => fetchJson<Amplifier[]>(`${HOSTNAME}/amps`),
  getAmp: (id: number) =>
    fetchJson<AmplifierDetail>(`${HOSTNAME}/amps/${id}`, undefined, "404: Amp not found"),
  createAmp: (amp: Partial<Amplifier>) =>
    fetchJson<AmplifierDetail>(`${HOSTNAME}/amps`, jsonOptions("POST", amp)),
  updateAmp: (id: number, amp: Partial<Amplifier>) =>
    fetchJson<AmplifierDetail>(`${HOSTNAME}/amps/${id}`, jsonOptions("PATCH", amp)),
  deleteAmp: (id: number) =>
    fetchJson<void>(`${HOSTNAME}/amps/${id}`, { method: "DELETE" }),
  addRelatedAmp: (id: number, relatedId: number) =>
    fetchJson<AmplifierDetail>(`${HOSTNAME}/amps/${id}/related/${relatedId}`, { method: "POST" }),
};

// -------------------------
// React Query Hooks
// -------------------------

// Artists hooks
export const useArtists = () => {
  return useQuery({
    queryKey: queryKeys.artistsList(),
    queryFn: baseAPI.getArtists,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

export const useArtist = (id: number) => {
  return useQuery({
    queryKey: queryKeys.artistDetail(id),
    queryFn: () => baseAPI.getArtist(id),
    staleTime: 10 * 60 * 1000, // 10 minutes
  });
};

export const useCreateArtist = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: baseAPI.createArtist,
    onSuccess: (newArtist) => {
      // Add to list cache
      queryClient.setQueryData(queryKeys.artistsList(), (old: Artist[] = []) => [...old, newArtist]);
      // Cache the new artist detail
      queryClient.setQueryData(queryKeys.artistDetail(newArtist.id), newArtist);
    },
  });
};

export const useUpdateArtist = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: Partial<Artist> }) => 
      baseAPI.updateArtist(id, data),
    onSuccess: (updatedArtist) => {
      // Update detail cache
      queryClient.setQueryData(queryKeys.artistDetail(updatedArtist.id), updatedArtist);
      // Invalidate list to refresh summary info
      queryClient.invalidateQueries({ queryKey: queryKeys.artistsList() });
    },
  });
};

export const useDeleteArtist = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: baseAPI.deleteArtist,
    onSuccess: (_, deletedId) => {
      // Remove from list cache
      queryClient.setQueryData(queryKeys.artistsList(), (old: Artist[] = []) => 
        old.filter(artist => artist.id !== deletedId)
      );
      // Remove detail cache
      queryClient.removeQueries({ queryKey: queryKeys.artistDetail(deletedId) });
    },
  });
};

export const useAddGuitarToArtist = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ artistId, guitarId }: { artistId: number; guitarId: number }) =>
      baseAPI.addGuitarToArtist(artistId, guitarId),
    onSuccess: (updatedArtist, { artistId, guitarId }) => {
      // Update artist detail
      queryClient.setQueryData(queryKeys.artistDetail(artistId), updatedArtist);
      // Invalidate guitar detail (it might show which artists use it)
      queryClient.invalidateQueries({ queryKey: queryKeys.guitarDetail(guitarId) });
    },
  });
};

// Guitars hooks
export const useGuitars = () => {
  return useQuery({
    queryKey: queryKeys.guitarsList(),
    queryFn: baseAPI.getGuitars,
    staleTime: 5 * 60 * 1000,
  });
};

export const useGuitar = (id: number) => {
  return useQuery({
    queryKey: queryKeys.guitarDetail(id),
    queryFn: () => baseAPI.getGuitar(id),
    staleTime: 10 * 60 * 1000,
  });
};

export const useCreateGuitar = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: baseAPI.createGuitar,
    onSuccess: (newGuitar) => {
      queryClient.setQueryData(queryKeys.guitarsList(), (old: Guitar[] = []) => [...old, newGuitar]);
      queryClient.setQueryData(queryKeys.guitarDetail(newGuitar.id), newGuitar);
    },
  });
};

export const useUpdateGuitar = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: Partial<Guitar> }) => 
      baseAPI.updateGuitar(id, data),
    onSuccess: (updatedGuitar) => {
      queryClient.setQueryData(queryKeys.guitarDetail(updatedGuitar.id), updatedGuitar);
      queryClient.invalidateQueries({ queryKey: queryKeys.guitarsList() });
    },
  });
};

export const useDeleteGuitar = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: baseAPI.deleteGuitar,
    onSuccess: (_, deletedId) => {
      queryClient.setQueryData(queryKeys.guitarsList(), (old: Guitar[] = []) => 
        old.filter(guitar => guitar.id !== deletedId)
      );
      queryClient.removeQueries({ queryKey: queryKeys.guitarDetail(deletedId) });
      // Invalidate artists that might reference this guitar
      queryClient.invalidateQueries({ queryKey: queryKeys.artists });
    },
  });
};

// Amps hooks
export const useAmps = () => {
  return useQuery({
    queryKey: queryKeys.ampsList(),
    queryFn: baseAPI.getAmps,
    staleTime: 5 * 60 * 1000,
  });
};

export const useAmp = (id: number) => {
  return useQuery({
    queryKey: queryKeys.ampDetail(id),
    queryFn: () => baseAPI.getAmp(id),
    staleTime: 10 * 60 * 1000,
  });
};

export const useCreateAmp = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: baseAPI.createAmp,
    onSuccess: (newAmp) => {
      queryClient.setQueryData(queryKeys.ampsList(), (old: Amplifier[] = []) => [...old, newAmp]);
      queryClient.setQueryData(queryKeys.ampDetail(newAmp.id), newAmp);
    },
  });
};

// -------------------------
// Upload (unchanged - doesn't need caching)
// -------------------------
export const Upload = {
  uploadFile: async (
    file: File,
    entityType: string,
    fieldKey: string,
    artistName?: string
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

// -------------------------
// Legacy API compatibility (if you need it during transition)
// -------------------------
export const Artists = {
  list: baseAPI.getArtists,
  get: baseAPI.getArtist,
  create: baseAPI.createArtist,
  patch: baseAPI.updateArtist,
  delete: baseAPI.deleteArtist,
  addGuitar: baseAPI.addGuitarToArtist,
  addAmp: baseAPI.addAmpToArtist,
};

export const Guitars = {
  list: baseAPI.getGuitars,
  get: baseAPI.getGuitar,
  create: baseAPI.createGuitar,
  patch: baseAPI.updateGuitar,
  delete: baseAPI.deleteGuitar,
  addRelated: baseAPI.addRelatedGuitar,
};

export const Amps = {
  list: baseAPI.getAmps,
  get: baseAPI.getAmp,
  create: baseAPI.createAmp,
  patch: baseAPI.updateAmp,
  delete: baseAPI.deleteAmp,
  addRelated: baseAPI.addRelatedAmp,
};