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
// Cache Management
// -------------------------
interface CacheEntry<T> {
  data: T;
  timestamp: number;
  ttl: number; // Time to live in milliseconds
}

class ApiCache {
  private cache: Record<string, CacheEntry<any>> = {};
  
  // Public TTL constants
  public readonly TTL = {
    LIST: 5 * 60 * 1000,    // 5 minutes for lists
    DETAIL: 10 * 60 * 1000, // 10 minutes for details
    STATIC: 60 * 60 * 1000, // 1 hour for rarely changing data
  } as const;

  set<T>(key: string, data: T, ttl?: number): void {
    this.cache[key] = {
      data,
      timestamp: Date.now(),
      ttl: ttl || this.TTL.DETAIL,
    };
  }

  get<T>(key: string): T | null {
    const entry = this.cache[key];
    if (!entry) return null;
    
    const now = Date.now();
    if (now - entry.timestamp > entry.ttl) {
      delete this.cache[key];
      return null;
    }
    
    return entry.data as T;
  }

  invalidate(pattern: string | RegExp): void {
    const keys = Object.keys(this.cache);
    keys.forEach(key => {
      if (typeof pattern === 'string') {
        if (key.includes(pattern)) {
          delete this.cache[key];
        }
      } else {
        if (pattern.test(key)) {
          delete this.cache[key];
        }
      }
    });
  }

  invalidateAll(): void {
    this.cache = {};
  }

  // Get cache stats for debugging
  getStats() {
    const keys = Object.keys(this.cache);
    const now = Date.now();
    const valid = keys.filter(key => {
      const entry = this.cache[key];
      return now - entry.timestamp <= entry.ttl;
    });
    
    return {
      total: keys.length,
      valid: valid.length,
      expired: keys.length - valid.length,
    };
  }
}

const cache = new ApiCache();

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

// Cached fetch with automatic cache key generation
async function cachedFetch<T>(
  cacheKey: string,
  fetcher: () => Promise<T>,
  ttl?: number,
  forceRefresh: boolean = false
): Promise<T> {
  if (!forceRefresh) {
    const cached = cache.get<T>(cacheKey);
    if (cached) {
      console.log(`Cache HIT: ${cacheKey}`);
      return cached;
    }
  }
  
  console.log(`Cache MISS: ${cacheKey}`);
  const data = await fetcher();
  cache.set(cacheKey, data, ttl);
  return data;
}

// -------------------------
// Base CRUD operations
// -------------------------
interface HasId {
  id: number;
}

function createCrudOperations<TList, TDetail extends HasId>(
  endpoint: string,
  entityName: string
) {
  return {
    list: (forceRefresh: boolean = false) =>
      cachedFetch(
        `${endpoint}:list`,
        () => fetchJson<TList[]>(`${HOSTNAME}/${endpoint}`),
        cache.TTL.LIST,
        forceRefresh
      ),

    get: (id: number, forceRefresh: boolean = false) =>
      cachedFetch(
        `${endpoint}:${id}`,
        () => fetchJson<TDetail>(
          `${HOSTNAME}/${endpoint}/${id}`, 
          undefined, 
          `404: ${entityName} not found`
        ),
        cache.TTL.DETAIL,
        forceRefresh
      ),

    create: async (data: Partial<TList>) => {
      const result = await fetchJson<TDetail>(
        `${HOSTNAME}/${endpoint}`, 
        jsonOptions("POST", data)
      );
      // Invalidate list cache since we added an item
      cache.invalidate(`${endpoint}:list`);
      // Cache the new item
      cache.set(`${endpoint}:${result.id}`, result);
      return result;
    },

    patch: async (id: number, data: Partial<TList>) => {
      const result = await fetchJson<TDetail>(
        `${HOSTNAME}/${endpoint}/${id}`, 
        jsonOptions("PATCH", data)
      );
      // Update caches
      cache.set(`${endpoint}:${id}`, result);
      cache.invalidate(`${endpoint}:list`); // List might show updated summary
      return result;
    },

    delete: async (id: number) => {
      await fetchJson<void>(`${HOSTNAME}/${endpoint}/${id}`, { method: "DELETE" });
      // Remove from caches
      cache.invalidate(`${endpoint}:${id}`);
      cache.invalidate(`${endpoint}:list`);
      // Also invalidate related data that might reference this item
      cache.invalidate(new RegExp(`related.*${id}`));
    },
  };
}

// -------------------------
// Artists
// -------------------------
export const Artists = {
  ...createCrudOperations<Artist, ArtistDetail>("artists", "Artist"),

  // Relations
  addGuitar: async (artistId: number, guitarId: number) => {
    const result = await fetchJson<ArtistDetail>(
      `${HOSTNAME}/artists/${artistId}/guitars/${guitarId}`, 
      { method: "POST" }
    );
    // Invalidate affected caches
    cache.invalidate(`artists:${artistId}`);
    cache.invalidate(`guitars:${guitarId}`);
    cache.set(`artists:${artistId}`, result);
    return result;
  },

  addAmp: async (artistId: number, ampId: number) => {
    const result = await fetchJson<ArtistDetail>(
      `${HOSTNAME}/artists/${artistId}/amps/${ampId}`, 
      { method: "POST" }
    );
    // Invalidate affected caches
    cache.invalidate(`artists:${artistId}`);
    cache.invalidate(`amps:${ampId}`);
    cache.set(`artists:${artistId}`, result);
    return result;
  },
};

// -------------------------
// Guitars
// -------------------------
export const Guitars = {
  ...createCrudOperations<Guitar, GuitarDetail>("guitars", "Guitar"),

  addRelated: async (id: number, relatedId: number) => {
    const result = await fetchJson<GuitarDetail>(
      `${HOSTNAME}/guitars/${id}/related/${relatedId}`, 
      { method: "POST" }
    );
    // Invalidate both guitars since relationship is symmetrical
    cache.invalidate(`guitars:${id}`);
    cache.invalidate(`guitars:${relatedId}`);
    cache.set(`guitars:${id}`, result);
    return result;
  },
};

// -------------------------
// Amps
// -------------------------
export const Amps = {
  ...createCrudOperations<Amplifier, AmplifierDetail>("amps", "Amp"),

  addRelated: async (id: number, relatedId: number) => {
    const result = await fetchJson<AmplifierDetail>(
      `${HOSTNAME}/amps/${id}/related/${relatedId}`, 
      { method: "POST" }
    );
    // Invalidate both amps
    cache.invalidate(`amps:${id}`);
    cache.invalidate(`amps:${relatedId}`);
    cache.set(`amps:${id}`, result);
    return result;
  },
};

// -------------------------
// Upload (no caching needed)
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
// Cache utilities for manual management
// -------------------------
export const CacheUtils = {
  // Force refresh specific data
  refreshArtist: (id: number) => Artists.get(id, true),
  refreshGuitar: (id: number) => Guitars.get(id, true),
  refreshAmp: (id: number) => Amps.get(id, true),
  
  refreshArtists: () => Artists.list(true),
  refreshGuitars: () => Guitars.list(true),
  refreshAmps: () => Amps.list(true),

  // Manual cache management
  invalidateAll: () => cache.invalidateAll(),
  invalidateArtists: () => cache.invalidate("artists:"),
  invalidateGuitars: () => cache.invalidate("guitars:"),
  invalidateAmps: () => cache.invalidate("amps:"),
  
  // Debug utilities
  getCacheStats: () => cache.getStats(),
  logCache: () => console.table(cache.getStats()),
};