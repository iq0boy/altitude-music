// Pulls the Spotify playlist embed page, parses its tracks, and writes
// one Markdown file per track into src/content/portfolio/.
// Run: node scripts/sync-portfolio.mjs
import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const PLAYLIST_ID = '5WLi8GndFcqKUgNoIuDeEE';
const __dirname = path.dirname(fileURLToPath(import.meta.url));
const OUT_DIR = path.join(__dirname, '..', 'src', 'content', 'portfolio');
const PLAYLIST_URL = `https://open.spotify.com/playlist/${PLAYLIST_ID}`;
const PALETTE = ['#fd5f2e', '#3206b8', '#ffff00', '#ffbdff', '#a0d4e6', '#3aa022'];

function slugify(s) {
  return s
    .normalize('NFD').replace(/[̀-ͯ]/g, '') // strip accents
    .toLowerCase()
    .replace(/['’]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');
}

function fmtDuration(ms) {
  const total = Math.round(ms / 1000);
  const m = Math.floor(total / 60);
  const s = total % 60;
  return `${m}:${String(s).padStart(2, '0')}`;
}

function yamlEscape(v) {
  return `"${String(v).replace(/\\/g, '\\\\').replace(/"/g, '\\"')}"`;
}

const res = await fetch(`https://open.spotify.com/embed/playlist/${PLAYLIST_ID}`, {
  headers: { 'User-Agent': 'Mozilla/5.0' },
});
if (!res.ok) throw new Error(`Spotify embed fetch failed: ${res.status}`);
const html = await res.text();

const m = html.match(/"trackList":(\[.*?\])(?=,"description"|,"isFromPersonalLibrary"|,"id")/s)
        ?? html.match(/"trackList":(\[.*?\]),"/s);
if (!m) throw new Error('Could not locate trackList in playlist HTML');
const tracks = JSON.parse(m[1]);
if (!Array.isArray(tracks) || tracks.length === 0) throw new Error('Empty trackList');

console.log(`Found ${tracks.length} tracks`);

// Wipe existing portfolio files
const existing = await fs.readdir(OUT_DIR);
for (const f of existing) if (f.endsWith('.md')) await fs.unlink(path.join(OUT_DIR, f));

await Promise.all(tracks.map(async (t, i) => {
  const id = t.uri.replace('spotify:track:', '');
  const slug = slugify(t.title) || `track-${i + 1}`;
  const color = PALETTE[i % PALETTE.length];
  const fm = [
    '---',
    `title: ${yamlEscape(t.title)}`,
    `artist: ${yamlEscape(t.subtitle)}`,
    `duration: ${yamlEscape(fmtDuration(t.duration))}`,
    `bpm: 0`,
    `genre: "Hip-Hop"`,
    `year: "2025"`,
    `color: "${color}"`,
    `sortOrder: ${i + 1}`,
    `spotifyUrl: "${PLAYLIST_URL}"`,
    `spotifyTrackId: "${id}"`,
    '---',
    '',
  ].join('\n');
  const file = path.join(OUT_DIR, `${slug}.md`);
  await fs.writeFile(file, fm, 'utf8');
  console.log(`  wrote ${slug}.md → ${id}`);
}));

console.log(`Done — ${tracks.length} tracks synced.`);
