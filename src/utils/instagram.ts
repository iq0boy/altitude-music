// Instagram posts synced at startup by scripts/instagram-integration.mjs into
// src/data/instagram.json + src/assets/instagram/*.jpg (both gitignored).
// Classification per service: #alt* hashtags first, then caption keywords.
import type { ImageMetadata } from 'astro';
import type { ServiceKey } from '../data/services';
import raw from '../data/instagram.json';

export interface InstagramPost {
  id: string;
  hash: string;           // md5 of the picture, to drop repeated covers
  type: 'reel' | 'image' | 'carousel';
  permalink: string;      // https://www.instagram.com/reel/<code>/ or /p/<code>/
  caption: string;
  timestamp: string;
  picture: ImageMetadata; // local, optimised by <Image>
  services: ServiceKey[];
}

const HASHTAGS: Record<string, ServiceKey> = {
  altrec: 'rec', altmix: 'mix', altdesign: 'cover', altprod: 'prod', altcoach: 'coach', altcustom: 'book',
};
const KEYWORDS: [ServiceKey, RegExp][] = [
  ['rec',   /enregistr|recording|session studio|studio session|prise de voix/i],
  ['mix',   /\bmix|master/i],
  ['cover', /pochette|cover art|design|graphi|visuel|shooting/i],
  ['prod',  /\balbum\b|\bep\b|\bprod/i],
  ['coach', /consult|strat[ée]g|coaching|carri[èe]re/i],
];

export function classify(caption: string): ServiceKey[] {
  const tags = [...caption.matchAll(/#([a-z0-9_]+)/gi)].map(m => m[1].toLowerCase());
  const byTag = tags.map(t => HASHTAGS[t]).filter(Boolean) as ServiceKey[];
  if (byTag.length) return [...new Set(byTag)];
  return KEYWORDS.filter(([, re]) => re.test(caption)).map(([k]) => k);
}

export function isInstagram(url: string | undefined | null): boolean {
  return !!url && /instagram\.com\/(p|reel|reels)\/[\w-]+/.test(url);
}

export function normalizePermalink(url: string): string {
  const m = url.match(/instagram\.com\/(p|reel|reels)\/([\w-]+)/);
  return m ? `https://www.instagram.com/${m[1] === 'p' ? 'p' : 'reel'}/${m[2]}/` : url;
}

const pictures = import.meta.glob<{ default: ImageMetadata }>('../assets/instagram/*.jpg', { eager: true });

type Raw = { id: string; hash?: string; type: InstagramPost['type']; permalink: string; caption: string; timestamp: string; image: string };
const posts: InstagramPost[] = (raw as Raw[]).flatMap(p => {
  const picture = pictures[`../assets/instagram/${p.image}`]?.default;
  return picture ? [{ ...p, hash: p.hash ?? p.id, permalink: normalizePermalink(p.permalink), picture, services: classify(p.caption) }] : [];
});

export function getInstagramPosts(): InstagramPost[] { return posts; }

// Drop posts whose cover is (nearly) the same picture as one already kept (Hamming distance on the 64-bit hash).
export function dedupeByCover(list: InstagramPost[], maxDistance = 10): InstagramPost[] {
  const kept: InstagramPost[] = [];
  for (const p of list) {
    const dup = kept.some(k => k.hash.length === p.hash.length && [...k.hash].filter((c, i) => c !== p.hash[i]).length <= maxDistance);
    if (!dup) kept.push(p);
  }
  return kept;
}
