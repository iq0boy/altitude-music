# Altitude Music

The Altitude Music studio website — built with [Astro](https://astro.build) v6, React islands for interactive sections, and content collections for everything editable. Three locales (`fr`, `en`, `nl`) routed under `/fr/`, `/en/`, `/nl/`. Hosted on **Netlify**, deployed automatically on push to `main`. Content is editable without touching code through a git-based CMS at `/admin/`.

A high-level architecture overview lives in [`CLAUDE.md`](./CLAUDE.md).

---

## Quickstart

```bash
npm install
npm run dev          # localhost:4321
npm run build        # static build → ./dist/
npm run preview      # serve the build locally
npm run sync:music   # re-pull Spotify previews (see below)
```

Node ≥ 22.12 required.

---

## Editing content

There are two ways to edit content. Both end up as commits on `main`, which Netlify rebuilds.

- **CMS (no code)** — open `https://altitudemusic.be/admin/`, sign in with GitHub. Every save is a commit prefixed `cms:`. Setup and usage notes are in [`docs/cms-setup.md`](./docs/cms-setup.md).
- **Git** — edit the files under `src/content/` and `src/i18n/` directly and push.

Everything the CMS edits lives in `src/content/`. UI strings live in `src/i18n/`.

### 1. Blog posts (`src/content/blog/`)

One markdown file **per language per post**, named `<slug>.<lang>.md`. The `postSlug` in frontmatter must match across the three language files so they share the same URL.

```
src/content/blog/
  tips-mix-errors.fr.md
  tips-mix-errors.en.md
  tips-mix-errors.nl.md
```

Frontmatter:

```yaml
---
title: "5 erreurs de mix qu'on entend tout le temps"
tag: TIPS                       # TIPS | SESSION | GEAR | RELEASE
date: "2026-04-12"
readMin: 6                       # estimated read minutes
lang: fr                         # fr | en | nl
postSlug: tips-mix-errors        # shared across languages
excerpt: "De la sur-compression au manque de depth…"
---

# Markdown content goes here
```

Pages auto-generate at `/<lang>/blog/<postSlug>/`. In the CMS, each language is a separate entry sharing the same "Identifiant commun" (`postSlug`).

### 2. Music collection (`src/content/music/`)

The "Portfolio" section list. Each `.md` file represents one track. The audio files (30-second Spotify previews) live in `public/audio/` and are referenced via `audioSrc`.

**Don't edit these files by hand for routine sync** — instead:

```bash
npm run sync:music
```

This pulls the latest version of the Spotify playlist (ID hard-coded in `scripts/sync-music.mjs`), downloads each track's 30s preview MP3 into `public/audio/`, and rewrites every `.md` in `src/content/music/`. **Manual edits to BPM, genre, year, color will be overwritten** by the script — those fields are seeded with defaults. If you want to refine them, edit *after* syncing (or in the CMS).

To swap the playlist, change `PLAYLIST_ID` at the top of `scripts/sync-music.mjs`.

### 3. Media (videos & photos) (`src/content/media/`)

The grid in the "Vidéos" section on the homepage. Mix of locally-hosted videos and images. Each `.md` is one tile.

```yaml
---
type: video                        # "video" or "image"
src: "/media/clip-01.mp4"          # path under public/, OR an absolute URL
poster: "/media/clip-01.jpg"       # optional poster for video
title: "Optional caption"
kind: CLIP                         # any short label: CLIP / SESSION / BTS / REEL / ...
aspect: "9/16"                     # 9/16 reels, 1/1 square, 16/9 landscape, 4/5 portrait
sortOrder: 1
---
```

Drop the file into `public/media/` (use the same filename in `src`) and add a sibling markdown entry. The grid auto-fits whatever count of entries you have. See [`public/media/README.md`](./public/media/README.md) for naming/encoding tips. In the CMS, the **Assets** library uploads files to `public/media/` in bulk.

### 4. Services, prices, team, testimonials (`src/content/*.json`)

One JSON file per entry. Text fields are multilingual objects `{ "fr": …, "en": …, "nl": … }`.

| Folder | Contents |
|---|---|
| `src/content/services/` | Fixed set of 6 files (`rec`, `mix`, `cover`, `prod`, `coach`, `book`). Price, "popular" badge, name / unit / descriptions / includes in 3 languages, gallery colours, YouTube id. **Do not add or rename files** — the keys drive `#service/<key>` routing. |
| `src/content/team/` | Team members: name, Instagram handle, card colour, multilingual role. |
| `src/content/testimonials/` | Client testimonials: name, project, related service key, rating 1–5, multilingual quote. |

Pricing: set `price` to `0` for "free" (renders the unit label) or `-1` for "on request".

### 5. Site settings (`src/content/settings/site.json`)

Global visuals, editable in the CMS under **Réglages → Apparence**:

| Field | Effect |
|---|---|
| `heroVideo` | Looping video at the top of the homepage. Local upload (`/media/…`) or external URL. |
| `ogImage` | Social-share preview image (1200×630). |

An empty value falls back to the default hard-coded in `Hero.astro` / `BaseLayout.astro` (`/og-default.jpg`).

### 6. UI translations (`src/i18n/`)

All UI strings live in three sibling JSON files:

```
src/i18n/
  fr.json
  en.json
  nl.json
```

The shape is mirrored across all three. **When you add a new key, add it to all three files** — TypeScript will fail the build if you reference a key that's missing in any locale via `getTranslations()`. Service, team and testimonial copy is **not** here — see §4.

### 7. Theme / brand color

Edit `src/styles/global.css`:

```css
:root {
  --accent: #ffff00;        /* primary brand color */
  --secondary: #3206b8;     /* secondary brand */
  --bg: #0a0a0a;            /* dark background */
  ...
}
```

---

## Changing a content schema

Each collection is described in three places that must stay in sync:

1. `src/content.config.ts` — Zod schema (build-time validation).
2. `public/admin/config.yml` — CMS form fields.
3. `src/data/services.ts` — TypeScript interfaces for services / team / testimonials / settings.

---

## Deployment (Netlify)

- **Production branch**: `main`. Every push triggers a build + deploy.
- **Build command**: `npm run build` (set in `netlify.toml`).
- **Publish directory**: `dist/`.
- **Node version**: `22` (set in `netlify.toml`).
- **Preview deploys**: opened automatically for every pull request.

If a deploy fails, check the build log in the Netlify dashboard. The most common causes are:
- A content file with bad frontmatter / JSON (Zod schema validation errors).
- An `i18n` key referenced in a component but missing from one of the locale JSON files.
- A broken import after renaming a file.

Local `npm run build` reproduces the exact same error before pushing — run it before any large content commit.

---

## Project layout

```
public/
  admin/                    Sveltia CMS (index.html loader + config.yml)
  audio/                    auto-generated Spotify preview MP3s (committed)
  media/                    user-managed video/image assets (CMS uploads land here)
  fonts/                    self-hosted fonts (Satoshi, Clash Display)
  og-default.jpg            default social-share image
src/
  content.config.ts         collection schemas
  content/
    blog/                   markdown posts × 3 languages
    music/                  one .md per track (sync:music regenerates)
    media/                  one .md per video/image tile
    services/               6 JSON files, multilingual
    team/                   one JSON per member, multilingual
    testimonials/           one JSON per testimonial, multilingual
    settings/site.json      hero video + OG image
  i18n/                     fr.json / en.json / nl.json + utils.ts
  data/services.ts          service keys + TS interfaces (no data)
  components/               .astro (static) + .tsx (React islands)
  layouts/                  BaseLayout.astro (SEO, meta, fonts)
  pages/                    [lang]/index.astro, [lang]/blog/...
  styles/                   global.css (single source of truth)
scripts/
  sync-music.mjs            Spotify playlist → music collection sync
docs/
  cms-setup.md              CMS setup (GitHub OAuth + Netlify) and editor guide
netlify.toml                build config
astro.config.mjs            Astro config (i18n, sitemap, integrations)
```

---

## Common tasks

| Task | Steps |
|---|---|
| Publish a blog post | CMS: one entry per language with the same `postSlug` — or add 3 markdown files under `src/content/blog/`, push |
| Refresh the music section after updating the Spotify playlist | `npm run sync:music`, commit `src/content/music/` + `public/audio/`, push |
| Swap a video tile | Replace `public/media/<file>` (same filename) — no markdown change needed |
| Add a video tile | CMS → Médias, or drop file in `public/media/` + create `<n>.md` in `src/content/media/`, push |
| Adjust a price | CMS → Services & tarifs, or edit `price` in `src/content/services/<key>.json`, push |
| Add a testimonial | CMS → Témoignages, or add a JSON file in `src/content/testimonials/`, push |
| Change the hero video or share image | CMS → Réglages → Apparence, or edit `src/content/settings/site.json`, push |
| Translate UI text | Edit all three `src/i18n/*.json` files, push |
| Change the brand color | Edit `--accent` in `src/styles/global.css`, push |

---

## Tech stack

Astro 6, React 19, TypeScript, Astro Content Collections (glob loader). Sitemap and i18n routing via Astro's built-in integrations. No CSS framework — hand-written CSS with custom properties. Content lives in git and is edited through [Sveltia CMS](https://sveltiacms.app) (GitHub backend, Netlify OAuth).
