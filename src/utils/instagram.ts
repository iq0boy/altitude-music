// Build-time Instagram feed (official "Instagram API with Instagram Login").
// Fetched once per build with the INSTAGRAM_TOKEN env var (set on Netlify);
// pictures are remote URLs optimised by Astro's <Image>. Without a token, or on
// any error, the feed is empty and the site builds without Instagram content.
import type { ServiceKey } from '../data/services';

export interface InstagramPost {
  id: string;
  type: 'reel' | 'image' | 'carousel';
  permalink: string;      // https://www.instagram.com/reel/<code>/ or /p/<code>/
  caption: string;
  timestamp: string;
  picture: string;        // remote picture URL (cover for reels)
  services: ServiceKey[]; // classified from the caption (hashtags, then keywords)
}

const LIMIT = 50;
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

let cached: Promise<InstagramPost[]> | null = null;
export function getInstagramPosts(): Promise<InstagramPost[]> {
  if (cached) return cached;
  cached = (async () => {
    const token = import.meta.env.INSTAGRAM_TOKEN as string | undefined;
    if (!token) { console.warn('[instagram] INSTAGRAM_TOKEN absent — pas de posts Instagram dans ce build.'); return []; }
    try {
      const fields = 'id,caption,media_type,media_url,thumbnail_url,permalink,timestamp';
      const res = await fetch(`https://graph.instagram.com/me/media?fields=${fields}&limit=${LIMIT}&access_token=${encodeURIComponent(token)}`, { signal: AbortSignal.timeout(15000) });
      const json = await res.json();
      if (!res.ok || !Array.isArray(json.data)) throw new Error(json?.error?.message ?? `HTTP ${res.status}`);
      const posts: InstagramPost[] = [];
      for (const m of json.data) {
        const picture = m.media_type === 'VIDEO' ? m.thumbnail_url : m.media_url;
        if (!picture || !m.permalink) continue;
        const caption = String(m.caption ?? '').replace(/\s+/g, ' ').trim();
        posts.push({
          id: String(m.id),
          type: m.media_type === 'VIDEO' ? 'reel' : m.media_type === 'CAROUSEL_ALBUM' ? 'carousel' : 'image',
          permalink: normalizePermalink(m.permalink),
          caption,
          timestamp: m.timestamp,
          picture,
          services: classify(caption),
        });
      }
      console.log(`[instagram] ${posts.length} posts récupérés`);
      return posts;
    } catch (err) {
      console.warn('[instagram] récupération impossible :', (err as Error).message);
      return [];
    }
  })();
  return cached;
}
