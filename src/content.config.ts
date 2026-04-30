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

const portfolio = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/portfolio' }),
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

export const collections = { blog, portfolio, media };
