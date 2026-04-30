# Media assets

Drop video and image files for the homepage "Vidéos" section here. Each
file is referenced from a markdown entry in `src/content/media/`.

## Conventions

- **Videos**: MP4 (H.264 + AAC) — universally supported. WebM also works.
  Aim for ~5 MB max per clip; longer clips should live on Vimeo and you
  can re-introduce iframe embeds in the schema later.
- **Posters**: paired JPG/WebP for the `<video poster="…">` attribute.
  Same name as the video, different extension. Astro will serve them
  un-optimised from this folder.
- **Images**: JPG or WebP at 1080–1600 px on the longest edge for the
  current grid (cards are ~300–400 px wide).

## How to add a new entry

1. Drop the file in this folder, e.g. `public/media/session-02.mp4`.
2. Create a sibling poster, e.g. `public/media/session-02.jpg`.
3. Create `src/content/media/<n>.md` with frontmatter:

```yaml
---
type: video                 # or "image"
src: "/media/session-02.mp4"
poster: "/media/session-02.jpg"   # optional, only for type: video
title: "Optional caption"
kind: SESSION                # CLIP | SESSION | BTS | anything you want
aspect: "16/9"               # 9/16 reels, 1/1 square, 16/9 landscape
sortOrder: 5
---
```

The grid auto-fits to whatever count you have.
