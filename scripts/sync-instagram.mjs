// Fetches the latest Instagram posts of the studio account via the official
// "Instagram API with Instagram Login" (graph.instagram.com), downloads the
// pictures into src/assets/instagram/ (Astro optimises them at build) and writes
// src/data/instagram.json. Reels keep their cover picture and link to Instagram.
// Needs INSTAGRAM_TOKEN (long-lived token, 60 days — refreshed by the workflow).
// Run: INSTAGRAM_TOKEN=... node scripts/sync-instagram.mjs
import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const TOKEN = process.env.INSTAGRAM_TOKEN;
const LIMIT = 12;
const ROOT = path.join(path.dirname(fileURLToPath(import.meta.url)), '..');
const ASSETS = path.join(ROOT, 'src', 'assets', 'instagram');
const DATA = path.join(ROOT, 'src', 'data', 'instagram.json');

if (!TOKEN) {
  console.log('INSTAGRAM_TOKEN absent — synchronisation ignorée (le site garde les posts déjà présents).');
  process.exit(0);
}

const fields = 'id,caption,media_type,media_url,thumbnail_url,permalink,timestamp';
const res = await fetch(`https://graph.instagram.com/me/media?fields=${fields}&limit=${LIMIT}&access_token=${encodeURIComponent(TOKEN)}`);
const json = await res.json();
if (!res.ok || !Array.isArray(json.data)) {
  throw new Error(`Instagram API: ${res.status} ${json?.error?.message ?? ''}`);
}

await fs.mkdir(ASSETS, { recursive: true });
const posts = [];
for (const m of json.data) {
  const picture = m.media_type === 'VIDEO' ? m.thumbnail_url : m.media_url;
  if (!picture) continue;
  const file = `${m.id}.jpg`;
  const dest = path.join(ASSETS, file);
  try { await fs.access(dest); } catch {
    const r = await fetch(picture);
    if (!r.ok) { console.warn(`  ! ${m.id}: image ${r.status}`); continue; }
    await fs.writeFile(dest, Buffer.from(await r.arrayBuffer()));
    console.log(`  + ${file}`);
  }
  posts.push({
    id: m.id,
    type: m.media_type === 'VIDEO' ? 'reel' : m.media_type === 'CAROUSEL_ALBUM' ? 'carousel' : 'image',
    permalink: m.permalink,
    caption: (m.caption ?? '').replace(/\s+/g, ' ').trim().slice(0, 140),
    timestamp: m.timestamp,
    image: file,
  });
}

await fs.writeFile(DATA, JSON.stringify(posts, null, 2) + '\n');

// Drop pictures of posts that left the feed.
const keep = new Set(posts.map(p => p.image));
let removed = 0;
for (const f of await fs.readdir(ASSETS)) {
  if (f.endsWith('.jpg') && !keep.has(f)) { await fs.unlink(path.join(ASSETS, f)); removed++; }
}
console.log(`Done — ${posts.length} posts, ${removed} old picture(s) removed.`);
