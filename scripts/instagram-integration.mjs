// Astro integration: at startup (dev and build) fetch the studio's latest Instagram
// posts with INSTAGRAM_TOKEN, download the pictures into src/assets/instagram/
// (gitignored) and write src/data/instagram.json. Downloads retry; a post whose
// picture cannot be fetched is skipped, so a network hiccup never fails the build.
import fs from 'node:fs/promises';
import path from 'node:path';
import { loadEnv } from 'vite';

const LIMIT = 50;
const ASSETS = path.resolve('src/assets/instagram');
const DATA = path.resolve('src/data/instagram.json');

async function fetchRetry(url, opts = {}, tries = 3) {
  let last;
  for (let i = 0; i < tries; i++) {
    try {
      const res = await fetch(url, { ...opts, signal: AbortSignal.timeout(20000) });
      if (res.ok) return res;
      last = new Error(`HTTP ${res.status}`);
    } catch (err) { last = err; }
    await new Promise(r => setTimeout(r, 800 * (i + 1)));
  }
  throw last;
}

export async function syncInstagram(token) {
  await fs.mkdir(ASSETS, { recursive: true });
  if (!token) {
    console.warn('[instagram] INSTAGRAM_TOKEN absent — pas de posts Instagram dans ce build.');
    await fs.writeFile(DATA, '[]\n');
    return;
  }
  let data;
  try {
    const fields = 'id,caption,media_type,media_url,thumbnail_url,permalink,timestamp';
    const res = await fetchRetry(`https://graph.instagram.com/me/media?fields=${fields}&limit=${LIMIT}&access_token=${encodeURIComponent(token)}`);
    data = (await res.json()).data;
    if (!Array.isArray(data)) throw new Error('réponse inattendue');
  } catch (err) {
    console.warn('[instagram] API injoignable :', err.message, '— posts précédents conservés si présents.');
    try { await fs.access(DATA); } catch { await fs.writeFile(DATA, '[]\n'); }
    return;
  }
  const posts = [];
  for (const m of data) {
    const picture = m.media_type === 'VIDEO' ? m.thumbnail_url : m.media_url;
    if (!picture || !m.permalink) continue;
    const file = `${m.id}.jpg`;
    const dest = path.join(ASSETS, file);
    try { await fs.access(dest); } catch {
      try {
        const r = await fetchRetry(picture);
        await fs.writeFile(dest, Buffer.from(await r.arrayBuffer()));
      } catch (err) { console.warn(`[instagram] image ${m.id} ignorée :`, err.message); continue; }
    }
    posts.push({
      id: String(m.id),
      type: m.media_type === 'VIDEO' ? 'reel' : m.media_type === 'CAROUSEL_ALBUM' ? 'carousel' : 'image',
      permalink: m.permalink,
      caption: String(m.caption ?? '').replace(/\s+/g, ' ').trim(),
      timestamp: m.timestamp,
      image: file,
    });
  }
  await fs.writeFile(DATA, JSON.stringify(posts, null, 2) + '\n');
  const keep = new Set(posts.map(p => p.image));
  for (const f of await fs.readdir(ASSETS)) if (f.endsWith('.jpg') && !keep.has(f)) await fs.unlink(path.join(ASSETS, f));
  console.log(`[instagram] ${posts.length} posts synchronisés`);
}

export default function instagramSync() {
  return {
    name: 'altitude-instagram-sync',
    hooks: {
      'astro:config:setup': async ({ command }) => {
        const env = loadEnv(command === 'dev' ? 'development' : 'production', process.cwd(), '');
        await syncInstagram(process.env.INSTAGRAM_TOKEN || env.INSTAGRAM_TOKEN);
      },
    },
  };
}
