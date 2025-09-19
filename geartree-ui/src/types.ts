// src/types.ts

// -------------------------
// Base types
// -------------------------
export interface EntityBase {
  id: number;
  name: string;
  photoUrl: string;
  description: string;
  yearStart: number;
  yearEnd: number | null; // null when still in production / active
}

export interface RelatedItem {
  id: number;
  name: string;
  photoUrl?: string | null;
  summary?: string | null;
}

export interface RelatedSection {
  key: string;
  title: string;
  basePath: string;
  data?: RelatedItem[];
}

// -------------------------
// Brief DTOs
// -------------------------
export interface ArtistBrief extends RelatedItem {
  summary: string | null;
}

export interface GuitarBrief extends RelatedItem {
  yearStart: number;
  yearEnd: number | null;
  summary: string | null;
}

export interface AmplifierBrief extends RelatedItem {
  yearStart: number;
  yearEnd: number | null;
  summary: string | null;
}

// -------------------------
// Full DTOs
// -------------------------
export interface Artist extends EntityBase {
  heroPhotoUrl: string;
  otherPhotos: string[];
  tagline: string;
  summary: string;
  bands: string[];
  amplifiers: AmplifierBrief[];
  guitars: GuitarBrief[];
}

export interface Guitar extends EntityBase {
  summary: string;
  type: string;
  genres: string[];
  pickups: string[];
  otherPhotos: string[];
  relatedGuitars: GuitarBrief[];
  artists: ArtistBrief[];
}

export interface Amplifier extends EntityBase {
  summary: string;
  isTube: boolean;
  gainStructure: string;
  priceStart: number | null;
  priceEnd: number | null;
  wattage: number;
  speakerConfiguration: string;
  manufacturer: string;
  otherPhotos: string[];
  relatedAmps: AmplifierBrief[];
  artists: ArtistBrief[];
}

// -------------------------
// Detail DTOs
// -------------------------
export interface ArtistDetail extends Artist {}
export interface GuitarDetail extends Guitar {}
export interface AmplifierDetail extends Amplifier {}

/// - Uniques -----
export interface CarouselItem {
  id: number | string;
  name: string;
  photoUrl?: string | null;
  summary?: string | null;
  tagline?: string;
  yearStart?: number;
  yearEnd?: number;
}

// -------------------------
// API Service shape
// -------------------------
export interface ApiService<T> {
  get: (id: number) => Promise<T>;
}
