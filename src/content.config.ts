import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

const blog = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/blog' }),
  schema: z.object({
    title: z.string(),
    tag: z.string(),
    date: z.string(),
    readMin: z.number(),
    lang: z.enum(['fr', 'en', 'nl']),
    postSlug: z.string(),
    excerpt: z.string().optional(),
  }),
});

const music = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/music' }),
  schema: z.object({
    title: z.string(),
    artist: z.string(),
    duration: z.string(),
    bpm: z.number(),
    genre: z.string(),
    year: z.string(),
    color: z.string(),
    sortOrder: z.number(),
    spotifyUrl: z.string().optional(),
    spotifyTrackId: z.string().optional(),
    audioSrc: z.string(),                       // /audio/<slug>.mp3
    previewDuration: z.number().default(30),    // seconds — Spotify previews are 30s
  }),
});

const media = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/media' }),
  schema: z.object({
    type: z.enum(['video', 'image']),
    src: z.string(),                    // e.g. /media/clip-01.mp4
    poster: z.string().optional(),       // optional poster for videos
    title: z.string().optional(),
    kind: z.string(),                    // CLIP / SESSION / BTS / etc.
    aspect: z.string().default('9/16'),
    sortOrder: z.number(),
  }),
});

export const collections = { blog, music, media };
