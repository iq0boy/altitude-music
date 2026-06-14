import type { Lang } from '../i18n/utils';

// Canonical service keys + type. The editable content now lives in the
// `services` content collection (src/content/services/*.json), loaded at build
// time. These keys stay in code because they're referenced as stable ids
// (hash routing #service/<key>, JSON-LD @ids, testimonial.service matching).
export const SERVICE_KEYS = ['rec', 'mix', 'cover', 'prod', 'coach', 'book'] as const;
export type ServiceKey = typeof SERVICE_KEYS[number];

type Tri = Record<Lang, string>;
type TriList = Record<Lang, string[]>;

export interface ServiceData {
  key: ServiceKey;
  sortOrder: number;
  price: number;
  popular: boolean;
  name: Tri;
  unit: Tri;
  desc: Tri;
  long: Tri;
  includes: TriList;
  gallery: [string, string, string];
  video: string;
}

export interface TeamMember {
  name: string;
  handle: string;
  instagram: string;
  color: string;
  sortOrder: number;
  role: Tri;
}

export interface TestimonialData {
  name: string;
  role: string;
  service: ServiceKey;
  rating: number;
  sortOrder: number;
  text: Tri;
}

export interface SiteSettings {
  heroVideo?: string;
  ogImage?: string;
}
