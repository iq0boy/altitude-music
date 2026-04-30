// Pulls the Spotify playlist embed page, parses its tracks, downloads the
// 30-second audio previews to public/audio/, and writes one Markdown file
// per track to src/content/music/. Run: node scripts/sync-music.mjs
import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const PLAYLIST_ID = '5WLi8GndFcqKUgNoIuDeEE';
const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.join(__dirname, '..');
const OUT_DIR = path.join(ROOT, 'src', 'content', 'music');
const AUDIO_DIR = path.join(ROOT, 'public', 'audio');
const PLAYLIST_URL = `https://open.spotify.com/playlist/${PLAYLIST_ID}`;
const PALETTE = ['#fd5f2e', '#3206b8', '#ffff00', '#ffbdff', '#a0d4e6', '#3aa022'];

function slugify(s) {
  return s
    .normalize('NFD').replace(/[̀-ͯ]/g, '')
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

const yamlEscape = (v) => `"${String(v).replace(/\\/g, '\\\\').replace(/"/g, '\\"')}"`;

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

await fs.mkdir(OUT_DIR, { recursive: true });
await fs.mkdir(AUDIO_DIR, { recursive: true });

for (const f of await fs.readdir(OUT_DIR)) {
  if (f.endsWith('.md')) await fs.unlink(path.join(OUT_DIR, f));
}

let downloaded = 0, skippedNoPreview = 0;

await Promise.all(tracks.map(async (t, i) => {
  const id = t.uri.replace('spotify:track:', '');
  const slug = slugify(t.title) || `track-${i + 1}`;
  const color = PALETTE[i % PALETTE.length];

  let audioPath = '';
  if (t.audioPreview?.url) {
    const audioFile = `${slug}.mp3`;
    const dest = path.join(AUDIO_DIR, audioFile);
    const r = await fetch(t.audioPreview.url);
    if (!r.ok) {
      console.warn(`  ! ${slug}: preview fetch ${r.status}`);
    } else {
      const buf = Buffer.from(await r.arrayBuffer());
      await fs.writeFile(dest, buf);
      audioPath = `/audio/${audioFile}`;
      downloaded++;
    }
  } else {
    skippedNoPreview++;
    console.warn(`  ! ${slug}: no audioPreview available`);
  }

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
    `audioSrc: "${audioPath}"`,
    `previewDuration: 30`,
    '---',
    '',
  ].join('\n');

  await fs.writeFile(path.join(OUT_DIR, `${slug}.md`), fm, 'utf8');
  console.log(`  wrote ${slug}.md${audioPath ? ' + audio' : ''}`);
}));

console.log(`Done — ${tracks.length} tracks, ${downloaded} previews downloaded, ${skippedNoPreview} without preview.`);
